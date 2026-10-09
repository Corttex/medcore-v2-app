import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const profissionalId = searchParams.get('profissionalId');
    const date = searchParams.get('date');

    if (!profissionalId || !date) {
      return NextResponse.json(
        { error: 'profissionalId e date (YYYY-MM-DD) são obrigatórios' },
        { status: 400 }
      );
    }

    // Lógica básica de turnos do profissional (MVP)
    // No futuro, isso pode vir de uma tabela `ProfissionalDisponibilidade` no banco de dados
    const startHour = 9; // Início do turno
    const endHour = 18; // Fim do turno
    const intervalHours = 1; // Duração de 1 hora
    
    let allSlots: string[] = [];
    for (let h = startHour; h < endHour; h += intervalHours) {
      if (h === 12) continue; // Pausa pro almoço
      allSlots.push(`${h.toString().padStart(2, '0')}:00`);
    }

    // Se a data for hoje, não listar horários que já passaram
    const today = new Date();
    const isToday = date === today.toISOString().split('T')[0];
    const currentHour = today.getHours();

    if (isToday) {
      allSlots = allSlots.filter(slot => {
        const slotHour = parseInt(slot.split(':')[0], 10);
        return slotHour > currentHour;
      });
    }

    // Buscar agendamentos existentes no banco de dados
    const existingMeetings = await prisma.meeting.findMany({
      where: {
        user_id: profissionalId,
        date: date,
        status: {
          not: 'cancelado' // Considera apenas os ativos ou agendados
        }
      },
      select: {
        time: true
      }
    });

    const bookedTimes = existingMeetings.map(m => m.time);

    // Filtrar os slots que ainda não foram reservados
    const availableSlots = allSlots.filter(slot => !bookedTimes.includes(slot));

    return NextResponse.json({ availableSlots });
  } catch (error) {
    console.error('Erro ao buscar horários:', error);
    return NextResponse.json({ error: 'Falha ao buscar horários' }, { status: 500 });
  }
}
