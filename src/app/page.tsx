"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Logo } from "@/components/ui/Logo";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { LandingShowcaseSections } from "@/components/layout/LandingShowcaseSections";
import { PublicLeadChatWidget } from "@/components/layout/PublicLeadChatWidget";
import {
  MotionReveal,
  HeroCascade,
  StaggerGroup,
  StaggerItem,
} from "@/components/animations/MotionReveal";
import {
  Stethoscope,
  ArrowRight,
  CheckCircle2,
  Brain,
  Calendar,
  LayoutDashboard,
  Users,
  Zap,
  Lock,
  Bell,
  HardDrive,
  MousePointer,
  Settings,
  Sparkles,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Gift,
  GraduationCap,
  CreditCard,
  ArrowLeftRight,
  Clock,
  X
} from "lucide-react";

// ─── PLANOS DO ECOSSISTEMA DRA. CONTE ───────────────────────────────────
const plans = [
  {
    name: "🩵 Dra. Conte Assistente",
    price: "R$ 29,90",
    period: "/mês",
    description: "Para secretárias, recepcionistas e auxiliares de clínica.",
    color: "border-zinc-200",
    highlight: false,
    badge: "Individual",
    features: [
      "Organização pessoal de tarefas diárias",
      "Triagem inteligente de mensagens",
      "Metas de confirmação & redução de faltas",
      "Checklists da recepção e consultório",
      "Dra. Conte Assistente pessoal",
      "Acesso Mobile Web (PWA)",
    ],
    cta: "Assinar Assistente",
    href: "/register?plan=assistente",
  },
  {
    name: "💙 Dra. Conte Profissional",
    price: "R$ 59,90",
    period: "/mês",
    description: "Acelerador de carreira para profissionais da saúde.",
    color: "border-zinc-200",
    highlight: false,
    badge: "Carreira",
    features: [
      "Tudo do plano Assistente",
      "Módulo de Carreira & Produtividade",
      "Emissão de Certificados com Dra. Conte",
      "Relatório de Impacto Financeiro",
      "Histórico consolidado de resultados",
      "Trilhas de capacitação corporativa",
    ],
    cta: "Assinar Profissional",
    href: "/register?plan=profissional",
  },
  {
    name: "🏢 Dra. Conte Clínica",
    price: "R$ 497",
    period: "/mês",
    description: "Para pequenas e médias clínicas (até 5 usuários).",
    color: "border-zinc-200",
    highlight: false,
    badge: "Mais Buscado",
    features: [
      "Até 5 usuários inclusos",
      "Agenda médica multiprofissional",
      "Prontuário eletrônico unificado",
      "Painel TV de chamada com voz neural",
      "Caixa diário & Contas a pagar/receber",
      "Dra. Conte integrada em todos os níveis",
      "Suporte via WhatsApp",
    ],
    cta: "Começar na Clínica",
    href: "/register?plan=clinica",
  },
  {
    name: "🚀 Dra. Conte Business",
    price: "R$ 997",
    period: "/mês",
    description: "Gestão completa para centros médicos em expansão.",
    color: "border-[var(--color-rd-navy)]",
    highlight: true,
    badge: "Completo",
    features: [
      "Usuários ilimitados",
      "Faturamento TISS (XML e Glosas)",
      "Repasses médicos automatizados",
      "Controle de estoque crítico & injetáveis",
      "Dra. Conte Executive AI em tempo real",
      "RH completo (Ponto, escalas e folha)",
      "Gerente de conta exclusivo",
    ],
    cta: "Assinar Business",
    href: "/register?plan=business",
  },
  {
    name: "🩺 Dra. Conte Medical AI",
    price: "R$ 697",
    period: "/médico/mês",
    description: "Para médicos, especialistas e consultórios particulares.",
    color: "border-purple-500",
    highlight: false,
    badge: "Medical Scribe",
    features: [
      "AI Scribe: escuta de consulta ao vivo",
      "Preenchimento automático padrão SOAP",
      "Sugestão diagnóstica CID-10 e condutas",
      "Telemedicina com sala virtual HD",
      "Prescrição digital com assinatura ICP-Brasil",
      "Acesso completo via smartphone (PWA)",
    ],
    cta: "Ativar Medical AI",
    href: "/register?plan=medical",
  },
  {
    name: "👑 Clínica Inteligente",
    price: "R$ 1.497",
    period: "/mês",
    description: "Redes médicas, policlínicas e centros de diagnóstico.",
    color: "border-emerald-500",
    highlight: false,
    badge: "Redes & Franquias",
    features: [
      "Multi-unidades e filiais centralizadas",
      "Dra. Conte em todos os níveis e especialidades",
      "Módulo RIS de Worklist e laudos padronizados",
      "Totens faciais homologados (REP-P)",
      "API aberta para integrações externas",
      "SLA 99.9% com suporte 24/7 dedicado",
    ],
    cta: "Falar com Especialista",
    href: "mailto:sac@medcore.app.br",
  },
];

