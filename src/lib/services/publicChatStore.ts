export type PublicChatIntent = "especialista" | "demonstracao" | "planos";

export type PublicChatStatus = "NOVO" | "EM_ATENDIMENTO" | "CONVERTIDO";

export type PublicChatSender = "visitor" | "admin" | "dra_conte";

export interface PublicChatMessage {
  id: string;
  sender: PublicChatSender;
  senderName: string;
  text: string;
  createdAt: string;
}

export interface PublicChatSession {
  id: string;
  visitorName: string;
  clinicName: string;
  whatsapp: string;
  email?: string;
  specialty?: string;
  doctorsCount?: number;
  intent: PublicChatIntent;
  intentLabel: string;
  sourcePage: string;
  status: PublicChatStatus;
  unreadAdminCount: number;
  unreadVisitorCount: number;
  createdAt: string;
  updatedAt: string;
  messages: PublicChatMessage[];
}

export const INTENT_LABELS: Record<PublicChatIntent, string> = {
  especialista: "Falar com um especialista",
  demonstracao: "Ver uma demonstração",
  planos: "Conhecer os planos",
};

interface PublicChatStoreState {
  sessions: PublicChatSession[];
}

const globalForPublicChat = globalThis as unknown as {
  __medcorePublicChatStore?: PublicChatStoreState;
};

function createSeedSessions(): PublicChatSession[] {
  const now = Date.now();
  return [
    {
      id: "chat-seed-1",
      visitorName: "Dr. Henrique Bastos",
      clinicName: "Clínica CardioVida",
      whatsapp: "(11) 99412-8831",
      email: "henrique@cardiovida.com.br",
      specialty: "Cardiologia & Check-up",
      doctorsCount: 8,
      intent: "especialista",
      intentLabel: INTENT_LABELS.especialista,
      sourcePage: "Landing Page Principal (/)",
      status: "NOVO",
      unreadAdminCount: 1,
      unreadVisitorCount: 0,
      createdAt: new Date(now - 1000 * 60 * 14).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 6).toISOString(),
      messages: [
        {
          id: "msg-seed-1a",
          sender: "dra_conte",
          senderName: "Dra. Conte • Atendimento MedCore",
          text: "Olá Dr. Henrique! A Central Comercial Master da MedCore já recebeu seu chamado sobre falar com um especialista. Como podemos ajudar sua clínica hoje?",
          createdAt: new Date(now - 1000 * 60 * 14).toISOString(),
        },
        {
          id: "msg-seed-1b",
          sender: "visitor",
          senderName: "Dr. Henrique Bastos",
          text: "Boa tarde! Hoje usamos 3 sistemas separados para 8 cardiologistas. A migração assistida transfere nosso histórico antigo do PEP e agenda sem parar o atendimento?",
          createdAt: new Date(now - 1000 * 60 * 6).toISOString(),
        },
      ],
    },
    {
      id: "chat-seed-2",
      visitorName: "Dra. Camila Prado",
      clinicName: "Studio DermaCare",
      whatsapp: "(21) 98804-5120",
      email: "camila@studiodermacare.com.br",
      specialty: "Dermatologia & Estética",
      doctorsCount: 4,
      intent: "demonstracao",
      intentLabel: INTENT_LABELS.demonstracao,
      sourcePage: "Planejamento de Injetáveis (/recursos/planejamento-injetaveis)",
      status: "EM_ATENDIMENTO",
      unreadAdminCount: 1,
      unreadVisitorCount: 0,
      createdAt: new Date(now - 1000 * 60 * 48).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 19).toISOString(),
      messages: [
        {
          id: "msg-seed-2a",
          sender: "dra_conte",
          senderName: "Dra. Conte • Atendimento MedCore",
          text: "Bem-vinda, Dra. Camila! Preparamos uma demonstração guiada com o Planejador de Injetáveis e a transcrição clínica da Dra. Conte ao vivo.",
          createdAt: new Date(now - 1000 * 60 * 48).toISOString(),
        },
        {
          id: "msg-seed-2b",
          sender: "visitor",
          senderName: "Dra. Camila Prado",
          text: "Quero ver como funciona o mapa facial de botox/preenchedores integrado ao controle de lotes de toxina e assinatura eletrônica do termo.",
          createdAt: new Date(now - 1000 * 60 * 19).toISOString(),
        },
      ],
    },
    {
      id: "chat-seed-3",
      visitorName: "Dr. Marcos Rezende",
      clinicName: "OdontoPrime Paulista",
      whatsapp: "(11) 97230-4410",
      email: "diretoria@odontoprime.com.br",
      specialty: "Odontologia Digital",
      doctorsCount: 12,
      intent: "planos",
      intentLabel: INTENT_LABELS.planos,
      sourcePage: "Landing Page Principal (/)",
      status: "CONVERTIDO",
      unreadAdminCount: 0,
      unreadVisitorCount: 0,
      createdAt: new Date(now - 1000 * 60 * 180).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 95).toISOString(),
      messages: [
        {
          id: "msg-seed-3a",
          sender: "visitor",
          senderName: "Dr. Marcos Rezende",
          text: "Qual plano libera comissionamento automático para 12 dentistas + Odontograma + WhatsApp 24h da Dra. Conte?",
          createdAt: new Date(now - 1000 * 60 * 180).toISOString(),
        },
        {
          id: "msg-seed-3b",
          sender: "admin",
          senderName: "ADMIN Master • Felipe",
          text: "Olá Dr. Marcos! No plano Business/Enterprise vocês já levam toda a suíte odontológica, repasse automático de comissões e Dra. Conte 24h no WhatsApp. Acabei de liberar seu link de onboarding VIP!",
          createdAt: new Date(now - 1000 * 60 * 95).toISOString(),
        },
      ],
    },
  ];
}

