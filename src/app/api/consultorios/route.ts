import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const unitId = searchParams.get('unitId');

    const consultorios = await prisma.consultorio.findMany({
      where: unitId ? { unitId } : {},
      orderBy: { nome: 'asc' },
    });

    return NextResponse.json(consultorios);
  } catch (error) {
    console.error('Erro ao buscar consultórios:', error);
    return NextResponse.json({ error: 'Falha interna' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const data = await request.json();
    const { nome, unitId } = data;

    if (!nome || !unitId) {
      return NextResponse.json({ error: 'Nome e Unidade são obrigatórios' }, { status: 400 });
    }

    const novoConsultorio = await prisma.consultorio.create({
      data: {
        nome,
        unitId
      }
    });

    return NextResponse.json(novoConsultorio);
  } catch (error) {
    console.error('Erro ao criar consultório:', error);
    return NextResponse.json({ error: 'Falha interna' }, { status: 500 });
  }
}
