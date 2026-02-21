import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { getDb, initializeDatabase } from '@/lib/db';
import { encryptCredential, decryptCredential } from '@/lib/encryption';
import { randomUUID } from 'node:crypto';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { id } = await params;
  await initializeDatabase();
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT * FROM credentials WHERE id = ? AND user_id = ? AND type = 'card'`,
    args: [id, session.userId],
  });

  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'Card not found' }, { status: 404 });
  }

  const row = result.rows[0];
  const decrypted = await decryptCredential(
    session.userId,
    row.encrypted_data as string,
    row.encrypted_dek as string,
    row.iv as string,
    row.auth_tag as string
  );
  const data = JSON.parse(decrypted);

  await db.execute({
    sql: `INSERT INTO audit_log (id, user_id, action, target_type, target_id) VALUES (?, ?, ?, ?, ?)`,
    args: [randomUUID(), session.userId, 'card.read', 'card', id],
  });

  return NextResponse.json({
    id: row.id,
    label: row.label,
    cardholder_name: data.cardholder_name,
    card_number: data.card_number,
    expiry_month: data.expiry_month,
    expiry_year: data.expiry_year,
    cvv: data.cvv,
    created_at: row.created_at,
    updated_at: row.updated_at,
  });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { label, cardholder_name, card_number, expiry_month, expiry_year, cvv } = body;

  await initializeDatabase();
  const db = getDb();

  const existing = await db.execute({
    sql: `SELECT * FROM credentials WHERE id = ? AND user_id = ? AND type = 'card'`,
    args: [id, session.userId],
  });
  if (existing.rows.length === 0) {
    return NextResponse.json({ error: 'Card not found' }, { status: 404 });
  }

  const row = existing.rows[0];
  const oldDecrypted = await decryptCredential(
    session.userId,
    row.encrypted_data as string,
    row.encrypted_dek as string,
    row.iv as string,
    row.auth_tag as string
  );
  const oldData = JSON.parse(oldDecrypted);

  const newData = {
    cardholder_name: cardholder_name || oldData.cardholder_name,
    card_number: card_number ? card_number.replace(/\s/g, '') : oldData.card_number,
    expiry_month: expiry_month || oldData.expiry_month,
    expiry_year: expiry_year || oldData.expiry_year,
    cvv: cvv || oldData.cvv,
  };

  const { encrypted_data, encrypted_dek, iv, auth_tag } = await encryptCredential(session.userId, JSON.stringify(newData));

  await db.execute({
    sql: `UPDATE credentials SET label = COALESCE(?, label), encrypted_data = ?, encrypted_dek = ?, iv = ?, auth_tag = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ? AND user_id = ?`,
    args: [label || null, encrypted_data, encrypted_dek, iv, auth_tag, id, session.userId],
  });

  await db.execute({
    sql: `INSERT INTO audit_log (id, user_id, action, target_type, target_id, metadata) VALUES (?, ?, ?, ?, ?, ?)`,
    args: [randomUUID(), session.userId, 'card.update', 'card', id, JSON.stringify({ label })],
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
    sql: `SELECT id, label FROM credentials WHERE id = ? AND user_id = ? AND type = 'card'`,
    args: [id, session.userId],
  });
  if (existing.rows.length === 0) {
    return NextResponse.json({ error: 'Card not found' }, { status: 404 });
  }

  await db.execute({ sql: 'DELETE FROM credentials WHERE id = ? AND user_id = ?', args: [id, session.userId] });

  const row = existing.rows[0];
  await db.execute({
    sql: `INSERT INTO audit_log (id, user_id, action, target_type, target_id, metadata) VALUES (?, ?, ?, ?, ?, ?)`,
    args: [randomUUID(), session.userId, 'card.delete', 'card', id, JSON.stringify({ label: row.label })],
  });

  return NextResponse.json({ success: true });
}
