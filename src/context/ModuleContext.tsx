"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { moduleService, SystemModule } from "@/lib/services/moduleService";

interface ModuleContextType {
  modules: SystemModule[];
  loading: boolean;
  isModuleEnabled: (id: string) => boolean;
  isModuleInMaintenance: (id: string) => boolean;
  getModuleMaintenanceMessage: (id: string) => string;
  refreshModules: () => Promise<void>;
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

export function ModuleProvider({ children }: { children: ReactNode }) {
  const [modules, setModules] = useState<SystemModule[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchModules = async () => {
    try {
      const data = await moduleService.getModules();
      setModules(data);
    } catch (error) {
      console.error("Failed to fetch modules", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();

    // Inscrição em tempo real para mudanças no banco
    const subscription = moduleService.subscribeToChanges(() => {
      fetchModules();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const isModuleEnabled = (id: string) => {
    // Se não houver dados ainda, assume true para não quebrar a UI inicial
    if (modules.length === 0) return true;
    const mod = modules.find((m) => m.id === id);
    return mod ? mod.isEnabled : true;
  };

  const isModuleInMaintenance = (id: string) => {
    const mod = modules.find((m) => m.id === id);
    return mod ? mod.isInMaintenance : false;
  };

  const getModuleMaintenanceMessage = (id: string) => {
    const mod = modules.find((m) => m.id === id);
    return mod?.maintenanceMessage || "Este módulo está em manutenção temporária.";
  };

  return (
    <ModuleContext.Provider
      value={{
        modules,
        loading,
        isModuleEnabled,
        isModuleInMaintenance,
        getModuleMaintenanceMessage,
        refreshModules: fetchModules,
      }}
    >
      {children}
    </ModuleContext.Provider>
  );
}

export function useModules() {
  const context = useContext(ModuleContext);
  if (context === undefined) {
    throw new Error("useModules must be used within a ModuleProvider");
  }
  return context;
}
