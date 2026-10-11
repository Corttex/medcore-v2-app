"use client";

import React from "react";
import { Search, Plus, Video, Radio, Sparkles } from "lucide-react";

interface TelemedicinaActionBarProps {
  totalHoje: number;
  totalEmEspera: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenNewModal: () => void;
  onOpenDeviceTest: () => void;
}

export function TelemedicinaActionBar({
  totalHoje,
  totalEmEspera,
  searchQuery,
  onSearchChange,
  onOpenNewModal,
  onOpenDeviceTest,
}: TelemedicinaActionBarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 px-5 py-3.5 rounded-2xl shadow-sm backdrop-blur-md transition-all">
      {/* Lado Esquerdo: Contadores Dinâmicos de Presença e Consultas */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/70 px-3.5 py-1.5 rounded-xl">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rd-cyan opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rd-cyan"></span>
          </span>
          <p className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
            <span className="text-rd-cyan font-bold">{totalHoje}</span> teleconsultas hoje
          </p>
        </div>

        {totalEmEspera > 0 ? (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl animate-pulse">
            <Radio size={14} className="text-emerald-400 animate-spin" />
            <p className="text-xs font-bold text-emerald-400">
              <span>{totalEmEspera}</span> {totalEmEspera === 1 ? 'paciente na sala de espera' : 'pacientes na sala de espera'}
            </p>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 px-3 py-1.5 rounded-xl">
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Sala de espera virtual ativa
            </p>
          </div>
        )}
      </div>

      {/* Lado Direito: Busca, Teste de Dispositivos e Botão de Nova Teleconsulta */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Campo de Busca */}
        <div className="relative flex-1 sm:flex-initial">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar paciente ou convênio..."
            className="w-full sm:w-56 bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-9 pr-3.5 py-2 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-rd-cyan transition-all"
          />
        </div>

        {/* Teste Rápido de Câmera/Microfone */}
        <button
          onClick={onOpenDeviceTest}
          title="Verificar áudio e vídeo"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700/80 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 transition-all"
        >
          <Video size={14} className="text-rd-cyan" />
          <span className="hidden lg:inline">Testar Câmera & Mic</span>
        </button>

        {/* Botão Primário com Gradiente Liquid */}
        <button
          onClick={onOpenNewModal}
          className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
        >
          <Plus size={15} />
          <span>Nova Teleconsulta</span>
        </button>
      </div>
    </div>
  );
}
