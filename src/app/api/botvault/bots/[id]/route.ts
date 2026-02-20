import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/botvault/auth';
import { getDb, initializeDatabase } from '@/lib/botvault/db';
import { randomUUID } from 'node:crypto';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { id } = await params;
  await initializeDatabase();
  const db = getDb();

  const botResult = await db.execute({
    sql: 'SELECT id, name, description, is_active, created_at FROM bots WHERE id = ? AND user_id = ?',
    args: [id, session.userId],
  });
  if (botResult.rows.length === 0) {
    return NextResponse.json({ error: 'Bot not found' }, { status: 404 });
  }

  const permissions = await db.execute({
    sql: `SELECT p.id, p.credential_id, p.level, p.granted_at, c.label, c.type
          FROM permissions p JOIN credentials c ON p.credential_id = c.id
          WHERE p.bot_id = ?`,
    args: [id],
  });

  const tokens = await db.execute({
    sql: `SELECT id, token_hash, expires_at, created_at FROM bot_tokens WHERE bot_id = ? ORDER BY created_at DESC`,
    args: [id],
  });

  return NextResponse.json({
    bot: botResult.rows[0],
    permissions: permissions.rows,
    tokens: tokens.rows.map(t => ({
      id: t.id,
      truncated_hash: (t.token_hash as string).substring(0, 12) + '...',
      expires_at: t.expires_at,
      created_at: t.created_at,
    })),
  });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { name, description, is_active } = body;

  await initializeDatabase();
  const db = getDb();

  const existing = await db.execute({
    sql: 'SELECT id FROM bots WHERE id = ? AND user_id = ?',
    args: [id, session.userId],
  });
  if (existing.rows.length === 0) {
    return NextResponse.json({ error: 'Bot not found' }, { status: 404 });
  }

  await db.execute({
    sql: `UPDATE bots SET name = COALESCE(?, name), description = COALESCE(?, description),
          is_active = COALESCE(?, is_active) WHERE id = ? AND user_id = ?`,
    args: [name || null, description !== undefined ? description : null, is_active !== undefined ? (is_active ? 1 : 0) : null, id, session.userId],
  });

  await db.execute({
    sql: `INSERT INTO audit_log (id, user_id, action, target_type, target_id, metadata) VALUES (?, ?, ?, ?, ?, ?)`,
    args: [randomUUID(), session.userId, 'bot.update', 'bot', id, JSON.stringify({ name, description, is_active })],
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { id } = await params;
  await initializeDatabase();
  const db = getDb();

  const existing = await db.execute({
    sql: 'SELECT id, name FROM bots WHERE id = ? AND user_id = ?',
    args: [id, session.userId],
  });
  if (existing.rows.length === 0) {
    return NextResponse.json({ error: 'Bot not found' }, { status: 404 });
  }

  // Cascade delete
  await db.execute({ sql: 'DELETE FROM bot_tokens WHERE bot_id = ?', args: [id] });
  await db.execute({ sql: 'DELETE FROM permissions WHERE bot_id = ?', args: [id] });
  await db.execute({ sql: 'DELETE FROM bots WHERE id = ? AND user_id = ?', args: [id, session.userId] });

  await db.execute({
    sql: `INSERT INTO audit_log (id, user_id, action, target_type, target_id, metadata) VALUES (?, ?, ?, ?, ?, ?)`,
    args: [randomUUID(), session.userId, 'bot.delete', 'bot', id, JSON.stringify({ name: existing.rows[0].name })],
  });

  return NextResponse.json({ success: true });
}
