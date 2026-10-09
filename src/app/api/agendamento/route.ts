import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { scheduleWhatsAppReminder } from '@/lib/queue/whatsappQueue';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { profissionalId, date, time, pacienteNome, pacienteCpf, pacienteEmail, pacienteTelefone } = body;

    if (!profissionalId || !date || !time || !pacienteNome) {
      return NextResponse.json({ error: 'Dados obrigatórios faltando' }, { status: 400 });
    }

    const existingMeeting = await prisma.meeting.findFirst({
      where: {
        user_id: profissionalId,
        date: date,
        time: time,
        status: { not: 'cancelado' }
      }
    });

    if (existingMeeting) {
      return NextResponse.json({ error: 'Horário já não está mais disponível' }, { status: 409 });
    }

    let paciente;
    if (pacienteCpf) {
      paciente = await prisma.paciente.findFirst({ where: { cpf: pacienteCpf } });
    }
    
    if (!paciente) {
      paciente = await prisma.paciente.create({
        data: {
          nome: pacienteNome,
          cpf: pacienteCpf || null,
          email: pacienteEmail || null,
          telefone: pacienteTelefone || null,
        }
      });
    }

    const tokenPublico = uuidv4();
    const meeting = await prisma.meeting.create({
      data: {
        title: `Consulta Pública - ${pacienteNome}`,
        date: date,
        time: time,
        type: 'Consulta',
        status: 'agendado',
        user_id: profissionalId,
        pacienteId: paciente.id,
        isPublic: true,
        tokenPublico: tokenPublico,
      }
    });

    // Calcula o tempo que falta para amanhã (Notificação de 24h)
    // Para simplificar o teste, você pode colocar `delay = 1000` (1 segundo) para testar o worker na hora.
    // Exemplo em prod: delay seria o timestamp do agendamento - 24 horas.
    const delaySimulado = 5000; // 5 segundos para testes rápidos no MVP
    await scheduleWhatsAppReminder(meeting.id, delaySimulado);

    return NextResponse.json({ 
      success: true, 
      meetingId: meeting.id,
      tokenPublico: meeting.tokenPublico
    }, { status: 201 });

  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    return NextResponse.json({ error: 'Falha ao processar agendamento' }, { status: 500 });
  }
}
