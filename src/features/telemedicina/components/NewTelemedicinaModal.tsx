"use client";

import React, { useState } from "react";
import { X, Calendar, Clock, User, Phone, Mail, FileText, Check, ShieldCheck, Sparkles } from "lucide-react";
import { Teleconsulta } from "../types";

interface NewTelemedicinaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (newConsulta: Teleconsulta) => void;
}

// Funções oficiais de máscara do MEDCORE_DESIGN_SYSTEM.md
const maskCpf = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .substring(0, 14);
};

const maskPhone = (value: string) => {
  let v = value.replace(/\D/g, "");
  if (v.length > 11) v = v.slice(0, 11);

  if (v.length <= 10) {
    // Fixo: (XX) XXXX-XXXX
    v = v.replace(/^(\d{2})(\d)/, "($1) $2");
    v = v.replace(/(\d{4})(\d)/, "$1-$2");
  } else {
    // Celular: (XX) XXXXX-XXXX
    v = v.replace(/^(\d{2})(\d)/, "($1) $2");
    v = v.replace(/(\d{5})(\d)/, "$1-$2");
  }
  return v;
};

export function NewTelemedicinaModal({
  isOpen,
  onClose,
  onCreated,
}: NewTelemedicinaModalProps) {
  const [pacienteNome, setPacienteNome] = useState("");
  const [pacienteCpf, setPacienteCpf] = useState("");
  const [pacienteTelefone, setPacienteTelefone] = useState("");
  const [pacienteEmail, setPacienteEmail] = useState("");
  const [convenioNome, setConvenioNome] = useState("Particular");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("14:00");
  const [duration, setDuration] = useState("30");
  const [description, setDescription] = useState("");
  const [sendWhatsAppImmediate, setSendWhatsAppImmediate] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pacienteNome.trim()) {
      alert("Por favor, preencha o nome do paciente.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/telemedicina", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pacienteNome: pacienteNome.trim(),
          pacienteCpf: pacienteCpf ? maskCpf(pacienteCpf) : undefined,
          pacienteTelefone: pacienteTelefone ? maskPhone(pacienteTelefone) : undefined,
          pacienteEmail: pacienteEmail ? pacienteEmail.toLowerCase().trim() : undefined,
          date,
          time,
          duration: Number(duration),
          description: description.trim() || "Consulta online por videoconferência",
          title: `Teleconsulta - ${pacienteNome.trim()}`,
        }),
      });

      if (res.ok) {
        const created = await res.json();
        onCreated(created);

        // Se marcou para enviar WhatsApp de imediato
        if (sendWhatsAppImmediate && pacienteTelefone) {
          const rawPhone = pacienteTelefone.replace(/\D/g, "");
          const origin = typeof window !== "undefined" ? window.location.origin : "https://medcore.gestaocomercial360.com.br";
          const link = created.link || `${origin}/telemedicina/${created.tokenPublico}`;
          const message = encodeURIComponent(
            `Olá ${pacienteNome}, sua teleconsulta foi agendada para ${date} às ${time}.\n\nAcesse o link abaixo pelo seu celular ou computador no horário da consulta:\n${link}`
          );
          window.open(`https://api.whatsapp.com/send?phone=55${rawPhone}&text=${message}`, "_blank");
        }

        onClose();
      } else {
        const err = await res.json();
        alert(err.error || "Erro ao agendar teleconsulta.");
      }
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      alert("Ocorreu um erro ao conectar com o servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeSlots = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="
          relative w-full max-w-xl overflow-hidden
          bg-white dark:bg-zinc-900/95
          backdrop-blur-2xl
          border-2 border-zinc-200 dark:border-zinc-700
          rounded-3xl shadow-2xl p-6 sm:p-7
          animate-in zoom-in-95 duration-200
        "
      >
        {/* Header do Modal */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rd-cyan/15 border border-rd-cyan/30 flex items-center justify-center text-rd-cyan">
              <Calendar size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                Agendar Nova Teleconsulta
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Gera um link seguro e sala de espera virtual instantânea
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Formulário com Máscaras */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Dados do Paciente */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Nome do Paciente *
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={15} />
              <input
                type="text"
                required
                value={pacienteNome}
                onChange={(e) => setPacienteNome(e.target.value)}
                placeholder="Ex: Ana Clara Ribeiro"
                className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-500 focus:outline-none focus:border-rd-cyan font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* CPF com Máscara */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                CPF
              </label>
              <input
                type="text"
                value={pacienteCpf}
                onChange={(e) => setPacienteCpf(maskCpf(e.target.value))}
                placeholder="000.000.000-00"
                maxLength={14}
                className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-500 focus:outline-none focus:border-rd-cyan font-mono"
              />
            </div>

            {/* Celular / WhatsApp com Máscara Dinâmica */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                WhatsApp / Celular *
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={15} />
                <input
                  type="text"
                  required
                  value={pacienteTelefone}
                  onChange={(e) => setPacienteTelefone(maskPhone(e.target.value))}
                  placeholder="(11) 99999-9999"
                  maxLength={15}
                  className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-500 focus:outline-none focus:border-rd-cyan font-mono"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* E-mail com toLowerCase */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={15} />
                <input
                  type="email"
                  value={pacienteEmail}
                  onChange={(e) => setPacienteEmail(e.target.value.toLowerCase().trim())}
                  placeholder="paciente@email.com"
                  className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-500 focus:outline-none focus:border-rd-cyan font-medium"
                />
              </div>
            </div>

            {/* Convênio / Tipo */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Convênio
              </label>
              <select
                value={convenioNome}
                onChange={(e) => setConvenioNome(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-rd-cyan font-medium"
              >
                <option value="Particular">Particular</option>
                <option value="Unimed">Unimed Seguros</option>
                <option value="Bradesco Saúde">Bradesco Saúde</option>
                <option value="Amil">Amil Saúde</option>
                <option value="SulAmérica">SulAmérica</option>
              </select>
            </div>
          </div>

          {/* Data e Horário */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Data *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-rd-cyan font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Horário *
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-rd-cyan font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Duração
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-rd-cyan font-medium"
              >
                <option value="15">15 minutos</option>
                <option value="30">30 minutos</option>
                <option value="45">45 minutos</option>
                <option value="60">60 minutos</option>
              </select>
            </div>
          </div>

          {/* Horários rápidos */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-zinc-400 font-medium mr-1">Sugestões:</span>
            {timeSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setTime(slot)}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-colors ${time === slot ? 'bg-rd-cyan text-zinc-950' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}
              >
                {slot}
              </button>
            ))}
          </div>

          {/* Motivo / Queixa Principal */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Motivo ou Queixa Inicial
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Consulta de retorno para análise de exames e ajuste de dosagem."
              className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-500 focus:outline-none focus:border-rd-cyan font-medium resize-none"
            />
          </div>

          {/* Checkbox de Envio de WhatsApp Automático */}
          <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Phone size={15} />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-900 dark:text-white">
                  Disparar link via WhatsApp após criar
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Abre o WhatsApp com a mensagem e o link seguro já prontos
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={sendWhatsAppImmediate}
              onChange={(e) => setSendWhatsAppImmediate(e.target.checked)}
              className="w-4 h-4 rounded text-rd-cyan accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Botões do Rodapé */}
          <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Gerando Sala...</span>
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  <span>Agendar & Criar Sala</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
