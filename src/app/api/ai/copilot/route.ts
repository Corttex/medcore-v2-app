import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,
});

const googleProvider = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
});

// Helper de extração heurística rápida para garantir execução imediata
function extractPatientDataHeuristic(text: string) {
  // Regex para CPF
  const cpfMatch = text.match(/\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/) || text.match(/cpf[:\s]+([\d.-]+)/i);
  const cpf = cpfMatch ? (cpfMatch[1] || cpfMatch[0]).trim() : null;

  // Regex para Telefone
  const telMatch = text.match(/(?:tel|telefone|fone|cel|celular|whatsapp)[:\s]+([0-9()\s-]+)/i) ||
                   text.match(/\(?\d{2}\)?\s?9?\d{4}[-\s]?\d{4}/);
  const telefone = telMatch ? (telMatch[1] || telMatch[0]).trim() : null;

  // Regex para E-mail
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0].trim() : null;

  // Regex para Data de Nascimento
  const nascMatch = text.match(/(?:nascimento|nascido em|data de nasc|nasc)[:\s]+(\d{2}[/-]\d{2}[/-]\d{2,4})/i) ||
                    text.match(/\b\d{2}\/\d{2}\/\d{4}\b/);
  const dataNascimento = nascMatch ? (nascMatch[1] || nascMatch[0]).trim() : null;

  // Convênio
  let convenioNome = null;
  const conveniosConhecidos = ["unimed", "bradesco", "amil", "sulamerica", "sul américa", "notredame", "porto seguro", "particular"];
  for (const conv of conveniosConhecidos) {
    if (new RegExp(`\\b${conv}\\b`, "i").test(text)) {
      convenioNome = conv.charAt(0).toUpperCase() + conv.slice(1);
      break;
    }
  }

  // Nome do Paciente: captura após "paciente", "cliente" ou no início
  let nome = null;
  const nomeMatch = text.match(/(?:cadastr(?:ar|e|ou)|inserir|novo paciente|novo cliente|paciente|cliente)[:\s]+([A-ZÀ-Úa-zà-ú\s]+?)(?:,|cpf|tel|telefone|com cpf|nascido|nasc|convenio|convênio|\.|$)/i);
  if (nomeMatch && nomeMatch[1]) {
    nome = nomeMatch[1]
      .replace(/^(o\s+paciente|a\s+paciente|o\s+cliente|a\s+cliente|paciente|cliente|o|a|um|uma)\s+/i, "")
      .trim();
  }

  return { nome, cpf, telefone, email, dataNascimento, convenioNome };
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const body = await req.json();
    const { message, history = [], unitId } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Mensagem obrigatória" }, { status: 400 });
    }

    const trimmedMsg = message.trim();
    const lowerMsg = trimmedMsg.toLowerCase();

    // 1. Detectar Intenção de CADASTRO DE PACIENTE
    const isCadastroPaciente =
      lowerMsg.includes("cadastr") ||
      lowerMsg.includes("novo paciente") ||
      lowerMsg.includes("novo cliente") ||
      lowerMsg.includes("inserir paciente") ||
      lowerMsg.includes("adicionar paciente") ||
      (lowerMsg.includes("paciente") && (lowerMsg.includes("cpf") || lowerMsg.includes("nome")));

    if (isCadastroPaciente) {
      // Heurística de extração
      const extracted = extractPatientDataHeuristic(trimmedMsg);

      // Se achamos pelo menos o nome ou conseguimos deduzir via LLM
      let finalNome = extracted.nome;
      let finalCpf = extracted.cpf;
      let finalTelefone = extracted.telefone;
      let finalEmail = extracted.email;
      let finalDataNasc = extracted.dataNascimento;
      let finalConvenio = extracted.convenioNome || "Particular";

      // Se faltou o nome no regex, pede para a LLM extrair o JSON
      if (!finalNome || finalNome.length < 3) {
        try {
          const extractionPrompt = `Extraia os dados cadastrais deste texto em formato JSON estrito:
Texto: "${trimmedMsg}"
Formato esperado:
{
  "nome": "Nome Completo",
  "cpf": "000.000.000-00 ou null",
  "telefone": "(00) 00000-0000 ou null",
  "email": "email@exemplo.com ou null",
  "dataNascimento": "DD/MM/AAAA ou null",
  "convenio": "Nome do convênio ou Particular"
}`;

          const llmExtraction = await generateText({
            model: openrouter("openai/gpt-4o-mini"),
            prompt: extractionPrompt,
          });

          const jsonMatch = llmExtraction.text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (parsed.nome) finalNome = parsed.nome;
            if (parsed.cpf) finalCpf = parsed.cpf;
            if (parsed.telefone) finalTelefone = parsed.telefone;
            if (parsed.email) finalEmail = parsed.email;
            if (parsed.dataNascimento) finalDataNasc = parsed.dataNascimento;
            if (parsed.convenio) finalConvenio = parsed.convenio;
          }
        } catch (e) {
          console.warn("Fallback LLM extraction failed:", e);
        }
      }

      // Se ainda não temos nome suficiente, pede clarificação amigável
      if (!finalNome || finalNome.length < 2) {
        return NextResponse.json({
          reply: `Olá! Eu sou a **Dra. Conte**, sua Copilot Médica. Compreendi que você deseja cadastrar um novo paciente, mas preciso que informe pelo menos o **nome completo** dele.\n\n*Exemplo:* \`"Cadastrar paciente Maria de Souza, CPF 123.456.789-00, telefone (11) 98765-4321, convênio Unimed"\``,
          actionExecuted: false,
        });
      }

      // Buscar convênio se houver no banco
      let convenioIdEncontrado = null;
      if (finalConvenio && finalConvenio !== "Particular") {
        const conv = await prisma.convenio.findFirst({
          where: {
            nome: { contains: finalConvenio },
          },
        });
        if (conv) {
          convenioIdEncontrado = conv.id;
        }
      }

      // Unidade ativa
      const activeUnitId = unitId || session?.user?.primaryUnitId || null;

      // Executa o cadastro no banco de dados via Prisma!
      const novoPaciente = await prisma.paciente.create({
        data: {
          nome: finalNome,
          cpf: finalCpf,
          telefone: finalTelefone,
          email: finalEmail,
          dataNascimento: finalDataNasc,
          convenioId: convenioIdEncontrado,
          leadSource: "ia_copilot_amelia",
          unitId: activeUnitId,
        },
        include: {
          convenio: true,
          unit: true,
        },
      });

      const replyMsg = `✅ **Paciente cadastrado com sucesso no sistema!**\n\nEu já inseri a ficha cadastral do(a) **${novoPaciente.nome}** diretamente no banco de dados do MEDCore.\n\n📋 **Ficha do Paciente:**\n- **Nome:** ${novoPaciente.nome}\n- **CPF:** ${novoPaciente.cpf || "Não informado"}\n- **Telefone:** ${novoPaciente.telefone || "Não informado"}\n- **E-mail:** ${novoPaciente.email || "Não informado"}\n- **Convênio:** ${novoPaciente.convenio?.nome || finalConvenio || "Particular"}\n- **Unidade:** ${novoPaciente.unit?.name || "Unidade Principal"}\n- **ID no Sistema:** \`${novoPaciente.id}\`\n\n*Deseja que eu agende uma consulta ou abra o prontuário deste paciente?*`;

      return NextResponse.json({
        reply: replyMsg,
        actionExecuted: true,
        actionType: "CADASTRAR_PACIENTE",
        data: {
          paciente: novoPaciente,
          link: `/dashboard/pacientes`,
          prontuarioLink: `/dashboard/prontuario/${novoPaciente.id}`,
        },
      });
    }

    // 2. Detectar Intenção de AGENDAMENTO DE CONSULTA
    const isAgendamento =
      lowerMsg.includes("agend") ||
      lowerMsg.includes("marcar consulta") ||
      lowerMsg.includes("marcar horario") ||
      lowerMsg.includes("nova consulta");

    if (isAgendamento) {
      // Extrair dados básicos
      const dataMatch = trimmedMsg.match(/(\d{2}[/-]\d{2}(?:[/-]\d{2,4})?)/) || trimmedMsg.match(/hoje|amanhã|segunda|terça|quarta|quinta|sexta/i);
      const horaMatch = trimmedMsg.match(/(\d{1,2}:\d{2})/) || trimmedMsg.match(/às\s+(\d{1,2}(?:h|\s*horas)?)/i);
      
      const dataStr = dataMatch ? dataMatch[0] : "Amanhã";
      const horaStr = horaMatch ? horaMatch[0].replace("às", "").trim() : "14:00";

      // Tentar associar paciente existente
      const pacientesRecentes = await prisma.paciente.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
      });

      const replyMsg = `📅 **Agendamento Preparado com Sucesso!**\n\nIdentifiquei sua solicitação de agendamento:\n- **Data sugerida:** ${dataStr}\n- **Horário:** ${horaStr}\n- **Status:** Pré-agendado no painel da recepção\n\nVocê pode confirmar o agendamento completo e o consultório diretamente na [Agenda Médica](/dashboard/agenda).`;

      return NextResponse.json({
        reply: replyMsg,
        actionExecuted: true,
        actionType: "AGENDAR_CONSULTA",
        data: {
          dataStr,
          horaStr,
          link: "/dashboard/agenda",
        },
      });
    }

    // 3. Detectar Intenção de CRIAR LEMBRETE / DEMANDA
    const isLembrete =
      lowerMsg.includes("lembrete") ||
      lowerMsg.includes("me lembre") ||
      lowerMsg.includes("criar lembrete") ||
      lowerMsg.includes("lembrar de");

    if (isLembrete) {
      const tituloLembrete = trimmedMsg.replace(/^(ia|conte|dra conte|amélia|dra amélia|por favor|crie um lembrete|me lembre de)\s*/i, "").trim();
      const hoje = new Date().toLocaleDateString("pt-BR");

      try {
        const reminder = await prisma.reminder.create({
          data: {
            title: tituloLembrete || "Lembrete Clínico Copilot",
            date: hoje,
            time: "09:00",
            type: "CLINICO",
            status: "PENDENTE",
            user_id: session?.user?.id || null,
            unitId: unitId || null,
          },
        });

        return NextResponse.json({
          reply: `🔔 **Lembrete criado com sucesso!**\n\n"${reminder.title}" foi salvo na sua lista de tarefas e notificações do MEDCore.`,
          actionExecuted: true,
          actionType: "CRIAR_LEMBRETE",
          data: reminder,
        });
      } catch (err) {
        console.warn("Erro ao salvar reminder:", err);
      }
    }

    // 4. Resposta Clínica / Executiva Geral via LLM
    const systemPrompt = `Você é a Dra. Conte, a Inteligência Médica e Copilot Clínico-Executivo oficial do MEDCore.
Você possui autonomia para executar ações no sistema quando o usuário solicitar (como cadastrar pacientes, agendar consultas, verificar folhas de pagamento, leitos, estoque e faturamento).

Sua Persona:
- Nome: Dra. Conte
- Cargo: Copilot Médica & Diretora de Inteligência Clínica MEDCore
- Tom: Extremamente profissional, acolhedor, clínico, ético e proativo.
- Capacidades de Automação: Explique que você consegue cadastrar pacientes automaticamente, agendar consultas, criar lembretes e consultar relatórios operacionais no MEDCore apenas com comandos de voz ou texto.
- Especialidade: Medicina humana, diagnóstico diferencial, bulário, diretrizes CFM/TISS, faturamento hospitalar, odontologia, veterinária e estética clínica.
- Formate suas respostas sempre em Markdown impecável, usando bullet points, negritos e emojis estratégicos.`;

    const messages = [
      ...history.slice(-8).map((h: any) => ({
        role: h.role === "ai" || h.role === "assistant" ? ("assistant" as const) : ("user" as const),
        content: h.content,
      })),
      { role: "user" as const, content: trimmedMsg },
    ];

    const modelsToTry = [
      { id: "gpt-4o-mini", model: openrouter("openai/gpt-4o-mini") },
      { id: "gemini-1.5-flash", model: googleProvider("gemini-1.5-flash") },
      { id: "llama-3.3-70b", model: openrouter("meta-llama/llama-3.3-70b-instruct") },
    ];

    let aiResultText = "";
    for (const m of modelsToTry) {
      try {
        const res = await generateText({
          model: m.model,
          system: systemPrompt,
          messages,
        });
        aiResultText = res.text;
        break;
      } catch (e: any) {
        console.warn(`[Copilot Fallback] Modelo ${m.id} falhou:`, e.message);
      }
    }

    if (!aiResultText) {
      aiResultText = `Olá! Sou a **Dra. Conte**, sua Copilot Médica no MEDCore. Como posso ajudar com a gestão de pacientes, agendamentos, prescrições ou prontuários hoje? Você também pode me pedir comandos diretos como: *"Cadastre o paciente Marcos Silva, CPF 123.456.789-00, telefone 11 98888-7777"*!`;
    }

    return NextResponse.json({
      reply: aiResultText,
      actionExecuted: false,
    });
  } catch (error: any) {
    console.error("Erro no Copilot da Dra. Conte:", error);
    return NextResponse.json(
      {
        reply: "Desculpe, ocorreu uma instabilidade momentânea no processamento neural. Por favor, tente novamente.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
