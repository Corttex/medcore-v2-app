"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Lock, Sparkles, CheckCircle2, ArrowRight, X, Crown, TrendingUp } from "lucide-react";

export type PlanLevel = "BASIC" | "PRO" | "MAX";
export type CommercialTier = "STARTER" | "GROWTH" | "BUSINESS" | "ENTERPRISE";

export interface UpgradeModalInfo {
  title: string;
  requiredTier: CommercialTier;
  description?: string;
  features?: string[];
  upsellHook?: string;
  href?: string;
}

interface PlanContextType {
  activePlan: PlanLevel;
  commercialTier: CommercialTier;
  setActivePlan: (plan: PlanLevel) => void;
  setCommercialTier: (tier: CommercialTier) => void;
  hasAccess: (requiredPlan: PlanLevel) => boolean;
  hasCommercialAccess: (requiredTier: CommercialTier) => boolean;
  getCommercialPlanLabel: (tier: CommercialTier) => string;
  openUpgradeModal: (info: UpgradeModalInfo) => void;
  closeUpgradeModal: () => void;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

const planHierarchy: Record<PlanLevel, number> = {
  BASIC: 1,
  PRO: 2,
  MAX: 3,
};

const tierHierarchy: Record<CommercialTier, number> = {
  STARTER: 1,
  GROWTH: 2,
  BUSINESS: 3,
  ENTERPRISE: 4,
};

const tierToPlanLevel: Record<CommercialTier, PlanLevel> = {
  STARTER: "BASIC",
  GROWTH: "PRO",
  BUSINESS: "PRO",
  ENTERPRISE: "MAX",
};

const planLevelToTier: Record<PlanLevel, CommercialTier> = {
  BASIC: "STARTER",
  PRO: "BUSINESS",
  MAX: "ENTERPRISE",
};

export const COMMERCIAL_TIER_META: Record<
  CommercialTier,
  { label: string; shortLabel: string; price: string; badgeClass: string }
> = {
  STARTER: {
    label: "Plano Starter",
    shortLabel: "Starter",
    price: "R$ 197/mês",
    badgeClass: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
  },
  GROWTH: {
    label: "Plano Growth",
    shortLabel: "Growth",
    price: "R$ 347/mês",
    badgeClass: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  },
  BUSINESS: {
    label: "Plano Business",
    shortLabel: "Business",
    price: "R$ 547/mês",
    badgeClass: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
  ENTERPRISE: {
    label: "Plano Enterprise",
    shortLabel: "Enterprise",
    price: "R$ 997/mês",
    badgeClass: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  },
};

export function PlanProvider({ children }: { children: ReactNode }) {
  const [commercialTier, setCommercialTierState] = useState<CommercialTier>("STARTER");
  const [upgradeInfo, setUpgradeInfo] = useState<UpgradeModalInfo | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedTier = localStorage.getItem("medcore_simulated_tier") as CommercialTier | null;
    if (savedTier && ["STARTER", "GROWTH", "BUSINESS", "ENTERPRISE"].includes(savedTier)) {
      setCommercialTierState(savedTier);
      return;
    }

    const savedPlan = localStorage.getItem("medcore_simulated_plan") as PlanLevel | null;
    if (savedPlan && ["BASIC", "PRO", "MAX"].includes(savedPlan)) {
      setCommercialTierState(planLevelToTier[savedPlan]);
    }
  }, []);

  const setCommercialTier = (tier: CommercialTier) => {
    setCommercialTierState(tier);
    localStorage.setItem("medcore_simulated_tier", tier);
    localStorage.setItem("medcore_simulated_plan", tierToPlanLevel[tier]);
  };

  const changePlan = (plan: PlanLevel) => {
    setCommercialTier(planLevelToTier[plan]);
  };

  const activePlan = tierToPlanLevel[commercialTier];

  const hasAccess = (requiredPlan: PlanLevel) => {
    return planHierarchy[activePlan] >= planHierarchy[requiredPlan];
  };

  const hasCommercialAccess = (requiredTier: CommercialTier) => {
    return tierHierarchy[commercialTier] >= tierHierarchy[requiredTier];
  };

  const getCommercialPlanLabel = (tier: CommercialTier) => {
    return COMMERCIAL_TIER_META[tier]?.label || "Plano Business";
  };

  const openUpgradeModal = (info: UpgradeModalInfo) => {
    setUpgradeInfo(info);
  };

  const closeUpgradeModal = () => {
    setUpgradeInfo(null);
  };

  return (
    <PlanContext.Provider
      value={{
        activePlan,
        commercialTier,
        setActivePlan: changePlan,
        setCommercialTier,
        hasAccess,
        hasCommercialAccess,
        getCommercialPlanLabel,
        openUpgradeModal,
        closeUpgradeModal,
      }}
    >
      {children}

      {isMounted &&
        upgradeInfo &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={closeUpgradeModal}
          >
            <div
              className="w-full max-w-lg rounded-3xl border border-cyan-500/25 bg-[#0B0F19] text-white shadow-[0_24px_60px_rgba(0,0,0,0.65)] overflow-hidden animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-white/10 flex items-start justify-between gap-4 bg-gradient-to-br from-cyan-500/10 via-transparent to-amber-500/10">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/35 text-amber-400 flex items-center justify-center shrink-0">
                    <Lock size={20} />
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 mb-1.5">
                      <Crown size={11} />
                      Disponível no {getCommercialPlanLabel(upgradeInfo.requiredTier)}
                    </span>
                    <h3 className="text-lg font-bold text-white leading-tight">
                      {upgradeInfo.title}
                    </h3>
                    <p className="text-xs text-[#B8C0CC] mt-1 leading-relaxed">
                      {upgradeInfo.upsellHook ||
                        upgradeInfo.description ||
                        "Desbloqueie este módulo estratégico e conecte toda a inteligência operacional da Dra. Conte."}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeUpgradeModal}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {upgradeInfo.features && upgradeInfo.features.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#00D4FF]">
                      O que você desbloqueia imediatamente:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {upgradeInfo.features.map((feat) => (
                        <div
                          key={feat}
                          className="flex items-center gap-2 text-xs text-zinc-200 bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2"
                        >
                          <CheckCircle2 size={14} className="text-[#00D4FF] shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="rounded-2xl p-3.5 bg-cyan-500/10 border border-cyan-500/25 flex items-start gap-3">
                  <Sparkles size={16} className="text-[#00D4FF] shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed text-[#B8C0CC]">
                    <span className="font-semibold text-white">Conectado à Dra. Conte:</span> ao liberar este módulo, a IA passa a monitorar indicadores, sugerir ações e executar comandos por voz/texto nessa área.
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCommercialTier(upgradeInfo.requiredTier);
                      closeUpgradeModal();
                    }}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/15 text-zinc-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <TrendingUp size={14} className="text-[#00D4FF]" />
                    Simular {getCommercialPlanLabel(upgradeInfo.requiredTier)} Agora
                  </button>

                  <Link
                    href="/dashboard/loja"
                    onClick={closeUpgradeModal}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#00D4FF] to-blue-600 text-zinc-950 hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                  >
                    <span>Fazer Upgrade para {COMMERCIAL_TIER_META[upgradeInfo.requiredTier].shortLabel}</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error("usePlan must be used within a PlanProvider");
  }
  return context;
}
