"use client";

import React, { useState } from "react";
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Plus, 
  ChevronRight,
  Syringe,
  Check,
  Send,
  MessageCircle,
  FileText,
  BadgeCheck,
  CalendarCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface SessionStep {
  id: number;
  sessionNumber: number;
  title: string;
  targetDays: string;
  expectedDate: string;
  status: "completed" | "scheduled" | "pending";
  procedureType: "Botox" | "Revisão / Retoque" | "Bioestimulador" | "Preenchimento" | "Skinbooster";
  unitsOrMl: string;
  pointsApplied: string[];
  notes: string;
  retouchNeeded?: boolean;
}

const INITIAL_SESSIONS: SessionStep[] = [
  {
    id: 1,
    sessionNumber: 1,
    title: "Aplicação de Toxina Botulínica — Terço Superior",
    targetDays: "Dia 0",
    expectedDate: "24 Out, 2026",
    status: "completed",
    procedureType: "Botox",
    unitsOrMl: "50 Unidades",
    pointsApplied: ["Frontal (16U)", "Glabela / Prócero (20U)", "Orbicular dos Olhos (14U)"],
    notes: "Aplicação realizada conforme mapeamento facial com foto frontal. Paciente tolerou bem sem intercorrências.",
    retouchNeeded: false,
  },
  {
    id: 2,
    sessionNumber: 2,
    title: "Sessão de Revisão e Retoque (15 Dias)",
    targetDays: "Dia +15",
    expectedDate: "08 Nov, 2026",
    status: "scheduled",
    procedureType: "Revisão / Retoque",
    unitsOrMl: "Até 6 Unidades de Retoque",
    pointsApplied: ["Avaliação do músculo frontal e assimetria de cauda de sobrancelha"],
    notes: "Sessão de retorno obrigatória para avaliar bloqueio motor pleno e simetria do sorriso e piscar.",
    retouchNeeded: true,
  },
  {
    id: 3,
    sessionNumber: 3,
    title: "Bioestimulador de Colágeno (Radiesse / Sculptra)",
    targetDays: "Dia +30",
    expectedDate: "23 Nov, 2026",
    status: "pending",
    procedureType: "Bioestimulador",
    unitsOrMl: "1 Frasco / Seringa",
    pointsApplied: ["Região Malar e Ângulo Mandibular bilateral"],
    notes: "Estímulo da neocolegênese e firmeza dérmica. Protocolo de manutenção anual.",
    retouchNeeded: false,
  },
];

