import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const body = await req.json();
  const keywords: string[] = body.keywords || [];
  const productIds: number[] = body.productIds || [];

  const finalProducts: unknown[] = [];

  // 1. Buscar productos por ID (hot interest)
  if (productIds.length > 0) {
    const hotProducts = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
    });

    hotProducts.forEach(p => finalProducts.push({ ...p, interes: 'hot' }));
  }

  // 2. Buscar productos por keywords (low interest), excluyendo los ya encontrados
  if (keywords.length > 0) {
    const orFilters = keywords.flatMap(keyword => {
      const fields = ['title', 'category', 'brand', 'type', 'color'] as const;
      return fields.map(field => ({
        [field]: {
          contains: keyword,
          mode: 'insensitive' as const,
        },
      }));
    });

    const lowProducts = await prisma.product.findMany({
      where: {
        OR: orFilters,
        id: productIds.length > 0 ? { notIn: productIds } : undefined,
      },
    });

    lowProducts.forEach(p => finalProducts.push({ ...p, interes: 'low' }));
  }

  return NextResponse.json(finalProducts);
}
