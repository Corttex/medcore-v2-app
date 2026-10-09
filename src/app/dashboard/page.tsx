"use client";

import React, { useState, useEffect } from "react";
import { 
  Activity, Users, Clock, AlertCircle, TrendingUp, Zap, ShieldCheck, 
  ChevronRight, ArrowUpRight, ArrowDownRight, BrainCircuit, Download,
  Calendar, Layout, MessageSquare, ClipboardList, Building2, Settings2, Save
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDashboardContext } from "@/features/dashboard/context/DashboardContext";
import { useTheme } from "@/context/ThemeContext";
import { GsapAnimated } from "@/components/ui/GsapAnimated";

// DnD Imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy
} from '@dnd-kit/sortable';

import { DashboardWidget } from "@/features/dashboard/components/DashboardWidget";

// --- Custom Modern Chart Component (SVG-based) ---
const SparklineChart = ({ data, color = "brand" }: { data: number[], color?: string }) => {
  // Se não houver dados ou todos forem 0, desenha linha reta no fundo
  const isZero = !data || data.length === 0 || data.every(v => v === 0);
  const chartData = isZero ? [0, 0, 0, 0] : data;
  
  const max = Math.max(...chartData);
  const min = Math.min(...chartData);
  const range = max - min || 1;
  const width = 100;
  const height = 40;
  
  const points = chartData.map((val, i) => {
    const x = (i / (chartData.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width="100%" height="40" viewBox={`0 0 ${width} ${height}`} className="overflow-visible opacity-80">
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-brand)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--color-brand)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`M 0,${height} L ${points} L ${width},${height} Z`}
        fill={`url(#grad-${color})`}
        className="transition-all duration-1000"
      />
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        className={cn(
          "transition-all duration-1000",
          color === 'brand' ? "text-rd-cyan" : "text-emerald-500"
        )}
      />
    </svg>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  trend: string;
  description: string;
  icon: any;
  color: 'brand' | 'emerald' | 'amber' | 'red';
  chartData?: number[];
}

const StatCard = ({ title, value, trend, description, icon: Icon, color, chartData }: StatCardProps) => {
  const { theme } = useTheme();
  return (
    <div className={cn(
      "no-line-card !p-5 flex flex-col gap-3 group transition-all duration-500 hover:border-rd-cyan/30 h-full",
      theme === 'dark' ? "bg-zinc-900/40" : "bg-white border-zinc-200"
    )}>
      <div className="flex items-center justify-between">
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm border border-transparent shrink-0",
          color === 'emerald' ? "bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/20" : 
          color === 'amber' ? "bg-amber-500/10 text-amber-500 group-hover:bg-amber-500/20 group-hover:border-amber-500/20" : 
          color === 'red' ? "bg-red-500/10 text-red-500 group-hover:bg-red-500/20 group-hover:border-red-500/20" :
          "bg-rd-cyan/10 text-rd-cyan group-hover:bg-rd-cyan/20 group-hover:border-rd-cyan/20"
        )}>
          <Icon size={24} />
        </div>
        <div className={cn(
          "text-sm font-semibold px-2.5 py-1 rounded-full border tracking-widest flex items-center gap-1",
          trend.startsWith('+') && trend !== '+0%' && trend !== '+0' ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/5" : 
          trend.startsWith('-') ? "text-red-500 border-red-500/20 bg-red-500/5" :
          "text-zinc-500 border-zinc-500/20 bg-zinc-500/5"
        )}>
          {trend.startsWith('+') && trend !== '+0%' && trend !== '+0' ? <ArrowUpRight size={10} /> : trend.startsWith('-') ? <ArrowDownRight size={10} /> : null}
          {trend}
        </div>
      </div>
      
      <div className="flex-1">
        <h3 className={cn("text-[11px] font-heading font-semibold uppercase tracking-[0.2em] leading-none mb-2 opacity-90", theme === 'dark' ? "text-white/95" : "text-black/95")}>{title}</h3>
        <div className="flex items-baseline gap-2">
          <p className={cn(
            "text-4xl font-heading font-bold leading-tight tracking-tighter",
            theme === 'dark' ? "text-white/95" : "text-black/95"
          )}>{value}</p>
        </div>
        <p className={cn(
          "text-xs font-sans font-medium uppercase tracking-wide mt-1",
          theme === 'dark' ? "text-white/95" : "text-black/95"
        )}>{description}</p>
      </div>

      {chartData && (
        <div className={cn(
          "mt-2 pt-2 border-t transition-colors",
          theme === 'dark' ? "border-zinc-800/30" : "border-zinc-100"
        )}>
          <SparklineChart data={chartData} color={color === 'emerald' ? 'emerald' : 'brand'} />
        </div>
      )}
    </div>
  );
};


