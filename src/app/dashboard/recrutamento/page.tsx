"use client";

import React from "react";
import { UserPlus, Briefcase, FileCheck2, Clock, Sparkles, Filter, ChevronRight, CheckCircle2 } from "lucide-react";

export default function RecrutamentoPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20 pt-2">
      {/* Action Bar Superior Compacta - Sem Duplicação de H1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900/90 border-2 border-zinc-200 dark:border-zinc-700/80 px-5 py-3.5 rounded-2xl shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <UserPlus className="text-rd-cyan" size={18} />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Recrutamento & Seleção (ATS)
            </span>
          </div>
          <span className="text-zinc-300 dark:text-zinc-700">|</span>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 border border-primary/20 text-primary">
            6 Processos Seletivos Ativos
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
            Triagem com IA Integrada
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 bg-rd-cyan text-zinc-950 rounded-xl text-xs font-bold shadow-md shadow-rd-cyan/20 hover:bg-rd-cyan/90 transition-all">
            <UserPlus size={15} /> Nova Vaga
          </button>
        </div>
      </div>

      {/* Cards de Métricas Liquid Glass */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative overflow-hidden bg-white dark:bg-zinc-900/85 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-5 shadow-sm group hover:border-rd-cyan/50 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-rd-cyan/15 flex items-center justify-center text-rd-cyan border border-rd-cyan/20">
              <Briefcase size={20} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Vagas Abertas</p>
              <h4 className="text-xl font-extrabold text-zinc-900 dark:text-white">6 Vagas</h4>
            </div>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">UTI Adulto, Clínica Médica e Farmácia Hospitalar.</p>
        </div>

        <div className="relative overflow-hidden bg-white dark:bg-zinc-900/85 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-5 shadow-sm group hover:border-emerald-500/50 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
              <FileCheck2 size={20} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Banco de Talentos</p>
              <h4 className="text-xl font-extrabold text-zinc-900 dark:text-white">142 Currículos</h4>
            </div>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Classificação automática por especialidade e registro CRM/COREN.</p>
        </div>

        <div className="relative overflow-hidden bg-white dark:bg-zinc-900/85 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-5 shadow-sm group hover:border-violet-500/50 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center text-violet-500 border border-violet-500/20">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">SLA Médio de Admissão</p>
              <h4 className="text-xl font-extrabold text-zinc-900 dark:text-white">12 Dias</h4>
            </div>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Da abertura da requisição até a admissão no eSocial.</p>
        </div>
      </div>

      {/* Painel Central Liquid Glass */}
      <div className="p-8 bg-white dark:bg-zinc-900/85 backdrop-blur-xl rounded-3xl border-2 border-zinc-200 dark:border-zinc-700/80 text-center shadow-md">
        <UserPlus size={44} className="mx-auto mb-3 text-rd-cyan opacity-40" />
        <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Pipeline de Candidaturas e Seleção
        </h3>
        <p className="text-zinc-500 dark:text-zinc-400 text-xs max-w-lg mx-auto mb-6">
          Kanban interativo para avanço de candidatos entre Triagem, Entrevista com Coordenação, Parecer Psicológico e Exame Admissional.
        </p>

        {/* Steps Preview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
          {["1. Inscrições", "2. Triagem IA", "3. Entrevistas", "4. Admissão"].map((step, i) => (
            <div key={step} className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 text-center">
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">{step}</p>
              <p className="text-xs text-zinc-400 mt-1">{i === 1 ? "18 avaliados" : i === 0 ? "42 inscritos" : i === 2 ? "6 agendados" : "2 aprovados"}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
