import { NextResponse } from 'next/server';
import { createHash } from 'node:crypto';

export async function GET() {
  const secret = process.env.BOTVAULT_KEK_SECRET || 'NOT_SET';
  const hash = createHash('sha256').update(secret).digest('hex');
  return NextResponse.json({
    hash: hash.substring(0, 16),
    length: secret.length,
    first4: secret.substring(0, 4),
  });
}
