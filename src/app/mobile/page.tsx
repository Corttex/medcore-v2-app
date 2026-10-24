"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Users, 
  Stethoscope, 
  Briefcase, 
  Crown, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  DollarSign, 
  BrainCircuit, 
  Mic, 
  FileText, 
  Activity, 
  ChevronRight, 
  ArrowLeft, 
  Sparkles,
  PhoneCall,
  Bell
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

type PerfilMobile = "auxiliar" | "medico" | "gestor" | "proprietario";

export default function MobileAppPage() {
  const { theme } = useTheme();
  const [selectedPerfil, setSelectedPerfil] = useState<PerfilMobile>("auxiliar");
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);

  return (
    <div className={`min-h-screen max-w-md mx-auto flex flex-col ${
      theme === 'dark' ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-900'
    } shadow-2xl border-x border-zinc-200 dark:border-zinc-800`}>
      
      {/* ─── Top App Bar ─── */}
      <header className={`px-5 py-3.5 sticky top-0 z-40 backdrop-blur-xl border-b flex items-center justify-between ${
        theme === 'dark' ? 'bg-zinc-950/90 border-zinc-800' : 'bg-white/90 border-zinc-200'
      }`}>
        <div className="flex items-center gap-2.5">
          <Link href="/dashboard" className="p-1.5 rounded-xl hover:bg-surface-container transition-colors">
            <ArrowLeft size={18} className="text-on-surface-variant" />
          </Link>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h1 className="text-sm font-heading font-bold tracking-tight">MedCore Mobile</h1>
            </div>
            <p className="text-[10px] text-on-surface-variant">Operação Rápida da Clínica</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-heading font-bold bg-rd-cyan/15 text-rd-cyan border border-rd-cyan/30 uppercase">
            PWA
          </span>
          <button className="p-2 rounded-xl text-on-surface-variant hover:text-rd-cyan">
            <Bell size={18} />
          </button>
        </div>
      </header>

      {/* ─── Seletor de Perfil (Auxiliar, Médico, Gestor, Proprietário) ─── */}
      <div className="p-4 border-b border-outline-variant/30 overflow-x-auto no-scrollbar">
        <p className="text-[10px] font-heading font-bold uppercase tracking-wider text-on-surface-variant mb-2">
          Modo de Operação por Perfil:
        </p>
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { id: "auxiliar", label: "Recepção", icon: Users },
            { id: "medico", label: "Médico", icon: Stethoscope },
            { id: "gestor", label: "Gestor", icon: Briefcase },
            { id: "proprietario", label: "Dono", icon: Crown },
          ].map((item) => {
            const isSelected = selectedPerfil === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedPerfil(item.id as PerfilMobile)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border text-center transition-all ${
                  isSelected
                    ? 'bg-rd-cyan text-zinc-950 font-bold border-rd-cyan shadow-sm scale-102'
                    : 'bg-surface-container-low border-outline-variant/40 text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <Icon size={18} className="mb-1" />
                <span className="text-[11px] font-heading leading-none truncate w-full">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Conteúdo Dinâmico por Perfil ─── */}
      <main className="flex-1 p-4 space-y-4 overflow-y-auto pb-24">
        
        {/* 1. VISÃO RECEPÇÃO / AUXILIAR */}
        {selectedPerfil === "auxiliar" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-rd-cyan/15 to-indigo-600/10 border border-rd-cyan/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-heading font-bold uppercase text-rd-cyan">Dra. Conte Assistente</p>
                  <h3 className="text-sm font-bold text-on-surface mt-0.5">Rotina da Recepção Ativa</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 font-bold">94% Meta</span>
              </div>
              <p className="text-xs text-on-surface-variant mt-2">
                4 pacientes a caminho • 2 confirmações pendentes no WhatsApp.
              </p>
            </div>

            {/* Próximos Pacientes */}
            <div className="space-y-2">
              <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-on-surface-variant">
                Próximos a Chegar
              </h4>
              {[
                { nome: "Carlos Eduardo Silva", horario: "14:30", sala: "Consultório 02", status: "Confirmado WhatsApp" },
                { nome: "Beatriz Helena Costa", horario: "14:45", sala: "Consultório 01", status: "Chegou na Recepção" },
                { nome: "Lucas Mendes Santos", horario: "15:00", sala: "Exames Lab", status: "Aguardando Confirmação" }
              ].map((paciente, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-outline-variant/40 bg-surface-container-low flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-on-surface">{paciente.nome}</p>
                    <p className="text-[11px] text-on-surface-variant mt-0.5 flex items-center gap-2">
                      <Clock size={12} /> {paciente.horario} • {paciente.sala}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    paciente.status.includes("Chegou") ? "bg-emerald-500/20 text-emerald-400" : "bg-rd-cyan/15 text-rd-cyan"
                  }`}>
                    {paciente.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Ações Rápidas */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link href="/dashboard/agenda" className="p-3 rounded-xl bg-surface-container text-center border border-outline-variant/40 text-xs font-heading font-semibold hover:border-rd-cyan">
                Abrir Agenda Completa
              </Link>
              <Link href="/dashboard/carreira" className="p-3 rounded-xl bg-rd-cyan/15 text-rd-cyan text-center border border-rd-cyan/30 text-xs font-heading font-bold hover:bg-rd-cyan/20">
                Minhas Metas & KPIs
              </Link>
            </div>
          </div>
        )}

        {/* 2. VISÃO MÉDICO */}
        {selectedPerfil === "medico" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Acionamento de Voz Dra. Conte Medical AI */}
            <div className="p-5 rounded-2xl border-2 border-rd-cyan/40 bg-gradient-to-br from-rd-cyan/20 via-indigo-950/40 to-surface text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-rd-cyan text-zinc-950 flex items-center justify-center shadow-lg shadow-rd-cyan/30">
                <BrainCircuit size={24} />
              </div>
              <div>
                <h3 className="text-sm font-heading font-bold text-on-surface">Dra. Conte Medical AI</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">Escuta da consulta & Preenchimento SOAP</p>
              </div>
              <button
                onClick={() => setIsRecordingVoice(!isRecordingVoice)}
                className={`w-full py-3 rounded-xl font-heading text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  isRecordingVoice 
                    ? "bg-rose-500 text-white animate-pulse" 
                    : "bg-rd-cyan text-zinc-950 hover:bg-rd-cyan/90"
                }`}
              >
                <Mic size={16} /> {isRecordingVoice ? "Gravando Consulta (Clique p/ Finalizar)" : "Iniciar Escuta Inteligente"}
              </button>
            </div>

            {/* Consultas do Dia */}
            <div className="space-y-2">
              <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-on-surface-variant">
                Grade de Consultas de Hoje (8 agendadas)
              </h4>
              {[
                { nome: "Fernanda Lima", motivo: "Retorno Dermatologia", horario: "14:00", pronto: true },
                { nome: "Juliana Rocha", motivo: "Procedimento Estético Facial", horario: "15:00", pronto: false },
                { nome: "Marcos Paulo", motivo: "Primeira Consulta", horario: "15:45", pronto: false },
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-outline-variant/40 bg-surface-container-low flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-on-surface">{item.nome}</p>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">{item.motivo}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-rd-cyan">{item.horario}</span>
                    <p className="text-[10px] text-emerald-500 font-semibold">{item.pronto ? "Prontuário Pronto" : "Na Fila"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. VISÃO GESTOR */}
        {selectedPerfil === "gestor" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/40">
                <span className="text-[10px] font-heading uppercase text-on-surface-variant">Taxa de Ocupação</span>
                <p className="text-xl font-bold text-emerald-500 mt-1">91.4%</p>
                <p className="text-[10px] text-on-surface-variant">Salas em uso</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/40">
                <span className="text-[10px] font-heading uppercase text-on-surface-variant">Tempo de Espera</span>
                <p className="text-xl font-bold text-rd-cyan mt-1">11 min</p>
                <p className="text-[10px] text-on-surface-variant">Média da recepção</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/40 space-y-3">
              <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-on-surface flex items-center justify-between">
                <span>Alertas da Equipe Hoje</span>
                <span className="text-amber-500 text-[10px]">2 Requerem Atenção</span>
              </h4>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
                  ⚠️ Ponto: 1 colaborador sem registro de entrada na Unidade 02.
                </div>
                <div className="p-2.5 rounded-xl bg-rd-cyan/10 border border-rd-cyan/20 text-rd-cyan">
                  ℹ️ Estoque: 5 unidades de toxina botulínica atingiram ponto de reposição.
                </div>
              </div>
            </div>

            <Link href="/dashboard/demandas" className="w-full py-3 rounded-xl bg-surface-container text-center border border-outline-variant/50 text-xs font-heading font-bold block">
              Gerenciar Demandas & Equipes
            </Link>
          </div>
        )}

        {/* 4. VISÃO PROPRIETÁRIO */}
        {selectedPerfil === "proprietario" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Card Faturamento do Dia */}
            <div className="p-5 rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 to-transparent space-y-2">
              <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-emerald-500">
                Faturamento Realizado Hoje
              </span>
              <p className="text-2xl font-bold text-on-surface">R$ 28.450,00</p>
              <div className="flex items-center gap-2 text-xs text-emerald-500 font-semibold">
                <TrendingUp size={14} /> +18.4% em relação à última semana
              </div>
            </div>

            {/* Resumo Executivo Dra. Conte */}
            <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/40 space-y-2">
              <div className="flex items-center gap-2 text-xs font-heading font-bold text-rd-cyan">
                <BrainCircuit size={16} /> Resumo Executivo Dra. Conte
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Todas as 3 salas cirúrgicas operando em capacidade ideal. A taxa de no-show caiu para 6.2% graças ao disparo matinal ativo. Repasses médicos do ciclo estão pré-calculados.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs font-heading font-semibold">
              <Link href="/dashboard/relatorios" className="p-3 rounded-xl bg-surface-container border border-outline-variant/40">
                BI & Indicadores
              </Link>
              <Link href="/dashboard/contas" className="p-3 rounded-xl bg-surface-container border border-outline-variant/40">
                Caixa & Contas
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* ─── Bottom Navigation ─── */}
      <nav className={`p-3 border-t fixed bottom-0 left-0 right-0 max-w-md mx-auto backdrop-blur-xl flex items-center justify-around z-50 ${
        theme === 'dark' ? 'bg-zinc-950/95 border-zinc-800' : 'bg-white/95 border-zinc-200'
      }`}>
        <Link href="/dashboard" className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-rd-cyan">
          <Activity size={18} />
          <span className="text-[10px] font-heading font-semibold">Painel Web</span>
        </Link>
        <Link href="/dashboard/agenda" className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-rd-cyan">
          <Calendar size={18} />
          <span className="text-[10px] font-heading font-semibold">Agenda</span>
        </Link>
        <Link href="/dashboard/ia-executiva" className="flex flex-col items-center gap-1 text-rd-cyan font-bold">
          <div className="w-10 h-10 -mt-5 rounded-2xl bg-rd-cyan text-zinc-950 flex items-center justify-center shadow-lg shadow-rd-cyan/30">
            <BrainCircuit size={20} />
          </div>
          <span className="text-[10px] font-heading font-bold">Dra. Conte</span>
        </Link>
        <Link href="/dashboard/pacientes" className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-rd-cyan">
          <Users size={18} />
          <span className="text-[10px] font-heading font-semibold">Pacientes</span>
        </Link>
        <Link href="/dashboard/carreira" className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-rd-cyan">
          <Sparkles size={18} />
          <span className="text-[10px] font-heading font-semibold">Carreira</span>
        </Link>
      </nav>
    </div>
  );
}
