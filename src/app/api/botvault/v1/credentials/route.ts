import { NextRequest, NextResponse } from 'next/server';
import { verifyBotToken } from '@/lib/botvault/bot-auth';
import { getDb, initializeDatabase } from '@/lib/botvault/db';
import { randomUUID } from 'node:crypto';

export async function GET(req: NextRequest) {
  const auth = await verifyBotToken(req);
  if ('error' in auth) {
    const headers: Record<string, string> = {};
    if (auth.status === 429) {
      const match = auth.error.match(/(\d+) seconds/);
      if (match) headers['Retry-After'] = match[1];
    }
    return NextResponse.json({ error: auth.error }, { status: auth.status, headers });
  }

  await initializeDatabase();
  const db = getDb();

  // Get credentials this bot has permission to access
  const rows = await db.execute({
    sql: `SELECT c.id, c.label, c.type FROM credentials c
          INNER JOIN permissions p ON p.credential_id = c.id
          WHERE p.bot_id = ? AND c.user_id = ?`,
    args: [auth.bot_id, auth.user_id],
  });

  // Log access
  await db.execute({
    sql: `INSERT INTO audit_log (id, user_id, bot_id, action, target_type, target_id, metadata) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [randomUUID(), auth.user_id, auth.bot_id, 'bot_credential_list', 'credentials', null, null],
  });

  return NextResponse.json({
    credentials: rows.rows.map((r) => ({ id: r.id, label: r.label, type: r.type })),
  });
}
