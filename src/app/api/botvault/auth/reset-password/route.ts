import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import bcrypt from 'bcryptjs';
import { ulid } from 'ulid';
import { getDb, initializeDatabase } from '@/lib/botvault/db';
import { validatePassword } from '@/lib/botvault/validate';

export async function POST(req: NextRequest) {
  try {
    const { token, newPassword } = await req.json();
    if (!token || !newPassword) return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });

    const passwordCheck = validatePassword(newPassword);
    if (!passwordCheck.valid) return NextResponse.json({ error: passwordCheck.message }, { status: 400 });

    await initializeDatabase();
    const db = getDb();

    const tokenHash = createHash('sha256').update(token).digest('hex');
    const result = await db.execute({
      sql: 'SELECT id, user_id FROM recovery_tokens WHERE token_hash = ? AND used = 0 AND expires_at > datetime(\'now\')',
      args: [tokenHash],
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    const row = result.rows[0];
    const tokenId = row.id as string;
    const userId = row.user_id as string;
    const passwordHash = await bcrypt.hash(newPassword, 12);

    await db.execute({ sql: 'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', args: [passwordHash, userId] });
    await db.execute({ sql: 'UPDATE recovery_tokens SET used = 1 WHERE id = ?', args: [tokenId] });

    await db.execute({
      sql: 'INSERT INTO audit_log (id, user_id, action, target_type, target_id, metadata) VALUES (?, ?, ?, ?, ?, ?)',
      args: [ulid(), userId, 'user.password_reset', 'user', userId, JSON.stringify({ ip: req.headers.get('x-forwarded-for') || 'unknown' })],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
