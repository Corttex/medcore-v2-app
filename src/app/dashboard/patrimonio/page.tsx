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
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
            <Box className="w-6 h-6 text-[var(--color-rd-cyan)]" />
            Gestão de Patrimônio
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Controle de equipamentos e ativos da clínica.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-[var(--color-rd-cyan)] text-[var(--color-rd-cyan)] rounded-xl font-medium text-sm transition-opacity hover:bg-[var(--color-rd-cyan)]/10">
            Exportar Inventário
          </button>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="bg-[var(--color-rd-cyan)] hover:opacity-90 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-opacity flex items-center gap-2"
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
