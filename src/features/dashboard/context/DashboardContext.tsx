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
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loadingUnits, setLoadingUnits] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUnit = localStorage.getItem("medcore_selected_unit");
      if (savedUnit) setSelectedUnitId(savedUnit);
    }

    async function fetchUnits() {
      try {
        const res = await fetch("/api/units");
        if (res.ok) {
          const data = await res.json();
          let loadedUnits = data.units || [];

          // Se estiver em modo bypass de desenvolvimento e a lista vier vazia
          if (loadedUnits.length === 0 && typeof window !== "undefined" && localStorage.getItem("medcore_bypass_unit") === "true") {
            loadedUnits = [defaultUnit];
          }

          setUnits(loadedUnits);
          
          if (loadedUnits.length > 0) {
            if (data.primaryUnitId) {
              setSelectedUnitId(data.primaryUnitId);
            } else if (!selectedUnitId) {
              setSelectedUnitId(loadedUnits[0].id);
            }
          }
        }
      } catch (err) {
        console.error("Erro ao buscar unidades:", err);
      } finally {
        setLoadingUnits(false);
      }
    }
    fetchUnits();
  }, []);

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

