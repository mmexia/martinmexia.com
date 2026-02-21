import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { getDb, initializeDatabase } from '@/lib/db';
import { decryptCredential } from '@/lib/encryption';
import { randomUUID } from 'node:crypto';

export async function POST(req: NextRequest) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { credentialId } = await req.json();
  if (!credentialId) return NextResponse.json({ error: 'credentialId is required' }, { status: 400 });

  await initializeDatabase();
  const db = getDb();

  // Verify ownership
  const result = await db.execute({
    sql: 'SELECT * FROM credentials WHERE id = ? AND user_id = ? AND type = ?',
    args: [credentialId, session.userId, 'oauth'],
  });

  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
  }

  const row = result.rows[0] as Record<string, string>;

  // Try to revoke token at Google
  try {
    const decrypted = decryptCredential(session.userId, row.encrypted_data, row.encrypted_dek, row.iv, row.auth_tag);
    const data = JSON.parse(decrypted);
    if (data.access_token) {
      await fetch(`https://oauth2.googleapis.com/revoke?token=${data.access_token}`, { method: 'POST' });
    }
  } catch {
    // Best effort revocation
  }

  // Delete credential
  await db.execute({
    sql: 'DELETE FROM credentials WHERE id = ?',
    args: [credentialId],
  });

  // Audit log
  await db.execute({
    sql: `INSERT INTO audit_log (id, user_id, action, target_type, target_id, metadata)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [randomUUID(), session.userId, 'oauth.disconnect', 'credential', credentialId, JSON.stringify({ provider: 'google' })],
  });

  return NextResponse.json({ success: true });
}
