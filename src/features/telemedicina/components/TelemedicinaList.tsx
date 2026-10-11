"use client";

import React, { useState } from "react";
import { Video, Calendar, UserCheck, CheckCircle2, Clock, Filter, Plus } from "lucide-react";
import { Teleconsulta, TelemedicinaStatus } from "../types";
import { TelemedicinaCard } from "./TelemedicinaCard";

interface TelemedicinaListProps {
  consultas: Teleconsulta[];
  selectedTab: string;
  onTabChange: (tab: string) => void;
  onEnterRoom: (consulta: Teleconsulta) => void;
  onStatusChange: (id: string, newStatus: Teleconsulta["status"]) => void;
  onDelete: (id: string) => void;
  onOpenNewModal: () => void;
}

export function TelemedicinaList({
  consultas,
  selectedTab,
  onTabChange,
  onEnterRoom,
  onStatusChange,
  onDelete,
  onOpenNewModal,
}: TelemedicinaListProps) {
  const tabs = [
    { id: "todas", label: "Todas", count: consultas.length },
    { 
      id: "sala_espera", 
      label: "Sala de Espera", 
      count: consultas.filter(c => c.status === "sala_espera").length,
      badgeColor: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
    },
    { 
      id: "agendado", 
      label: "Agendadas", 
      count: consultas.filter(c => c.status === "agendado").length 
    },
    { 
      id: "em_andamento", 
      label: "Em Andamento", 
      count: consultas.filter(c => c.status === "em_andamento").length 
    },
    { 
      id: "concluido", 
      label: "Concluídas", 
      count: consultas.filter(c => c.status === "concluido").length 
    },
  ];

  const filteredConsultas = consultas.filter((c) => {
    if (selectedTab === "todas") return true;
    return c.status === selectedTab;
  });

  return (
    <div className="space-y-4">
      {/* Abas Tipo Pílula de Filtro Superior */}
      <div className="flex flex-wrap items-center gap-1.5 bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 p-1.5 rounded-2xl shadow-sm backdrop-blur-md">
        {tabs.map((tab) => {
          const isActive = selectedTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all
                ${isActive
                  ? 'bg-zinc-900 text-white dark:bg-zinc-800 dark:text-white shadow-sm border border-zinc-700/80'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                }
              `}
            >
              <span>{tab.label}</span>
              <span
                className={`
                  px-2 py-0.5 rounded-full text-[10px] font-black
                  ${isActive 
                    ? 'bg-rd-cyan text-zinc-950' 
                    : tab.badgeColor || 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                  }
                `}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid de Consultas ou Empty State */}
      {filteredConsultas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredConsultas.map((consulta) => (
            <TelemedicinaCard
              key={consulta.id}
              consulta={consulta}
              onEnterRoom={onEnterRoom}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="
          relative overflow-hidden
          bg-white dark:bg-zinc-900/85
          backdrop-blur-xl
          border-2 border-zinc-200 dark:border-zinc-700/80
          rounded-2xl p-10
          flex flex-col items-center justify-center text-center
          shadow-sm
        ">
          <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700/80 flex items-center justify-center text-zinc-400 mb-3">
            <Video size={26} className="text-rd-cyan" />
          </div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">
            Nenhuma teleconsulta encontrada nesta visualização
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mt-1 mb-5">
            Não há atendimentos para o filtro selecionado. Agende uma nova teleconsulta e envie o link seguro ao paciente.
          </p>
          <button
            onClick={onOpenNewModal}
            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-blue-500/25 flex items-center gap-2"
          >
            <Plus size={16} /> Agendar Nova Teleconsulta
          </button>
        </div>
      )}
    </div>
  );
}
