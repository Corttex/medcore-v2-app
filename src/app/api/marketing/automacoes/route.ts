import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_AUTOMACOES = [
  {
    nome: "NPS e Avaliação Pós-Consulta",
    gatilho: "NPS_POS_CONSULTA",
    ativo: true,
    canal: "WHATSAPP",
    diasAtraso: 1, // 24h após a consulta
    conteudoMensagem: "Olá {{nome}}! Como foi sua experiência na consulta de ontem com Dr(a). {{nome_medico}}? De 0 a 10, que nota você daria para o nosso atendimento?",
  },
  {
    nome: "Mensagem e Mimo de Aniversário",
    gatilho: "ANIVERSARIO",
    ativo: true,
    canal: "WHATSAPP",
    diasAtraso: 0, // No dia do aniversário
    conteudoMensagem: "Parabéns, {{nome}}! 🎉 A equipe MEDCore deseja um feliz aniversário! Como nosso presente, preparamos um voucher de R$ 100 de desconto no seu próximo procedimento. Aproveite!",
  },
  {
    nome: "Lembrete de Check-up & Retorno (180 dias)",
    gatilho: "CHECKUP_RETORNO",
    ativo: true,
    canal: "EMAIL",
    diasAtraso: 180, // 6 meses após a última consulta
    assunto: "Cuide da sua saúde: Hora de renovar seu check-up no MEDCore",
    conteudoMensagem: "Olá {{nome}}, saúde e prevenção andam juntas! Já faz 6 meses desde o seu último atendimento. Que tal agendar sua consulta preventiva? Acesse: {{link_agendamento}}",
  },
  {
    nome: "CRM Up-Sell: Renovação de Pacote Tratamento",
    gatilho: "UPSELL_PACOTE",
    ativo: true,
    canal: "WHATSAPP",
    diasAtraso: 0, // Disparado quando resta 1 ou 2 sessões
    conteudoMensagem: "Olá {{nome}}! Faltam poucas sessões para você concluir seu pacote de {{nome_pacote}}. Para garantir a manutenção dos resultados sem interrupção, temos uma condição especial de renovação!",
  },
  {
    nome: "Recuperação de Consulta Cancelada ou No-Show",
    gatilho: "RECUPERACAO_FALTA",
    ativo: true,
    canal: "WHATSAPP",
    diasAtraso: 2, // 48h após falta ou cancelamento
    conteudoMensagem: "Olá {{nome}}, vimos que você não conseguiu comparecer à sua consulta. Sabemos que imprevistos acontecem! Quer reagendar para esta semana sem nenhum custo? {{link_agendamento}}",
  }
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const unitId = searchParams.get('unitId');

    let automacoes = await prisma.automacaoMarketing.findMany({
      where: unitId ? { unitId } : {},
      orderBy: { createdAt: 'asc' },
    });

    // Se estiver vazio, popula as 5 automações padrão
    if (automacoes.length === 0) {
      for (const item of DEFAULT_AUTOMACOES) {
        await prisma.automacaoMarketing.create({
          data: {
            ...item,
            unitId: unitId || null
          }
        });
      }
      automacoes = await prisma.automacaoMarketing.findMany({
        where: unitId ? { unitId } : {},
        orderBy: { createdAt: 'asc' },
      });
    }

    return NextResponse.json(automacoes);
  } catch (error: any) {
    console.error("Erro ao buscar automações de marketing:", error);
    return NextResponse.json({ error: "Erro ao buscar automações", details: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ativo, conteudoMensagem, canal, diasAtraso, assunto } = body;

    if (!id) {
      return NextResponse.json({ error: "ID da automação é obrigatório" }, { status: 400 });
    }

    const automacaoAtualizada = await prisma.automacaoMarketing.update({
      where: { id },
      data: {
        ...(ativo !== undefined && { ativo }),
        ...(conteudoMensagem && { conteudoMensagem }),
        ...(canal && { canal }),
        ...(diasAtraso !== undefined && { diasAtraso }),
        ...(assunto !== undefined && { assunto }),
      }
    });

    return NextResponse.json(automacaoAtualizada);
  } catch (error: any) {
    console.error("Erro ao atualizar automação:", error);
    return NextResponse.json({ error: "Erro ao atualizar automação", details: error.message }, { status: 500 });
  }
}
