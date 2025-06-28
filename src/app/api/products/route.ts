import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const body = await req.json();
  const keywords: string[] = body.keywords || [];

  if (!keywords.length) {
    return NextResponse.json({ error: 'No keywords provided' }, { status: 400 });
  }

  const orFilters = keywords.flatMap(keyword => {
    const fields = ['title', 'category', 'brand', 'type', 'color'] as const;

    return fields.map(field => ({
      [field]: {
        contains: keyword,
        mode: 'insensitive' as const
      }
    }));
  });

  const products = await prisma.product.findMany({
    where: {
      OR: orFilters
    }
  });

  return NextResponse.json(products);
}
