import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, ''); // Elimina todo lo que no sea número
}

export async function POST(req: Request) {
  const { phone, message } = await req.json();

  if (!phone || !message) {
    return NextResponse.json({ error: 'Phone and message are required' }, { status: 400 });
  }

  const cleanPhone = normalizePhone(phone);

  let user = await prisma.user.findUnique({ where: { phone: cleanPhone } });

  if (!user) {
    user = await prisma.user.create({ data: { phone: cleanPhone } });
  }

  const newMessage = await prisma.message.create({
    data: {
      userId: user.id,
      message,
    },
  });

  return NextResponse.json({ status: 'ok', message: newMessage });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rawPhone = searchParams.get('phone');

  if (!rawPhone) {
    return NextResponse.json({ error: 'Phone is required' }, { status: 400 });
  }

  const phone = decodeURIComponent(rawPhone);

  const user = await prisma.user.findUnique({
    where: { phone },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Obtener la fecha actual con hora 00:00
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  // Obtener fin del día actual 23:59
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const messages = await prisma.message.findMany({
    where: {
      userId: user.id,
      createdAt: {
        gte: startOfToday,
        lte: endOfToday,
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  return NextResponse.json(messages);
}

