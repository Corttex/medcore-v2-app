"use client";

import React, { useEffect, useState } from "react";
import { 
  Megaphone, 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  AlertCircle,
  CheckCircle2,
  Calendar,
  Sparkles
} from "lucide-react";
import { useAdminContext } from "@/context/AdminContext";

export default function CacTrafegoPage() {
  const { isDemo } = useAdminContext();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBudget = async () => {
      try {
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
    fetchBudget();
  }, [isDemo]);

  const spentBrl = data?.pocketBudget?.pocketSpentBrl || 5000;
  const maxBrl = data?.pocketBudget?.pocketMaxBrl || 10000;
  const usedPercent = data?.pocketBudget?.pocketUsedPercent || 50;
  const cashCollectedBrl = data?.financials?.cashCollectedBrl || 0;

  // Regra da trava: Mês 2 só libera aporte adicional se o caixa coletado cobrir
  const isMonth2Unlocked = cashCollectedBrl >= 15000;

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="p-8 bg-surface-container-low border border-outline-variant/30 rounded-[2.5rem] space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest">
          <DollarSign size={14} /> Disciplina de Caixa & Aquisição
        </div>
        <h1 className="text-3xl md:text-4xl font-black font-heading tracking-tight text-white">
          ROI do Bolso & <span className="text-gradient">Controle de CAC</span>
        </h1>
        <p className="text-sm text-zinc-400 font-medium max-w-3xl leading-relaxed">
          Trava matemática de capital dos sócios: <strong>máximo de R$ 5.000 a R$ 10.000 no Mês 1</strong>. Os meses seguintes são financiados 100% pelo caixa líquido gerado pelas vendas.
        </p>
      </div>

      {/* Os Cards de Trava do Bolso */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Teto do Mês 1 */}
        <div className="p-6 bg-surface-container-low border border-outline-variant/30 rounded-3xl space-y-4">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-black uppercase tracking-wider">Aporte Máximo Mês 1</span>
            <Lock size={18} className="text-amber-400" />
          </div>
          <div>
            <div className="text-3xl font-black text-white font-heading">
              R$ {spentBrl.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              De um teto de R$ {maxBrl.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} do bolso
            </p>
          </div>
          <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden p-0.5 border border-outline-variant/20">
            <div 
              className="h-full bg-amber-400 rounded-full" 
              style={{ width: `${usedPercent}%` }}
            />
          </div>
          <span className="text-xs font-bold text-amber-400 block">{usedPercent}% do capital utilizado</span>
        </div>

        {/* Card 2: Caixa Líquido Retornado */}
        <div className="p-6 bg-surface-container-low border border-emerald-500/30 rounded-3xl space-y-4">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-black uppercase tracking-wider">Caixa Retornado (Gateway)</span>
            <TrendingUp size={18} />
          </div>
          <div>
            <div className="text-3xl font-black text-emerald-400 font-heading">
              R$ {cashCollectedBrl.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-zinc-400 mt-1">Disponível para reinvestimento autossustentável</p>
          </div>
          <div className="pt-2 text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 size={14} /> Retorno sobre Capital do Bolso ativo
          </div>
        </div>

        {/* Card 3: Trava do Mês 2 (R$ 10k a 15k) */}
        <div className="p-6 bg-surface-container-low border border-outline-variant/30 rounded-3xl space-y-4">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-black uppercase tracking-wider">Trava Mês 2 (Rampa)</span>
            {isMonth2Unlocked ? <Unlock size={18} className="text-emerald-400" /> : <Lock size={18} className="text-rose-400" />}
          </div>
          <div>
            <div className={`text-2xl font-black font-heading ${isMonth2Unlocked ? "text-emerald-400" : "text-zinc-500"}`}>
              {isMonth2Unlocked ? "LIBERADO" : "BLOQUEADO"}
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Exige R$ 15.000 em caixa liquidado para liberar reinvestimento sem tirar do bolso
            </p>
          </div>
        </div>

      </div>

      {/* Canais de Tráfego e Destinação do Investimento */}
      <div className="p-8 bg-surface-container-low border border-outline-variant/30 rounded-[2.5rem] space-y-6">
        <h3 className="text-xl font-black text-white font-heading">
          Distribuição dos Canais de Aquisição (CAC & Tráfego)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white">1. Meta Ads (Secretárias / Cavalo de Troia)</span>
              <span className="text-xs font-bold text-primary">R$ 25/lead</span>
            </div>
            <p className="text-xs text-zinc-400">
              Campanhas com o vídeo da Dra. Conte organizando a recepção. Aquisição do plano de R$ 29,90 com retorno quase imediato.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white">2. Ajuda de Custo PAP (Sola de Sapato)</span>
              <span className="text-xs font-bold text-emerald-400">R$ 430/porta de valor</span>
            </div>
            <p className="text-xs text-zinc-400">
              Combustível, alimentação e deslocamento para visita de 18 clínicas por dia no plano presencial.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
