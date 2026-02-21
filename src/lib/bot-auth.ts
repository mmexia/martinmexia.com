import { jwtVerify } from 'jose';
import { createHash } from 'node:crypto';
import { getDb, initializeDatabase } from '@/lib/db';
import { NextRequest } from 'next/server';

const BOT_JWT_SECRET = new TextEncoder().encode(
  process.env.BOTVAULT_JWT_SECRET || 'dev-secret-change-in-production'
);

export interface BotAuthResult {
  bot_id: string;
  user_id: string;
  token_id: string;
}

// Simple in-memory rate limiter: 60 req/min per token hash
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(tokenHash: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const bucket = rateBuckets.get(tokenHash);

  if (!bucket || now >= bucket.resetAt) {
    rateBuckets.set(tokenHash, { count: 1, resetAt: now + 60_000 });
    return { allowed: true };
  }

  if (bucket.count >= 60) {
    const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }

  bucket.count++;
  return { allowed: true };
}

export async function verifyBotToken(req: NextRequest): Promise<BotAuthResult | { error: string; status: number }> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: 'Missing or invalid Authorization header', status: 401 };
  }

  const token = authHeader.slice(7);

  // Verify JWT
  let payload: { bot_id?: string; user_id?: string; jti?: string };
  try {
    const result = await jwtVerify(token, BOT_JWT_SECRET);
    payload = result.payload as typeof payload;
  } catch {
    return { error: 'Invalid or expired token', status: 401 };
  }

  if (!payload.bot_id || !payload.user_id) {
    return { error: 'Invalid token payload', status: 401 };
  }

  const tokenHash = createHash('sha256').update(token).digest('hex');

  // Rate limit check
  const rateCheck = checkRateLimit(tokenHash);
  if (!rateCheck.allowed) {
    return { error: `Rate limit exceeded. Retry after ${rateCheck.retryAfter} seconds`, status: 429 };
  }

  await initializeDatabase();
  const db = getDb();

  // Check token exists and not revoked
  const tokenRow = await db.execute({
    sql: `SELECT id, bot_id, expires_at FROM bot_tokens WHERE token_hash = ?`,
    args: [tokenHash],
  });

  if (tokenRow.rows.length === 0) {
    return { error: 'Token not found or revoked', status: 401 };
  }

  const row = tokenRow.rows[0];
  const expiresAt = new Date(row.expires_at as string);
  if (expiresAt < new Date()) {
    return { error: 'Token expired', status: 401 };
  }

  // Check bot is active
  const botRow = await db.execute({
    sql: `SELECT id, is_active FROM bots WHERE id = ? AND user_id = ?`,
    args: [payload.bot_id, payload.user_id],
  });

  if (botRow.rows.length === 0) {
    return { error: 'Bot not found', status: 401 };
  }

  if (!botRow.rows[0].is_active) {
    return { error: 'Bot is deactivated', status: 401 };
  }

  return {
    bot_id: payload.bot_id,
    user_id: payload.user_id,
    token_id: row.id as string,
  };
}
