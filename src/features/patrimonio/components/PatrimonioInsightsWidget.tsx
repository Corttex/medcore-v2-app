"use client";

import React, { useState } from "react";
import { Sparkles, Activity, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function PatrimonioInsightsWidget({ patrimonios }: { patrimonios: any[] }) {
  const [selectedId, setSelectedId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [insightData, setInsightData] = useState<any>(null);

  const fetchInsights = async () => {
    if (!selectedId) return;
    setLoading(true);
    setInsightData(null);
    try {
      const res = await fetch(`/api/patrimonio/insights?patrimonioId=${selectedId}`);
      if (res.ok) {
        const data = await res.json();
        setInsightData(data);
      } else {
        alert("Erro ao buscar insights.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (patrimonios.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 dark:from-zinc-900 dark:to-black border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-heading font-semibold text-white">Insights do Jarvis</h2>
            <p className="text-xs text-zinc-400">Análise de viabilidade financeira e manutenção de ativos.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <select 
            className="flex-1 bg-zinc-800/50 border border-zinc-700 text-sm text-zinc-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            <option value="">Selecione um Equipamento...</option>
            {patrimonios.map(p => (
              <option key={p.id} value={p.id}>{p.nome} (Tag: {p.codigoTag})</option>
            ))}
          </select>
          <button 
            onClick={fetchInsights}
            disabled={!selectedId || loading}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Activity className="w-4 h-4" />
            )}
            Gerar Análise
          </button>
        </div>

        {insightData && (
          <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-5 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-white">Relatório Executivo</h3>
              <div className="text-right">
                <span className="text-sm text-zinc-400 uppercase tracking-wider block mb-1">Custo Total Manutenção</span>
                <span className="text-sm font-mono text-orange-400">R$ {insightData.custoTotalManutencao?.toFixed(2)}</span>
              </div>
            </div>
            <div className="prose prose-invert prose-sm max-w-none">
              <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{insightData.insight}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
