"use client";

import React, { useState } from "react";
import { 
  LifeBuoy, MessageSquare, Phone, BookOpen, ChevronRight, FileText, 
  Ticket, Send, Plus, Clock, CheckCircle2, AlertCircle, PhoneCall,
  Calendar, Loader2, ArrowRight, Shield
} from "lucide-react";
import { sanitize } from "@/lib/sanitize";
import { cn } from "@/lib/utils";

const TICKET_CATEGORIES = [
  "Acesso / Login",
  "Módulo com erro",
  "Dúvida sobre plano",
  "Financeiro / Cobrança",
  "Integração (Google, Outlook...)",
  "Solicitação de recurso",
  "Outro",
];

type Ticket = {
  id: string;
  assunto: string;
  categoria: string;
  status: "aberto" | "em_andamento" | "resolvido";
  data: string;
  mensagens: number;
};

const mockTickets: Ticket[] = [
  { id: "#0023", assunto: "Não consigo conectar meu Outlook", categoria: "Integração", status: "em_andamento", data: "Hoje 14:32", mensagens: 3 },
  { id: "#0019", assunto: "Relatório PDF está sem logo", categoria: "Módulo com erro", status: "resolvido", data: "Ontem 09:15", mensagens: 5 },
  { id: "#0014", assunto: "Dúvida sobre limites do plano PRO", categoria: "Dúvida sobre plano", status: "resolvido", data: "12/04", mensagens: 2 },
];

