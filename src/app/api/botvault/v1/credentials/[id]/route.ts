import { NextRequest, NextResponse } from 'next/server';
import { verifyBotToken } from '@/lib/botvault/bot-auth';
import { getDb, initializeDatabase } from '@/lib/botvault/db';
import { decryptCredential } from '@/lib/botvault/encryption';
import { randomUUID } from 'node:crypto';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyBotToken(req);
  if ('error' in auth) {
    const headers: Record<string, string> = {};
    if (auth.status === 429) {
      const match = auth.error.match(/(\d+) seconds/);
      if (match) headers['Retry-After'] = match[1];
    }
    return NextResponse.json({ error: auth.error }, { status: auth.status, headers });
  }

  const { id: credentialId } = await params;

  await initializeDatabase();
  const db = getDb();

  // Check permission
  const perm = await db.execute({
    sql: `SELECT id FROM permissions WHERE bot_id = ? AND credential_id = ?`,
    args: [auth.bot_id, credentialId],
  });

  if (perm.rows.length === 0) {
    return NextResponse.json({ error: 'Forbidden: no permission for this credential' }, { status: 403 });
  }

  // Get credential
  const cred = await db.execute({
    sql: `SELECT id, label, type, encrypted_data, encrypted_dek, iv, auth_tag FROM credentials WHERE id = ? AND user_id = ?`,
    args: [credentialId, auth.user_id],
  });

  if (cred.rows.length === 0) {
    return NextResponse.json({ error: 'Credential not found' }, { status: 404 });
  }

  const row = cred.rows[0];
  const value = decryptCredential(
    auth.user_id,
    row.encrypted_data as string,
    row.encrypted_dek as string,
    row.iv as string,
    row.auth_tag as string
  );

  // Log access
  await db.execute({
    sql: `INSERT INTO audit_log (id, user_id, bot_id, action, target_type, target_id, metadata) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [randomUUID(), auth.user_id, auth.bot_id, 'bot_credential_access', 'credential', credentialId, null],
  });

  return NextResponse.json({
    id: row.id,
    label: row.label,
    type: row.type,
    value,
  });
}
