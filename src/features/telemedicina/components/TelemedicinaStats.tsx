"use client";

import React from "react";
import { Video, Clock, CheckCircle2, UserCheck, ShieldCheck } from "lucide-react";

interface TelemedicinaStatsProps {
  totalHoje: number;
  totalEmEspera: number;
  totalEmAndamento: number;
  totalConcluidas: number;
}

export function TelemedicinaStats({
  totalHoje,
  totalEmEspera,
  totalEmAndamento,
  totalConcluidas,
}: TelemedicinaStatsProps) {
  const cards = [
    {
      label: "Teleconsultas Hoje",
      value: totalHoje,
      icon: Clock,
      color: "text-rd-cyan",
      bgGradient: "from-blue-500/10 to-transparent",
      subtitle: "Agenda do dia",
      pulse: false,
    },
    {
      label: "Sala de Espera Virtual",
      value: totalEmEspera,
      icon: UserCheck,
      color: totalEmEspera > 0 ? "text-emerald-400" : "text-zinc-400",
      bgGradient: totalEmEspera > 0 ? "from-emerald-500/15 to-transparent" : "from-zinc-500/10 to-transparent",
      subtitle: totalEmEspera > 0 ? "Pacientes aguardando conexão" : "Nenhum paciente aguardando",
      pulse: totalEmEspera > 0,
    },
    {
      label: "Salas Ativas",
      value: totalEmAndamento,
      icon: Video,
      color: "text-amber-400",
      bgGradient: "from-amber-500/10 to-transparent",
      subtitle: "Consultas em atendimento",
      pulse: totalEmAndamento > 0,
    },
    {
      label: "Atendimentos Concluídos",
      value: totalConcluidas,
      icon: CheckCircle2,
      color: "text-emerald-400",
      bgGradient: "from-emerald-500/10 to-transparent",
      subtitle: "Prontuários & laudos emitidos",
      pulse: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="
              relative overflow-hidden
              bg-white dark:bg-zinc-900/85
              backdrop-blur-xl
              border-2 border-zinc-200 dark:border-zinc-700/80
              rounded-2xl p-4 sm:p-5
              shadow-sm hover:shadow-xl hover:shadow-rd-cyan/5
              hover:border-rd-cyan/50
              transition-all duration-300 group
            "
          >
            {/* Gradiente sutil interno para profundidade Liquid Glass */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} pointer-events-none opacity-40`} />

            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  {card.label}
                </p>
                <div className="flex items-baseline gap-2 mt-1.5">
                  <span className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
                    {card.value}
                  </span>
                  {card.pulse && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Ao Vivo
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1 font-medium">
                  {card.subtitle}
                </p>
              </div>

              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 ${card.color} shadow-sm group-hover:scale-110 transition-transform`}
              >
                <Icon size={20} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
