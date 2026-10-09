"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  BrainCircuit, Send, Sparkles, Activity, ShieldCheck, Zap, ArrowRight, 
  MessageSquare, Terminal, RefreshCw, History, Plus, Trash2, PieChart, 
  Clock, HardDrive, AlertCircle, CheckCircle2, ChevronRight, UserCheck, Cpu,
  BarChart3, RotateCcw
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { sanitize } from "@/lib/sanitize";
import { useUser } from "@/context/UserContext";
import Markdown from "react-markdown";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: string;
  isError?: boolean;
};

type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
};

type UserPlan = "inicial" | "pro" | "promax";

type TokenUsage = {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
};

const PLAN_CONFIGS: Record<UserPlan, { name: string; maxConversations: number; dailyTokens: number; badgeColor: string }> = {
  inicial: { name: "Plano Inicial", maxConversations: 1, dailyTokens: 15000, badgeColor: "bg-zinc-800/90 text-zinc-200 border-zinc-700" },
  pro: { name: "Plano Pro", maxConversations: 3, dailyTokens: 50000, badgeColor: "bg-rd-cyan/15 text-rd-cyan border-rd-cyan/40 font-semibold" },
  promax: { name: "Plano Pro Max", maxConversations: 5, dailyTokens: 200000, badgeColor: "bg-amber-500/15 text-amber-300 border-amber-500/40 font-semibold" }
};

const aiInsights = [
  { type: "PREDITIVO", content: "Probabilidade de sobrecarga na Unidade de Emergência nas próximas 6 horas: 82.4%. Recomenda-se realocação de 3 médicos.", color: "text-rd-cyan" },
  { type: "OTIMIZAÇÃO", content: "Protocolo de Auditoria VitalFlow detectou redução de 14% na latência de faturamento após ajuste no módulo de laudos.", color: "text-emerald-400" },
  { type: "ESTRATÉGICO", content: "Análise de mercado sugere integração imediata com o Hub Regional de Telemedicina para expansão de cobertura.", color: "text-amber-400" },
];

const markdownComponents = {
  h1: ({ children }: any) => (
    <h1 className="text-xl font-bold text-rd-cyan border-b border-zinc-700/60 pb-2 mt-5 mb-3 font-heading tracking-tight flex items-center gap-2">
      <span className="w-2 h-2 bg-rd-cyan rounded-full shadow-[0_0_8px_#a78bfa]"></span>
      {children}
    </h1>
  ),
  h2: ({ children }: any) => (
    <h2 className="text-lg font-bold text-zinc-100 mt-4 mb-2.5 font-heading tracking-tight flex items-center gap-2">
      <span className="w-1.5 h-4 bg-rd-cyan rounded-full inline-block"></span>
      {children}
    </h2>
  ),
  h3: ({ children }: any) => (
    <h3 className="text-base font-semibold text-rd-cyan/90 mt-3.5 mb-2 font-heading">
      {children}
    </h3>
  ),
  p: ({ children }: any) => (
    <p className="text-sm font-normal text-zinc-200 leading-relaxed my-3 tracking-normal">
      {children}
    </p>
  ),
  ul: ({ children }: any) => (
    <ul className="my-3 ml-4 space-y-2 list-disc list-outside text-sm font-normal text-zinc-200 marker:text-rd-cyan">
      {children}
    </ul>
  ),
  ol: ({ children }: any) => (
    <ol className="my-3 ml-4 space-y-2 list-decimal list-outside text-sm font-normal text-zinc-200 marker:text-rd-cyan marker:font-bold">
      {children}
    </ol>
  ),
  li: ({ children }: any) => (
    <li className="pl-1 leading-relaxed text-sm font-normal text-zinc-200">
      {children}
    </li>
  ),
  strong: ({ children }: any) => (
    <strong className="font-bold text-rd-cyan bg-rd-cyan/10 border border-rd-cyan/20 px-1.5 py-0.5 rounded text-[0.95em]">
      {children}
    </strong>
  ),
  em: ({ children }: any) => (
    <em className="italic text-zinc-300">
      {children}
    </em>
  ),
  blockquote: ({ children }: any) => (
    <blockquote className="my-4 border-l-4 border-rd-cyan bg-zinc-950/70 p-4 rounded-r-2xl border-y border-r border-zinc-800 text-zinc-200 font-normal italic text-sm shadow-inner">
      {children}
    </blockquote>
  ),
  code: ({ inline, className, children, ...props }: any) => {
    if (inline) {
      return (
        <code className="bg-zinc-950 border border-zinc-700/80 text-rd-cyan font-mono text-xs px-2 py-0.5 rounded-md font-medium">
          {children}
        </code>
      );
    }
    return (
      <pre className="bg-zinc-950 border-2 border-zinc-700/80 rounded-2xl p-4 my-4 overflow-x-auto font-mono text-xs text-zinc-200 shadow-inner leading-relaxed">
        <code>{children}</code>
      </pre>
    );
  },
  hr: () => <hr className="my-6 border-zinc-700/60" />,
  table: ({ children }: any) => (
    <div className="overflow-x-auto my-4 border-2 border-zinc-700/60 rounded-2xl bg-zinc-950/80 shadow-md">
      <table className="w-full text-left border-collapse">{children}</table>
    </div>
  ),
  th: ({ children }: any) => (
    <th className="bg-zinc-900 border-b-2 border-zinc-700 p-3.5 text-xs font-bold text-rd-cyan uppercase tracking-wider">
      {children}
    </th>
  ),
  td: ({ children }: any) => (
    <td className="p-3.5 text-xs text-zinc-200 border-b border-zinc-800/80 font-normal">
      {children}
    </td>
  )
};

