"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Unit {
  id: string;
  name: string;
  type: string;
  active: boolean;
}

const MOCK_UNITS: Unit[] = [
  { id: "1", name: "Hospital Central São Lucas", type: "Hospital", active: true },
  { id: "2", name: "UPA Norte", type: "UPA", active: true },
  { id: "3", name: "Clínica Sul", type: "Clínica", active: true },
];

interface DashboardContextType {
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (isOpen: boolean) => void;
  toggleMobileMenu: () => void;
  selectedUnitId: string | null;
  setSelectedUnitId: (id: string | null) => void;
  units: Unit[];
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>("1"); // Inicia com unidade padrão
  const [units] = useState<Unit[]>(MOCK_UNITS);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  return (
    <DashboardContext.Provider 
      value={{ 
        isMobileMenuOpen, 
        setMobileMenuOpen, 
        toggleMobileMenu,
        selectedUnitId,
        setSelectedUnitId,
        units
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardContext() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboardContext must be used within a DashboardProvider");
  }
  return context;
}
