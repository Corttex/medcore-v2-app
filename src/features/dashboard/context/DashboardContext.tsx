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

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loadingUnits, setLoadingUnits] = useState<boolean>(true);
  React.useEffect(() => {
    async function fetchUnits() {
      try {
        setLoadingUnits(true);
        // Fallback unit em caso de tabela vazia (substituindo Supabase)
        // No futuro isso deve bater em /api/units
        const defaultUnit: Unit = {
          id: "default-unit-1",
          name: "Hospital Central MedCore",
          type: "Hospital Geral",
          active: true
        };
        setUnits([defaultUnit]);
        if (!selectedUnitId) {
          setSelectedUnitId(defaultUnit.id);
        }
      } catch (err) {
        console.error("Erro ao buscar unidades:", err);
      } finally {
        setLoadingUnits(false);
      }
    }
    fetchUnits();
  }, [selectedUnitId]);

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
