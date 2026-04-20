"use client";

import React from "react";
import { useDashboardContext } from "@/modules/dashboard/context/DashboardContext";
import { Building2, Plus, ArrowRight, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

interface UnitGateProps {
  children: React.ReactNode;
}

export function UnitGate({ children }: { children: React.ReactNode }) {
  const { selectedUnitId, setSelectedUnitId } = useDashboardContext();
  const router = useRouter();

  // Se já tiver uma unidade selecionada, apenas renderiza o conteúdo
  if (selectedUnitId) return <>{children}</>;

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-brand/5 pointer-events-none blur-[120px]"></div>
      
      <div className="max-w-xl w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-brand/10 border border-brand/20 rounded-3xl flex items-center justify-center text-brand mx-auto shadow-card animate-pulse">
            <Building2 size={40} />
          </div>
          <h1 className="font-heading text-4xl font-black tracking-tighter text-white italic">
            Configuração <span className="text-gradient-brand">Pendente</span>
          </h1>
          <p className="text-zinc-400 font-medium leading-relaxed max-w-md mx-auto">
            Para acessar o ecossistema MedCore e a Inteligência Executiva, você precisa vincular sua sessão a uma Unidade de Trabalho ativa.
          </p>
        </div>

        <div className="grid gap-4">
          {/* Opção 1: Selecionar Existente (Demonstração - Aqui você carregaria as unidades do banco) */}
          <div className="group relative">
            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <button 
              onClick={() => setSelectedUnitId("mock-unit-1")}
              className="w-full p-6 bg-zinc-900/50 border border-zinc-800 rounded-3xl flex items-center justify-between hover:bg-zinc-900 hover:border-brand/40 transition-all text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-brand transition-colors">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="font-heading font-black text-white text-lg tracking-tight">Usar Unidade Matriz</h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Entrar como Administrador de Rede</p>
                </div>
              </div>
              <ArrowRight size={20} className="text-zinc-700 group-hover:text-brand group-hover:translate-x-1 transition-all" />
            </button>
          </div>

          <div className="relative py-4 flex items-center gap-4">
            <div className="flex-1 h-px bg-zinc-800/50"></div>
            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">Ou</span>
            <div className="flex-1 h-px bg-zinc-800/50"></div>
          </div>

          {/* Opção 2: Cadastrar Nova */}
          <button 
            onClick={() => router.push("/dashboard/units")}
            className="w-full p-6 border border-dashed border-zinc-800 rounded-3xl flex items-center gap-4 hover:border-brand/40 hover:bg-brand/5 transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center text-brand">
              <Plus size={24} />
            </div>
            <div>
              <h3 className="font-heading font-black text-zinc-300 text-lg tracking-tight group-hover:text-brand transition-colors">Vincular Nova Unidade</h3>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Registrar novo hub operacional</p>
            </div>
          </button>
        </div>

        <div className="pt-8 text-center">
            <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 bg-brand rounded-full"></span>
                Protocolo de Segurança Ativo
            </p>
        </div>
      </div>
    </div>
  );
}
