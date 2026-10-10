import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const genAI = geminiKey ? new GoogleGenerativeAI(geminiKey) : null;

// Fallback Heurístico para modo Médico
function generateMockClinicalSuggestions(transcript: string) {
  const lower = transcript.toLowerCase();
  
  const hipoteses = [];
  const medicamentos = [];
  const exames = [];
  const alertas = [];

  if (lower.includes("dor de cabeça") || lower.includes("enxaqueca") || lower.includes("cefaleia") || lower.includes("cabeça")) {
    hipoteses.push({
      diagnostico: "Cefaleia Tensional Episódica",
      cid: "G44.2",
      probabilidade: "Alta",
      justificativa: "Relato de dor de cabeça referida pelo paciente, padrão compatível com estresse ou tensão muscular."
    });
    hipoteses.push({
      diagnostico: "Enxaqueca sem aura",
      cid: "G43.0",
      probabilidade: "Média",
      justificativa: "A ser diferenciado caso haja fotofobia, náusea ou caráter pulsátil unilateral."
    });

    medicamentos.push({
      nome: "Dipirona Monoidratada",
      dosagem: "1 g",
      posologia: "Tomar 01 comprimido por via oral a cada 6 horas se dor de cabeça intensa.",
      duracao: "Uso se necessário (máx. 3 dias)",
      justificativa: "Analgésico de primeira linha para alívio rápido de cefaleias agudas."
    });
    medicamentos.push({
      nome: "Sumatriptana",
      dosagem: "50 mg",
      posologia: "Tomar 01 comprimido ao primeiro sinal de dor intensa se padrão enxaquecoso.",
      duracao: "Uso na crise",
      justificativa: "Triptano indicado se confirmada crise migranosa refratária a analgésicos simples."
    });
    exames.push({
      nome: "Avaliação Oftalmológica / Fundo de Olho",
      motivo: "Descartar vício de refração ou hipertensão intracraniana."
    });
  } else if (lower.includes("garganta") || lower.includes("febre") || lower.includes("tosse") || lower.includes("gripe")) {
    hipoteses.push({
      diagnostico: "Faringoamigdalite Aguda",
      cid: "J03.9",
      probabilidade: "Alta",
      justificativa: "Queixa de odinofagia, febre referida e sintomas de vias aéreas superiores."
    });
    hipoteses.push({
      diagnostico: "Infecção de Vias Aéreas Superiores (IVAS)",
      cid: "J06.9",
      probabilidade: "Média",
      justificativa: "Quadro viral comum com acometimento rinofaríngeo."
    });

    medicamentos.push({
      nome: "Ibuprofeno",
      dosagem: "600 mg",
      posologia: "Tomar 01 comprimido por via oral a cada 8 horas após as refeições por 3 a 5 dias.",
      duracao: "3 a 5 dias",
      justificativa: "Anti-inflamatório e antipirético para alívio da dor de garganta e inflamação."
    });
    medicamentos.push({
      nome: "Amoxicilina + Clavulanato de Potássio",
      dosagem: "875 mg + 125 mg",
      posologia: "Tomar 01 comprimido por via oral a cada 12 horas por 7 a 10 dias (SE CONFIRMADA ETIOLOGIA BACTERIANA).",
      duracao: "7 a 10 dias",
      justificativa: "Antibiótico sugerido caso haja exsudato purulento ou critérios de Centor positivos."
    });
    exames.push({
      nome: "Hemograma Completo com PCR",
      motivo: "Avaliação do grau de leucocitose e atividade inflamatória sistêmica."
    });
  } else {
    // Caso Geral
    hipoteses.push({
      diagnostico: "Quadro Clínico em Investigação / Consulta Geral",
      cid: "R69",
      probabilidade: "Em avaliação",
      justificativa: "Sintomatologia preliminar captada durante a anamnese inicial."
    });
    medicamentos.push({
      nome: "Paracetamol",
      dosagem: "750 mg",
      posologia: "Tomar 01 comprimido por via oral a cada 6 a 8 horas se dor ou febre (máx. 3g/dia).",
      duracao: "Se necessário",
      justificativa: "Controle sintomático seguro para quadros inespecíficos."
    });
    exames.push({
      nome: "Exames Laboratoriais de Rotina (Hemograma, Glicemia, Lipidograma, Função Renal)",
      motivo: "Check-up e triagem bioquímica de rotina."
    });
  }

  alertas.push("Medicamentos e diagnósticos são sugestões algorítmicas de apoio. A validação e receita final exigem julgamento e assinatura do médico assistente.");

  return {
    resumoCaso: transcript ? `Paciente relata: "${transcript.slice(0, 180)}..."` : "Aguardando falas da consulta...",
    hipoteses,
    medicamentos,
    procedimentos: [],
    exames,
    alertas
  };
}

