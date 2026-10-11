"use client";

import React from "react";
import { GraduationCap, Award, BookOpen, CheckCircle, Plus, Users, Clock } from "lucide-react";

export default function TreinamentosPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20 pt-2">
      {/* Action Bar Superior Compacta - Sem Duplicação de H1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900/90 border-2 border-zinc-200 dark:border-zinc-700/80 px-5 py-3.5 rounded-2xl shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <GraduationCap className="text-rd-cyan" size={18} />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Treinamentos & Capacitação (LMS)
            </span>
          </div>
          <span className="text-zinc-300 dark:text-zinc-700">|</span>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 border border-primary/20 text-primary">
            Conformidade NR-32 & ONA
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
            94.2% de Adesão Geral
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 bg-rd-cyan text-zinc-950 rounded-xl text-xs font-bold shadow-md shadow-rd-cyan/20 hover:bg-rd-cyan/90 transition-all">
            <Plus size={15} /> Novo Treinamento
          </button>
        </div>
      </div>

      {/* Cards de Métricas Liquid Glass */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative overflow-hidden bg-white dark:bg-zinc-900/85 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-5 shadow-sm group hover:border-rd-cyan/50 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-rd-cyan/15 flex items-center justify-center text-rd-cyan border border-rd-cyan/20">
              <BookOpen size={20} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Cursos Disponíveis</p>
              <h4 className="text-xl font-extrabold text-zinc-900 dark:text-white">18 Módulos</h4>
            </div>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Higienização das Mãos, PCR, Cuidados Paliativos e LGPD na Saúde.</p>
        </div>

        <div className="relative overflow-hidden bg-white dark:bg-zinc-900/85 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-5 shadow-sm group hover:border-emerald-500/50 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
              <Award size={20} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Certificados Válidos</p>
              <h4 className="text-xl font-extrabold text-zinc-900 dark:text-white">310 Emitidos</h4>
            </div>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Emissão automática com QR Code e validação em prontuário profissional.</p>
        </div>

        <div className="relative overflow-hidden bg-white dark:bg-zinc-900/85 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-5 shadow-sm group hover:border-violet-500/50 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center text-violet-500 border border-violet-500/20">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Carga Horária Média</p>
              <h4 className="text-xl font-extrabold text-zinc-900 dark:text-white">4.8h / Mês</h4>
            </div>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Tempo dedicado por colaborador na esteira de educação continuada.</p>
        </div>
      </div>

      {/* Painel Central Liquid Glass */}
      <div className="p-8 bg-white dark:bg-zinc-900/85 backdrop-blur-xl rounded-3xl border-2 border-zinc-200 dark:border-zinc-700/80 text-center shadow-md">
        <GraduationCap size={44} className="mx-auto mb-3 text-rd-cyan opacity-40" />
        <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Gestão de Educação Continuada e Acreditação
        </h3>
        <p className="text-zinc-500 dark:text-zinc-400 text-xs max-w-lg mx-auto mb-6">
          Acompanhamento individual de competências clínicas, reciclagens obrigatórias por setor e controle de pendências para auditorias hospitalares.
        </p>

        {/* Cursos Populares Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto text-left">
          {[
            { title: "NR-32: Riscos Biológicos", status: "100% Conforme", color: "text-emerald-500" },
            { title: "Protocolo Sepse Hospitalar", status: "92% Conforme", color: "text-emerald-500" },
            { title: "Segurança de Dados PEP / LGPD", status: "88% Conforme", color: "text-amber-500" }
          ].map((c) => (
            <div key={c.title} className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800">
              <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{c.title}</p>
              <p className={`text-[11px] font-semibold mt-1 ${c.color}`}>{c.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
