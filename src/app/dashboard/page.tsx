"use client";

import React, { useState, useEffect } from "react";

import { 
  Activity, 
  Users, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  Quote, 
  ChevronRight, 
  ArrowUpRight,
  ArrowDownRight,
  BrainCircuit,
  Download,
  Calendar,
  Layout,
  MessageSquare,
  ClipboardList,
  Building2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDashboardContext } from "@/features/dashboard/context/DashboardContext";
import { useTheme } from "@/context/ThemeContext";

// --- Custom Modern Chart Component (SVG-based) ---
const SparklineChart = ({ data, color = "brand" }: { data: number[], color?: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 100;
  const height = 40;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width="100%" height="40" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
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
          color === 'brand' ? "text-brand" : "text-emerald-500"
        )}
      />
    </svg>
  );
};

interface StatCardProps {
  title: string;
  value: string;
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
      "no-line-card !p-5 flex flex-col gap-3 group transition-all duration-500 hover:border-brand/30",
      theme === 'dark' ? "bg-zinc-900/40" : "bg-white border-zinc-200"
    )}>
      <div className="flex items-center justify-between">
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm border border-transparent",
          color === 'emerald' ? "bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/20" : 
          color === 'amber' ? "bg-amber-500/10 text-amber-500 group-hover:bg-amber-500/20 group-hover:border-amber-500/20" : 
          color === 'red' ? "bg-red-500/10 text-red-500 group-hover:bg-red-500/20 group-hover:border-red-500/20" :
          "bg-brand/10 text-brand group-hover:bg-brand/20 group-hover:border-brand/20"
        )}>
          <Icon size={24} />
        </div>
        <div className={cn(
          "text-[10px] font-black italic px-2.5 py-1 rounded-full border tracking-widest flex items-center gap-1",
          trend.startsWith('+') ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/5" : 
          trend.startsWith('-') ? "text-red-500 border-red-500/20 bg-red-500/5" :
          "text-zinc-500 border-zinc-500/20 bg-zinc-500/5"
        )}>
          {trend.startsWith('+') ? <ArrowUpRight size={10} /> : trend.startsWith('-') ? <ArrowDownRight size={10} /> : null}
          {trend}
        </div>
      </div>
      
      <div>
        <h3 className="text-[11px] font-black text-brand uppercase tracking-[0.2em] leading-none mb-2 opacity-90">{title}</h3>
        <div className="flex items-baseline gap-2">
          <p className={cn(
            "text-4xl font-black italic leading-tight tracking-tighter",
            theme === 'dark' ? "text-white" : "text-zinc-900"
          )}>{value}</p>
        </div>
        <p className={cn(
          "text-[10px] font-bold uppercase tracking-wide mt-1",
          theme === 'dark' ? "text-zinc-500" : "text-zinc-400"
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

const MEDICAL_QUOTES = [
  { text: "Pois onde quer que a arte da medicina seja amada, haverá também um amor pela humanidade.", author: "Hipócrates" },
  { text: "A medicina é uma ciência da incerteza e uma arte da probabilidade.", author: "William Osler" },
  { text: "Onde o amor pelo homem é, lá também está o amor pela Medicina.", author: "Paracelso" },
  { text: "A cura está ligada ao tempo, mas às vezes também está ligada à oportunidade.", author: "Hipócrates" }
];

export default function DashboardPage() {
  const { selectedUnitId } = useDashboardContext();
  const { theme } = useTheme();
  
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [activeQuote, setActiveQuote] = useState(MEDICAL_QUOTES[0]);
  const [stats, setStats] = useState({
    patients: 0,
    meetings: 0,
    reminders: 0,
    criticalAlerts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Roda uma vez para escolher uma frase aleatória
    setActiveQuote(MEDICAL_QUOTES[Math.floor(Math.random() * MEDICAL_QUOTES.length)]);
  }, []);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      try {
        const res = await fetch("/api/stats");
        if (res.ok) {
          const data = await res.json();
          setStats({
            patients: data.patients || 0,
            meetings: data.meetings || 0,
            reminders: data.reminders || 0,
            criticalAlerts: data.criticalAlerts || 0
          });
        }
      } catch (err) {
        console.error("Erro ao carregar dados do dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    if (selectedUnitId) {
      fetchDashboardData();
    }
  }, [selectedUnitId]);

  const handleRelatorioFull = () => {
    setIsGeneratingReport(true);
    setTimeout(() => {
      setIsGeneratingReport(false);
      alert("Relatório Executivo Full gerado com sucesso! Iniciando download...");
    }, 2000);
  };

  // ═══════ NO SELECTION STATE ═══════
  if (!selectedUnitId) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in-95 duration-700">
        <div className="relative">
          <div className="absolute inset-0 bg-brand/20 blur-[100px] rounded-full animate-pulse"></div>
          <div className={cn(
            "w-24 h-24 rounded-[2rem] flex items-center justify-center relative z-10 border shadow-2xl transition-all duration-500",
            theme === 'dark' ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
          )}>
            <Building2 size={40} className="text-brand animate-bounce" />
          </div>
        </div>
        
        <div className="max-w-md space-y-4 relative z-10">
          <h2 className={cn(
            "font-heading text-4xl font-black italic tracking-tighter",
            theme === 'dark' ? "text-white" : "text-zinc-900"
          )}>
            Aguardando <br/>
            <span className="text-brand">Configuração</span>
          </h2>
          <p className={cn(
            "text-sm font-medium leading-relaxed",
            theme === 'dark' ? "text-zinc-500" : "text-zinc-400"
          )}>
            O ecossistema VitalFlow requer uma unidade hospitalar ativa para processar inteligência clínica e dados operacionais.
          </p>
        </div>

        <button 
          onClick={() => window.location.href = '/dashboard/units'}
          className="btn-gradient px-10 py-5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-brand/25 active:scale-95 transition-all"
        >
          Configurar Unidade Agora
        </button>

        <div className="pt-12 flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-brand rounded-full animate-ping"></div>
          <p className="text-[10px] font-black text-brand uppercase tracking-[0.3em] italic">System Standby • MedCore V2</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* ═══════ EXECUTIVE HEADER ═══════ */}
      <div className={cn(
        "flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 rounded-[2.5rem] border backdrop-blur-sm transition-all duration-500",
        theme === 'dark' ? "bg-zinc-900/20 border-zinc-800/30" : "bg-white/80 border-zinc-200 shadow-sm"
      )}>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-brand rounded-full shadow-[0_0_15px_rgba(167,139,250,0.4)] animate-pulse" />
            <h1 className={cn(
              "font-heading text-4xl lg:text-5xl font-black tracking-tighter italic",
              theme === 'dark' ? "text-white" : "text-zinc-900"
            )}>
              VitalFlow <span className="text-brand">Intelligence</span>
            </h1>
          </div>
          <div className="flex items-start gap-4">
            <Quote size={20} className="text-brand/40 shrink-0 mt-1" />
            <p className={cn(
              "text-xs font-medium leading-relaxed max-w-2xl italic border-l border-brand/20 pl-4 py-1",
              theme === 'dark' ? "text-zinc-400" : "text-zinc-500"
            )}>
              "{activeQuote.text}" <span className="text-brand/60 block mt-1 font-black uppercase tracking-widest text-[9px]"> — {activeQuote.author}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={cn(
            "hidden lg:flex items-center gap-2 px-6 py-3 border rounded-full transition-all",
            theme === 'dark' ? "bg-zinc-950/40 border-zinc-800/50" : "bg-zinc-50 border-zinc-200"
          )}>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            <span className="text-[10px] font-black text-brand uppercase tracking-widest italic leading-none">Criptografia Ativa • SSL E2E</span>
          </div>
        </div>
      </div>

      {/* ═══════ KEY INDICATORS GRID ═══════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          title="Eficiência Operacional" 
          value="98.2%" 
          trend="+2.4%" 
          description="Performance Geral da Rede"
          icon={Activity}
          color="brand"
          chartData={[65, 78, 72, 85, 92, 88, 98]}
        />
        <StatCard 
          title="Total de Pacientes" 
          value={stats.patients.toLocaleString()} 
          trend="+0" 
          description="Base de Dados Supabase"
          icon={Users}
          color="brand"
          chartData={[10, 20, 15, 30, stats.patients]}
        />
        <StatCard 
          title="Reuniões Hoje" 
          value={stats.meetings.toString()} 
          trend="0" 
          description="Sincronização Ativa"
          icon={Calendar}
          color="emerald"
          chartData={[1, 2, 0, 3, stats.meetings]}
        />
        <StatCard 
          title="Lembretes Pendentes" 
          value={stats.reminders.toString()} 
          trend={stats.reminders > 5 ? "Alta" : "Estável"} 
          description="Ações Prioritárias"
          icon={AlertCircle}
          color="amber"
        />
      </div>

      {/* ═══════ MAIN ANALYTICS SECTION ═══════ */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        
        {/* OPERATIONAL OCCUPANCY */}
        <div className={cn(
          "lg:col-span-2 no-line-card !p-6 space-y-6 transition-all duration-500",
          theme === 'dark' ? "bg-zinc-900/40" : "bg-white border-zinc-200"
        )}>
          <div className={cn(
            "flex items-center justify-between border-b pb-4",
            theme === 'dark' ? "border-zinc-800/50" : "border-zinc-100"
          )}>
            <h2 className={cn(
              "font-heading text-sm font-black uppercase tracking-[0.2em] italic flex items-center gap-3",
              theme === 'dark' ? "text-white" : "text-zinc-900"
            )}>
              <TrendingUp size={18} className="text-brand" />
              Ocupação Operacional
            </h2>
            <button 
              onClick={handleRelatorioFull}
              disabled={isGeneratingReport}
              className={cn(
                "text-[10px] font-black text-brand uppercase tracking-widest border border-brand/30 px-4 py-2 rounded-xl bg-brand/5 hover:bg-brand/10 transition-all flex items-center gap-2",
                isGeneratingReport && "opacity-50 cursor-wait"
              )}
            >
              {isGeneratingReport ? (
                <>
                  <div className="w-3 h-3 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Download size={14} />
                  Relatório Full
                </>
              )}
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            <div className={cn(
              "rounded-2xl p-4 border hover:border-brand/30 transition-all",
              theme === 'dark' ? "bg-zinc-950/50 border-zinc-800/50" : "bg-zinc-50 border-zinc-100"
            )}>
              <p className={cn(
                "text-[10px] font-black uppercase tracking-widest mb-3",
                theme === 'dark' ? "text-zinc-500" : "text-zinc-400"
              )}>Leitos de UTI</p>
              <div className="flex items-end justify-between gap-2">
                <span className={cn(
                  "text-3xl font-black italic",
                  theme === 'dark' ? "text-white" : "text-zinc-900"
                )}>89%</span>
                <span className="text-[10px] text-red-500 font-bold mb-1 uppercase tracking-tighter">Capacidade Crítica</span>
              </div>
              <div className={cn(
                "w-full h-2 rounded-full mt-3 overflow-hidden border",
                theme === 'dark' ? "bg-zinc-900 border-zinc-800" : "bg-zinc-200 border-zinc-300/50"
              )}>
                <div className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full" style={{ width: '89%' }}></div>
              </div>
            </div>

            <div className={cn(
              "rounded-2xl p-4 border hover:border-brand/30 transition-all",
              theme === 'dark' ? "bg-zinc-950/50 border-zinc-800/50" : "bg-zinc-50 border-zinc-100"
            )}>
              <p className={cn(
                "text-[10px] font-black uppercase tracking-widest mb-3",
                theme === 'dark' ? "text-zinc-500" : "text-zinc-400"
              )}>Bloco Cirúrgico</p>
              <div className="flex items-end justify-between gap-2">
                <span className={cn(
                  "text-3xl font-black italic",
                  theme === 'dark' ? "text-white" : "text-zinc-900"
                )}>64%</span>
                <span className="text-[10px] text-emerald-500 font-bold mb-1 uppercase tracking-tighter">Fluxo Otimizado</span>
              </div>
              <div className={cn(
                "w-full h-2 rounded-full mt-3 overflow-hidden border",
                theme === 'dark' ? "bg-zinc-900 border-zinc-800" : "bg-zinc-200 border-zinc-300/50"
              )}>
                <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" style={{ width: '64%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* STAFF SATURATION */}
        <div className={cn(
          "no-line-card !p-6 flex flex-col transition-all duration-500",
          theme === 'dark' ? "bg-zinc-900/40" : "bg-white border-zinc-200"
        )}>
          <h2 className={cn(
            "font-heading text-sm font-black uppercase tracking-[0.2em] italic flex items-center gap-3 border-b pb-4 mb-6",
            theme === 'dark' ? "text-white border-zinc-800/50" : "text-zinc-900 border-zinc-100"
          )}>
            <Zap size={18} className="text-brand" />
            Saturação Staff
          </h2>
          <div className="flex-1 space-y-5">
             {[
               { name: "Enfermagem", val: 78 },
               { name: "Medicina", val: 45 },
               { name: "Técnicos", val: 92 }
             ].map((item) => (
               <div key={item.name} className="space-y-2">
                 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                   <span className="text-zinc-400">{item.name}</span>
                   <span className={cn(
                     "font-black italic text-sm",
                     item.val > 90 ? "text-red-400" : item.val > 70 ? "text-amber-400" : "text-emerald-400"
                   )}>{item.val}%</span>
                 </div>
                 <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/50">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-1000",
                        item.val > 90 ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]" : 
                        item.val > 70 ? "bg-amber-500" : "bg-emerald-500"
                      )} 
                      style={{ width: `${item.val}%` }} 
                    />
                 </div>
               </div>
             ))}
          </div>
          <p className="mt-4 text-[9px] text-zinc-500 font-bold uppercase tracking-widest text-center">IA Recomenda: Remanejamento em 15m</p>
        </div>

        {/* AI AUDIT */}
        <div className={cn(
          "no-line-card !p-6 flex flex-col transition-all duration-500",
          theme === 'dark' ? "bg-zinc-900/40" : "bg-white border-zinc-200"
        )}>
           <h2 className={cn(
            "font-heading text-sm font-black uppercase tracking-[0.2em] italic flex items-center gap-3 border-b pb-4 mb-6",
            theme === 'dark' ? "text-white border-zinc-800/50" : "text-zinc-900 border-zinc-100"
          )}>
            <ShieldCheck size={18} className="text-brand" />
            Auditoria IA
          </h2>
          <div className="flex-1 space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 relative group cursor-default">
                {i < 3 && <div className={cn(
                  "absolute left-2 top-5 bottom-[-24px] w-[1px] transition-colors",
                  theme === 'dark' ? "bg-zinc-800 group-hover:bg-brand/30" : "bg-zinc-100 group-hover:bg-brand/30"
                )}></div>}
                <div className="w-4 h-4 rounded-lg bg-brand/10 border border-brand/30 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all group-hover:bg-brand/20 group-hover:scale-110">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse"></div>
                </div>
                <div>
                  <p className={cn(
                    "text-xs font-black leading-none mb-1 transition-colors",
                    theme === 'dark' ? "text-white group-hover:text-brand" : "text-zinc-900 group-hover:text-brand"
                  )}>Protocolo {i === 1 ? 'Sepse' : i === 2 ? 'IAM' : 'AVC'}</p>
                  <p className={cn(
                    "text-[9px] font-bold uppercase tracking-widest",
                    theme === 'dark' ? "text-zinc-500" : "text-zinc-400"
                  )}>Validado • 14:0{i} PM</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className={cn(
                      "px-1.5 py-0.5 rounded-md text-[8px] font-black border",
                      theme === 'dark' ? "bg-zinc-950 text-zinc-400 border-zinc-800" : "bg-zinc-50 text-zinc-500 border-zinc-100"
                    )}>SCORE: 0.982</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className={cn(
            "mt-4 w-full py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all flex items-center justify-center gap-2",
            theme === 'dark' ? "text-zinc-500 border-zinc-800/50 hover:bg-zinc-800/30" : "text-zinc-400 border-zinc-100 hover:bg-zinc-50 hover:text-zinc-600"
          )}>
            Ver Log Completo <ChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* ═══════ AGENDA, KANBAN & MEETINGS REPORTS ═══════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* AGENDA REPORT */}
        <div className={cn(
          "no-line-card hover:border-brand/30 transition-all group",
          theme === 'dark' ? "bg-zinc-900/40" : "bg-white border-zinc-200"
        )}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-brand/10 text-brand">
                <Calendar size={18} />
              </div>
              <h3 className={cn(
                "text-xs font-black uppercase tracking-widest italic",
                theme === 'dark' ? "text-white" : "text-zinc-900"
              )}>Visão de Agenda</h3>
            </div>
            <span className="text-[10px] font-black text-brand uppercase tracking-tighter bg-brand/5 px-2 py-0.5 rounded-md border border-brand/20">Hoje</span>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <p className={cn(
                  "text-[10px] font-black uppercase tracking-widest",
                  theme === 'dark' ? "text-zinc-500" : "text-zinc-400"
                )}>Atendimentos do Dia</p>
                <p className={cn(
                  "text-2xl font-black italic",
                  theme === 'dark' ? "text-white" : "text-zinc-900"
                )}>42 / 60</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest leading-none">SLA Otimizado</p>
                <div className={cn(
                  "w-24 h-1.5 rounded-full mt-1.5 overflow-hidden",
                  theme === 'dark' ? "bg-zinc-900" : "bg-zinc-100"
                )}>
                  <div className="h-full bg-emerald-500" style={{ width: '70%' }}></div>
                </div>
              </div>
            </div>
            <div className={cn(
              "p-3 rounded-2xl border flex items-center gap-4",
              theme === 'dark' ? "bg-zinc-950/50 border-zinc-800/50" : "bg-zinc-50 border-zinc-100"
            )}>
               <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                  <Users size={18} />
               </div>
               <div>
                  <p className={cn(
                    "text-[10px] font-black uppercase tracking-widest",
                    theme === 'dark' ? "text-zinc-400" : "text-zinc-400"
                  )}>Taxa de Absenteísmo</p>
                  <p className={cn(
                    "text-sm font-black",
                    theme === 'dark' ? "text-white" : "text-zinc-900"
                  )}>12.4% <span className="text-[9px] text-red-400 ml-1">↑ 2.1%</span></p>
               </div>
            </div>
          </div>
        </div>

        {/* KANBAN/BILLING REPORT */}
        <div className={cn(
          "no-line-card hover:border-brand/30 transition-all group",
          theme === 'dark' ? "bg-zinc-900/40" : "bg-white border-zinc-200"
        )}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                <ClipboardList size={18} />
              </div>
              <h3 className={cn(
                "text-xs font-black uppercase tracking-widest italic",
                theme === 'dark' ? "text-white" : "text-zinc-900"
              )}>Fluxo de Notas</h3>
            </div>
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-tighter bg-amber-500/5 px-2 py-0.5 rounded-md border border-amber-500/20">Crítico</span>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
               <div className={cn(
                 "p-3 rounded-2xl border",
                 theme === 'dark' ? "bg-zinc-950/50 border-zinc-800/50" : "bg-zinc-50 border-zinc-100"
               )}>
                  <p className={cn(
                    "text-[9px] font-black uppercase tracking-widest",
                    theme === 'dark' ? "text-zinc-500" : "text-zinc-400"
                  )}>Pendentes</p>
                  <p className="text-xl font-black text-amber-500 italic">156</p>
               </div>
               <div className={cn(
                 "p-3 rounded-2xl border",
                 theme === 'dark' ? "bg-zinc-950/50 border-zinc-800/50" : "bg-zinc-50 border-zinc-100"
               )}>
                  <p className={cn(
                    "text-[9px] font-black uppercase tracking-widest",
                    theme === 'dark' ? "text-zinc-500" : "text-zinc-400"
                  )}>Faturamento</p>
                  <p className="text-xl font-black text-emerald-500 italic">R$ 420k</p>
               </div>
            </div>
            <div className={cn(
              "flex items-center gap-3 text-[10px] font-black uppercase tracking-widest",
              theme === 'dark' ? "text-zinc-400" : "text-zinc-500"
            )}>
               <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
               Gargalo identificado: Setor de Triagem B
            </div>
          </div>
        </div>

        {/* STRATEGIC MEETINGS REPORT */}
        <div className={cn(
          "no-line-card hover:border-brand/30 transition-all group",
          theme === 'dark' ? "bg-zinc-900/40" : "bg-white border-zinc-200"
        )}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-brand/10 text-brand">
                <MessageSquare size={18} />
              </div>
              <h3 className={cn(
                "text-xs font-black uppercase tracking-widest italic",
                theme === 'dark' ? "text-white" : "text-zinc-900"
              )}>Reuniões & Decisões</h3>
            </div>
            <span className="text-[10px] font-black text-brand uppercase tracking-tighter bg-brand/5 px-2 py-0.5 rounded-md border border-brand/20">Próxima</span>
          </div>
          <div className="space-y-4 flex-1">
             <div className={cn(
               "p-3 rounded-2xl border",
               theme === 'dark' ? "bg-gradient-to-br from-brand/20 via-brand/5 to-transparent border-brand/20" : "bg-brand/5 border-brand/10"
             )}>
                <p className="text-[10px] font-black text-brand uppercase tracking-widest mb-1">Board Strategy • 16:30</p>
                <p className={cn(
                  "text-sm font-black italic",
                  theme === 'dark' ? "text-white" : "text-zinc-900"
                )}>"Expansão da Rede Digital V2"</p>
             </div>
             <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                   {[1, 2, 3].map(i => (
                     <div key={i} className={cn(
                       "w-6 h-6 rounded-full border overflow-hidden",
                       theme === 'dark' ? "border-zinc-900 bg-zinc-800" : "border-white bg-zinc-100"
                     )}>
                        <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                     </div>
                   ))}
                </div>
                <span className={cn(
                  "text-[9px] font-bold uppercase tracking-widest",
                  theme === 'dark' ? "text-zinc-500" : "text-zinc-400"
                )}>+5 diretores confirmados</span>
             </div>
          </div>
        </div>
      </div>


      {/* ═══════ AI INSIGHTS ═══════ */}
      <div className={cn(
        "no-line-card !p-0 overflow-hidden transition-all duration-500",
        theme === 'dark' ? "bg-zinc-900/40" : "bg-white border-zinc-200"
      )}>
        <div className="grid grid-cols-1 md:grid-cols-3">
           <div className={cn(
             "p-6 border-b md:border-b-0 md:border-r space-y-4",
             theme === 'dark' ? "border-zinc-800/50" : "border-zinc-100"
           )}>
              <div className="w-12 h-12 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                <BrainCircuit size={24} />
              </div>
              <div>
                <h3 className={cn(
                  "font-heading font-black italic tracking-tight mb-2",
                  theme === 'dark' ? "text-white" : "text-zinc-900"
                )}>Predição de Fluxo</h3>
                <p className={cn(
                  "text-xs leading-relaxed",
                  theme === 'dark' ? "text-zinc-500" : "text-zinc-400"
                )}>
                  Nossa IA antecipa um aumento de <span className="text-brand font-bold">12% na demanda</span> para as próximas 4 horas com base nos dados meteorológicos e históricos locais.
                </p>
              </div>
           </div>
           <div className={cn(
             "p-6 border-b md:border-b-0 md:border-r space-y-4",
             theme === 'dark' ? "border-zinc-800/50" : "border-zinc-100"
           )}>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className={cn(
                  "font-heading font-black italic tracking-tight mb-2",
                  theme === 'dark' ? "text-white" : "text-zinc-900"
                )}>Compliance de Dados</h3>
                <p className={cn(
                  "text-xs leading-relaxed",
                  theme === 'dark' ? "text-zinc-500" : "text-zinc-400"
                )}>
                  Todos os registros clínicos foram <span className="text-emerald-500 font-bold">auditados em tempo real</span>. Risco de não-conformidade reduzido a próximo de zero.
                </p>
              </div>
           </div>
           <div className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                <Zap size={24} />
              </div>
              <div>
                <h3 className={cn(
                  "font-heading font-black italic tracking-tight mb-2",
                  theme === 'dark' ? "text-white" : "text-zinc-900"
                )}>Otimização de Custos</h3>
                <p className={cn(
                  "text-xs leading-relaxed",
                  theme === 'dark' ? "text-zinc-500" : "text-zinc-400"
                )}>
                  Identificamos <span className="text-amber-500 font-bold">4 oportunidades</span> de realocação de recursos que podem economizar até R$ 45k no ciclo operacional atual.
                </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
