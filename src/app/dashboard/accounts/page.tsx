"use client";

import React, { useState, useRef } from "react";
import { Plus, Upload, Camera, FileText, CheckCircle2, Clock, AlertTriangle, X, Loader2, Sparkles, Share2, Download, Building2 } from "lucide-react";
import { sanitize } from "@/lib/sanitize";

type AccountStatus = "Em Aberto" | "Pago" | "Aguardando NF" | "Aguardando Recibo" | "Contestado";
type AccountCategory = "ENERGIA" | "AGUA_ESGOTO" | "TELEFONE_INTERNET" | "LICENCA_ANVISA" | "LICENCA_VIGILANCIA" | "MANUTENCAO" | "EQUIPAMENTOS" | "INSUMOS_MEDICOS" | "FOLHA_PAGAMENTO" | "SERVICOS_TERCEIROS" | "OUTROS";

interface Account {
  id: string;
  title: string;
  supplier: string;
  value: string;
  dueDate: string;
  category: AccountCategory;
  status: AccountStatus;
  unit: string;
  notes: string;
  imageUrl: string | null;
  createdAt: string;
  aiCategory: string;
}

const STATUS_CONFIG: Record<AccountStatus, { color: string; icon: React.ReactNode }> = {
  "Em Aberto":       { color: "bg-blue-50 border-blue-200 text-blue-700", icon: <Clock size={11}/> },
  "Pago":            { color: "bg-emerald-50 border-emerald-200 text-emerald-700", icon: <CheckCircle2 size={11}/> },
  "Aguardando NF":   { color: "bg-amber-50 border-amber-200 text-amber-700", icon: <FileText size={11}/> },
  "Aguardando Recibo":{ color: "bg-orange-50 border-orange-200 text-orange-700", icon: <FileText size={11}/> },
  "Contestado":      { color: "bg-red-50 border-red-200 text-error", icon: <AlertTriangle size={11}/> },
};

const CATEGORIES: AccountCategory[] = ["ENERGIA","AGUA_ESGOTO","TELEFONE_INTERNET","LICENCA_ANVISA","LICENCA_VIGILANCIA","MANUTENCAO","EQUIPAMENTOS","INSUMOS_MEDICOS","FOLHA_PAGAMENTO","SERVICOS_TERCEIROS","OUTROS"];
const CATEGORY_LABELS: Record<AccountCategory, string> = {
  "ENERGIA": "⚡ Energia", "AGUA_ESGOTO": "💧 Água/Esgoto", "TELEFONE_INTERNET": "📡 Tel./Internet",
  "LICENCA_ANVISA": "🏥 Licença ANVISA", "LICENCA_VIGILANCIA": "🔍 Vig. Sanitária",
  "MANUTENCAO": "🔧 Manutenção", "EQUIPAMENTOS": "🖥️ Equipamentos", "INSUMOS_MEDICOS": "💊 Insumos Médicos",
  "FOLHA_PAGAMENTO": "👥 Folha de Pgto.", "SERVICOS_TERCEIROS": "🤝 Serv. Terceiros", "OUTROS": "📎 Outros",
};

function daysUntil(dateStr: string) {
  const today = new Date(); today.setHours(0,0,0,0);
  return Math.ceil((new Date(dateStr + "T00:00:00").getTime() - today.getTime()) / 86400000);
}

