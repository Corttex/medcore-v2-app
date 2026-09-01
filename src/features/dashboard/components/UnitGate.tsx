"use client";

import React from "react";
import { useDashboardContext } from "@/features/dashboard/context/DashboardContext";
import { Building2, Loader2 } from "lucide-react";

export function UnitGate({ children }: { children: React.ReactNode }) {
  const { selectedUnitId, units, loadingUnits } = useDashboardContext();

  // Se ainda está carregando as unidades do banco
  if (loadingUnits) {
    return (
      <div className="fixed inset-0 z-[100] bg-zinc-950 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-brand/5 pointer-events-none blur-[120px]"></div>
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-brand/10 border border-brand/20 rounded-3xl flex items-center justify-center text-brand mx-auto shadow-card">
            <Loader2 size={40} className="animate-spin" />
          </div>
          <h1 className="font-heading text-2xl font-black tracking-tighter text-white italic">
            Carregando <span className="text-gradient-brand">Hospital...</span>
          </h1>
          <p className="text-zinc-500 font-medium text-sm">Conectando ao sistema operacional</p>
        </div>
      </div>
    );
  }

  // Se já tiver uma unidade selecionada, apenas renderiza o conteúdo
  if (selectedUnitId || units.length > 0) return <>{children}</>;

  // Sem unidade cadastrada
  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-brand/5 pointer-events-none blur-[120px]"></div>
      
      <div className="max-w-xl w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-brand/10 border border-brand/20 rounded-3xl flex items-center justify-center text-brand mx-auto shadow-card animate-pulse">
            <Building2 size={40} />
          </div>
          <h1 className="font-heading text-4xl font-black tracking-tighter text-white italic">
            Nenhum Hospital <span className="text-gradient-brand">Cadastrado</span>
          </h1>
          <p className="text-zinc-400 font-medium leading-relaxed max-w-md mx-auto">
            Para acessar o ecossistema MedCore, é necessário cadastrar o hospital vinculado à sua conta. Entre em contato com o administrador do sistema.
          </p>
        </div>

        <div className="pt-4 text-center">
          <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 bg-brand rounded-full"></span>
            Protocolo de Segurança Ativo
          </p>
        </div>
      </div>
    </div>
  );
}
