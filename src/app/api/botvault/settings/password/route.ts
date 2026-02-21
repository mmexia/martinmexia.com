import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { verifySession } from '@/lib/auth';
import { getDb, initializeDatabase } from '@/lib/db';
import { randomUUID } from 'node:crypto';

export async function PUT(req: NextRequest) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: 'Current and new password are required' }, { status: 400 });
  }
  if (newPassword.length < 8) {
    return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 });
  }

  await initializeDatabase();
  const db = getDb();

  const result = await db.execute({
    sql: 'SELECT password_hash FROM users WHERE id = ?',
    args: [session.userId],
  });
  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const valid = await bcrypt.compare(currentPassword, result.rows[0].password_hash as string);
  if (!valid) {
    return NextResponse.json({ error: 'Current password is incorrect' }, { status: 403 });
  }

  const newHash = await bcrypt.hash(newPassword, 12);
  await db.execute({
    sql: 'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    args: [newHash, session.userId],
  });

  await db.execute({
    sql: 'INSERT INTO audit_log (id, user_id, action, target_type, target_id, metadata) VALUES (?, ?, ?, ?, ?, ?)',
    args: [randomUUID(), session.userId, 'user.password_change', 'user', session.userId, '{}'],
  });

  return NextResponse.json({ success: true });
}
