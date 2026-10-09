"use client";

import React, { useState, useRef, useEffect } from "react";
import { Plus, Upload, Camera, FileText, CheckCircle2, Clock, AlertTriangle, X, Loader2, Sparkles, Share2, Download, Building2 } from "lucide-react";
import { sanitize } from "@/lib/sanitize";
import { useDashboardContext } from "@/features/dashboard/context/DashboardContext";

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
  type: string;
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

const INITIAL: Account[] = [];

interface AccountsManagerProps {
  title: React.ReactNode;
  fixedType?: "PAYABLE" | "RECEIVABLE";
}

export default function AccountsManager({ title, fixedType }: AccountsManagerProps) {
  const { selectedUnitId } = useDashboardContext();
  const [accounts, setAccounts] = useState<Account[]>(INITIAL);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Account | null>(null);
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<AccountStatus | "Todos">("Todos");
  const [accountType, setAccountType] = useState<"PAYABLE" | "RECEIVABLE">(fixedType || "PAYABLE");
  const fileRef = useRef<HTMLInputElement>(null);

  const emptyForm = { title: "", supplier: "", value: "", dueDate: "", category: "OUTROS" as AccountCategory, status: "Em Aberto" as AccountStatus, unit: "", notes: "", imageUrl: null as string | null, type: fixedType || "PAYABLE" };
  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedUnitId) return;
    setIsLoading(true);
    fetch(`/api/accounts?unitId=${selectedUnitId}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) setAccounts(data);
      })
      .finally(() => setIsLoading(false));
  }, [selectedUnitId]);

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
      const { categorizeAccount } = await import("@/lib/services/openrouter");
      const raw = await categorizeAccount(`${a.title} — Fornecedor: ${a.supplier} — Valor: ${a.value}`);
      let cat = "OUTROS"; let desc = "";
      try { const parsed = JSON.parse(raw); cat = parsed.categoria; desc = parsed.descricao_curta; } catch { cat = "OUTROS"; }
      
      const newAiCategory = `${CATEGORY_LABELS[cat as AccountCategory] || cat}: ${desc}`;
      
      // Atualizar no backend
      await fetch(`/api/accounts/${a.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aiCategory: newAiCategory, category: cat as AccountCategory })
      });

      const updated = { ...a, aiCategory: newAiCategory, category: cat as AccountCategory };
      setAccounts(prev => prev.map(x => x.id === a.id ? updated : x));
      if (selected?.id === a.id) setSelected(updated);
    } catch { alert("Erro na categorização pela IA."); }
    setAiLoading(null);
  };

  const saveAccount = async () => {
    if (!form.title.trim() || !selectedUnitId) return;

    const newAccountData = { 
      ...form, 
      title: sanitize(form.title),
      supplier: sanitize(form.supplier),
      value: sanitize(form.value),
      notes: sanitize(form.notes),
      imageUrl: preview, 
      unitId: selectedUnitId,
      aiCategory: "",
      type: form.type
    };

    try {
      const res = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAccountData)
      });
      if (res.ok) {
        const savedAccount = await res.json();
        setAccounts(prev => [savedAccount, ...prev]);
        setShowForm(false);
        setForm(emptyForm);
        setPreview(null);
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar conta no banco.");
    }
  };

  const updateStatus = async (id: string, status: AccountStatus) => {
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : prev);
    
    // Background update
    await fetch(`/api/accounts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
  };

  const filteredByType = accounts.filter(a => (a.type || "PAYABLE") === accountType);
  const filtered = filterStatus === "Todos" ? filteredByType : filteredByType.filter(a => a.status === filterStatus);
  const urgentCount = filteredByType.filter(a => a.status !== "Pago" && daysUntil(a.dueDate) <= 7).length;
  const totalOpen = filteredByType.filter(a => a.status === "Em Aberto").length;
  
  // Custom metrics for specific cards
  const totalPaid = filteredByType.filter(a => a.status === "Pago").length;
  const overdueCount = filteredByType.filter(a => a.status !== "Pago" && daysUntil(a.dueDate) < 0).length;
  
  // Sum values (simplistic extraction for display)
  const sumValue = (list: Account[]) => list.reduce((acc, curr) => acc + (parseFloat(curr.value.replace(/[^0-9,-]+/g,"").replace(",", ".")) || 0), 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const totalOpenValue = sumValue(filteredByType.filter(a => a.status === "Em Aberto"));
  const totalPaidValue = sumValue(filteredByType.filter(a => a.status === "Pago"));
  const totalOverdueValue = sumValue(filteredByType.filter(a => a.status !== "Pago" && daysUntil(a.dueDate) < 0));

  const isReceivable = (fixedType || accountType) === "RECEIVABLE";
  const isPayable = (fixedType || accountType) === "PAYABLE";

  const themeColors = {
    badgeBg: isReceivable ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : isPayable ? "bg-rose-500/10 border-rose-500/20 text-rose-500" : "bg-primary/10 border border-primary/20 text-primary",
    btnClass: isReceivable ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]" : isPayable ? "bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_20px_rgba(225,29,72,0.3)] hover:shadow-[0_0_30px_rgba(225,29,72,0.5)]" : "btn-gradient shadow-[0_0_20px_rgba(45,212,191,0.4)] hover:shadow-[0_0_30px_rgba(45,212,191,0.6)]",
    ringClass: isReceivable ? "ring-emerald-500/40" : isPayable ? "ring-rose-500/40" : "ring-primary/20",
    textClass: isReceivable ? "text-emerald-500" : isPayable ? "text-rose-500" : "text-primary",
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className={`px-3 py-1 text-sm font-semibold uppercase tracking-widest rounded-full ${themeColors.badgeBg}`}>Financeiro</span>
          <h1 className="font-heading text-4xl font-semibold tracking-tighter text-on-surface mt-2">
            {title}
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            {totalOpen} em aberto · {urgentCount > 0 ? <span className="text-error font-medium">{urgentCount} urgentes</span> : "nenhuma urgente"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {!fixedType && (
            <div className="flex bg-surface-container border border-outline-variant/40 rounded-xl p-1">
              <button 
                onClick={() => { setAccountType("PAYABLE"); setFilterStatus("Todos"); setSelected(null); }}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${accountType === "PAYABLE" ? "bg-red-500/10 text-error shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
              >
                A Pagar
              </button>
              <button 
                onClick={() => { setAccountType("RECEIVABLE"); setFilterStatus("Todos"); setSelected(null); }}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${accountType === "RECEIVABLE" ? "bg-emerald-500/10 text-emerald-600 shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
              >
                A Receber
              </button>
            </div>
          )}
          <button onClick={() => setShowForm(true)} className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-all ${themeColors.btnClass}`}>
            <Plus size={18} /> Nova Conta
          </button>
        </div>
      </div>

      {/* Summary cards differentiated by type */}
      {isPayable && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border bg-surface border-outline-variant/40 hover:shadow-sm transition-all">
            <div className="flex items-center gap-2 mb-2 text-on-surface-variant">
              <Clock size={14} className="text-blue-500" />
              <p className="text-sm font-semibold uppercase tracking-widest">A Pagar (Em Aberto)</p>
            </div>
            <p className="font-heading font-semibold text-2xl text-on-surface">{totalOpen}</p>
            <p className="text-xs text-on-surface-variant mt-1 font-medium">{totalOpenValue}</p>
          </div>
          <div className="p-5 rounded-2xl border bg-surface border-outline-variant/40 hover:shadow-sm transition-all">
            <div className="flex items-center gap-2 mb-2 text-on-surface-variant">
              <CheckCircle2 size={14} className="text-emerald-500" />
              <p className="text-sm font-semibold uppercase tracking-widest">Contas Pagas</p>
            </div>
            <p className="font-heading font-semibold text-2xl text-on-surface">{totalPaid}</p>
            <p className="text-xs text-on-surface-variant mt-1 font-medium">{totalPaidValue}</p>
          </div>
          <div className="p-5 rounded-2xl border bg-surface border-outline-variant/40 hover:shadow-sm transition-all">
            <div className="flex items-center gap-2 mb-2 text-on-surface-variant">
              <AlertTriangle size={14} className="text-error" />
              <p className="text-sm font-semibold uppercase tracking-widest">Atrasadas</p>
            </div>
            <p className="font-heading font-semibold text-2xl text-error">{overdueCount}</p>
            <p className="text-xs text-error/70 mt-1 font-medium">{totalOverdueValue}</p>
          </div>
          <div className="p-5 rounded-2xl border bg-surface border-outline-variant/40 hover:shadow-sm transition-all">
            <div className="flex items-center gap-2 mb-2 text-on-surface-variant">
              <FileText size={14} className="text-amber-500" />
              <p className="text-sm font-semibold uppercase tracking-widest">Vencem em 7 dias</p>
            </div>
            <p className="font-heading font-semibold text-2xl text-amber-500">{urgentCount}</p>
            <p className="text-xs text-amber-600/70 mt-1 font-medium">Atenção ao fluxo</p>
          </div>
        </div>
      )}

      {isReceivable && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border bg-surface border-outline-variant/40 hover:shadow-sm transition-all">
            <div className="flex items-center gap-2 mb-2 text-on-surface-variant">
              <Clock size={14} className="text-blue-500" />
              <p className="text-sm font-semibold uppercase tracking-widest">A Receber (Previsão)</p>
            </div>
            <p className="font-heading font-semibold text-2xl text-on-surface">{totalOpen}</p>
            <p className="text-xs text-on-surface-variant mt-1 font-medium">{totalOpenValue}</p>
          </div>
          <div className="p-5 rounded-2xl border bg-surface border-outline-variant/40 hover:shadow-sm transition-all">
            <div className="flex items-center gap-2 mb-2 text-on-surface-variant">
              <CheckCircle2 size={14} className="text-emerald-500" />
              <p className="text-sm font-semibold uppercase tracking-widest">Receitas Liquidadas</p>
            </div>
            <p className="font-heading font-semibold text-2xl text-emerald-500">{totalPaid}</p>
            <p className="text-xs text-emerald-600/70 mt-1 font-medium">{totalPaidValue}</p>
          </div>
          <div className="p-5 rounded-2xl border bg-surface border-outline-variant/40 hover:shadow-sm transition-all">
            <div className="flex items-center gap-2 mb-2 text-on-surface-variant">
              <AlertTriangle size={14} className="text-error" />
              <p className="text-sm font-semibold uppercase tracking-widest">Inadimplência</p>
            </div>
            <p className="font-heading font-semibold text-2xl text-error">{overdueCount}</p>
            <p className="text-xs text-error/70 mt-1 font-medium">{totalOverdueValue}</p>
          </div>
          <div className="p-5 rounded-2xl border bg-surface border-outline-variant/40 hover:shadow-sm transition-all">
            <div className="flex items-center gap-2 mb-2 text-on-surface-variant">
              <Sparkles size={14} className="text-rd-cyan" />
              <p className="text-sm font-semibold uppercase tracking-widest">Ticket Médio (Estimado)</p>
            </div>
            <p className="font-heading font-semibold text-2xl text-on-surface">R$ 1.250</p>
            <p className="text-xs text-on-surface-variant mt-1 font-medium">Por cliente/paciente</p>
          </div>
        </div>
      )}

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
                  <p className={`font-medium text-sm text-on-surface transition-colors hover:${themeColors.textClass}`}>{account.title}</p>
                  
                  {isReceivable ? (
                    <div className="flex flex-col gap-0.5 mt-0.5">
                      <p className="text-xs text-on-surface-variant font-semibold">👤 {account.supplier} <span className="font-normal opacity-70">({account.unit})</span></p>
                      <p className="text-sm text-emerald-600/80 uppercase tracking-wider">Origem da Receita: {CATEGORY_LABELS[account.category] || account.category}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-0.5 mt-0.5">
                      <p className="text-xs text-on-surface-variant font-semibold">🏢 {account.supplier} <span className="font-normal opacity-70">({account.unit})</span></p>
                      <p className="text-sm text-on-surface-variant uppercase tracking-wider">Despesa: {CATEGORY_LABELS[account.category] || account.category}</p>
                    </div>
                  )}
                  
                  <p className={`text-sm font-semibold mt-1 ${account.type === 'RECEIVABLE' ? 'text-emerald-600' : 'text-error'}`}>
                    {account.type === 'RECEIVABLE' ? '+' : '-'} {account.value}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`flex items-center gap-1 text-sm font-semibold px-2 py-0.5 rounded-full border ${STATUS_CONFIG[account.status].color}`}>
                    {STATUS_CONFIG[account.status].icon} {account.status}
                  </span>
                  <p className={`text-sm mt-1 font-semibold ${isOverdue ? "text-error" : isUrgent ? "text-amber-600" : "text-on-surface-variant"}`}>
                    {isOverdue ? `${Math.abs(days)}d atrasado` : days === 0 ? "Hoje" : `Vence em ${days}d`}
                  </p>
                </div>
              </div>
            );
          })}
          {isLoading && (
            <div className="text-center py-16 text-on-surface-variant flex flex-col items-center">
              <Loader2 className="animate-spin mb-4 text-primary" size={32} />
              <p className="text-sm">Carregando contas...</p>
            </div>
          )}
          {!isLoading && filtered.length === 0 && (
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
                    <p className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest">{CATEGORY_LABELS[selected.category]}</p>
                    <h3 className="font-medium text-sm text-on-surface mt-0.5">{selected.title}</h3>
                    <p className={`text-xs mt-1 font-semibold ${selected.type === 'RECEIVABLE' ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {selected.type === 'RECEIVABLE' ? 'Cliente: ' : 'Fornecedor: '} {selected.supplier}
                    </p>
                  </div>
                  <button onClick={() => setSelected(null)} className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant"><X size={13}/></button>
                </div>

                <div className={`text-2xl font-heading font-semibold mb-4 ${selected.type === 'RECEIVABLE' ? 'text-emerald-600' : 'text-error'}`}>
                  {selected.type === 'RECEIVABLE' ? '+' : '-'} {selected.value}
                </div>

                <div className="space-y-2 mb-4 text-xs">
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <Building2 size={12}/> <span>{selected.unit}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={12} className="text-on-surface-variant"/>
                    <span className={daysUntil(selected.dueDate) <= 3 && selected.status !== "Pago" ? "text-error font-medium" : "text-on-surface-variant"}>
                      Vence: {new Date(selected.dueDate + "T00:00:00").toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  {selected.notes && <p className="text-on-surface-variant">📝 {selected.notes}</p>}
                </div>

                {/* Status update */}
                <div>
                  <p className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest mb-2">Alterar Status</p>
                  <div className="grid grid-cols-1 gap-1.5">
                    {(Object.keys(STATUS_CONFIG) as AccountStatus[]).map(s => (
                      <button
                        key={s}
                        onClick={() => updateStatus(selected.id, s)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all text-left ${selected.status === s ? STATUS_CONFIG[s].color + " ring-1 " + themeColors.ringClass : "bg-surface-container border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high"}`}
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
                    <Sparkles size={14} className={themeColors.textClass}/>
                    <p className="text-xs font-semibold text-on-surface">Categorização IA</p>
                  </div>
                  <button
                    onClick={() => categorizeWithAI(selected)}
                    disabled={aiLoading === selected.id}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all text-white text-sm font-semibold disabled:opacity-60 ${themeColors.btnClass.replace('shadow-[0_0_20px_rgba(45,212,191,0.4)]', '').split('hover')[0]}`}
                  >
                    {aiLoading === selected.id ? <Loader2 size={10} className="animate-spin"/> : <Sparkles size={10}/>}
                    {aiLoading === selected.id ? "..." : "Analisar"}
                  </button>
                </div>
                <p className="text-xs text-on-surface-variant">{selected.aiCategory || "Clique para categorizar automaticamente com IA."}</p>
              </div>

              {/* Share */}
              <button className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-surface-container border border-outline-variant/40 text-on-surface-variant text-sm font-medium hover:bg-surface-container-high transition-colors">
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900/80 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] w-full max-w-lg p-8 space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto backdrop-blur-2xl">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-2xl font-semibold text-white">Nova Conta</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"><X size={16}/></button>
            </div>

            {/* Image upload */}
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-white/20 rounded-2xl p-6 text-center cursor-pointer hover:border-rd-cyan/40 hover:bg-white/5 transition-all"
            >
              {preview ? (
                <img src={preview} alt="Conta" className="w-full h-32 object-contain rounded-xl" />
              ) : (
                <div className="text-zinc-400">
                  <Camera size={28} className="mx-auto mb-2 opacity-40"/>
                  <p className="text-sm font-medium">Foto da Conta (opcional)</p>
                  <p className="text-xs mt-1">Clique para anexar imagem ou PDF</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleImageSelect}/>

            <div>
              <label className="text-sm font-bold text-zinc-300 uppercase tracking-[0.15em] mb-2 block ml-1">Título / Descrição *</label>
              <input className="w-full bg-black/20 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:border-rd-cyan focus:ring-1 focus:ring-rd-cyan focus:outline-none transition-all shadow-inner" placeholder="Título / Descrição *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}/>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-sm font-bold text-zinc-300 uppercase tracking-[0.15em] mb-2 block ml-1">Tipo de Movimentação</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => !fixedType && setForm({...form, type: "PAYABLE"})} 
                    disabled={!!fixedType}
                    className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all border ${form.type === "PAYABLE" ? "bg-red-500/20 border-red-500/50 text-red-400" : "bg-white/5 border-white/10 text-zinc-400"}`}
                  >
                    Despesa (A Pagar)
                  </button>
                  <button 
                    onClick={() => !fixedType && setForm({...form, type: "RECEIVABLE"})} 
                    disabled={!!fixedType}
                    className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all border ${form.type === "RECEIVABLE" ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400" : "bg-white/5 border-white/10 text-zinc-400"}`}
                  >
                    Receita (A Receber)
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm font-bold text-zinc-300 uppercase tracking-[0.15em] mb-2 block ml-1">{form.type === 'RECEIVABLE' ? 'Cliente / Origem' : 'Fornecedor'}</label>
                <input className="w-full bg-black/20 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:border-rd-cyan focus:ring-1 focus:ring-rd-cyan focus:outline-none transition-all shadow-inner" placeholder={form.type === 'RECEIVABLE' ? 'Cliente / Origem' : 'Fornecedor'} value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })}/>
              </div>
              <div>
                <label className="text-sm font-bold text-zinc-300 uppercase tracking-[0.15em] mb-2 block ml-1">Valor (R$)</label>
                <input className="w-full bg-black/20 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:border-rd-cyan focus:ring-1 focus:ring-rd-cyan focus:outline-none transition-all shadow-inner" placeholder="Valor (R$)" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })}/>
              </div>
              <div>
                <label className="text-sm font-bold text-zinc-300 uppercase tracking-[0.15em] mb-2 block ml-1">Vencimento</label>
                <input type="date" className="w-full bg-black/20 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:border-rd-cyan focus:ring-1 focus:ring-rd-cyan focus:outline-none transition-all shadow-inner [color-scheme:dark]" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })}/>
              </div>
              <div>
                <label className="text-sm font-bold text-zinc-300 uppercase tracking-[0.15em] mb-2 block ml-1">Categoria</label>
                <select className="w-full bg-black/20 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:border-rd-cyan focus:ring-1 focus:ring-rd-cyan focus:outline-none transition-all shadow-inner" value={form.category} onChange={e => setForm({ ...form, category: e.target.value as AccountCategory })}>
                  {CATEGORIES.map(c => <option key={c} value={c} className="bg-zinc-800 text-white">{CATEGORY_LABELS[c]}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-zinc-300 uppercase tracking-[0.15em] mb-2 block ml-1">Notas</label>
              <textarea className="w-full bg-black/20 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:border-rd-cyan focus:ring-1 focus:ring-rd-cyan focus:outline-none transition-all shadow-inner resize-none h-16" placeholder="Notas (protocolo, obs...)" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}/>
            </div>

            <div className="flex gap-4 pt-4">
              <button onClick={() => { setShowForm(false); setPreview(null); }} className="flex-1 py-3 rounded-xl border border-white/10 bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 text-sm font-semibold transition-all">Cancelar</button>
              <button onClick={saveAccount} className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${themeColors.btnClass}`}>Salvar Conta</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
