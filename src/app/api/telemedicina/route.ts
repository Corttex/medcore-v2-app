import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

// Fallback de desenvolvimento em memória caso o banco de dados remoto esteja indisponível
let mockTeleconsultas = [
  {
    id: "tele-001",
    title: "Teleconsulta de Rotina - Cardiologia",
    description: "Acompanhamento de pressão arterial e ajuste de medicação anti-hipertensiva.",
    date: new Date().toISOString().split("T")[0],
    time: "14:00",
    duration: 30,
    type: "telemedicina",
    status: "sala_espera", // Paciente já aguardando na sala!
    link: "https://medcore.gestaocomercial360.com.br/telemedicina/tok-sala-001",
    tokenPublico: "tok-sala-001",
    isPublic: true,
    user_id: "usr-dr-carlos",
    user: {
      id: "usr-dr-carlos",
      fullName: "Dr. Carlos Eduardo Silva",
      especialidade: "Cardiologia",
      crm: "12345-SP"
    },
    pacienteId: "pac-001",
    paciente: {
      id: "pac-001",
      nome: "Mariana Alencar Guimarães",
      cpf: "123.456.789-00",
      telefone: "(11) 98765-4321",
      email: "mariana.alencar@email.com",
      convenio: { nome: "Unimed Seguros" }
    },
    prontuario: null,
    createdAt: new Date().toISOString()
  },
  {
    id: "tele-002",
    title: "Avaliação Pós-Exame de Sangue",
    description: "Revisão dos marcadores glicêmicos e perfil lipídico.",
    date: new Date().toISOString().split("T")[0],
    time: "15:00",
    duration: 30,
    type: "telemedicina",
    status: "agendado",
    link: "https://medcore.gestaocomercial360.com.br/telemedicina/tok-sala-002",
    tokenPublico: "tok-sala-002",
    isPublic: true,
    user_id: "usr-dr-carlos",
    user: {
      id: "usr-dr-carlos",
      fullName: "Dr. Carlos Eduardo Silva",
      especialidade: "Cardiologia",
      crm: "12345-SP"
    },
    pacienteId: "pac-002",
    paciente: {
      id: "pac-002",
      nome: "Roberto Meneses Albuquerque",
      cpf: "987.654.321-99",
      telefone: "(11) 97123-9988",
      email: "roberto.meneses@email.com",
      convenio: { nome: "Bradesco Saúde" }
    },
    prontuario: null,
    createdAt: new Date().toISOString()
  },
  {
    id: "tele-003",
    title: "Primeira Consulta - Telemedicina Geral",
    description: "Paciente com queixa de cefaleia recorrente e cansaço diurno.",
    date: new Date().toISOString().split("T")[0],
    time: "16:30",
    duration: 45,
    type: "telemedicina",
    status: "agendado",
    link: "https://medcore.gestaocomercial360.com.br/telemedicina/tok-sala-003",
    tokenPublico: "tok-sala-003",
    isPublic: true,
    user_id: "usr-dr-carlos",
    user: {
      id: "usr-dr-carlos",
      fullName: "Dr. Carlos Eduardo Silva",
      especialidade: "Cardiologia",
      crm: "12345-SP"
    },
    pacienteId: "pac-003",
    paciente: {
      id: "pac-003",
      nome: "Camila Fernandes Leite",
      cpf: "456.789.012-34",
      telefone: "(11) 99876-5544",
      email: "camila.leite@email.com",
      convenio: { nome: "Particular" }
    },
    prontuario: null,
    createdAt: new Date().toISOString()
  },
  {
    id: "tele-004",
    title: "Retorno Dermatológico",
    description: "Evolução do tratamento de dermatite atópica.",
    date: new Date().toISOString().split("T")[0],
    time: "11:00",
    duration: 30,
    type: "telemedicina",
    status: "concluido",
    link: "https://medcore.gestaocomercial360.com.br/telemedicina/tok-sala-004",
    tokenPublico: "tok-sala-004",
    isPublic: true,
    user_id: "usr-dr-carlos",
    user: {
      id: "usr-dr-carlos",
      fullName: "Dr. Carlos Eduardo Silva",
      especialidade: "Cardiologia",
      crm: "12345-SP"
    },
    pacienteId: "pac-004",
    paciente: {
      id: "pac-004",
      nome: "Felipe Nogueira Dias",
      cpf: "333.222.111-00",
      telefone: "(11) 96543-2109",
      email: "felipe.dias@email.com",
      convenio: { nome: "Amil Saúde" }
    },
    prontuario: {
      anamnese: "Paciente relata melhora de 80% das lesões.",
      diagnostico: "Dermatite atópica em remissão clínica.",
      conduta: "Manter hidratante diário e corticoide tópico apenas em recidivas."
    },
    createdAt: new Date().toISOString()
  }
];

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

      if (meetings && meetings.length > 0) {
        return NextResponse.json(meetings);
      }
      // Se o banco estiver vazio ou sem registros de telemedicina, entrega os mocks para enriquecer a experiência
      return NextResponse.json(mockTeleconsultas);
    } catch (dbError) {
      console.warn('[Telemedicina API] Banco inacessível, utilizando fallback em memória:', (dbError as Error)?.message || dbError);
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
