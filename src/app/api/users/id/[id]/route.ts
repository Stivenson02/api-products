// src/app/api/users/id/[id]/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const userId = parseInt(params.id, 10);
  if (isNaN(userId)) {
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}
