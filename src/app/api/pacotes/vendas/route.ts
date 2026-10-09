import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST: Vender pacote para um paciente
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pacienteId, pacoteId, sessoesTotais, sessoesIniciais = 0 } = body;

    if (!pacienteId || !pacoteId) {
      return NextResponse.json(
        { success: false, error: 'Paciente e Pacote são campos obrigatórios' },
        { status: 400 }
      );
    }

    const pacote = await prisma.pacote.findUnique({
      where: { id: pacoteId },
    });

    if (!pacote) {
      return NextResponse.json(
        { success: false, error: 'Pacote selecionado não encontrado' },
        { status: 404 }
      );
    }

    const totalSessoes = sessoesTotais ? parseInt(sessoesTotais, 10) : pacote.qtdSessoes;

    const novaVenda = await prisma.pacotePaciente.create({
      data: {
        pacienteId,
        pacoteId,
        sessoesTotais: totalSessoes,
        sessoesRealizadas: parseInt(sessoesIniciais, 10) || 0,
        status: 'ATIVO',
      },
      include: {
        paciente: true,
        pacote: true,
      },
    });

    return NextResponse.json({ success: true, data: novaVenda });
  } catch (error) {
    console.error('Erro ao realizar venda de pacote:', error);
    return NextResponse.json(
      { success: false, error: 'Falha ao registrar venda de pacote' },
      { status: 500 }
    );
  }
}

// PATCH: Atualizações de venda (Registrar Sessão, Cancelar, Concluir, Reativar)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, action } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID da venda é obrigatório' },
        { status: 400 }
      );
    }

    const vendaAtual = await prisma.pacotePaciente.findUnique({
      where: { id },
      include: { pacote: true, paciente: true },
    });

    if (!vendaAtual) {
      return NextResponse.json(
        { success: false, error: 'Venda de pacote não encontrada' },
        { status: 404 }
      );
    }

    let updated;

    if (action === 'registrar_sessao') {
      const novasSessoes = vendaAtual.sessoesRealizadas + 1;
      const statusFinal = novasSessoes >= vendaAtual.sessoesTotais ? 'CONCLUIDO' : 'ATIVO';

      updated = await prisma.pacotePaciente.update({
        where: { id },
        data: {
          sessoesRealizadas: novasSessoes,
          status: statusFinal,
        },
        include: { pacote: true, paciente: true },
      });
    } else if (action === 'cancelar') {
      updated = await prisma.pacotePaciente.update({
        where: { id },
        data: { status: 'CANCELADO' },
        include: { pacote: true, paciente: true },
      });
    } else if (action === 'concluir') {
      updated = await prisma.pacotePaciente.update({
        where: { id },
        data: { status: 'CONCLUIDO', sessoesRealizadas: vendaAtual.sessoesTotais },
        include: { pacote: true, paciente: true },
      });
    } else if (action === 'reativar') {
      updated = await prisma.pacotePaciente.update({
        where: { id },
        data: { status: 'ATIVO' },
        include: { pacote: true, paciente: true },
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Ação não reconhecida' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Erro ao atualizar venda:', error);
    return NextResponse.json(
      { success: false, error: 'Falha ao atualizar venda' },
      { status: 500 }
    );
  }
}
