import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { token: string } }) {
  try {
    const { token } = params;

    const meeting = await prisma.meeting.findUnique({
      where: { tokenPublico: token },
      include: {
        paciente: {
          select: { nome: true }
        }
      }
    });

    if (!meeting) {
      return NextResponse.json({ error: 'Agendamento não encontrado' }, { status: 404 });
    }

    // Buscar o nome do profissional (já que no MVP a relação Meeting->User não está tipada rigidamente no prisma como objeto User, vamos fazer manual)
    const profissional = await prisma.user.findUnique({
      where: { id: meeting.user_id || '' },
      select: { fullName: true }
    });

    return NextResponse.json({
      agendamento: {
        id: meeting.id,
        date: meeting.date,
        time: meeting.time,
        status: meeting.status,
        pacienteNome: meeting.paciente?.nome,
        profissionalNome: profissional?.fullName || 'Profissional',
      }
    });

  } catch (error) {
    console.error('Erro ao buscar token:', error);
    return NextResponse.json({ error: 'Falha interna' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { token: string } }) {
  try {
    const { token } = params;

    const meeting = await prisma.meeting.findUnique({
      where: { tokenPublico: token }
    });

    if (!meeting) {
      return NextResponse.json({ error: 'Agendamento não encontrado' }, { status: 404 });
    }

    if (meeting.status === 'cancelado') {
      return NextResponse.json({ error: 'Agendamento já está cancelado' }, { status: 400 });
    }

    const updated = await prisma.meeting.update({
      where: { id: meeting.id },
      data: { status: 'cancelado' }
    });

    return NextResponse.json({ success: true, status: updated.status });
  } catch (error) {
    console.error('Erro ao cancelar agendamento:', error);
    return NextResponse.json({ error: 'Falha ao cancelar' }, { status: 500 });
  }
}
