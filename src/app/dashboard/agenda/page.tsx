"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  User, 
  Stethoscope, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  X,
  Building,
  Filter,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AgendaPage() {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [convenios, setConvenios] = useState<any[]>([]);
  const [procedimentos, setProcedimentos] = useState<any[]>([]);
  const [medicos, setMedicos] = useState<any[]>([]);
  const [consultorios, setConsultorios] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Data atual YYYY-MM-DD
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);
  const [currentDate, setCurrentDate] = useState(todayStr);
  const [selectedMedico, setSelectedMedico] = useState("");
  const [selectedConsultorio, setSelectedConsultorio] = useState("");
  
  const [form, setForm] = useState({
    pacienteId: "",
    user_id: "",
    convenioId: "",
    procedimentoId: "",
    date: currentDate,
    time: "09:00",
    duration: "60",
    title: "",
    patientToken: ""
  });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSupportData();
  }, []);

  useEffect(() => {
    fetchAgenda();
    setForm(prev => ({ ...prev, date: currentDate }));
  }, [currentDate, selectedMedico, selectedConsultorio]);

  const fetchAgenda = async () => {
    setLoading(true);
    try {
      const url = new URL(`/api/meetings`, window.location.origin);
      url.searchParams.set("date", currentDate);
      if (selectedMedico) url.searchParams.set("medicoId", selectedMedico);
      if (selectedConsultorio) url.searchParams.set("consultorioId", selectedConsultorio);

      const res = await fetch(url.toString());
      if (res.ok) setMeetings(await res.json());
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const fetchSupportData = async () => {
    try {
      const [pRes, cRes, prRes, mRes, consRes] = await Promise.all([
        fetch("/api/pacientes"),
        fetch("/api/convenios"),
        fetch("/api/procedimentos"),
        fetch("/api/users"),
        fetch("/api/consultorios")
      ]);
      if (pRes.ok) setPacientes(await pRes.json());
      if (cRes.ok) setConvenios((await cRes.json()).convenios || []);
      if (prRes.ok) setProcedimentos((await prRes.json()).procedimentos || []);
      if (mRes.ok) setMedicos(await mRes.json());
      if (consRes.ok) setConsultorios(await consRes.json());
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreate = async () => {
    setFormError("");
    setFormSuccess("");
    setSaving(true);
    
    let finalTitle = form.title;
    if (!finalTitle) {
      const p = pacientes.find(x => x.id === form.pacienteId);
      const pr = procedimentos.find(x => x.id === form.procedimentoId);
      finalTitle = `${pr?.nome || 'Consulta'} - ${p?.nome || 'Paciente'}`;
    }

    try {
      const res = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, title: finalTitle })
      });
      const data = await res.json();
      
      if (!res.ok) {
        setFormError(data.error || "Erro ao agendar.");
      } else {
        setFormSuccess("Agendado com sucesso!");
        setTimeout(() => {
          setShowModal(false);
          fetchAgenda();
          setForm({ 
            pacienteId: "", 
            user_id: "", 
            convenioId: "", 
            procedimentoId: "", 
            date: currentDate, 
            time: "09:00", 
            duration: "60", 
            title: "", 
            patientToken: "" 
          });
        }, 1500);
      }
    } catch (e) {
      setFormError("Falha de conexão.");
    }
    setSaving(false);
  };

  // Cálculo da barra de dias da semana ao redor da data selecionada
  const weekDays = useMemo(() => {
    const [y, m, d] = currentDate.split("-").map(Number);
    const curr = new Date(y, m - 1, d);
    const dayOfWeek = curr.getDay(); // 0 (Dom) a 6 (Sab)
    
    // Começar no Domingo da semana atual
    const startSunday = new Date(curr);
    startSunday.setDate(curr.getDate() - dayOfWeek);

    const days = [];
    const nomesSemana = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(startSunday);
      dayDate.setDate(startSunday.getDate() + i);
      const iso = dayDate.toISOString().split("T")[0];
      days.push({
        iso,
        diaMes: dayDate.getDate(),
        nomeSemana: nomesSemana[i],
        isToday: iso === todayStr,
        isSelected: iso === currentDate
      });
    }
    return days;
  }, [currentDate, todayStr]);

  // Avançar / retroceder semana ou dias
  const changeDateByDays = (delta: number) => {
    const [y, m, d] = currentDate.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    dateObj.setDate(dateObj.getDate() + delta);
    setCurrentDate(dateObj.toISOString().split("T")[0]);
  };

  const selectedConvenio = convenios.find(c => c.id === form.convenioId);
  const requiresToken = selectedConvenio?.requiresToken;

  const hours = Array.from({ length: 11 }, (_, i) => i + 8); // 8 to 18

  // Data formatada para cabeçalho
  const formattedFullDate = useMemo(() => {
    const [y, m, d] = currentDate.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }, [currentDate]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      
      {/* Top Header Principal */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5">
              <CalendarIcon size={13} /> Agenda Integrada
            </span>
            {currentDate === todayStr && (
              <span className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-full">
                Hoje
              </span>
            )}
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight capitalize">
            {formattedFullDate}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Gestão operacional de consultas, médicos e salas com confirmação em tempo real.
          </p>
        </div>

        {/* Ações e Botão Novo Agendamento com degradê azul */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => { setFormSuccess(""); setFormError(""); setShowModal(true); }}
            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <Plus size={18} /> Novo Agendamento
          </button>
        </div>
      </div>

      {/* BARRA MODERNA DE SELEÇÃO DE DIAS E FILTROS */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl shadow-sm space-y-4">
        
        {/* Linha dos Dias da Semana Interativos */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Navegação Rápida de Dias */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <button
              onClick={() => changeDateByDays(-7)}
              className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors shrink-0"
              title="Semana anterior"
            >
              <ChevronLeft size={18} />
            </button>

            {weekDays.map((d) => (
              <button
                key={d.iso}
                onClick={() => setCurrentDate(d.iso)}
                className={cn(
                  "flex flex-col items-center justify-center min-w-[56px] sm:min-w-[64px] py-2 px-3 rounded-xl border transition-all text-center shrink-0",
                  d.isSelected
                    ? "bg-gradient-to-b from-blue-600 to-indigo-600 text-white border-blue-600 shadow-md shadow-blue-500/25 scale-105 font-bold"
                    : "bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-blue-500/50 hover:bg-blue-50/40 dark:hover:bg-zinc-800"
                )}
              >
                <span className={cn(
                  "text-[10px] font-bold tracking-wider",
                  d.isSelected ? "text-blue-100" : "text-zinc-600 dark:text-zinc-300"
                )}>
                  {d.nomeSemana}
                </span>
                <span className="text-base font-extrabold leading-none mt-1">
                  {d.diaMes}
                </span>
                {d.isToday && !d.isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1"></span>
                )}
              </button>
            ))}

            <button
              onClick={() => changeDateByDays(7)}
              className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors shrink-0"
              title="Próxima semana"
            >
              <ChevronRight size={18} />
            </button>
            
            {currentDate !== todayStr && (
              <button
                onClick={() => setCurrentDate(todayStr)}
                className="ml-2 px-3 py-2 text-xs font-bold rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/40 dark:hover:text-blue-400 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 transition-all shrink-0"
              >
                Voltar para Hoje
              </button>
            )}
          </div>

          {/* Seletor Específico de Data via Calendário */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <div className="relative flex items-center w-full md:w-auto">
              <CalendarIcon className="absolute left-3 text-blue-600 dark:text-blue-400 pointer-events-none" size={16} />
              <input 
                type="date" 
                value={currentDate} 
                onChange={(e) => setCurrentDate(e.target.value)}
                className="w-full md:w-auto bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700 rounded-xl pl-10 pr-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none text-zinc-900 dark:text-white cursor-pointer hover:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Linha dos Filtros de Médico e Consultório */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 uppercase tracking-wider mr-2">
            <Filter size={13} /> Filtrar por:
          </div>

          <div className="flex-1 sm:flex-initial">
            <select 
              value={selectedConsultorio} 
              onChange={(e) => setSelectedConsultorio(e.target.value)}
              className="w-full sm:w-auto bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none text-zinc-900 dark:text-white cursor-pointer"
            >
              <option value="" className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white">Todos os Consultórios</option>
              {consultorios.map(c => <option key={c.id} value={c.id} className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white">{c.nome}</option>)}
            </select>
          </div>

          <div className="flex-1 sm:flex-initial">
            <select 
              value={selectedMedico} 
              onChange={(e) => setSelectedMedico(e.target.value)}
              className="w-full sm:w-auto bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none text-zinc-900 dark:text-white cursor-pointer"
            >
              <option value="" className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white">Todos os Médicos</option>
              {medicos.map(m => <option key={m.id} value={m.id} className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white">{m.fullName || m.email}</option>)}
            </select>
          </div>

          {(selectedMedico || selectedConsultorio) && (
            <button
              onClick={() => { setSelectedMedico(""); setSelectedConsultorio(""); }}
              className="text-xs text-rose-500 hover:underline font-semibold ml-auto"
            >
              Limpar Filtros
            </button>
          )}
        </div>
      </div>

      {/* Grid de Horários (Visão Diária) */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm flex flex-col">
         {/* Table Header */}
         <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
            <div className="w-24 shrink-0 border-r border-zinc-200 dark:border-zinc-800 p-3.5 flex items-center justify-center">
               <Clock size={16} className="text-zinc-600 dark:text-zinc-300" />
            </div>
            <div className="flex-1 p-3.5 font-bold text-xs uppercase tracking-wider text-zinc-600 dark:text-zinc-300 text-center flex items-center justify-center gap-2">
               <Building size={14} /> Atendimentos do Dia ({meetings.length} agendados)
            </div>
         </div>

         {/* Table Body */}
         <div className="flex-1 overflow-y-auto relative min-h-[600px] bg-zinc-50/20 dark:bg-black/10">
            <div className="absolute inset-0 flex flex-col">
               {hours.map(h => (
                 <div key={h} className="flex h-24 border-b border-zinc-100 dark:border-zinc-800/80 group">
                    <div className="w-24 shrink-0 border-r border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center bg-zinc-50/60 dark:bg-zinc-900/40 text-xs font-bold text-zinc-600 dark:text-zinc-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                       {h.toString().padStart(2, '0')}:00
                    </div>
                    <div className="flex-1 relative">
                       {/* Linha guia pontilhada da meia hora */}
                       <div className="absolute top-1/2 left-0 right-0 h-px border-t border-dashed border-zinc-200 dark:border-zinc-800/50"></div>
                       
                       {/* Renderização dos Eventos com alto contraste */}
                       {meetings.filter(m => parseInt(m.time.split(':')[0]) === h).map(m => {
                         const startMinute = parseInt(m.time.split(':')[1]) || 0;
                         const topOffset = (startMinute / 60) * 100;
                         const height = ((m.duration || 60) / 60) * 100;

                         return (
                           <div 
                             key={m.id}
                             className="absolute left-3 right-3 rounded-xl p-3 border border-blue-200 dark:border-blue-800/60 bg-blue-50/90 dark:bg-blue-950/60 shadow-md backdrop-blur-sm overflow-hidden cursor-pointer hover:scale-[1.005] hover:shadow-lg transition-all z-10 border-l-4 border-l-blue-600"
                             style={{ top: `${topOffset}%`, height: `${height}%`, minHeight: '68px' }}
                           >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-extrabold text-blue-700 dark:text-blue-400 tracking-wider">
                                  {m.time} • {m.duration} min
                                </span>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
                                  {m.status || "CONFIRMADO"}
                                </span>
                              </div>
                              <h4 className="font-bold text-sm text-zinc-900 dark:text-white truncate">
                                {m.title}
                              </h4>
                              <p className="text-xs text-zinc-600 dark:text-zinc-300 truncate mt-0.5">
                                Paciente: <strong className="text-zinc-800 dark:text-zinc-200">{m.paciente?.nome || 'Não informado'}</strong> • {m.convenio?.nome || 'Particular'}
                              </p>
                              {m.patientToken && (
                                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono mt-1 flex items-center gap-1 font-bold">
                                  <CheckCircle2 size={12} /> Token: {m.patientToken}
                                </p>
                              )}
                           </div>
                         );
                       })}
                    </div>
                 </div>
               ))}
            </div>
            
            {loading && (
              <div className="absolute inset-0 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center z-50">
                 <div className="w-8 h-8 rounded-full border-3 border-blue-600 border-t-transparent animate-spin"></div>
              </div>
            )}
         </div>
      </div>

      {/* Modal de Agendamento (Compatível Light & Dark Mode) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/40">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <CalendarIcon size={18} />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-zinc-900 dark:text-white">Novo Agendamento</h2>
                  <p className="text-xs text-zinc-500">Adicione uma consulta direta à grade de horários.</p>
                </div>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-blue-scrollbar flex-1 space-y-5">
               
               {/* Linha 1: Paciente e Médico */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div>
                   <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                     Paciente (CRM) *
                   </label>
                   <select 
                     value={form.pacienteId} 
                     onChange={e => {
                       const pid = e.target.value;
                       const p = pacientes.find(x => x.id === pid);
                       setForm(prev => ({ 
                         ...prev, 
                         pacienteId: pid, 
                         convenioId: p?.convenioId || prev.convenioId 
                       }));
                     }}
                     className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-3 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                   >
                     <option value="" className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white">Selecione um paciente...</option>
                     {pacientes.map(p => <option key={p.id} value={p.id} className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white">{p.nome} {p.cpf ? `(${p.cpf})` : ''}</option>)}
                   </select>
                 </div>
                 <div>
                   <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                     Profissional / Médico *
                   </label>
                   <select 
                     value={form.user_id} 
                     onChange={e => setForm({...form, user_id: e.target.value})}
                     className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-3 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                   >
                     <option value="" className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white">Selecione o profissional...</option>
                     {medicos.map(m => <option key={m.id} value={m.id} className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white">{m.fullName || m.email}</option>)}
                   </select>
                 </div>
               </div>

               {/* Consultório */}
               <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                    Consultório / Sala
                  </label>
                  <select 
                    value={(form as any).consultorioId || ""} 
                    onChange={e => setForm({...form, consultorioId: e.target.value} as any)}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-3 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  >
                    <option value="" className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white">Nenhum / Não aplicável</option>
                    {consultorios.map(c => <option key={c.id} value={c.id} className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white">{c.nome}</option>)}
                  </select>
               </div>

               {/* Data, Hora e Duração */}
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 <div>
                   <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">Data *</label>
                   <input 
                     type="date" 
                     value={form.date} 
                     onChange={e => setForm({...form, date: e.target.value})} 
                     className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" 
                   />
                 </div>
                 <div>
                   <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">Hora *</label>
                   <input 
                     type="time" 
                     value={form.time} 
                     onChange={e => setForm({...form, time: e.target.value})} 
                     className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" 
                   />
                 </div>
                 <div>
                   <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">Duração</label>
                   <select 
                     value={form.duration} 
                     onChange={e => setForm({...form, duration: e.target.value})} 
                     className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                   >
                     <option value="30" className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white">30 minutos</option>
                     <option value="60" className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white">60 minutos (1h)</option>
                     <option value="90" className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white">90 minutos (1h 30m)</option>
                     <option value="120" className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white">120 minutos (2h)</option>
                   </select>
                 </div>
               </div>

               {/* Regras de Faturamento e Convênio */}
               <div className="bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700/60 space-y-4">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <FileText size={16} />
                    <h3 className="text-xs font-bold uppercase tracking-wider">Regras de Faturamento (TISS)</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1 block">Convênio</label>
                      <select 
                        value={form.convenioId} 
                        onChange={e => setForm({...form, convenioId: e.target.value})}
                        className="w-full bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="" className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white">Particular</option>
                        {convenios.map(c => <option key={c.id} value={c.id} className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white">{c.nome}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1 block">Procedimento</label>
                      <select 
                        value={form.procedimentoId} 
                        onChange={e => setForm({...form, procedimentoId: e.target.value})}
                        className="w-full bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="" className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white">Selecione o procedimento...</option>
                        {procedimentos.map(p => <option key={p.id} value={p.id} className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white">{p.nome}</option>)}
                      </select>
                    </div>
                  </div>

                  {requiresToken && (
                    <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                      <div className="flex gap-2.5">
                         <AlertCircle className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" size={18} />
                         <div className="flex-1">
                            <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300">Token de Autorização Obrigatório</h4>
                            <p className="text-[11px] text-amber-700 dark:text-amber-400 mb-2">Este convênio exige um token do paciente para evitar glosa.</p>
                            <input 
                              type="text" 
                              placeholder="Digite o Token do Paciente"
                              value={form.patientToken}
                              onChange={e => setForm({...form, patientToken: e.target.value})}
                              className="w-full bg-white dark:bg-zinc-800 border border-amber-300 dark:border-amber-700 rounded-xl px-3.5 py-2 text-sm text-zinc-900 dark:text-white focus:border-amber-500 focus:outline-none font-mono" 
                            />
                         </div>
                      </div>
                    </div>
                  )}
               </div>

            </div>

            {/* Footer Ações */}
            <div className="p-5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 flex items-center justify-between">
               <div className="flex-1">
                 {formError && <p className="text-rose-600 dark:text-rose-400 text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 px-3 py-1.5 rounded-lg inline-flex">{formError}</p>}
                 {formSuccess && <p className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-lg inline-flex"><CheckCircle2 size={14}/> {formSuccess}</p>}
               </div>
               <div className="flex gap-3">
                 <button onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 transition-colors">
                   Cancelar
                 </button>
                 <button 
                   onClick={handleCreate}
                   disabled={saving || (requiresToken && !form.patientToken)}
                   className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   {saving ? "Agendando..." : "Confirmar Agendamento"}
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
