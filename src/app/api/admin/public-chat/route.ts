import { NextResponse } from "next/server";
import {
  appendChatMessage,
  createOrUpdateChatSession,
  getChatSession,
  listChatSessions,
  markSessionRead,
  PublicChatIntent,
  PublicChatSender,
  PublicChatStatus,
  updateSessionMetadata,
} from "@/lib/services/publicChatStore";

const VALID_INTENTS: PublicChatIntent[] = ["especialista", "demonstracao", "planos"];
const VALID_SENDERS: PublicChatSender[] = ["visitor", "admin", "dra_conte"];
const VALID_STATUSES: PublicChatStatus[] = ["NOVO", "EM_ATENDIMENTO", "CONVERTIDO"];

function normalizeIntent(value: unknown): PublicChatIntent {
  if (typeof value === "string" && VALID_INTENTS.includes(value as PublicChatIntent)) {
    return value as PublicChatIntent;
  }
  return "especialista";
}

/**
 * Lista todas as conversas do Chat Público (ou consulta uma sessão específica por sessionId).
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");
  const reader = searchParams.get("markReadBy");

  if (sessionId) {
    if (reader === "visitor" || reader === "admin") {
      markSessionRead(sessionId, reader);
    }
    const session = getChatSession(sessionId);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Sessão de chat não encontrada" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, session });
  }

  const sessions = listChatSessions();
  const unreadTotal = sessions.reduce((acc, s) => acc + s.unreadAdminCount, 0);
  const novos = sessions.filter((s) => s.status === "NOVO").length;
  const emAtendimento = sessions.filter((s) => s.status === "EM_ATENDIMENTO").length;
  const convertidos = sessions.filter((s) => s.status === "CONVERTIDO").length;

  return NextResponse.json({
    success: true,
    sessions,
    stats: {
      total: sessions.length,
      unreadTotal,
      novos,
      emAtendimento,
      convertidos,
    },
  });
}

/**
 * Cria uma nova sessão de lead ou envia uma nova mensagem em tempo real.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const action = body?.action as string | undefined;

    if (action === "start_session") {
      const session = createOrUpdateChatSession({
        sessionId: typeof body.sessionId === "string" ? body.sessionId : undefined,
        visitorName: typeof body.visitorName === "string" ? body.visitorName : undefined,
        clinicName: typeof body.clinicName === "string" ? body.clinicName : undefined,
        whatsapp: typeof body.whatsapp === "string" ? body.whatsapp : undefined,
        email: typeof body.email === "string" ? body.email : undefined,
        specialty: typeof body.specialty === "string" ? body.specialty : undefined,
        doctorsCount: typeof body.doctorsCount === "number" ? body.doctorsCount : undefined,
        intent: normalizeIntent(body.intent),
        sourcePage: typeof body.sourcePage === "string" ? body.sourcePage : undefined,
        initialMessage: typeof body.initialMessage === "string" ? body.initialMessage : undefined,
      });

      return NextResponse.json({
        success: true,
        session,
      });
    }

    if (action === "send_message") {
      const text = typeof body.text === "string" ? body.text.trim() : "";
      if (!text) {
        return NextResponse.json(
          { success: false, error: "A mensagem não pode estar vazia" },
          { status: 400 }
        );
      }

      const rawSender = body.sender;
      const sender: PublicChatSender = VALID_SENDERS.includes(rawSender)
        ? rawSender
        : "visitor";

      const session = appendChatMessage({
        sessionId: typeof body.sessionId === "string" ? body.sessionId : undefined,
        sender,
        senderName: typeof body.senderName === "string" ? body.senderName : undefined,
        text,
        intent: normalizeIntent(body.intent),
        sourcePage: typeof body.sourcePage === "string" ? body.sourcePage : undefined,
        visitorName: typeof body.visitorName === "string" ? body.visitorName : undefined,
        clinicName: typeof body.clinicName === "string" ? body.clinicName : undefined,
        whatsapp: typeof body.whatsapp === "string" ? body.whatsapp : undefined,
      });

      return NextResponse.json({
        success: true,
        session,
      });
    }

    return NextResponse.json(
      { success: false, error: "Ação inválida" },
      { status: 400 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro ao processar chat";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

/**
 * Atualiza status do lead, dados de contato ou marca mensagens como lidas.
 */
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const sessionId = typeof body?.sessionId === "string" ? body.sessionId : "";

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "sessionId é obrigatório" },
        { status: 400 }
      );
    }

    if (body.markReadBy === "admin" || body.markReadBy === "visitor") {
      markSessionRead(sessionId, body.markReadBy);
    }

    const rawStatus = body.status;
    const status: PublicChatStatus | undefined = VALID_STATUSES.includes(rawStatus)
      ? rawStatus
      : undefined;

    const updated = updateSessionMetadata(sessionId, {
      status,
      visitorName: typeof body.visitorName === "string" ? body.visitorName : undefined,
      clinicName: typeof body.clinicName === "string" ? body.clinicName : undefined,
      whatsapp: typeof body.whatsapp === "string" ? body.whatsapp : undefined,
      email: typeof body.email === "string" ? body.email : undefined,
      specialty: typeof body.specialty === "string" ? body.specialty : undefined,
      doctorsCount: typeof body.doctorsCount === "number" ? body.doctorsCount : undefined,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Sessão não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, session: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro ao atualizar sessão";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
