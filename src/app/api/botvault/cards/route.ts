import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { getDb, initializeDatabase } from '@/lib/db';
import { encryptCredential, decryptCredential } from '@/lib/encryption';
import { randomUUID } from 'node:crypto';

function detectBrand(cardNumber: string): string {
  const n = cardNumber.replace(/\s/g, '');
  if (n.startsWith('4')) return 'Visa';
  if (n.startsWith('5')) return 'Mastercard';
  if (n.startsWith('34') || n.startsWith('37')) return 'Amex';
  if (n.startsWith('6')) return 'Discover';
  return 'Card';
}

export async function GET() {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  await initializeDatabase();
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT id, label, encrypted_data, encrypted_dek, iv, auth_tag, created_at
          FROM credentials WHERE user_id = ? AND type = 'card' ORDER BY created_at DESC`,
    args: [session.userId],
  });

  const cards = await Promise.all(result.rows.map(async (row) => {
    const decrypted = await decryptCredential(
      session.userId,
      row.encrypted_data as string,
      row.encrypted_dek as string,
      row.iv as string,
      row.auth_tag as string
    );
    const data = JSON.parse(decrypted);
    const cardNumber = data.card_number.replace(/\s/g, '');
    return {
      id: row.id,
      label: row.label,
      cardholder_name: data.cardholder_name,
      last4: cardNumber.slice(-4),
      brand: detectBrand(cardNumber),
      expiry_month: data.expiry_month,
      expiry_year: data.expiry_year,
      created_at: row.created_at,
    };
  }));

  return NextResponse.json({ cards });
}

export async function POST(req: NextRequest) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const body = await req.json();
  const { label, cardholder_name, card_number, expiry_month, expiry_year, cvv } = body;

  if (!label || !cardholder_name || !card_number || !expiry_month || !expiry_year || !cvv) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  const cardData = JSON.stringify({ cardholder_name, card_number: card_number.replace(/\s/g, ''), expiry_month, expiry_year, cvv });

  await initializeDatabase();
  const db = getDb();
  const id = randomUUID();
  const { encrypted_data, encrypted_dek, iv, auth_tag } = await encryptCredential(session.userId, cardData);

  await db.execute({
    sql: `INSERT INTO credentials (id, user_id, type, label, encrypted_data, encrypted_dek, iv, auth_tag)
          VALUES (?, ?, 'card', ?, ?, ?, ?, ?)`,
    args: [id, session.userId, label, encrypted_data, encrypted_dek, iv, auth_tag],
  });

  await db.execute({
    sql: `INSERT INTO audit_log (id, user_id, action, target_type, target_id, metadata)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [randomUUID(), session.userId, 'card.create', 'card', id, JSON.stringify({ label })],
  });

  const clean = card_number.replace(/\s/g, '');
  return NextResponse.json({
    id, label, cardholder_name,
    last4: clean.slice(-4),
    brand: detectBrand(clean),
    expiry_month, expiry_year,
  }, { status: 201 });
}
