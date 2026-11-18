"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  Globe,
  LayoutGrid,
  MessageCircle,
  MessageSquare,
  PhoneCall,
  PlayCircle,
  RefreshCw,
  Send,
  Sparkles,
  UserCheck,
  ArrowUpRight,
} from "lucide-react";
import type {
  PublicChatIntent,
  PublicChatSession,
  PublicChatStatus,
} from "@/lib/services/publicChatStore";

const BROADCAST_CHANNEL_NAME = "medcore_public_chat_sync";

const INTENT_STYLE: Record<
  PublicChatIntent,
  { label: string; badgeClass: string; Icon: React.ElementType }
> = {
  especialista: {
    label: "Falar com Especialista",
    badgeClass: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    Icon: MessageCircle,
  },
  demonstracao: {
    label: "Ver Demonstração",
    badgeClass: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    Icon: PlayCircle,
  },
  planos: {
    label: "Conhecer Planos",
    badgeClass: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    Icon: LayoutGrid,
  },
};

const STATUS_STYLE: Record<
  PublicChatStatus,
  { label: string; badgeClass: string }
> = {
  NOVO: {
    label: "Novo Lead",
    badgeClass: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  },
  EM_ATENDIMENTO: {
    label: "Em Atendimento",
    badgeClass: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
  CONVERTIDO: {
    label: "No Funil / Fechado",
    badgeClass: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
};

const QUICK_REPLIES = [
  {
    label: "Liberar Demo Agora",
    text: "Olá! Sou da equipe Master da MedCore. Acabei de preparar um acesso guiado para você ver o Prontuário com Dra. Conte e Agenda por dentro. Prefere que eu mande por aqui ou no seu WhatsApp?",
  },
  {
    label: "Migração + Condição VIP",
    text: "Conseguimos incluir migração assistida completa do seu sistema atual e onboarding da equipe sem taxa extra neste mês. Quantos profissionais atendem na sua clínica hoje?",
  },
  {
    label: "Call de 10 min",
    text: "Posso te apresentar os módulos em uma demonstração rápida de 10 minutos agora ou no melhor horário da sua agenda hoje?",
  },
];

function formatClock(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export function AdminLiveChatInbox() {
  const [sessions, setSessions] = useState<PublicChatSession[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"TODOS" | PublicChatStatus>("TODOS");
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const threadEndRef = useRef<HTMLDivElement>(null);

  const notifyPublicWidgets = useCallback(() => {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      const ch = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      ch.postMessage({ type: "chat_updated" });
      ch.close();
    }
  }, []);

  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/public-chat", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (data.success && Array.isArray(data.sessions)) {
        setSessions(data.sessions);
        setSelectedId((current) => {
          if (current && data.sessions.some((s: PublicChatSession) => s.id === current)) {
            return current;
          }
          return data.sessions[0]?.id || null;
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
    const interval = window.setInterval(fetchSessions, 2500);

    let ch: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      ch = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      ch.onmessage = () => fetchSessions();
    }

    return () => {
      window.clearInterval(interval);
      if (ch) ch.close();
    };
  }, [fetchSessions]);

  const activeSession = useMemo(
    () => sessions.find((s) => s.id === selectedId) || sessions[0] || null,
    [sessions, selectedId]
  );

  const filteredSessions = useMemo(() => {
    if (statusFilter === "TODOS") return sessions;
    return sessions.filter((s) => s.status === statusFilter);
  }, [sessions, statusFilter]);

  const unreadTotal = useMemo(
    () => sessions.reduce((acc, s) => acc + (s.unreadAdminCount || 0), 0),
    [sessions]
  );

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.id, activeSession?.messages.length]);

  const handleSelectSession = async (session: PublicChatSession) => {
    setSelectedId(session.id);
    if (session.unreadAdminCount > 0) {
      try {
        await fetch("/api/admin/public-chat", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: session.id, markReadBy: "admin" }),
        });
        setSessions((prev) =>
          prev.map((s) => (s.id === session.id ? { ...s, unreadAdminCount: 0 } : s))
        );
      } catch {
        // silent
      }
    }
  };

  const handleSendReply = async (e?: React.FormEvent, presetText?: string) => {
    if (e) e.preventDefault();
    const text = (presetText ?? replyText).trim();
    if (!text || !activeSession || sending) return;

    setSending(true);
    if (!presetText) setReplyText("");

    try {
      const res = await fetch("/api/admin/public-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_message",
          sessionId: activeSession.id,
          sender: "admin",
          senderName: "ADMIN Master • MedCore",
          text,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.session) {
          setSessions((prev) =>
            prev.map((s) => (s.id === data.session.id ? data.session : s))
          );
          notifyPublicWidgets();
        }
      }
    } finally {
      setSending(false);
    }
  };

  const handleUpdateStatus = async (status: PublicChatStatus) => {
    if (!activeSession) return;
    const res = await fetch("/api/admin/public-chat", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: activeSession.id, status }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.session) {
        setSessions((prev) =>
          prev.map((s) => (s.id === data.session.id ? data.session : s))
        );
      }
    }
  };

  const handleSendToPipeline = async () => {
    if (!activeSession) return;
    try {
      const cleanPhone = activeSession.whatsapp.replace(/\D/g, "");
      const res = await fetch("/api/admin/prospeccao/pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead: {
            chatSessionId: activeSession.id,
            nome:
              activeSession.clinicName !== "Clínica em Avaliação"
                ? activeSession.clinicName
                : `${activeSession.visitorName} (Chat Landing Page)`,
            donoOuResponsavel: activeSession.visitorName,
            especialidade: activeSession.specialty || activeSession.intentLabel,
            endereco: `Origem: ${activeSession.sourcePage}`,
            telefone: activeSession.whatsapp || "Chat ao Vivo",
            whatsapp: cleanPhone,
            email: activeSession.email || "",
            planoRecomendado:
              activeSession.intent === "planos"
                ? "MedCore Growth / Business"
                : "MedCore Black (R$ 1.890/mês)",
            pitchRapido: `Capturado via Chat Flutuante (${activeSession.intentLabel}). Mensagens: ${activeSession.messages.length}.`,
          },
        }),
      });

      if (res.ok) {
        await handleUpdateStatus("CONVERTIDO");
        setSyncNotice("Lead enviado ao Funil B2B com sucesso!");
        window.setTimeout(() => setSyncNotice(null), 4000);
      }
    } catch {
      // silent
    }
  };

  return (
    <section
      id="chat-ao-vivo"
      className="bg-surface-container-low border border-outline-variant/40 rounded-[2.5rem] p-6 md:p-8 shadow-sm space-y-6"
    >
      {/* Header do Módulo */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-outline-variant/20 pb-5">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-xs font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Chat Público • Tempo Real
            </span>
            {unreadTotal > 0 && (
              <span className="px-2.5 py-1 rounded-full bg-rose-500 text-white text-xs font-bold">
                {unreadTotal} não {unreadTotal === 1 ? "lida" : "lidas"}
              </span>
            )}
          </div>
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-on-surface tracking-tight flex items-center gap-2.5">
            <MessageSquare className="text-primary" size={24} />
            Central de Atendimento Landing Page (ADMIN Master)
          </h2>
          <p className="text-xs md:text-sm text-zinc-500">
            Todas as conversas iniciadas no widget &ldquo;Como você prefere começar?&rdquo; chegam aqui instantaneamente e sincronizam com o Funil B2B.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(["TODOS", "NOVO", "EM_ATENDIMENTO", "CONVERTIDO"] as const).map(
            (st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  statusFilter === st
                    ? "bg-primary text-on-primary border-primary"
                    : "bg-surface-container-highest/40 text-zinc-600 dark:text-zinc-300 border-outline-variant/20 hover:text-on-surface"
                }`}
              >
                {st === "TODOS" ? `Todos (${sessions.length})` : STATUS_STYLE[st].label}
              </button>
            )
          )}

          <button
            type="button"
            onClick={() => fetchSessions()}
            className="p-2 rounded-xl bg-surface-container-highest/50 hover:bg-surface-container-highest border border-outline-variant/20 text-zinc-600 dark:text-zinc-300 hover:text-on-surface transition-colors"
            title="Atualizar conversas"
          >
            <RefreshCw size={15} />
          </button>

          <Link
            href="/dashboard/admin/prospeccao/leads"
            className="px-3.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
          >
            Ver no Funil B2B <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>

      {/* Grid Principal: Lista de Conversas + Thread ao Vivo */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        {/* Coluna Esquerda: Lista de Leads do Widget */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[540px] overflow-y-auto pr-1">
          {loading && sessions.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500 border border-dashed border-outline-variant/30 rounded-2xl">
              Carregando conversas da Landing Page...
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500 border border-dashed border-outline-variant/30 rounded-2xl">
              Nenhuma conversa neste filtro no momento.
            </div>
          ) : (
            filteredSessions.map((session) => {
              const intentMeta = INTENT_STYLE[session.intent] || INTENT_STYLE.especialista;
              const statusMeta = STATUS_STYLE[session.status] || STATUS_STYLE.NOVO;
              const lastMsg = session.messages[session.messages.length - 1];
              const isSelected = activeSession?.id === session.id;

              return (
                <button
                  key={session.id}
                  type="button"
                  onClick={() => handleSelectSession(session)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all space-y-2.5 ${
                    isSelected
                      ? "bg-primary/10 border-primary/50 shadow-sm"
                      : "bg-surface-container-highest/25 border-outline-variant/20 hover:bg-surface-container-highest/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-on-surface truncate flex items-center gap-2">
                        <span>{session.visitorName}</span>
                        {session.unreadAdminCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded-full bg-emerald-500 text-zinc-950 text-[10px] font-black leading-none">
                            {session.unreadAdminCount}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 truncate mt-0.5">
                        {session.clinicName}
                        {session.whatsapp ? ` • ${session.whatsapp}` : ""}
                      </p>
                    </div>
                    <span className="text-[11px] text-zinc-500 shrink-0 flex items-center gap-1">
                      <Clock size={11} /> {formatClock(session.updatedAt)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[10px] font-semibold ${intentMeta.badgeClass}`}
                    >
                      <intentMeta.Icon size={11} />
                      {intentMeta.label}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-lg border text-[10px] font-semibold ${statusMeta.badgeClass}`}
                    >
                      {statusMeta.label}
                    </span>
                  </div>

                  {lastMsg && (
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                        {lastMsg.sender === "visitor" ? "Lead: " : "MedCore: "}
                      </span>
                      {lastMsg.text}
                    </p>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Coluna Direita: Sala de Conversa em Tempo Real */}
        <div className="lg:col-span-7 flex flex-col bg-surface-container-highest/20 border border-outline-variant/25 rounded-3xl overflow-hidden max-h-[540px]">
          {activeSession ? (
            <>
              {/* Cabeçalho do Lead Selecionado */}
              <div className="p-4 md:p-5 border-b border-outline-variant/20 bg-surface-container-highest/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-on-surface truncate">
                      {activeSession.visitorName}
                    </h3>
                    <span className="text-xs text-zinc-400 truncate">
                      — {activeSession.clinicName}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-400">
                    <span className="inline-flex items-center gap-1">
                      <Globe size={12} className="text-sky-400" />
                      {activeSession.sourcePage}
                    </span>
                    {activeSession.whatsapp && (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                        <PhoneCall size={12} />
                        {activeSession.whatsapp}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {activeSession.whatsapp && (
                    <a
                      href={`https://wa.me/55${activeSession.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
                        `Olá ${activeSession.visitorName}! Aqui é o time Master da MedCore sobre sua solicitação (${activeSession.intentLabel}).`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                    >
                      WhatsApp <ExternalLink size={12} />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={handleSendToPipeline}
                    className="px-3 py-1.5 rounded-xl bg-primary/15 hover:bg-primary/25 border border-primary/30 text-primary text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                  >
                    <UserCheck size={13} />
                    {activeSession.status === "CONVERTIDO"
                      ? "No Pipeline B2B"
                      : "Enviar p/ Funil B2B"}
                  </button>
                </div>
              </div>

              {syncNotice && (
                <div className="px-4 py-2 bg-emerald-500/15 border-b border-emerald-500/25 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 size={14} /> {syncNotice}
                </div>
              )}

              {/* Mensagens */}
              <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-3.5">
                {activeSession.messages.map((msg) => {
                  const isVisitor = msg.sender === "visitor";
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        isVisitor ? "items-start" : "items-end"
                      }`}
                    >
                      <span className="text-[10px] font-semibold text-zinc-500 mb-1 px-1">
                        {msg.senderName} • {formatClock(msg.createdAt)}
                      </span>
                      <div
                        className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-xs md:text-[13px] leading-relaxed ${
                          isVisitor
                            ? "bg-surface-container-highest text-on-surface border border-outline-variant/25 rounded-bl-sm"
                            : "bg-primary text-on-primary rounded-br-sm shadow-sm"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={threadEndRef} />
              </div>

              {/* Respostas Rápidas + Campo de Resposta Master */}
              <div className="p-3.5 border-t border-outline-variant/20 bg-surface-container-low/60 space-y-2.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mr-1 inline-flex items-center gap-1">
                    <Sparkles size={11} className="text-amber-400" /> Atalhos:
                  </span>
                  {QUICK_REPLIES.map((qr) => (
                    <button
                      key={qr.label}
                      type="button"
                      onClick={() => handleSendReply(undefined, qr.text)}
                      className="px-2.5 py-1 rounded-lg bg-surface-container-highest/60 hover:bg-primary/15 border border-outline-variant/20 text-[11px] font-medium text-zinc-700 dark:text-zinc-300 hover:text-primary transition-colors"
                    >
                      {qr.label}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSendReply} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Responder para ${activeSession.visitorName} no chat da Landing Page...`}
                    className="flex-1 px-4 py-2.5 rounded-2xl bg-surface-container-highest/60 border border-outline-variant/30 text-xs md:text-sm text-on-surface placeholder:text-zinc-500 focus:outline-none focus:border-primary"
                  />
                  <button
                    type="submit"
                    disabled={!replyText.trim() || sending}
                    className="px-4 py-2.5 rounded-2xl bg-primary hover:bg-primary/90 disabled:opacity-40 text-on-primary text-xs font-bold inline-flex items-center gap-1.5 transition-all active:scale-95 shrink-0"
                  >
                    <span>Responder</span>
                    <Send size={14} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-xs text-zinc-500">
              Selecione uma conversa ao lado para responder ao visitante em tempo real.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