export function AestheticProtocolTimeline() {
  const [sessions, setSessions] = useState<SessionStep[]>(INITIAL_SESSIONS);
  const [selectedSessionId, setSelectedSessionId] = useState<number>(1);
  const [showAddModal, setShowAddModal] = useState(false);

  // Formulário nova sessão
  const [newTitle, setNewTitle] = useState("");
  const [newProcedure, setNewProcedure] = useState<SessionStep["procedureType"]>("Skinbooster");
  const [newDate, setNewDate] = useState("");
  const [newUnits, setNewUnits] = useState("");
  const [newNotes, setNewNotes] = useState("");

  const currentSession = sessions.find((s) => s.id === selectedSessionId) || sessions[0];

  const toggleSessionStatus = (id: number) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const nextStatus = s.status === "completed" ? "scheduled" : s.status === "scheduled" ? "completed" : "scheduled";
        return { ...s, status: nextStatus };
      })
    );
  };

  const handleAddSession = () => {
    if (!newTitle.trim()) return;
    const nextNum = sessions.length + 1;
    const newSessionItem: SessionStep = {
      id: Date.now(),
      sessionNumber: nextNum,
      title: newTitle,
      targetDays: `Sessão ${nextNum}`,
      expectedDate: newDate || "A definir",
      status: "scheduled",
      procedureType: newProcedure,
      unitsOrMl: newUnits || "1 sessão",
      pointsApplied: ["Conforme planejamento clínico"],
      notes: newNotes || "Agendado via MedCore Protocolos.",
    };
    setSessions((prev) => [...prev, newSessionItem]);
    setSelectedSessionId(newSessionItem.id);
    setShowAddModal(false);
    setNewTitle("");
    setNewNotes("");
  };

  const handleWhatsAppReminder = (session: SessionStep) => {
    const text = encodeURIComponent(
      `Olá! Lembramos da sua sessão de retorno estético no MedCore:\n\n*${session.title}*\nData prevista: ${session.expectedDate}\nStatus: Confirmado.\n\nQualquer dúvida, responda a esta mensagem!`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Header com Resumo e Ação */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-rd-cyan/10 border border-rd-cyan/20 flex items-center justify-center text-rd-cyan">
            <Syringe className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-bold text-lg text-white">Cronograma & Protocolo de Injetáveis</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Retorno de 15 Dias Ativo
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Acompanhamento de evolução temporal, retoques programados e garantia de resultados.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-wider transition-all border border-zinc-700 hover:border-zinc-600"
        >
          <Plus className="h-4 w-4 text-rd-cyan" />
          Nova Sessão
        </button>
      </div>

      {/* Grid Principal: Timeline à Esquerda e Detalhes da Sessão à Direita */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Coluna da Timeline (Lista de Sessões) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
            <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 block mb-3">
              Linha do Tempo do Paciente
            </span>

            <div className="space-y-3 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-zinc-800">
              {sessions.map((session, index) => {
                const isSelected = session.id === selectedSessionId;
                const isCompleted = session.status === "completed";
                const isScheduled = session.status === "scheduled";

                return (
                  <div
                    key={session.id}
                    onClick={() => setSelectedSessionId(session.id)}
                    className={cn(
                      "relative flex items-start gap-4 p-3.5 rounded-xl border transition-all cursor-pointer group text-left",
                      isSelected
                        ? "bg-zinc-900 border-rd-cyan/50 shadow-md shadow-rd-cyan/5"
                        : "bg-zinc-950/40 border-zinc-800/80 hover:bg-zinc-900/60 hover:border-zinc-700"
                    )}
                  >
                    {/* Badge do Status / Bolinha */}
                    <div
                      className={cn(
                        "h-8 w-8 rounded-full border-2 flex items-center justify-center font-bold text-xs shrink-0 z-10 transition-transform group-hover:scale-105",
                        isCompleted
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                          : isScheduled
                          ? "bg-rd-cyan/20 border-rd-cyan text-rd-cyan"
                          : "bg-zinc-900 border-zinc-700 text-zinc-500"
                      )}
                    >
                      {isCompleted ? <Check className="h-4 w-4" /> : session.sessionNumber}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rd-cyan">
                          {session.targetDays}
                        </span>
                        <span
                          className={cn(
                            "text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded",
                            isCompleted
                              ? "bg-emerald-500/10 text-emerald-400"
                              : isScheduled
                              ? "bg-amber-500/10 text-amber-400"
                              : "bg-zinc-800 text-zinc-400"
                          )}
                        >
                          {isCompleted ? "Concluído" : isScheduled ? "Agendado" : "Pendente"}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-zinc-100 truncate mt-1">
                        {session.title}
                      </h4>
                      <p className="text-[11px] text-zinc-400 flex items-center gap-1.5 mt-0.5">
                        <Calendar className="h-3 w-3 text-zinc-500" />
                        {session.expectedDate}
                      </p>
                    </div>

                    <ChevronRight
                      className={cn(
                        "h-4 w-4 self-center transition-transform",
                        isSelected ? "text-rd-cyan translate-x-1" : "text-zinc-600"
                      )}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card Dica Retorno de 15 Dias */}
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400 space-y-2">
            <div className="flex items-center gap-2 text-rd-cyan font-bold text-xs uppercase tracking-wider">
              <BadgeCheck className="h-4 w-4" />
              Retoque de Segurança 15 Dias
            </div>
            <p className="leading-relaxed text-[11px]">
              O pico de ação da toxina botulínica ocorre entre o 10º e 14º dia. A consulta de retorno aos 15 dias previne queixas de assimetria e fideliza o paciente.
            </p>
          </div>
        </div>

        {/* Coluna da Direita: Detalhes da Sessão Selecionada */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-6">
            
            {/* Header da Sessão */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rd-cyan/10 text-rd-cyan border border-rd-cyan/20">
                    Sessão {currentSession.sessionNumber}
                  </span>
                  <span className="text-xs text-zinc-400 font-medium">
                    Data: <strong className="text-zinc-200">{currentSession.expectedDate}</strong>
                  </span>
                </div>
                <h3 className="font-heading font-bold text-lg text-white mt-1">
                  {currentSession.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSessionStatus(currentSession.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
                    currentSession.status === "completed"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
                      : "bg-rd-cyan text-zinc-950 hover:bg-rd-cyan/90 font-bold"
                  )}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {currentSession.status === "completed" ? "Marcar como Aberta" : "Concluir Sessão"}
                </button>

                <button
                  onClick={() => handleWhatsAppReminder(currentSession)}
                  title="Enviar lembrete via WhatsApp"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/30 text-xs font-bold transition-all"
                >
                  <MessageCircle className="h-4 w-4" />
                  Lembrete WhatsApp
                </button>
              </div>
            </div>

            {/* Grid de Metadados Clínicos da Sessão */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">
                  Procedimento / Fármaco
                </span>
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <Syringe className="h-4 w-4 text-rd-cyan" />
                  {currentSession.procedureType}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">
                  Dosagem / Volume Aplicado
                </span>
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  {currentSession.unitsOrMl}
                </span>
              </div>
            </div>

            {/* Pontos de Aplicação */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Áreas Anatômicas & Pontos Injetados
              </label>
              <div className="flex flex-wrap gap-2">
                {currentSession.pointsApplied.map((pt, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-lg bg-zinc-950/80 border border-zinc-800 text-xs text-zinc-200 font-medium flex items-center gap-1.5"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-rd-cyan" />
                    {pt}
                  </span>
                ))}
              </div>
            </div>

            {/* Evolução Clínica / Observações da Sessão */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Observações Clínicas & Conduta Registrada
              </label>
              <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 text-sm text-zinc-300 leading-relaxed font-sans min-h-[90px]">
                {currentSession.notes || "Nenhuma observação registrada para esta sessão."}
              </div>
            </div>

            {/* Alerta de Retoque de 15 Dias */}
            {currentSession.retouchNeeded && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-zinc-300">
                  <span className="font-bold text-amber-300 block mb-0.5">
                    Protocolo de Retoque em 15 Dias
                  </span>
                  Caso haja necessidade de retoque, aplicar no máximo até 21 dias da primeira aplicação para evitar efeito vacina (produção de anticorpos neutralizantes anti-toxina).
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Adicionar Sessão */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
              <h4 className="font-heading font-bold text-base text-white">Adicionar Nova Sessão ao Protocolo</h4>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-zinc-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Título da Sessão
                </label>
                <input
                  type="text"
                  placeholder="Ex: Aplicação de Fios de PDO / Retoque"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-rd-cyan"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Tipo do Procedimento
                  </label>
                  <select
                    value={newProcedure}
                    onChange={(e) => setNewProcedure(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-rd-cyan cursor-pointer"
                  >
                    <option value="Botox">Botox</option>
                    <option value="Revisão / Retoque">Revisão / Retoque (15d)</option>
                    <option value="Bioestimulador">Bioestimulador</option>
                    <option value="Preenchimento">Preenchimento HA</option>
                    <option value="Skinbooster">Skinbooster</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Data Prevista
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 10 Nov, 2026"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-rd-cyan"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Volume / Unidades Planejadas
                </label>
                <input
                  type="text"
                  placeholder="Ex: 2 Seringas / 4 Fios"
                  value={newUnits}
                  onChange={(e) => setNewUnits(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-rd-cyan"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Observações Iniciais
                </label>
                <textarea
                  rows={2}
                  placeholder="Instruções para a equipe ou paciente..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-rd-cyan resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddSession}
                className="px-5 py-2 rounded-xl bg-rd-cyan text-zinc-950 font-bold text-xs uppercase tracking-wider hover:bg-rd-cyan/90"
              >
                Salvar Sessão
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