// Layout Definition
type WidgetLayout = { id: string; colSpan: string; visible: boolean };

const defaultLayout: WidgetLayout[] = [
  { id: "stat-efficiency", colSpan: "col-span-12 sm:col-span-6 lg:col-span-3", visible: true },
  { id: "stat-patients", colSpan: "col-span-12 sm:col-span-6 lg:col-span-3", visible: true },
  { id: "stat-meetings", colSpan: "col-span-12 sm:col-span-6 lg:col-span-3", visible: true },
  { id: "stat-reminders", colSpan: "col-span-12 sm:col-span-6 lg:col-span-3", visible: true },
  { id: "chart-occupancy", colSpan: "col-span-12 lg:col-span-6", visible: true },
  { id: "card-staff", colSpan: "col-span-12 lg:col-span-3", visible: true },
  { id: "card-audit", colSpan: "col-span-12 lg:col-span-3", visible: true },
  { id: "report-agenda", colSpan: "col-span-12 md:col-span-6 lg:col-span-4", visible: true },
  { id: "report-kanban", colSpan: "col-span-12 md:col-span-6 lg:col-span-4", visible: true },
  { id: "report-meetings", colSpan: "col-span-12 lg:col-span-4", visible: true },
  { id: "ai-insights", colSpan: "col-span-12", visible: true },
];