// ─── PASSO A PASSO ────────────────────────────
const steps = [
  {
    num: "01",
    icon: MousePointer,
    title: "Crie sua conta",
    desc: "Cadastro em 30 segundos. Sem cartão de crédito. Acesse gratuitamente e explore a plataforma.",
    color: "text-zinc-900 dark:text-white",
    bg: "bg-white dark:bg-[#0F2C59] border border-zinc-200 dark:border-white/10",
  },
  {
    num: "02",
    icon: Settings,
    title: "Escolha seus módulos",
    desc: "Selecione quais funcionalidades fazem sentido para sua clínica: agenda, demandas, jurídico, IA, Drive.",
    color: "text-zinc-900 dark:text-white",
    bg: "bg-white dark:bg-[#0F2C59] border border-zinc-200 dark:border-white/10",
  },
  {
    num: "03",
    icon: Users,
    title: "Convide sua equipe",
    desc: "Adicione médicos e gestores com níveis de acesso por função. Tudo controlado por você.",
    color: "text-zinc-900 dark:text-white",
    bg: "bg-white dark:bg-[#0F2C59] border border-zinc-200 dark:border-white/10",
  },
  {
    num: "04",
    icon: Sparkles,
    title: "Ative a IA e escale",
    desc: "Com os dados da plataforma, a IA Executiva gera insights, prevê problemas e reduz erros operacionais.",
    color: "text-white dark:text-zinc-900",
    bg: "bg-[#0F2C59] dark:bg-[var(--color-rd-cyan)] border border-transparent",
  },
];

// ─── MÓDULOS PRINCIPAIS ───────────────────────
const mainModules = [
  {
    tag: "VISÃO EXECUTIVA",
    title: "Dashboards que tomam decisões por você",
    desc: "Painel central com indicadores de precisão clínica, demandas críticas, fluxo de pacientes e alertas de sobrecarga — tudo em tempo real.",
    bullets: ["Alertas de nível crítico", "Aderência ao protocolo", "Fluxo de ações por setor"],
    image: "/demo-visao-executiva.png",
    bg: "bg-white",
    icon: LayoutDashboard,
  },
  {
    tag: "AGENDA CLÍNICA",
    title: "Gestão de agenda que se encaixa na sua rotina",
    desc: "Organize consultas, cirurgias e reuniões em um calendário inteligente com confirmação automática, sincronizado com Google e Outlook.",
    bullets: ["Confirmação via WhatsApp", "Sync com Google Agenda", "Visão por médico/sala"],
    image: "/demo-agenda-clinica.png",
    bg: "bg-[#F8FAFC]",
    icon: Calendar,
  },
  {
    tag: "IA EXECUTIVA",
    title: "Inteligência artificial treinada para sua operação",
    desc: "O MedCode AI analisa seus dados clínicos e administrativos para gerar insights preditivos e detectar anomalias.",
    bullets: ["Previsão de sobrecarga", "Análise de laudos", "Resumo automático"],
    image: "/demo-ia-executiva.png",
    bg: "bg-white",
    icon: Brain,
  },
];

