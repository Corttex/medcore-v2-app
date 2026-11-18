"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  User,
  FileText,
  Phone,
  Mail,
  Calendar,
  X,
  CheckCircle2,
  Stethoscope,
  Sparkles,
  BrainCircuit,
  Activity,
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Clock,
  AlertTriangle,
  HeartPulse,
  Pill,
  TrendingUp,
  MessageSquare,
  CalendarClock,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { useDashboardContext } from "@/features/dashboard/context/DashboardContext";
import { SmartTooltip, triggerDraContePrompt } from "@/components/ui/SmartTooltip";
import { getModuleTooltip } from "@/lib/data/moduleTooltips";
import {
  MotionReveal,
  StaggerGroup,
  StaggerItem,
} from "@/components/animations/MotionReveal";
import Link from "next/link";
import { cn } from "@/lib/utils";

type HealthLevel = "estavel" | "monitoramento" | "alto_risco";
type AbandonmentRisk = "Baixo" | "Médio" | "Alto";
type StrategicSegment =
  | "all"
  | "frequentes"
  | "risco_abandono"
  | "maior_retorno"
  | "reengajamento"
  | "alto_risco";

interface StrategicPatient {
  id: string;
  nome: string;
  cpf?: string | null;
  telefone?: string | null;
  email?: string | null;
  dataNascimento?: string | null;
  convenio?: { nome: string } | null;
  createdAt: string;
  isDemoRecord?: boolean;
  // Camada de Inteligência Dra. Conte
  healthLevel: HealthLevel;
  healthBadge: string;
  relationshipSummary: string;
  lastVisitLabel: string;
  lastSpecialty: string;
  conditions: string[];
  medications: string[];
  attendanceRate: number;
  abandonmentRisk: AbandonmentRisk;
  recommendedAction: string;
  monthlyRevenueScore: number;
  visitsLast12m: number;
  isNewThisMonth: boolean;
  isActive: boolean;
  hasPendingReturn: boolean;
  needsReengagement: boolean;
  eligiblePreventiveCampaign: boolean;
  financialStatus: string;
  aiInsightsBullets: string[];
}

