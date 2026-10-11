"use client";

import React, { useState } from "react";
import { 
  Video, 
  Clock, 
  Phone, 
  Mail, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  User, 
  AlertCircle, 
  Radio, 
  MoreVertical,
  Trash2,
  FileText
} from "lucide-react";
import { Teleconsulta } from "../types";

interface TelemedicinaCardProps {
  consulta: Teleconsulta;
  onEnterRoom: (consulta: Teleconsulta) => void;
  onStatusChange: (id: string, newStatus: Teleconsulta["status"]) => void;
  onDelete: (id: string) => void;
}

export function TelemedicinaCard({
  consulta,
  onEnterRoom,
  onStatusChange,
  onDelete,
}: TelemedicinaCardProps) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const getPatientInitials = (name?: string) => {
    if (!name) return "P";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleCopyLink = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://medcore.gestaocomercial360.com.br";
    const fullLink = `${origin}/telemedicina/${consulta.tokenPublico}`;
    navigator.clipboard.writeText(fullLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendWhatsApp = () => {
    if (!consulta.paciente?.telefone) {
      alert("Este paciente não possui telefone cadastrado.");
      return;
    }
    const rawPhone = consulta.paciente.telefone.replace(/\D/g, "");
    const origin = typeof window !== "undefined" ? window.location.origin : "https://medcore.gestaocomercial360.com.br";
    const link = `${origin}/telemedicina/${consulta.tokenPublico}`;
    const message = encodeURIComponent(
      `Olá ${consulta.paciente.nome}, sua teleconsulta no MedCore está agendada para hoje às ${consulta.time}.\n\nPara acessar a sala de videoconferência pelo seu celular ou computador sem precisar instalar nada, clique no link abaixo:\n${link}\n\nPor favor, entre 5 minutos antes para testar seu áudio e vídeo.`
    );
    window.open(`https://api.whatsapp.com/send?phone=55${rawPhone}&text=${message}`, "_blank");
  };

  // Badges e Estilos Semânticos de Status
  const statusConfig = {
    sala_espera: {
      label: "Paciente na Sala de Espera",
      className: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30 animate-pulse font-bold",
      pulse: true,
    },
    agendado: {
      label: "Agendado",
      className: "text-rd-cyan bg-rd-cyan/10 border-rd-cyan/25 font-semibold",
      pulse: false,
    },
    em_andamento: {
      label: "Em Andamento",
      className: "text-amber-400 bg-amber-500/10 border-amber-500/30 font-bold",
      pulse: true,
    },
    concluido: {
      label: "Concluído",
      className: "text-zinc-400 bg-zinc-800/60 border-zinc-700/60 font-medium",
      pulse: false,
    },
    cancelado: {
      label: "Cancelado",
      className: "text-rose-400 bg-rose-500/10 border-rose-500/20 font-medium",
      pulse: false,
    },
  }[consulta.status] || {
    label: consulta.status,
    className: "text-zinc-400 bg-zinc-800 border-zinc-700",
    pulse: false,
  };

  const isWaitingRoom = consulta.status === "sala_espera";
  const isInProgress = consulta.status === "em_andamento";

  return (
    <div
      className={`
        relative overflow-hidden
        bg-white dark:bg-zinc-900/85
        backdrop-blur-xl
        border-2 ${isWaitingRoom ? 'border-emerald-500/60 shadow-lg shadow-emerald-500/5' : 'border-zinc-200 dark:border-zinc-700/80'}
        rounded-2xl p-5
        shadow-sm hover:shadow-xl hover:shadow-rd-cyan/5
        hover:border-rd-cyan/50
        transition-all duration-300 group
      `}
    >
      {/* Gradiente sutil interno para profundidade Liquid Glass */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />

      {/* Topo do Card: Horário, Duração e Status */}
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700/70 text-zinc-900 dark:text-white font-black text-sm">
            <Clock size={14} className="text-rd-cyan" />
            <span>{consulta.time}</span>
          </div>
          <span className="text-xs font-semibold text-zinc-400">
            {consulta.duration} min
          </span>
        </div>

        {/* Badge de Status Padronizada */}
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] border ${statusConfig.className}`}
          >
            {statusConfig.pulse && (
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
            )}
            {statusConfig.label}
          </span>

          {/* Menu de Opções Rápido */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
            >
              <MoreVertical size={15} />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-1 z-30 animate-in fade-in zoom-in-95">
                {consulta.status !== "cancelado" && consulta.status !== "concluido" && (
                  <button
                    onClick={() => {
                      onStatusChange(consulta.id, "cancelado");
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg flex items-center gap-2 font-medium"
                  >
                    <AlertCircle size={14} /> Cancelar Consulta
                  </button>
                )}
                <button
                  onClick={() => {
                    onDelete(consulta.id);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white rounded-lg flex items-center gap-2 font-medium"
                >
                  <Trash2 size={14} /> Excluir Registro
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Meio: Informações do Paciente */}
      <div className="relative z-10 my-4 flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-md shadow-blue-500/20 shrink-0">
          {getPatientInitials(consulta.paciente?.nome)}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-zinc-900 dark:text-white truncate">
            {consulta.paciente?.nome || "Paciente não identificado"}
          </h4>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            <span>{consulta.paciente?.convenio?.nome || "Particular"}</span>
            {consulta.paciente?.cpf && (
              <>
                <span>•</span>
                <span>CPF: {consulta.paciente.cpf}</span>
              </>
            )}
          </div>
          {consulta.paciente?.telefone && (
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5 font-mono">
              {consulta.paciente.telefone}
            </p>
          )}
        </div>
      </div>

      {/* Descrição / Motivo da Consulta */}
      {consulta.description && (
        <div className="relative z-10 mb-4 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/50 rounded-xl px-3 py-2 text-xs text-zinc-600 dark:text-zinc-300">
          <p className="line-clamp-2 leading-relaxed">
            <span className="font-semibold text-zinc-400">Motivo:</span> {consulta.description}
          </p>
        </div>
      )}

      {/* Rodapé do Card: Ações de Chamada e Compartilhamento */}
      <div className="relative z-10 pt-3 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2">
        {/* Botão de Cópia e WhatsApp */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopyLink}
            title="Copiar link seguro da sala do paciente"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 transition-all"
          >
            {copied ? (
              <>
                <Check size={13} className="text-emerald-400" />
                <span className="text-emerald-400">Copiado!</span>
              </>
            ) : (
              <>
                <Copy size={13} className="text-zinc-400" />
                <span className="hidden sm:inline">Copiar Link</span>
              </>
            )}
          </button>

          <button
            onClick={handleSendWhatsApp}
            title="Disparar convite com link por WhatsApp"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/25 transition-all"
          >
            <Phone size={13} />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>
        </div>

        {/* Botão Primário de Entrada na Sala de Vídeo */}
        {consulta.status !== "cancelado" && (
          <button
            onClick={() => onEnterRoom(consulta)}
            className={`
              flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md
              ${isWaitingRoom 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 shadow-emerald-500/25 animate-bounce' 
                : isInProgress
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950'
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/20 hover:scale-[1.02]'
              }
            `}
          >
            <Video size={15} />
            <span>
              {isWaitingRoom ? "Atender Agora" : isInProgress ? "Retornar à Sala" : "Iniciar Teleconsulta"}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
