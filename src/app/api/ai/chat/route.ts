import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

const googleProvider = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages, meetingId } = await req.json();

    let contexto = "Nenhum histórico médico encontrado para este paciente.";
    
    if (meetingId) {
      const prontuario = await prisma.prontuario.findUnique({
        where: { meetingId }
      });
      
      if (prontuario) {
        contexto = `
          Resumo do Prontuário Atual:
          ${prontuario.resumoJSON}
          
          Transcrição Bruta (se necessário):
          ${prontuario.transcricaoCrua}
        `;
      }
    }

    const systemPrompt = `Você é a Dra. Conte, a inteligência executiva e médica de IA do MEDCore V2.
Sua atuação é estritamente nichada e especializada na prática Médica, Veterinária, Odontológica, de Clínicas Gerais e Clínicas de Estética, além de gestão hospitalar/clínica e auditoria TISS.

**Contexto do Paciente / Prontuário:**
${contexto}

**Diretrizes Globais e Regras de Nicho:**
1. Responda exclusivamente em português, com tom clínico, executivo, profissional e empático.
2. Limite de Atuação: Seu foco é EXCLUSIVAMENTE saúde, medicina (humana e veterinária), odontologia, procedimentos estéticos clínicos, auditoria faturamento/TISS e gestão de saúde. Se o usuário fizer perguntas genéricas não relacionadas à saúde (ex: receitas de culinária, código de programação não médico, piadas genéricas), decline educadamente explicando que você é uma IA especializada na área da saúde e clínica.
3. Forneça respostas diretas, concisas e fundamentadas em evidências científicas e boas práticas de gestão em saúde.
4. Se perguntado sobre dados específicos do paciente, utilize estritamente o contexto fornecido acima.
`;

    // Modelos validados no OpenRouter com a chave atual
    const modelsToTry = [
      { id: 'gpt-4o-mini', model: openrouter('openai/gpt-4o-mini') },
      { id: 'llama-3.3-70b', model: openrouter('meta-llama/llama-3.3-70b-instruct') },
      { id: 'qwen-2.5-72b', model: openrouter('qwen/qwen-2.5-72b-instruct') },
      { id: 'deepseek-r1', model: openrouter('deepseek/deepseek-r1-distill-llama-70b') }
    ];

    let result;
    let lastError;

    for (const aiModel of modelsToTry) {
      try {
        result = await generateText({
          model: aiModel.model, 
          system: systemPrompt,
          messages,
        });
        break; // Se funcionou, sai do loop
      } catch (err: any) {
        console.warn(`[AI Fallback] O modelo ${aiModel.id} falhou. Tentando o próximo...`, err.message);
        lastError = err;
      }
    }

    if (!result) {
      throw lastError || new Error("Todos os modelos de inteligência artificial falharam.");
    }

    const usage = result.usage || {
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0
    };

    return Response.json({ 
      reply: result.text,
      usage: {
        promptTokens: usage.promptTokens || 0,
        completionTokens: usage.completionTokens || 0,
        totalTokens: usage.totalTokens || (usage.promptTokens || 0) + (usage.completionTokens || 0)
      }
    });
  } catch (error: any) {
    console.error("Erro no Chat:", error);
    return Response.json({ error: "Erro ao processar o chat", details: error.message }, { status: 500 });
  }
}
