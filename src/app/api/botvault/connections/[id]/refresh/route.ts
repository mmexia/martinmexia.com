import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/botvault/auth';
import { getDb, initializeDatabase } from '@/lib/botvault/db';
import { decryptCredential, encryptCredential } from '@/lib/botvault/encryption';

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { id } = await params;
  await initializeDatabase();
  const db = getDb();

  const result = await db.execute({
    sql: 'SELECT * FROM credentials WHERE id = ? AND user_id = ? AND type = ?',
    args: [id, session.userId, 'oauth'],
  });

  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
  }

  const row = result.rows[0] as Record<string, string>;
  const decrypted = decryptCredential(session.userId, row.encrypted_data, row.encrypted_dek, row.iv, row.auth_tag);
  const data = JSON.parse(decrypted);

  if (!data.refresh_token) {
    return NextResponse.json({ error: 'No refresh token available' }, { status: 400 });
  }

  // Refresh token
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_OAUTH_CLIENT_ID!,
      client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
      refresh_token: data.refresh_token,
      grant_type: 'refresh_token',
    }),
  });

  if (!tokenRes.ok) {
    return NextResponse.json({ error: 'Token refresh failed' }, { status: 502 });
  }

  const tokens = await tokenRes.json();
  data.access_token = tokens.access_token;
  data.token_expiry = Date.now() + tokens.expires_in * 1000;

  const { encrypted_data, encrypted_dek, iv, auth_tag } = encryptCredential(session.userId, JSON.stringify(data));

  await db.execute({
    sql: 'UPDATE credentials SET encrypted_data = ?, encrypted_dek = ?, iv = ?, auth_tag = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    args: [encrypted_data, encrypted_dek, iv, auth_tag, id],
  });

  return NextResponse.json({ status: 'refreshed', token_expiry: data.token_expiry });
}
