import { NextRequest, NextResponse } from 'next/server';
import { randomBytes, createHash } from 'crypto';
import { ulid } from 'ulid';
import { getDb, initializeDatabase } from '@/lib/botvault/db';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

    await initializeDatabase();
    const db = getDb();

    const result = await db.execute({
      sql: 'SELECT id FROM users WHERE email = ?',
      args: [email.toLowerCase()],
    });

    // Always return success to prevent email enumeration
    if (result.rows.length === 0) {
      return NextResponse.json({ success: true, message: 'If an account exists, a recovery link has been sent.' });
    }

    const userId = result.rows[0].id as string;
    const token = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

    await db.execute({
      sql: 'INSERT INTO recovery_tokens (id, user_id, token_hash, expires_at) VALUES (?, ?, ?, ?)',
      args: [ulid(), userId, tokenHash, expiresAt],
    });

    await db.execute({
      sql: 'INSERT INTO audit_log (id, user_id, action, target_type, target_id, metadata) VALUES (?, ?, ?, ?, ?, ?)',
      args: [ulid(), userId, 'user.recovery_requested', 'user', userId, JSON.stringify({ ip: req.headers.get('x-forwarded-for') || 'unknown' })],
    });

    // MVP: return token directly (email sending comes later)
    return NextResponse.json({ success: true, message: 'If an account exists, a recovery link has been sent.', token });
  } catch (error) {
    console.error('Recovery error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
