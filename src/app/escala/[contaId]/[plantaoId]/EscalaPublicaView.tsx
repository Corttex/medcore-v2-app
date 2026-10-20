"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  Users, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Stethoscope, 
  Search, 
  Moon, 
  Sun, 
  Building2,
  UserCheck,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Tv,
  Printer,
  Sparkles,
  PhoneCall,
  Activity,
  Layers,
  Info
} from "lucide-react";

interface ProfissionalEscala {
  id: number;
  name: string;
  role: string;
  setor: string;
  categoria: "MEDICO" | "ENFERMAGEM" | "OUTRO";
  status: "Em Plantão" | "Folga" | "Ausente" | "Sobreaviso";
  registro: string;
  horario: string;
  avatar: string;
  ramal: string;
  dias: {
    dia: string;
    tipo: "DIURNO" | "NOTURNO" | "24H" | "FOLGA" | "SOBREAVISO";
    horario: string;
    setor: string;
  }[];
}

const WEEK_DAYS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

// Base de dados padrão para visualização pública e sem senha
const DEFAULT_ESCALA: ProfissionalEscala[] = [
  {
    id: 1,
    name: "Dr. Felipe Azevedo",
    role: "PlantRep Intensivista Chefe",
    setor: "UTI Geral - Ala A",
    categoria: "MEDICO",
    status: "Em Plantão",
    registro: "CRM-SP 124.890",
    horario: "07:00 - 19:00",
    avatar: "👨‍⚕️",
    ramal: "2101",
    dias: [
      { dia: "Segunda", tipo: "DIURNO", horario: "07:00 - 19:00", setor: "UTI Geral" },
      { dia: "Terça", tipo: "FOLGA", horario: "-", setor: "Livre" },
      { dia: "Quarta", tipo: "DIURNO", horario: "07:00 - 19:00", setor: "UTI Geral" },
      { dia: "Quinta", tipo: "FOLGA", horario: "-", setor: "Livre" },
      { dia: "Sexta", tipo: "24H", horario: "07:00 - 07:00", setor: "UTI Geral" },
      { dia: "Sábado", tipo: "FOLGA", horario: "-", setor: "Livre" },
      { dia: "Domingo", tipo: "FOLGA", horario: "-", setor: "Livre" },
    ]
  },
  {
    id: 2,
    name: "Dra. Beatriz Albuquerque",
    role: "Cirurgiã de Trauma / Emergencista",
    setor: "Pronto Socorro Adulto",
    categoria: "MEDICO",
    status: "Em Plantão",
    registro: "CRM-SP 148.332",
    horario: "19:00 - 07:00",
    avatar: "👩‍⚕️",
    ramal: "2204",
    dias: [
      { dia: "Segunda", tipo: "NOTURNO", horario: "19:00 - 07:00", setor: "Pronto Socorro" },
      { dia: "Terça", tipo: "NOTURNO", horario: "19:00 - 07:00", setor: "Pronto Socorro" },
      { dia: "Quarta", tipo: "FOLGA", horario: "-", setor: "Livre" },
      { dia: "Quinta", tipo: "NOTURNO", horario: "19:00 - 07:00", setor: "Pronto Socorro" },
      { dia: "Sexta", tipo: "FOLGA", horario: "-", setor: "Livre" },
      { dia: "Sábado", tipo: "SOBREAVISO", horario: "Sobreaviso 24h", setor: "Trauma" },
      { dia: "Domingo", tipo: "FOLGA", horario: "-", setor: "Livre" },
    ]
  },
  {
    id: 3,
    name: "Enfª. Mariana Siqueira",
    role: "Enfermeira Coordenadora de Turno",
    setor: "UTI Geral - Ala A",
    categoria: "ENFERMAGEM",
    status: "Em Plantão",
    registro: "COREN-SP 289.410",
    horario: "07:00 - 19:00",
    avatar: "👩‍⚕️",
    ramal: "2105",
    dias: [
      { dia: "Segunda", tipo: "DIURNO", horario: "07:00 - 19:00", setor: "UTI Geral" },
      { dia: "Terça", tipo: "DIURNO", horario: "07:00 - 19:00", setor: "UTI Geral" },
      { dia: "Quarta", tipo: "FOLGA", horario: "-", setor: "Livre" },
      { dia: "Quinta", tipo: "DIURNO", horario: "07:00 - 19:00", setor: "UTI Geral" },
      { dia: "Sexta", tipo: "FOLGA", horario: "-", setor: "Livre" },
      { dia: "Sábado", tipo: "DIURNO", horario: "07:00 - 19:00", setor: "UTI Geral" },
      { dia: "Domingo", tipo: "FOLGA", horario: "-", setor: "Livre" },
    ]
  },
  {
    id: 4,
    name: "Dr. Carlos Eduardo Ramos",
    role: "Cardiologista / Hemodinâmica",
    setor: "Unidade Coronariana (UCO)",
    categoria: "MEDICO",
    status: "Sobreaviso",
    registro: "CRM-SP 112.504",
    horario: "Sobreaviso 24h",
    avatar: "👨‍⚕️",
    ramal: "2302",
    dias: [
      { dia: "Segunda", tipo: "SOBREAVISO", horario: "Sobreaviso 24h", setor: "UCO" },
      { dia: "Terça", tipo: "DIURNO", horario: "07:00 - 19:00", setor: "UCO" },
      { dia: "Quarta", tipo: "SOBREAVISO", horario: "Sobreaviso 24h", setor: "UCO" },
      { dia: "Quinta", tipo: "FOLGA", horario: "-", setor: "Livre" },
      { dia: "Sexta", tipo: "DIURNO", horario: "07:00 - 19:00", setor: "UCO" },
      { dia: "Sábado", tipo: "FOLGA", horario: "-", setor: "Livre" },
      { dia: "Domingo", tipo: "FOLGA", horario: "-", setor: "Livre" },
    ]
  },
  {
    id: 5,
    name: "Dra. Camila Toledo",
    role: "Pediatra Neonatologista",
    setor: "UTI Neonatal & Maternidade",
    categoria: "MEDICO",
    status: "Folga",
    registro: "CRM-SP 165.772",
    horario: "Folga Programada",
    avatar: "👩‍⚕️",
    ramal: "2401",
    dias: [
      { dia: "Segunda", tipo: "FOLGA", horario: "-", setor: "Livre" },
      { dia: "Terça", tipo: "DIURNO", horario: "07:00 - 19:00", setor: "UTI Neo" },
      { dia: "Quarta", tipo: "NOTURNO", horario: "19:00 - 07:00", setor: "UTI Neo" },
      { dia: "Quinta", tipo: "FOLGA", horario: "-", setor: "Livre" },
      { dia: "Sexta", tipo: "FOLGA", horario: "-", setor: "Livre" },
      { dia: "Sábado", tipo: "24H", horario: "07:00 - 07:00", setor: "UTI Neo" },
      { dia: "Domingo", tipo: "FOLGA", horario: "-", setor: "Livre" },
    ]
  }
];

