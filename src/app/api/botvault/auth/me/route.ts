import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';

export async function GET() {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  return NextResponse.json({ user: { id: session.userId, username: session.username, email: session.email } });
}
