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
    const dateStr = searchParams.get('date');
    const consultorioId = searchParams.get('consultorioId');
    const medicoId = searchParams.get('medicoId');

    const meetings = await prisma.meeting.findMany({
      where: {
        ...(dateStr ? { date: dateStr } : {}),
        ...(consultorioId ? { consultorioId } : {}),
        ...(medicoId ? { user_id: medicoId } : {})
      },
      include: {
        paciente: true,
        convenio: true,
        procedimento: true,
        user: true,
      },
      orderBy: {
        time: 'asc'
      }
    });

    return NextResponse.json(meetings);
  } catch (error) {
    console.error('Erro ao buscar meetings:', error);
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
    const { title, date, time, duration, type, pacienteId, convenioId, procedimentoId, patientToken, user_id, consultorioId } = data;

    // Se tiver convenioId, vamos validar se exige token
    if (convenioId) {
      const convenio = await prisma.convenio.findUnique({ where: { id: convenioId } });
      if (convenio?.requiresToken && !patientToken) {
        return NextResponse.json({ 
          error: 'Este convênio exige um Token de Autorização TISS. Por favor, solicite ao paciente e preencha o campo.' 
        }, { status: 400 });
      }
    }

    const newMeeting = await prisma.meeting.create({
      data: {
        title,
        date,
        time,
        duration: duration ? parseInt(String(duration)) : 60,
        type: type || 'CONSULTA',
        status: 'AGENDADA',
        pacienteId,
        convenioId,
        procedimentoId,
        patientToken,
        user_id,
        consultorioId,
        isPublic: false
      },
      include: {
        paciente: true,
        convenio: true,
        procedimento: true,
        user: true,
        consultorio: true,
      }
    });

    return NextResponse.json(newMeeting, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar meeting:', error);
    return NextResponse.json({ error: 'Falha interna' }, { status: 500 });
  }
}
