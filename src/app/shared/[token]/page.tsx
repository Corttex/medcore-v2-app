"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { PinGate } from "@/modules/auth/components/PinGate";
import { Stethoscope, BarChart3, ShieldCheck, FileText, TrendingUp, AlertCircle } from "lucide-react";

export default function SharedViewPage({ params }: { params: { token: string } }) {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "Executivo";
  
  const [pinVerified, setPinVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento inicial
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-12 selection:bg-teal-500 selection:text-black">
      {!pinVerified && (
        <PinGate 
          onSuccess={() => setPinVerified(true)}
          title={`Acesso: ${role.charAt(0).toUpperCase() + role.slice(1)}`}
        />
      )}

      {/* Header Premium (Apenas visível após PIN) */}
      <div className={`max-w-5xl mx-auto space-y-12 transition-all duration-1000 ${pinVerified ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 blur-xl"}`}>
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-12 border-b border-zinc-800/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-teal-500/10 text-teal-400 rounded-2xl border border-teal-500/20">
              <Stethoscope size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">MEDCORE <span className="text-teal-400">EXECUTIVE</span></h1>
              <p className="text-zinc-500 text-sm font-medium">Relatório Consolidado • Unidade São Paulo</p>
            </div>
          </div>
          
          <div className="px-6 py-3 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
            <span className="text-[10px] uppercase font-black text-zinc-400 tracking-widest">Dashboard de {role}</span>
          </div>
        </header>

        {/* Visão Executiva */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-8 bg-zinc-900/40 border border-zinc-800/50 rounded-3xl space-y-4">
                <BarChart3 className="text-teal-400" size={24} />
                <div>
                  <p className="text-sm font-medium text-zinc-500">Performance Trimestral</p>
                  <p className="text-3xl font-black text-white">94.2%</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full w-fit">
                  <TrendingUp size={12} /> +4.8% vs. anterior
                </div>
              </div>
              <div className="p-8 bg-zinc-900/40 border border-zinc-800/50 rounded-3xl space-y-4">
                <ShieldCheck className="text-cyan-400" size={24} />
                <div>
                  <p className="text-sm font-medium text-zinc-500">Índice de Conformidade</p>
                  <p className="text-3xl font-black text-white">100%</p>
                </div>
                <p className="text-[10px] font-bold text-zinc-500 tracking-wider">AUDITADO POR CONTE CORE</p>
              </div>
            </section>

            <section className="p-8 bg-zinc-900/20 border border-zinc-800/50 rounded-3xl">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <FileText size={20} className="text-zinc-400" /> Notas da Auditoria
              </h3>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="p-5 bg-black/40 border border-zinc-800/50 rounded-2xl">
                    <p className="text-xs text-zinc-400 leading-relaxed italic">
                      "Todos os protocolos de triagem foram validados conforme as normas vigentes. Nenhuma irregularidade encontrada nos módulos de faturamento de alta complexidade."
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <div className="p-8 bg-gradient-to-br from-teal-500/10 to-transparent border border-teal-500/20 rounded-3xl">
              <div className="flex items-center gap-3 mb-6">
                <AlertCircle className="text-teal-400" size={20} />
                <h4 className="text-sm font-black uppercase tracking-wider">Informações Adicionais</h4>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed mb-6">
                Este link é exclusivo para {role}s autorizados. Toda atividade de visualização é registrada para fins de segurança.
              </p>
              <footer className="pt-6 border-t border-zinc-800/50">
                <p className="text-[10px] text-zinc-600 font-bold">TOKEN: {params.token.toUpperCase()}</p>
                <p className="text-[10px] text-zinc-600 font-bold">EXPIRA EM: 24h</p>
              </footer>
            </div>
          </aside>
        </div>
      </div>
      
      <p className="fixed bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-zinc-800 tracking-[0.3em] uppercase">
        Powered by Conte Core System
      </p>
    </main>
  );
}