// Fallback Heurístico para modo Estética
function generateMockAestheticSuggestions(transcript: string) {
  const lower = transcript.toLowerCase();

  const hipoteses = [];
  const procedimentos = [];
  const medicamentos = [];
  const alertas = [];

  if (lower.includes("ruga") || lower.includes("botox") || lower.includes("expressão") || lower.includes("testa") || lower.includes("olhar")) {
    hipoteses.push({
      diagnostico: "Rugas Dinâmicas no Terço Superior da Face",
      cid: "L90.8",
      probabilidade: "Alta",
      justificativa: "Queixa de linhas de expressão evidentes em fronte, glabela e perioculares durante a mímica facial."
    });

    procedimentos.push({
      nome: "Toxina Botulínica Tipo A (Face Completa - Terço Superior)",
      regiao: "Glabela, Fronte e Linhas Periorbiculares (Pés de galinha)",
      indicacao: "Relaxamento temporário da musculatura hipercinética para suavização de rugas dinâmicas.",
      sessoes: "01 aplicação (Revisão e retoque em 15 dias)",
      cuidados: "Não deitar nas 4 horas seguintes, evitar atividade física intensa nas 24h pós-aplicação e não massagear a região."
    });

    medicamentos.push({
      nome: "Sérum Anti-idade com Peptídeos e Ácido Hialurônico",
      dosagem: "30 ml",
      posologia: "Aplicar 4 gotas no rosto limpo pela manhã e à noite, seguido de protetor solar.",
      duracao: "Uso contínuo homecare",
      justificativa: "Hidratação de barreira e potencialização da firmeza dérmica."
    });
  } else if (lower.includes("flacidez") || lower.includes("colágeno") || lower.includes("pescoço") || lower.includes("papada")) {
    hipoteses.push({
      diagnostico: "Flacidez Tissular Facial e Perda de Sustentação",
      cid: "L90.9",
      probabilidade: "Alta",
      justificativa: "Diminuição da síntese de colágeno dérmico e elastina compatível com cronoenvelhecimento."
    });

    procedimentos.push({
      nome: "Bioestimulador de Colágeno (Hidroxiapatita de Cálcio ou PLLA)",
      regiao: "Região malar, mandíbula e contorno facial inferior",
      indicacao: "Neocolagênese progressiva e melhora da espessura dérmica.",
      sessoes: "1 a 2 sessões com intervalo de 60 a 90 dias",
      cuidados: "Massagem suave na região (regra 5x5x5 para PLLA), hidratação oral abundante e uso estrito de protetor solar."
    });

    medicamentos.push({
      nome: "Colágeno Verisol com Silício Orgânico e Vitamina C",
      dosagem: "Sachês 2,5g",
      posologia: "Dissolver 01 sachê em 200ml de água e tomar uma vez ao dia, preferencialmente à noite.",
      duracao: "90 dias",
      justificativa: "Suporte nutricional precursor de síntese de colágeno tipo I."
    });
  } else {
    // Estética Geral / Limpeza / Revitalização
    hipoteses.push({
      diagnostico: "Desidratação Cutânea e Perda de Luminosidade",
      cid: "L85.3",
      probabilidade: "Média",
      justificativa: "Queixa de viço opaco e necessidade de revitalização facial preventiva."
    });

    procedimentos.push({
      nome: "Protocolo de Hidratação Profunda & Peeling Químico Suave",
      regiao: "Face completa e colo",
      indicacao: "Renovação celular superficial e hidratação com ácido hialurônico de baixo peso molecular.",
      sessoes: "Sessão inicial com reavaliação em 30 dias",
      cuidados: "Evitar exposição solar direta e aplicar protetor solar FPS 50+ a cada 3 horas."
    });

    medicamentos.push({
      nome: "Protetor Solar Facial com Cor FPS 60 / PPD alto",
      dosagem: "50 g",
      posologia: "Aplicar uniformemente no rosto 15 minutos antes da exposição e reaplicar a cada 3 a 4 horas.",
      duracao: "Uso diário contínuo",
      justificativa: "Proteção contra fotoenvelhecimento, luz visível e hipercromias pós-inflamatórias."
    });
  }

  alertas.push("Lembrete: Procedimentos estéticos invasivos e injetáveis necessitam de anamnese prévia de alergias e assinatura do Termo de Consentimento Livre e Esclarecido (TCLE).");

  return {
    resumoCaso: transcript ? `Queixa estética relatada: "${transcript.slice(0, 180)}..."` : "Aguardando falas da consulta estética...",
    hipoteses,
    medicamentos,
    procedimentos,
    exames: [],
    alertas
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { transcript, mode = "medico", patientName = "" } = body;

    if (!transcript || typeof transcript !== "string" || transcript.trim().length === 0) {
      return NextResponse.json({
        resumoCaso: "Aguardando áudio da conversa...",
        hipoteses: [],
        medicamentos: [],
        procedimentos: [],
        exames: [],
        alertas: []
      });
    }

    // Se temos a API do Gemini configurada, executamos o processamento em tempo real
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = mode === "estetica"
          ? `Você é a Dra. Conte, médica e especialista em dermatologia estética e cosmiatria avançada no MEDCore.
Analise a transcrição de áudio em tempo real da conversa entre o profissional e o paciente:
"${transcript}"
Paciente: ${patientName || "Paciente em atendimento"}

Você deve retornar estritamente um JSON no seguinte formato (SEM crases de markdown e sem explicações fora do JSON):
{
  "resumoCaso": "Síntese concisa da queixa estética e histórico relatado até agora",
  "hipoteses": [
    {
      "diagnostico": "Nome da alteração estética ou diagnóstico dermatológico",
      "cid": "CID-10 ou código quando aplicável",
      "probabilidade": "Alta | Média | Baixa",
      "justificativa": "Por que esta hipótese foi levantada a partir da fala"
    }
  ],
  "procedimentos": [
    {
      "nome": "Nome do procedimento estético sugerido (ex: Toxina Botulínica, Bioestimulador, Preenchimento AH, Peeling)",
      "regiao": "Região anatômica indicada (ex: Glabela, terço médio, lábios)",
      "indicacao": "Objetivo estético do procedimento",
      "sessoes": "Sugestão de quantidade de sessões ou unidades",
      "cuidados": "Orientações pré e pós-procedimento imediatas"
    }
  ],
  "medicamentos": [
    {
      "nome": "Cosmecêutico, ativo ou medicação de suporte homecare",
      "dosagem": "Concentração ou dosagem sugerida",
      "posologia": "Modo de uso detalhado (ex: Aplicar à noite...)",
      "duracao": "Tempo de uso",
      "justificativa": "Objetivo clínico"
    }
  ],
  "exames": [],
  "alertas": ["Alertas sobre contraindicações estéticas, gestação, alergias ou necessidade de TCLE assinado"]
}
IMPORTANTE: As informações são apenas sugestões. O profissional de saúde terá controle total para aprovar ou rejeitar cada item.`
          : `Você é a Dra. Conte, médica assistente e copilot clínico de alta performance do sistema MEDCore.
Analise a transcrição de áudio em tempo real da consulta médica entre médico e paciente:
"${transcript}"
Paciente: ${patientName || "Paciente em atendimento"}

Você deve retornar estritamente um JSON no seguinte formato (SEM crases de markdown e sem explicações fora do JSON):
{
  "resumoCaso": "Síntese concisa das queixas e sintomas relatados pelo paciente até o momento",
  "hipoteses": [
    {
      "diagnostico": "Hipótese Diagnóstica",
      "cid": "Código CID-10 correspondente",
      "probabilidade": "Alta | Média | Baixa",
      "justificativa": "Raciocínio clínico embasando esta hipótese com base nas queixas"
    }
  ],
  "medicamentos": [
    {
      "nome": "Nome do fármaco sugerido (genérico ou de referência)",
      "dosagem": "Concentração/Dose exata (ex: 500mg, 1g, 20mg)",
      "posologia": "Instrução clara de tomada (ex: Tomar 01 comprimido por via oral de 8/8h)",
      "duracao": "Duração do tratamento (ex: por 7 dias, se dor)",
      "justificativa": "Razão clínica da prescrição sugerida"
    }
  ],
  "procedimentos": [],
  "exames": [
    {
      "nome": "Exame laboratorial ou de imagem sugerido",
      "motivo": "Indicação clínica do exame"
    }
  ],
  "alertas": ["Alertas clínicos relevantes, bandeiras vermelhas ou interações potenciais"]
}
IMPORTANTE: As informações são apenas sugestões para o médico. O médico assistente terá o controle de aprovar, editar e assinar a receita final.`;

        const response = await model.generateContent(prompt);
        const text = response.response.text().trim();
        const cleanJson = text.replace(/^```json/i, "").replace(/^```/i, "").replace(/```$/i, "").trim();
        const parsed = JSON.parse(cleanJson);

        return NextResponse.json(parsed);
      } catch (geminiErr) {
        console.warn("Erro ao processar no Gemini, utilizando fallback clínico:", geminiErr);
        const fallback = mode === "estetica"
          ? generateMockAestheticSuggestions(transcript)
          : generateMockClinicalSuggestions(transcript);
        return NextResponse.json(fallback);
      }
    }

    // Fallback padrão se não houver Gemini configurado
    const fallback = mode === "estetica"
      ? generateMockAestheticSuggestions(transcript)
      : generateMockClinicalSuggestions(transcript);
    return NextResponse.json(fallback);

  } catch (error: any) {
    console.error("Erro na rota de Live Consultation:", error);
    return NextResponse.json(
      { error: "Erro interno no processamento clínico ao vivo." },
      { status: 500 }
    );
  }
}