import { Suspense } from "react";

function AuthCallbackHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      router.push(`/api/auth/callback?code=${code}`);
    }
  }, [searchParams, router]);

  return null;
}

const HERO_VIDEOS = [
  {
    id: "atendimento",
    label: "Atendimento",
    src: "/videos/atendimento-medico.mp4",
  },
  {
    id: "consulta",
    label: "Consultório",
    src: "/videos/consulta-clinica.mp4",
  },
  {
    id: "prontuario",
    label: "Clínica & PEP",
    src: "/videos/prontuario-clinica.mp4",
  },
];

export default function Home() {
  const [activeDemo, setActiveDemo] = useState(0);
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 360);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="relative min-h-screen bg-transparent text-zinc-900 dark:text-white overflow-x-hidden">
      <Suspense fallback={null}>
        <AuthCallbackHandler />
      </Suspense>

      {/* ─── NAVBAR FLUTUANTE LIQUIDGLASS FOSCO ─── */}
      <nav className="fixed top-4 sm:top-5 left-0 right-0 z-50 px-4 sm:px-6 pointer-events-none">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Logo à Esquerda */}
          <HeroCascade delay={0.05} y={-12}>
            <Link
              href="/"
              className="pointer-events-auto shrink-0 transition-all block"
              aria-label="MedCore Início"
            >
              {isScrolled ? (
                <div className="px-3 py-1.5 rounded-2xl bg-white/70 dark:bg-zinc-950/60 backdrop-blur-2xl backdrop-saturate-150 border border-zinc-200/70 dark:border-white/15 shadow-lg">
                  <Logo width={128} height={38} />
                </div>
              ) : (
                <div className="drop-shadow-[0_2px_14px_rgba(0,0,0,0.45)]">
                  <Image
                    src="/Logos/medcore-white.svg"
                    alt="MedCore Logo"
                    width={142}
                    height={42}
                    priority
                    className="opacity-95 hover:opacity-100 transition-opacity"
                  />
                </div>
              )}
            </Link>
          </HeroCascade>

          {/* Cápsula LiquidGlass Fosco à Direita */}
          <HeroCascade delay={0.22} y={-12}>
            <div
              className={`pointer-events-auto flex items-center gap-2 sm:gap-5 px-2.5 sm:pl-5 sm:pr-2 py-1.5 rounded-2xl backdrop-blur-2xl backdrop-saturate-150 border transition-all duration-300 ${
                isScrolled
                  ? "bg-white/70 dark:bg-zinc-950/65 border-zinc-200/80 dark:border-white/15 shadow-[0_10px_35px_rgba(0,0,0,0.14)] text-zinc-800 dark:text-zinc-100"
                  : "bg-white/14 dark:bg-zinc-950/45 border-white/25 dark:border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.35)] text-white"
              }`}
            >
              <div className="hidden lg:flex items-center gap-5 font-sans font-medium text-[13px]">
                <a
                  href="#como-funciona"
                  className="flex items-center gap-1 hover:opacity-75 transition-opacity whitespace-nowrap"
                >
                  Plataforma <ChevronDown size={13} className="opacity-75" />
                </a>
                <a
                  href="#planos"
                  className="flex items-center gap-1 hover:opacity-75 transition-opacity whitespace-nowrap"
                >
                  Planos <ChevronDown size={13} className="opacity-75" />
                </a>
                <a
                  href="#drive"
                  className="hover:opacity-75 transition-opacity whitespace-nowrap"
                >
                  Drive Cofre
                </a>
                <a
                  href="mailto:sac@medcore.app.br"
                  className="hover:opacity-75 transition-opacity whitespace-nowrap"
                >
                  Contato
                </a>
              </div>

              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Link
                  href="/login"
                  className={`hidden md:inline-flex items-center justify-center px-3.5 py-2 rounded-xl border font-medium text-[13px] transition-all whitespace-nowrap backdrop-blur-md ${
                    isScrolled
                      ? "bg-white/70 hover:bg-white border-zinc-300/80 text-zinc-900 dark:bg-white/10 dark:hover:bg-white/20 dark:border-white/20 dark:text-white"
                      : "bg-white/12 hover:bg-white/22 border-white/25 text-white"
                  }`}
                >
                  Entrar
                </Link>

                <Link
                  href="/register"
                  className={`px-4 py-2 rounded-xl font-semibold text-[13px] transition-all shadow-md whitespace-nowrap ${
                    isScrolled
                      ? "bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-950"
                      : "bg-zinc-950/85 hover:bg-zinc-950 text-white border border-white/15"
                  }`}
                >
                  Teste Grátis
                </Link>
              </div>
            </div>
          </HeroCascade>
        </div>
      </nav>

      {/* ─── HERO CINEMATOGRÁFICO COM VÍDEO DE CLÍNICA & ATENDIMENTO ─── */}
      <section className="relative w-full min-h-[100vh] flex flex-col justify-end overflow-hidden pt-44 sm:pt-56 md:pt-64 lg:pt-72 bg-zinc-950">
        {/* Vídeo Full-Bleed de Médicos & Clínicas em Atendimento */}
        <video
          key={HERO_VIDEOS[activeVideoIdx].src}
          autoPlay
          muted
          playsInline
          poster="/bg-hospital.jpg"
          onEnded={() => setActiveVideoIdx((prev) => (prev + 1) % HERO_VIDEOS.length)}
          className="absolute inset-0 w-full h-full object-cover scale-[1.02]"
        >
          <source src={HERO_VIDEOS[activeVideoIdx].src} type="video/mp4" />
        </video>

        {/* Overlays Cinematográficos para Contraste Limpo das Fontes */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 pointer-events-none" />

        {/* Conteúdo Editorial Posicionado Mais Abaixo para Valorizar o Vídeo */}
        <div className="relative z-10 max-w-6xl mx-auto w-full px-6 pt-10 pb-10 sm:pb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-2xl space-y-6">
            <HeroCascade delay={0.32} y={24}>
              <h1 className="font-sans text-4xl sm:text-5xl md:text-[54px] font-medium tracking-[-0.025em] leading-[1.12] text-white">
                A plataforma mais completa
                <br />
                para a sua clínica crescer
              </h1>
            </HeroCascade>

            {/* Grid 2x2 de Benefícios Minimalistas */}
            <div className="space-y-2.5">
              <StaggerGroup
                immediate
                delay={0.55}
                stagger={0.14}
                className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 text-[13px] font-normal text-white/90"
              >
                <StaggerItem y={14} className="flex items-center gap-2.5">
                  <Gift size={15} className="text-white/80 shrink-0" />
                  <span>Dra. Conte IA operando agenda e PEP</span>
                </StaggerItem>
                <StaggerItem y={14} className="flex items-center gap-2.5">
                  <GraduationCap size={15} className="text-white/80 shrink-0" />
                  <span>+30 módulos de gestão e saúde</span>
                </StaggerItem>
                <StaggerItem y={14} className="flex items-center gap-2.5">
                  <CreditCard size={15} className="text-white/80 shrink-0" />
                  <span>Faturamento TISS e caixa integrados*</span>
                </StaggerItem>
                <StaggerItem y={14} className="flex items-center gap-2.5">
                  <ArrowLeftRight size={15} className="text-white/80 shrink-0" />
                  <span>Migração assistida e onboarding VIP</span>
                </StaggerItem>
              </StaggerGroup>
              <HeroCascade delay={1.12} y={10}>
                <p className="text-[11px] text-white/60 leading-snug">
                  *Implantação guiada com copilota clínica em tempo real e suporte dedicado.
                </p>
              </HeroCascade>
            </div>

            {/* CTAs Limpos no Estilo Editorial */}
            <HeroCascade delay={1.26} y={18}>
              <div className="flex flex-wrap items-center gap-5 pt-2">
                <Link
                  href="/register"
                  className="px-6 py-3.5 bg-white hover:bg-zinc-100 text-zinc-950 font-semibold text-sm rounded-xl shadow-lg shadow-black/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Começar Teste Grátis
                </Link>
                <a
                  href="#como-funciona"
                  className="text-white/95 hover:text-white font-medium text-sm inline-flex items-center gap-1 transition-all group"
                >
                  <span>Veja como funciona</span>
                  <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </HeroCascade>
          </div>

          {/* Seletor Discreto de Cenas de Vídeo */}
          <HeroCascade delay={1.38} y={14} className="self-start lg:self-end">
            <div className="flex items-center gap-1.5 bg-black/45 backdrop-blur-md border border-white/15 p-1 rounded-full">
              {HERO_VIDEOS.map((vid, idx) => (
                <button
                  key={vid.id}
                  type="button"
                  onClick={() => setActiveVideoIdx(idx)}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                    activeVideoIdx === idx
                      ? "bg-white text-zinc-950 font-semibold shadow-sm"
                      : "text-white/75 hover:text-white"
                  }`}
                >
                  {vid.label}
                </button>
              ))}
            </div>
          </HeroCascade>
        </div>

        {/* Mockup Realista do Sistema Emergindo da Base do Vídeo */}
        <MotionReveal delay={0.15} y={32} className="relative z-10 max-w-5xl mx-auto w-full px-6 mt-2">
          <div className="rounded-t-2xl border border-b-0 border-zinc-200/80 dark:border-white/15 bg-white dark:bg-zinc-950 shadow-[0_-10px_50px_rgba(0,0,0,0.4)] overflow-hidden">
            {/* Barra do Browser */}
            <div className="px-4 py-2.5 bg-zinc-100/90 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-4">
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              </div>

              <div className="flex-1 max-w-md mx-auto bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1 flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                <Lock size={10} className="text-zinc-400" />
                <span>app.medcore.com.br/agenda</span>
              </div>

              <div className="hidden sm:block w-10" />
            </div>

            {/* Prévia da Agenda + Card Lateral de Agendamento */}
            <div className="grid grid-cols-1 md:grid-cols-12 bg-zinc-50/70 dark:bg-zinc-950 text-left">
              {/* Grade Semanal à Esquerda */}
              <div className="md:col-span-7 p-4 sm:p-5 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-700 dark:text-zinc-300">
                  <div className="flex items-center gap-2 font-semibold">
                    <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                      Hoje
                    </span>
                    <ChevronLeft size={14} className="text-zinc-400" />
                    <span>18 - 24 Nov 2026</span>
                    <ChevronRight size={14} className="text-zinc-400" />
                  </div>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    <Sparkles size={10} /> Dra. Conte Ativa
                  </span>
                </div>

                <StaggerGroup stagger={0.14} delay={0.15} className="grid grid-cols-3 gap-2 text-[11px]">
                  <StaggerItem y={14} className="p-2.5 rounded-xl bg-amber-100/80 dark:bg-amber-500/15 border border-amber-300/60 dark:border-amber-500/30">
                    <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 block">
                      09:30 - 10:00
                    </span>
                    <p className="font-semibold text-zinc-900 dark:text-white truncate mt-0.5">
                      Maria Rocha Alves
                    </p>
                    <p className="text-[10px] text-zinc-600 dark:text-zinc-300 truncate">
                      Consulta médica
                    </p>
                  </StaggerItem>

                  <StaggerItem y={14} className="p-2.5 rounded-xl bg-sky-100/80 dark:bg-sky-500/15 border border-sky-300/60 dark:border-sky-500/30">
                    <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 block">
                      11:00 - 11:30
                    </span>
                    <p className="font-semibold text-zinc-900 dark:text-white truncate mt-0.5">
                      João Silva
                    </p>
                    <p className="text-[10px] text-zinc-600 dark:text-zinc-300 truncate">
                      Retorno Cardiologia
                    </p>
                  </StaggerItem>

                  <StaggerItem y={14} className="p-2.5 rounded-xl bg-violet-100/80 dark:bg-violet-500/15 border border-violet-300/60 dark:border-violet-500/30">
                    <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 block">
                      15:35 - 15:55
                    </span>
                    <p className="font-semibold text-zinc-900 dark:text-white truncate mt-0.5">
                      Nathalia Costa
                    </p>
                    <p className="text-[10px] text-zinc-600 dark:text-zinc-300 truncate">
                      Teleconsulta IA
                    </p>
                  </StaggerItem>
                </StaggerGroup>
              </div>

              {/* Painel Lateral de Agendamento (Idêntico ao Recorte da Referência) */}
              <MotionReveal delay={0.35} x={18} y={0} className="md:col-span-5 p-4 sm:p-5 bg-white dark:bg-zinc-900/90 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-violet-400 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-zinc-900 dark:text-white leading-tight">
                        Agendamento
                      </p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 flex items-center gap-1">
                        <Clock size={10} />
                        Qui, 20 de nov de 2026 • 15:35 - 15:55
                      </p>
                    </div>
                  </div>
                  <X size={14} className="text-zinc-400 shrink-0" />
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-zinc-100 dark:border-zinc-800 text-[11px]">
                  <span className="text-zinc-500 dark:text-zinc-400">
                    Confirmado via Dra. Conte • WhatsApp
                  </span>
                  <span className="font-semibold text-[#00A9FF]">
                    Prontuário Pronto
                  </span>
                </div>
              </MotionReveal>
            </div>
          </div>
        </MotionReveal>
      </section>

      {/* ─── COMO FUNCIONA (BENTO GRID) ──────────── */}
      <section id="como-funciona" className="relative z-10 py-24 px-6 max-w-6xl mx-auto">
        <MotionReveal className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-black text-zinc-900 dark:text-white mb-4">
            Do cadastro ao hospital conectado<br />em menos de 10 minutos
          </h2>
          <p className="text-zinc-600 dark:text-zinc-300 max-w-xl mx-auto font-medium">
            Uma jornada simples, guiada passo a passo. Você define o que quer usar.
          </p>
        </MotionReveal>

        <StaggerGroup stagger={0.16} delay={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <StaggerItem key={i} className="h-full">
              <div className={`h-full p-8 rounded-[32px] ${step.bg} shadow-sm hover:-translate-y-1 transition-transform flex flex-col justify-between`}>
                <div>
                  <div className={`w-14 h-14 rounded-2xl ${step.num === "04" ? "bg-white/10 dark:bg-black/10" : "bg-sky-50 dark:bg-white/10"} flex items-center justify-center mb-6`}>
                    <step.icon className={step.num === "04" ? "text-[var(--color-rd-lime)] dark:text-zinc-900" : "text-[var(--color-rd-cyan)]"} size={24} />
                  </div>
                  <span className={`text-xs font-black tracking-widest ${step.num === "04" ? "text-white/60 dark:text-zinc-800" : "text-zinc-400 dark:text-zinc-400"} mb-2 block`}>{step.num}</span>
                  <h3 className={`text-xl font-heading font-black ${step.color} mb-3 leading-tight`}>{step.title}</h3>
                  <p className={`${step.num === "04" ? "text-white/90 dark:text-zinc-800" : "text-zinc-600 dark:text-zinc-300"} text-sm leading-relaxed font-body`}>{step.desc}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* ─── PLATAFORMA: MÓDULOS PRINCIPAIS ─────── */}
      <section id="plataforma" className="relative z-10 py-24 bg-slate-50/80 dark:bg-black/30">
        <div className="max-w-6xl mx-auto px-6 space-y-32">
          <MotionReveal className="text-center">
            <h2 className="font-heading text-4xl md:text-5xl font-black text-zinc-900 dark:text-white">
              Cada módulo é poderoso sozinho.<br />
              Juntos, são imbatíveis.
            </h2>
          </MotionReveal>

          {mainModules.map((mod, i) => (
            <div
              key={i}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
            >
              {/* Text */}
              <MotionReveal
                delay={0.08}
                x={i % 2 === 1 ? 24 : -24}
                y={14}
                className={`space-y-6 ${i % 2 === 1 ? "lg:order-2" : ""}`}
              >
                <span className="inline-block px-3.5 py-1 bg-sky-100 dark:bg-white/10 text-zinc-900 dark:text-sky-300 text-xs font-black tracking-wider uppercase rounded-full">
                  {mod.tag}
                </span>
                <h3 className="font-heading text-3xl md:text-4xl font-black text-zinc-900 dark:text-white leading-tight">
                  {mod.title}
                </h3>
                <p className="font-body text-zinc-600 dark:text-zinc-300 text-lg leading-relaxed">{mod.desc}</p>
                <StaggerGroup stagger={0.12} delay={0.18} className="space-y-4 pt-4">
                  {mod.bullets.map((b, j) => (
                    <StaggerItem key={j} y={10} className="flex items-center gap-3 text-base text-zinc-800 dark:text-zinc-200 font-medium">
                      <div className="w-6 h-6 rounded-lg bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={14} className="text-[var(--color-rd-cyan)]" />
                      </div>
                      {b}
                    </StaggerItem>
                  ))}
                </StaggerGroup>
              </MotionReveal>

              {/* Image Placeholder */}
              <MotionReveal
                delay={0.26}
                x={i % 2 === 1 ? -24 : 24}
                y={14}
                className={`relative ${i % 2 === 1 ? "lg:order-1" : ""}`}
              >
                <div className="relative rounded-[32px] border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#0F2C59] p-4 shadow-xl overflow-hidden aspect-[4/3] flex flex-col">
                   {/* Browser Bar */}
                  <div className="flex items-center gap-2 px-2 pb-4 border-b border-zinc-100 dark:border-white/10">
                    <div className="w-3 h-3 bg-red-400 rounded-full" />
                    <div className="w-3 h-3 bg-amber-400 rounded-full" />
                    <div className="w-3 h-3 bg-green-400 rounded-full" />
                  </div>
                  <div className="flex-1 bg-zinc-50 dark:bg-black/30 rounded-b-2xl mt-4 flex items-center justify-center text-zinc-500 dark:text-zinc-400 font-bold">
                    (UI Dashboard {mod.tag})
                  </div>
                </div>
              </MotionReveal>
            </div>
          ))}
        </div>
      </section>

      {/* ─── DRIVE COFRE ─────────────────────────── */}
      <section id="drive" className="relative z-10 py-24 px-6 max-w-6xl mx-auto">
        <MotionReveal className="relative p-12 md:p-16 rounded-[40px] bg-[#0F2C59] text-white overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-[var(--color-rd-cyan)]/20 to-transparent pointer-events-none" />
          
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <MotionReveal delay={0.12} y={18} className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                  <HardDrive className="text-[var(--color-rd-cyan)]" size={28} />
                </div>
                <span className="px-3 py-1 rounded-full bg-[var(--color-rd-lime)] text-white text-xs font-black uppercase tracking-widest">
                  Novo
                </span>
              </div>
              <h2 className="font-heading text-4xl md:text-5xl font-black leading-tight text-white">
                Drive Cofre<br />
                <span className="text-[var(--color-rd-cyan)]">Seus documentos,</span> protegidos.
              </h2>
              <p className="text-zinc-200 text-lg leading-relaxed font-body">
                Armazene documentos, laudos e prontuários com criptografia de ponta a ponta. Controle de acesso rigoroso por função.
              </p>
            </MotionReveal>

            <StaggerGroup stagger={0.14} delay={0.22} className="grid grid-cols-2 gap-4">
              {[
                { plan: "Free", storage: "500 MB", icon: "📁" },
                { plan: "Pro", storage: "2 GB", icon: "💼" },
                { plan: "Max", storage: "5 GB", icon: "🏥" },
                { plan: "Empresas", storage: "20 GB", icon: "🏢" },
              ].map((item, i) => (
                <StaggerItem key={i} y={18} className="p-6 rounded-3xl bg-white/10 border border-white/15 flex flex-col gap-3">
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <p className="text-xs font-bold text-[var(--color-rd-cyan)] uppercase tracking-wider">{item.plan}</p>
                    <p className="text-2xl font-black text-white">{item.storage}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </MotionReveal>
      </section>

      {/* ─── POR QUE USAR ────────────────────────── */}
      <section className="relative z-10 py-24 px-6 max-w-6xl mx-auto">
        <StaggerGroup stagger={0.16} delay={0.08} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Zap, title: "Produtividade +40%", text: "Decisões mais rápidas com dashboards focados." },
            { icon: Bell, title: "Zero perda de info", text: "Alertas automáticos garantem respostas ágeis." },
            { icon: Lock, title: "Conformidade LGPD", text: "RLS multinível e auditoria completa de ações." },
          ].map((item, i) => (
            <StaggerItem key={i} y={24} className="h-full">
              <div className="h-full p-8 rounded-3xl bg-white dark:bg-surface border border-black/5 dark:border-white/10 shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-2xl bg-sky-100 dark:bg-white/10 flex items-center justify-center mb-6">
                  <item.icon className="text-[var(--color-rd-navy)] dark:text-[var(--color-rd-cyan)]" size={24} />
                </div>
                <h3 className="text-xl font-heading font-black text-zinc-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-300 font-body leading-relaxed">{item.text}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* ─── PLANOS ──────────────────────────────── */}
      <section id="planos" className="relative z-10 py-24 px-6 bg-slate-50 dark:bg-black/20">
        <div className="max-w-7xl mx-auto">
          <MotionReveal className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-black text-zinc-900 dark:text-white mb-4">
              Planos do Ecossistema Dra. Conte
            </h2>
            <p className="text-zinc-600 dark:text-zinc-300 text-lg max-w-2xl mx-auto font-body">
              Planos individuais acessíveis para secretárias e médicos particulares, além de soluções completas para clínicas e redes.
            </p>
          </MotionReveal>

          <StaggerGroup stagger={0.14} delay={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <StaggerItem key={i} y={28} className="h-full">
                <div
                  className={`h-full relative flex flex-col p-8 rounded-[36px] border bg-white dark:bg-surface transition-transform hover:-translate-y-2 ${
                    plan.highlight ? "border-[var(--color-rd-navy)] dark:border-[var(--color-rd-cyan)] border-2 shadow-2xl scale-[1.02]" : "border-black/5 dark:border-white/10 shadow-sm"
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1.5 text-xs font-black uppercase tracking-widest rounded-full bg-[var(--color-rd-lime)] text-white shadow-md">
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-sm font-black uppercase tracking-widest mb-4 text-zinc-400 dark:text-zinc-500">{plan.name}</h3>
                    <div className="flex items-end gap-1 text-zinc-900 dark:text-white">
                      <span className="font-heading text-4xl font-black">{plan.price}</span>
                      <span className="text-sm font-bold pb-1 text-zinc-500 dark:text-zinc-400">{plan.period}</span>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-3 font-body">{plan.description}</p>
                  </div>

                  <ul className="space-y-4 flex-1 mb-8">
                    {plan.features.map((feat, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-200 font-medium">
                        <CheckCircle2 size={16} className="text-[var(--color-rd-cyan)] shrink-0 mt-0.5" />
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={plan.href}
                    className={`w-full py-4 rounded-xl font-black text-center transition-all ${
                      plan.highlight
                        ? "bg-[var(--color-rd-navy)] text-white hover:opacity-90 dark:bg-[var(--color-rd-cyan)] dark:text-black"
                        : "bg-zinc-100 dark:bg-white/10 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-white/20"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* ─── SOLUÇÕES POR SEGMENTO, FUNCIONALIDADES, ECOSSISTEMA E APP MOBILE ─── */}
      <LandingShowcaseSections />

      {/* ─── FOOTER CORPORATIVO PREMIUM ─────────── */}
      <PublicFooter />

      {/* ─── WIDGET DE CONVERSÃO & CHAT AO VIVO (ADMIN MASTER) ─── */}
      <PublicLeadChatWidget sourcePage="Landing Page Principal (/)" />
    </main>
  );
}
