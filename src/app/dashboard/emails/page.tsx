"use client";

import React, { useState } from "react";
import { Mail, Star, Trash2, Archive, RefreshCw, Reply, Forward, Sparkles, Loader2, Search, Inbox, Send, Plus, X } from "lucide-react";
import { sanitize } from "@/lib/utils";

type EmailSource = "Gmail" | "Outlook" | "Teams";
type EmailStatus = "unread" | "read" | "starred" | "archived";

interface Email {
  id: string;
  source: EmailSource;
  from: string;
  fromEmail: string;
  subject: string;
  preview: string;
  body: string;
  date: string;
  status: EmailStatus;
  aiSummary: string;
}

const SOURCE_COLORS: Record<EmailSource, string> = {
  Gmail:   "bg-red-50 border-red-200 text-red-700",
  Outlook: "bg-blue-50 border-blue-200 text-blue-700",
  Teams:   "bg-violet-50 border-violet-200 text-violet-700",
};

const SOURCE_ICONS: Record<EmailSource, string> = { Gmail: "✉️", Outlook: "📬", Teams: "💬" };

const MOCK_EMAILS: Email[] = [];

export default function EmailPage() {
  const [emails, setEmails] = useState<Email[]>(MOCK_EMAILS);
  const [selected, setSelected] = useState<Email | null>(null);
  const [filter, setFilter] = useState<"all" | EmailSource>("all");
  const [search, setSearch] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [tab, setTab] = useState<"inbox" | "compose">("inbox");
  const [compose, setCompose] = useState({ to: "", subject: "", body: "" });

  const displayed = emails.filter(e => {
    if (filter !== "all" && e.source !== filter) return false;
    if (search && !e.subject.toLowerCase().includes(search.toLowerCase()) && !e.from.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const summarizeAI = async (email: Email) => {
    setAiLoading(true);
    try {
      const { callAI } = await import("@/lib/services/openrouter");
      const result = await callAI([
        { role: "system", content: "Você é um assistente executivo. Resuma o e-mail em português, extraindo: ação necessária, prazo (se houver) e urgência (Alta/Média/Baixa). Seja conciso." },
        { role: "user", content: `De: ${email.from} <${email.fromEmail}>\nAssunto: ${email.subject}\n\n${email.body}` },
      ]);
      const updated = { ...email, aiSummary: result };
      setEmails(prev => prev.map(x => x.id === email.id ? updated : x));
      setSelected(updated);
    } catch { alert("Erro ao conectar com a IA."); }
    setAiLoading(false);
  };

  const toggleStar = (id: string) => setEmails(prev => prev.map(e => e.id === id ? { ...e, status: e.status === "starred" ? "read" : "starred" } : e));
  const markRead = (id: string) => setEmails(prev => prev.map(e => e.id === id ? { ...e, status: e.status === "unread" ? "read" : e.status } : e));
  const archiveEmail = (id: string) => { setEmails(prev => prev.map(e => e.id === id ? { ...e, status: "archived" } : e)); setSelected(null); };
  const unreadCount = emails.filter(e => e.status === "unread").length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Action Bar Compacta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900/90 border-2 border-zinc-200 dark:border-zinc-700/80 px-5 py-3.5 rounded-2xl shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rd-cyan animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">Central de Comunicações & Mensageria</span>
          </div>
          <span className="text-zinc-300 dark:text-zinc-700">|</span>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 border border-primary/20 text-primary">
            {unreadCount} Não Lidos
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            Gmail + Outlook + Teams
          </span>
        </div>

        <button 
          onClick={() => setTab(tab === "inbox" ? "compose" : "inbox")} 
          className="flex items-center gap-2 px-4 py-2 bg-rd-cyan text-zinc-950 rounded-xl text-sm font-bold shadow-md shadow-rd-cyan/20 hover:bg-rd-cyan/90 transition-all shrink-0"
        >
          {tab === "inbox" ? <><Plus size={16}/> Novo E-mail</> : <><Inbox size={16}/> Caixa de Entrada</>}
        </button>
      </div>

      {/* OAuth notice */}
      <div className="p-4 bg-amber-500/10 border-2 border-amber-500/30 rounded-2xl flex items-start gap-3 backdrop-blur-md">
        <span className="text-lg">🔐</span>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">Integração OAuth2 Segura (Em Breve)</p>
          <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">E-mails reais exigem autenticação com Google Workspace e Microsoft 365. A interface está completa — os dados abaixo são demonstrativos com IA ativa para resumos!</p>
        </div>
      </div>

      {tab === "compose" ? (
        <div className="bg-white dark:bg-zinc-900/85 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700/80 shadow-md p-6 space-y-4 max-w-2xl backdrop-blur-xl">
          <h2 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">Novo E-mail</h2>
          <input 
            className="w-full bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rd-cyan text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400" 
            placeholder="Para: email@destinatario.com" 
            value={compose.to} 
            onChange={e => setCompose({ ...compose, to: sanitize(e.target.value) })}
          />
          <input 
            className="w-full bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rd-cyan text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400" 
            placeholder="Assunto" 
            value={compose.subject} 
            onChange={e => setCompose({ ...compose, subject: sanitize(e.target.value) })}
          />
          <textarea 
            className="w-full bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rd-cyan resize-none h-48 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400" 
            placeholder="Mensagem..." 
            value={compose.body} 
            onChange={e => setCompose({ ...compose, body: sanitize(e.target.value) })}
          />
          <div className="flex gap-3">
            <button onClick={() => setTab("inbox")} className="px-5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Cancelar</button>
            <button 
              className="px-6 py-2.5 rounded-xl bg-rd-cyan text-zinc-950 text-sm font-bold shadow-md shadow-rd-cyan/20 hover:bg-rd-cyan/90 transition-all flex items-center gap-2"
              onClick={() => {
                console.log("Enviando e-mail sanitizado:", compose);
                alert("Simulação: E-mail enviado com segurança!");
              }}
            >
              <Send size={16}/> Enviar (OAuth2 necessário)
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Email list */}
          <div className="xl:col-span-2 space-y-3">
            {/* Source filters */}
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${filter === "all" ? "bg-rd-cyan/15 border-rd-cyan/40 text-rd-cyan" : "bg-white dark:bg-zinc-900/85 border-zinc-200 dark:border-zinc-700/80 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600"}`}>
                Todos ({emails.filter(e => e.status !== "archived").length})
              </button>
              {(["Gmail","Outlook","Teams"] as EmailSource[]).map(s => (
                <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${filter === s ? SOURCE_COLORS[s] : "bg-white dark:bg-zinc-900/85 border-zinc-200 dark:border-zinc-700/80 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600"}`}>
                  {SOURCE_ICONS[s]} {s} ({emails.filter(e => e.source === s && e.status !== "archived").length})
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"/>
              <input 
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900/85 border-2 border-zinc-200 dark:border-zinc-700/80 rounded-xl text-sm focus:outline-none focus:border-rd-cyan text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 shadow-sm transition-colors" 
                placeholder="Pesquisar e-mails por assunto, remetente ou conteúdo..." 
                value={search} 
                onChange={e => setSearch(sanitize(e.target.value))}
              />
            </div>

            {displayed.filter(e => e.status !== "archived").map(email => (
              <div
                key={email.id}
                onClick={() => { setSelected(email); markRead(email.id); }}
                className={`group flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all hover:border-rd-cyan/50 hover:shadow-md ${email.status === "unread" ? "bg-rd-cyan/5 border-rd-cyan/30 shadow-sm" : "bg-white dark:bg-zinc-900/85 border-zinc-200 dark:border-zinc-700/80"}`}
              >
                <div className={`w-8 h-8 rounded-xl text-sm flex items-center justify-center shrink-0 border ${SOURCE_COLORS[email.source]}`}>
                  {SOURCE_ICONS[email.source]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className={`text-sm ${email.status === "unread" ? "font-bold text-zinc-900 dark:text-zinc-100" : "font-medium text-zinc-700 dark:text-zinc-300"}`}>{email.from}</p>
                    <span className="text-xs text-zinc-400 shrink-0">{email.date}</span>
                  </div>
                  <p className={`text-sm ${email.status === "unread" ? "font-semibold text-zinc-900 dark:text-zinc-100" : "text-zinc-600 dark:text-zinc-400"} truncate`}>{email.subject}</p>
                  <p className="text-xs text-zinc-400 truncate mt-0.5">{email.preview}</p>
                </div>
                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={e => { e.stopPropagation(); toggleStar(email.id); }} className={email.status === "starred" ? "text-amber-500" : "text-zinc-400 hover:text-amber-500"}>
                    <Star size={14}/>
                  </button>
                  <button onClick={e => { e.stopPropagation(); archiveEmail(email.id); }} className="text-zinc-400 hover:text-rd-cyan">
                    <Archive size={14}/>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Email detail */}
          <div className="space-y-4">
            {selected ? (
              <>
                <div className="p-5 bg-white dark:bg-zinc-900/85 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700/80 shadow-sm backdrop-blur-xl">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${SOURCE_COLORS[selected.source]}`}>
                        {SOURCE_ICONS[selected.source]} {selected.source}
                      </span>
                      <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mt-2">{selected.subject}</h3>
                      <p className="text-xs text-zinc-400 mt-0.5">{selected.from} · {selected.date}</p>
                    </div>
                    <button onClick={() => setSelected(null)} className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"><X size={13}/></button>
                  </div>
                  <div className="text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 max-h-56 overflow-y-auto">
                    {selected.body}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                      <Reply size={13}/> Responder
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                      <Forward size={13}/> Encaminhar
                    </button>
                  </div>
                </div>

                {/* AI Summary */}
                <div className="p-5 bg-white dark:bg-zinc-900/85 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700/80 shadow-sm backdrop-blur-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles size={15} className="text-rd-cyan"/>
                      <p className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">Resumo por IA</p>
                    </div>
                    <button onClick={() => summarizeAI(selected)} disabled={aiLoading} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rd-cyan text-zinc-950 text-xs font-bold disabled:opacity-60 hover:bg-rd-cyan/90 transition-all">
                      {aiLoading ? <Loader2 size={10} className="animate-spin"/> : <Sparkles size={10}/>}
                      {aiLoading ? "..." : "Resumir"}
                    </button>
                  </div>
                  {selected.aiSummary ? (
                    <p className="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap">{selected.aiSummary}</p>
                  ) : (
                    <p className="text-xs text-zinc-400 text-center py-3">Clique em "Resumir" para obter um resumo executivo com ação e prazo.</p>
                  )}
                </div>
              </>
            ) : (
              <div className="p-6 bg-white dark:bg-zinc-900/85 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700/80 text-center text-zinc-500 dark:text-zinc-400">
                <Mail size={36} className="mx-auto mb-3 opacity-20"/>
                <p className="text-xs">Selecione um e-mail para ler e resumir com IA.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
