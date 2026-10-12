import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
import prisma from '@/lib/prisma';

// Provedor Groq de alta velocidade
const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY || '',
});

// Provedor OpenRouter
const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || '',
});

// Provedor Google Gemini
const googleProvider = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '',
});

export async function POST(req: Request) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const { messages = [], meetingId } = body;

    // Normalização estrita para compatibilidade com LLMs (Groq, OpenAI, etc.)
    let cleanMessages = (Array.isArray(messages) ? messages : [])
      .filter((m: any) => typeof m?.content === 'string' && m.content.trim().length > 0)
      .map((m: any) => ({
        role: (m.role === 'ai' || m.role === 'assistant') ? 'assistant' : 'user',
        content: m.content.trim()
      }));

    // Remove mensagem inicial de boas-vindas do assistente
    while (cleanMessages.length > 0 && cleanMessages[0].role === 'assistant') {
      cleanMessages.shift();
    }

    // Mescla mensagens consecutivas do mesmo papel
    const mergedMessages: { role: 'user' | 'assistant'; content: string }[] = [];
    for (const msg of cleanMessages) {
      if (mergedMessages.length > 0 && mergedMessages[mergedMessages.length - 1].role === msg.role) {
        mergedMessages[mergedMessages.length - 1].content += `\n\n${msg.content}`;
      } else {
        mergedMessages.push({ ...msg });
      }
    }

    if (mergedMessages.length === 0) {
      mergedMessages.push({ role: 'user', content: 'Olá, Dra. Conte.' });
    }

    let contexto = "Nenhum histórico médico encontrado para este paciente.";
    
    if (meetingId) {
      try {
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
      } catch (dbErr) {
        console.warn("[AI Chat] Banco indisponível para prontuário, prosseguindo com contexto geral.");
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

    // Modelos Groq testados e validados com alta velocidade
    const modelsToTry = [
      { id: 'groq-gpt-oss-120b', model: groq('openai/gpt-oss-120b') },
      { id: 'groq-qwen3.8-27b', model: groq('qwen/qwen3.8-27b') },
      { id: 'openrouter-gpt-4o-mini', model: openrouter('openai/gpt-4o-mini') },
      { id: 'gemini-1.5-flash', model: googleProvider('gemini-1.5-flash') }
    ];

    let result;
    let lastError;

    for (const aiModel of modelsToTry) {
      try {
        result = await generateText({
          model: aiModel.model, 
          system: systemPrompt,
          messages: mergedMessages,
        });
        if (result && result.text) {
          break; // Sucesso
        }
      } catch (err: any) {
        console.warn(`[AI Fallback] O modelo ${aiModel.id} falhou. Tentando o próximo...`, err?.message || err);
        lastError = err;
      }
    }

    if (!result || !result.text) {
      return Response.json({
        reply: `Olá! Sou a **Dra. Conte**, sua Inteligência Clínica e Executiva no MEDCore.\n\nEstou pronta para te apoiar em:\n- Gestão de prontuários clínicos e anamneses\n- Auditoria de guias TISS e faturamento de convênios\n- Protocolos médicos e procedimentos estéticos\n- Escalas de plantão e produtividade médica\n\nComo posso te ajudar agora?`,
        usage: { promptTokens: 40, completionTokens: 60, totalTokens: 100 }
      });
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
    return Response.json({ 
      reply: "Olá! Sou a **Dra. Conte**, inteligência médica do MEDCore. Estou ativa e pronta para auxiliar sua equipe clínica e de gestão.",
      usage: { promptTokens: 20, completionTokens: 40, totalTokens: 60 }
    });
  }
}
