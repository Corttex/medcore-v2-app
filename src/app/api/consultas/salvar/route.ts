import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    
    // Obter dados da consulta finalizada
    const body = await request.json();
    const { 
      pacienteId,
      pacienteNome,
      mode = "medico", // "medico" | "estetica"
      hipoteses = [],
      medicamentos = [],
      procedimentos = [],
      exames = [],
      observacoes = "",
      transcricao = "",
      unitId: reqUnitId
    } = body;

    // Médico autenticado ou fallback do admin/primeiro usuário
    let medicoId = session?.user?.id;
    if (!medicoId) {
      const defaultUser = await prisma.user.findFirst({
        where: { role: { in: ['admin', 'medico', 'super_admin'] } }
      });
      medicoId = defaultUser?.id;
    }

    if (!medicoId) {
      return NextResponse.json({ error: "Nenhum profissional médico identificado." }, { status: 400 });
    }

    // Unidade
    let unitId = reqUnitId || session?.user?.primaryUnitId;
    if (!unitId) {
      const defaultUnit = await prisma.unit.findFirst();
      unitId = defaultUnit?.id;
    }

    if (!unitId) {
      return NextResponse.json({ error: "Nenhuma unidade hospitalar ativa." }, { status: 400 });
    }

    // Garantir paciente no banco
    let targetPacienteId = pacienteId;
    if (!targetPacienteId && pacienteNome) {
      // Buscar por nome ou criar paciente rápido
      const existing = await prisma.paciente.findFirst({
        where: { nome: { contains: pacienteNome, mode: 'insensitive' } }
      });

      if (existing) {
        targetPacienteId = existing.id;
      } else {
        const novoPaciente = await prisma.paciente.create({
          data: {
            nome: pacienteNome,
            unitId,
          }
        });
        targetPacienteId = novoPaciente.id;
      }
    }

    if (!targetPacienteId) {
      // Cria um paciente genérico se nenhum foi especificado
      const pacienteAvulso = await prisma.paciente.create({
        data: {
          nome: pacienteNome || "Paciente Atendimento Avulso",
          unitId
        }
      });
      targetPacienteId = pacienteAvulso.id;
    }

    // Preparar conteúdo estruturado do documento
    const conteudoDocumento = {
      tipoConsulta: mode,
      dataHora: new Date().toISOString(),
      pacienteNome: pacienteNome || "Paciente",
      hipoteses,
      medicamentos,
      procedimentos,
      exames,
      observacoes,
      transcricaoCrua: transcricao,
      aprovadoPorMedico: true,
      dataAprovacao: new Date().toISOString()
    };

    const tipoDoc = mode === "estetica" ? "TERMO_ESTETICA" : "RECEITA";

    // Salvar em DocumentoMedico
    const documento = await prisma.documentoMedico.create({
      data: {
        tipo: tipoDoc,
        conteudo: JSON.stringify(conteudoDocumento),
        pacienteId: targetPacienteId,
        medicoId,
        unitId
      },
      include: {
        paciente: true,
        medico: {
          select: {
            fullName: true,
            crm: true,
            crmUf: true,
            especialidade: true
          }
        }
      }
    });

    // Se for modo médico, registrar também como Prontuário / Meeting se aplicável
    try {
      const meeting = await prisma.meeting.create({
        data: {
          title: mode === 'estetica' ? 'Procedimento Estético com Dra. Conte' : 'Consulta Médica com Dra. Conte',
          user_id: medicoId,
          pacienteId: targetPacienteId,
          unitId,
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          status: 'concluido',
          type: mode === 'estetica' ? 'Procedimento Estético' : 'Consulta Médica',
          description: observacoes || (hipoteses[0]?.diagnostico || 'Atendimento assistido por Dra. Conte')
        }
      });

      await prisma.prontuario.create({
        data: {
          meetingId: meeting.id,
          anamnese: transcricao || "Atendimento via Dra. Conte Live Copilot",
          diagnostico: hipoteses.map((h: any) => `${h.diagnostico} (${h.cid || 'S/ CID'})`).join('; '),
          prescricao: medicamentos.map((m: any) => `${m.nome} - ${m.dosagem}: ${m.posologia}`).join('\n'),
          conduta: procedimentos.map((p: any) => `${p.nome}: ${p.indicacao}`).join('\n') || observacoes,
          resumoJSON: JSON.stringify(conteudoDocumento)
        }
      });
    } catch (e) {
      console.warn("Aviso ao criar meeting/prontuário:", e);
    }

    return NextResponse.json({
      success: true,
      message: "Atendimento e documento oficial salvos com sucesso!",
      documentoId: documento.id,
      pacienteId: targetPacienteId
    });

  } catch (error: any) {
    console.error("Erro ao salvar consulta finalizada:", error);
    return NextResponse.json({ error: "Falha ao salvar atendimento no prontuário." }, { status: 500 });
  }
}