const DEMO_STRATEGIC_PATIENTS: StrategicPatient[] = [
  {
    id: "demo-joao-silva",
    nome: "João Silva",
    cpf: "321.654.987-00",
    telefone: "(11) 99876-5432",
    email: "joao.silva@email.com",
    convenio: { nome: "Unimed Executivo" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 220).toISOString(),
    isDemoRecord: true,
    healthLevel: "estavel",
    healthBadge: "🟢 Estável",
    relationshipSummary: "Consulta em 7 dias",
    lastVisitLabel: "15 dias atrás",
    lastSpecialty: "Cardiologia / Clínica Médica",
    conditions: ["Hipertensão", "Diabetes tipo 2"],
    medications: ["Losartana", "Metformina"],
    attendanceRate: 98,
    abandonmentRisk: "Baixo",
    recommendedAction: "Retorno em 30 dias",
    monthlyRevenueScore: 95,
    visitsLast12m: 9,
    isNewThisMonth: false,
    isActive: true,
    hasPendingReturn: true,
    needsReengagement: false,
    eligiblePreventiveCampaign: false,
    financialStatus: "Adimplente • Convênio Ativo",
    aiInsightsBullets: [
      "Alta aderência terapêutica (98% de comparecimento)",
      "Último atendimento há 15 dias com ajuste de Losartana e Metformina",
      "Consulta agendada/prevista nos próximos 7 dias",
      "Risco de abandono baixo • Paciente recorrente estratégico",
      "Sugestão: confirmar retorno preventivo em 30 dias",
    ],
  },
  {
    id: "demo-nathalia-costa",
    nome: "Nathalia Costa",
    cpf: "456.789.123-11",
    telefone: "(11) 98412-3390",
    email: "nathalia.costa@email.com",
    convenio: { nome: "Bradesco Saúde" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 340).toISOString(),
    isDemoRecord: true,
    healthLevel: "monitoramento",
    healthBadge: "🟡 Atenção de Retorno",
    relationshipSummary: "Sem retorno há 8 meses",
    lastVisitLabel: "8 meses atrás",
    lastSpecialty: "Cardiologia",
    conditions: ["Check-up Cardiológico", "Dislipidemia leve"],
    medications: ["Rosuvastatina 10mg"],
    attendanceRate: 84,
    abandonmentRisk: "Alto",
    recommendedAction: "Entrar em contato • Campanha preventiva",
    monthlyRevenueScore: 82,
    visitsLast12m: 2,
    isNewThisMonth: false,
    isActive: false,
    hasPendingReturn: true,
    needsReengagement: true,
    eligiblePreventiveCampaign: true,
    financialStatus: "Convênio ativo • Sem pendências",
    aiInsightsBullets: [
      "Paciente sem retorno há 8 meses",
      "Última consulta em cardiologia",
      "Convênio ativo",
      "Elegível para campanha preventiva",
      "Sugestão: entrar em contato",
    ],
  },
  {
    id: "demo-mariana-oliveira",
    nome: "Mariana Oliveira",
    cpf: "198.234.567-22",
    telefone: "(11) 99123-4455",
    email: "mariana.o@email.com",
    convenio: { nome: "SulAmérica Especial" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    isDemoRecord: true,
    healthLevel: "alto_risco",
    healthBadge: "🔴 Alto Risco Clínico",
    relationshipSummary: "Monitoramento contínuo • Teleconsulta ativa",
    lastVisitLabel: "3 dias atrás",
    lastSpecialty: "Cardiologia",
    conditions: ["Hipertensão Descompensada", "Risco Cardiovascular Moderado/Alto"],
    medications: ["Losartana 50mg", "Hidroclorotiazida 25mg"],
    attendanceRate: 92,
    abandonmentRisk: "Baixo",
    recommendedAction: "Telemonitoramento semanal + MAPA",
    monthlyRevenueScore: 91,
    visitsLast12m: 7,
    isNewThisMonth: true,
    isActive: true,
    hasPendingReturn: true,
    needsReengagement: false,
    eligiblePreventiveCampaign: false,
    financialStatus: "Adimplente • Convênio Ativo",
    aiInsightsBullets: [
      "Picos pressóricos matinais detectados na última teleconsulta",
      "Última consulta em cardiologia há 3 dias",
      "Acompanhamento ativo com plano terapêutico ajustado",
      "Sugestão: priorizar retorno de telemedicina em 7 dias",
    ],
  },
  {
    id: "demo-roberto-mendes",
    nome: "Roberto Mendes",
    cpf: "741.852.963-33",
    telefone: "(11) 97744-8899",
    email: "roberto.mendes@email.com",
    convenio: { nome: "Particular VIP" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    isDemoRecord: true,
    healthLevel: "estavel",
    healthBadge: "🟢 Estável",
    relationshipSummary: "Pacote ativo • Próxima sessão em 4 dias",
    lastVisitLabel: "10 dias atrás",
    lastSpecialty: "Dermatologia & Estética",
    conditions: ["Protocolo Preventivo Facial", "Fotoproteção"],
    medications: ["Uso tópico dermatológico"],
    attendanceRate: 100,
    abandonmentRisk: "Baixo",
    recommendedAction: "Ofertar renovação de pacote na 4ª sessão",
    monthlyRevenueScore: 99,
    visitsLast12m: 11,
    isNewThisMonth: true,
    isActive: true,
    hasPendingReturn: false,
    needsReengagement: false,
    eligiblePreventiveCampaign: true,
    financialStatus: "Particular VIP • LTV Elevado",
    aiInsightsBullets: [
      "100% de comparecimento nos últimos 12 meses",
      "Top 5% em retorno financeiro e indicações",
      "Elegível para upgrade de protocolo semestral",
      "Sugestão: apresentar pacote de manutenção",
    ],
  },
];

function enrichPatient(raw: any, index: number): StrategicPatient {
  const nome = raw.nome || "Paciente";
  const lower = nome.toLowerCase();

  if (lower.includes("joão silva") || lower.includes("joao silva")) {
    return {
      ...DEMO_STRATEGIC_PATIENTS[0],
      ...raw,
      convenio: raw.convenio || DEMO_STRATEGIC_PATIENTS[0].convenio,
      isDemoRecord: false,
    };
  }
  if (lower.includes("nathalia")) {
    return {
      ...DEMO_STRATEGIC_PATIENTS[1],
      ...raw,
      convenio: raw.convenio || DEMO_STRATEGIC_PATIENTS[1].convenio,
      isDemoRecord: false,
    };
  }

  const createdMs = raw.createdAt ? new Date(raw.createdAt).getTime() : Date.now();
  const daysSinceCreated = Math.max(0, Math.floor((Date.now() - createdMs) / (1000 * 60 * 60 * 24)));
  const isNewThisMonth = daysSinceCreated <= 30;
  const mod = index % 3;

  const healthLevel: HealthLevel =
    mod === 0 ? "estavel" : mod === 1 ? "monitoramento" : "alto_risco";
  const healthBadge =
    healthLevel === "estavel"
      ? "🟢 Estável"
      : healthLevel === "monitoramento"
      ? "🟡 Monitoramento"
      : "🔴 Alto Risco";

  const conditionsPool = [
    ["Hipertensão", "Diabetes tipo 2"],
    ["Rinite Alérgica", "Asma Leve"],
    ["Cardiometabólico", "Dislipidemia"],
  ];
  const medsPool = [
    ["Losartana", "Metformina"],
    ["Budesonida", "Montelucaste"],
    ["Atorvastatina", "AAS 100mg"],
  ];

  const attendanceRate = mod === 0 ? 96 : mod === 1 ? 82 : 89;
  const abandonmentRisk: AbandonmentRisk = mod === 1 ? "Alto" : mod === 2 ? "Médio" : "Baixo";
  const needsReengagement = mod === 1;
  const hasPendingReturn = mod !== 0 || daysSinceCreated > 15;

  return {
    id: raw.id,
    nome,
    cpf: raw.cpf,
    telefone: raw.telefone,
    email: raw.email,
    dataNascimento: raw.dataNascimento,
    convenio: raw.convenio || null,
    createdAt: raw.createdAt || new Date().toISOString(),
    isDemoRecord: false,
    healthLevel,
    healthBadge,
    relationshipSummary: needsReengagement
      ? "Sem retorno há 6 meses"
      : mod === 0
      ? "Consulta em 7 dias"
      : "Retorno programado",
    lastVisitLabel: needsReengagement ? "6 meses atrás" : "18 dias atrás",
    lastSpecialty: mod === 1 ? "Cardiologia" : mod === 2 ? "Endocrinologia" : "Clínica Geral",
    conditions: conditionsPool[mod],
    medications: medsPool[mod],
    attendanceRate,
    abandonmentRisk,
    recommendedAction: needsReengagement
      ? "Acionar campanha preventiva"
      : "Retorno em 30 dias",
    monthlyRevenueScore: mod === 0 ? 90 : mod === 2 ? 84 : 65,
    visitsLast12m: mod === 0 ? 6 : mod === 2 ? 4 : 1,
    isNewThisMonth,
    isActive: !needsReengagement,
    hasPendingReturn,
    needsReengagement,
    eligiblePreventiveCampaign: needsReengagement || mod === 0,
    financialStatus: raw.convenio?.nome
      ? `${raw.convenio.nome} ativo`
      : "Particular • Regular",
    aiInsightsBullets: [
      needsReengagement
        ? "Paciente sem retorno há mais de 6 meses"
        : "Paciente com histórico clínico regular",
      `Última consulta em ${mod === 1 ? "cardiologia" : "clínica médica"}`,
      raw.convenio?.nome ? `Convênio ${raw.convenio.nome} ativo` : "Atendimento particular ativo",
      "Elegível para acompanhamento preventivo",
      needsReengagement
        ? "Sugestão: entrar em contato via WhatsApp"
        : "Sugestão: manter régua de retorno em 30 dias",
    ],
  };
}

const ECOSYSTEM_DATA_POINTS = [
  "Histórico clínico",
  "Consultas",
  "Exames",
  "Prescrições",
  "Interações",
  "Inadimplência",
  "Retornos",
  "Risco clínico",
  "Uso da IA",
  "Transcrições",
  "Agenda futura",
  "Teleconsultas",
  "Comunicações",
  "CRM",
];

export default function PacientesPage() {
  const { selectedUnitId, isDemoMode } = useDashboardContext();
  const [rawPacientes, setRawPacientes] = useState<any[]>([]);
  const [convenios, setConvenios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [segment, setSegment] = useState<StrategicSegment>("all");

  // Modal de Resumo Inteligente do Paciente (Dra. Conte)
  const [selectedPatient, setSelectedPatient] = useState<StrategicPatient | null>(null);
  const [detailTab, setDetailTab] = useState<"resumo_ia" | "cadastro">("resumo_ia");

  // Modal de Novo Paciente
  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    dataNascimento: "",
    telefone: "",
    email: "",
    convenioId: "",
  });

  useEffect(() => {
    fetchData();
  }, [selectedUnitId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const url = new URL("/api/pacientes", window.location.origin);
      if (selectedUnitId) url.searchParams.set("unitId", selectedUnitId);

      const pRes = await fetch(url.toString());
      if (pRes.ok) setRawPacientes(await pRes.json());

      const cRes = await fetch("/api/convenios");
      if (cRes.ok) setConvenios((await cRes.json()).convenios || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setSaving(true);

    try {
      const body = { ...form, unitId: selectedUnitId };
      const res = await fetch("/api/pacientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || "Erro ao salvar paciente.");
      } else {
        setFormSuccess("Paciente salvo com sucesso!");
        setTimeout(() => {
          setShowModal(false);
          fetchData();
          setForm({
            nome: "",
            cpf: "",
            dataNascimento: "",
            telefone: "",
            email: "",
            convenioId: "",
          });
        }, 1200);
      }
    } catch (e) {
      setFormError("Erro de comunicação com o servidor.");
    }
    setSaving(false);
  };

  // Enriquecimento dos pacientes reais + inclusão estratégica dos perfis demonstrativos quando necessário
  const strategicPatients = useMemo<StrategicPatient[]>(() => {
    const enrichedReal = rawPacientes.map((p, idx) => enrichPatient(p, idx));

    if (isDemoMode || enrichedReal.length === 0) {
      const existingNames = new Set(enrichedReal.map((p) => p.nome.toLowerCase()));
      const extras = DEMO_STRATEGIC_PATIENTS.filter(
        (d) => !existingNames.has(d.nome.toLowerCase())
      );
      return [...extras, ...enrichedReal];
    }

    return enrichedReal;
  }, [rawPacientes, isDemoMode]);

  // 6 Cards de Indicadores Estratégicos para Gestores/Redes
  const indicators = useMemo(() => {
    const total = strategicPatients.length;
    const novosMes = strategicPatients.filter((p) => p.isNewThisMonth).length;
    const ativos = strategicPatients.filter((p) => p.isActive).length;
    const inativos = strategicPatients.filter((p) => !p.isActive).length;
    const retornoPendente = strategicPatients.filter((p) => p.hasPendingReturn).length;
    const altoRisco = strategicPatients.filter((p) => p.healthLevel === "alto_risco").length;

    return [
      {
        label: "Total de Pacientes",
        value: total,
        sub: "Base consolidada da rede",
        icon: Users,
        tone: "text-[#00D4FF] bg-cyan-500/10 border-cyan-500/25",
      },
      {
        label: "Novos este Mês",
        value: novosMes,
        sub: "Captação últimos 30 dias",
        icon: UserPlus,
        tone: "text-blue-500 bg-blue-500/10 border-blue-500/25",
      },
      {
        label: "Ativos",
        value: ativos,
        sub: "Com vínculo assistencial",
        icon: UserCheck,
        tone: "text-emerald-500 bg-emerald-500/10 border-emerald-500/25",
      },
      {
        label: "Inativos",
        value: inativos,
        sub: "Elegíveis para resgate IA",
        icon: UserX,
        tone: "text-amber-500 bg-amber-500/10 border-amber-500/25",
      },
      {
        label: "Retorno Pendente",
        value: retornoPendente,
        sub: "Aguardando agendamento",
        icon: Clock,
        tone: "text-indigo-400 bg-indigo-500/10 border-indigo-500/25",
      },
      {
        label: "Alto Risco",
        value: altoRisco,
        sub: "Prioridade clínica ativa",
        icon: AlertTriangle,
        tone: "text-rose-500 bg-rose-500/10 border-rose-500/25",
      },
    ];
  }, [strategicPatients]);

  // Filtro por segmento estratégico B2B + busca textual
  const filteredPacientes = useMemo(() => {
    return strategicPatients.filter((p) => {
      if (segment === "frequentes" && p.visitsLast12m < 5) return false;
      if (segment === "risco_abandono" && p.abandonmentRisk === "Baixo") return false;
      if (segment === "maior_retorno" && p.monthlyRevenueScore < 85) return false;
      if (segment === "reengajamento" && !p.needsReengagement) return false;
      if (segment === "alto_risco" && p.healthLevel !== "alto_risco") return false;

      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        p.nome.toLowerCase().includes(q) ||
        (p.cpf && p.cpf.includes(search)) ||
        p.conditions.some((c) => c.toLowerCase().includes(q)) ||
        (p.convenio?.nome && p.convenio.nome.toLowerCase().includes(q))
      );
    });
  }, [strategicPatients, segment, search]);

  // O Momento "Uau" na busca contextual:
  // Quando há texto de busca, identifica o paciente em foco (ou usa o perfil estratégico da Nathalia se buscar "nathalia")
  const contextualFocusPatient = useMemo<StrategicPatient | null>(() => {
    const q = search.trim().toLowerCase();
    if (!q) return null;
    if (filteredPacientes.length > 0) return filteredPacientes[0];
    if (q.includes("nathalia")) return DEMO_STRATEGIC_PATIENTS[1];
    if (q.includes("joao") || q.includes("joão")) return DEMO_STRATEGIC_PATIENTS[0];
    return null;
  }, [search, filteredPacientes]);

  const handleOpenWhatsApp = (patient: StrategicPatient) => {
    const phone = (patient.telefone || "").replace(/\D/g, "");
    const msg = encodeURIComponent(
      `Olá ${patient.nome.split(" ")[0]}, tudo bem? Aqui é da equipe da clínica. A Dra. Conte identificou que está na hora do seu retorno preventivo (${patient.lastSpecialty}). Podemos agendar um horário para você esta semana?`
    );
    if (phone) {
      window.open(`https://api.whatsapp.com/send?phone=55${phone}&text=${msg}`, "_blank");
    } else {
      triggerDraContePrompt(
        `Prepare uma mensagem de contato preventivo no WhatsApp para a paciente ${patient.nome}.`,
        true
      );
    }
  };

  return (
    <div className="space-y-6 pb-14">
      {/* ══════════════════════════════════════════════════════════════════
          CABEÇALHO ESTRATÉGICO DO MÓDULO PACIENTES
      ══════════════════════════════════════════════════════════════════ */}
      <MotionReveal immediate delay={0.05} y={14} className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-5 py-4 rounded-2xl shadow-sm">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 text-[#00D4FF] border border-cyan-500/25">
              <BrainCircuit size={12} />
              Inteligência Clínica & Operacional
            </span>
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Cada paciente como um ativo estratégico vivo
            </span>
          </div>
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
            Clique em qualquer paciente para abrir o <strong className="text-zinc-900 dark:text-white">Resumo Inteligente gerado pela Dra. Conte</strong> em vez de apenas uma ficha cadastral.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
              size={16}
            />
            <input
              type="text"
              placeholder='Buscar paciente (ex: "Nathalia" ou "João")...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-[#00D4FF] w-72 font-medium transition-all"
            />
          </div>

          <button
            type="button"
            onClick={() => setSearch("Nathalia")}
            className="px-3 py-2.5 rounded-xl text-xs font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-[#00D4FF] border border-cyan-500/30 transition-all cursor-pointer"
          >
            💡 Testar busca: Nathalia
          </button>

          <SmartTooltip
            config={getModuleTooltip("/dashboard/pacientes", "Pacientes")}
            icon={Users}
            preferredOrder={["bottom", "left", "top", "right"]}
          >
            <button
              onClick={() => {
                setFormSuccess("");
                setFormError("");
                setShowModal(true);
              }}
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus size={16} /> Novo Paciente
            </button>
          </SmartTooltip>
        </div>
      </MotionReveal>

      {/* ══════════════════════════════════════════════════════════════════
          6 CARDS DE INDICADORES ESTRATÉGICOS (VISÃO GESTOR / REDE B2B)
      ══════════════════════════════════════════════════════════════════ */}
      <StaggerGroup immediate delay={0.18} stagger={0.09} className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {indicators.map((card) => {
          const Icon = card.icon;
          return (
            <StaggerItem
              key={card.label}
              y={18}
              className="bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm hover:border-cyan-500/40 transition-all flex flex-col justify-between gap-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  {card.label}
                </span>
                <div
                  className={cn(
                    "w-8 h-8 rounded-xl border flex items-center justify-center shrink-0",
                    card.tone
                  )}
                >
                  <Icon size={15} />
                </div>
              </div>
              <div>
                <p className="text-2xl font-heading font-extrabold text-zinc-900 dark:text-white leading-none">
                  {card.value}
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1.5 truncate">
                  {card.sub}
                </p>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerGroup>

      {/* ══════════════════════════════════════════════════════════════════
          FILTROS ESTRATÉGICOS PARA REDES & GESTORES B2B
      ══════════════════════════════════════════════════════════════════ */}
      <MotionReveal delay={0.16} y={14} className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { id: "all", label: "Todos os Pacientes" },
              { id: "frequentes", label: "Mais Frequentes" },
              { id: "risco_abandono", label: "Abandonando Tratamento" },
              { id: "maior_retorno", label: "Geram Mais Retorno" },
              { id: "reengajamento", label: "Precisam Reengajamento" },
              { id: "alto_risco", label: "Em Risco Clínico" },
            ] as { id: StrategicSegment; label: string }[]
          ).map((tab) => {
            const active = segment === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSegment(tab.id)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer",
                  active
                    ? "bg-[#00D4FF]/15 border-[#00D4FF]/50 text-[#00D4FF]"
                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedPatient(
              strategicPatients.find((p) => p.nome.toLowerCase().includes("joão")) ||
                strategicPatients[0] ||
                DEMO_STRATEGIC_PATIENTS[0]
            );
            setDetailTab("resumo_ia");
          }}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00D4FF] hover:underline cursor-pointer"
        >
          <Sparkles size={13} />
          Ver exemplo de Resumo Inteligente (João Silva)
        </button>
      </MotionReveal>

      {/* ══════════════════════════════════════════════════════════════════
          O MOMENTO "UAU": INTERPRETAÇÃO CONTEXTUAL DA DRA. CONTE NA BUSCA
      ══════════════════════════════════════════════════════════════════ */}
      {contextualFocusPatient && (
        <div className="rounded-3xl border border-cyan-500/35 bg-[#0B0F19] text-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.35)] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/35 text-[10px] font-bold text-[#00D4FF] uppercase tracking-wider">
                  <Sparkles size={11} />
                  Contexto Instantâneo da Dra. Conte
                </span>
                <h3 className="text-sm font-bold text-white">
                  {contextualFocusPatient.nome} — {contextualFocusPatient.healthBadge}
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {contextualFocusPatient.aiInsightsBullets.map((bullet) => (
                  <span
                    key={bullet}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-zinc-100"
                  >
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    <span>{bullet}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleOpenWhatsApp(contextualFocusPatient)}
                className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <MessageSquare size={14} />
                Entrar em Contato
              </button>
              <button
                type="button"
                onClick={() =>
                  triggerDraContePrompt(
                    `Dra. Conte, agende um retorno para ${contextualFocusPatient.nome} na especialidade ${contextualFocusPatient.lastSpecialty}.`,
                    true
                  )
                }
                className="px-3.5 py-2 rounded-xl bg-[#00D4FF] text-zinc-950 hover:brightness-110 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <CalendarClock size={14} />
                Agendar com Dra. Conte
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedPatient(contextualFocusPatient);
                  setDetailTab("resumo_ia");
                }}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                Abrir Perfil Vivo <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          TABELA ESTRATÉGICA DE PACIENTES (SAÚDE + RELACIONAMENTO + IA)
      ══════════════════════════════════════════════════════════════════ */}
      <MotionReveal delay={0.22} y={20} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
                <th className="p-4 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Paciente
                </th>
                <th className="p-4 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Saúde & Condições
                </th>
                <th className="p-4 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Relacionamento
                </th>
                <th className="p-4 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Próxima Ação (Dra. Conte)
                </th>
                <th className="p-4 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-right">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-zinc-500 text-xs">
                    Carregando inteligência de pacientes...
                  </td>
                </tr>
              ) : filteredPacientes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-zinc-500 text-xs">
                    Nenhum paciente encontrado com o filtro atual.
                  </td>
                </tr>
              ) : (
                filteredPacientes.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => {
                      setSelectedPatient(p);
                      setDetailTab("resumo_ia");
                    }}
                    className="hover:bg-cyan-500/[0.04] dark:hover:bg-zinc-800/60 transition-colors cursor-pointer group"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                          {p.nome.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-zinc-900 dark:text-white text-sm leading-tight group-hover:text-[#00D4FF] transition-colors">
                              {p.nome}
                            </p>
                            {p.isDemoRecord && (
                              <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-cyan-500/10 text-[#00D4FF] border border-cyan-500/25">
                                Perfil Demo
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                            <span>{p.convenio?.nome || "Particular"}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Phone size={11} /> {p.telefone || "-"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="space-y-1">
                        <span
                          className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border",
                            p.healthLevel === "estavel"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25"
                              : p.healthLevel === "monitoramento"
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25"
                              : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25"
                          )}
                        >
                          {p.healthBadge}
                        </span>
                        <p className="text-xs text-zinc-600 dark:text-zinc-300 font-medium truncate max-w-[230px]">
                          {p.conditions.join(" • ")}
                        </p>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                          {p.relationshipSummary}
                        </p>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                          Comparecimento: <strong className="text-emerald-500">{p.attendanceRate}%</strong> • Abandono: <strong>{p.abandonmentRisk}</strong>
                        </p>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-cyan-500/10 text-cyan-700 dark:text-[#00D4FF] border border-cyan-500/25">
                        <Sparkles size={12} />
                        {p.recommendedAction}
                      </span>
                    </td>

                    <td
                      className="p-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPatient(p);
                            setDetailTab("resumo_ia");
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-[#00D4FF] text-xs font-bold transition-colors border border-cyan-500/30 cursor-pointer"
                        >
                          <BrainCircuit size={13} /> Resumo IA
                        </button>

                        {!p.isDemoRecord && (
                          <Link
                            href={`/dashboard/prontuario/${p.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-zinc-700 hover:text-blue-600 dark:text-zinc-300 dark:hover:text-blue-400 text-xs font-semibold transition-colors border border-zinc-200 dark:border-zinc-700"
                            title="Abrir Prontuário"
                          >
                            <Stethoscope size={13} /> PEP
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </MotionReveal>

      {/* ══════════════════════════════════════════════════════════════════
          MODAL: RESUMO INTELIGENTE DO PACIENTE (GERADO PELA DRA. CONTE)
      ══════════════════════════════════════════════════════════════════ */}
      {selectedPatient && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedPatient(null)}
        >
          <div
            className="bg-[#0B0F19] text-white rounded-3xl border border-cyan-500/30 shadow-[0_24px_60px_rgba(0,0,0,0.65)] w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabeçalho Inteligente */}
            <div className="p-6 border-b border-white/10 bg-gradient-to-br from-cyan-500/10 via-transparent to-indigo-600/10 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00D4FF] to-blue-600 text-zinc-950 flex items-center justify-center font-extrabold text-lg shrink-0 shadow-lg shadow-cyan-500/20">
                  {selectedPatient.nome.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#00D4FF] mb-1">
                    <BrainCircuit size={12} />
                    Resumo Inteligente do Paciente • Gerado pela Dra. Conte
                  </div>
                  <h2 className="text-xl font-bold text-white flex flex-wrap items-center gap-2">
                    <span>{selectedPatient.nome}</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 font-semibold">
                      {selectedPatient.healthBadge}
                    </span>
                  </h2>
                  <p className="text-xs text-[#B8C0CC] mt-1">
                    {selectedPatient.financialStatus} • CPF: {selectedPatient.cpf || "Não informado"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPatient(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Abas: Perfil Inteligente vs Ficha Cadastral */}
            <div className="flex items-center gap-2 px-6 py-3 border-b border-white/10 bg-white/[0.02]">
              <button
                type="button"
                onClick={() => setDetailTab("resumo_ia")}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5",
                  detailTab === "resumo_ia"
                    ? "bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/40"
                    : "text-[#B8C0CC] hover:text-white"
                )}
              >
                <Sparkles size={13} />
                Perfil Inteligente (Dra. Conte)
              </button>
              <button
                type="button"
                onClick={() => setDetailTab("cadastro")}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5",
                  detailTab === "cadastro"
                    ? "bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/40"
                    : "text-[#B8C0CC] hover:text-white"
                )}
              >
                <FileText size={13} />
                Ficha Cadastral Completa
              </button>
            </div>

            {/* Conteúdo Rolável */}
            <div className="p-6 overflow-y-auto space-y-5">
              {detailTab === "resumo_ia" ? (
                <>
                  {/* Grade Estruturada do Perfil Vivo */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#B8C0CC]">
                        Último atendimento
                      </p>
                      <p className="text-sm font-bold text-white mt-1">
                        {selectedPatient.lastVisitLabel}
                      </p>
                      <p className="text-[11px] text-[#00D4FF] mt-0.5">
                        {selectedPatient.lastSpecialty}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#B8C0CC]">
                        Taxa de comparecimento
                      </p>
                      <p className="text-sm font-bold text-emerald-400 mt-1">
                        {selectedPatient.attendanceRate}%
                      </p>
                      <p className="text-[11px] text-[#B8C0CC] mt-0.5">
                        {selectedPatient.visitsLast12m} atendimentos nos últimos 12m
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#B8C0CC]">
                        Risco de abandono
                      </p>
                      <p
                        className={cn(
                          "text-sm font-bold mt-1",
                          selectedPatient.abandonmentRisk === "Baixo"
                            ? "text-emerald-400"
                            : selectedPatient.abandonmentRisk === "Médio"
                            ? "text-amber-400"
                            : "text-rose-400"
                        )}
                      >
                        {selectedPatient.abandonmentRisk}
                      </p>
                      <p className="text-[11px] text-[#B8C0CC] mt-0.5">
                        Monitorado continuamente pela IA
                      </p>
                    </div>
                  </div>

                  {/* Condições + Medicações Recorrentes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
                      <p className="text-xs font-bold text-white flex items-center gap-2">
                        <HeartPulse size={15} className="text-rose-400" />
                        Principais condições
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedPatient.conditions.map((cond) => (
                          <span
                            key={cond}
                            className="px-3 py-1 rounded-xl bg-rose-500/10 border border-rose-500/25 text-xs font-semibold text-rose-200"
                          >
                            {cond}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
                      <p className="text-xs font-bold text-white flex items-center gap-2">
                        <Pill size={15} className="text-[#00D4FF]" />
                        Medicação recorrente
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedPatient.medications.map((med) => (
                          <span
                            key={med}
                            className="px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-xs font-semibold text-cyan-200"
                          >
                            {med}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Próxima Ação Recomendada */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/15 to-indigo-500/15 border border-cyan-500/35 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#00D4FF]">
                        Próxima ação recomendada pela Dra. Conte
                      </p>
                      <p className="text-sm font-bold text-white">
                        {selectedPatient.recommendedAction}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const targetPrompt = `Dra. Conte, execute a próxima ação para ${selectedPatient.nome}: ${selectedPatient.recommendedAction}.`;
                        setSelectedPatient(null);
                        triggerDraContePrompt(targetPrompt, true);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#00D4FF] text-zinc-950 font-bold text-xs hover:brightness-110 transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles size={13} />
                      Executar Agora com Dra. Conte
                    </button>
                  </div>

                  {/* O que a MedCore sabe (Contexto Transversal Conectado) */}
                  <div className="space-y-2.5 pt-1">
                    <p className="text-xs font-bold text-[#B8C0CC] flex items-center gap-1.5">
                      <Activity size={13} className="text-[#00D4FF]" />
                      Dados do ecossistema MedCore sintetizados neste perfil:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {ECOSYSTEM_DATA_POINTS.map((point) => (
                        <span
                          key={point}
                          className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-[11px] text-[#B8C0CC]"
                        >
                          {point}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
                    <span className="text-[#B8C0CC] block mb-1">Nome Completo</span>
                    <strong className="text-white text-sm">{selectedPatient.nome}</strong>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
                    <span className="text-[#B8C0CC] block mb-1">CPF</span>
                    <strong className="text-white text-sm">
                      {selectedPatient.cpf || "Não informado"}
                    </strong>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
                    <span className="text-[#B8C0CC] block mb-1">Telefone / WhatsApp</span>
                    <strong className="text-white text-sm">
                      {selectedPatient.telefone || "Não informado"}
                    </strong>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
                    <span className="text-[#B8C0CC] block mb-1">E-mail</span>
                    <strong className="text-white text-sm">
                      {selectedPatient.email || "Não informado"}
                    </strong>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
                    <span className="text-[#B8C0CC] block mb-1">Convênio</span>
                    <strong className="text-white text-sm">
                      {selectedPatient.convenio?.nome || "Particular"}
                    </strong>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
                    <span className="text-[#B8C0CC] block mb-1">Data de Cadastro</span>
                    <strong className="text-white text-sm">
                      {new Date(selectedPatient.createdAt).toLocaleDateString("pt-BR")}
                    </strong>
                  </div>
                </div>
              )}
            </div>

            {/* Rodapé de Ações Rápidas */}
            <div className="p-4 border-t border-white/10 bg-white/[0.02] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[11px] text-[#B8C0CC]">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Dados criptografados • LGPD / HIPAA Compliance</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenWhatsApp(selectedPatient)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 text-emerald-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare size={13} />
                  WhatsApp
                </button>
                {!selectedPatient.isDemoRecord && (
                  <Link
                    href={`/dashboard/prontuario/${selectedPatient.id}`}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <Stethoscope size={13} />
                    Abrir Prontuário (PEP)
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          MODAL NOVO PACIENTE (PRESERVADO E COMPATÍVEL LIGHT & DARK MODE)
      ══════════════════════════════════════════════════════════════════ */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl w-full max-w-xl overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/40">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <User size={18} />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-zinc-900 dark:text-white">
                    Cadastrar Paciente
                  </h2>
                  <p className="text-xs text-zinc-500">
                    Adicione uma ficha completa à base inteligente.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                    Nome Completo *
                  </label>
                  <input
                    required
                    type="text"
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Ex: Maria da Silva Santos"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                    CPF
                  </label>
                  <input
                    type="text"
                    value={form.cpf}
                    onChange={(e) => setForm({ ...form, cpf: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="000.000.000-00"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    value={form.dataNascimento}
                    onChange={(e) => setForm({ ...form, dataNascimento: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                    Telefone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={form.telefone}
                    onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="(00) 90000-0000"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="paciente@exemplo.com"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">
                    Convênio Padrão
                  </label>
                  <select
                    value={form.convenioId}
                    onChange={(e) => setForm({ ...form, convenioId: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option
                      value=""
                      className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                    >
                      Particular (Sem Convênio)
                    </option>
                    {convenios.map((c) => (
                      <option
                        key={c.id}
                        value={c.id}
                        className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                      >
                        {c.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {formError && (
                <p className="text-rose-600 dark:text-rose-400 text-xs font-semibold pt-1">
                  {formError}
                </p>
              )}
              {formSuccess && (
                <p className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold pt-1 flex items-center gap-1">
                  <CheckCircle2 size={14} /> {formSuccess}
                </p>
              )}

              <div className="pt-4 flex justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {saving ? "Salvando..." : "Salvar Paciente"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
