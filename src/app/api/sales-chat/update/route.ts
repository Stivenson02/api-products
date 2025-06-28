import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { salesChat, user } = body;

  if (!salesChat?.id) {
    return NextResponse.json({ error: 'SalesChat ID is required' }, { status: 400 });
  }

  try {
    // Actualizar SalesChat si hay datos
    const updatedSalesChat = await prisma.salesChat.update({
      where: { id: salesChat.id },
      data: {
        ...(salesChat.status && { status: salesChat.status }),
        ...(salesChat.resumen && { resumen: salesChat.resumen }),
        ...(salesChat.productoInteresado && { productoInteresado: salesChat.productoInteresado }),
      },
    });

    // Actualizar User si hay datos
    let updatedUser = null;
    if (user?.id) {
      updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          ...(user.name && { name: user.name }),
          ...(user.email && { email: user.email }),
        },
      });
    }

    return NextResponse.json({
      status: 'ok',
      salesChat: updatedSalesChat,
      user: updatedUser,
    });
  } catch (error) {
    console.error('❌ Error actualizando:', error);
    return NextResponse.json({ error: 'Error actualizando datos' }, { status: 500 });
  }
}
