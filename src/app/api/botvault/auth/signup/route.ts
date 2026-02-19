import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { ulid } from 'ulid';
import { getDb, initializeDatabase } from '@/lib/botvault/db';
import { createSessionToken, setSessionCookie } from '@/lib/botvault/auth';
import { validateEmail, validatePassword, validateUsername } from '@/lib/botvault/validate';

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const usernameCheck = validateUsername(username);
    if (!usernameCheck.valid) return NextResponse.json({ error: usernameCheck.message }, { status: 400 });

    if (!validateEmail(email)) return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) return NextResponse.json({ error: passwordCheck.message }, { status: 400 });

    await initializeDatabase();
    const db = getDb();

    // Check uniqueness
    const existing = await db.execute({
      sql: 'SELECT id FROM users WHERE email = ? OR username = ?',
      args: [email.toLowerCase(), username.toLowerCase()],
    });

    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'Username or email already taken' }, { status: 409 });
    }

    const id = ulid();
    const passwordHash = await bcrypt.hash(password, 12);

    await db.execute({
      sql: 'INSERT INTO users (id, username, email, password_hash) VALUES (?, ?, ?, ?)',
      args: [id, username.toLowerCase(), email.toLowerCase(), passwordHash],
    });

    // Audit log
    await db.execute({
      sql: 'INSERT INTO audit_log (id, user_id, action, target_type, target_id, metadata) VALUES (?, ?, ?, ?, ?, ?)',
      args: [ulid(), id, 'user.signup', 'user', id, JSON.stringify({ ip: req.headers.get('x-forwarded-for') || 'unknown' })],
    });

    const token = await createSessionToken({ userId: id, username: username.toLowerCase(), email: email.toLowerCase() });
    await setSessionCookie(token);

    return NextResponse.json({ success: true, user: { id, username: username.toLowerCase(), email: email.toLowerCase() } });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
