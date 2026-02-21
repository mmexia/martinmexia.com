import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { getDb, initializeDatabase } from '@/lib/db';

const PAGE_SIZE = 50;

export async function GET(req: NextRequest) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const url = req.nextUrl.searchParams;
  const page = Math.max(1, parseInt(url.get('page') || '1', 10));
  const action = url.get('action');
  const actor = url.get('actor');
  const dateFrom = url.get('dateFrom');
  const dateTo = url.get('dateTo');

  await initializeDatabase();
  const db = getDb();

  let where = 'WHERE a.user_id = ?';
  const args: (string | number)[] = [session.userId];

  if (action) {
    where += ' AND a.action = ?';
    args.push(action);
  }
  if (actor) {
    where += ' AND (u.username LIKE ? OR b.name LIKE ?)';
    args.push(`%${actor}%`, `%${actor}%`);
  }
  if (dateFrom) {
    where += ' AND a.created_at >= ?';
    args.push(dateFrom);
  }
  if (dateTo) {
    where += ' AND a.created_at <= ?';
    args.push(dateTo + ' 23:59:59');
  }

  // Count total
  const countResult = await db.execute({
    sql: `SELECT COUNT(*) as total FROM audit_log a
          LEFT JOIN users u ON a.user_id = u.id
          LEFT JOIN bots b ON a.bot_id = b.id
          ${where}`,
    args,
  });
  const total = Number(countResult.rows[0].total);

  // Fetch page
  const offset = (page - 1) * PAGE_SIZE;
  const result = await db.execute({
    sql: `SELECT a.id, a.user_id, a.bot_id, a.action, a.target_type, a.target_id, a.metadata, a.created_at,
                 u.username, b.name as bot_name
          FROM audit_log a
          LEFT JOIN users u ON a.user_id = u.id
          LEFT JOIN bots b ON a.bot_id = b.id
          ${where}
          ORDER BY a.created_at DESC
          LIMIT ? OFFSET ?`,
    args: [...args, PAGE_SIZE, offset],
  });

  return NextResponse.json({
    entries: result.rows,
    page,
    totalPages: Math.ceil(total / PAGE_SIZE),
    total,
  });
}
