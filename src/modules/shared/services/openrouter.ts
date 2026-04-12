// OpenRouter AI Service — compatível com formato OpenAI
// Modelos gratuitos disponíveis:
//   - google/gemma-4-31b-it:free
//   - minimax/minimax-m2.5:free

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

export type OpenRouterModel = 
  | "google/gemma-4-31b-it:free"
  | "minimax/minimax-m2.5:free";

interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export async function callAI(
  messages: OpenRouterMessage[],
  model: OpenRouterModel = "google/gemma-4-31b-it:free"
): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
  
  if (!apiKey) {
    throw new Error("NEXT_PUBLIC_OPENROUTER_API_KEY não configurada no .env.local");
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://medcore.app",
      "X-Title": "MedCore — Sistema de Gestão Hospitalar",
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: 1024,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenRouter error ${response.status}: ${err}`);
  }

  const data: OpenRouterResponse = await response.json();
  return data.choices[0]?.message?.content ?? "Sem resposta da IA.";
}

// Prompt pré-fabricado para análise de processos jurídicos
export async function analyzeProcess(processDescription: string, deadline: string): Promise<string> {
  return callAI([
    {
      role: "system",
      content: `Você é um assistente jurídico hospitalar especializado em gestão de processos e prazos.
Analise o processo apresentado e forneça:
1. **Resumo**: Síntese clara da situação
2. **Pontos de Risco**: Vulnerabilidades identificadas
3. **Próximos Passos**: Ações recomendadas em ordem de prioridade  
4. **Prazo Realista**: Estimativa fundamentada considerando o prazo informado
Seja objetivo, use bullet points e linguagem executiva.`,
    },
    {
      role: "user",
      content: `Processo: ${processDescription}\nPrazo informado: ${deadline}`,
    },
  ]);
}

// Prompt pré-fabricado para categorização de contas
export async function categorizeAccount(description: string): Promise<string> {
  return callAI([
    {
      role: "system",
      content: `Você é um assistente de gestão financeira hospitalar. 
Categorize a conta/despesa descrita em UMA das seguintes categorias:
ENERGIA, AGUA_ESGOTO, TELEFONE_INTERNET, LICENCA_ANVISA, LICENCA_VIGILANCIA, 
MANUTENCAO, EQUIPAMENTOS, INSUMOS_MEDICOS, FOLHA_PAGAMENTO, SERVICOS_TERCEIROS, OUTROS.
Responda APENAS com: {"categoria": "CATEGORIA", "descricao_curta": "Descrição em até 5 palavras"}`,
    },
    {
      role: "user",
      content: description,
    },
  ]);
}
