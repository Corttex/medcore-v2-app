"use client";

import React, { useEffect, useState } from "react";
import { Plus, Wrench } from "lucide-react";
import { OSTable } from "@/features/os/components/OSTable";
import { OSForm } from "@/features/os/components/OSForm";

export default function OSPage() {
  const [ordens, setOrdens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchOS = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/os");
      if (res.ok) {
        const data = await res.json();
        setOrdens(data);
      }
    } catch (error) {
      console.error("Failed to fetch OS:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOS();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    // Optimistic update
    setOrdens(prev => prev.map((os: any) => os.id === id ? { ...os, status: newStatus } : os) as any);
    
    try {
      await fetch(`/api/os/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (error) {
      console.error(error);
      fetchOS(); // Revert on failure
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20 pt-2">
      {/* Action Bar Superior Compacta - Sem Duplicação de H1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900/90 border-2 border-zinc-200 dark:border-zinc-700/80 px-5 py-3.5 rounded-2xl shadow-sm backdrop-blur-md">
        {/* Lado Esquerdo: Contadores Dinâmicos */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/70 px-3.5 py-1.5 rounded-xl">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              <strong className="text-rd-cyan font-bold">{ordens.length}</strong> ordens de serviço
            </p>
          </div>
          <div className="px-3.5 py-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 rounded-xl text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            IA Triagem Ativa
          </div>
        </div>

        {/* Lado Direito: Ação Nova OS */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsFormOpen(true)}
            className="btn-gradient text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nova OS
          </button>
        </div>
      </div>

      {/* AI Triage Banner */}
      <div className="bg-gradient-to-r from-purple-500/10 to-transparent border border-purple-500/20 rounded-2xl p-4 flex items-start gap-4 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500 shrink-0 mt-1">
          <Wrench className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
            Triagem Inteligente MEDCore
          </h3>
          <p className="text-xs text-on-surface-variant mt-1">
            As ordens de serviço abertas são analisadas pela IA. Categorias, prioridades e SLAs são sugeridos automaticamente baseados no histórico de manutenção dos equipamentos (Patrimônio) e impacto na operação da clínica.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="h-40 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-rd-cyan)]"></div>
        </div>
      ) : (
        <OSTable ordens={ordens} onStatusChange={handleStatusChange} />
      )}

      <OSForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSuccess={fetchOS} 
      />

    </div>
  );
}
