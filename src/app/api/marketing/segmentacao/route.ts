import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sexo, inatividadeDias, leadSource, unitId, possuiPacoteAtivo } = body;

    // Buscar todos os pacientes com base na unidade ou geral
    let pacientes = await prisma.paciente.findMany({
      where: unitId ? { unitId } : {},
      include: {
        meetings: {
          orderBy: { date: 'desc' },
          take: 1
        },
        pacotesAdquiridos: true
      }
    });

    let filtrados = pacientes;

    // Filtro por Sexo
    if (sexo && sexo !== "TODOS") {
      filtrados = filtrados.filter(p => p.sexo?.toUpperCase() === sexo.toUpperCase());
    }

    // Filtro por Origem do Lead
    if (leadSource && leadSource !== "TODOS") {
      filtrados = filtrados.filter(p => p.leadSource?.toLowerCase() === leadSource.toLowerCase());
    }

    // Filtro por Pacote Ativo
    if (possuiPacoteAtivo !== undefined && possuiPacoteAtivo !== null) {
      filtrados = filtrados.filter(p => {
        const temPacoteAtivo = p.pacotesAdquiridos.some(pac => pac.status === 'ATIVO');
        return possuiPacoteAtivo ? temPacoteAtivo : !temPacoteAtivo;
      });
    }

    // Filtro por Inatividade (dias desde a última consulta)
    if (inatividadeDias && Number(inatividadeDias) > 0) {
      const limiteData = new Date();
      limiteData.setDate(limiteData.getDate() - Number(inatividadeDias));

      filtrados = filtrados.filter(p => {
        if (!p.meetings || p.meetings.length === 0) return true; // sem consulta = inativo
        const ultimaConsulta = new Date(p.meetings[0].date);
        return ultimaConsulta <= limiteData;
      });
    }

    return NextResponse.json({
      totalEncontrados: filtrados.length,
      pacientes: filtrados.slice(0, 15).map(p => ({
        id: p.id,
        nome: p.nome,
        telefone: p.telefone || p.cpf || "Sem número",
        email: p.email || "Sem e-mail",
        sexo: p.sexo || "Não informado",
        ultimaConsulta: p.meetings[0]?.date || "Nenhuma consulta",
        leadSource: p.leadSource || "Manual"
      }))
    });
  } catch (error: any) {
    console.error("Erro na segmentação de público:", error);
    return NextResponse.json({ error: "Erro na segmentação", details: error.message }, { status: 500 });
  }
}
