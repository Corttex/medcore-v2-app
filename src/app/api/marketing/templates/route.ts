import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PREBUILT_TEMPLATES = [
  {
    titulo: "NPS Pós-Consulta (Padrão WhatsApp)",
    categoria: "POS_CONSULTA",
    canal: "WHATSAPP",
    conteudo: "Olá {{nome}}! Como foi seu atendimento ontem no MEDCore com Dr(a). {{nome_medico}}? Sua opinião é preciosa para nós. De 0 a 10, que nota você nos dá?"
  },
  {
    titulo: "Feliz Aniversário + Mimo Especial",
    categoria: "ANIVERSARIO",
    canal: "WHATSAPP",
    conteudo: "Parabéns, {{nome}}! 🎉 Em comemoração ao seu aniversário, preparamos um cupom especial de 20% OFF no seu próximo procedimento. Agende hoje: {{link_agendamento}}"
  },
  {
    titulo: "Up-Sell Renovação de Pacote",
    categoria: "UPSELL",
    canal: "WHATSAPP",
    conteudo: "Olá {{nome}}! Seu pacote {{nome_pacote}} está acabando (restam poucas sessões). Que tal renovar agora com 15% de desconto para não pausar seu tratamento?"
  },
  {
    titulo: "Convite Botox Day / Evento Especial",
    categoria: "PROMO",
    canal: "WHATSAPP",
    conteudo: "Olá {{nome}}! No próximo dia 20 teremos o nosso exclusivo Botox Day no MEDCore. Vagas limitadas e condições únicas! Reserve o seu horário: {{link_agendamento}}"
  },
  {
    titulo: "Recuperação de Consulta Ausente",
    categoria: "RECUPERACAO",
    canal: "WHATSAPP",
    conteudo: "Olá {{nome}}, sentimos sua falta na consulta agendada. Teve algum imprevisto? Podemos reagendar sem nenhum custo adicional. Escolha o melhor dia: {{link_agendamento}}"
  },
  {
    titulo: "E-mail Educativo Check-up Pré preventivo",
    categoria: "GERAL",
    canal: "EMAIL",
    assunto: "Cuide de quem você ama: Seu check-up anual no MEDCore",
    conteudo: "Olá {{nome}},\n\nA prevenção é o melhor caminho para uma vida longa e saudável. Recomendamos realizar seus exames preventivos anuais.\n\nClique no link para escolher a melhor data e horário para seu atendimento: {{link_agendamento}}\n\nAbraços,\nEquipe MEDCore."
  }
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const unitId = searchParams.get('unitId');

    let templates = await prisma.templateMensagem.findMany({
      where: unitId ? { unitId } : {},
      orderBy: { createdAt: 'desc' },
    });

    if (templates.length === 0) {
      for (const item of PREBUILT_TEMPLATES) {
        await prisma.templateMensagem.create({
          data: {
            ...item,
            unitId: unitId || null
          }
        });
      }
      templates = await prisma.templateMensagem.findMany({
        where: unitId ? { unitId } : {},
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(templates);
  } catch (error: any) {
    console.error("Erro ao buscar templates:", error);
    return NextResponse.json({ error: "Erro ao buscar templates", details: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { titulo, categoria, canal, assunto, conteudo, unitId } = body;

    if (!titulo || !conteudo) {
      return NextResponse.json({ error: "Título e conteúdo são obrigatórios" }, { status: 400 });
    }

    const novoTemplate = await prisma.templateMensagem.create({
      data: {
        titulo,
        categoria: categoria || "GERAL",
        canal: canal || "WHATSAPP",
        assunto,
        conteudo,
        unitId: unitId || null
      }
    });

    return NextResponse.json(novoTemplate, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao criar template:", error);
    return NextResponse.json({ error: "Erro ao criar template", details: error.message }, { status: 500 });
  }
}
