"use client";

import React, { useState, useEffect } from "react";
import { 
  FileSpreadsheet, Download, RefreshCw, CheckCircle2, 
  AlertTriangle, Filter, Calendar as CalendarIcon, 
  ChevronRight, Building2, Stethoscope, Search, FileText
} from "lucide-react";
import { useDashboardContext } from "@/features/dashboard/context/DashboardContext";

export default function FaturamentoTISSPage() {
  const { selectedUnitId } = useDashboardContext();
  const [activeTab, setActiveTab] = useState<"LOTES" | "GUIAS">("LOTES");
  
  const [lotes, setLotes] = useState<any[]>([]);
  const [guias, setGuias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resLotes, resGuias] = await Promise.all([
        fetch('/api/tiss/lotes').then(r => r.json()),
        fetch('/api/tiss/guias').then(r => r.json())
      ]);
      
      if (resLotes.success) setLotes(resLotes.data);
      if (resGuias.success) setGuias(resGuias.data);
    } catch (err) {
      console.error("Erro ao buscar dados TISS", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedUnitId]);

  const handleGerarLote = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/tiss/lotes', { method: 'POST', body: JSON.stringify({}) });
      const json = await res.json();
      if (json.success) {
        alert(`Lote ${json.data.numero} gerado com sucesso! ${json.guiasAfetadas} guias incluídas.`);
        fetchData();
        setActiveTab("LOTES");
      } else {
        alert(json.error || "Erro ao gerar lote");
      }
    } catch (err) {
      alert("Erro ao processar lote");
    } finally {
      setIsGenerating(false);
    }
  };

  // KPIs dinâmicos
  const faturamentoTotal = lotes.reduce((acc, lote) => {
    const valorLote = lote.guias?.reduce((s: number, g: any) => s + g.valor, 0) || 0;
    return acc + valorLote;
  }, 0) + guias.filter(g => g.status === 'pendente').reduce((acc, g) => acc + g.valor, 0);

  const guiasPendentes = guias.filter(g => g.status === 'pendente').length;


  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 text-sm font-semibold uppercase tracking-widest rounded-full bg-emerald-500/10 border-emerald-500/20 text-emerald-500">
            Faturamento Estratégico
          </span>
          <h1 className="font-heading text-4xl font-semibold tracking-tighter text-on-surface mt-2 flex items-center gap-3">
            Central TISS <span className="text-emerald-500">Inteligente</span>
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Geração de XML, controle de guias e prevenção de glosas
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleGerarLote}
            disabled={isGenerating || guiasPendentes === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-all btn-gradient shadow-[0_0_20px_rgba(45,212,191,0.4)] hover:shadow-[0_0_30px_rgba(45,212,191,0.6)] disabled:opacity-50"
          >
            <FileSpreadsheet size={18} /> {isGenerating ? 'Gerando Lote...' : 'Gerar Lote XML (TISS)'}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 bg-surface rounded-2xl border border-outline-variant/40 shadow-sm relative overflow-hidden group hover:border-emerald-500/50 transition-all">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all"></div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">Faturamento Mês</h3>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <FileText size={14} />
            </div>
          </div>
          <p className="text-3xl font-heading font-semibold text-on-surface">R$ {faturamentoTotal.toLocaleString('pt-BR', {minimumFractionDigits:2})}</p>
          <p className="text-xs text-emerald-500 mt-2 font-medium flex items-center gap-1">
            <ArrowUpRightIcon /> +12.5% em relação ao mês anterior
          </p>
        </div>

        <div className="p-5 bg-surface rounded-2xl border border-outline-variant/40 shadow-sm relative overflow-hidden group hover:border-amber-500/50 transition-all">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all"></div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">Guias Pendentes</h3>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <ClockIcon />
            </div>
          </div>
          <p className="text-3xl font-heading font-semibold text-on-surface">{guiasPendentes}</p>
          <p className="text-xs text-amber-500 mt-2 font-medium">Aguardando geração de lote</p>
        </div>

        <div className="p-5 bg-surface rounded-2xl border border-outline-variant/40 shadow-sm relative overflow-hidden group hover:border-error/50 transition-all">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-error/10 rounded-full blur-xl group-hover:bg-error/20 transition-all"></div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">Índice de Glosas</h3>
            <div className="w-8 h-8 rounded-xl bg-error/10 flex items-center justify-center text-error">
              <AlertTriangle size={14} />
            </div>
          </div>
          <p className="text-3xl font-heading font-semibold text-on-surface">1.8%</p>
          <p className="text-xs text-error mt-2 font-medium">{"Dentro da meta aceitável (< 3%)"}</p>
        </div>

        <div className="p-5 bg-surface rounded-2xl border border-outline-variant/40 shadow-sm relative overflow-hidden group hover:border-blue-500/50 transition-all">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all"></div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">Ticket Médio</h3>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Stethoscope size={14} />
            </div>
          </div>
          <p className="text-3xl font-heading font-semibold text-on-surface">R$ 215</p>
          <p className="text-xs text-blue-500 mt-2 font-medium">Média por guia gerada</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-surface-container rounded-2xl p-1.5 flex gap-2 w-fit">
        <button 
          onClick={() => setActiveTab("LOTES")}
          className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "LOTES" ? "bg-surface shadow-sm text-on-surface" : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Lotes de Faturamento
        </button>
        <button 
          onClick={() => setActiveTab("GUIAS")}
          className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "GUIAS" ? "bg-surface shadow-sm text-on-surface" : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Auditoria de Guias
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-surface border border-outline-variant/40 rounded-3xl p-6 shadow-sm">
        
        {activeTab === "LOTES" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-heading font-semibold text-on-surface">Lotes Recentes</h2>
              <div className="flex items-center gap-3">
                <button className="p-2 rounded-xl border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container transition-all">
                  <Filter size={16} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-outline-variant/30">
                    <th className="pb-3 text-sm uppercase tracking-widest font-bold text-on-surface-variant">Lote</th>
                    <th className="pb-3 text-sm uppercase tracking-widest font-bold text-on-surface-variant">Data</th>
                    <th className="pb-3 text-sm uppercase tracking-widest font-bold text-on-surface-variant">Convênio</th>
                    <th className="pb-3 text-sm uppercase tracking-widest font-bold text-on-surface-variant">Guias</th>
                    <th className="pb-3 text-sm uppercase tracking-widest font-bold text-on-surface-variant">Valor Total</th>
                    <th className="pb-3 text-sm uppercase tracking-widest font-bold text-on-surface-variant">Status</th>
                    <th className="pb-3 text-sm uppercase tracking-widest font-bold text-on-surface-variant text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {lotes.length === 0 && (
                    <tr><td colSpan={7} className="py-4 text-center text-on-surface-variant">Nenhum lote gerado ainda.</td></tr>
                  )}
                  {lotes.map((lote) => {
                    const convenio = lote.guias?.[0]?.convenio?.nome || "Vários";
                    const totalGuias = lote.guias?.length || 0;
                    const valorTotal = lote.guias?.reduce((s:number, g:any) => s + g.valor, 0) || 0;
                    
                    return (
                    <tr key={lote.id} className="border-b border-outline-variant/20 hover:bg-surface-container/50 transition-colors">
                      <td className="py-4 font-semibold text-on-surface">{lote.numero}</td>
                      <td className="py-4 text-on-surface-variant">{new Date(lote.createdAt).toLocaleDateString('pt-BR')}</td>
                      <td className="py-4 font-medium text-on-surface flex items-center gap-2">
                        <Building2 size={14} className="text-primary"/> {convenio}
                      </td>
                      <td className="py-4 text-on-surface-variant">{totalGuias}</td>
                      <td className="py-4 font-semibold text-on-surface">R$ {valorTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 text-sm uppercase font-bold tracking-wider rounded-md border ${
                          lote.status === 'gerado' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' :
                          lote.status === 'enviado' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                          'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                        }`}>
                          {lote.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        {lote.xmlUrl && (
                          <button className="p-2 rounded-xl text-primary hover:bg-primary/10 transition-colors inline-flex items-center justify-center">
                            <Download size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "GUIAS" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-heading font-semibold text-on-surface">Guias em Auditoria</h2>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input 
                  type="text" 
                  placeholder="Buscar paciente ou guia..." 
                  className="pl-10 pr-4 py-2 bg-surface-container border border-outline-variant/40 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors w-64 text-on-surface"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-outline-variant/30">
                    <th className="pb-3 text-sm uppercase tracking-widest font-bold text-on-surface-variant">Guia</th>
                    <th className="pb-3 text-sm uppercase tracking-widest font-bold text-on-surface-variant">Paciente</th>
                    <th className="pb-3 text-sm uppercase tracking-widest font-bold text-on-surface-variant">Procedimento</th>
                    <th className="pb-3 text-sm uppercase tracking-widest font-bold text-on-surface-variant">Data</th>
                    <th className="pb-3 text-sm uppercase tracking-widest font-bold text-on-surface-variant">Valor</th>
                    <th className="pb-3 text-sm uppercase tracking-widest font-bold text-on-surface-variant">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {guias.length === 0 && (
                    <tr><td colSpan={6} className="py-4 text-center text-on-surface-variant">Nenhuma guia cadastrada.</td></tr>
                  )}
                  {guias.map((guia) => (
                    <tr key={guia.id} className="border-b border-outline-variant/20 hover:bg-surface-container/50 transition-colors">
                      <td className="py-4 font-semibold text-on-surface">{guia.id.substring(0,8).toUpperCase()}</td>
                      <td className="py-4 font-medium text-on-surface">{guia.meeting?.paciente?.nome || "Paciente"}</td>
                      <td className="py-4 text-on-surface-variant">Consulta</td>
                      <td className="py-4 text-on-surface-variant">{new Date(guia.createdAt).toLocaleDateString('pt-BR')}</td>
                      <td className="py-4 font-semibold text-on-surface">R$ {guia.valor.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                      <td className="py-4">
                        <div className="flex flex-col items-start gap-1">
                          <span className={`px-2 py-1 text-sm uppercase font-bold tracking-wider rounded-md border ${
                            guia.status === 'pendente' ? 'bg-zinc-500/10 border-zinc-500/20 text-zinc-500' :
                            guia.status === 'faturado' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                            'bg-error/10 border-error/20 text-error'
                          }`}>
                            {guia.status}
                          </span>
                          {guia.motivoGlosa && (
                            <span className="text-sm text-error font-medium">{guia.motivoGlosa}</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// Helpers
function ArrowUpRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17l9.2-9.2M17 17V7H7"/>
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
