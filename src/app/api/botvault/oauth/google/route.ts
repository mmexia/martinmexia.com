import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/botvault/auth';
import { randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';

export async function GET() {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  if (!clientId) return NextResponse.json({ error: 'Google OAuth not configured' }, { status: 500 });

  const state = randomBytes(32).toString('hex');
  const cookieStore = await cookies();
  cookieStore.set('botvault_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 300, // 5 minutes
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://martinmexia.com';
  const redirectUri = `${baseUrl}/api/botvault/oauth/google/callback`;
  const scopes = [
    'openid', 'email', 'profile',
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/contacts',
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/documents',
  ].join(' ');

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
    scope: scopes,
    state,
  });

  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
}
