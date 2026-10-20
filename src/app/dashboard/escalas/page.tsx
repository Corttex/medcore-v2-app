"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Users, 
  Calendar as CalendarIcon, 
  Clock, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Filter, 
  Stethoscope, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Edit3, 
  ArrowLeftRight, 
  Search, 
  Moon, 
  Sun, 
  Building2,
  Trash2,
  UserCheck,
  Check
} from "lucide-react";
import { useDashboardContext } from "@/features/dashboard/context/DashboardContext";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

interface ProfissionalEscala {
  id: number;
  name: string;
  role: string;
  setor: string;
  categoria: "MEDICO" | "ENFERMAGEM" | "OUTRO";
  status: "Em Plantão" | "Folga" | "Ausente" | "Sobreaviso";
  time: string;
  avatar: string;
  alert?: string;
}

interface ShiftSlot {
  id: string;
  profId: number;
  dayIndex: number; // 0 a 6 (Segunda a Domingo)
  tipo: "DIURNO" | "NOTURNO" | "24H" | "FOLGA" | "SOBREAVISO";
  horario: string;
  setor: string;
  status: "CONFIRMADO" | "PENDENTE" | "TROCA_SOLICITADA" | "FOLGA";
}

const WEEK_DAYS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

const INITIAL_PROFISSIONAIS: ProfissionalEscala[] = [];

const INITIAL_SHIFTS: ShiftSlot[] = [];

