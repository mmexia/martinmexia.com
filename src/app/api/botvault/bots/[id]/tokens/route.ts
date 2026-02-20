import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/botvault/auth';
import { getDb, initializeDatabase } from '@/lib/botvault/db';
import { randomUUID, createHash } from 'node:crypto';
import { SignJWT } from 'jose';

const BOT_JWT_SECRET = new TextEncoder().encode(
  process.env.BOTVAULT_JWT_SECRET || 'dev-secret-change-in-production'
);

const TTL_MAP: Record<string, number | null> = {
  '30d': 30 * 24 * 60 * 60,
  '90d': 90 * 24 * 60 * 60,
  '1y': 365 * 24 * 60 * 60,
  'never': null,
};

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { id: botId } = await params;
  const body = await req.json();
  const { ttl } = body;

  if (!ttl || !(ttl in TTL_MAP)) {
    return NextResponse.json({ error: 'Invalid ttl. Must be one of: 30d, 90d, 1y, never' }, { status: 400 });
  }

  await initializeDatabase();
  const db = getDb();

  // Verify bot ownership
  const bot = await db.execute({
    sql: 'SELECT id FROM bots WHERE id = ? AND user_id = ?',
    args: [botId, session.userId],
  });
  if (bot.rows.length === 0) {
    return NextResponse.json({ error: 'Bot not found' }, { status: 404 });
  }

  const ttlSeconds = TTL_MAP[ttl];
  const expiresAt = ttlSeconds
    ? new Date(Date.now() + ttlSeconds * 1000).toISOString()
    : '9999-12-31T23:59:59.000Z';

  const builder = new SignJWT({ bot_id: botId, user_id: session.userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setJti(randomUUID());

  if (ttlSeconds) {
    builder.setExpirationTime(`${ttlSeconds}s`);
  }

  const token = await builder.sign(BOT_JWT_SECRET);
  const tokenHash = createHash('sha256').update(token).digest('hex');
  const tokenId = randomUUID();

  await db.execute({
    sql: `INSERT INTO bot_tokens (id, bot_id, credential_id, token_hash, permission, expires_at) VALUES (?, ?, ?, ?, ?, ?)`,
    args: [tokenId, botId, '', tokenHash, 'all', expiresAt],
  });

  await db.execute({
    sql: `INSERT INTO audit_log (id, user_id, action, target_type, target_id, metadata) VALUES (?, ?, ?, ?, ?, ?)`,
    args: [randomUUID(), session.userId, 'bot.token.create', 'bot', botId, JSON.stringify({ ttl, token_id: tokenId })],
  });

  return NextResponse.json({ id: tokenId, token, expires_at: expiresAt }, { status: 201 });
}
