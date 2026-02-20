import { NextResponse } from 'next/server';
import { verifySession, clearSessionCookie } from '@/lib/botvault/auth';
import { getDb, initializeDatabase } from '@/lib/botvault/db';

export async function DELETE() {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  await initializeDatabase();
  const db = getDb();
  const uid = session.userId;

  // Cascade delete in order
  await db.execute({ sql: 'DELETE FROM audit_log WHERE user_id = ?', args: [uid] });
  await db.execute({ sql: 'DELETE FROM bot_tokens WHERE bot_id IN (SELECT id FROM bots WHERE user_id = ?)', args: [uid] });
  await db.execute({ sql: 'DELETE FROM permissions WHERE bot_id IN (SELECT id FROM bots WHERE user_id = ?)', args: [uid] });
  await db.execute({ sql: 'DELETE FROM bots WHERE user_id = ?', args: [uid] });
  await db.execute({ sql: 'DELETE FROM credentials WHERE user_id = ?', args: [uid] });
  await db.execute({ sql: 'DELETE FROM magic_links WHERE user_id = ?', args: [uid] });
  await db.execute({ sql: 'DELETE FROM recovery_tokens WHERE user_id = ?', args: [uid] });
  await db.execute({ sql: 'DELETE FROM passkeys WHERE user_id = ?', args: [uid] });
  await db.execute({ sql: 'DELETE FROM users WHERE id = ?', args: [uid] });

  await clearSessionCookie();
  return NextResponse.json({ success: true });
}
