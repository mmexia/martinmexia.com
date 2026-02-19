import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { ulid } from 'ulid';
import { getDb, initializeDatabase } from '@/lib/botvault/db';
import { createSessionToken, setSessionCookie } from '@/lib/botvault/auth';

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (!token) return NextResponse.json({ error: 'Token is required' }, { status: 400 });

    await initializeDatabase();
    const db = getDb();

    const tokenHash = createHash('sha256').update(token).digest('hex');
    const result = await db.execute({
      sql: `SELECT ml.id, ml.user_id, u.username, u.email 
            FROM magic_links ml JOIN users u ON ml.user_id = u.id 
            WHERE ml.token_hash = ? AND ml.used = 0 AND ml.expires_at > datetime('now')`,
      args: [tokenHash],
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    const row = result.rows[0];
    await db.execute({ sql: 'UPDATE magic_links SET used = 1 WHERE id = ?', args: [row.id as string] });

    await db.execute({
      sql: 'INSERT INTO audit_log (id, user_id, action, target_type, target_id, metadata) VALUES (?, ?, ?, ?, ?, ?)',
      args: [ulid(), row.user_id as string, 'user.magic_link_login', 'user', row.user_id as string, JSON.stringify({ ip: req.headers.get('x-forwarded-for') || 'unknown' })],
    });

    const sessionToken = await createSessionToken({
      userId: row.user_id as string,
      username: row.username as string,
      email: row.email as string,
    });
    await setSessionCookie(sessionToken);

    return NextResponse.json({ success: true, user: { id: row.user_id, username: row.username, email: row.email } });
  } catch (error) {
    console.error('Magic link verify error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