export default function DashboardPage() {
  const { selectedUnitId } = useDashboardContext();
  const { theme } = useTheme();
  
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [stats, setStats] = useState({
    patients: 0,
    meetingsToday: 0,
    totalCapacityToday: 60,
    reminders: 0,
    criticalAlerts: 0,
    faturamento: 0,
    notasPendentes: 0,
    efficiency: 0,
    efficiencyTrend: "0%",
    utiOccupancy: 0,
    surgeryOccupancy: 0,
    staffNursing: 0,
    staffMedicine: 0,
    staffTechs: 0,
    absenteeismRate: 0,
    aiPrediction: "Carregando...",
    aiCompliance: "Carregando...",
    aiOpportunities: "0"
  });
  
  // Customization State
  const [isEditMode, setIsEditMode] = useState(false);
  const [layout, setLayout] = useState<WidgetLayout[]>(defaultLayout);
  
  // Hydration fix
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("medcore-dashboard-layout");
    if (saved) {
      try {
        setLayout(JSON.parse(saved));
      } catch (e) {
        console.error("Invalid layout JSON");
      }
    }
  }, []);

  const saveLayout = (newLayout: WidgetLayout[]) => {
    setLayout(newLayout);
    localStorage.setItem("medcore-dashboard-layout", JSON.stringify(newLayout));
  };

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const res = await fetch("/api/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {}
    }
    if (selectedUnitId) fetchDashboardData();
  }, [selectedUnitId]);

  const handleRelatorioFull = () => {
    setIsGeneratingReport(true);
    setTimeout(() => {
      setIsGeneratingReport(false);
      alert("Relatório Executivo Full gerado com sucesso! Iniciando download...");
    }, 2000);
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

  // DnD Setup
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = layout.findIndex((item) => item.id === active.id);
      const newIndex = layout.findIndex((item) => item.id === over.id);
      saveLayout(arrayMove(layout, oldIndex, newIndex));
    }
  };

  const toggleVisibility = (id: string) => {
    const newLayout = layout.map(item => item.id === id ? { ...item, visible: !item.visible } : item);
    saveLayout(newLayout);
  };

  if (!isMounted) return null;

  if (!selectedUnitId) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in-95 duration-700">
        <div className="relative">
          <div className="absolute inset-0 bg-rd-cyan/20 blur-[100px] rounded-full animate-pulse"></div>
          <div className={cn(
            "w-24 h-24 rounded-[2rem] flex items-center justify-center relative z-10 border shadow-2xl transition-all duration-500",
            theme === 'dark' ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
          )}>
            <Building2 size={40} className="text-rd-cyan animate-bounce" />
          </div>
        </div>
        
        <div className="max-w-md space-y-4 relative z-10">
          <h2 className={cn(
            "font-heading text-4xl font-semibold tracking-tighter",
            theme === 'dark' ? "text-white" : "text-zinc-900"
          )}>
            Aguardando <br/>
            <span className="text-rd-cyan">Configuração</span>
          </h2>
          <p className={cn(
            "text-sm font-medium leading-relaxed",
            theme === 'dark' ? "text-zinc-500" : "text-zinc-400"
          )}>
            O ecossistema VitalFlow requer uma unidade hospitalar ativa para processar inteligência clínica e dados operacionais.
          </p>
        </div>

        <button 
          onClick={() => window.location.href = '/dashboard/hospitais'}
          className="btn-gradient px-10 py-5 rounded-2xl text-xs font-semibold uppercase tracking-widest shadow-xl shadow-rd-cyan/25 active:scale-95 transition-all"
        >
          Configurar Unidade Agora
        </button>
      </div>
    );
  }

  // Widget Renderers Map
  const widgetRenderers: Record<string, React.ReactNode> = {
    "stat-efficiency": (
      <StatCard title="Eficiência Operacional" value={`${stats.efficiency}%`} trend={stats.efficiencyTrend} description="Performance Geral" icon={Activity} color="brand" chartData={[]} />
    ),
    "stat-patients": (
      <StatCard title="Total de Pacientes" value={stats.patients.toLocaleString()} trend="+0" description="Base de Dados" icon={Users} color="brand" chartData={[]} />
    ),
    "stat-meetings": (
      <StatCard title="Consultas Hoje" value={stats.meetingsToday.toString()} trend="0" description="Agenda" icon={Calendar} color="emerald" chartData={[]} />
    ),
    "stat-reminders": (
      <StatCard title="Lembretes Pendentes" value={stats.reminders.toString()} trend={stats.reminders > 5 ? "Alta" : "Estável"} description="Ações Prioritárias" icon={AlertCircle} color="amber" />
    ),
    "chart-occupancy": (
      <div className={cn("no-line-card !p-6 space-y-6 transition-all duration-500 h-full", theme === 'dark' ? "bg-zinc-900/40" : "bg-white border-zinc-200")}>
        <div className={cn("flex items-center justify-between border-b pb-4", theme === 'dark' ? "border-zinc-800/50" : "border-zinc-100")}>
          <h2 className={cn("font-heading text-sm font-semibold uppercase tracking-[0.2em] flex items-center gap-3", theme === 'dark' ? "text-white/95" : "text-black/95")}>
            <TrendingUp size={18} className="text-rd-cyan" /> Ocupação Estrutural (Em Breve)
          </h2>
          <button onClick={handleRelatorioFull} disabled={isGeneratingReport} className={cn("text-sm font-semibold text-rd-cyan uppercase tracking-widest border border-rd-cyan/30 px-3 py-1.5 rounded-lg bg-rd-cyan/5 hover:bg-rd-cyan/10 transition-all flex items-center gap-2", isGeneratingReport && "opacity-50 cursor-wait")}>
            {isGeneratingReport ? <div className="w-3 h-3 border-2 border-rd-cyan border-t-transparent rounded-full animate-spin" /> : <Download size={14} />} Relatório Full
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
          <div className={cn("rounded-2xl p-4 border hover:border-rd-cyan/30 transition-all", theme === 'dark' ? "bg-zinc-950/50 border-zinc-800/50" : "bg-zinc-50 border-zinc-100")}>
            <p className={cn("text-[11px] font-heading font-semibold uppercase tracking-[0.2em] mb-3 opacity-90", theme === 'dark' ? "text-white/95" : "text-black/95")}>Leitos de UTI</p>
            <div className="flex items-end justify-between gap-2">
              <span className={cn("text-3xl font-heading font-bold tracking-tighter", theme === 'dark' ? "text-white/95" : "text-black/95")}>{stats.utiOccupancy}%</span>
              {stats.utiOccupancy > 80 && <span className="text-sm text-red-500 font-medium mb-1 uppercase tracking-tighter">Capacidade Crítica</span>}
            </div>
            <div className={cn("w-full h-2 rounded-full mt-3 overflow-hidden border", theme === 'dark' ? "bg-zinc-900 border-zinc-800" : "bg-zinc-200 border-zinc-300/50")}>
              <div className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full" style={{ width: `${stats.utiOccupancy}%` }}></div>
            </div>
          </div>
          <div className={cn("rounded-2xl p-4 border hover:border-rd-cyan/30 transition-all", theme === 'dark' ? "bg-zinc-950/50 border-zinc-800/50" : "bg-zinc-50 border-zinc-100")}>
            <p className={cn("text-[11px] font-heading font-semibold uppercase tracking-[0.2em] mb-3 opacity-90", theme === 'dark' ? "text-white/95" : "text-black/95")}>Bloco Cirúrgico</p>
            <div className="flex items-end justify-between gap-2">
              <span className={cn("text-3xl font-heading font-bold tracking-tighter", theme === 'dark' ? "text-white/95" : "text-black/95")}>{stats.surgeryOccupancy}%</span>
            </div>
            <div className={cn("w-full h-2 rounded-full mt-3 overflow-hidden border", theme === 'dark' ? "bg-zinc-900 border-zinc-800" : "bg-zinc-200 border-zinc-300/50")}>
              <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" style={{ width: `${stats.surgeryOccupancy}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    ),
    "card-staff": (
      <div className={cn("no-line-card !p-6 flex flex-col transition-all duration-500 h-full", theme === 'dark' ? "bg-zinc-900/40" : "bg-white border-zinc-200")}>
        <h2 className={cn("font-heading text-sm font-semibold uppercase tracking-[0.2em] flex items-center gap-3 border-b pb-4 mb-6", theme === 'dark' ? "text-white/95 border-zinc-800/50" : "text-black/95 border-zinc-100")}>
          <Zap size={18} className="text-rd-cyan" /> Saturação Staff
        </h2>
        <div className="flex-1 space-y-5">
           {[ { name: "Enfermagem", val: stats.staffNursing }, { name: "Medicina", val: stats.staffMedicine }, { name: "Técnicos", val: stats.staffTechs } ].map((item) => (
             <div key={item.name} className="space-y-2 opacity-50">
               <div className="flex justify-between text-[11px] font-heading font-semibold uppercase tracking-[0.2em] opacity-90">
                 <span className={cn(theme === 'dark' ? "text-white/95" : "text-black/95")}>{item.name}</span>
                 <span className={cn("font-heading font-bold text-sm", item.val > 90 ? "text-red-400" : item.val > 70 ? "text-amber-400" : "text-emerald-400")}>{item.val}%</span>
               </div>
               <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/50">
                  <div className={cn("h-full rounded-full transition-all duration-1000", item.val > 90 ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]" : item.val > 70 ? "bg-amber-500" : "bg-emerald-500")} style={{ width: `${item.val}%` }} />
               </div>
             </div>
           ))}
           <p className={cn("text-xs font-sans font-medium uppercase tracking-wide text-center mt-2", theme === 'dark' ? "text-white/95" : "text-black/95")}>Módulo Inativo</p>
        </div>
      </div>
    ),
    "card-audit": (
      <div className={cn("no-line-card !p-6 flex flex-col transition-all duration-500 h-full", theme === 'dark' ? "bg-zinc-900/40" : "bg-white border-zinc-200")}>
         <h2 className={cn("font-heading text-sm font-semibold uppercase tracking-[0.2em] flex items-center gap-3 border-b pb-4 mb-6", theme === 'dark' ? "text-white/95 border-zinc-800/50" : "text-black/95 border-zinc-100")}>
          <ShieldCheck size={18} className="text-rd-cyan" /> Auditoria IA
        </h2>
        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
           <ShieldCheck size={32} className={cn("mb-3", theme === 'dark' ? "text-white/95" : "text-black/95")} />
           <p className={cn("text-xs font-sans font-medium uppercase tracking-wide leading-relaxed max-w-[200px]", theme === 'dark' ? "text-white/95" : "text-black/95")}>Aguardando volume de atendimentos para gerar scores de auditoria.</p>
        </div>
      </div>
    ),
    "report-agenda": (
      <div className={cn("no-line-card hover:border-rd-cyan/30 transition-all group h-full flex flex-col", theme === 'dark' ? "bg-zinc-900/40" : "bg-white border-zinc-200")}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rd-cyan/10 text-rd-cyan"><Calendar size={18} /></div>
            <h3 className={cn("text-xs font-semibold uppercase tracking-widest", theme === 'dark' ? "text-white/95" : "text-black/95")}>Visão de Agenda</h3>
          </div>
          <span className="text-sm font-semibold text-rd-cyan uppercase tracking-tighter bg-rd-cyan/5 px-2 py-0.5 rounded-md border border-rd-cyan/20">Hoje</span>
        </div>
        <div className="space-y-4 flex-1">
          <div className="flex justify-between items-end">
            <div>
              <p className={cn("text-[11px] font-heading font-semibold uppercase tracking-[0.2em] mb-2 opacity-90", theme === 'dark' ? "text-white/95" : "text-black/95")}>Atendimentos do Dia</p>
              <p className={cn("text-3xl font-heading font-bold tracking-tighter", theme === 'dark' ? "text-white/95" : "text-black/95")}>{stats.meetingsToday} / {stats.totalCapacityToday}</p>
            </div>
          </div>
          <div className={cn("p-3 rounded-2xl border flex items-center gap-4", theme === 'dark' ? "bg-zinc-950/50 border-zinc-800/50" : "bg-zinc-50 border-zinc-100")}>
             <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 shrink-0"><Users size={18} /></div>
             <div>
                <p className={cn("text-xs font-sans font-medium uppercase tracking-wide", theme === 'dark' ? "text-white/95" : "text-black/95")}>Taxa de Absenteísmo</p>
                <p className={cn("text-xl font-heading font-bold tracking-tighter", theme === 'dark' ? "text-white/95" : "text-black/95")}>{stats.absenteeismRate}%</p>
             </div>
          </div>
        </div>
      </div>
    ),
    "report-kanban": (
      <div className={cn("no-line-card hover:border-rd-cyan/30 transition-all group h-full flex flex-col", theme === 'dark' ? "bg-zinc-900/40" : "bg-white border-zinc-200")}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500"><ClipboardList size={18} /></div>
            <h3 className={cn("text-xs font-semibold uppercase tracking-widest", theme === 'dark' ? "text-white/95" : "text-black/95")}>Fluxo de Notas (TISS)</h3>
          </div>
        </div>
        <div className="space-y-4 flex-1">
          <div className="grid grid-cols-2 gap-3">
             <div className={cn("p-3 rounded-2xl border", theme === 'dark' ? "bg-zinc-950/50 border-zinc-800/50" : "bg-zinc-50 border-zinc-100")}>
                <p className={cn("text-[11px] font-heading font-semibold uppercase tracking-[0.2em] mb-2 opacity-90", theme === 'dark' ? "text-white/95" : "text-black/95")}>Pendentes</p>
                <p className="text-2xl font-heading font-bold tracking-tighter text-amber-500">{stats.notasPendentes}</p>
             </div>
             <div className={cn("p-3 rounded-2xl border", theme === 'dark' ? "bg-zinc-950/50 border-zinc-800/50" : "bg-zinc-50 border-zinc-100")}>
                <p className={cn("text-[11px] font-heading font-semibold uppercase tracking-[0.2em] mb-2 opacity-90", theme === 'dark' ? "text-white/95" : "text-black/95")}>Faturamento</p>
                <p className="text-2xl font-heading font-bold tracking-tighter text-emerald-500">{formatCurrency(stats.faturamento)}</p>
             </div>
          </div>
        </div>
      </div>
    ),
    "report-meetings": (
      <div className={cn("no-line-card hover:border-rd-cyan/30 transition-all group h-full flex flex-col", theme === 'dark' ? "bg-zinc-900/40" : "bg-white border-zinc-200")}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rd-cyan/10 text-rd-cyan"><MessageSquare size={18} /></div>
            <h3 className={cn("text-xs font-semibold uppercase tracking-widest", theme === 'dark' ? "text-white/95" : "text-black/95")}>Mural de Avisos</h3>
          </div>
        </div>
        <div className="space-y-4 flex-1 flex flex-col justify-center text-center opacity-50">
           <p className={cn("text-xs font-sans font-medium uppercase tracking-wide", theme === 'dark' ? "text-white/95" : "text-black/95")}>Nenhum aviso hoje.</p>
        </div>
      </div>
    ),
    "ai-insights": (
      <div className={cn("no-line-card !p-0 overflow-hidden transition-all duration-500 h-full", theme === 'dark' ? "bg-zinc-900/40" : "bg-white border-zinc-200")}>
        <div className="grid grid-cols-1 md:grid-cols-3">
           <div className={cn("p-6 border-b md:border-b-0 md:border-r space-y-4", theme === 'dark' ? "border-zinc-800/50" : "border-zinc-100")}>
              <div className="w-12 h-12 rounded-2xl bg-rd-cyan/10 border border-rd-cyan/20 flex items-center justify-center text-rd-cyan"><BrainCircuit size={24} /></div>
              <div>
                <h3 className={cn("text-[11px] font-heading font-semibold uppercase tracking-[0.2em] mb-2 opacity-90", theme === 'dark' ? "text-white/95" : "text-black/95")}>Predição de Fluxo</h3>
                <p className={cn("text-xs font-sans font-medium tracking-wide leading-relaxed", theme === 'dark' ? "text-white/95" : "text-black/95")}>
                  {stats.aiPrediction}
                </p>
              </div>
           </div>
           <div className={cn("p-6 border-b md:border-b-0 md:border-r space-y-4", theme === 'dark' ? "border-zinc-800/50" : "border-zinc-100")}>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500"><ShieldCheck size={24} /></div>
              <div>
                <h3 className={cn("text-[11px] font-heading font-semibold uppercase tracking-[0.2em] mb-2 opacity-90", theme === 'dark' ? "text-white/95" : "text-black/95")}>Compliance de Dados</h3>
                <p className={cn("text-xs font-sans font-medium tracking-wide leading-relaxed", theme === 'dark' ? "text-white/95" : "text-black/95")}>
                  {stats.aiCompliance}
                </p>
              </div>
           </div>
           <div className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500"><Zap size={24} /></div>
              <div>
                <h3 className={cn("text-[11px] font-heading font-semibold uppercase tracking-[0.2em] mb-2 opacity-90", theme === 'dark' ? "text-white/95" : "text-black/95")}>Oportunidades IA</h3>
                <p className={cn("text-xs font-sans font-medium tracking-wide leading-relaxed", theme === 'dark' ? "text-white/95" : "text-black/95")}>
                  Nenhuma oportunidade sistêmica detectada no momento.
                </p>
              </div>
           </div>
        </div>
      </div>
    )
  };

  return (
    <GsapAnimated direction="up" duration={0.35} className="space-y-6">
      
      {/* HEADER ACTIONS: EDIT MODE */}
      <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800/50">
        <div className="flex items-center gap-3 px-2">
          <Layout size={18} className="text-zinc-500" />
          <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Painel Operacional e IA</h2>
        </div>
        
        <button 
          onClick={() => setIsEditMode(!isEditMode)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm border",
            isEditMode 
              ? "bg-[var(--color-rd-cyan)] text-white border-[var(--color-rd-cyan)] hover:brightness-110"
              : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700"
          )}
        >
          {isEditMode ? (
            <><Save size={14} /> Salvar Layout</>
          ) : (
            <><Settings2 size={14} /> Personalizar Painel</>
          )}
        </button>
      </div>

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={layout.map(i => i.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-12 gap-5 pb-12">
            {layout.map((item) => (
              <div key={item.id} className={item.colSpan}>
                <DashboardWidget
                  id={item.id}
                  isEditMode={isEditMode}
                  isVisible={item.visible}
                  onToggleVisibility={toggleVisibility}
                >
                  {widgetRenderers[item.id]}
                </DashboardWidget>
              </div>
            ))}
          </div>
        </SortableContext>
      </DndContext>
      
    </GsapAnimated>
  );
}
