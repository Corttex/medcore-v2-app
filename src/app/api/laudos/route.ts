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
    const status = searchParams.get('status');

    let whereClause: any = {};
    if (unitId) whereClause.unitId = unitId;
    if (status) whereClause.status = status;

    const exames = await prisma.exame.findMany({
      where: whereClause,
      include: {
        paciente: { select: { nome: true } },
        laudo: true,
        medicoSolicitante: { select: { fullName: true } }
      },
      orderBy: { dataHoraAgendamento: 'desc' },
      take: 50
    });

    return NextResponse.json(exames);
  } catch (error) {
    console.error('Erro ao buscar exames:', error);
    return NextResponse.json({ error: 'Falha interna' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { exameId, textoLaudo, conclusao, assinar } = body;

    if (!exameId || !textoLaudo) {
      return NextResponse.json({ error: 'Exame ID e Texto do Laudo são obrigatórios' }, { status: 400 });
    }

    const laudoData: any = {
      textoLaudo,
      conclusao,
      status: assinar ? "ASSINADO" : "RASCUNHO"
    };

    if (assinar) {
      laudoData.assinadoPorId = session.user.id;
      laudoData.dataAssinatura = new Date();
    }

    const laudo = await prisma.laudo.upsert({
      where: { exameId },
      update: laudoData,
      create: {
        exameId,
        ...laudoData
      }
    });

    if (assinar) {
      await prisma.exame.update({
        where: { id: exameId },
        data: { status: "LAUDADO", medicoLaudadorId: session.user.id }
      });
    }

    return NextResponse.json({ success: true, laudo });
  } catch (error) {
    console.error('Erro ao salvar laudo:', error);
    return NextResponse.json({ error: 'Falha interna' }, { status: 500 });
  }
}