export default function AIExecPage() {
  const { user } = useUser();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userPlan, setUserPlan] = useState<UserPlan>("pro");
  const [activeTab, setActiveTab] = useState<"conversas" | "cotas" | "insights">("conversas");
  const [quotaWarning, setQuotaWarning] = useState<string | null>(null);

  // Estado Real da Contagem de Tokens
  const [dailyTokensUsed, setDailyTokensUsed] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("medcore_daily_tokens");
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed)) return parsed;
      }
    }
    return 1240; // Inicializador padrão para teste
  });

  const [lastUsage, setLastUsage] = useState<TokenUsage | null>(null);

  const initials = user?.full_name 
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : "OP";
    
  const firstName = user?.full_name ? user.full_name.split(' ')[0] : "Operador";

  // Função auxiliar para criar mensagem inicial
  const createInitialMessage = (): Message => ({
    id: "1",
    role: "ai",
    content: `Saudações, Dr(a). ${firstName}. Sou a Dra. Conte, sua assistente médica e executiva de IA no MEDCore V2. Posso analisar prontuários, fornecer diretrizes clínicas (médicas, veterinárias e de estética), realizar auditoria TISS ou sintetizar relatórios operacionais. Como posso ajudar hoje?`,
    timestamp: "AGORA"
  });

  // Estado das Sessões de Conversa
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("medcore_ai_sessions");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {
          console.error("Erro ao carregar histórico local:", e);
        }
      }
    }
    return [{
      id: "session-1",
      title: "Consulta Médica Inicial",
      messages: [createInitialMessage()],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => sessions[0]?.id || "session-1");

  // Sessão atual ativa
  const currentSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const messages = currentSession ? currentSession.messages : [];

  // Salvar histórico no localStorage sempre que houver mudanças
  useEffect(() => {
    if (typeof window !== "undefined" && sessions.length > 0) {
      localStorage.setItem("medcore_ai_sessions", JSON.stringify(sessions));
    }
  }, [sessions]);

  // Salvar contagem de tokens no localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("medcore_daily_tokens", dailyTokensUsed.toString());
    }
  }, [dailyTokensUsed]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Atualiza mensagens da sessão ativa
  const setMessagesForCurrentSession = (updater: (prevMsgs: Message[]) => Message[]) => {
    setSessions((prevSessions) => 
      prevSessions.map((s) => {
        if (s.id === activeSessionId) {
          const updatedMsgs = updater(s.messages);
          let newTitle = s.title;
          if (s.title.startsWith("Nova Conversa") || s.title === "Consulta Médica Inicial") {
            const firstUserMsg = updatedMsgs.find(m => m.role === "user");
            if (firstUserMsg) {
              newTitle = firstUserMsg.content.slice(0, 32) + (firstUserMsg.content.length > 32 ? "..." : "");
            }
          }
          return {
            ...s,
            title: newTitle,
            messages: updatedMsgs,
            updatedAt: new Date().toISOString()
          };
        }
        return s;
      })
    );
  };

  // Criar Nova Conversa (respeitando limite da cota do plano)
  const handleCreateNewSession = () => {
    setQuotaWarning(null);
    const maxAllowed = PLAN_CONFIGS[userPlan].maxConversations;
    
    if (sessions.length >= maxAllowed) {
      setQuotaWarning(`Limite do ${PLAN_CONFIGS[userPlan].name} atingido (${sessions.length}/${maxAllowed} conversas). Alterne para o Plano Pro Max ou exclua uma conversa.`);
      setActiveTab("conversas");
      return;
    }

    const newId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: `Nova Conversa #${sessions.length + 1}`,
      messages: [createInitialMessage()],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newId);
  };

  // Deletar uma conversa
  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setQuotaWarning(null);
    if (sessions.length <= 1) {
      handleRecalibrate();
      return;
    }

    const filtered = sessions.filter(s => s.id !== sessionId);
    setSessions(filtered);
    if (activeSessionId === sessionId) {
      setActiveSessionId(filtered[0].id);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    setQuotaWarning(null);
    
    const cleanInput = sanitize(input);
    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: cleanInput,
      timestamp: "AGORA"
    };

    setMessagesForCurrentSession((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const apiMessages = [...messages, newMessage].slice(-10).map(m => ({
        role: m.role === "ai" ? "assistant" : m.role,
        content: m.content
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.details || data.error || "Falha na resposta da IA.");
      }

      // Processa e acumula o uso real de tokens retornado pela API
      if (data.usage) {
        const usage: TokenUsage = data.usage;
        setLastUsage(usage);
        setDailyTokensUsed((prev) => prev + usage.totalTokens);
      }
      
      setMessagesForCurrentSession((prev) => [
        ...prev, 
        {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: data.reply,
          timestamp: "AGORA"
        }
      ]);

    } catch (error: any) {
      console.error("Erro no chat:", error);
      setMessagesForCurrentSession((prev) => [
        ...prev, 
        {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: `### ❌ Falha na Conexão Neural\n\nNão foi possível sincronizar a requisição com o núcleo do MEDCore.\n\n**Detalhes Técnicos:**\n\`\`\`text\n${error.message}\n\`\`\`\n\n*Ação Recomendada:* Tente novamente ou recalibre a conversa.`,
          timestamp: "SISTEMA ALPHA CORE • AGORA",
          isError: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRecalibrate = () => {
    setMessagesForCurrentSession(() => [
      {
        id: Date.now().toString(),
        role: "ai",
        content: `🔄 **Sessão Recalibrada.**\n\nMemória desta conversa foi limpa. Como posso ajudar agora, Dr(a). ${firstName}?`,
        timestamp: "AGORA"
      }
    ]);
  };

  const handleResetTokenCounter = () => {
    setDailyTokensUsed(0);
    setLastUsage(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("medcore_daily_tokens");
    }
  };

  const handleRawLogs = () => {
    alert("LOGS DA SESSÃO ATIVA: \n\n" + JSON.stringify({ messages, lastUsage, dailyTokensUsed }, null, 2));
  };

  const planInfo = PLAN_CONFIGS[userPlan];
  const usagePercentage = Math.min(100, (dailyTokensUsed / planInfo.dailyTokens) * 100).toFixed(1);

  return (
    <>
      <div className="space-y-6 animate-in fade-in duration-700 h-full flex flex-col">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 shrink-0">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
               <span className="px-3.5 py-1.5 bg-rd-cyan/10 border border-rd-cyan/30 text-rd-cyan text-xs font-semibold uppercase tracking-widest rounded-full flex items-center gap-2">
                 <Cpu size={14} /> INTELLIGENCE CORE MODULE
               </span>
               <div className="flex items-center gap-2 ml-3">
                 <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></span>
                 <span className="text-xs text-zinc-400 font-semibold uppercase tracking-widest leading-none">Stream Neural ATIVO</span>
               </div>
            </div>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold tracking-tight text-on-surface leading-[0.95]">
              IA <span className="text-gradient-lilac">Executiva</span>
            </h1>
            <p className="text-base text-on-surface-variant font-medium opacity-90 max-w-xl">
              Assistente de Inteligência Clínica & Gestão (Médica, Veterinária e Estética) com controle de sessão e contagem real de tokens.
            </p>
          </div>

          <div className="flex items-center gap-3">
              <button 
                onClick={handleRecalibrate}
                className="flex items-center gap-2 px-5 py-3 bg-zinc-900/90 hover:bg-zinc-800 border-2 border-zinc-700/60 rounded-xl text-on-surface font-heading font-semibold text-sm transition-all shadow-md group"
                title="Limpar memória desta conversa"
              >
                 <RefreshCw size={16} className="text-zinc-400 group-hover:text-rd-cyan transition-colors group-hover:rotate-180 duration-500" />
                 Recalibrar Conversa
              </button>
              <button 
                onClick={handleRawLogs}
                className="relative px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border-2 border-rd-cyan/50 hover:border-rd-cyan text-rd-cyan hover:text-white rounded-xl flex items-center gap-2.5 shadow-[0_0_15px_rgba(167,139,250,0.15)] active:scale-95 transition-all text-sm font-heading font-bold overflow-hidden group"
              >
                 <Terminal size={16} />
                 Raw Logs
                 <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
             </button>
          </div>
        </div>

        {/* Warning Banner se exceder limites */}
        {quotaWarning && (
          <div className="p-4 bg-amber-500/15 border-2 border-amber-500/40 rounded-2xl flex items-center justify-between text-amber-200 text-sm font-medium animate-in slide-in-from-top-2 shadow-lg">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="text-amber-400 shrink-0" />
              <span>{quotaWarning}</span>
            </div>
            <button 
              onClick={() => setActiveTab("cotas")}
              className="px-4 py-2 bg-amber-500/25 hover:bg-amber-500/40 border border-amber-500/50 rounded-xl text-amber-200 font-bold text-xs transition-all shadow-sm"
            >
              Gerenciar Cotas
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 flex-1 min-h-0">
          
          {/* Neural Interface Area (Chat principal) */}
          <div className="xl:col-span-8 flex flex-col h-[calc(100vh-220px)] min-h-[500px]">
             
             {/* Dynamic Header da Sessão Ativa */}
             <div className="bg-zinc-900/90 backdrop-blur-md border-x-2 border-t-2 border-zinc-700/60 rounded-t-[2rem] px-6 py-3.5 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="w-2.5 h-2.5 bg-rd-cyan rounded-full shadow-[0_0_10px_#a78bfa]" />
                  <span className="text-sm font-heading font-bold text-on-surface truncate">
                    {currentSession.title}
                  </span>
                  <span className="text-xs text-zinc-400 font-medium shrink-0">
                    ({messages.length} mensagens)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {lastUsage && (
                    <span className="px-3 py-1 bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold rounded-full flex items-center gap-1.5 shadow-sm">
                      <BarChart3 size={12} /> +{lastUsage.totalTokens} tokens
                    </span>
                  )}
                  <span className={cn("px-3 py-1 border-2 text-xs font-bold rounded-full uppercase tracking-wider shadow-sm", planInfo.badgeColor)}>
                    {planInfo.name} ({sessions.length}/{planInfo.maxConversations})
                  </span>
                </div>
             </div>

             {/* Chat Display Area */}
             <div className="flex-1 bg-zinc-950/60 backdrop-blur-md border-x-2 border-zinc-700/60 p-6 lg:p-8 space-y-6 overflow-y-auto custom-scrollbar">
                
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-5 max-w-3xl ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}>
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 relative overflow-hidden shadow-md ${msg.role === "user" ? "bg-zinc-800 border-2 border-zinc-600 text-zinc-300" : "bg-rd-cyan/15 border-2 border-rd-cyan/40 text-rd-cyan"}`}>
                        {msg.role === "user" ? (
                          <span className="text-sm font-bold">{initials}</span>
                        ) : (
                          <>
                            <div className="absolute inset-0 bg-rd-cyan/10 animate-pulse"></div>
                            <BrainCircuit size={26} />
                          </>
                        )}
                     </div>
                     <div className={`space-y-2 ${msg.role === "user" ? "text-right" : ""}`}>
                        <div className={`p-6 rounded-3xl ${
                          msg.isError 
                            ? "bg-red-500/15 border-2 border-red-500/30 rounded-tl-none text-red-100 shadow-md" 
                            : msg.role === "user" 
                              ? "bg-rd-cyan/20 border-2 border-rd-cyan/30 rounded-tr-none text-on-surface shadow-md text-sm font-normal leading-relaxed" 
                              : "bg-zinc-900/95 border-2 border-zinc-700/70 rounded-tl-none text-on-surface shadow-lg"
                          } max-w-none`}>
                           {msg.role === "ai" ? (
                             <Markdown components={markdownComponents}>{msg.content}</Markdown>
                           ) : (
                             msg.content
                           )}
                        </div>
                        <p className={`text-xs font-heading ${msg.isError ? "text-red-400 font-bold" : "text-zinc-400"} font-semibold uppercase tracking-widest ${msg.role === "user" ? "pr-2" : "pl-2"}`}>
                          {msg.role === "user" ? `${user?.full_name || "OPERADOR"} • ` : "DRA. CONTE CORE • "} {msg.timestamp}
                        </p>
                     </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex gap-5 max-w-3xl">
                     <div className="w-12 h-12 rounded-2xl bg-rd-cyan/15 border-2 border-rd-cyan/40 flex items-center justify-center text-rd-cyan shrink-0 relative overflow-hidden shadow-md">
                        <div className="absolute inset-0 bg-rd-cyan/10 animate-pulse"></div>
                        <BrainCircuit size={26} />
                     </div>
                     <div className="space-y-2">
                        <div className="bg-zinc-900/90 border-2 border-zinc-700/60 p-6 rounded-3xl rounded-tl-none shadow-md">
                           <div className="flex items-center gap-3 mb-3">
                              <span className="w-2.5 h-2.5 bg-rd-cyan rounded-full animate-bounce shadow-[0_0_12px_#a78bfa]"></span>
                              <span className="text-xs font-bold text-rd-cyan uppercase tracking-[0.25em]">ANALISANDO CLINICAMENTE...</span>
                           </div>
                           <p className="text-on-surface font-medium leading-relaxed animate-pulse text-sm">
                              Sintetizando modelo neural médico. Latência estimada: 1.1s.
                           </p>
                        </div>
                     </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
             </div>

             {/* Input Area */}
             <div className="bg-zinc-900/90 backdrop-blur-md border-x-2 border-b-2 border-zinc-700/60 rounded-b-[2rem] p-5 shrink-0 shadow-lg">
                <p className="text-xs font-bold text-rd-cyan uppercase tracking-widest mb-3 flex items-center gap-2">
                  <MessageSquare size={14} /> Digite sua dúvida médica ou consulta de gestão
                </p>
                <div className="relative group">
                   <input 
                     value={input}
                     onChange={(e) => setInput(e.target.value)}
                     onKeyDown={(e) => e.key === "Enter" && handleSend()}
                     placeholder="Ex: Qual o protocolo sugerido para auditoria de guia TISS de procedimento cirúrgico?" 
                     className="w-full bg-zinc-950/80 border-2 border-zinc-700 hover:border-rd-cyan/60 focus:border-rd-cyan focus:ring-4 focus:ring-rd-cyan/15 focus:outline-none h-16 px-6 pr-20 rounded-2xl text-base font-body text-on-surface transition-all duration-300 placeholder:text-zinc-500 font-medium shadow-inner"
                   />
                   <button 
                     onClick={handleSend}
                     disabled={!input.trim()}
                     className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-rd-cyan text-white rounded-xl flex items-center justify-center hover:shadow-[0_0_20px_var(--color-rd-cyan)] hover:scale-105 active:scale-95 transition-all group/btn disabled:opacity-40"
                   >
                      <Send size={20} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                   </button>
                </div>
                <div className="flex justify-between items-center mt-3 px-1">
                   <div className="flex gap-4">
                      <button 
                        onClick={() => setInput("Gere um resumo clínico das diretrizes médicas e estéticas recentes...")}
                        className="text-xs font-semibold text-zinc-400 hover:text-rd-cyan transition-colors flex items-center gap-1.5"
                      >
                        <Sparkles size={14}/> Gerar Insights Clínicos
                      </button>
                      <button 
                        onClick={() => setInput("Como proceder na verificação do limite de cotas do convênio?")}
                        className="text-xs font-semibold text-zinc-400 hover:text-rd-cyan transition-colors flex items-center gap-1.5"
                      >
                        <MessageSquare size={14}/> Sugestão TISS
                      </button>
                   </div>
                   <p className="text-xs text-zinc-500 font-medium font-mono">MEDCore IA v4.28.1 • Nicho Saúde</p>
                </div>
             </div>

          </div>

          {/* Submenu Lateral Direito: Histórico de Conversas, Cotas & Insights */}
          <aside className="xl:col-span-4 flex flex-col gap-4 h-[calc(100vh-220px)] min-h-[500px]">
             
             {/* Navegação por Abas do Submenu com Bordas Destacadas */}
             <div className="bg-zinc-900/90 backdrop-blur-md border-2 border-zinc-700/60 rounded-2xl p-1.5 flex gap-1.5 shrink-0 shadow-md">
                <button
                  onClick={() => setActiveTab("conversas")}
                  className={cn(
                    "flex-1 py-3 px-3 rounded-xl text-xs font-heading font-bold flex items-center justify-center gap-2 transition-all border-2",
                    activeTab === "conversas" 
                      ? "bg-rd-cyan text-white border-rd-cyan shadow-md shadow-rd-cyan/20" 
                      : "text-zinc-400 border-transparent hover:text-on-surface hover:bg-zinc-800/60"
                  )}
                >
                  <History size={16} /> Conversas
                </button>
                <button
                  onClick={() => setActiveTab("cotas")}
                  className={cn(
                    "flex-1 py-3 px-3 rounded-xl text-xs font-heading font-bold flex items-center justify-center gap-2 transition-all border-2",
                    activeTab === "cotas" 
                      ? "bg-rd-cyan text-white border-rd-cyan shadow-md shadow-rd-cyan/20" 
                      : "text-zinc-400 border-transparent hover:text-on-surface hover:bg-zinc-800/60"
                  )}
                >
                  <PieChart size={16} /> Cotas & Tokens
                </button>
                <button
                  onClick={() => setActiveTab("insights")}
                  className={cn(
                    "flex-1 py-3 px-3 rounded-xl text-xs font-heading font-bold flex items-center justify-center gap-2 transition-all border-2",
                    activeTab === "insights" 
                      ? "bg-rd-cyan text-white border-rd-cyan shadow-md shadow-rd-cyan/20" 
                      : "text-zinc-400 border-transparent hover:text-on-surface hover:bg-zinc-800/60"
                  )}
                >
                  <Sparkles size={16} /> Insights
                </button>
             </div>

             {/* Conteúdo Aba 1: Histórico de Conversas (Submenu estilo Gemini) */}
             {activeTab === "conversas" && (
               <div className="bg-zinc-900/80 backdrop-blur-md border-2 border-zinc-700/60 rounded-[2rem] p-6 flex flex-col flex-1 min-h-0 relative overflow-hidden shadow-xl animate-in fade-in duration-300">
                  
                  {/* Botão Nova Conversa */}
                  <div className="space-y-3 mb-4 shrink-0">
                    <button
                      onClick={handleCreateNewSession}
                      className="w-full py-4 px-5 bg-zinc-950 hover:bg-zinc-850 border-2 border-rd-cyan/50 hover:border-rd-cyan text-white font-heading font-bold text-sm rounded-2xl flex items-center justify-between shadow-lg shadow-black/40 active:scale-98 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <Plus size={20} className="text-rd-cyan group-hover:rotate-90 transition-transform duration-300" />
                        <span>Nova Conversa</span>
                      </div>
                      <span className="text-xs bg-rd-cyan/20 text-rd-cyan border border-rd-cyan/40 px-2.5 py-1 rounded-lg font-bold">
                        {sessions.length}/{planInfo.maxConversations}
                      </span>
                    </button>

                    <div className="flex items-center justify-between px-2 text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                      <span>Cota do {planInfo.name}:</span>
                      <span className="text-rd-cyan font-bold">{sessions.length} de {planInfo.maxConversations} conversas</span>
                    </div>
                  </div>

                  {/* Lista de Sessões Gravadas */}
                  <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-1 min-h-0">
                     {sessions.map((session) => {
                       const isActive = session.id === activeSessionId;
                       return (
                         <div
                           key={session.id}
                           onClick={() => setActiveSessionId(session.id)}
                           className={cn(
                             "p-4 rounded-2xl border-2 transition-all cursor-pointer group flex items-center justify-between gap-3 shadow-md",
                             isActive 
                               ? "bg-rd-cyan/15 border-rd-cyan/50 text-on-surface shadow-rd-cyan/10" 
                               : "bg-zinc-950/60 hover:bg-zinc-800/60 border-zinc-750/80 text-zinc-300 hover:text-on-surface hover:border-zinc-600"
                           )}
                         >
                           <div className="flex items-center gap-3.5 overflow-hidden">
                             <div className={cn(
                               "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold border",
                               isActive ? "bg-rd-cyan text-white border-rd-cyan" : "bg-zinc-800 border-zinc-700 text-zinc-400 group-hover:text-zinc-200"
                             )}>
                               <MessageSquare size={16} />
                             </div>
                             <div className="overflow-hidden space-y-1">
                               <p className="text-sm font-semibold truncate leading-snug">
                                 {session.title}
                               </p>
                               <p className="text-xs text-zinc-400 font-mono">
                                 {session.messages.length} msgs • {new Date(session.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                               </p>
                             </div>
                           </div>

                           <div className="flex items-center gap-1.5 shrink-0">
                             <button
                               onClick={(e) => handleDeleteSession(session.id, e)}
                               className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                               title="Excluir conversa da cota"
                             >
                               <Trash2 size={16} />
                             </button>
                             {isActive && <ChevronRight size={16} className="text-rd-cyan" />}
                           </div>
                         </div>
                       );
                     })}
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-800 text-xs text-zinc-500 text-center font-medium">
                    Histórico armazenado com segurança em nuvem MEDCore
                  </div>
               </div>
             )}

             {/* Conteúdo Aba 2: Cotas & Limites de Tokens Reais */}
             {activeTab === "cotas" && (
               <div className="bg-zinc-900/80 backdrop-blur-md border-2 border-zinc-700/60 rounded-[2rem] p-6 flex flex-col flex-1 min-h-0 space-y-5 overflow-y-auto custom-scrollbar shadow-xl animate-in fade-in duration-300">
                  
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                     <div>
                        <h3 className="font-heading text-lg font-bold text-on-surface">Contagem Real de Tokens</h3>
                        <p className="text-xs text-zinc-400">Medição real por requisição e plano</p>
                     </div>
                     <span className={cn("px-3 py-1 border-2 text-xs font-bold rounded-xl uppercase tracking-wider shadow-sm", planInfo.badgeColor)}>
                        {userPlan.toUpperCase()}
                     </span>
                  </div>

                  {/* Seletor do Plano do Usuário para simulação de limites */}
                  <div className="bg-zinc-950/70 border-2 border-zinc-750/80 rounded-2xl p-4 space-y-2.5">
                     <p className="text-xs font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-2">
                       <UserCheck size={14} className="text-rd-cyan"/> Modalidade do Plano
                     </p>
                     <div className="grid grid-cols-3 gap-2">
                       {(["inicial", "pro", "promax"] as UserPlan[]).map((p) => (
                         <button
                           key={p}
                           onClick={() => {
                             setUserPlan(p);
                             setQuotaWarning(null);
                           }}
                           className={cn(
                             "py-2 text-xs font-heading font-bold rounded-xl border-2 transition-all text-center uppercase tracking-wider shadow-sm",
                             userPlan === p 
                               ? "bg-rd-cyan text-white border-rd-cyan shadow-rd-cyan/20" 
                               : "bg-zinc-900 text-zinc-400 hover:text-on-surface border-zinc-700 hover:border-zinc-600"
                           )}
                         >
                           {p === "promax" ? "Pro Max" : p}
                         </button>
                       ))}
                     </div>
                  </div>

                  {/* Barra de Consumo Diário Real de Tokens */}
                  <div className="space-y-2.5 p-4 bg-zinc-950/70 border-2 border-zinc-750/80 rounded-2xl shadow-inner">
                     <div className="flex justify-between items-center text-xs font-medium">
                        <span className="text-zinc-300 font-bold flex items-center gap-1.5">
                          <BarChart3 size={14} className="text-rd-cyan" /> Consumo Real Hoje
                        </span>
                        <span className="font-mono text-rd-cyan font-bold text-sm">
                          {dailyTokensUsed.toLocaleString()} / {planInfo.dailyTokens.toLocaleString()}
                        </span>
                     </div>
                     <div className="h-3.5 bg-zinc-900 rounded-full overflow-hidden p-0.5 border-2 border-zinc-800">
                        <div 
                          className="h-full bg-gradient-to-r from-rd-cyan via-indigo-500 to-emerald-400 rounded-full transition-all duration-700 shadow-[0_0_10px_#10b981]"
                          style={{ width: `${usagePercentage}%` }}
                        />
                     </div>
                     <div className="flex items-center justify-between pt-1 text-xs">
                       <span className="text-zinc-400 font-medium">Uso: <strong>{usagePercentage}%</strong> da franquia</span>
                       <button
                         onClick={handleResetTokenCounter}
                         className="text-zinc-500 hover:text-rd-cyan text-[11px] font-semibold flex items-center gap-1 transition-colors"
                         title="Zerar contador local para novos testes"
                       >
                         <RotateCcw size={12} /> Resetar Teste
                       </button>
                     </div>
                  </div>

                  {/* Card da Última Resposta Processada */}
                  {lastUsage ? (
                    <div className="p-4 bg-rd-cyan/10 border-2 border-rd-cyan/40 rounded-2xl space-y-2">
                      <p className="text-xs font-bold text-rd-cyan uppercase tracking-wider flex items-center gap-2">
                        <Zap size={14} /> Última Resposta da IA (Processada)
                      </p>
                      <div className="grid grid-cols-3 gap-2 text-center pt-1">
                        <div className="p-2 bg-zinc-950/70 rounded-xl border border-zinc-800">
                          <p className="text-sm text-zinc-400 uppercase font-semibold">Prompt</p>
                          <p className="font-mono font-bold text-xs text-zinc-200">{lastUsage.promptTokens}</p>
                        </div>
                        <div className="p-2 bg-zinc-950/70 rounded-xl border border-zinc-800">
                          <p className="text-sm text-zinc-400 uppercase font-semibold">Resposta</p>
                          <p className="font-mono font-bold text-xs text-zinc-200">{lastUsage.completionTokens}</p>
                        </div>
                        <div className="p-2 bg-rd-cyan/20 rounded-xl border border-rd-cyan/40">
                          <p className="text-sm text-rd-cyan uppercase font-semibold">Total</p>
                          <p className="font-mono font-bold text-xs text-rd-cyan">+{lastUsage.totalTokens}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-zinc-950/40 border border-zinc-800 rounded-xl text-center text-xs text-zinc-500">
                      Envie uma mensagem no chat para ver a medição instantânea da API.
                    </div>
                  )}

                  {/* Reset das Cotas (Periódico) */}
                  <div className="grid grid-cols-2 gap-3">
                     <div className="p-4 bg-zinc-950/70 border-2 border-zinc-750/80 rounded-2xl space-y-1">
                        <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <Clock size={14} className="text-rd-cyan" /> Reset por Hora
                        </p>
                        <p className="font-heading text-base font-bold text-on-surface">Reseta em 3h 18m</p>
                        <p className="text-xs text-zinc-500">Janela de 4 horas</p>
                     </div>
                     <div className="p-4 bg-zinc-950/70 border-2 border-zinc-750/80 rounded-2xl space-y-1">
                        <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <HardDrive size={14} className="text-amber-400" /> Armazenamento
                        </p>
                        <p className="font-heading text-base font-bold text-on-surface">1.4 MB / 10 MB</p>
                        <p className="text-xs text-zinc-500">Servidor Nuvem</p>
                     </div>
                  </div>

                  {/* Detalhes dos Limites da Modalidade */}
                  <div className="space-y-2">
                     <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Recursos do {planInfo.name}</p>
                     <ul className="space-y-2 text-xs text-zinc-300 font-medium">
                        <li className="flex items-center gap-2.5 p-2.5 bg-zinc-950/60 border border-zinc-800 rounded-xl">
                          <span className="w-2 h-2 bg-rd-cyan rounded-full"></span>
                          <span>Até <strong>{planInfo.maxConversations} conversas simultâneas</strong> gravadas</span>
                        </li>
                        <li className="flex items-center gap-2.5 p-2.5 bg-zinc-950/60 border border-zinc-800 rounded-xl">
                          <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                          <span>Modelos LLM: <strong>GPT-4o-mini & Llama 3.3 70B</strong></span>
                        </li>
                     </ul>
                  </div>

               </div>
             )}

             {/* Conteúdo Aba 3: Alpha Insights */}
             {activeTab === "insights" && (
               <div className="bg-zinc-900/80 backdrop-blur-md border-2 border-zinc-700/60 rounded-[2rem] p-6 overflow-hidden relative flex-1 flex flex-col justify-between shadow-xl animate-in fade-in duration-300">
                  <div>
                    <div className="flex items-center gap-2.5 mb-6">
                      <div className="w-1.5 h-6 bg-rd-cyan rounded-full"></div>
                      <h3 className="font-heading text-xl font-bold text-on-surface">Alpha Insights</h3>
                    </div>

                    <div className="space-y-4">
                       {aiInsights.map((insight, i) => (
                         <div key={i} className="p-5 bg-zinc-950/70 border-2 border-zinc-750/80 rounded-2xl space-y-3 relative group overflow-hidden hover:border-rd-cyan/50 transition-all cursor-pointer shadow-md">
                            <div className="flex justify-between items-center relative z-10">
                               <span className={cn("text-xs font-bold uppercase tracking-[0.2em]", insight.color)}>{insight.type}</span>
                               <ShieldCheck size={16} className="text-zinc-500" />
                            </div>
                            <p className="text-xs text-on-surface-variant font-medium leading-relaxed relative z-10">
                               {insight.content}
                            </p>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-rd-cyan/5 rounded-full blur-3xl -translate-y-12 translate-x-12"></div>
                         </div>
                       ))}
                    </div>
                  </div>

                  <button className="w-full mt-4 py-3.5 bg-zinc-950 hover:bg-zinc-850 border-2 border-zinc-700 hover:border-rd-cyan/50 text-white rounded-2xl flex items-center justify-between px-6 transition-all group shadow-md">
                     <div className="flex items-center gap-3">
                        <Activity size={18} className="text-rd-cyan"/>
                        <span className="text-xs font-bold text-on-surface uppercase tracking-widest">Ver Matriz Neural</span>
                     </div>
                     <ArrowRight size={18} className="text-zinc-400 group-hover:text-rd-cyan group-hover:translate-x-1 transition-all" />
                  </button>
               </div>
             )}

             {/* Card de Status da Conexão com Bordas Evidentes */}
             <div className="p-4 bg-zinc-900/90 border-2 border-zinc-700/60 rounded-2xl shrink-0 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-3">
                   <Zap size={22} className="text-rd-cyan shadow-[0_0_15px_#a78bfa]"/>
                   <div>
                      <p className="text-xs font-bold text-on-surface uppercase tracking-wider">Sincronização 100%</p>
                      <p className="text-xs text-zinc-400">Cloud-Brain 01 Operacional</p>
                   </div>
                </div>
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
             </div>

          </aside>
        </div>
      </div>
    </>
  );
}
