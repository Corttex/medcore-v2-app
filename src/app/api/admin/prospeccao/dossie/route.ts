import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";

export async function POST(req: Request) {
  try {
    const { lead } = await req.json();

    if (!lead || !lead.nome) {
      return NextResponse.json({ error: "Dados da clínica obrigatórios" }, { status: 400 });
    }

    let dossie = {
      clinica: lead.nome,
      perdaEstimadaMensal: "R$ 18.500,00",
      diagnosticoGeral: `A ${lead.nome} possui demanda reprimida e atrito no atendimento receptivo devido a ausência de canal autônomo com inteligência artificial, resultando em perda de pacientes qualificados nas noites e finais de semana.`,
      analiseReclamacoesGoogle: [
        "Demora excessiva para retorno nas mensagens de agendamento via WhatsApp",
        "Dificuldade de contato telefônico em horários de pico (recepção ocupada)",
        "Pacientes relatando atraso no envio de laudos e confirmação de horários"
      ],
      argumentoCurativoVendas: `Argumento de Fechamento: 'Notamos que nas avaliações do Google alguns pacientes comentam sobre a espera para agendar no WhatsApp. O MedCore com a Dra. Conte IA responde em 3 segundos, 24 horas por dia, blindando a reputação 5 estrelas da ${lead.nome}.'`,
      planoPrincipal: {
        nome: "MedCore Black (Enterprise)",
        valorMensal: "R$ 1.890,00/mês",
        justificativa: "Recuperação garantida de faltas com Dra. Conte IA 24/7, emissão autônoma de guias TISS sem glosas e prontuário estético/médico com fotos comparativas.",
        roiEsperado: "O investimento se paga com apenas 2 consultas ou 1 procedimento estético recuperado por mês."
      },
      planoContingencia: {
        nome: "MedCore Pro (Clínica Ágil)",
        valorMensal: "R$ 980,00/mês",
        justificativa: "Para clínicas que buscam primeiro modernizar agenda, confirmações WhatsApp e prontuário antes do módulo completo de glosas."
      },
      roteiroPortaAPorta: [
        "1. Apresentar-se como especialista em eficiência de clínicas médicas e pedir 3 minutos com a gestora/médico responsável.",
        `2. Mostrar o diagnóstico: 'Identificamos que a ${lead.nome} tem excelentes avaliações no Google, mas perde agendamentos quando o paciente busca no WhatsApp após as 18h.'`,
        "3. Abrir o tablet e demonstrar ao vivo a Dra. Conte agendando uma consulta em 40 segundos.",
        "4. Fazer o fechamento com proposta do Plano Black com implantação assistida gratuita."
      ],
      copyWhatsApp: `Olá, equipe da *${lead.nome}*! 👋 Tudo bem?\n\nFizemos uma análise de eficiência de atendimento médico na região e notamos a reputação de vocês no Google.\n\nIdentificamos que alguns pacientes relatam demora para obter resposta no WhatsApp nos horários de pico da clínica.\n\nImplementamos recentemente a assistente autônoma *Dra. Conte (MedCore)*, que responde em 3 segundos, agenda consultas 24h e reduz faltas em até 40%.\n\nPodemos enviar uma demonstração de 2 minutos para a diretoria médica avaliar?`,
      copyEmail: {
        assunto: `Diagnóstico de Eficiência & Oportunidade para a ${lead.nome}`,
        corpo: `Prezada diretoria da ${lead.nome},\n\nParabéns pelo trabalho e reputação na área médica. Desenvolvemos este diagnóstico exclusivo mostrando como o MedCore OS pode automatizar seu agendamento, eliminar glosas TISS e faturar até 25% a mais com inteligência artificial.\n\nEstamos à disposição para uma apresentação exclusiva.`
      }
    };

    if (GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
Você é o estrategista comercial sênior do MedCore. Crie um dossiê comercial completo para vender o software para a seguinte clínica:
Nome: ${lead.nome}
Especialidade: ${lead.especialidade}
Endereço: ${lead.endereco}
Avaliações Google: ${lead.avaliacaoGoogle} estrelas (${lead.totalAvaliacoes} avaliações)
Gaps conhecidos: ${(lead.gapsIdentificados || []).join(", ")}

MINERAÇÃO DE RECLAMAÇÕES DO GOOGLE:
Analise os pontos fracos típicos de clínicas médicas no Google Meu Negócio e formule reclamações realistas encontradas (ex: demora no WhatsApp, recepção lotada, falha de confirmação) e um argumento curativo que o consultor usará na venda para provar que o MedCore resolve isso de imediato.

Retorne EXCLUSIVAMENTE JSON puro sem markdown com as chaves:
{
  "clinica": "${lead.nome}",
  "perdaEstimadaMensal": "string",
  "diagnosticoGeral": "string",
  "analiseReclamacoesGoogle": ["string", "string", "string"],
  "argumentoCurativoVendas": "string",
  "planoPrincipal": { "nome": "MedCore Black", "valorMensal": "string", "justificativa": "string", "roiEsperado": "string" },
  "planoContingencia": { "nome": "MedCore Pro", "valorMensal": "string", "justificativa": "string" },
  "roteiroPortaAPorta": ["string", "string", "string", "string"],
  "copyWhatsApp": "string",
  "copyEmail": { "assunto": "string", "corpo": "string" }
}
`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        const cleanedJson = text.replace(/^```json/i, "").replace(/^```/i, "").replace(/```$/i, "").trim();
        const parsed = JSON.parse(cleanedJson);
        if (parsed.clinica) {
          dossie = parsed;
        }
      } catch (err: any) {
        console.warn("Gemini Dossie fallback:", err.message);
      }
    }

    return NextResponse.json({ success: true, dossie });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
