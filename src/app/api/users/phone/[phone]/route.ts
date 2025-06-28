// src/app/api/users/phone/[phone]/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  _req: Request,
  { params }: { params: { phone: string } }
) {
  const phone = decodeURIComponent(params.phone);

  const user = await prisma.user.findUnique({ where: { phone } });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}
