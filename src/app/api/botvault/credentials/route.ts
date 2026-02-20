import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/botvault/auth';
import { getDb, initializeDatabase } from '@/lib/botvault/db';
import { encryptCredential } from '@/lib/botvault/encryption';
import { randomUUID } from 'node:crypto';

const VALID_TYPES = ['API Key', 'Secret', 'Token', 'OAuth', 'Custom'];

export async function GET() {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  await initializeDatabase();
  const db = getDb();
  const result = await db.execute({
    sql: 'SELECT id, label, type, created_at FROM credentials WHERE user_id = ? ORDER BY created_at DESC',
    args: [session.userId],
  });

  return NextResponse.json({ credentials: result.rows });
}

export async function POST(req: NextRequest) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const body = await req.json();
  const { label, type, value } = body;

  if (!label || !type || !value) {
    return NextResponse.json({ error: 'label, type, and value are required' }, { status: 400 });
  }
  if (!VALID_TYPES.includes(type)) {
    return NextResponse.json({ error: `Invalid type. Must be one of: ${VALID_TYPES.join(', ')}` }, { status: 400 });
  }

  await initializeDatabase();
  const db = getDb();
  const id = randomUUID();
  const { encrypted_data, encrypted_dek, iv, auth_tag } = await encryptCredential(session.userId, value);

  await db.execute({
    sql: `INSERT INTO credentials (id, user_id, type, label, encrypted_data, encrypted_dek, iv, auth_tag)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [id, session.userId, type, label, encrypted_data, encrypted_dek, iv, auth_tag],
  });

  // Audit log
  await db.execute({
    sql: `INSERT INTO audit_log (id, user_id, action, target_type, target_id, metadata)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [randomUUID(), session.userId, 'credential.create', 'credential', id, JSON.stringify({ label, type })],
  });

  return NextResponse.json({ id, label, type }, { status: 201 });
}
