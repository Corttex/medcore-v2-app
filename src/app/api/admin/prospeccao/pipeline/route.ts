import { NextResponse } from "next/server";

// Simulação de banco em memória / persistência local rápida para os leads em prospecção
let pipelineLeads: any[] = [
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

export async function GET() {
  return NextResponse.json({
    success: true,
    total: pipelineLeads.length,
    leads: pipelineLeads
  });
}

export async function POST(req: Request) {
  try {
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
    const body = await req.json();
    const { id, updates } = body;

    const leadIndex = pipelineLeads.findIndex(l => l.id === id);
    if (leadIndex === -1) {
      return NextResponse.json({ error: "Lead não encontrado" }, { status: 404 });
    }

    pipelineLeads[leadIndex] = {
      ...pipelineLeads[leadIndex],
      ...updates,
      dataAtualizacao: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: "Ficha do lead atualizada com sucesso!",
      lead: pipelineLeads[leadIndex]
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
