import { NextResponse } from "next/server";
import { listChatSessions } from "@/lib/services/publicChatStore";

const globalForPipeline = globalThis as unknown as {
  __medcorePipelineLeads?: any[];
};

const initialLeads: any[] = [
  {
    id: "lead-pipe-1",
    nome: "Clínica Dermatológica & Estética Prime",
    donoOuResponsavel: "Dra. Mariana Vasconcellos (Sócia-Fundadora)",
    especialidade: "Dermatologia & Estética Avançada",
    endereco: "Av. Jandira, 257 - Conjunto 42, Moema, São Paulo",
    telefone: "(11) 3456-7890",
    whatsapp: "5511987654321",
    email: "contato@dermaprime.com.br",
    avaliacaoGoogle: 4.8,
    totalAvaliacoes: 56,
    status: "VISITA_AGENDADA", // NOVO | WHATSAPP_ENVIADO | VISITA_AGENDADA | VISITADO | FECHADO | DECLINADO
    planoAlvo: "MedCore Black (R$ 1.890/mês)",
    dataCriacao: new Date(Date.now() - 86400000 * 2).toISOString(),
    proximaAcao: "Apresentar demonstração ao vivo para o médico sócio às 14h30",
    anotacoes: "Recepção muito receptiva. Médica atende terças e quintas à tarde. Reclamaram de faltas de pacientes em procedimentos de botox."
  }
];

function getPipelineLeads(): any[] {
  if (!globalForPipeline.__medcorePipelineLeads) {
    globalForPipeline.__medcorePipelineLeads = [...initialLeads];
  }
  return globalForPipeline.__medcorePipelineLeads;
}

export async function GET() {
  const pipelineLeads = getPipelineLeads();

  // Sincroniza leads capturados pelo Widget de Chat Público sem duplicar os já salvos no funil
  const chatLeads = listChatSessions()
    .filter((s) => s.whatsapp || s.visitorName !== "Visitante da Landing Page")
    .filter(
      (s) =>
        !pipelineLeads.some(
          (l) =>
            l.chatSessionId === s.id ||
            l.nome.toLowerCase() === s.clinicName.toLowerCase()
        )
    )
    .map((s) => {
      const lastVisitorMsg = [...s.messages]
        .reverse()
        .find((m) => m.sender === "visitor");
      return {
        id: `chat-lead-${s.id}`,
        chatSessionId: s.id,
        nome:
          s.clinicName && s.clinicName !== "Clínica em Avaliação"
            ? s.clinicName
            : `${s.visitorName} (Chat Landing Page)`,
        donoOuResponsavel: s.visitorName,
        especialidade: s.specialty || s.intentLabel,
        endereco: `Origem: ${s.sourcePage}`,
        telefone: s.whatsapp || "Chat ao Vivo",
        whatsapp: (s.whatsapp || "").replace(/\D/g, ""),
        email: s.email || "",
        avaliacaoGoogle: 5.0,
        totalAvaliacoes: s.messages.length,
        status: s.status === "CONVERTIDO" ? "FECHADO" : "NOVO",
        planoAlvo:
          s.intent === "planos"
            ? "MedCore Growth / Business"
            : "MedCore Black (R$ 1.890/mês)",
        dataCriacao: s.createdAt,
        proximaAcao: `Responder no Chat Ao Vivo / WhatsApp (${s.intentLabel})`,
        anotacoes: lastVisitorMsg
          ? `Última mensagem no chat: "${lastVisitorMsg.text}"`
          : `Iniciou chat via opção: ${s.intentLabel}`,
      };
    });

  const mergedLeads = [...pipelineLeads, ...chatLeads];

  return NextResponse.json({
    success: true,
    total: mergedLeads.length,
    leads: mergedLeads,
  });
}

export async function POST(req: Request) {
  try {
    const pipelineLeads = getPipelineLeads();
    const body = await req.json();
    const { lead, customData } = body;

    if (!lead || !lead.nome) {
      return NextResponse.json({ error: "Dados do lead são obrigatórios" }, { status: 400 });
    }

    // Verifica se já existe no pipeline
    const existingIndex = pipelineLeads.findIndex(l => l.nome.toLowerCase() === lead.nome.toLowerCase());
    
    if (existingIndex >= 0) {
      // Atualiza lead existente
      pipelineLeads[existingIndex] = {
        ...pipelineLeads[existingIndex],
        ...lead,
        ...customData,
        dataAtualizacao: new Date().toISOString()
      };
      return NextResponse.json({
        success: true,
        message: "Lead atualizado no Pipeline!",
        lead: pipelineLeads[existingIndex]
      });
    }

    // Cria novo registro no funil de prospecção
    const newPipeLead = {
      id: `pipe-${Date.now()}`,
      nome: lead.nome,
      donoOuResponsavel: lead.donoOuResponsavel || "A preencher",
      especialidade: lead.especialidade || "Clínica Médica",
      endereco: lead.endereco || "",
      telefone: lead.telefone || "",
      whatsapp: lead.whatsapp || "",
      email: lead.email || "",
      avaliacaoGoogle: lead.avaliacaoGoogle || 4.5,
      totalAvaliacoes: lead.totalAvaliacoes || 10,
      status: "NOVO",
      planoAlvo: lead.planoRecomendado || "MedCore Black (R$ 1.890/mês)",
      dataCriacao: new Date().toISOString(),
      proximaAcao: "Enviar primeiro WhatsApp consultivo e agendar visita porta a porta",
      anotacoes: lead.pitchRapido || "",
      ...customData
    };

    pipelineLeads.unshift(newPipeLead);

    return NextResponse.json({
      success: true,
      message: "🎉 Lead inserido com sucesso no Pipeline de Prospecção!",
      lead: newPipeLead
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const pipelineLeads = getPipelineLeads();
    const body = await req.json();
    const { id, updates } = body;

    const leadIndex = pipelineLeads.findIndex((l) => l.id === id);
    if (leadIndex === -1) {
      if (typeof id === "string" && id.startsWith("chat-lead-")) {
        const promotedLead = {
          id,
          chatSessionId: id.replace("chat-lead-", ""),
          ...updates,
          dataAtualizacao: new Date().toISOString(),
        };
        pipelineLeads.unshift(promotedLead);
        return NextResponse.json({
          success: true,
          message: "Lead do chat promovido e atualizado no Pipeline!",
          lead: promotedLead,
        });
      }
      return NextResponse.json({ error: "Lead não encontrado" }, { status: 404 });
    }

    pipelineLeads[leadIndex] = {
      ...pipelineLeads[leadIndex],
      ...updates,
      dataAtualizacao: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Ficha do lead atualizada com sucesso!",
      lead: pipelineLeads[leadIndex],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
