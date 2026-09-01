import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, FunctionDeclaration, SchemaType } from "@google/generative-ai";
import prisma from "@/lib/prisma";

// Declaração das funções que a IA pode chamar
const getPacientesDeclaration: FunctionDeclaration = {
  name: "get_pacientes",
  description: "Busca a lista de pacientes registrados no sistema. Pode retornar dados básicos do paciente.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      limit: {
        type: SchemaType.NUMBER,
        description: "Número máximo de pacientes para retornar (padrão 10)",
      },
    },
  },
};

const getInvoicesDeclaration: FunctionDeclaration = {
  name: "get_invoices",
  description: "Busca a lista de faturas (NFs) e recebimentos financeiros registrados no sistema Asaas.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      status: {
        type: SchemaType.STRING,
        description: "Opcional. Filtrar faturas por status (ex: PENDING, RECEIVED, OVERDUE)",
      },
      limit: {
        type: SchemaType.NUMBER,
        description: "Número máximo de faturas para retornar (padrão 5)",
      },
    },
  },
};

// Funções reais para executar as requisições no Postgres
async function getPacientes(limit = 10) {
  try {
    const data = await prisma.paciente.findMany({ take: limit });
    return { pacientes: data };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function getInvoices(status?: string, limit = 5) {
  try {
    const data = await prisma.asaasInvoice.findMany({
      where: status ? { status } : undefined,
      take: limit
    });
    return { faturas: data };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "A chave da API Gemini não está configurada no servidor." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Instanciando o modelo com as ferramentas habilitadas e instrução de sistema
    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
      tools: [
        {
          functionDeclarations: [getPacientesDeclaration, getInvoicesDeclaration],
        },
      ],
      systemInstruction: `Você é o Alpha Core (ou IA Executiva), a inteligência artificial central do MedCore V2. 

REGRAS ESTRITAS DE SEGURANÇA E ESCOPO:
1. RECUSE-SE TERMINANTEMENTE a responder perguntas que não tenham relação direta com a gestão do hospital, clínicas, pacientes, setor financeiro, e o sistema MedCore V2.
2. Se o usuário pedir receitas de bolo, piadas, códigos de programação alheios ou dados genéricos, responda friamente: "Acesso negado. Sou restrita aos fluxos operacionais e estratégicos do MedCore V2."
3. Não deduza dados que você não possui. Se lhe perguntarem sobre um dado financeiro e você não usar a ferramenta, diga que precisa de autorização para ler o banco.

MAPA DE FUNCIONALIDADES DO MEDCORE V2 (CONHECIMENTO DO SISTEMA):
Você atua sobre uma plataforma completa de gestão hospitalar dividida em:
- [Inteligência] IA Executiva: Você.
- [Inteligência] Visão Executiva: Dashboard gerencial superior.
- [Operacional] Demandas: Gestão de tarefas diárias das alas e médicos.
- [Operacional] Kanban: Fluxo visual de processos e aprovações.
- [Operacional] Agenda: Controle de consultas e plantões médicos.
- [Operacional] Lembretes: Alertas cruciais do sistema.
- [Gestão & Estrutura] Unidades: Gestão de multi-clínicas e filiais.
- [Gestão & Estrutura] Contas: Controle de acesso (Médicos, Recepcionistas, Diretores).
- [Gestão & Estrutura] Drive & Scanner: Armazenamento e OCR de laudos/exames.
- [Gestão & Estrutura] Jurídico: Contratos e conformidade médica (LGPD/HIPAA).
- [Gestão & Estrutura] Relatórios: Emissão de guias TISS/TUSS e relatórios vitais.
- [Gestão & Estrutura] E-mails: Comunicação com pacientes.
- [Financeiro]: Integração bancária direta via Asaas. Split de pagamentos, geração de NFs, faturas de coparticipação, repasse médico.
- [Cadastros]: Pacientes e Prontuário Eletrônico (PEP).

Você TEM ACESSO direto ao banco de dados através de ferramentas (Function Calling).
Sempre que for perguntado sobre faturamento, finanças ou Notas Fiscais (NFs), use a ferramenta 'get_invoices'.
Sempre que for perguntado sobre dados e informações de pacientes, use a ferramenta 'get_pacientes'.
Quando as ferramentas retornarem dados, estruture sua resposta de forma profissional em Markdown (use tabelas, destaque números e valores em negrito).

Mantenha a persona corporativa, blindada, analítica e futurista.`
    });

    const lastMessage = messages[messages.length - 1];
    
    // Constrói o histórico
    let history = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    // Google API exige que o histórico sempre comece com um 'user'
    while (history.length > 0 && history[0].role === "model") {
      history.shift();
    }

    const chat = model.startChat({
      history,
    });

    let result = await chat.sendMessage(lastMessage.content);
    let response = result.response;

    // Verifica se a IA decidiu chamar uma ferramenta
    const functionCalls = response.functionCalls();
    
    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];
      let apiResponse = {};

      console.log("IA solicitou ferramenta:", call.name, call.args);

      if (call.name === "get_pacientes") {
        apiResponse = await getPacientes(call.args.limit);
      } else if (call.name === "get_invoices") {
        apiResponse = await getInvoices(call.args.status, call.args.limit);
      }

      // Envia o resultado da ferramenta de volta para a IA
      result = await chat.sendMessage([{
        functionResponse: {
          name: call.name,
          response: apiResponse,
        }
      }]);
      
      response = result.response;
    }

    return NextResponse.json({ reply: response.text() });
  } catch (error: any) {
    console.error("AI Route Error:", error);
    return NextResponse.json(
      { error: "Falha ao processar solicitação de IA.", details: error.message },
      { status: 500 }
    );
  }
}
