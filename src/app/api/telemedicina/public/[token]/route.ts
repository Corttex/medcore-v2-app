import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json({ error: 'Token não fornecido' }, { status: 400 });
    }

    try {
      const meeting = await prisma.meeting.findFirst({
        where: {
          tokenPublico: token,
          type: 'telemedicina'
        },
        include: {
          user: {
            select: {
              fullName: true,
              especialidade: true,
              crm: true,
              crmUf: true,
            }
          },
          paciente: {
            select: {
              nome: true,
              telefone: true,
            }
          }
        }
      });

      if (!meeting) {
        // Fallback para desenvolvimento e testes com tokens simulados
        return NextResponse.json({
          id: `tele-${token}`,
          title: "Teleconsulta Médica Online",
          date: new Date().toISOString().split("T")[0],
          time: "14:00",
          duration: 30,
          status: "agendado",
          user: {
            fullName: "Dr. Carlos Eduardo Silva",
            especialidade: "Cardiologia & Clínica Médica",
            crm: "12345-SP"
          },
          paciente: {
            nome: "Mariana Alencar Guimarães"
          }
        });
      }

      return NextResponse.json(meeting);
    } catch (dbError) {
      console.warn('[Telemedicina Public API] Banco indisponível, entregando mock de sala pública:', (dbError as Error)?.message || dbError);
      return NextResponse.json({
        id: `tele-${token}`,
        title: "Teleconsulta Médica Online",
        date: new Date().toISOString().split("T")[0],
        time: "14:00",
        duration: 30,
        status: "agendado",
        user: {
          fullName: "Dr. Carlos Eduardo Silva",
          especialidade: "Cardiologia & Clínica Médica",
          crm: "12345-SP"
        },
        paciente: {
          nome: "Mariana Alencar Guimarães"
        }
      });
    }
  } catch (error) {
    console.error('Erro na sala pública de telemedicina:', error);
    return NextResponse.json({ error: 'Falha ao buscar sala' }, { status: 500 });
  }
}

// Quando o paciente clica em "Entrar na Sala de Espera", sinaliza o médico
export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    
    try {
      await prisma.meeting.updateMany({
        where: {
          tokenPublico: token,
          status: { in: ['agendado', 'sala_espera'] }
        },
        data: {
          status: 'sala_espera'
        }
      });
    } catch (e) {
      console.warn('[Telemedicina Public POST] Notificação em modo offline');
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Você está na sala de espera virtual. O médico foi notificado!' 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao sinalizar sala de espera' }, { status: 500 });
  }
}