function getStore(): PublicChatStoreState {
  if (!globalForPublicChat.__medcorePublicChatStore) {
    globalForPublicChat.__medcorePublicChatStore = {
      sessions: createSeedSessions(),
    };
  }
  return globalForPublicChat.__medcorePublicChatStore;
}

/**
 * Lista todas as sessões de chat ordenadas pela interação mais recente.
 */
export function listChatSessions(): PublicChatSession[] {
  const { sessions } = getStore();
  return [...sessions].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

/**
 * Busca uma sessão específica pelo ID.
 */
export function getChatSession(id: string): PublicChatSession | undefined {
  return getStore().sessions.find((s) => s.id === id);
}

export interface CreateSessionInput {
  sessionId?: string;
  visitorName?: string;
  clinicName?: string;
  whatsapp?: string;
  email?: string;
  specialty?: string;
  doctorsCount?: number;
  intent: PublicChatIntent;
  sourcePage?: string;
  initialMessage?: string;
}

/**
 * Cria uma nova sessão de atendimento público ou atualiza dados cadastrais de uma existente.
 */
export function createOrUpdateChatSession(input: CreateSessionInput): PublicChatSession {
  const store = getStore();
  const now = new Date().toISOString();
  const cleanName = input.visitorName?.trim() || "Visitante da Landing Page";
  const cleanClinic = input.clinicName?.trim() || "Clínica em Avaliação";
  const cleanWhatsapp = input.whatsapp?.trim() || "";

  if (input.sessionId) {
    const existing = store.sessions.find((s) => s.id === input.sessionId);
    if (existing) {
      if (input.visitorName?.trim()) existing.visitorName = input.visitorName.trim();
      if (input.clinicName?.trim()) existing.clinicName = input.clinicName.trim();
      if (input.whatsapp?.trim()) existing.whatsapp = input.whatsapp.trim();
      if (input.email?.trim()) existing.email = input.email.trim();
      if (input.specialty?.trim()) existing.specialty = input.specialty.trim();
      if (typeof input.doctorsCount === "number") existing.doctorsCount = input.doctorsCount;
      existing.intent = input.intent || existing.intent;
      existing.intentLabel = INTENT_LABELS[existing.intent] || existing.intentLabel;
      existing.updatedAt = now;

      if (input.initialMessage?.trim()) {
        existing.messages.push({
          id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          sender: "visitor",
          senderName: existing.visitorName,
          text: input.initialMessage.trim(),
          createdAt: now,
        });
        existing.unreadAdminCount += 1;
      }

      return existing;
    }
  }

  const intent: PublicChatIntent = input.intent || "especialista";
  const id = input.sessionId || `chat-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const messages: PublicChatMessage[] = [
    {
      id: `msg-welcome-${Date.now()}`,
      sender: "dra_conte",
      senderName: "Dra. Conte • Concierge MedCore",
      text: getAutoWelcomeByIntent(intent, cleanName),
      createdAt: now,
    },
  ];

  if (input.initialMessage?.trim()) {
    messages.push({
      id: `msg-${Date.now()}-v`,
      sender: "visitor",
      senderName: cleanName,
      text: input.initialMessage.trim(),
      createdAt: now,
    });
  }

  const newSession: PublicChatSession = {
    id,
    visitorName: cleanName,
    clinicName: cleanClinic,
    whatsapp: cleanWhatsapp,
    email: input.email?.trim(),
    specialty: input.specialty?.trim(),
    doctorsCount: input.doctorsCount,
    intent,
    intentLabel: INTENT_LABELS[intent],
    sourcePage: input.sourcePage || "Landing Page Principal (/)",
    status: "NOVO",
    unreadAdminCount: 1,
    unreadVisitorCount: input.initialMessage?.trim() ? 0 : 1,
    createdAt: now,
    updatedAt: now,
    messages,
  };

  store.sessions.unshift(newSession);
  return newSession;
}

function getAutoWelcomeByIntent(intent: PublicChatIntent, visitorName: string): string {
  const greeting = visitorName !== "Visitante da Landing Page" ? `Olá, ${visitorName}!` : "Olá!";
  switch (intent) {
    case "demonstracao":
      return `${greeting} Conectamos você ao nosso time de especialistas no ADMIN Master. Me diga qual especialidade ou módulo você gostaria de ver por dentro (ex: Prontuário com IA, Agenda ou Faturamento) e já te envio o acesso guiado.`;
    case "planos":
      return `${greeting} Que bom ter você aqui! Nosso consultor Master já foi notificado. Quantos profissionais atendem hoje na sua clínica para eu te indicar o plano ideal com condição especial?`;
    case "especialista":
    default:
      return `${greeting} Você já está conectado em tempo real com o time Master da MedCore. Pode mandar sua dúvida aqui pelo chat ou informar seu WhatsApp para atendimento imediato!`;
  }
}

/**
 * Adiciona uma nova mensagem em uma sessão existente (criando sessão automaticamente se necessário).
 */
export function appendChatMessage(params: {
  sessionId?: string;
  sender: PublicChatSender;
  senderName?: string;
  text: string;
  intent?: PublicChatIntent;
  sourcePage?: string;
  visitorName?: string;
  clinicName?: string;
  whatsapp?: string;
}): PublicChatSession {
  const store = getStore();
  const now = new Date().toISOString();
  const trimmed = params.text.trim();

  let session = params.sessionId
    ? store.sessions.find((s) => s.id === params.sessionId)
    : undefined;

  if (!session) {
    session = createOrUpdateChatSession({
      sessionId: params.sessionId,
      visitorName: params.visitorName,
      clinicName: params.clinicName,
      whatsapp: params.whatsapp,
      intent: params.intent || "especialista",
      sourcePage: params.sourcePage,
      initialMessage: trimmed,
    });
    return session;
  }

  if (params.visitorName?.trim() && session.visitorName === "Visitante da Landing Page") {
    session.visitorName = params.visitorName.trim();
  }
  if (params.clinicName?.trim() && session.clinicName === "Clínica em Avaliação") {
    session.clinicName = params.clinicName.trim();
  }
  if (params.whatsapp?.trim() && !session.whatsapp) {
    session.whatsapp = params.whatsapp.trim();
  }

  const resolvedSenderName =
    params.senderName?.trim() ||
    (params.sender === "admin"
      ? "ADMIN Master • Consultor MedCore"
      : params.sender === "dra_conte"
      ? "Dra. Conte • Concierge MedCore"
      : session.visitorName);

  session.messages.push({
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    sender: params.sender,
    senderName: resolvedSenderName,
    text: trimmed,
    createdAt: now,
  });
  session.updatedAt = now;

  if (params.sender === "visitor") {
    session.unreadAdminCount += 1;
  } else {
    session.unreadVisitorCount += 1;
    session.unreadAdminCount = 0;
    if (session.status === "NOVO") {
      session.status = "EM_ATENDIMENTO";
    }
  }

  return session;
}

/**
 * Zera o contador de mensagens não lidas para o leitor especificado.
 */
export function markSessionRead(id: string, reader: "admin" | "visitor"): PublicChatSession | undefined {
  const session = getChatSession(id);
  if (!session) return undefined;
  if (reader === "admin") {
    session.unreadAdminCount = 0;
  } else {
    session.unreadVisitorCount = 0;
  }
  return session;
}

/**
 * Atualiza o status ou metadados de contato de uma sessão.
 */
export function updateSessionMetadata(
  id: string,
  updates: Partial<Pick<PublicChatSession, "status" | "visitorName" | "clinicName" | "whatsapp" | "email" | "specialty" | "doctorsCount">>
): PublicChatSession | undefined {
  const session = getChatSession(id);
  if (!session) return undefined;
  if (updates.status) session.status = updates.status;
  if (updates.visitorName?.trim()) session.visitorName = updates.visitorName.trim();
  if (updates.clinicName?.trim()) session.clinicName = updates.clinicName.trim();
  if (updates.whatsapp?.trim()) session.whatsapp = updates.whatsapp.trim();
  if (updates.email?.trim()) session.email = updates.email.trim();
  if (updates.specialty?.trim()) session.specialty = updates.specialty.trim();
  if (typeof updates.doctorsCount === "number") session.doctorsCount = updates.doctorsCount;
  session.updatedAt = new Date().toISOString();
  return session;
}
