import { NextRequest, NextResponse } from 'next/server';
import { verifySession, createSessionToken, setSessionCookie } from '@/lib/botvault/auth';
import { getDb, initializeDatabase } from '@/lib/botvault/db';
import { randomUUID } from 'node:crypto';

export async function PUT(req: NextRequest) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { username, email } = await req.json();
  if (!username || !email) {
    return NextResponse.json({ error: 'Username and email are required' }, { status: 400 });
  }

  await initializeDatabase();
  const db = getDb();

  // Check uniqueness
  const existing = await db.execute({
    sql: 'SELECT id FROM users WHERE (email = ? OR username = ?) AND id != ?',
    args: [email.toLowerCase(), username.toLowerCase(), session.userId],
  });
  if (existing.rows.length > 0) {
    return NextResponse.json({ error: 'Username or email already taken' }, { status: 409 });
  }

  await db.execute({
    sql: 'UPDATE users SET username = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    args: [username.toLowerCase(), email.toLowerCase(), session.userId],
  });

  await db.execute({
    sql: 'INSERT INTO audit_log (id, user_id, action, target_type, target_id, metadata) VALUES (?, ?, ?, ?, ?, ?)',
    args: [randomUUID(), session.userId, 'user.profile_update', 'user', session.userId, JSON.stringify({ username, email })],
  });

  // Refresh session token with new info
  const token = await createSessionToken({ userId: session.userId, username: username.toLowerCase(), email: email.toLowerCase() });
  await setSessionCookie(token);

  return NextResponse.json({ success: true });
}
