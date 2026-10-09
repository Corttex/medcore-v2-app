import { NextResponse } from 'next/server';
import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

const googleProvider = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
});

function cleanWhatsAppFormat(text: string): string {
  if (!text) return "";
  return text
    .replace(/[\uFFFD\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "") // Remove caracteres inválidos/estranhos
    .replace(/^###?\s*Opção\s*\d+:?\s*/gim, "") // Remove títulos de opção
    .replace(/\*\*(.*?)\*\*/g, "*$1*") // Converte markdown **bold** para WhatsApp *bold*
    .trim();
}

export async function POST(req: Request) {
  try {
    const { objetivo, tomVoz, canal, ofertaCupom, instrucoesAdicionais } = await req.json();

    const systemPrompt = `Você é o MEDCore AI Copywriter, especialista em Copywriting Médico e Marketing Clínico de alta conversão do MEDCore V2.
Sua missão é redigir copys persuasivas, elegantes, éticas (respeitando diretrizes do CFM/CFO) e de altíssimo engajamento para clínicas médicas, estéticas e odontológicas.

Instruções Principais de Formatação:
1. Tom de voz desejado: ${tomVoz || "Empático, Profissional e Persuasivo"}
2. Canal de Envio: ${canal || "WhatsApp"}
3. NEGRITO NO WHATSAPP: Use APENAS 1 ASTERISCO para negrito (exemplo: *Botox Day*, *15% OFF*, *Dr. Ricardo Silva*). NUNCA use duplo asterisco **texto**.
4. NUNCA use títulos com tralha (###, ##, #) nem caracteres estranhos.
5. MANTENHA todos os emojis e emoticons normais (🌸✨🗓️💖💉).
6. Use variáveis interpoladas como {{nome}}, {{nome_medico}}, {{link_agendamento}}, {{nome_pacote}}.
7. Separe as duas opções estritamente com a linha "===DIVIDER===" entre a Opção 1 e a Opção 2. Não coloque nenhum cabeçalho "Opção 1" ou "Opção 2" dentro do texto gerado.`;

    const userPrompt = `
Objetivo da Campanha/Mensagem: ${objetivo}
${ofertaCupom ? `Oferta / Condição Especial / Cupom: ${ofertaCupom}` : ''}
${instrucoesAdicionais ? `Instruções extras do cliente: ${instrucoesAdicionais}` : ''}

Escreva 2 opções de copy mantendo emojis e negritos com 1 asterisco (*exemplo*):
Opção 1 (Direta e Persuasiva)
===DIVIDER===
Opção 2 (Empática e Educativa)
`;

    const modelsToTry = [
      { id: 'gpt-4o-mini', model: openrouter('openai/gpt-4o-mini') },
      { id: 'llama-3.3-70b', model: openrouter('meta-llama/llama-3.3-70b-instruct') },
      { id: 'qwen-2.5-72b', model: openrouter('qwen/qwen-2.5-72b-instruct') }
    ];

    let resultText = "";

    for (const aiModel of modelsToTry) {
      try {
        const res = await generateText({
          model: aiModel.model,
          system: systemPrompt,
          prompt: userPrompt
        });
        resultText = res.text;
        break;
      } catch (err: any) {
        console.warn(`[MEDCore AI Copywriter] Modelo ${aiModel.id} falhou:`, err.message);
      }
    }

    if (!resultText) {
      if (canal === "EMAIL") {
        resultText = `Assunto: Especial para você no MEDCore, {{nome}}!\n\nOlá {{nome}},\n\nEsperamos que esteja bem! Preparamos algo exclusivo para você cuidar da sua saúde e bem-estar nesta semana.\n\n${objetivo}\n\nClique no link abaixo para agendar seu horário com preferência:\n{{link_agendamento}}\n\nAtenciosamente,\nEquipe MEDCore\n===DIVIDER===\nAssunto: {{nome}}, cuide do seu bem-estar no MEDCore ✨\n\nOlá {{nome}}!\n\nPassando para te lembrar que a prevenção é o melhor investimento para sua saúde.\n\n${objetivo}\n\nAgende sua consulta em 1 clique: {{link_agendamento}}`;
      } else {
        resultText = `🌟 *Olá, {{nome}}!*\nÉ hora de realçar sua beleza! ✨\n\nNo nosso *Botox Day*, aproveite *15% OFF* em todos os agendamentos até esta sexta-feira! 💉\n\n🗓️ *Não perca essa chance!* Agende já seu horário com {{nome_medico}}: {{link_agendamento}}\n\n===DIVIDER===\n🌺 *Oi, {{nome}}!*\nVocê sabia que cuidar de si é o melhor investimento? 🤗✨\n\nPara celebrar o *Botox Day*, oferecemos *15% OFF* para todos os agendamentos feitos até sexta-feira!\n\n🗓️ Confie em {{nome_medico}} e agende agora: {{link_agendamento}} 💖`;
      }
    }

    let opcao1 = "";
    let opcao2 = "";

    if (resultText.includes("===DIVIDER===")) {
      const parts = resultText.split("===DIVIDER===");
      opcao1 = cleanWhatsAppFormat(parts[0]);
      opcao2 = cleanWhatsAppFormat(parts[1]);
    } else if (resultText.includes("---")) {
      const parts = resultText.split("---");
      opcao1 = cleanWhatsAppFormat(parts[0]);
      opcao2 = cleanWhatsAppFormat(parts[1]);
    } else if (resultText.includes("Opção 2")) {
      const parts = resultText.split(/###?\s*Opção\s*2/i);
      opcao1 = cleanWhatsAppFormat(parts[0]);
      opcao2 = parts[1] ? cleanWhatsAppFormat(parts[1]) : "";
    } else {
      opcao1 = cleanWhatsAppFormat(resultText);
    }

    return NextResponse.json({
      copy: resultText,
      opcao1: opcao1 || resultText,
      opcao2: opcao2 || ""
    });
  } catch (error: any) {
    console.error("Erro no assistente de copy:", error);
    return NextResponse.json({ error: "Erro ao gerar copy", details: error.message }, { status: 500 });
  }
}
