import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/botvault/auth';
import { getDb, initializeDatabase } from '@/lib/botvault/db';
import { decryptCredential } from '@/lib/botvault/encryption';

export async function GET() {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  await initializeDatabase();
  const db = getDb();

  const result = await db.execute({
    sql: 'SELECT id, label, created_at, encrypted_data, encrypted_dek, iv, auth_tag FROM credentials WHERE user_id = ? AND type = ? ORDER BY created_at DESC',
    args: [session.userId, 'oauth'],
  });

  const connections = result.rows.map((row) => {
    const r = row as Record<string, string>;
    try {
      const decrypted = decryptCredential(session.userId, r.encrypted_data, r.encrypted_dek, r.iv, r.auth_tag);
      const data = JSON.parse(decrypted);
      return {
        id: r.id,
        label: r.label,
        provider: data.provider,
        email: data.email,
        scopes: data.scopes,
        connected_at: r.created_at,
        status: data.token_expiry > Date.now() ? 'active' : 'expired',
      };
    } catch {
      return {
        id: r.id,
        label: r.label,
        provider: 'unknown',
        email: 'unknown',
        scopes: '',
        connected_at: r.created_at,
        status: 'error',
      };
    }
  });

  return NextResponse.json({ connections });
}