const INITIAL: Account[] = [
  { id: "1", title: "Conta de Energia - Abril", supplier: "CPFL Energia", value: "R$ 12.450,00", dueDate: "2026-04-20", category: "ENERGIA", status: "Em Aberto", unit: "Hospital Central", notes: "", imageUrl: null, createdAt: "2026-04-05", aiCategory: "" },
  { id: "2", title: "Licença ANVISA — Renovação Anual", supplier: "ANVISA", value: "R$ 3.200,00", dueDate: "2026-06-30", category: "LICENCA_ANVISA", status: "Aguardando NF", unit: "Hospital Central", notes: "Protocolo 44210/2026", imageUrl: null, createdAt: "2026-03-10", aiCategory: "" },
  { id: "3", title: "Manutenção Preventiva — Mês Abril", supplier: "TecnoMed Serv.", value: "R$ 8.700,00", dueDate: "2026-04-30", category: "MANUTENCAO", status: "Pago", unit: "UPA Norte", notes: "", imageUrl: null, createdAt: "2026-04-01", aiCategory: "" },
];

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>(INITIAL);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Account | null>(null);
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<AccountStatus | "Todos">("Todos");
  const fileRef = useRef<HTMLInputElement>(null);

  const emptyForm = { title: "", supplier: "", value: "", dueDate: "", category: "OUTROS" as AccountCategory, status: "Em Aberto" as AccountStatus, unit: "", notes: "", imageUrl: null as string | null };
  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const categorizeWithAI = async (a: Account) => {
    setAiLoading(a.id);
    try {
      const { categorizeAccount } = await import("@/modules/shared/services/openrouter");
      const raw = await categorizeAccount(`${a.title} — Fornecedor: ${a.supplier} — Valor: ${a.value}`);
      let cat = "OUTROS"; let desc = "";
      try { const parsed = JSON.parse(raw); cat = parsed.categoria; desc = parsed.descricao_curta; } catch { cat = "OUTROS"; }
      const updated = { ...a, aiCategory: `${CATEGORY_LABELS[cat as AccountCategory] || cat}: ${desc}`, category: cat as AccountCategory };
      setAccounts(prev => prev.map(x => x.id === a.id ? updated : x));
      if (selected?.id === a.id) setSelected(updated);
    } catch { alert("Erro na categorização pela IA."); }
    setAiLoading(null);
  };

  const saveAccount = () => {
    if (!form.title.trim()) return;

    const newAccount: Account = { 
      ...form, 
      title: sanitize(form.title),
      supplier: sanitize(form.supplier),
      value: sanitize(form.value),
      unit: sanitize(form.unit),
      notes: sanitize(form.notes),
      id: Date.now().toString(), 
      imageUrl: preview, 
      createdAt: new Date().toISOString().split("T")[0], 
      aiCategory: "" 
    };
    setAccounts(prev => [...prev, newAccount]);
    setShowForm(false);
    setForm(emptyForm);
    setPreview(null);
  };

  const updateStatus = (id: string, status: AccountStatus) => {
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : prev);
  };

  const filtered = filterStatus === "Todos" ? accounts : accounts.filter(a => a.status === filterStatus);
  const urgentCount = accounts.filter(a => a.status !== "Pago" && daysUntil(a.dueDate) <= 7).length;
  const totalOpen = accounts.filter(a => a.status === "Em Aberto").length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">Financeiro</span>
          <h1 className="font-heading text-4xl font-black tracking-tighter text-on-surface mt-2">
            Gestor de <span className="text-gradient">Contas</span>
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            {totalOpen} em aberto · {urgentCount > 0 ? <span className="text-error font-bold">{urgentCount} urgentes</span> : "nenhuma urgente"}
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-gradient flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black">
          <Plus size={18} /> Nova Conta
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(Object.keys(STATUS_CONFIG) as AccountStatus[]).map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(filterStatus === s ? "Todos" : s)}
            className={`p-4 rounded-2xl border text-left transition-all hover:shadow-sm ${filterStatus === s ? STATUS_CONFIG[s].color + " ring-2 ring-primary/20" : "bg-surface border-outline-variant/40 hover:bg-surface-container-low"}`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className={filterStatus === s ? "" : "text-on-surface-variant"}>{STATUS_CONFIG[s].icon}</span>
              <p className={`text-[10px] font-black uppercase tracking-widest ${filterStatus === s ? "" : "text-on-surface-variant"}`}>{s}</p>
            </div>
            <p className={`font-heading font-black text-2xl ${filterStatus === s ? "" : "text-on-surface"}`}>{accounts.filter(a => a.status === s).length}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Accounts list */}
        <div className="xl:col-span-2 space-y-3">
          {filtered.map(account => {
            const days = daysUntil(account.dueDate);
            const isUrgent = account.status !== "Pago" && days <= 7;
            const isOverdue = account.status !== "Pago" && days < 0;
            return (
              <div
                key={account.id}
                onClick={() => setSelected(account)}
                className={`group flex items-start gap-4 p-5 bg-surface rounded-2xl border shadow-sm hover:shadow-md cursor-pointer transition-all ${isOverdue ? "border-error/40 bg-red-50/30" : isUrgent ? "border-amber-300/60 bg-amber-50/30" : "border-outline-variant/40"}`}
              >
                <div className="w-10 h-10 rounded-2xl bg-surface-container border border-outline-variant/40 flex items-center justify-center shrink-0 text-lg">
                  {CATEGORY_LABELS[account.category]?.split(" ")[0] || "📎"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">{account.title}</p>
                  <p className="text-xs text-on-surface-variant">{account.supplier} · {account.unit}</p>
                  <p className="text-sm font-black text-on-surface mt-1">{account.value}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full border ${STATUS_CONFIG[account.status].color}`}>
                    {STATUS_CONFIG[account.status].icon} {account.status}
                  </span>
                  <p className={`text-[10px] mt-1 font-black ${isOverdue ? "text-error" : isUrgent ? "text-amber-600" : "text-on-surface-variant"}`}>
                    {isOverdue ? `${Math.abs(days)}d atrasado` : days === 0 ? "Hoje" : `Vence em ${days}d`}
                  </p>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-on-surface-variant">
              <FileText size={48} className="mx-auto mb-4 opacity-20" />
              <p className="text-sm">Nenhuma conta encontrada.</p>
            </div>
          )}
        </div>

        {/* Detail panel */}
        <div className="space-y-4">
          {selected ? (
            <>
              <div className="p-5 bg-surface rounded-2xl border border-outline-variant/40 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">{CATEGORY_LABELS[selected.category]}</p>
                    <h3 className="font-bold text-sm text-on-surface mt-0.5">{selected.title}</h3>
                    <p className="text-xs text-on-surface-variant">{selected.supplier}</p>
                  </div>
                  <button onClick={() => setSelected(null)} className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant"><X size={13}/></button>
                </div>

                <div className="text-2xl font-heading font-black text-on-surface mb-4">{selected.value}</div>

                <div className="space-y-2 mb-4 text-xs">
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <Building2 size={12}/> <span>{selected.unit}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={12} className="text-on-surface-variant"/>
                    <span className={daysUntil(selected.dueDate) <= 3 && selected.status !== "Pago" ? "text-error font-bold" : "text-on-surface-variant"}>
                      Vence: {new Date(selected.dueDate + "T00:00:00").toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  {selected.notes && <p className="text-on-surface-variant">📝 {selected.notes}</p>}
                </div>

                {/* Status update */}
                <div>
                  <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Alterar Status</p>
                  <div className="grid grid-cols-1 gap-1.5">
                    {(Object.keys(STATUS_CONFIG) as AccountStatus[]).map(s => (
                      <button
                        key={s}
                        onClick={() => updateStatus(selected.id, s)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-all text-left ${selected.status === s ? STATUS_CONFIG[s].color + " ring-1 ring-primary/30" : "bg-surface-container border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high"}`}
                      >
                        {STATUS_CONFIG[s].icon} {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI categorization */}
              <div className="p-4 bg-surface rounded-2xl border border-outline-variant/40 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-primary"/>
                    <p className="text-xs font-black text-on-surface">Categorização IA</p>
                  </div>
                  <button
                    onClick={() => categorizeWithAI(selected)}
                    disabled={aiLoading === selected.id}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-primary to-secondary-container text-white text-[10px] font-black disabled:opacity-60"
                  >
                    {aiLoading === selected.id ? <Loader2 size={10} className="animate-spin"/> : <Sparkles size={10}/>}
                    {aiLoading === selected.id ? "..." : "Analisar"}
                  </button>
                </div>
                <p className="text-xs text-on-surface-variant">{selected.aiCategory || "Clique para categorizar automaticamente com IA."}</p>
              </div>

              {/* Share */}
              <button className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-surface-container border border-outline-variant/40 text-on-surface-variant text-sm font-bold hover:bg-surface-container-high transition-colors">
                <Share2 size={16}/> Compartilhar (em breve)
              </button>
            </>
          ) : (
            <div className="p-6 bg-surface rounded-2xl border border-outline-variant/40 text-center text-on-surface-variant">
              <FileText size={36} className="mx-auto mb-3 opacity-20"/>
              <p className="text-sm">Selecione uma conta para ver detalhes e gerenciar o status.</p>
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-on-surface/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-3xl border border-outline-variant/40 shadow-2xl w-full max-w-lg p-8 space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-2xl font-black text-on-surface">Nova Conta</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant"><X size={16}/></button>
            </div>

            {/* Image upload */}
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-outline-variant/60 rounded-2xl p-6 text-center cursor-pointer hover:border-primary/40 hover:bg-surface-container-low transition-all"
            >
              {preview ? (
                <img src={preview} alt="Conta" className="w-full h-32 object-contain rounded-xl" />
              ) : (
                <div className="text-on-surface-variant">
                  <Camera size={28} className="mx-auto mb-2 opacity-40"/>
                  <p className="text-sm font-bold">Foto da Conta (opcional)</p>
                  <p className="text-xs mt-1">Clique para anexar imagem ou PDF</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleImageSelect}/>

            <input className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="Título / Descrição *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}/>
            <div className="grid grid-cols-2 gap-3">
              <input className="bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="Fornecedor" value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })}/>
              <input className="bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="Valor (R$)" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })}/>
              <div>
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1 block">Vencimento</label>
                <input type="date" className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })}/>
              </div>
              <div>
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1 block">Categoria</label>
                <select className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" value={form.category} onChange={e => setForm({ ...form, category: e.target.value as AccountCategory })}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
                </select>
              </div>
            </div>
            <input className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="Unidade Hospitalar" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })}/>
            <textarea className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none h-16" placeholder="Notas (protocolo, obs...)" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}/>

            <div className="flex gap-3 pt-2">
              <button onClick={() => { setShowForm(false); setPreview(null); }} className="flex-1 py-3 rounded-2xl border border-outline-variant/50 text-on-surface-variant text-sm font-bold">Cancelar</button>
              <button onClick={saveAccount} className="flex-1 btn-gradient py-3 rounded-2xl text-sm font-black">Salvar Conta</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
