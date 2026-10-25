"use client";

import React, { useEffect, useState } from "react";
import { 
  Target, 
  TrendingUp, 
  DollarSign, 
  CheckCircle2, 
  Flame, 
  Sparkles, 
  Calendar, 
  Users, 
  ArrowUpRight, 
  Building2, 
  Award,
  AlertCircle,
  HelpCircle,
  ChevronRight
} from "lucide-react";
import { useAdminContext } from "@/context/AdminContext";

export default function MetasWarRoomPage() {
  const { isDemo } = useAdminContext();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/overview?demo=${isDemo}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, [isDemo]);

  const contracted = data?.financials?.totalContractedBrl || 0;
  const cash = data?.financials?.cashCollectedBrl || 0;
  const mrr = data?.financials?.currentMrrBrl || 0;
  const goal90 = 500000;
  const goal180 = 1000000;
  const pct90 = Math.min(100, Math.round((contracted / goal90) * 1000) / 10);
  const pct180 = Math.min(100, Math.round((contracted / goal180) * 1000) / 10);

  const dailyTarget = data?.goals?.dailyTargetNeededBrl || 7690;
  const clinicaSemiannual = data?.goals?.packageEquivalents?.clinicaSemiannual || 2;
  const medicalAiSemiannual = data?.goals?.packageEquivalents?.medicalAiSemiannual || 1;
  const auxiliaryCount = data?.goals?.packageEquivalents?.auxiliaryMonthly || 45;

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      
      {/* Top Banner de Guerra */}
      <div className="relative overflow-hidden p-8 md:p-10 rounded-[2.5rem] bg-gradient-to-br from-zinc-950 via-zinc-900 to-primary/20 border border-outline-variant/30 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-black uppercase tracking-widest">
              <Flame size={14} className="text-orange-400 animate-pulse" /> Motor de Metas de Guerra
            </div>
            <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tight text-white leading-tight">
              Termômetro <span className="text-gradient">R$ 500k / R$ 1M</span>
            </h1>
            <p className="text-sm md:text-base text-zinc-400 font-medium leading-relaxed">
              Algoritmo de tração e pacing diário para alcançar os primeiros <strong>R$ 500.000 em 90 dias</strong> e escalar para <strong>R$ 1.000.000 em 180 dias</strong>.
            </p>
          </div>

          {/* Card Resumo do Ritmo do Dia */}
          <div className="w-full lg:w-auto bg-surface-container-low/90 border border-primary/30 rounded-3xl p-6 shadow-xl space-y-3 min-w-[320px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-zinc-400">Meta Diária (Hoje)</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                Pacing 65 dias
              </span>
            </div>
            <div className="text-3xl font-black text-white font-heading">
              R$ {dailyTarget.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-zinc-400 font-medium border-t border-outline-variant/20 pt-2 leading-relaxed">
              Equivalente a: <strong className="text-primary">{clinicaSemiannual}x Planos Clínica Semestral</strong> + <strong className="text-primary">{medicalAiSemiannual}x Medical AI</strong> ou <strong className="text-primary">{auxiliaryCount} Auxiliares</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Os Dois Marcos de Guerra: 500K e 1M */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* MARCO 1: R$ 500.000 em 90 dias */}
        <div className="p-8 bg-surface-container-low border border-outline-variant/30 rounded-[2.5rem] space-y-6 relative overflow-hidden group hover:border-primary/50 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Target size={24} />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Marco 1 (90 Dias)</span>
                <h3 className="text-2xl font-black text-white font-heading">R$ 500.000,00</h3>
              </div>
            </div>
            <span className="text-2xl font-black text-primary font-heading">{pct90}%</span>
          </div>

          {/* Barra de Progresso */}
          <div className="space-y-2">
            <div className="w-full h-4 bg-surface-container-highest rounded-full overflow-hidden p-0.5 border border-outline-variant/20">
              <div 
                className="h-full bg-gradient-to-r from-primary via-emerald-400 to-emerald-500 rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(167,139,250,0.6)]"
                style={{ width: `${Math.max(2, pct90)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-zinc-400 font-bold">
              <span>R$ {contracted.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
              <span>Faltam R$ {Math.max(0, goal90 - contracted).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline-variant/20 text-xs">
            <div>
              <p className="text-zinc-500 font-medium">Caixa Efetivamente Pago</p>
              <p className="text-base font-black text-emerald-400">R$ {cash.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
            </div>
            <div>
              <p className="text-zinc-500 font-medium">MRR Recorrente Ativo</p>
              <p className="text-base font-black text-white">R$ {mrr.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}/mês</p>
            </div>
          </div>
        </div>

        {/* MARCO 2: R$ 1.000.000 em 180 dias */}
        <div className="p-8 bg-surface-container-low border border-outline-variant/30 rounded-[2.5rem] space-y-6 relative overflow-hidden group hover:border-purple-500/50 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Award size={24} />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Marco 2 (180 Dias)</span>
                <h3 className="text-2xl font-black text-white font-heading">R$ 1.000.000,00</h3>
              </div>
            </div>
            <span className="text-2xl font-black text-purple-400 font-heading">{pct180}%</span>
          </div>

          {/* Barra de Progresso */}
          <div className="space-y-2">
            <div className="w-full h-4 bg-surface-container-highest rounded-full overflow-hidden p-0.5 border border-outline-variant/20">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 via-indigo-400 to-primary rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(168,85,247,0.6)]"
                style={{ width: `${Math.max(2, pct180)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-zinc-400 font-bold">
              <span>R$ {contracted.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
              <span>Faltam R$ {Math.max(0, goal180 - contracted).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline-variant/20 text-xs">
            <div>
              <p className="text-zinc-500 font-medium">Contratos B2B Fechados</p>
              <p className="text-base font-black text-white">{data?.financials?.activeSubscriptionsCount || 0} Ativos</p>
            </div>
            <div>
              <p className="text-zinc-500 font-medium">Em Lock-in 30d Grátis</p>
              <p className="text-base font-black text-amber-400">{data?.financials?.trialSubscriptionsCount || 0} Clínicas</p>
            </div>
          </div>
        </div>

      </div>

      {/* Curva S de Aceleração (Planejado vs. Realizado) */}
      <div className="p-8 bg-surface-container-low border border-outline-variant/30 rounded-[2.5rem] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-white font-heading">
              Curva S de Aceleração Comercial (Mês a Mês)
            </h3>
            <p className="text-xs text-zinc-400 font-medium">
              Evolução planejada com reinvestimento proporcional do próprio caixa.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-zinc-400">
              <span className="w-3 h-3 rounded-full bg-zinc-600 inline-block" /> Meta Teórica
            </span>
            <span className="flex items-center gap-1.5 text-primary">
              <span className="w-3 h-3 rounded-full bg-primary inline-block" /> Realizado Real
            </span>
          </div>
        </div>

        {/* Tabela dos 6 Meses */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-outline-variant/30 text-zinc-400 font-black uppercase tracking-wider">
                <th className="py-3 px-4">Período</th>
                <th className="py-3 px-4">Meta Mensal</th>
                <th className="py-3 px-4">Meta Acumulada</th>
                <th className="py-3 px-4">Investimento do Bolso</th>
                <th className="py-3 px-4">Reinvestimento de Fluxo</th>
                <th className="py-3 px-4 text-right">Status Atual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 font-medium">
              <tr className="hover:bg-surface-container-highest/50 transition-colors">
                <td className="py-4 px-4 font-bold text-white">Mês 1 (Ativação)</td>
                <td className="py-4 px-4 text-zinc-300">R$ 95.000,00</td>
                <td className="py-4 px-4 font-bold text-primary">R$ 95.000,00</td>
                <td className="py-4 px-4 text-amber-400 font-bold">R$ 5.000 a R$ 10.000 (Bolso)</td>
                <td className="py-4 px-4 text-zinc-500">R$ 0,00</td>
                <td className="py-4 px-4 text-right">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                    Em Execução
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-highest/50 transition-colors">
                <td className="py-4 px-4 font-bold text-white">Mês 2 (Rampa)</td>
                <td className="py-4 px-4 text-zinc-300">R$ 175.000,00</td>
                <td className="py-4 px-4 font-bold text-primary">R$ 270.000,00</td>
                <td className="py-4 px-4 text-zinc-500">R$ 0,00 (Trava do Bolso)</td>
                <td className="py-4 px-4 text-emerald-400 font-bold">R$ 10.000 a R$ 15.000</td>
                <td className="py-4 px-4 text-right text-zinc-500">Programado</td>
              </tr>
              <tr className="hover:bg-surface-container-highest/50 transition-colors bg-primary/5">
                <td className="py-4 px-4 font-black text-primary flex items-center gap-2">
                  <Target size={14} /> Mês 3 (Alvo 500k)
                </td>
                <td className="py-4 px-4 text-zinc-300">R$ 245.960,00</td>
                <td className="py-4 px-4 font-black text-emerald-400 text-sm">R$ 515.960,00</td>
                <td className="py-4 px-4 text-zinc-500">R$ 0,00</td>
                <td className="py-4 px-4 text-emerald-400 font-bold">R$ 25.000 do Caixa</td>
                <td className="py-4 px-4 text-right text-primary font-bold">MARCO 1</td>
              </tr>
              <tr className="hover:bg-surface-container-highest/50 transition-colors">
                <td className="py-4 px-4 font-bold text-white">Mês 4 ao 6 (Escala 1M)</td>
                <td className="py-4 px-4 text-zinc-300">R$ 313.333/mês</td>
                <td className="py-4 px-4 font-black text-purple-400 text-sm">R$ 1.455.960,00</td>
                <td className="py-4 px-4 text-zinc-500">R$ 0,00</td>
                <td className="py-4 px-4 text-purple-400 font-bold">Autossustentável</td>
                <td className="py-4 px-4 text-right text-purple-400 font-bold">MARCO 2</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
