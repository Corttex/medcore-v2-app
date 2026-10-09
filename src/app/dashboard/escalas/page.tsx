"use client";

import React, { useState } from "react";
import { Users, Calendar as CalendarIcon, Clock, ShieldCheck, ChevronLeft, ChevronRight, Plus, MoreVertical, Filter, Stethoscope } from "lucide-react";
import { useDashboardContext } from "@/features/dashboard/context/DashboardContext";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

const MOCK_PROFISSIONAIS = [
  { id: 1, name: "Dra. Ana Silva", role: "Dermatologista", status: "Em Plantão", time: "08:00 - 18:00", avatar: "AS" },
  { id: 2, name: "Dr. Carlos Mendes", role: "Clínica Geral", status: "Folga", time: "-", avatar: "CM" },
  { id: 3, name: "Mariana Costa", role: "Enfermeira Chefe", status: "Em Plantão", time: "07:00 - 19:00", avatar: "MC" },
  { id: 4, name: "Juliana Santos", role: "Recepcionista", status: "Ausente", time: "08:00 - 17:00", avatar: "JS", alert: "Atestado Médico" },
];

const WEEK_DAYS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

export default function RHPage() {
  const { theme } = useTheme();
  const { selectedUnitId, units } = useDashboardContext();
  const [currentWeek, setCurrentWeek] = useState("16 a 22 de Setembro");

  const activeUnit = units.find(u => u.id === selectedUnitId) || units[0];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 pt-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-on-surface flex items-center gap-2">
            <Users className="text-rd-cyan" size={28} />
            Recursos Humanos & Escalas
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">Gestão de equipe e plantões da unidade <strong>{activeUnit?.name || "Geral"}</strong>.</p>
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-xl text-sm font-semibold hover:bg-surface-container transition-colors">
            <Filter size={16} />
            Filtros
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-rd-cyan text-zinc-950 rounded-xl text-sm font-bold shadow-md shadow-rd-cyan/20 hover:bg-rd-cyan/90 transition-colors">
            <Plus size={18} />
            Nova Escala
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Lado Esquerdo - Status do Dia */}
        <div className="lg:col-span-1 space-y-6">
          <div className={cn(
            "p-5 rounded-2xl border shadow-sm transition-all relative overflow-hidden",
            theme === 'dark' ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-zinc-200"
          )}>
            <h2 className="text-sm uppercase font-bold text-on-surface-variant tracking-widest mb-4">Plantão de Hoje</h2>
            
            <div className="space-y-4 relative z-10">
              {MOCK_PROFISSIONAIS.map(prof => (
                <div key={prof.id} className="flex items-center justify-between p-3 rounded-xl border border-outline-variant/30 bg-surface-container/30">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold font-heading",
                      prof.status === "Em Plantão" ? "bg-rd-cyan text-zinc-950" : 
                      prof.status === "Ausente" ? "bg-red-500 text-white" : "bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                    )}>
                      {prof.avatar}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-on-surface leading-tight">{prof.name}</h4>
                      <p className="text-sm text-on-surface-variant uppercase tracking-wider mt-0.5">{prof.role}</p>
                    </div>
                  </div>
                  {prof.alert && (
                    <div className="text-sm text-red-500 font-bold max-w-[60px] text-right leading-tight">
                      {prof.alert}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 py-2 text-xs font-bold text-rd-cyan border border-rd-cyan/20 rounded-xl hover:bg-rd-cyan/10 transition-colors">
              Ver Todos (12)
            </button>
          </div>

          <div className={cn(
            "p-5 rounded-2xl border shadow-sm",
            theme === 'dark' ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-zinc-200"
          )}>
             <h2 className="text-sm uppercase font-bold text-on-surface-variant tracking-widest mb-4">Métricas do Mês</h2>
             
             <div className="space-y-3">
               <div className="flex justify-between items-center">
                 <span className="text-sm text-on-surface">Horas Extras</span>
                 <span className="text-sm font-bold text-orange-400">42h</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-sm text-on-surface">Faltas / Atrasos</span>
                 <span className="text-sm font-bold text-red-400">3 ocorrências</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-sm text-on-surface">Custo Folha Estimado</span>
                 <span className="text-sm font-bold text-emerald-400">R$ 48.500</span>
               </div>
             </div>
          </div>
        </div>

        {/* Lado Direito - Matriz de Escala */}
        <div className="lg:col-span-3 space-y-6">
          <div className={cn(
            "p-1 rounded-2xl border shadow-sm transition-all overflow-hidden flex flex-col",
            theme === 'dark' ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-zinc-200"
          )}>
            
            {/* Calendar Controls */}
            <div className="p-4 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container/10">
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-rd-cyan" />
                <h3 className="font-heading font-bold text-on-surface">Escala Semanal</h3>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="p-1.5 rounded-lg border border-outline-variant hover:bg-surface-container text-on-surface">
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm font-medium text-on-surface min-w-[140px] text-center">{currentWeek}</span>
                <button className="p-1.5 rounded-lg border border-outline-variant hover:bg-surface-container text-on-surface">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Matrix */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-outline-variant/30">
                    <th className="p-4 text-sm uppercase font-bold text-on-surface-variant tracking-widest min-w-[200px]">Profissional</th>
                    {WEEK_DAYS.map(day => (
                      <th key={day} className="p-4 text-sm uppercase font-bold text-on-surface-variant tracking-widest text-center min-w-[100px] border-l border-outline-variant/10">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {MOCK_PROFISSIONAIS.map(prof => (
                    <tr key={prof.id} className="hover:bg-surface-container/20 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-heading shrink-0",
                            theme === 'dark' ? "bg-zinc-800 text-zinc-300" : "bg-zinc-200 text-zinc-600"
                          )}>
                            {prof.avatar}
                          </div>
                          <div>
                            <p className="font-bold text-on-surface">{prof.name}</p>
                            <p className="text-sm text-on-surface-variant">{prof.role}</p>
                          </div>
                        </div>
                      </td>
                      {/* Dias (Mock) */}
                      {WEEK_DAYS.map((day, idx) => {
                        // Logica mock basica
                        const isWorking = (prof.id + idx) % 3 !== 0;
                        const isNight = idx === 4 && prof.id === 3;
                        return (
                          <td key={day} className="p-2 border-l border-outline-variant/10 align-middle">
                            {isWorking ? (
                              <div className={cn(
                                "rounded-lg p-2 text-center text-[11px] font-medium border",
                                isNight 
                                  ? "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" 
                                  : "bg-rd-cyan/10 text-rd-cyan border-rd-cyan/20"
                              )}>
                                {isNight ? "19:00 - 07:00" : "08:00 - 18:00"}
                              </div>
                            ) : (
                              <div className="text-center text-sm uppercase tracking-widest text-on-surface-variant font-bold opacity-40">
                                Folga
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-outline-variant/30 bg-surface-container/10 flex justify-between items-center text-xs text-on-surface-variant">
              <span>Mostrando 4 de 24 profissionais</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rd-cyan"></div> Diurno</div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> Noturno</div>
              </div>
            </div>

          </div>
        </div>
        
      </div>
    </div>
  );
}
