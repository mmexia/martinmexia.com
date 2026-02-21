import { NextRequest, NextResponse } from 'next/server';
import { randomBytes, createHash } from 'crypto';
import { ulid } from 'ulid';
import { getDb, initializeDatabase } from '@/lib/db';

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

    if (result.rows.length === 0) {
      return NextResponse.json({ success: true, message: 'If an account exists, a magic link has been sent.' });
    }

    const userId = result.rows[0].id as string;
    const token = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 min

    await db.execute({
      sql: 'INSERT INTO magic_links (id, user_id, token_hash, expires_at) VALUES (?, ?, ?, ?)',
      args: [ulid(), userId, tokenHash, expiresAt],
    });

    return NextResponse.json({ success: true, message: 'If an account exists, a magic link has been sent.', token });
  } catch (error) {
    console.error('Magic link error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
