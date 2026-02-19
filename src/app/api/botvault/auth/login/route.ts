import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { ulid } from 'ulid';
import { getDb, initializeDatabase } from '@/lib/botvault/db';
import { createSessionToken, setSessionCookie } from '@/lib/botvault/auth';

export async function POST(req: NextRequest) {
  try {
    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      return NextResponse.json({ error: 'Email/username and password are required' }, { status: 400 });
    }

    await initializeDatabase();
    const db = getDb();

    const result = await db.execute({
      sql: 'SELECT id, username, email, password_hash FROM users WHERE email = ? OR username = ?',
      args: [identifier.toLowerCase(), identifier.toLowerCase()],
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash as string);

    if (!validPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    await db.execute({
      sql: 'INSERT INTO audit_log (id, user_id, action, target_type, target_id, metadata) VALUES (?, ?, ?, ?, ?, ?)',
      args: [ulid(), user.id as string, 'user.login', 'user', user.id as string, JSON.stringify({ ip: req.headers.get('x-forwarded-for') || 'unknown' })],
    });

    const token = await createSessionToken({
      userId: user.id as string,
      username: user.username as string,
      email: user.email as string,
    });
    await setSessionCookie(token);

    return NextResponse.json({ success: true, user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