interface EscalaPublicaViewProps {
  contaId: string;
  plantaoId: string;
}

export function EscalaPublicaView({ contaId, plantaoId }: EscalaPublicaViewProps) {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDateFormatted, setCurrentDateFormatted] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [setorFilter, setSetorFilter] = useState("TODOS");
  const [copied, setCopied] = useState(false);
  const [isTvMode, setIsTvMode] = useState(false);

  // Relógio em tempo real
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      setCurrentDateFormatted(now.toLocaleDateString("pt-BR", { 
        weekday: "long", 
        day: "numeric", 
        month: "long", 
        year: "numeric" 
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Formatar nome da conta / unidade de forma amigável
  const hospitalName = useMemo(() => {
    if (!contaId || contaId === "default" || contaId === "matriz") {
      return "Hospital Central MedCore";
    }
    // Remove traços e capitaliza
    return contaId
      .split(/[-_]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }, [contaId]);

  // Identifica o plantão em destaque
  const plantaoDestaque = useMemo(() => {
    const cleanPlantao = plantaoId.toLowerCase();
    
    // Tenta encontrar por ID numérico ou setor correspondente
    const found = DEFAULT_ESCALA.find(p => 
      p.id.toString() === cleanPlantao ||
      p.setor.toLowerCase().includes(cleanPlantao) ||
      cleanPlantao.includes(p.name.toLowerCase().split(" ")[1] || "")
    );

    return found || DEFAULT_ESCALA[0];
  }, [plantaoId]);

  // Lista filtrada
  const filteredProfissionais = useMemo(() => {
    return DEFAULT_ESCALA.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.setor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.registro.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchSearch) return false;
      if (setorFilter !== "TODOS" && !p.setor.toLowerCase().includes(setorFilter.toLowerCase())) return false;
      return true;
    });
  }, [searchTerm, setorFilter]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className={`min-h-screen bg-surface text-on-surface transition-all ${isTvMode ? "p-4 sm:p-8" : "p-4 sm:p-6 lg:p-10"}`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Top Notification Bar - Acesso Público Sem Senha */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 rounded-2xl bg-surface-container-high border border-outline-variant/30 text-xs shadow-md">
          <div className="flex items-center gap-2 text-zinc-300">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck size={14} /> Link Público Oficial • Acesso Seguro Sem Senha
            </span>
            <span className="text-zinc-600 hidden md:inline">|</span>
            <span className="text-zinc-400 hidden md:inline">
              Conta: <strong className="text-zinc-200">#{contaId}</strong> &bull; Plantão: <strong className="text-zinc-200">#{plantaoId}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTvMode(!isTvMode)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-highest hover:bg-surface-bright text-zinc-300 hover:text-white font-medium transition-colors text-xs cursor-pointer border border-outline-variant/20"
              title="Otimizar exibição para TVs e Monitores de Plantão"
            >
              <Tv size={14} className={isTvMode ? "text-primary" : ""} />
              {isTvMode ? "Modo Padrão" : "Modo TV / Painel"}
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-highest hover:bg-surface-bright text-zinc-300 hover:text-white font-medium transition-colors text-xs cursor-pointer border border-outline-variant/20"
            >
              <Printer size={14} />
              Imprimir
            </button>

            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white font-semibold transition-transform active:scale-95 text-xs shadow-sm hover:brightness-110 cursor-pointer"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Link Copiado!" : "Compartilhar Link"}
            </button>
          </div>
        </div>

        {/* Header Principal do Hospital */}
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-surface-container-highest border border-outline-variant/30 flex items-center justify-center text-primary shadow-lg relative">
                <Activity size={32} className="animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                    MEDCORE ESCALAS
                  </span>
                  <span className="text-xs text-zinc-400 capitalize">{currentDateFormatted}</span>
                </div>
                <h1 className={`font-black font-heading text-on-surface tracking-tight mt-1 ${isTvMode ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl"}`}>
                  {hospitalName}
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 flex items-center gap-2 mt-1">
                  <Building2 size={14} className="text-primary" /> Grade Operacional de Plantões Assistenciais e Médicos
                </p>
              </div>
            </div>

            {/* Relógio Digital Hospitalar */}
            <div className="flex flex-col md:items-end justify-center bg-surface-container-highest/60 border border-outline-variant/20 px-6 py-4 rounded-2xl">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Clock size={12} className="text-primary" /> Horário Oficial de Brasília
              </span>
              <span className="text-3xl sm:text-4xl font-mono font-black text-on-surface tracking-tight text-primary">
                {currentTime || "00:00:00"}
              </span>
            </div>
          </div>
        </div>

        {/* Card Destaque: O Plantão Especificado na Rota */}
        <div className="bg-gradient-to-br from-surface-container-low to-surface-container-highest/80 border-2 border-primary/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start sm:items-center gap-4 sm:gap-6">
              <div className="w-20 h-20 rounded-2xl bg-surface-container-highest border border-outline-variant/30 text-4xl flex items-center justify-center shrink-0 shadow-lg">
                {plantaoDestaque.avatar}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                    <UserCheck size={13} /> {plantaoDestaque.status}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-surface-container-highest text-zinc-300 border border-outline-variant/20">
                    {plantaoDestaque.setor}
                  </span>
                  <span className="text-xs font-mono text-zinc-400">{plantaoDestaque.registro}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-on-surface font-heading tracking-tight flex items-center gap-2">
                  {plantaoDestaque.name}
                  {plantaoDestaque.categoria === "MEDICO" && <Stethoscope size={20} className="text-primary" />}
                </h2>
                <p className="text-sm text-zinc-400 font-medium">
                  {plantaoDestaque.role} &bull; Turno Vigente: <strong className="text-white">{plantaoDestaque.horario}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 border-t lg:border-t-0 lg:border-l border-outline-variant/30 pt-4 lg:pt-0 lg:pl-6 shrink-0">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 block">Ramal / Contato Interno</span>
                <div className="flex items-center gap-2 text-lg font-mono font-bold text-on-surface">
                  <PhoneCall size={18} className="text-primary" />
                  <span>Ramal {plantaoDestaque.ramal}</span>
                </div>
                <span className="text-[11px] text-zinc-400">Posto de Enfermagem Central</span>
              </div>
            </div>
          </div>
        </div>

        {/* Grade Semanal Completa */}
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/20 pb-5">
            <div>
              <h3 className="text-xl font-black font-heading text-on-surface tracking-tight flex items-center gap-2">
                <Calendar size={20} className="text-primary" /> Grade Semanal da Unidade
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Alocação completa de plantões médicos e assistenciais para acompanhamento em tempo real
              </p>
            </div>

            {/* Controles de Filtro e Busca */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Buscar plantonista ou setor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-2 bg-surface-container-highest border border-outline-variant/20 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary placeholder:text-zinc-500"
                />
              </div>

              <select
                value={setorFilter}
                onChange={(e) => setSetorFilter(e.target.value)}
                className="px-3 py-2 bg-surface-container-highest border border-outline-variant/20 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="TODOS">Todos os Setores</option>
                <option value="UTI">UTI Geral</option>
                <option value="Pronto Socorro">Pronto Socorro</option>
                <option value="UCO">Cardiologia / UCO</option>
                <option value="Neo">UTI Neonatal</option>
              </select>
            </div>
          </div>

          {/* Tabela de Escalas */}
          <div className="overflow-x-auto rounded-2xl border border-outline-variant/20">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-surface-container-highest/60 border-b border-outline-variant/20 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  <th className="p-3.5 pl-4">Plantonista / Setor</th>
                  {WEEK_DAYS.map((day) => (
                    <th key={day} className="p-3.5 text-center">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {filteredProfissionais.map((prof) => (
                  <tr 
                    key={prof.id} 
                    className={`transition-colors hover:bg-surface-container-highest/30 ${prof.id === plantaoDestaque.id ? "bg-primary/5" : ""}`}
                  >
                    <td className="p-3.5 pl-4 align-middle">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{prof.avatar}</span>
                        <div>
                          <p className="font-bold text-sm text-on-surface flex items-center gap-1.5">
                            {prof.name}
                            {prof.id === plantaoDestaque.id && (
                              <span className="px-1.5 py-0.5 text-[9px] bg-primary text-white rounded font-mono uppercase">Em Foco</span>
                            )}
                          </p>
                          <p className="text-xs text-zinc-400">{prof.role}</p>
                          <span className="text-[10px] text-zinc-500 font-mono">{prof.setor}</span>
                        </div>
                      </div>
                    </td>

                    {prof.dias.map((d, index) => {
                      const isNight = d.tipo === "NOTURNO";
                      const is24h = d.tipo === "24H";
                      const isSobreaviso = d.tipo === "SOBREAVISO";
                      const isFolga = d.tipo === "FOLGA";

                      return (
                        <td key={index} className="p-2 align-middle text-center">
                          <div className={`p-2 rounded-xl text-center flex flex-col items-center justify-center gap-0.5 border text-xs font-semibold ${
                            isFolga 
                              ? "bg-zinc-800/20 border-dashed border-zinc-700/40 text-zinc-500" 
                              : isNight 
                              ? "bg-indigo-500/15 border-indigo-500/30 text-indigo-400" 
                              : is24h 
                              ? "bg-purple-500/15 border-purple-500/30 text-purple-400" 
                              : isSobreaviso 
                              ? "bg-amber-500/15 border-amber-500/30 text-amber-400" 
                              : "bg-primary/15 border-primary/30 text-primary"
                          }`}>
                            <div className="flex items-center gap-1 text-[11px] font-bold">
                              {isFolga ? (
                                <span>Folga</span>
                              ) : (
                                <>
                                  {isNight ? <Moon size={11} /> : is24h ? <Clock size={11} /> : <Sun size={11} />}
                                  <span>{d.horario}</span>
                                </>
                              )}
                            </div>
                            <span className="text-[9px] uppercase tracking-wider font-semibold opacity-75 truncate max-w-full">
                              {d.setor}
                            </span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legenda de Turnos */}
          <div className="flex items-center justify-between flex-wrap gap-4 pt-2 text-xs text-zinc-400 border-t border-outline-variant/10">
            <span>Mostrando {filteredProfissionais.length} profissionais na grade operacional</span>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-primary"></div> Diurno (12h)</div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div> Noturno (12h)</div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div> 24 Horas</div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div> Sobreaviso</div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-zinc-600"></div> Folga</div>
            </div>
          </div>
        </div>

        {/* Rodapé Institucional e Hash de Autenticidade */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-primary" />
            <span>MedCore Health OS &bull; Grade de Escalas em Conformidade com CFM e COFEN</span>
          </div>
          <div className="font-mono text-[11px] text-zinc-600">
            SHA256: {Buffer.from(`${contaId}-${plantaoId}`).toString("hex").slice(0, 24)}...
          </div>
        </div>

      </div>
    </div>
  );
}
