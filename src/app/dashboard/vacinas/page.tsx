"use client";

import React from "react";
import { Syringe, ShieldCheck, ThermometerSnowflake, Calendar, Sparkles } from "lucide-react";

export default function VacinasPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20 pt-2">
      {/* Action Bar Superior Compacta - Sem Duplicação de H1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900/90 border-2 border-zinc-200 dark:border-zinc-700/80 px-5 py-3.5 rounded-2xl shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/70 px-3.5 py-1.5 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-rd-cyan animate-pulse mr-2" />
            <p className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
              Controle de Imunobiológicos & Cadeia de Frio (ANVISA)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 cursor-not-allowed opacity-75">
            <Calendar size={14} className="text-rd-cyan" /> Calendário Vacinal (MS)
          </button>
        </div>
      </div>

      {/* Cards de Métricas & Pré-visualização Liquid Glass */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative overflow-hidden bg-white dark:bg-zinc-900/85 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-5 shadow-sm group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-rd-cyan/15 flex items-center justify-center text-rd-cyan border border-rd-cyan/20">
              <ThermometerSnowflake size={20} />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Cadeia de Frio</p>
              <h4 className="text-lg font-bold text-zinc-900 dark:text-white">+4.2°C (Ideal)</h4>
            </div>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Monitoramento contínuo das câmaras de vacinas.</p>
        </div>

        <div className="relative overflow-hidden bg-white dark:bg-zinc-900/85 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-5 shadow-sm group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Lotes Ativos</p>
              <h4 className="text-lg font-bold text-zinc-900 dark:text-white">Rastreabilidade Total</h4>
            </div>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Registro automático de lote, validade e fabricante.</p>
        </div>

        <div className="relative overflow-hidden bg-white dark:bg-zinc-900/85 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-5 shadow-sm group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-500 border border-blue-500/20">
              <Syringe size={20} />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Cartão Digital</p>
              <h4 className="text-lg font-bold text-zinc-900 dark:text-white">Conectado ao PEP</h4>
            </div>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Integração com a caderneta de vacinação do paciente.</p>
        </div>
      </div>

      {/* Painel Central Liquid Glass */}
      <div className="p-12 bg-white dark:bg-zinc-900/85 backdrop-blur-xl rounded-3xl border-2 border-zinc-200 dark:border-zinc-700/80 text-center shadow-md">
        <Syringe size={48} className="mx-auto mb-4 text-rd-cyan opacity-40" />
        <h3 className="font-heading text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
          Módulo de Imunização e Vacinas
        </h3>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-lg mx-auto">
          O controle de frascos multidose, temperaturas de refrigeração e sincronização com o SIPNI (PNI) está em fase final de homologação.
        </p>
      </div>
    </div>
  );
}
