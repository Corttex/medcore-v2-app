"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { createClient } from "@/core/supabase/client";

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
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const supabase = React.useMemo(() => createClient(), []);

  React.useEffect(() => {
    async function fetchUnits() {
      const { data, error } = await supabase
        .from('units')
        .select('*')
        .eq('active', true);
      
      if (!error && data) {
        setUnits(data);
        if (data.length > 0 && !selectedUnitId) {
          setSelectedUnitId(data[0].id);
        }
      }
    }
    fetchUnits();
  }, [supabase, selectedUnitId]);

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
