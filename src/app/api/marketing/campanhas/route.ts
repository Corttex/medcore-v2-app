import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const INITIAL_CAMPAIGNS = [
  {
    nome: "Campanha Botox Day - Edição de Outubro",
    tipo: "WHATSAPP",
    status: "ATIVA",
    gatilho: "MANUAL",
    conteudoMensagem: "Olá {{nome}}! 🌸 Outubro chegou e preparamos a Edição Especial do Botox Day no MEDCore. Condições exclusivas para agendamentos feitos até sexta-feira! Garanta seu horário: {{link_agendamento}}",
    enviados: 1540,
    abertos: 1200,
    cliques: 350,
    conversoes: 45
  },
  {
    nome: "Lembrete de Check-up Anual e Prevenção",
    tipo: "EMAIL",
    status: "ATIVA",
    gatilho: "CHECKUP_RETORNO",
    assunto: "Está na hora de renovar seus exames de rotina, {{nome}}!",
    conteudoMensagem: "Olá {{nome}}, faz mais de 6 meses desde sua última consulta na clínica MEDCore. Cuide da sua saúde preventivamente. Clique para agendar seu retorno com o Dr. {{nome_medico}}: {{link_agendamento}}",
    enviados: 850,
    abertos: 420,
    cliques: 95,
    conversoes: 18
  },
  {
    nome: "Up-Sell: Renovação de Pacote Estético",
    tipo: "WHATSAPP",
    status: "ATIVA",
    gatilho: "UPSELL_PACOTE",
    conteudoMensagem: "Olá {{nome}}! Notamos que seu pacote {{nome_pacote}} está prestes a terminar. Para manter seus ótimos resultados, preparamos 15% OFF na renovação antecipada esta semana! Fale conosco!",
    enviados: 310,
    abertos: 290,
    cliques: 140,
    conversoes: 38
  },
  {
    nome: "Pesquisa NPS - Pós Consulta 24h",
    tipo: "WHATSAPP",
    status: "ATIVA",
    gatilho: "NPS_POS_CONSULTA",
    conteudoMensagem: "Olá {{nome}}, como foi sua consulta ontem no MEDCore com {{nome_medico}}? De 0 a 10, como você avalia nosso atendimento? Responda esta mensagem!",
    enviados: 620,
    abertos: 580,
    cliques: 310,
    conversoes: 110
  },
  {
    nome: "Resgate de Pacientes Ausentes / Faltas",
    tipo: "WHATSAPP",
    status: "ATIVA",
    gatilho: "RECUPERACAO_FALTA",
    conteudoMensagem: "Sentimos sua falta, {{nome}}! Notei que você não pôde comparecer à sua consulta. Gostaria de reagendar sem custo de taxa? Escolha um novo horário aqui: {{link_agendamento}}",
    enviados: 190,
    abertos: 165,
    cliques: 72,
    conversoes: 24
  }
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const unitId = searchParams.get('unitId');

    const campanhas = await prisma.campanha.findMany({
      where: unitId ? { unitId } : {},
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(campanhas);
  } catch (error: any) {
    console.error("Erro ao buscar campanhas:", error);
    return NextResponse.json({ error: "Erro ao buscar campanhas", details: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nome, tipo, gatilho, conteudoMensagem, assunto, segmentoFiltro, unitId } = body;

    if (!nome || !conteudoMensagem) {
      return NextResponse.json({ error: "Nome e conteúdo da mensagem são obrigatórios" }, { status: 400 });
    }

    const novaCampanha = await prisma.campanha.create({
      data: {
        nome,
        tipo: tipo || "WHATSAPP",
        status: "ATIVA",
        gatilho: gatilho || "MANUAL",
        conteudoMensagem,
        assunto,
        segmentoFiltro: segmentoFiltro ? JSON.stringify(segmentoFiltro) : null,
        unitId: unitId || null,
        enviados: 0,
        abertos: 0,
        cliques: 0,
        conversoes: 0
      }
    });

    return NextResponse.json(novaCampanha, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao criar campanha:", error);
    return NextResponse.json({ error: "Erro ao criar campanha", details: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, status, nome, conteudoMensagem, assunto } = body;

    if (!id) {
      return NextResponse.json({ error: "ID da campanha é obrigatório" }, { status: 400 });
    }

    const campanhaAtualizada = await prisma.campanha.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(nome && { nome }),
        ...(conteudoMensagem && { conteudoMensagem }),
        ...(assunto !== undefined && { assunto }),
      }
    });

    return NextResponse.json(campanhaAtualizada);
  } catch (error: any) {
    console.error("Erro ao atualizar campanha:", error);
    return NextResponse.json({ error: "Erro ao atualizar campanha", details: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "ID da campanha é obrigatório" }, { status: 400 });
    }

    await prisma.campanha.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Campanha excluída com sucesso" });
  } catch (error: any) {
    console.error("Erro ao excluir campanha:", error);
    return NextResponse.json({ error: "Erro ao excluir campanha", details: error.message }, { status: 500 });
  }
}
