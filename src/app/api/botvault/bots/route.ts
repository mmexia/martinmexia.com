import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { getDb, initializeDatabase } from '@/lib/db';
import { randomUUID, randomBytes, createHash } from 'node:crypto';

export async function GET() {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  await initializeDatabase();
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT b.id, b.name, b.description, b.is_active, b.created_at,
            (SELECT COUNT(*) FROM permissions WHERE bot_id = b.id) as permission_count
          FROM bots b WHERE b.user_id = ? ORDER BY b.created_at DESC`,
    args: [session.userId],
  });

  return NextResponse.json({ bots: result.rows });
}

export async function POST(req: NextRequest) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const body = await req.json();
  const { name, description } = body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  await initializeDatabase();
  const db = getDb();
  const id = randomUUID();

  // Generate random secret and hash it
  const secret = `bv_${randomBytes(32).toString('hex')}`;
  const secretHash = createHash('sha256').update(secret).digest('hex');

  await db.execute({
    sql: `INSERT INTO bots (id, user_id, name, description, secret_hash) VALUES (?, ?, ?, ?, ?)`,
    args: [id, session.userId, name.trim(), description?.trim() || null, secretHash],
  });

  // Audit log
  await db.execute({
    sql: `INSERT INTO audit_log (id, user_id, action, target_type, target_id, metadata) VALUES (?, ?, ?, ?, ?, ?)`,
    args: [randomUUID(), session.userId, 'bot.create', 'bot', id, JSON.stringify({ name: name.trim() })],
  });

  return NextResponse.json({ id, name: name.trim(), description: description?.trim() || null, secret }, { status: 201 });
}
