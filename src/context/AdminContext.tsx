"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AdminContextType {
  isDemo: boolean;
  setIsDemo: (val: boolean) => void;
  selectedTenantId: string | null;
  setSelectedTenantId: (id: string | null) => void;
  selectedTenantName: string | null;
  setSelectedTenantName: (name: string | null) => void;
  isPinUnlocked: boolean;
  setIsPinUnlocked: (val: boolean) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  // Por padrão começa em produção real (isDemo = false)
  const [isDemo, setIsDemo] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("medcore_admin_demo_mode");
      return stored === "true";
    }
    return false;
  });

  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
  const [selectedTenantName, setSelectedTenantName] = useState<string | null>(null);
  const [isPinUnlocked, setIsPinUnlocked] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("medcore_admin_demo_mode", String(isDemo));
    }
  }, [isDemo]);

  return (
    <AdminContext.Provider
      value={{
        isDemo,
        setIsDemo,
        selectedTenantId,
        setSelectedTenantId,
        selectedTenantName,
        setSelectedTenantName,
        isPinUnlocked,
        setIsPinUnlocked,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdminContext() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdminContext deve ser usado dentro de AdminProvider");
  }
  return context;
}
