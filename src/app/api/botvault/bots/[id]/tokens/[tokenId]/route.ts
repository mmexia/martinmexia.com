import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { getDb, initializeDatabase } from '@/lib/db';
import { randomUUID } from 'node:crypto';

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string; tokenId: string }> }) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { id: botId, tokenId } = await params;
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

  const token = await db.execute({
    sql: 'SELECT id FROM bot_tokens WHERE id = ? AND bot_id = ?',
    args: [tokenId, botId],
  });
  if (token.rows.length === 0) {
    return NextResponse.json({ error: 'Token not found' }, { status: 404 });
  }

  await db.execute({ sql: 'DELETE FROM bot_tokens WHERE id = ?', args: [tokenId] });

  await db.execute({
    sql: `INSERT INTO audit_log (id, user_id, action, target_type, target_id, metadata) VALUES (?, ?, ?, ?, ?, ?)`,
    args: [randomUUID(), session.userId, 'bot.token.revoke', 'bot', botId, JSON.stringify({ token_id: tokenId })],
  });

  return NextResponse.json({ success: true });
}
