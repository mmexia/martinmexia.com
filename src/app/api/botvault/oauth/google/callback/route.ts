import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/botvault/auth';
import { getDb, initializeDatabase } from '@/lib/botvault/db';
import { encryptCredential } from '@/lib/botvault/encryption';
import { randomUUID } from 'node:crypto';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const session = await verifySession();
  if (!session) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://martinmexia.com';
    return NextResponse.redirect(`${baseUrl}/botvault/login`);
  }

  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://martinmexia.com';

  if (error) {
    return NextResponse.redirect(`${baseUrl}/botvault/connections?error=${encodeURIComponent(error)}`);
  }

  if (!code || !state) {
    return NextResponse.redirect(`${baseUrl}/botvault/connections?error=missing_params`);
  }

  // Verify state
  const cookieStore = await cookies();
  const storedState = cookieStore.get('botvault_oauth_state')?.value;
  cookieStore.delete('botvault_oauth_state');

  if (!storedState || storedState !== state) {
    return NextResponse.redirect(`${baseUrl}/botvault/connections?error=invalid_state`);
  }

  // Exchange code for tokens
  const redirectUri = `${baseUrl}/api/botvault/oauth/google/callback`;
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_OAUTH_CLIENT_ID!,
      client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  if (!tokenRes.ok) {
    return NextResponse.redirect(`${baseUrl}/botvault/connections?error=token_exchange_failed`);
  }

  const tokens = await tokenRes.json();
  const { access_token, refresh_token, expires_in } = tokens;

  // Fetch user info
  const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  if (!userInfoRes.ok) {
    return NextResponse.redirect(`${baseUrl}/botvault/connections?error=userinfo_failed`);
  }

  const userInfo = await userInfoRes.json();
  const email = userInfo.email || 'unknown';

  // Store encrypted credential
  const scopes = 'openid email profile gmail.modify calendar drive contacts spreadsheets documents';
  const credentialData = JSON.stringify({
    provider: 'google',
    email,
    access_token,
    refresh_token,
    token_expiry: Date.now() + expires_in * 1000,
    scopes,
  });

  await initializeDatabase();
  const db = getDb();
  const id = randomUUID();
  const label = `Google — ${email}`;
  const { encrypted_data, encrypted_dek, iv, auth_tag } = encryptCredential(session.userId, credentialData);

  await db.execute({
    sql: `INSERT INTO credentials (id, user_id, type, label, encrypted_data, encrypted_dek, iv, auth_tag)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [id, session.userId, 'oauth', label, encrypted_data, encrypted_dek, iv, auth_tag],
  });

  // Audit log
  await db.execute({
    sql: `INSERT INTO audit_log (id, user_id, action, target_type, target_id, metadata)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [randomUUID(), session.userId, 'oauth.connect', 'credential', id, JSON.stringify({ provider: 'google', email })],
  });

  return NextResponse.redirect(`${baseUrl}/botvault/connections`);
}
