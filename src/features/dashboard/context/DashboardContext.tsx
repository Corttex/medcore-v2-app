"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface Unit {
  id: string;
  name: string;
  type: string;
  active: boolean;
}

interface DashboardContextType {
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (isOpen: boolean) => void;
  toggleMobileMenu: () => void;
  selectedUnitId: string | null;
  setSelectedUnitId: (id: string | null) => void;
  units: Unit[];
  loadingUnits: boolean;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const defaultUnit: Unit = {
  id: "default-unit-1",
  name: "Hospital Central MedCore",
  type: "Hospital Geral",
  active: true
};

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>("default-unit-1");
  const [units, setUnits] = useState<Unit[]>([defaultUnit]);
  const [loadingUnits, setLoadingUnits] = useState<boolean>(false);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  return (
    <DashboardContext.Provider 
      value={{ 
        isMobileMenuOpen, 
        setMobileMenuOpen, 
        toggleMobileMenu,
        selectedUnitId,
        setSelectedUnitId,
        units,
        loadingUnits
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

