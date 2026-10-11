"use client";

import React from "react";
import { TrendingUp, Target, Award, Users, Plus, Star, CheckCircle } from "lucide-react";

export default function DesempenhoPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20 pt-2">
      {/* Action Bar Superior Compacta - Sem Duplicação de H1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900/90 border-2 border-zinc-200 dark:border-zinc-700/80 px-5 py-3.5 rounded-2xl shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Target className="text-rd-cyan" size={18} />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Avaliação de Desempenho & 360°
            </span>
          </div>
          <span className="text-zinc-300 dark:text-zinc-700">|</span>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 border border-primary/20 text-primary">
            Ciclo Atual: 2º Semestre / 2026
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
            86% Concluído
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 bg-rd-cyan text-zinc-950 rounded-xl text-xs font-bold shadow-md shadow-rd-cyan/20 hover:bg-rd-cyan/90 transition-all">
            <Plus size={15} /> Nova Avaliação
          </button>
        </div>
      </div>

      {/* Cards de Métricas Liquid Glass */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative overflow-hidden bg-white dark:bg-zinc-900/85 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-5 shadow-sm group hover:border-rd-cyan/50 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-rd-cyan/15 flex items-center justify-center text-rd-cyan border border-rd-cyan/20">
              <Users size={20} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Avaliados no Ciclo</p>
              <h4 className="text-xl font-extrabold text-zinc-900 dark:text-white">78 / 90</h4>
            </div>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Autoavaliação, avaliação da liderança e pares 360°.</p>
        </div>

        <div className="relative overflow-hidden bg-white dark:bg-zinc-900/85 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-5 shadow-sm group hover:border-emerald-500/50 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
              <Star size={20} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Índice Médio Geral</p>
              <h4 className="text-xl font-extrabold text-zinc-900 dark:text-white">4.7 / 5.0</h4>
            </div>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Excelente performance assistencial, pontualidade e trabalho em equipe.</p>
        </div>

        <div className="relative overflow-hidden bg-white dark:bg-zinc-900/85 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-5 shadow-sm group hover:border-violet-500/50 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center text-violet-500 border border-violet-500/20">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Planos PDI Ativos</p>
              <h4 className="text-xl font-extrabold text-zinc-900 dark:text-white">14 Planos</h4>
            </div>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Metas pactuadas para desenvolvimento de novas lideranças.</p>
        </div>
      </div>

      {/* Painel Central Liquid Glass */}
      <div className="p-8 bg-white dark:bg-zinc-900/85 backdrop-blur-xl rounded-3xl border-2 border-zinc-200 dark:border-zinc-700/80 text-center shadow-md">
        <Target size={44} className="mx-auto mb-3 text-rd-cyan opacity-40" />
        <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Matriz 9-Box e Gestão por Competências Clínicas
        </h3>
        <p className="text-zinc-500 dark:text-zinc-400 text-xs max-w-lg mx-auto mb-6">
          Visão holística de potencial e desempenho da equipe assistencial e administrativa para promoções e retenção de talentos hospitalares.
        </p>

        {/* Competências em Destaque */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto text-left">
          {[
            { comp: "Acolhimento & Humanização", score: "4.9 / 5.0", badge: "Supera Expectativas" },
            { comp: "Protocolos Clínicos e PEP", score: "4.8 / 5.0", badge: "Supera Expectativas" },
            { comp: "Comunicação Interdisciplinar", score: "4.5 / 5.0", badge: "Atende Plenamente" }
          ].map((item) => (
            <div key={item.comp} className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800">
              <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{item.comp}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs font-extrabold text-rd-cyan">{item.score}</span>
                <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">{item.badge}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
