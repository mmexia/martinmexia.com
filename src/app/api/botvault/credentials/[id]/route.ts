import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/botvault/auth';
import { getDb, initializeDatabase } from '@/lib/botvault/db';
import { encryptCredential, decryptCredential } from '@/lib/botvault/encryption';
import { randomUUID } from 'node:crypto';

const VALID_TYPES = ['API Key', 'Secret', 'Token', 'OAuth', 'Custom'];

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { id } = await params;
  await initializeDatabase();
  const db = getDb();
  const result = await db.execute({
    sql: 'SELECT * FROM credentials WHERE id = ? AND user_id = ?',
    args: [id, session.userId],
  });

  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'Credential not found' }, { status: 404 });
  }

  const row = result.rows[0];
  const value = await decryptCredential(
    session.userId,
    row.encrypted_data as string,
    row.encrypted_dek as string,
    row.iv as string,
    row.auth_tag as string
  );

  // Audit log
  await db.execute({
    sql: `INSERT INTO audit_log (id, user_id, action, target_type, target_id) VALUES (?, ?, ?, ?, ?)`,
    args: [randomUUID(), session.userId, 'credential.read', 'credential', id],
  });

  return NextResponse.json({
    id: row.id,
    label: row.label,
    type: row.type,
    value,
    created_at: row.created_at,
    updated_at: row.updated_at,
  });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { label, type, value } = body;

  await initializeDatabase();
  const db = getDb();

  // Verify ownership
  const existing = await db.execute({
    sql: 'SELECT id FROM credentials WHERE id = ? AND user_id = ?',
    args: [id, session.userId],
  });
  if (existing.rows.length === 0) {
    return NextResponse.json({ error: 'Credential not found' }, { status: 404 });
  }

  if (type && !VALID_TYPES.includes(type)) {
    return NextResponse.json({ error: `Invalid type. Must be one of: ${VALID_TYPES.join(', ')}` }, { status: 400 });
  }

  // If value changed, re-encrypt
  if (value) {
    const { encrypted_data, encrypted_dek, iv, auth_tag } = await encryptCredential(session.userId, value);
    await db.execute({
      sql: `UPDATE credentials SET label = COALESCE(?, label), type = COALESCE(?, type),
            encrypted_data = ?, encrypted_dek = ?, iv = ?, auth_tag = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ? AND user_id = ?`,
      args: [label || null, type || null, encrypted_data, encrypted_dek, iv, auth_tag, id, session.userId],
    });
  } else {
    await db.execute({
      sql: `UPDATE credentials SET label = COALESCE(?, label), type = COALESCE(?, type), updated_at = CURRENT_TIMESTAMP
            WHERE id = ? AND user_id = ?`,
      args: [label || null, type || null, id, session.userId],
    });
  }

  // Audit log
  await db.execute({
    sql: `INSERT INTO audit_log (id, user_id, action, target_type, target_id, metadata) VALUES (?, ?, ?, ?, ?, ?)`,
    args: [randomUUID(), session.userId, 'credential.update', 'credential', id, JSON.stringify({ label, type, value_changed: !!value })],
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
    sql: 'SELECT id, label, type FROM credentials WHERE id = ? AND user_id = ?',
    args: [id, session.userId],
  });
  if (existing.rows.length === 0) {
    return NextResponse.json({ error: 'Credential not found' }, { status: 404 });
  }

  await db.execute({ sql: 'DELETE FROM credentials WHERE id = ? AND user_id = ?', args: [id, session.userId] });

  // Audit log
  const row = existing.rows[0];
  await db.execute({
    sql: `INSERT INTO audit_log (id, user_id, action, target_type, target_id, metadata) VALUES (?, ?, ?, ?, ?, ?)`,
    args: [randomUUID(), session.userId, 'credential.delete', 'credential', id, JSON.stringify({ label: row.label, type: row.type })],
  });

  return NextResponse.json({ success: true });
}