export default function EscalasPage() {
  const { theme } = useTheme();
  const { selectedUnitId, units, isDemoMode } = useDashboardContext();
  const activeUnit = units.find(u => u.id === selectedUnitId) || units[0];

  const [currentWeek, setCurrentWeek] = useState("12 a 18 de Outubro / 2026");
  const [profissionais, setProfissionais] = useState<ProfissionalEscala[]>([]);
  const [shifts, setShifts] = useState<ShiftSlot[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("TODOS");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isDemoMode) {
      setProfissionais(INITIAL_PROFISSIONAIS);
      setShifts(INITIAL_SHIFTS);
    } else {
      setProfissionais([]);
      setShifts([]);
    }
  }, [isDemoMode]);

  // Modal: Nova Escala
  const [showNewEscalaModal, setShowNewEscalaModal] = useState(false);
  const [newEscalaForm, setNewEscalaForm] = useState({
    profId: "1",
    dayIndex: "0",
    tipo: "DIURNO" as ShiftSlot["tipo"],
    horario: "07:00 - 19:00",
    setor: "UTI Geral",
    status: "CONFIRMADO" as ShiftSlot["status"],
    observacoes: ""
  });

  // Modal: Editar / Trocar Data do Plantão
  const [editingShift, setEditingShift] = useState<{
    slot: ShiftSlot;
    prof: ProfissionalEscala;
  } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtragem de profissionais
  const filteredProfissionais = useMemo(() => {
    return profissionais.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.setor.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchSearch) return false;
      if (filterCategory !== "TODOS" && p.categoria !== filterCategory) return false;
      return true;
    });
  }, [profissionais, searchTerm, filterCategory]);

  // Handler: Criar Nova Escala
  const handleCreateEscala = (e: React.FormEvent) => {
    e.preventDefault();
    const profIdNum = Number(newEscalaForm.profId);
    const dayIndexNum = Number(newEscalaForm.dayIndex);
    const prof = profissionais.find(p => p.id === profIdNum);

    const existingSlotIndex = shifts.findIndex(s => s.profId === profIdNum && s.dayIndex === dayIndexNum);

    const newSlot: ShiftSlot = {
      id: `s-${profIdNum}-${dayIndexNum}-${Date.now()}`,
      profId: profIdNum,
      dayIndex: dayIndexNum,
      tipo: newEscalaForm.tipo,
      horario: newEscalaForm.tipo === "FOLGA" ? "-" : newEscalaForm.horario,
      setor: newEscalaForm.setor,
      status: newEscalaForm.status
    };

    if (existingSlotIndex !== -1) {
      setShifts(prev => {
        const copy = [...prev];
        copy[existingSlotIndex] = newSlot;
        return copy;
      });
    } else {
      setShifts(prev => [...prev, newSlot]);
    }

    setShowNewEscalaModal(false);
    showToast(`Escala de ${prof?.name} alocada para ${WEEK_DAYS[dayIndexNum]} (${newEscalaForm.tipo}) com sucesso!`);
  };

  // Handler: Salvar Edição de Plantão
  const handleSaveEditShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingShift) return;

    setShifts(prev => prev.map(s => {
      if (s.id === editingShift.slot.id || (s.profId === editingShift.slot.profId && s.dayIndex === editingShift.slot.dayIndex)) {
        return {
          ...s,
          dayIndex: editingShift.slot.dayIndex,
          tipo: editingShift.slot.tipo,
          horario: editingShift.slot.tipo === "FOLGA" ? "-" : editingShift.slot.horario,
          setor: editingShift.slot.setor,
          status: editingShift.slot.status,
          profId: editingShift.slot.profId
        };
      }
      return s;
    }));

    showToast(`Plantão de ${editingShift.prof.name} atualizado com sucesso!`);
    setEditingShift(null);
  };

  // Handler: Alternar Folga / Plantão rápido
  const handleToggleFolga = (slot: ShiftSlot, prof: ProfissionalEscala) => {
    const isCurrentlyFolga = slot.tipo === "FOLGA";
    const nextTipo = isCurrentlyFolga ? "DIURNO" : "FOLGA";
    const nextHorario = isCurrentlyFolga ? "07:00 - 19:00" : "-";

    setShifts(prev => prev.map(s => {
      if (s.profId === prof.id && s.dayIndex === slot.dayIndex) {
        return {
          ...s,
          tipo: nextTipo,
          horario: nextHorario,
          status: isCurrentlyFolga ? "CONFIRMADO" : "FOLGA"
        };
      }
      return s;
    }));

    showToast(`${prof.name}: alterado para ${isCurrentlyFolga ? "Plantão Ativo (07h-19h)" : "Folga"} em ${WEEK_DAYS[slot.dayIndex]}`);
    if (editingShift) setEditingShift(null);
  };

  // Contadores
  const ativosHoje = profissionais.filter(p => p.status === "Em Plantão").length;

  // Métricas do Mês (Zera quando não houver modo demo ativo ou sem escalas)
  const metricasMes = useMemo(() => {
    if (!isDemoMode && shifts.length === 0) {
      return {
        horasAlocadas: "0h",
        horasExtras: "0h",
        trocas: "0 pendentes",
        faltas: "0 ocorrências"
      };
    }
    const totalHoras = shifts.reduce((acc, s) => {
      if (s.tipo === "24H") return acc + 24;
      if (s.tipo === "DIURNO" || s.tipo === "NOTURNO") return acc + 12;
      return acc;
    }, 0);
    const trocasCount = shifts.filter(s => s.status === "TROCA_SOLICITADA").length;
    return {
      horasAlocadas: isDemoMode ? "1.480h" : `${totalHoras}h`,
      horasExtras: isDemoMode ? "42h" : "0h",
      trocas: isDemoMode ? "4 pendentes" : `${trocasCount} pendentes`,
      faltas: isDemoMode ? "1 ocorrência" : "0 ocorrências"
    };
  }, [isDemoMode, shifts]);

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500 pb-20 pt-2 px-2 sm:px-4">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500/40 rounded-2xl text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-lg animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-500 hover:text-emerald-700 p-1">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Action Bar Superior em Largura Total (Sem Duplicidade de Título) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900/90 border-2 border-zinc-200 dark:border-zinc-700/80 px-5 py-3.5 rounded-2xl shadow-sm backdrop-blur-md w-full">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rd-cyan animate-pulse" />
            <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              Unidade: <strong className="text-zinc-900 dark:text-zinc-100">{activeUnit?.name || "Hospital Geral MedCore"}</strong>
            </span>
          </div>
          <span className="text-zinc-300 dark:text-zinc-700 hidden sm:inline">|</span>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center gap-1.5">
            <UserCheck size={14} />
            {ativosHoje} Profissionais em Plantão Hoje
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 border border-primary/20 text-primary">
            {profissionais.length} Colaboradores na Escala
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Seletor de Categoria */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 px-3 py-2 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 focus:outline-none cursor-pointer"
          >
            <option value="TODOS">Todos os Cargos</option>
            <option value="MEDICO">Corpo Clínico (Médicos)</option>
            <option value="ENFERMAGEM">Enfermagem & UTI</option>
          </select>

          <button 
            onClick={() => setShowNewEscalaModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-rd-cyan text-zinc-950 rounded-xl text-xs font-bold shadow-md shadow-rd-cyan/20 hover:bg-rd-cyan/90 transition-all cursor-pointer active:scale-95"
          >
            <Plus size={16} />
            Nova Escala
          </button>
        </div>
      </div>

      {/* Grid Principal Expandido em 100% da Largura da Tela */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 w-full">
        
        {/* Lado Esquerdo - Status do Dia e Métricas */}
        <div className="xl:col-span-3 space-y-6">
          <div className="p-5 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-900/85 backdrop-blur-xl shadow-md transition-all relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs uppercase font-bold text-zinc-500 dark:text-zinc-400 tracking-wider">Plantão de Hoje</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-rd-cyan/10 text-rd-cyan border border-rd-cyan/20">Ao Vivo</span>
            </div>
            
            <div className="space-y-3 relative z-10">
              {profissionais.length === 0 ? (
                <div className="py-6 text-center text-zinc-400 dark:text-zinc-500 text-xs">
                  <UserCheck size={28} className="mx-auto mb-2 opacity-40 text-zinc-400" />
                  <p className="font-semibold text-zinc-500">Nenhum plantonista em plantão hoje</p>
                  <p className="text-[11px] opacity-75 mt-0.5">Ative "Dados Demo: Sim" ou crie uma nova escala.</p>
                </div>
              ) : (
                profissionais.slice(0, 5).map(prof => (
                  <div key={prof.id} className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-950/40 hover:border-rd-cyan/40 transition-all">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold font-heading shrink-0 shadow-sm",
                        prof.status === "Em Plantão" ? "bg-rd-cyan text-zinc-950" : 
                        prof.status === "Ausente" ? "bg-red-500 text-white" : 
                        prof.status === "Sobreaviso" ? "bg-amber-500 text-zinc-950" :
                        "bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                      )}>
                        {prof.avatar}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-tight">{prof.name}</h4>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{prof.role}</p>
                        <span className="text-[10px] text-zinc-400 font-medium">{prof.setor}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-bold block",
                        prof.status === "Em Plantão" ? "bg-emerald-500/10 text-emerald-500" :
                        prof.status === "Ausente" ? "bg-rose-500/10 text-rose-500" :
                        prof.status === "Sobreaviso" ? "bg-amber-500/10 text-amber-500" :
                        "bg-zinc-500/10 text-zinc-400"
                      )}>
                        {prof.status}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400 mt-1 block">{prof.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <button 
              onClick={() => showToast("Exibindo todos os plantonistas cadastrados na unidade.")}
              className="w-full mt-4 py-2.5 text-xs font-bold text-rd-cyan border border-rd-cyan/20 rounded-xl hover:bg-rd-cyan/10 transition-colors"
            >
              Ver Lista Completa ({profissionais.length})
            </button>
          </div>

          <div className="p-5 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-900/85 backdrop-blur-xl shadow-md">
            <h2 className="text-xs uppercase font-bold text-zinc-500 dark:text-zinc-400 tracking-wider mb-4">Métricas do Mês</h2>
            
            <div className="space-y-3.5">
              <div className="flex justify-between items-center text-sm p-2 rounded-xl bg-zinc-50 dark:bg-zinc-950/30">
                <span className="text-zinc-600 dark:text-zinc-400 font-medium">Horas de Plantão Alocadas</span>
                <span className="font-bold text-emerald-500">{metricasMes.horasAlocadas}</span>
              </div>
              <div className="flex justify-between items-center text-sm p-2 rounded-xl bg-zinc-50 dark:bg-zinc-950/30">
                <span className="text-zinc-600 dark:text-zinc-400 font-medium">Horas Extras Acumuladas</span>
                <span className="font-bold text-amber-500">{metricasMes.horasExtras}</span>
              </div>
              <div className="flex justify-between items-center text-sm p-2 rounded-xl bg-zinc-50 dark:bg-zinc-950/30">
                <span className="text-zinc-600 dark:text-zinc-400 font-medium">Trocas Solicitadas</span>
                <span className="font-bold text-rd-cyan">{metricasMes.trocas}</span>
              </div>
              <div className="flex justify-between items-center text-sm p-2 rounded-xl bg-zinc-50 dark:bg-zinc-950/30">
                <span className="text-zinc-600 dark:text-zinc-400 font-medium">Faltas / Atestados</span>
                <span className="font-bold text-rose-500">{metricasMes.faltas}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lado Direito - Matriz de Escala Expandida em Largura Total */}
        <div className="xl:col-span-9 space-y-6">
          <div className="rounded-3xl border-2 border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-900/85 backdrop-blur-xl shadow-lg transition-all overflow-hidden flex flex-col w-full">
            
            {/* Calendar Controls & Search Header */}
            <div className="p-4 border-b-2 border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-zinc-50/60 dark:bg-zinc-950/40">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-rd-cyan/15 flex items-center justify-center text-rd-cyan">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm text-zinc-900 dark:text-zinc-100">Escala Semanal & Gestão de Plantões</h3>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Clique em qualquer plantão para editar horários, trocar data ou conceder folga.</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Buscar profissional..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-rd-cyan w-40 sm:w-52"
                  />
                </div>

                <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-1">
                  <button 
                    onClick={() => showToast("Navegando para a semana anterior.")}
                    className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 px-2 min-w-[130px] text-center">{currentWeek}</span>
                  <button 
                    onClick={() => showToast("Navegando para a próxima semana.")}
                    className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Matrix Table em Largura 100% com Rolagem Suave */}
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-950/60">
                    <th className="p-4 text-xs uppercase font-extrabold text-zinc-600 dark:text-zinc-300 tracking-wider min-w-[220px]">
                      Profissional / Cargo
                    </th>
                    {WEEK_DAYS.map((day, idx) => (
                      <th key={day} className="p-3.5 text-xs uppercase font-bold text-zinc-600 dark:text-zinc-400 tracking-wider text-center min-w-[130px] border-l border-zinc-200 dark:border-zinc-800">
                        <div className="flex flex-col items-center gap-0.5">
                          <span>{day}</span>
                          <span className="text-[10px] font-mono font-normal text-zinc-400">Dia {12 + idx}/10</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/80">
                  {filteredProfissionais.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-12 text-center text-zinc-500">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <Users size={32} className="opacity-40 text-zinc-400" />
                          <p className="font-semibold text-sm text-zinc-700 dark:text-zinc-300">Nenhum plantonista alocado na escala</p>
                          <p className="text-xs text-zinc-500 max-w-sm">
                            Ative o botão <strong>&quot;Dados Demo: Sim&quot;</strong> na barra superior para visualizar a grade semanal completa com médicos e plantões demonstrativos.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredProfissionais.map(prof => (
                    <tr key={prof.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold font-heading shrink-0 shadow-sm",
                            prof.categoria === "MEDICO" ? "bg-rd-cyan/20 text-rd-cyan border border-rd-cyan/30" : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                          )}>
                            {prof.avatar}
                          </div>
                          <div>
                            <p className="font-bold text-zinc-900 dark:text-zinc-100 text-sm leading-tight flex items-center gap-1.5">
                              {prof.name}
                              {prof.categoria === "MEDICO" && <Stethoscope size={12} className="text-rd-cyan shrink-0" />}
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{prof.role}</p>
                            <span className="text-[10px] text-zinc-400 font-medium">{prof.setor}</span>
                          </div>
                        </div>
                      </td>

                      {/* 7 Dias da Semana (Slots Interativos) */}
                      {WEEK_DAYS.map((day, idx) => {
                        const slot = shifts.find(s => s.profId === prof.id && s.dayIndex === idx) || {
                          id: `s-${prof.id}-${idx}`,
                          profId: prof.id,
                          dayIndex: idx,
                          tipo: "FOLGA" as const,
                          horario: "-",
                          setor: prof.setor,
                          status: "FOLGA" as const
                        };

                        const isNight = slot.tipo === "NOTURNO";
                        const is24h = slot.tipo === "24H";
                        const isSobreaviso = slot.tipo === "SOBREAVISO";
                        const isFolga = slot.tipo === "FOLGA";

                        return (
                          <td key={day} className="p-2 border-l border-zinc-200 dark:border-zinc-800/80 align-middle">
                            <button
                              onClick={() => setEditingShift({ slot, prof })}
                              className={cn(
                                "w-full rounded-xl p-2.5 text-center transition-all cursor-pointer group/cell relative border flex flex-col items-center justify-center gap-1 hover:scale-[1.02] shadow-sm",
                                isFolga && "bg-zinc-100/50 dark:bg-zinc-950/40 border-dashed border-zinc-300 dark:border-zinc-800 text-zinc-400 hover:border-rd-cyan/50 hover:text-rd-cyan",
                                !isFolga && isNight && "bg-indigo-500/15 border-indigo-500/30 text-indigo-400 hover:border-indigo-400",
                                !isFolga && is24h && "bg-purple-500/15 border-purple-500/30 text-purple-400 hover:border-purple-400",
                                !isFolga && isSobreaviso && "bg-amber-500/15 border-amber-500/30 text-amber-400 hover:border-amber-400",
                                !isFolga && !isNight && !is24h && !isSobreaviso && "bg-rd-cyan/15 border-rd-cyan/30 text-rd-cyan hover:border-rd-cyan"
                              )}
                              title="Clique para editar horário, trocar data ou conceder folga"
                            >
                              <div className="flex items-center gap-1 text-[11px] font-bold">
                                {isFolga ? (
                                  <span>Folga</span>
                                ) : (
                                  <>
                                    {isNight ? <Moon size={11} /> : is24h ? <Clock size={11} /> : <Sun size={11} />}
                                    <span>{slot.horario}</span>
                                  </>
                                )}
                              </div>
                              <span className="text-[9px] uppercase tracking-wider font-semibold opacity-75 truncate max-w-full">
                                {isFolga ? "Livre" : slot.setor}
                              </span>
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  )))}
                </tbody>
              </table>
            </div>

            {/* Footer da Matriz com Legendas e Atalhos */}
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
              <span>Mostrando {filteredProfissionais.length} de {profissionais.length} profissionais na grade semanal</span>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-rd-cyan"></div> Diurno (12h)</div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div> Noturno (12h)</div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div> Plantão 24h</div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div> Sobreaviso</div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-zinc-400"></div> Folga</div>
              </div>
            </div>

          </div>
        </div>
        
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: NOVA ESCALA (TOTALMENTE FUNCIONAL) */}
      {/* ========================================================= */}
      {showNewEscalaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rd-cyan/15 flex items-center justify-center text-rd-cyan">
                  <Plus size={18} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-white">Cadastrar Nova Escala</h3>
                  <p className="text-xs text-zinc-400">Alocação de plantão médico e assistencial</p>
                </div>
              </div>
              <button 
                onClick={() => setShowNewEscalaModal(false)}
                className="p-1 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateEscala} className="space-y-4">
              {/* Seleção do Profissional */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 block">Profissional de Saúde *</label>
                <select
                  value={newEscalaForm.profId}
                  onChange={(e) => {
                    const profId = e.target.value;
                    const p = profissionais.find(item => item.id === Number(profId));
                    setNewEscalaForm({
                      ...newEscalaForm,
                      profId,
                      setor: p?.setor || "UTI Geral"
                    });
                  }}
                  className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-rd-cyan cursor-pointer"
                >
                  {profissionais.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.role} • {p.setor})
                    </option>
                  ))}
                </select>
              </div>

              {/* Dia da Semana & Setor */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300 block">Dia da Semana *</label>
                  <select
                    value={newEscalaForm.dayIndex}
                    onChange={(e) => setNewEscalaForm({ ...newEscalaForm, dayIndex: e.target.value })}
                    className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-rd-cyan cursor-pointer"
                  >
                    {WEEK_DAYS.map((day, idx) => (
                      <option key={day} value={idx}>{day}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300 block">Setor / Ala *</label>
                  <select
                    value={newEscalaForm.setor}
                    onChange={(e) => setNewEscalaForm({ ...newEscalaForm, setor: e.target.value })}
                    className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-rd-cyan cursor-pointer"
                  >
                    <option value="UTI Geral">UTI Geral</option>
                    <option value="Pronto Atendimento">Pronto Atendimento</option>
                    <option value="Bloco Cirúrgico">Bloco Cirúrgico</option>
                    <option value="Pediatria">Pediatria</option>
                    <option value="Centro Obstétrico">Centro Obstétrico</option>
                    <option value="Ambulatório">Ambulatório</option>
                  </select>
                </div>
              </div>

              {/* Turno e Horário */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300 block">Tipo de Turno *</label>
                  <select
                    value={newEscalaForm.tipo}
                    onChange={(e) => {
                      const t = e.target.value as ShiftSlot["tipo"];
                      const defaultHorario = 
                        t === "DIURNO" ? "07:00 - 19:00" :
                        t === "NOTURNO" ? "19:00 - 07:00" :
                        t === "24H" ? "07:00 - 07:00" :
                        t === "SOBREAVISO" ? "24h Sobreaviso" : "-";
                      setNewEscalaForm({ ...newEscalaForm, tipo: t, horario: defaultHorario });
                    }}
                    className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-rd-cyan cursor-pointer"
                  >
                    <option value="DIURNO">Diurno 12h (07h às 19h)</option>
                    <option value="NOTURNO">Noturno 12h (19h às 07h)</option>
                    <option value="24H">Plantão 24 Horas</option>
                    <option value="SOBREAVISO">Sobreaviso Hospitalar</option>
                    <option value="FOLGA">Folga Programada</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300 block">Horário Específico</label>
                  <input
                    type="text"
                    value={newEscalaForm.horario}
                    onChange={(e) => setNewEscalaForm({ ...newEscalaForm, horario: e.target.value })}
                    placeholder="Ex: 07:00 - 19:00"
                    className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-rd-cyan"
                    disabled={newEscalaForm.tipo === "FOLGA"}
                  />
                </div>
              </div>

              {/* Observações */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 block">Observações do Plantão</label>
                <input
                  type="text"
                  placeholder="Ex: Cobertura presencial da UTI Covid / Ala A"
                  value={newEscalaForm.observacoes}
                  onChange={(e) => setNewEscalaForm({ ...newEscalaForm, observacoes: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-rd-cyan"
                />
              </div>

              <div className="pt-3 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowNewEscalaModal(false)}
                  className="px-4 py-2.5 rounded-xl text-zinc-400 hover:text-white border border-zinc-800 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rd-cyan text-zinc-950 font-bold hover:bg-rd-cyan/90 transition-all text-xs shadow-md shadow-rd-cyan/20"
                >
                  Confirmar e Salvar Escala
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: EDITAR / ALTERAR DATA / PLANTÃO */}
      {/* ========================================================= */}
      {editingShift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-500/15 flex items-center justify-center text-purple-400">
                  <Edit3 size={18} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-white">Editar Plantão</h3>
                  <p className="text-xs text-zinc-400">{editingShift.prof.name} • {WEEK_DAYS[editingShift.slot.dayIndex]}</p>
                </div>
              </div>
              <button 
                onClick={() => setEditingShift(null)}
                className="p-1 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditShift} className="space-y-4">
              {/* Trocar Data / Dia da Semana */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 block flex items-center gap-1.5">
                  <ArrowLeftRight size={13} className="text-rd-cyan" />
                  Trocar Data / Dia da Semana
                </label>
                <select
                  value={editingShift.slot.dayIndex}
                  onChange={(e) => setEditingShift({
                    ...editingShift,
                    slot: { ...editingShift.slot, dayIndex: Number(e.target.value) }
                  })}
                  className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-rd-cyan cursor-pointer"
                >
                  {WEEK_DAYS.map((day, idx) => (
                    <option key={day} value={idx}>{day} (Dia {12 + idx}/10)</option>
                  ))}
                </select>
              </div>

              {/* Turno e Horário */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300 block">Tipo de Turno</label>
                  <select
                    value={editingShift.slot.tipo}
                    onChange={(e) => {
                      const t = e.target.value as ShiftSlot["tipo"];
                      const defaultHorario = 
                        t === "DIURNO" ? "07:00 - 19:00" :
                        t === "NOTURNO" ? "19:00 - 07:00" :
                        t === "24H" ? "07:00 - 07:00" :
                        t === "SOBREAVISO" ? "24h Sobreaviso" : "-";
                      setEditingShift({
                        ...editingShift,
                        slot: { ...editingShift.slot, tipo: t, horario: defaultHorario, status: t === "FOLGA" ? "FOLGA" : "CONFIRMADO" }
                      });
                    }}
                    className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-rd-cyan cursor-pointer"
                  >
                    <option value="DIURNO">Diurno 12h</option>
                    <option value="NOTURNO">Noturno 12h</option>
                    <option value="24H">Plantão 24h</option>
                    <option value="SOBREAVISO">Sobreaviso</option>
                    <option value="FOLGA">Folga</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300 block">Horário</label>
                  <input
                    type="text"
                    value={editingShift.slot.horario}
                    onChange={(e) => setEditingShift({
                      ...editingShift,
                      slot: { ...editingShift.slot, horario: e.target.value }
                    })}
                    className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-rd-cyan"
                    disabled={editingShift.slot.tipo === "FOLGA"}
                  />
                </div>
              </div>

              {/* Setor */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 block">Setor / Ala Hospitalar</label>
                <select
                  value={editingShift.slot.setor}
                  onChange={(e) => setEditingShift({
                    ...editingShift,
                    slot: { ...editingShift.slot, setor: e.target.value }
                  })}
                  className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-rd-cyan cursor-pointer"
                >
                  <option value="UTI Geral">UTI Geral</option>
                  <option value="Pronto Atendimento">Pronto Atendimento</option>
                  <option value="Bloco Cirúrgico">Bloco Cirúrgico</option>
                  <option value="Pediatria">Pediatria</option>
                  <option value="Centro Obstétrico">Centro Obstétrico</option>
                </select>
              </div>

              {/* Ações Rápidas: Alternar Folga ou Salvar */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleFolga(editingShift.slot, editingShift.prof)}
                  className="w-full py-2.5 px-3 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  {editingShift.slot.tipo === "FOLGA" ? (
                    <>
                      <Sun size={14} className="text-amber-400" />
                      Mudar para Plantão Ativo (07h-19h)
                    </>
                  ) : (
                    <>
                      <Moon size={14} className="text-indigo-400" />
                      Conceder Folga Neste Dia
                    </>
                  )}
                </button>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingShift(null)}
                    className="px-4 py-2.5 rounded-xl text-zinc-400 hover:text-white border border-zinc-800 text-xs font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-rd-cyan text-zinc-950 font-bold hover:bg-rd-cyan/90 transition-all text-xs shadow-md shadow-rd-cyan/20"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
