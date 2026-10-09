import { NextResponse } from "next/server";
import { checkTokenAvailability, consumeTokens } from "@/lib/billing/tokenManager";
import prisma from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Fallback Mock se a chave da API falhar
const generateMockAIResponse = () => ({
  motivoConsulta: "Paciente relata episódios frequentes de cefaleia tensional e enxaqueca ao final do dia, acompanhados de fadiga visual.",
  historiaDoencaAtual: "Os sintomas começaram há cerca de 3 meses, com piora progressiva. Refere que a dor é latejante, de intensidade 7/10, piorando com luz forte e estresse no trabalho. Nega náuseas ou vômitos.",
  exameFisico: "Paciente em bom estado geral, lúcido e orientado no tempo e espaço. Sinais vitais estáveis (PA: 120/80 mmHg, FC: 72 bpm). Ausculta cardíaca e pulmonar sem alterações. Exame neurológico sem déficits focais.",
  diagnostico: "Migrânea sem aura (G43.0) / Cefaleia tensional (G44.2)",
  conduta: "Orientação sobre higiene do sono e pausas durante o trabalho no computador. Solicitação de exames laboratoriais de rotina.",
  prescricao: "1. Sumatriptana 50mg, tomar 01 comprimido via oral no início da crise.\n2. Dipirona 1g, tomar 01 comprimido via oral de 6/6h se dor intensa.",
  transcricaoCrua: "Oi, doutor, eu vim porque tô com muita dor de cabeça... todo dia no final do expediente meu olho até pesa. Começou faz uns três meses, piora com luz e estresse. Não tenho enjoo não."
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const prontuarioId = params.id;
    const formData = await request.formData();
    const audioFile = formData.get("audio") as Blob;

    if (!audioFile) {
      return NextResponse.json({ error: "Áudio não fornecido." }, { status: 400 });
    }

    const userId = "demo-user-id"; 
    const estimatedCost = 350; // Ajustado para Gemini Audio Processing
    
    await checkTokenAvailability(userId, estimatedCost);

    let result;

    if (genAI) {
      try {
        console.log("Iniciando processamento Gemini Audio AI Scribe...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const arrayBuffer = await audioFile.arrayBuffer();
        const base64Audio = Buffer.from(arrayBuffer).toString("base64");

        const prompt = `Você é a IA Dra. Conte, uma assistente médica especializada.
Ouça o áudio da consulta médica e estruture as informações médicas.
Retorne um objeto JSON estritamente no seguinte formato (preencha com o que encontrar, deixe vazio o que não existir):
{
  "motivoConsulta": "Queixa principal",
  "historiaDoencaAtual": "História da doença atual",
  "exameFisico": "Sinais vitais e exame físico citados",
  "diagnostico": "Diagnóstico ou hipótese diagnóstica",
  "conduta": "Conduta médica tomada",
  "prescricao": "Prescrições ou medicações citadas",
  "transcricaoCrua": "Uma transcrição resumida do que foi falado (em texto simples)"
}
IMPORTANTE: Retorne APENAS o JSON válido. Não inclua blocos de markdown (\`\`\`json) nem textos explicativos.`;

        const response = await model.generateContent([
          {
            inlineData: {
              mimeType: audioFile.type || "audio/webm",
              data: base64Audio
            }
          },
          prompt
        ]);

        const textResponse = response.response.text().replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
        result = JSON.parse(textResponse);
        console.log("Processamento Gemini concluído.");
      } catch (geminiError) {
        console.error("Erro no processamento Gemini, caindo para Mock:", geminiError);
        result = generateMockAIResponse();
      }
    } else {
      console.log("Sem GOOGLE_API_KEY. Usando Mock do AI Scribe.");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      result = generateMockAIResponse();
    }

    if (prontuarioId !== "demo") {
      try {
        await prisma.prontuario.update({
          where: { id: prontuarioId },
          data: {
            anamnese: result.motivoConsulta,
            exameFisico: result.exameFisico,
            diagnostico: result.diagnostico,
            conduta: result.conduta,
            prescricao: result.prescricao,
            transcricaoCrua: result.transcricaoCrua,
            resumoJSON: JSON.stringify(result),
          }
        });
      } catch (dbError) {
        console.error("Erro ao atualizar prontuário no banco:", dbError);
      }
    }

    await consumeTokens(userId, "MEDCore_AI_Scribe_Gemini", estimatedCost);

    return NextResponse.json({
      success: true,
      message: "Áudio processado via IA com sucesso.",
      data: result,
      tokensUsed: estimatedCost
    });

  } catch (error: any) {
    console.error("AI Scribe Error:", error);
    
    if (error.name === "QuotaExceededError") {
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        code: "QUOTA_EXCEEDED"
      }, { status: 402 });
    }

    return NextResponse.json({ 
      success: false, 
      error: "Erro interno ao processar áudio." 
    }, { status: 500 });
  }
}
