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

    if (!unitId) return NextResponse.json({ error: 'Unit ID required' }, { status: 400 });

    // Ensure we have a patient
    let paciente = await prisma.paciente.findFirst({ where: { unitId } });
    if (!paciente) {
      paciente = await prisma.paciente.create({
        data: { nome: 'João Exame da Silva', unitId }
      });
    }

    // Create mock exams
    await prisma.exame.create({
      data: {
        titulo: 'Ressonância Magnética do Joelho Esquerdo',
        modalidade: 'RM',
        status: 'AGUARDANDO_LAUDO',
        pacienteId: paciente.id,
        unitId: unitId,
        dataHoraAgendamento: new Date(),
        observacoes: 'Paciente refere dor crônica há 6 meses. Suspeita de lesão de menisco.'
      }
    });

    await prisma.exame.create({
      data: {
        titulo: 'Tomografia Computadorizada de Crânio',
        modalidade: 'TC',
        status: 'AGUARDANDO_LAUDO',
        pacienteId: paciente.id,
        unitId: unitId,
        dataHoraAgendamento: new Date(),
        observacoes: 'Investigação de cefaleia refratária.'
      }
    });

    return NextResponse.json({ success: true, message: 'Exames mockados criados' });
  } catch (error) {
    console.error('Erro ao popular exames:', error);
    return NextResponse.json({ error: 'Falha interna' }, { status: 500 });
  }
}
