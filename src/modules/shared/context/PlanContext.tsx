"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type PlanLevel = "BASIC" | "PRO" | "MAX";

interface PlanContextType {
  activePlan: PlanLevel;
  setActivePlan: (plan: PlanLevel) => void;
  hasAccess: (requiredPlan: PlanLevel) => boolean;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

// A Hierarquia de Acesso (cada número maior embute os direitos do menor)
const planHierarchy = {
  BASIC: 1,
  PRO: 2,
  MAX: 3,
};

export function PlanProvider({ children }: { children: ReactNode }) {
  const [activePlan, setActivePlan] = useState<PlanLevel>("MAX");

  // On mount, verify if there is a plan pushed by Landing Page to simulate
  React.useEffect(() => {
    const saved = localStorage.getItem("medcore_simulated_plan") as PlanLevel;
    if (saved && ["BASIC", "PRO", "MAX"].includes(saved)) {
      setActivePlan(saved);
    }
  }, []);

  // Update logic to propagate to storage as well
  const changePlan = (plan: PlanLevel) => {
    setActivePlan(plan);
    localStorage.setItem("medcore_simulated_plan", plan);
  };

  const hasAccess = (requiredPlan: PlanLevel) => {
    return planHierarchy[activePlan] >= planHierarchy[requiredPlan];
  };

  return (
    <PlanContext.Provider value={{ activePlan, setActivePlan: changePlan, hasAccess }}>
      {children}
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
