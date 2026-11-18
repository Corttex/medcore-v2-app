"use client";

import React, { useState, useEffect } from "react";
import { Teleconsulta, TelemedicinaStatus } from "@/features/telemedicina/types";
import { TelemedicinaActionBar } from "@/features/telemedicina/components/TelemedicinaActionBar";
import { TelemedicinaStats } from "@/features/telemedicina/components/TelemedicinaStats";
import { TelemedicinaList } from "@/features/telemedicina/components/TelemedicinaList";
import { NewTelemedicinaModal } from "@/features/telemedicina/components/NewTelemedicinaModal";
import { TelemedicinaRoomModal } from "@/features/telemedicina/components/TelemedicinaRoomModal";
import { DeviceTestModal } from "@/features/telemedicina/components/DeviceTestModal";
import {
  MotionReveal,
  StaggerGroup,
  StaggerItem,
} from "@/components/animations/MotionReveal";
import {
  Mic,
  Sparkles,
  CheckCircle2,
  BrainCircuit,
  FileText,
  Stethoscope,
  AlertTriangle,
  Activity,
  Video,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const DELIVERABLES = [
  "Fazer consulta online",
  "Gerar documentação automaticamente",
  "Auxiliar hipóteses diagnósticas",
  "Produzir laudos",
  "Criar prontuário",
  "Alimentar indicadores",
  "Dar suporte ao médico",
];

const CLINICAL_ASSISTANT_LIVE = [
  { label: "Escutando consulta", status: "Áudio clínico ativo", active: true },
  { label: "Gerando evolução médica", status: "Padrão SOAP contínuo", active: true },
  { label: "Sugerindo CID", status: "CID-10 I10 • E11.9", active: true },
  { label: "Sugerindo hipóteses diagnósticas", status: "3 correlações", active: true },
  { label: "Alertando sobre fatores de risco", status: "Pico pressórico 150x95", alert: true },
];

const DRA_CONTE_COPILOT_STATUS = [
  "Resumo automático em andamento",
  "Hipóteses diagnósticas encontradas",
  "Próximas ações sugeridas",
  "Documentação sendo preparada",
  "Alertas clínicos identificados",
];

const DEMO_CONSULTA: Teleconsulta = {
  id: "demo-consulta-ia",
  title: "Consulta Cardiológica Assistida por IA",
  description: "Acompanhamento de hipertensão arterial sistêmica e revisão medicamentosa.",
  date: new Date().toISOString().split("T")[0],
  time: "14:30",
  duration: 30,
  type: "teleconsulta",
  status: "sala_espera",
  link: "/telemedicina/demo-joao",
  tokenPublico: "demo-joao",
  paciente: {
    id: "demo-joao-silva",
    nome: "João Silva",
    cpf: "321.654.987-00",
    telefone: "(11) 99876-5432",
    convenio: { nome: "Unimed Executivo" },
  },
};

export default function TelemedicinaPage() {
  const [consultas, setConsultas] = useState<Teleconsulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("todas");

  // Modais
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isDeviceTestOpen, setIsDeviceTestOpen] = useState(false);
  const [activeRoomConsulta, setActiveRoomConsulta] = useState<Teleconsulta | null>(null);

  const fetchConsultas = async () => {
    try {
      const res = await fetch("/api/telemedicina");
      if (res.ok) {
        const data = await res.json();
        setConsultas(data);
      }
    } catch (err) {
      console.error("Erro ao carregar teleconsultas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultas();
    const interval = setInterval(fetchConsultas, 15000);
    return () => clearInterval(interval);
  }, []);

  const filteredConsultas = consultas.filter((c) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const nome = c.paciente?.nome?.toLowerCase() || "";
    const cpf = c.paciente?.cpf?.toLowerCase() || "";
    const conv = c.paciente?.convenio?.nome?.toLowerCase() || "";
    return nome.includes(query) || cpf.includes(query) || conv.includes(query);
  });

  const totalHoje = consultas.length;
  const totalEmEspera = consultas.filter((c) => c.status === "sala_espera").length;
  const totalEmAndamento = consultas.filter((c) => c.status === "em_andamento").length;
  const totalConcluidas = consultas.filter((c) => c.status === "concluido").length;

  const handleStatusChange = async (id: string, newStatus: TelemedicinaStatus) => {
    if (id === DEMO_CONSULTA.id) return;
    setConsultas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );

    try {
      await fetch(`/api/telemedicina/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Deseja realmente remover esta teleconsulta?")) return;

    setConsultas((prev) => prev.filter((c) => c.id !== id));
    try {
      await fetch(`/api/telemedicina/${id}`, { method: "DELETE" });
    } catch (err) {
      console.error("Erro ao deletar:", err);
    }
  };

  const handleEnterRoom = (consulta: Teleconsulta) => {
    setActiveRoomConsulta(consulta);
    if (consulta.status === "agendado" || consulta.status === "sala_espera") {
      handleStatusChange(consulta.id, "em_andamento");
    }
  };

  const handleFinishConsulta = async (id: string, prontuarioData: any) => {
    if (id === DEMO_CONSULTA.id) return;

    setConsultas((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: "concluido",
              prontuario: {
                ...c.prontuario,
                ...prontuarioData,
              },
            }
          : c
      )
    );

    try {
      await fetch(`/api/telemedicina/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "concluido",
          prontuarioData,
        }),
      });
    } catch (err) {
      console.error("Erro ao finalizar consulta:", err);
    }
  };

  const handleOpenLiveExperience = () => {
    const target =
      consultas.find((c) => c.status === "sala_espera") ||
      consultas.find((c) => c.status === "em_andamento") ||
      consultas[0] ||
      DEMO_CONSULTA;
    handleEnterRoom(target);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Action Bar Superior */}
      <MotionReveal immediate delay={0.05} y={14}>
        <TelemedicinaActionBar
          totalHoje={totalHoje}
          totalEmEspera={totalEmEspera}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenNewModal={() => setIsNewModalOpen(true)}
          onOpenDeviceTest={() => setIsDeviceTestOpen(true)}
        />
      </MotionReveal>

      {/* ══════════════════════════════════════════════════════════════════
          NÚCLEO ESTRATÉGICO: CONSULTA INTELIGENTE ASSISTIDA POR IA
          Telemedicina + IA Clínica + Dra. Conte como Copilota Central
      ══════════════════════════════════════════════════════════════════ */}
      <MotionReveal immediate delay={0.18} y={20} className="rounded-3xl border border-cyan-500/25 bg-[#0B0F19] text-white p-5 md:p-6 shadow-[0_16px_48px_rgba(0,0,0,0.35)] relative overflow-hidden">
        <div className="absolute -right-24 -top-24 w-72 h-72 bg-[#00D4FF]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-24 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          {/* Topo Narrativo + CTA Direto */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-bold text-[#00D4FF] uppercase tracking-wider">
                <Sparkles size={13} />
                <span>Telemedicina + IA Clínica + Dra. Conte</span>
              </div>
              <h2 className="text-xl md:text-2xl font-heading font-bold text-white tracking-tight">
                Consulta Inteligente Assistida por IA
              </h2>
              <p className="text-xs md:text-sm text-[#B8C0CC] leading-relaxed">
                Mais que uma videochamada: a <strong className="text-white">Dra. Conte</strong> atua como copilota clínica em tempo real, eliminando trabalho administrativo do médico e elevando o padrão assistencial da clínica.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handleOpenLiveExperience}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00D4FF] to-blue-600 text-zinc-950 font-bold text-xs shadow-lg shadow-cyan-500/25 hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Video size={15} />
                <span>Abrir Sala com Copilota IA</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* 7 Entregáveis de Valor Percebido pelo Gestor */}
          <StaggerGroup immediate delay={0.32} stagger={0.07} className="flex flex-wrap gap-2">
            {DELIVERABLES.map((item) => (
              <StaggerItem
                key={item}
                y={10}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-medium text-zinc-100"
              >
                <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                <span>{item}</span>
              </StaggerItem>
            ))}
          </StaggerGroup>

          {/* Dois Painéis Centrais Lado a Lado: Assistente Clínico Ativo + Dra. Conte Copilota */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Bloco 1: 🎙 Assistente Clínico Ativo */}
            <MotionReveal delay={0.22} y={18} className="rounded-2xl border border-cyan-500/25 bg-white/[0.03] p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/35 text-[#00D4FF] flex items-center justify-center shrink-0">
                    <Mic size={17} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      🎙 Assistente Clínico Ativo
                    </h3>
                    <p className="text-[11px] text-[#B8C0CC]">
                      Escuta clínica em tempo real integrada ao prontuário
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Em Escuta
                </span>
              </div>

              <StaggerGroup stagger={0.1} delay={0.1} className="space-y-2">
                {CLINICAL_ASSISTANT_LIVE.map((item) => (
                  <StaggerItem
                    key={item.label}
                    y={10}
                    className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl border text-xs ${
                      item.alert
                        ? "bg-amber-500/10 border-amber-500/35 text-amber-200"
                        : "bg-zinc-950/60 border-white/10 text-zinc-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {item.alert ? (
                        <AlertTriangle size={13} className="text-amber-400 shrink-0" />
                      ) : (
                        <Activity size={13} className="text-[#00D4FF] shrink-0" />
                      )}
                      <span className="font-medium truncate">{item.label}</span>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md shrink-0 ${
                        item.alert
                          ? "bg-amber-500/20 text-amber-300"
                          : "bg-cyan-500/10 text-[#00D4FF]"
                      }`}
                    >
                      {item.status}
                    </span>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </MotionReveal>

            {/* Bloco 2: Dra. Conte acompanhando esta teleconsulta */}
            <MotionReveal delay={0.36} y={18} className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-zinc-950/60 to-cyan-950/30 p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00D4FF] to-indigo-600 text-zinc-950 flex items-center justify-center shrink-0 shadow-md shadow-cyan-500/20">
                    <BrainCircuit size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Dra. Conte acompanhando esta teleconsulta
                    </h3>
                    <p className="text-[11px] text-[#B8C0CC]">
                      Copilota clínica & operacional conectada ao atendimento
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-[10px] font-bold text-[#00D4FF]">
                  <ShieldCheck size={11} />
                  CFM / LGPD
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {DRA_CONTE_COPILOT_STATUS.map((statusText) => (
                  <div
                    key={statusText}
                    className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      <span className="font-medium">{statusText}</span>
                    </div>
                    <span className="text-[10px] text-[#00D4FF] font-semibold">Ativo</span>
                  </div>
                ))}
              </div>
            </MotionReveal>
          </div>
        </div>
      </MotionReveal>

      {/* Cards Métricos Liquid Glass */}
      <MotionReveal delay={0.18} y={18}>
        <TelemedicinaStats
          totalHoje={totalHoje}
          totalEmEspera={totalEmEspera}
          totalEmAndamento={totalEmAndamento}
          totalConcluidas={totalConcluidas}
        />
      </MotionReveal>

      {/* Grid de Consultas com Abas Tipo Pílula */}
      {loading ? (
        <div className="p-12 flex flex-col items-center justify-center text-zinc-400 gap-3">
          <div className="w-8 h-8 border-3 border-rd-cyan/30 border-t-rd-cyan rounded-full animate-spin" />
          <p className="text-xs font-semibold">Carregando consultas assistidas por IA...</p>
        </div>
      ) : (
        <MotionReveal delay={0.22} y={20}>
          <TelemedicinaList
            consultas={filteredConsultas}
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
            onEnterRoom={handleEnterRoom}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
            onOpenNewModal={() => setIsNewModalOpen(true)}
          />
        </MotionReveal>
      )}

      {/* Modal de Nova Teleconsulta */}
      <NewTelemedicinaModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onCreated={(newC) => {
          setConsultas((prev) => [newC, ...prev]);
        }}
      />

      {/* Modal de Teste de Periféricos */}
      <DeviceTestModal
        isOpen={isDeviceTestOpen}
        onClose={() => setIsDeviceTestOpen(false)}
      />

      {/* Sala de Teleconsulta ao Vivo com Copilota Clínica Dra. Conte */}
      <TelemedicinaRoomModal
        consulta={activeRoomConsulta}
        isOpen={!!activeRoomConsulta}
        onClose={() => setActiveRoomConsulta(null)}
        onFinishConsulta={handleFinishConsulta}
      />
    </div>
  );
}
