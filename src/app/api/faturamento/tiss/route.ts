import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. Busca Convênios
    const convenios = await prisma.convenio.findMany();

    // 2. Busca Meetings (Consultas) que já foram 'realizados' mas ainda não viraram GuiaTISS
    const pendencias = await prisma.meeting.findMany({
      where: {
        status: 'realizado',
        guiaTISS: null // não foi faturado
      },
      include: {
        paciente: true
      }
    });

    // 3. Busca os Lotes já gerados para a tabela do painel
    const lotes = await prisma.loteTISS.findMany({
      include: {
        guias: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ 
      convenios, 
      pendencias,
      lotes 
    });

  } catch (error) {
    console.error('Erro ao buscar dados de faturamento:', error);
    return NextResponse.json({ error: 'Falha ao buscar faturamento' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { meetingIds, convenioId } = await req.json();

    if (!meetingIds || !meetingIds.length || !convenioId) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    // 1. Criar um novo Lote
    const numeroLote = `LT-${Date.now()}`;
    const lote = await prisma.loteTISS.create({
      data: {
        numero: numeroLote,
        status: 'gerado'
      }
    });

    // 2. Criar as Guias TISS vinculadas aos Meetings e ao novo Lote
    const guiasPromises = meetingIds.map((meetingId: string) => {
      return prisma.guiaTISS.create({
        data: {
          meetingId,
          convenioId,
          loteId: lote.id,
          valor: 150.00, // Valor fixo pro MVP, ideal vir de uma tabela de Procedimentos
          status: 'faturado'
        }
      });
    });

    await Promise.all(guiasPromises);

    return NextResponse.json({ success: true, loteId: lote.id });

  } catch (error) {
    console.error('Erro ao gerar Lote TISS:', error);
    return NextResponse.json({ error: 'Falha ao gerar lote' }, { status: 500 });
  }
}
