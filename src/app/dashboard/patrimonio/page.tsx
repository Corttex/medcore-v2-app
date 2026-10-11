"use client";

import React, { useEffect, useState } from "react";
import { Plus, Box } from "lucide-react";
import { PatrimonioTable } from "@/features/patrimonio/components/PatrimonioTable";
import { PatrimonioForm } from "@/features/patrimonio/components/PatrimonioForm";
import { PatrimonioInsightsWidget } from "@/features/patrimonio/components/PatrimonioInsightsWidget";

export default function PatrimonioPage() {
  const [patrimonios, setPatrimonios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchPatrimonios = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/patrimonio");
      if (res.ok) {
        const data = await res.json();
        setPatrimonios(data);
      }
    } catch (error) {
      console.error("Failed to fetch patrimonios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatrimonios();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setPatrimonios(prev => prev.map((item: any) => item.id === id ? { ...item, status: newStatus } : item) as any);
    
    try {
      await fetch(`/api/patrimonio/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (error) {
      console.error(error);
      fetchPatrimonios(); // Revert on failure
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
              <strong className="text-rd-cyan font-bold">{patrimonios.length}</strong> ativos patrimoniais registrados
            </p>
          </div>
        </div>

        {/* Lado Direito: Ações */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl font-semibold text-xs transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800">
            Exportar Inventário
          </button>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="btn-gradient text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Novo Ativo
          </button>
        </div>
      </div>

      {/* AI Patrimonio Banner */}
      <div className="bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/20 rounded-2xl p-4 flex items-start gap-4 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 shrink-0 mt-1">
          <Box className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
            Inventário Ativo & Depreciação Inteligente
          </h3>
          <p className="text-xs text-on-surface-variant mt-1">
            A IA da MEDCore monitora o ciclo de vida dos equipamentos (Macas, Aparelhos de Ultrassom, Lasers), alertando automaticamente sobre depreciação contábil e a necessidade de manutenções preventivas (Abrindo uma OS vinculada ao equipamento).
          </p>
        </div>
      </div>

      {loading ? (
        <div className="h-40 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-rd-cyan)]"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <PatrimonioInsightsWidget patrimonios={patrimonios} />
          <PatrimonioTable patrimonios={patrimonios} onStatusChange={handleStatusChange} />
        </div>
      )}

      <PatrimonioForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSuccess={fetchPatrimonios} 
      />

    </div>
  );
}
