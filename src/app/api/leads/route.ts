import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { name, email, phone, searchTerm, tipoLead, promedio } = await req.json();

  if (!phone) {
    return NextResponse.json({ error: 'Phone is required' }, { status: 400 });
  }

  try {
    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone,
        searchTerm,
        tipoLead,
        promedio,
      },
    });

    return NextResponse.json({ status: 'ok', lead });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ error: 'Could not create lead' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const skip = (page - 1) * limit;

  const name = searchParams.get('name')?.toLowerCase();
  const email = searchParams.get('email')?.toLowerCase();
  const searchTerm = searchParams.get('searchTerm')?.toLowerCase();

  const where: Record<string, unknown> = {

    ...(name && { name: { contains: name, mode: 'insensitive' } }),
    ...(email && { email: { contains: email, mode: 'insensitive' } }),
    ...(searchTerm && { searchTerm: { contains: searchTerm, mode: 'insensitive' } }),
  };

  try {
    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.lead.count({ where }),
    ]);

    return NextResponse.json({
      data: leads,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Could not fetch leads' }, { status: 500 });
  }
}

