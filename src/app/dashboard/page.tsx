"use client";

import React, { useState } from "react";
import { Users, Calendar, Activity, DollarSign, Clock, CheckCircle2, Eye, ShieldAlert } from "lucide-react";
import { StatCard } from "@/modules/dashboard/components/StatCard";
import { PinGate } from "@/modules/auth/components/PinGate";

export default function DashboardPage() {
  const [showProtected, setShowProtected] = useState(false);
  const [pinVerified, setPinVerified] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {showProtected && (
        <PinGate 
          onSuccess={() => {
            setPinVerified(true);
            setShowProtected(false);
          }}
          onCancel={() => setShowProtected(false)}
          title="Relatório de Auditoria"
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 underline decoration-teal-500/30 decoration-4 underline-offset-8">
            Bem-vindo, John
          </h1>
          <p className="text-zinc-500">Visão geral da sua operação hospitalar hoje.</p>
        </div>
        
        {pinVerified && (
          <div className="px-4 py-2 bg-teal-500/10 border border-teal-500/20 rounded-full text-teal-400 text-xs font-bold flex items-center gap-2 animate-in zoom-in-95">
            <ShieldAlert size={14} /> MODO AUDITORIA ATIVO
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Pacientes hoje" 
          value="124" 
          trend={{ value: "12%", isPositive: true }}
          icon={Users}
          color="teal"
        />
        <StatCard 
          label="Consultas Pendentes" 
          value="38" 
          trend={{ value: "5", isPositive: false }}
          icon={Calendar}
          color="cyan"
        />
        <StatCard 
          label="Faturamento Mensal" 
          value={pinVerified ? "R$ 45.2k" : "R$ ••••••"} 
          trend={pinVerified ? { value: "8.2%", isPositive: true } : undefined}
          icon={DollarSign}
          color="zinc"
        />
        <StatCard 
          label="Auditoria Clínica" 
          value={pinVerified ? "Conforme" : "Status: Bloqueado"} 
          trend={pinVerified ? { value: "Seguro", isPositive: true } : undefined}
          icon={Activity}
          color="teal"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="p-8 bg-zinc-950 border border-zinc-800 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Activity size={120} />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">Relatórios Sensíveis</h3>
            <p className="text-zinc-500 text-sm mb-6 max-w-sm">
              Este módulo contém dados sigilosos e requer validação de identidade via PIN de 4 dígitos.
            </p>
            
            {pinVerified ? (
              <div className="p-6 bg-teal-500/10 border border-teal-500/20 rounded-2xl text-teal-400 text-sm animate-in zoom-in-95 flex items-center gap-3">
                <CheckCircle2 size={24} />
                <div>
                  <p className="font-bold">Acesso liberado</p>
                  <p className="opacity-70 text-xs text-zinc-400">Relatório de Auditoria Médica v2.4 (Sincronizado)</p>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setShowProtected(true)}
                className="flex items-center gap-2 px-6 py-3 bg-zinc-100 hover:bg-white text-black font-bold rounded-xl transition-all shadow-xl hover:scale-105 active:scale-95"
              >
                <Eye size={18} /> Validar com PIN
              </button>
            )}
          </section>

          <section className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-zinc-100 flex items-center gap-2 text-sm uppercase tracking-widest opacity-60">
                <Clock size={16} />
                Processos Recentes
              </h3>
            </div>
            
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-zinc-950/50 border border-zinc-800/50 hover:border-zinc-700 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-400 group-hover:text-teal-400">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-200">Triagem Técnica #0{i}84</p>
                      <p className="text-xs text-zinc-500">Pronto Socorro • Há {i * 15} minutos</p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-zinc-600 border border-zinc-800 px-2 py-1 rounded-md">Ativo</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="p-6 rounded-2xl bg-gradient-to-br from-teal-500/10 to-transparent border border-teal-500/20">
            <h3 className="font-semibold text-teal-400 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
              <Activity size={16} />
              Status do Sistema
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-400">Supabase DB</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"></span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-400">Vercel Edge</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-400">Módulos Mobile</span>
                <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></span>
              </div>
            </div>
          </section>

          <section className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
            <h3 className="font-semibold text-zinc-100 mb-4 text-sm">Próximos Passos</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-xs text-zinc-400">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                Ativar Auditoria Clínica
              </li>
              <li className="flex items-center gap-3 text-xs text-zinc-400 opacity-40">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700"></div>
                Integração Mercado Pago
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
