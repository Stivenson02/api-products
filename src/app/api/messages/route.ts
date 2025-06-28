import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

export async function POST(req: Request) {
  const { phone, message } = await req.json();

  if (!phone || !message) {
    return NextResponse.json({ error: 'Phone and message are required' }, { status: 400 });
  }

  const cleanPhone = normalizePhone(phone);

  // 1. Buscar o crear el usuario
  let user = await prisma.user.findUnique({ where: { phone: cleanPhone } });

  if (!user) {
    user = await prisma.user.create({ data: { phone: cleanPhone } });
  }

  // 2. Buscar o crear un salesChat en estado "activa" o "interes"
  let salesChat = await prisma.salesChat.findFirst({
    where: {
      userId: user.id,
      status: {
        in: ['activa', 'interes'],
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!salesChat) {
    salesChat = await prisma.salesChat.create({
      data: {
        userId: user.id,
        status: 'activa',
        resumen: '',
      },
    });
  }

  // 3. Crear el mensaje
  const newMessage = await prisma.message.create({
    data: {
      userId: user.id,
      salesChatId: salesChat.id,
      message,
    },
  });

  // 4. Devolver toda la info relevante
  return NextResponse.json({
    status: 'ok',
    message: newMessage,
    user: {
      id: user.id,
      phone: user.phone,
      name: user.name,
      email: user.email,
    },
    salesChat: {
      id: salesChat.id,
      status: salesChat.status,
      resumen: salesChat.resumen,
    },
  });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const chatId = searchParams.get('chatId');

  if (!chatId) {
    return NextResponse.json({ error: 'chatId is required' }, { status: 400 });
  }

  const messages = await prisma.message.findMany({
    where: {
      salesChatId: parseInt(chatId),
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  return NextResponse.json({ status: 'ok', chatId: parseInt(chatId), messages });
}


