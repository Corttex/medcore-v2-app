"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  ExternalLink,
  LayoutGrid,
  MessageCircle,
  PlayCircle,
  Send,
  Sparkles,
  UserCheck,
  X,
} from "lucide-react";
import type {
  PublicChatIntent,
  PublicChatSession,
} from "@/lib/services/publicChatStore";

interface PublicLeadChatWidgetProps {
  sourcePage?: string;
}

const STORAGE_SESSION_KEY = "medcore_public_chat_session_id";
const STORAGE_DISMISSED_KEY = "medcore_public_chat_minimized";
const BROADCAST_CHANNEL_NAME = "medcore_public_chat_sync";

const MENU_OPTIONS: Array<{
  intent: PublicChatIntent;
  title: string;
  subtitle: string;
  icon: "whatsapp" | "demo" | "plans";
}> = [
  {
    intent: "especialista",
    title: "Falar com um especialista",
    subtitle: "Tire suas dúvidas pelo Chat ou WhatsApp",
    icon: "whatsapp",
  },
  {
    intent: "demonstracao",
    title: "Ver uma demonstração",
    subtitle: "O sistema funcionando por dentro",
    icon: "demo",
  },
  {
    intent: "planos",
    title: "Conhecer os planos",
    subtitle: "Compare planos e módulos",
    icon: "plans",
  },
];

function MedCoreEmblemIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="w-4 h-4 text-zinc-950"
      aria-hidden="true"
    >
      <path
        d="M5 17V7.8C5 6.8 6.2 6.3 6.9 7L12 12L17.1 7C17.8 6.3 19 6.8 19 7.8V17"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="16.5" r="1.6" fill="#00A9FF" />
    </svg>
  );
}

function OptionIcon({ kind }: { kind: "whatsapp" | "demo" | "plans" }) {
  if (kind === "whatsapp") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-5 h-5 text-zinc-800"
        aria-hidden="true"
      >
        <path
          d="M12 21a9 9 0 1 0-7.8-4.5L3 21l4.6-1.2A8.96 8.96 0 0 0 12 21Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.5 9.2c.2-.4.4-.4.6-.4h.5c.2 0 .4.1.5.4l.7 1.6c.1.2.1.4-.1.6l-.4.5c.4.8 1.1 1.5 1.9 1.9l.5-.4c.2-.2.4-.2.6-.1l1.6.7c.3.1.4.3.4.5v.5c0 .2 0 .4-.4.6-.4.2-1.3.4-2.5-.1-1.2-.5-2.8-1.7-3.8-3.4-.9-1.5-.8-2.6-.1-3Z"
          fill="currentColor"
        />
      </svg>
    );
  }
  if (kind === "demo") {
    return <PlayCircle className="w-5 h-5 text-zinc-800" strokeWidth={1.75} />;
  }
  return <LayoutGrid className="w-5 h-5 text-zinc-800" strokeWidth={1.75} />;
}

function formatMessageTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export function PublicLeadChatWidget({
  sourcePage = "Landing Page Principal (/)",
}: PublicLeadChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<"menu" | "chat">("menu");
  const [selectedIntent, setSelectedIntent] =
    useState<PublicChatIntent>("especialista");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [session, setSession] = useState<PublicChatSession | null>(null);

  const [visitorName, setVisitorName] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [contactSaved, setContactSaved] = useState(false);
  const [showContactForm, setShowContactForm] = useState(true);

  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const notifyAdminSync = useCallback(() => {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      const ch = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      ch.postMessage({ type: "chat_updated" });
      ch.close();
    }
  }, []);

  const fetchSession = useCallback(
    async (id: string, markRead = false) => {
      try {
        const res = await fetch(
          `/api/admin/public-chat?sessionId=${encodeURIComponent(id)}${
            markRead ? "&markReadBy=visitor" : ""
          }`,
          { cache: "no-store" }
        );
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && data.session) {
          setSession(data.session);
          if (data.session.visitorName !== "Visitante da Landing Page") {
            setVisitorName((prev) => prev || data.session.visitorName);
            setContactSaved(true);
            setShowContactForm(false);
          }
          if (data.session.clinicName !== "Clínica em Avaliação") {
            setClinicName((prev) => prev || data.session.clinicName);
          }
          if (data.session.whatsapp) {
            setWhatsapp((prev) => prev || data.session.whatsapp);
          }
        }
      } catch {
        // silent retry on next poll
      }
    },
    []
  );

  // Restaura sessão anterior ou abre suavemente o cartão inicial como na referência visual
  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedId = localStorage.getItem(STORAGE_SESSION_KEY);
    if (savedId) {
      setSessionId(savedId);
      fetchSession(savedId);
    }

    const wasDismissed = sessionStorage.getItem(STORAGE_DISMISSED_KEY) === "1";
    if (!wasDismissed) {
      const timer = window.setTimeout(() => setIsOpen(true), 650);
      return () => window.clearTimeout(timer);
    }
  }, [fetchSession]);

  // Polling em tempo real + BroadcastChannel para refletir respostas do ADMIN Master instantaneamente
  useEffect(() => {
    if (!sessionId) return;

    const interval = window.setInterval(() => {
      fetchSession(sessionId, isOpen && view === "chat");
    }, 2500);

    let ch: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      ch = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      ch.onmessage = () => {
        fetchSession(sessionId, isOpen && view === "chat");
      };
    }

    return () => {
      window.clearInterval(interval);
      if (ch) ch.close();
    };
  }, [sessionId, isOpen, view, fetchSession]);

  useEffect(() => {
    if (view === "chat" && isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [session?.messages?.length, view, isOpen]);

  const handleToggleOpen = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        sessionStorage.setItem(STORAGE_DISMISSED_KEY, next ? "0" : "1");
      }
      if (next && sessionId && view === "chat") {
        fetchSession(sessionId, true);
      }
      return next;
    });
  };

  const handleOpenMainCta = () => {
    setIsOpen(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(STORAGE_DISMISSED_KEY, "0");
    }
    if (sessionId && session) {
      setView("chat");
      fetchSession(sessionId, true);
    } else {
      setView("menu");
    }
  };

  const handleSelectOption = async (intent: PublicChatIntent) => {
    setSelectedIntent(intent);
    setView("chat");
    setIsOpen(true);

    try {
      const res = await fetch("/api/admin/public-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start_session",
          sessionId: sessionId || undefined,
          visitorName: visitorName.trim() || undefined,
          clinicName: clinicName.trim() || undefined,
          whatsapp: whatsapp.trim() || undefined,
          intent,
          sourcePage,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.session) {
          setSession(data.session);
          setSessionId(data.session.id);
          if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_SESSION_KEY, data.session.id);
          }
          notifyAdminSync();
        }
      }
    } catch {
      // keep chat UI responsive even on transient error
    }
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim() && !whatsapp.trim() && !clinicName.trim()) return;

    try {
      if (sessionId) {
        const res = await fetch("/api/admin/public-chat", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            visitorName: visitorName.trim() || undefined,
            clinicName: clinicName.trim() || undefined,
            whatsapp: whatsapp.trim() || undefined,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.session) setSession(data.session);
        }
      } else {
        await handleSelectOption(selectedIntent);
      }
      setContactSaved(true);
      setShowContactForm(false);
      notifyAdminSync();
    } catch {
      // silent
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || sending) return;

    setSending(true);
    setDraft("");

    try {
      const res = await fetch("/api/admin/public-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_message",
          sessionId: sessionId || undefined,
          sender: "visitor",
          senderName: visitorName.trim() || undefined,
          visitorName: visitorName.trim() || undefined,
          clinicName: clinicName.trim() || undefined,
          whatsapp: whatsapp.trim() || undefined,
          intent: selectedIntent,
          sourcePage,
          text,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.session) {
          setSession(data.session);
          setSessionId(data.session.id);
          if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_SESSION_KEY, data.session.id);
          }
          notifyAdminSync();
        }
      }
    } finally {
      setSending(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    if (typeof window === "undefined") return;
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = `/#${sectionId}`;
    }
  };

  const unreadFromAdmin = session?.unreadVisitorCount || 0;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[90] flex flex-col items-end font-body">
      {/* ─── POPUP FLUTUANTE ACIMA DO LAUNCHER ──────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.96 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="mb-3 w-[calc(100vw-2rem)] sm:w-[372px] rounded-[28px] bg-white text-zinc-900 shadow-[0_24px_64px_rgba(0,0,0,0.22)] border border-zinc-200/80 overflow-hidden"
          >
            {view === "menu" ? (
              <div className="p-5">
                <p className="text-[15px] font-medium text-zinc-800 mb-3 px-1">
                  Como você prefere começar?
                </p>

                <div className="space-y-1.5">
                  {MENU_OPTIONS.map((opt) => (
                    <button
                      key={opt.intent}
                      type="button"
                      onClick={() => handleSelectOption(opt.intent)}
                      className="w-full flex items-center gap-3.5 p-2.5 rounded-2xl hover:bg-zinc-50 active:scale-[0.99] transition-all text-left group"
                    >
                      <div className="w-11 h-11 rounded-2xl bg-[#F4F4F5] group-hover:bg-zinc-200/70 flex items-center justify-center shrink-0 transition-colors">
                        <OptionIcon kind={opt.icon} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-semibold text-zinc-900 leading-snug">
                          {opt.title}
                        </p>
                        <p className="text-[13px] text-zinc-500 leading-snug">
                          {opt.subtitle}
                        </p>
                      </div>

                      <ChevronRight
                        size={17}
                        className="text-zinc-400 group-hover:text-zinc-800 group-hover:translate-x-0.5 transition-all shrink-0"
                      />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* ─── VIEW 2: CHAT AO VIVO CONECTADO AO ADMIN MASTER ────── */
              <div className="flex flex-col h-[460px] max-h-[75vh]">
                {/* Header */}
                <div className="px-4 py-3.5 bg-[#141414] text-white flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button
                      type="button"
                      onClick={() => setView("menu")}
                      className="p-1.5 rounded-xl hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                      aria-label="Voltar ao menu"
                    >
                      <ArrowLeft size={16} />
                    </button>
                    <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shrink-0">
                      <MedCoreEmblemIcon />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold leading-tight truncate flex items-center gap-1.5">
                        Central MedCore
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Ao vivo
                        </span>
                      </p>
                      <p className="text-[11px] text-zinc-400 truncate">
                        {session?.intentLabel || "Falar com um especialista"}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowContactForm((s) => !s)}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-[11px] font-semibold text-zinc-200 transition-colors shrink-0 flex items-center gap-1"
                  >
                    <UserCheck size={12} />
                    <span>{contactSaved ? "Editar" : "Meus dados"}</span>
                  </button>
                </div>

                {/* Formulário compacto de identificação do lead */}
                <AnimatePresence initial={false}>
                  {showContactForm && (
                    <motion.form
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      onSubmit={handleSaveContact}
                      className="bg-zinc-50 border-b border-zinc-200 px-4 py-3 space-y-2 overflow-hidden"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                          Identificação rápida para o especialista
                        </span>
                        {contactSaved && (
                          <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                            <Check size={12} /> Enviado ao Admin
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={visitorName}
                          onChange={(e) => setVisitorName(e.target.value)}
                          placeholder="Seu nome / Dr(a)."
                          className="px-3 py-1.5 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900"
                        />
                        <input
                          type="text"
                          value={whatsapp}
                          onChange={(e) => setWhatsapp(e.target.value)}
                          placeholder="WhatsApp (DDD)"
                          className="px-3 py-1.5 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900"
                        />
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={clinicName}
                          onChange={(e) => setClinicName(e.target.value)}
                          placeholder="Nome da clínica ou especialidade"
                          className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1.5 rounded-xl bg-[#141414] hover:bg-zinc-800 text-white text-xs font-semibold shrink-0 transition-colors"
                        >
                          Salvar
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Lista de mensagens em tempo real */}
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-white">
                  {(session?.messages || []).map((msg) => {
                    const isVisitor = msg.sender === "visitor";
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${
                          isVisitor ? "items-end" : "items-start"
                        }`}
                      >
                        <span className="text-[10px] font-semibold text-zinc-400 mb-1 px-1">
                          {msg.senderName} • {formatMessageTime(msg.createdAt)}
                        </span>
                        <div
                          className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                            isVisitor
                              ? "bg-[#141414] text-white rounded-br-sm"
                              : "bg-zinc-100 text-zinc-900 rounded-bl-sm border border-zinc-200/70"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Atalhos contextuais conforme opção selecionada */}
                <div className="px-4 py-2 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between gap-2 text-[11px]">
                  {selectedIntent === "demonstracao" ? (
                    <button
                      type="button"
                      onClick={() => scrollToSection("demo")}
                      className="font-semibold text-sky-600 hover:text-sky-700 inline-flex items-center gap-1"
                    >
                      <PlayCircle size={12} /> Ver tour interativo na página
                    </button>
                  ) : selectedIntent === "planos" ? (
                    <button
                      type="button"
                      onClick={() => scrollToSection("planos")}
                      className="font-semibold text-sky-600 hover:text-sky-700 inline-flex items-center gap-1"
                    >
                      <LayoutGrid size={12} /> Ir para tabela de planos
                    </button>
                  ) : (
                    <span className="text-zinc-500 flex items-center gap-1">
                      <Sparkles size={11} className="text-sky-500" />
                      Conectado ao ADMIN Master
                    </span>
                  )}

                  <a
                    href={`https://wa.me/5511999999999?text=${encodeURIComponent(
                      `Olá! Vim pelo site da MedCore (${
                        session?.intentLabel || "Especialista"
                      }). Meu nome é ${visitorName || "Visitante"}${
                        clinicName ? ` (${clinicName})` : ""
                      }.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 shrink-0"
                  >
                    WhatsApp <ExternalLink size={11} />
                  </a>
                </div>

                {/* Composer */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-3 bg-white border-t border-zinc-200 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Escreva sua mensagem para o time..."
                    className="flex-1 px-3.5 py-2.5 rounded-2xl bg-zinc-100 border border-zinc-200/80 text-xs sm:text-[13px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-900 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!draft.trim() || sending}
                    className="w-10 h-10 rounded-2xl bg-[#141414] hover:bg-zinc-800 disabled:opacity-40 text-white flex items-center justify-center shrink-0 transition-all active:scale-95"
                    aria-label="Enviar mensagem"
                  >
                    <Send size={15} />
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── CÁPSULA INFERIOR FLUTUANTE (EXATA À REFERÊNCIA VISUAL) ─── */}
      <div className="bg-white p-1.5 rounded-[22px] shadow-[0_14px_40px_rgba(0,0,0,0.22)] border border-zinc-200/90 flex items-center gap-1.5">
        <button
          type="button"
          onClick={handleOpenMainCta}
          className="bg-[#161616] hover:bg-zinc-800 active:scale-[0.99] text-white pl-2.5 pr-4 py-2 rounded-[16px] flex items-center gap-2.5 transition-all"
        >
          <span className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-xs">
            <MedCoreEmblemIcon />
          </span>
          <span className="text-sm font-semibold tracking-tight whitespace-nowrap">
            Fale com a MedCore
          </span>
          {unreadFromAdmin > 0 && (
            <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-emerald-500 text-zinc-950 text-[10px] font-black leading-none">
              {unreadFromAdmin}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={handleToggleOpen}
          aria-label={isOpen ? "Fechar menu de chat" : "Abrir menu de chat"}
          className="relative w-11 h-11 rounded-[16px] border-[1.5px] border-zinc-900 bg-white hover:bg-zinc-100 text-zinc-900 flex items-center justify-center transition-all active:scale-95"
        >
          {isOpen ? <X size={18} strokeWidth={2} /> : <MessageCircle size={18} strokeWidth={2} />}
          {!isOpen && unreadFromAdmin > 0 && (
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
          )}
        </button>
      </div>
    </div>
  );
}
