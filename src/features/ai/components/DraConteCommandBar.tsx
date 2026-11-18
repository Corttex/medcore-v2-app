"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  CheckCircle2,
  CalendarClock,
  UserCheck,
  AlertTriangle,
  TrendingUp,
  Send,
  Mic,
  BrainCircuit,
  ChevronUp,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import { triggerDraContePrompt } from "@/components/ui/SmartTooltip";
import { cn } from "@/lib/utils";

interface OperationalAlertPill {
  id: string;
  label: string;
  count: number;
  prompt: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  tone: "cyan" | "emerald" | "amber" | "violet";
}

const OPERATIONAL_PILLS: OperationalAlertPill[] = [
  {
    id: "confirmar",
    count: 7,
    label: "7 consultas para confirmar",
    prompt: "Dra. Conte, liste as 7 consultas para confirmar hoje e prepare o disparo via WhatsApp.",
    icon: CalendarClock,
    tone: "cyan",
  },
  {
    id: "retorno",
    count: 2,
    label: "2 pacientes aguardando retorno",
    prompt: "Dra. Conte, mostre os 2 pacientes aguardando retorno e sugira os melhores horários.",
    icon: UserCheck,
    tone: "emerald",
  },
  {
    id: "convenio",
    count: 1,
    label: "1 convênio com pendência",
    prompt: "Dra. Conte, detalhe o convênio com pendência financeira/TISS e como regularizar.",
    icon: AlertTriangle,
    tone: "amber",
  },
  {
    id: "comercial",
    count: 3,
    label: "3 oportunidades comerciais",
    prompt: "Dra. Conte, apresente as 3 oportunidades comerciais de retorno e campanhas preventivas.",
    icon: TrendingUp,
    tone: "violet",
  },
];

const QUICK_COMMANDS = [
  "Dra. Conte, agende retorno para João em 15 dias.",
  "Encontre pacientes sem retorno há mais de 90 dias",
  "Mostre contas vencidas",
  "Iniciar teleconsulta com João Silva",
];

export function DraConteCommandBar() {
  const { user } = useUser();
  const pathname = usePathname();
  const [commandInput, setCommandInput] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (pathname?.startsWith("/dashboard/admin")) {
    return null;
  }

  const getGreeting = () => {
    if (!isMounted) return "Olá";
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const displayName = isMounted
    ? user?.full_name?.split(" ").filter(Boolean)[0] ||
      user?.email?.split("@")[0] ||
      "Nathalia"
    : "Equipe";

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = commandInput.trim();
    if (!text) return;
    triggerDraContePrompt(text, true);
    setCommandInput("");
  };

  const toneClasses: Record<OperationalAlertPill["tone"], string> = {
    cyan: "bg-cyan-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-300 hover:bg-cyan-500/20",
    emerald: "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-500/20",
    amber: "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-300 hover:bg-amber-500/20",
    violet: "bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-500/20",
  };

  return (
    <section
      aria-label="Central Operacional Dra. Conte"
      className="border-b border-cyan-500/20 bg-gradient-to-r from-surface via-surface-container-low to-surface px-4 md:px-6 py-2.5 backdrop-blur-xl relative z-30 shadow-xs"
    >
      <div className="max-w-[1600px] mx-auto space-y-2">
        {/* Linha Principal: Saudação Proativa + Ações Rápidas + CTA Central Dra. Conte */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          {/* Diagnóstico Proativo da IA */}
          <div className="flex flex-wrap items-center gap-2.5 min-w-0">
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#00D4FF] to-blue-600 text-zinc-950 flex items-center justify-center shadow-sm shadow-cyan-500/25">
                <BrainCircuit size={15} />
              </div>
              <div className="leading-tight">
                <p className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                  <span>
                    {getGreeting()}, {displayName}
                  </span>
                  <span className="hidden sm:inline text-[11px] font-medium text-on-surface-variant">
                    — A Dra. Conte identificou:
                  </span>
                </p>
              </div>
            </div>

            {!collapsed && (
              <div className="flex flex-wrap items-center gap-1.5">
                {OPERATIONAL_PILLS.map((pill) => {
                  const Icon = pill.icon;
                  return (
                    <button
                      key={pill.id}
                      type="button"
                      onClick={() => triggerDraContePrompt(pill.prompt, true)}
                      title="Clique para a Dra. Conte executar ou detalhar agora"
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]",
                        toneClasses[pill.tone]
                      )}
                    >
                      <Icon size={12} />
                      <span>{pill.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Controles Direitos: Input Conversacional + Botão Abrir Central */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
            <form
              onSubmit={handleCommandSubmit}
              className="flex items-center flex-1 sm:w-80 md:w-96 bg-surface-container/80 border border-cyan-500/30 focus-within:border-[#00D4FF] rounded-xl pl-3 pr-1.5 py-1 transition-all shadow-inner"
            >
              <Sparkles size={13} className="text-[#00D4FF] shrink-0 mr-2" />
              <input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                placeholder='Ex: "Dra. Conte, agende retorno para João em 15 dias."'
                className="w-full bg-transparent border-none text-xs text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-0"
              />
              <button
                type="button"
                onClick={() =>
                  triggerDraContePrompt(
                    "Dra. Conte, agende retorno para João em 15 dias.",
                    false
                  )
                }
                title="Abrir comando por voz com a Dra. Conte"
                className="p-1.5 rounded-lg text-on-surface-variant hover:text-[#00D4FF] transition-colors cursor-pointer"
              >
                <Mic size={13} />
              </button>
              <button
                type="submit"
                disabled={!commandInput.trim()}
                title="Executar comando na operação"
                className="p-1.5 rounded-lg bg-[#00D4FF] text-zinc-950 hover:brightness-110 disabled:opacity-40 transition-all cursor-pointer"
              >
                <Send size={12} />
              </button>
            </form>

            <button
              type="button"
              onClick={() => triggerDraContePrompt("", false)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#00D4FF] to-blue-600 text-zinc-950 font-bold text-xs shadow-sm shadow-cyan-500/20 hover:brightness-110 transition-all cursor-pointer shrink-0"
            >
              <Sparkles size={13} />
              <span>Abrir Central Dra. Conte</span>
            </button>

            <Link
              href="/dashboard/ia-executiva"
              title="Ir para o Workspace Completo da Dra. Conte"
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-outline-variant/40 bg-surface-container hover:border-cyan-500/40 text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-all shrink-0"
            >
              <span>Central</span>
              <ArrowRight size={12} />
            </Link>

            <button
              type="button"
              onClick={() => setCollapsed((prev) => !prev)}
              title={collapsed ? "Expandir alertas da Dra. Conte" : "Recolher barra"}
              className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
            >
              {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
          </div>
        </div>

        {/* Linha Secundária de Atalhos Conversacionais (Sistema Operacional Conversacional) */}
        {!collapsed && (
          <div className="hidden md:flex items-center gap-2 text-[11px] text-on-surface-variant overflow-x-auto no-scrollbar pt-0.5">
            <span className="font-semibold text-[#00D4FF] shrink-0">
              Sistema Operacional Conversacional:
            </span>
            {QUICK_COMMANDS.map((cmd) => (
              <button
                key={cmd}
                type="button"
                onClick={() => triggerDraContePrompt(cmd, true)}
                className="px-2 py-0.5 rounded-md bg-surface-container/70 hover:bg-cyan-500/10 border border-outline-variant/30 hover:border-cyan-500/35 text-on-surface-variant hover:text-on-surface transition-all shrink-0 cursor-pointer"
              >
                &ldquo;{cmd}&rdquo;
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
