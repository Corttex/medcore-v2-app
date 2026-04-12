"use client";

import React, { useState } from "react";
import { Mail, Star, Trash2, Archive, RefreshCw, Reply, Forward, Sparkles, Loader2, Search, Inbox, Send, Plus, X } from "lucide-react";

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

const MOCK_EMAILS: Email[] = [
  { id: "1", source: "Outlook", from: "Secretaria Municipal de Saúde", fromEmail: "saude@prefeitura.sp.gov.br", subject: "Convocação — Reunião de Gestores de Saúde", preview: "Prezados diretores, ficam convocados para reunião dia 25/04...", body: "Prezados diretores,\n\nFicam convocados para reunião extraordinária do Comitê Municipal de Gestores de Saúde a realizar-se no dia 25/04/2026, às 14h, no Auditório da SMS, Rua São Bento 405.\n\nPauta:\n1. Indicadores epidemiológicos do 1º trimestre\n2. Atualização do protocolo de monitoramento\n3. Repasse de verbas — CAPS/UPAS\n\nFavor confirmar presença até 20/04.", date: "2026-04-11", status: "unread", aiSummary: "" },
  { id: "2", source: "Gmail", from: "Comitê de Ética em Pesquisa", fromEmail: "cep@hospital.org.br", subject: "Aprovação de Protocolo de Pesquisa nº 1245/2026", preview: "Em atendimento ao protocolo submetido, o CEP aprova...", body: "Em atendimento ao protocolo de pesquisa nº 1245/2026 submetido por Dra. Helena Oliveira, o Comitê de Ética em Pesquisa aprova a realização do estudo clínico, condicionado à assinatura do TCLE por todos os participantes.\n\nDocumentos aprovados:\n- Protocolo v3 (15/03/2026)\n- TCLE versão final\n- Questionário SSQ-br\n\nPareceres disponíveis na Plataforma Brasil.", date: "2026-04-10", status: "read", aiSummary: "" },
  { id: "3", source: "Teams", from: "Dr. Thorne — Canal Diretoria", fromEmail: "@diretoria", subject: "Atualização sobre escala abril — URGENTE", preview: "Pessoal, precisamos ajustar a escala do dia 18...", body: "Pessoal,\n\nPrecisamos ajustar a escala do dia 18 de abril — o Dr. Menezes solicitou troca com Dra. Carla.\n\nPor favor, todos confirmar disponibilidade até amanhã às 12h.\n\nQualquer problema, acionar o RH diretamente.\n\nAtenciosamente,\nDr. Thorne", date: "2026-04-12", status: "unread", aiSummary: "" },
  { id: "4", source: "Gmail", from: "Fornecedor TecnoMed", fromEmail: "comercial@tecnomed.com.br", subject: "Proposta Comercial — Manutenção Preventiva 2026/2027", preview: "Segue em anexo nossa proposta revisada para o contrato...", body: "Prezados,\n\nSegue em anexo nossa proposta revisada para o contrato de manutenção preventiva e corretiva dos equipamentos biomédicos para o período 2026/2027.\n\nDestaques da proposta:\n- Revisões mensais: R$ 6.200/mês\n- Plantão 24h: incluso\n- Peças com desconto de 15%\n- Garantia de SLA: 4h para chamados críticos\n\nAguardamos retorno.", date: "2026-04-09", status: "starred", aiSummary: "" },
];

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
      const { callAI } = await import("@/modules/shared/services/openrouter");
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">Central de Comunicações</span>
          <h1 className="font-heading text-4xl font-black tracking-tighter text-on-surface mt-2">
            Painel de <span className="text-gradient">E-mails</span>
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            {unreadCount} não lidos · Gmail + Outlook + Teams
          </p>
        </div>
        <button onClick={() => setTab(tab === "inbox" ? "compose" : "inbox")} className="btn-gradient flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black">
          {tab === "inbox" ? <><Plus size={18}/> Novo E-mail</> : <><Inbox size={18}/> Caixa de Entrada</>}
        </button>
      </div>

      {/* OAuth notice */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
        <span className="text-lg">🔐</span>
        <div>
          <p className="text-sm font-black text-amber-800">Integração OAuth2 (em breve)</p>
          <p className="text-xs text-amber-700">E-mails reais exigem autenticação com Google/Microsoft. A interface está completa — os dados abaixo são demonstrativos. A IA de resumo já funciona!</p>
        </div>
      </div>

      {tab === "compose" ? (
        <div className="bg-surface rounded-2xl border border-outline-variant/40 shadow-sm p-6 space-y-4 max-w-2xl">
          <h2 className="font-heading font-black text-xl text-on-surface">Novo E-mail</h2>
          <input className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="Para: email@destinatario.com" value={compose.to} onChange={e => setCompose({ ...compose, to: e.target.value })}/>
          <input className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="Assunto" value={compose.subject} onChange={e => setCompose({ ...compose, subject: e.target.value })}/>
          <textarea className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none h-48" placeholder="Mensagem..." value={compose.body} onChange={e => setCompose({ ...compose, body: e.target.value })}/>
          <div className="flex gap-3">
            <button onClick={() => setTab("inbox")} className="px-5 py-3 rounded-2xl border border-outline-variant/50 text-sm font-bold text-on-surface-variant">Cancelar</button>
            <button className="btn-gradient px-6 py-3 rounded-2xl text-sm font-black flex items-center gap-2"><Send size={16}/> Enviar (OAuth2 necessário)</button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Email list */}
          <div className="xl:col-span-2 space-y-3">
            {/* Source filters */}
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${filter === "all" ? "bg-primary/10 border-primary/30 text-primary" : "bg-surface border-outline-variant/40 text-on-surface-variant"}`}>
                Todos ({emails.filter(e => e.status !== "archived").length})
              </button>
              {(["Gmail","Outlook","Teams"] as EmailSource[]).map(s => (
                <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${filter === s ? SOURCE_COLORS[s] : "bg-surface border-outline-variant/40 text-on-surface-variant"}`}>
                  {SOURCE_ICONS[s]} {s} ({emails.filter(e => e.source === s && e.status !== "archived").length})
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant"/>
              <input className="w-full pl-10 pr-4 py-3 bg-surface border border-outline-variant/40 rounded-xl text-sm focus:outline-none focus:border-primary" placeholder="Pesquisar..." value={search} onChange={e => setSearch(e.target.value)}/>
            </div>

            {displayed.filter(e => e.status !== "archived").map(email => (
              <div
                key={email.id}
                onClick={() => { setSelected(email); markRead(email.id); }}
                className={`group flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all hover:shadow-md ${email.status === "unread" ? "bg-primary/5 border-primary/20 shadow-sm" : "bg-surface border-outline-variant/40"}`}
              >
                <div className={`w-8 h-8 rounded-xl text-sm flex items-center justify-center shrink-0 border ${SOURCE_COLORS[email.source]}`}>
                  {SOURCE_ICONS[email.source]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className={`text-sm ${email.status === "unread" ? "font-black text-on-surface" : "font-bold text-on-surface-variant"}`}>{email.from}</p>
                    <span className="text-[10px] text-on-surface-variant shrink-0">{email.date}</span>
                  </div>
                  <p className={`text-sm ${email.status === "unread" ? "font-bold text-on-surface" : "text-on-surface-variant"} truncate`}>{email.subject}</p>
                  <p className="text-xs text-on-surface-variant truncate mt-0.5">{email.preview}</p>
                </div>
                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={e => { e.stopPropagation(); toggleStar(email.id); }} className={email.status === "starred" ? "text-amber-500" : "text-on-surface-variant hover:text-amber-500"}>
                    <Star size={14}/>
                  </button>
                  <button onClick={e => { e.stopPropagation(); archiveEmail(email.id); }} className="text-on-surface-variant hover:text-primary">
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
                <div className="p-5 bg-surface rounded-2xl border border-outline-variant/40 shadow-sm">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${SOURCE_COLORS[selected.source]}`}>
                        {SOURCE_ICONS[selected.source]} {selected.source}
                      </span>
                      <h3 className="font-bold text-sm text-on-surface mt-2">{selected.subject}</h3>
                      <p className="text-xs text-on-surface-variant mt-0.5">{selected.from} · {selected.date}</p>
                    </div>
                    <button onClick={() => setSelected(null)} className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant"><X size={13}/></button>
                  </div>
                  <div className="text-sm text-on-surface whitespace-pre-wrap leading-relaxed bg-surface-container-low rounded-xl p-4 max-h-56 overflow-y-auto">
                    {selected.body}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-surface-container border border-outline-variant/40 text-xs font-bold text-on-surface-variant hover:text-on-surface">
                      <Reply size={13}/> Responder
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-surface-container border border-outline-variant/40 text-xs font-bold text-on-surface-variant hover:text-on-surface">
                      <Forward size={13}/> Encaminhar
                    </button>
                  </div>
                </div>

                {/* AI Summary */}
                <div className="p-5 bg-surface rounded-2xl border border-outline-variant/40 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles size={15} className="text-primary"/>
                      <p className="text-sm font-black text-on-surface">Resumo por IA</p>
                    </div>
                    <button onClick={() => summarizeAI(selected)} disabled={aiLoading} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-primary to-secondary-container text-white text-[10px] font-black disabled:opacity-60">
                      {aiLoading ? <Loader2 size={10} className="animate-spin"/> : <Sparkles size={10}/>}
                      {aiLoading ? "..." : "Resumir"}
                    </button>
                  </div>
                  {selected.aiSummary ? (
                    <p className="text-xs text-on-surface leading-relaxed whitespace-pre-wrap">{selected.aiSummary}</p>
                  ) : (
                    <p className="text-xs text-on-surface-variant text-center py-3">Clique em "Resumir" para obter um resumo executivo com ação e prazo.</p>
                  )}
                </div>
              </>
            ) : (
              <div className="p-6 bg-surface rounded-2xl border border-outline-variant/40 text-center text-on-surface-variant">
                <Mail size={36} className="mx-auto mb-3 opacity-20"/>
                <p className="text-sm">Clique num e-mail para ler e resumir com IA.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