const statusMap = {
  aberto: { label: "Aberto", color: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
  em_andamento: { label: "Em andamento", color: "text-primary bg-primary/10 border-primary/20" },
  resolvido: { label: "Resolvido", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
};

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<"chat" | "tickets" | "docs">("chat");
  const [novoTicket, setNovoTicket] = useState(false);
  const [assunto, setAssunto] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [ticketCriado, setTicketCriado] = useState(false);
  const [chatMsg, setChatMsg] = useState("");
  const [chatSent, setChatSent] = useState(false);

  const handleEnviarTicket = async () => {
    if (!assunto || !categoria || !descricao) return;
    setEnviando(true);
    
    // Sanitização antes de enviar
    const cleanAssunto = sanitize(assunto);
    const cleanDescricao = sanitize(descricao);
    
    await new Promise(r => setTimeout(r, 1600));
    setEnviando(false);
    setTicketCriado(true);
    setNovoTicket(false);
    setAssunto(""); setCategoria(""); setDescricao("");
  };

  const handleChatSend = () => {
    if (!chatMsg.trim()) return;
    const cleanMsg = sanitize(chatMsg);
    setChatSent(true);
    setChatMsg("");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-outline-variant/30 pb-6">
        <div>
          <h1 className="text-4xl font-semibold text-on-surface font-heading tracking-tighter">Suporte</h1>
          <p className="text-on-surface-variant font-medium text-sm opacity-70 mt-1">
            Central de atendimento VitalFlow — estamos aqui para ajudar.
          </p>
        </div>
        {/* Status Badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-fit">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-semibold text-emerald-400 uppercase tracking-widest">Equipe Online</span>
          <span className="text-sm text-emerald-500/60 font-medium">· Resp. ~5 min</span>
        </div>
      </div>

      {/* ══════════ CALL DE EMERGÊNCIA ══════════ */}
      <div className="relative p-6 rounded-[2rem] bg-gradient-to-br from-red-950/60 to-rose-950/40 border border-red-500/20 overflow-hidden">
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-red-500/10 rounded-full blur-3xl" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
              <PhoneCall size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white ">Call de Emergência</h3>
              <p className="text-sm text-red-300/70 font-medium max-w-sm">
                Para clientes dos planos <strong className="text-red-300">Max e Empresas</strong>. Linha direta com nossa equipe técnica sênior.
              </p>
              <p className="text-xl font-semibold text-red-300 mt-2 tracking-tight">+55 (11) 4002-8922</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <a href="tel:+551140028922" className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-400 text-white font-semibold text-sm rounded-2xl transition-all active:scale-95 shadow-lg shadow-red-500/20">
              <Phone size={16} /> Ligar Agora
            </a>
            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-300 font-semibold text-xs rounded-2xl hover:bg-red-500/20 transition-all uppercase tracking-widest">
              <Calendar size={14} /> Agendar Chamada
            </button>
          </div>
        </div>
      </div>

      {/* ══════════ TABS ══════════ */}
      <div className="flex items-center gap-2 p-1 bg-surface-container-low border border-outline-variant/20 rounded-2xl w-fit">
        {[
          { key: "chat" as const, label: "Chat ao Vivo", icon: MessageSquare },
          { key: "tickets" as const, label: "Meus Tickets", icon: Ticket },
          { key: "docs" as const, label: "Documentação", icon: BookOpen },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-widest transition-all",
              activeTab === tab.key
                ? "bg-primary text-white shadow-md"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
            )}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ══════════ CONTEÚDO DOS TABS ══════════ */}
      
      {/* CHAT AO VIVO */}
      {activeTab === "chat" && (
        <div className="bg-surface-container-low border border-outline-variant/20 rounded-[2rem] overflow-hidden animate-in fade-in duration-300">
          {/* Cabeçalho do chat */}
          <div className="flex items-center gap-4 p-5 border-b border-outline-variant/15">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <LifeBuoy className="text-primary" size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface ">Suporte VitalFlow</p>
              <p className="text-sm text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse inline-block" />
                Online · Responde em minutos
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="p-6 space-y-4 min-h-[280px]">
            <div className="flex gap-3 max-w-sm">
              <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <LifeBuoy size={14} />
              </div>
              <div className="bg-surface-container-highest/40 border border-outline-variant/10 p-4 rounded-2xl rounded-tl-none">
                <p className="text-sm text-on-surface-variant font-medium ">
                  Olá! 👋 Bem-vindo ao suporte VitalFlow. Como posso te ajudar hoje?
                </p>
              </div>
            </div>

            {chatSent && (
              <div className="flex gap-3 flex-row-reverse max-w-sm ml-auto">
                <div className="w-8 h-8 rounded-xl bg-zinc-700 border border-zinc-600 flex items-center justify-center text-zinc-400 shrink-0">
                  <span className="text-sm font-semibold">EU</span>
                </div>
                <div className="bg-primary/20 border border-primary/20 p-4 rounded-2xl rounded-tr-none text-right">
                  <p className="text-sm text-on-surface font-medium ">Mensagem enviada! Em breve nossa equipe responderá.</p>
                </div>
              </div>
            )}
          </div>

          {/* Input do chat */}
          <div className="p-5 border-t border-outline-variant/15">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={chatMsg}
                onChange={(e) => setChatMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleChatSend()}
                placeholder="Digite sua mensagem e pressione Enter..."
                className="flex-1 bg-surface-container-highest/40 border-2 border-outline-variant/20 hover:border-primary/30 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none rounded-2xl px-5 py-3 text-sm font-medium transition-all placeholder:text-zinc-600"
              />
              <button
                onClick={handleChatSend}
                disabled={!chatMsg.trim()}
                className="w-11 h-11 bg-primary text-white rounded-xl flex items-center justify-center hover:shadow-lg shadow-primary/30 transition-all active:scale-95 disabled:opacity-40"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-xs text-zinc-600 font-medium text-center mt-2">
              Atendimento disponível seg–sex das 08h às 20h (BRT)
            </p>
          </div>
        </div>
      )}

      {/* TICKETS */}
      {activeTab === "tickets" && (
        <div className="space-y-5 animate-in fade-in duration-300">
          {/* Banner ticket criado */}
          {ticketCriado && (
            <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
              <CheckCircle2 size={18} className="text-emerald-400" />
              <p className="text-sm text-emerald-400 font-medium">Ticket criado com sucesso! Nossa equipe responderá em breve.</p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-on-surface ">Meus Tickets</h2>
            <button
              onClick={() => setNovoTicket(!novoTicket)}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-xs font-semibold uppercase tracking-widest hover:bg-primary/80 transition-all"
            >
              <Plus size={14} /> Abrir Ticket
            </button>
          </div>

          {/* Formulário Novo Ticket */}
          {novoTicket && (
            <div className="bg-surface-container-low border border-outline-variant/20 rounded-[2rem] p-6 space-y-4 animate-in slide-in-from-top-2 duration-300">
              <h3 className="text-sm font-semibold text-on-surface ">Novo Chamado de Suporte</h3>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-zinc-500 uppercase tracking-widest">Categoria</label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full bg-surface-container-highest/40 border border-outline-variant/30 focus:border-primary/50 outline-none rounded-xl px-4 py-3 text-sm font-medium transition-all"
                >
                  <option value="">Selecione a categoria...</option>
                  {TICKET_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-zinc-500 uppercase tracking-widest">Assunto</label>
                <input
                  value={assunto}
                  onChange={(e) => setAssunto(e.target.value)}
                  placeholder="Ex: Botão de exportar PDF não funciona"
                  className="w-full bg-surface-container-highest/40 border border-outline-variant/30 focus:border-primary/50 outline-none rounded-xl px-4 py-3 text-sm font-medium transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-zinc-500 uppercase tracking-widest">Descrição detalhada</label>
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  rows={4}
                  placeholder="Descreva o problema, o que você estava fazendo e qual erro apareceu..."
                  className="w-full bg-surface-container-highest/40 border border-outline-variant/30 focus:border-primary/50 outline-none rounded-xl px-4 py-3 text-sm font-medium transition-all resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setNovoTicket(false)}
                  className="flex-1 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-widest border border-outline-variant/30 rounded-xl hover:bg-surface-container transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleEnviarTicket}
                  disabled={!assunto || !categoria || !descricao || enviando}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white text-xs font-semibold uppercase tracking-widest rounded-xl hover:bg-primary/80 transition-all disabled:opacity-50"
                >
                  {enviando ? <><Loader2 size={14} className="animate-spin" /> Enviando...</> : <><Send size={14} /> Enviar Ticket</>}
                </button>
              </div>
            </div>
          )}

          {/* Lista de Tickets */}
          <div className="space-y-3">
            {mockTickets.map((ticket, i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-surface-container-low border border-outline-variant/20 rounded-2xl hover:border-outline-variant/40 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-semibold text-zinc-600 uppercase">{ticket.id}</span>
                    <Clock size={12} className="text-zinc-700 mt-0.5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-on-surface ">{ticket.assunto}</p>
                    <p className="text-sm text-zinc-500 font-medium">{ticket.categoria} · {ticket.data} · {ticket.mensagens} mensagem(ns)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn("px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-widest border", statusMap[ticket.status].color)}>
                    {statusMap[ticket.status].label}
                  </span>
                  <ChevronRight size={14} className="text-zinc-600 group-hover:text-on-surface transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DOCUMENTAÇÃO */}
      {activeTab === "docs" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Shield, title: "Segurança & LGPD", desc: "PIN, biometria, 2FA e controle de acesso.", color: "text-emerald-400" },
              { icon: LifeBuoy, title: "Guia do Administrador", desc: "Configuração de unidades, planos e usuários.", color: "text-primary" },
              { icon: FileText, title: "Relatórios & Exportação", desc: "Como gerar PDFs com assinatura e logo.", color: "text-violet-400" },
              { icon: MessageSquare, title: "IA Executiva", desc: "Como usar o chat de IA e interpretar insights.", color: "text-rd-cyan" },
              { icon: BookOpen, title: "API & Integrações", desc: "Google, Outlook, IMAP e endpoints REST.", color: "text-amber-400" },
              { icon: AlertCircle, title: "Erros Comuns", desc: "Soluções para problemas frequentes do sistema.", color: "text-red-400" },
            ].map((item, i) => (
              <button key={i} className="text-left group p-6 bg-surface-container-low border border-outline-variant/20 rounded-2xl hover:border-outline-variant/40 transition-all">
                <item.icon className={cn("mb-4 group-hover:scale-110 transition-transform", item.color)} size={24} />
                <h3 className="text-sm font-semibold text-on-surface mb-1">{item.title}</h3>
                <p className="text-sm text-zinc-500 font-medium leading-relaxed">{item.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-zinc-500 group-hover:text-primary transition-colors uppercase tracking-widest">
                  Ler guia <ArrowRight size={10} />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Rodapé */}
      <footer className="pt-8 border-t border-outline-variant/20 flex flex-col items-center text-center">
        <LifeBuoy size={32} className="text-primary/20 mb-3" />
        <p className="text-sm font-semibold text-zinc-500 uppercase tracking-[0.3em] mb-1">MedCore Unified Support Ecosystem</p>
        <p className="text-xs text-zinc-600 font-medium">Atendimento Seg–Sex 08h–20h · sac@medcore.app.br</p>
      </footer>
    </div>
  );
}
