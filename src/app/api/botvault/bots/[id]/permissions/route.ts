import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/botvault/auth';
import { getDb, initializeDatabase } from '@/lib/botvault/db';
import { randomUUID } from 'node:crypto';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { id: botId } = await params;
  const body = await req.json();
  const { credentials } = body;

  if (!Array.isArray(credentials)) {
    return NextResponse.json({ error: 'credentials must be an array' }, { status: 400 });
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

  // Verify all credential_ids belong to user
  for (const c of credentials) {
    if (!c.credential_id || !c.level) {
      return NextResponse.json({ error: 'Each credential must have credential_id and level' }, { status: 400 });
    }
    const cred = await db.execute({
      sql: 'SELECT id FROM credentials WHERE id = ? AND user_id = ?',
      args: [c.credential_id, session.userId],
    });
    if (cred.rows.length === 0) {
      return NextResponse.json({ error: `Credential ${c.credential_id} not found` }, { status: 404 });
    }
  }

  // Replace all permissions for this bot
  await db.execute({ sql: 'DELETE FROM permissions WHERE bot_id = ?', args: [botId] });

  for (const c of credentials) {
    await db.execute({
      sql: 'INSERT INTO permissions (id, bot_id, credential_id, level) VALUES (?, ?, ?, ?)',
      args: [randomUUID(), botId, c.credential_id, c.level],
    });
  }

  await db.execute({
    sql: `INSERT INTO audit_log (id, user_id, action, target_type, target_id, metadata) VALUES (?, ?, ?, ?, ?, ?)`,
    args: [randomUUID(), session.userId, 'bot.permissions.update', 'bot', botId, JSON.stringify({ credential_count: credentials.length })],
  });

  return NextResponse.json({ success: true });
}
