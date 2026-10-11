import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

// Fallback de desenvolvimento limpo em memória (começa zerado para testes)
let mockTeleconsultas: any[] = [];

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get('date');
    const status = searchParams.get('status');

    try {
      const meetings = await prisma.meeting.findMany({
        where: {
          type: 'telemedicina',
          ...(dateStr ? { date: dateStr } : {}),
          ...(status && status !== 'todas' ? { status } : {}),
        },
        include: {
          paciente: {
            include: {
              convenio: true,
            }
          },
          user: {
            select: {
              id: true,
              fullName: true,
              especialidade: true,
              crm: true,
            }
          },
          prontuario: true,
        },
        orderBy: {
          time: 'asc'
        }
      });

      // Retorna exatamente os dados do banco de dados (pode ser vazio caso recém-iniciado)
      return NextResponse.json(meetings || []);
    } catch (dbError) {
      console.warn('[Telemedicina API] Banco inacessível, utilizando lista local de desenvolvimento:', (dbError as Error)?.message || dbError);
      let filtered = [...mockTeleconsultas];
      if (status && status !== 'todas') {
        filtered = filtered.filter(item => item.status === status);
      }
      return NextResponse.json(filtered);
    }
  } catch (error) {
    console.error('Erro ao listar teleconsultas:', error);
    return NextResponse.json({ error: 'Falha interna ao processar requisição' }, { status: 500 });
  }
}


export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const {
      pacienteId,
      pacienteNome,
      pacienteCpf,
      pacienteTelefone,
      pacienteEmail,
      title,
      description,
      date,
      time,
      duration = 30,
      convenioId
    } = body;

    if (!date || !time) {
      return NextResponse.json({ error: 'Data e horário são obrigatórios' }, { status: 400 });
    }

    const tokenPublico = uuidv4();
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'https://medcore.gestaocomercial360.com.br';
    const link = `${origin}/telemedicina/${tokenPublico}`;

    try {
      let resolvedPacienteId = pacienteId;

      // Se paciente não tem ID mas tem nome, cadastrar ou localizar
      if (!resolvedPacienteId && pacienteNome) {
        let existing = null;
        if (pacienteCpf) {
          existing = await prisma.paciente.findFirst({ where: { cpf: pacienteCpf } });
        }
        if (!existing) {
          existing = await prisma.paciente.create({
            data: {
              nome: pacienteNome,
              cpf: pacienteCpf || null,
              telefone: pacienteTelefone || null,
              email: pacienteEmail ? pacienteEmail.toLowerCase().trim() : null,
              convenioId: convenioId || null,
            }
          });
        }
        resolvedPacienteId = existing.id;
      }

      const newMeeting = await prisma.meeting.create({
        data: {
          title: title || `Teleconsulta - ${pacienteNome || 'Paciente'}`,
          description: description || 'Teleatendimento por vídeo',
          date,
          time,
          duration: Number(duration) || 30,
          type: 'telemedicina',
          status: 'agendado',
          link,
          tokenPublico,
          isPublic: true,
          pacienteId: resolvedPacienteId || null,
          user_id: session.user.id,
          convenioId: convenioId || null,
        },
        include: {
          paciente: {
            include: { convenio: true }
          },
          user: true,
        }
      });

      return NextResponse.json(newMeeting, { status: 201 });
    } catch (dbError) {
      console.warn('[Telemedicina POST] Banco indisponível, simulando criação em memória:', (dbError as Error)?.message || dbError);
      
      const newMock = {
        id: `tele-${Date.now()}`,
        title: title || `Teleconsulta - ${pacienteNome || 'Novo Paciente'}`,
        description: description || 'Teleatendimento por videoconferência segura',
        date: date || new Date().toISOString().split("T")[0],
        time: time || "10:00",
        duration: Number(duration) || 30,
        type: "telemedicina",
        status: "agendado",
        link,
        tokenPublico,
        isPublic: true,
        user_id: session.user.id,
        user: {
          id: session.user.id,
          fullName: session.user.fullName || "Médico Responsável",
          especialidade: "Clínica Geral",
          crm: "00000-BR"
        },
        pacienteId: `pac-${Date.now()}`,
        paciente: {
          id: `pac-${Date.now()}`,
          nome: pacienteNome || "Paciente Novo",
          cpf: pacienteCpf || "000.000.000-00",
          telefone: pacienteTelefone || "(11) 99999-9999",
          email: pacienteEmail || "paciente@email.com",
          convenio: { nome: "Particular" }
        },
        prontuario: null,
        createdAt: new Date().toISOString()
      };

      mockTeleconsultas.unshift(newMock);
      return NextResponse.json(newMock, { status: 201 });
    }
  } catch (error) {
    console.error('Erro ao agendar teleconsulta:', error);
    return NextResponse.json({ error: 'Falha interna ao criar teleconsulta' }, { status: 500 });
  }
}
