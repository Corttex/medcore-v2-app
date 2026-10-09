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
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
            <Wrench className="w-6 h-6 text-[var(--color-rd-cyan)]" />
            Central de OS
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Abertura e acompanhamento de ordens de serviço da clínica.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 rounded-xl text-sm font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            IA Triagem Ativa
          </div>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="bg-[var(--color-rd-cyan)] hover:opacity-90 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-opacity flex items-center gap-2"
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
