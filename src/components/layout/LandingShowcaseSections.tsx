"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowDown,
  Bot,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  DollarSign,
  FileCheck2,
  FileSignature,
  FileText,
  Globe,
  GraduationCap,
  HeartHandshake,
  Layers,
  Megaphone,
  MessageSquare,
  Mic,
  MousePointerClick,
  Package,
  Pill,
  Receipt,
  Repeat,
  Send,
  ShoppingCart,
  Smile,
  Sparkles,
  Stethoscope,
  TrendingUp,
  Video,
  Wallet,
} from "lucide-react";
import {
  MotionReveal,
  StaggerGroup,
  StaggerItem,
} from "@/components/animations/MotionReveal";

const SEGMENT_CARDS = [
  {
    title: "Medicina",
    subtitle: "Para consultórios médicos",
    desc: "Prontuário eletrônico, receita digital ICP-Brasil, telemedicina e transcrição de consultas com IA.",
    image: "/images/landing/medicina.jpg",
    href: "/recursos/prontuario",
  },
  {
    title: "Odontologia",
    subtitle: "Para consultórios odontológicos",
    desc: "Odontograma digital, controle de estoque com lotes e validades, e comissões automatizadas.",
    image: "/images/landing/odontologia.jpg",
    href: "/recursos/odontograma",
  },
  {
    title: "Estética",
    subtitle: "Para clínicas de estética",
    desc: "Planejador de injetáveis e CRM completo para fidelização e recompra de pacientes.",
    image: "/images/landing/estetica.jpg",
    href: "/recursos/planejamento-injetaveis",
  },
];

const FRONTS_CARDS = [
  {
    title: "Vender mais",
    count: "+8 módulos",
    desc: "Atraia e converta pacientes com WhatsApp, site, CRM e a Dra. Conte atendendo 24 horas.",
    image: "/images/landing/vender-mais.jpg",
    anchor: "#frentes-modulos",
  },
  {
    title: "Atender melhor",
    count: "+8 módulos",
    desc: "Prontuário, prescrições e termos num só lugar, com a Dra. Conte transcrevendo a consulta.",
    image: "/images/landing/atender-melhor.jpg",
    anchor: "#frentes-modulos",
  },
  {
    title: "Gerir melhor",
    count: "+8 módulos",
    desc: "Agenda, financeiro, estoque e notas conectados, com o MedPago & TISS recebendo por você.",
    image: "/images/landing/gerir-melhor.jpg",
    anchor: "#frentes-modulos",
  },
];

interface ModuleRowItem {
  title: string;
  desc: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  aiOrb?: boolean;
  badge?: string;
}

const FEATURE_COLUMNS: { header: string; items: ModuleRowItem[] }[] = [
  {
    header: "GERAÇÃO DE DEMANDA",
    items: [
      {
        title: "Atendimento 24h",
        desc: "IA responde pacientes no WhatsApp",
        href: "/adicionais/atendimento-24h",
        icon: Bot,
        aiOrb: true,
      },
      {
        title: "MedChat",
        desc: "Central de WhatsApp da equipe",
        href: "/recursos/medchat",
        icon: MessageSquare,
      },
      {
        title: "Lembretes",
        desc: "Confirmação automática de consultas",
        href: "/recursos/agenda-inteligente",
        icon: HeartHandshake,
      },
      {
        title: "MedSite",
        desc: "Site com agendamento online",
        href: "/adicionais/medsite",
        icon: Globe,
      },
      {
        title: "CRM de vendas",
        desc: "Funil de pacientes",
        href: "/adicionais/crm-de-vendas",
        icon: Layers,
      },
      {
        title: "Vendas",
        desc: "Orçamentos e pacotes",
        href: "/recursos/vendas",
        icon: ShoppingCart,
      },
      {
        title: "Follow-up",
        desc: "Retorno e recompra",
        href: "/recursos/marketing",
        icon: Send,
      },
      {
        title: "Marketing",
        desc: "Campanhas inteligentes integradas",
        href: "/recursos/marketing",
        icon: Megaphone,
      },
    ],
  },
  {
    header: "ATENDIMENTO CLÍNICO",
    items: [
      {
        title: "Transcrição em tempo real",
        desc: "Consulta vira registro estruturado",
        href: "/adicionais/transcricao-em-tempo-real",
        icon: Mic,
        aiOrb: true,
      },
      {
        title: "Criação de textos",
        desc: "Documentos e resumos com IA",
        href: "/adicionais/criacao-de-textos",
        icon: Sparkles,
        aiOrb: true,
      },
      {
        title: "Prontuário",
        desc: "Histórico completo do paciente",
        href: "/recursos/prontuario",
        icon: Stethoscope,
      },
      {
        title: "Anamnese e fichas",
        desc: "Modelos prontos e personalizáveis",
        href: "/recursos/prontuario",
        icon: FileText,
      },
      {
        title: "Prescrições",
        desc: "Receitas e atestados ICP-Brasil",
        href: "/recursos/prescricoes",
        icon: Pill,
      },
      {
        title: "Planejador de injetáveis",
        desc: "Marcações faciais e corporais",
        href: "/recursos/planejamento-injetaveis",
        icon: Sparkles,
      },
      {
        title: "Odontograma",
        desc: "Mapa dental interativo",
        href: "/recursos/odontograma",
        icon: Smile,
      },
      {
        title: "Teleconsulta",
        desc: "Consultas por vídeo assistidas",
        href: "/adicionais/teleconsulta",
        icon: Video,
      },
    ],
  },
  {
    header: "GESTÃO OPERACIONAL",
    items: [
      {
        title: "MedPago",
        desc: "Maquininha, Pix e faturamento",
        href: "/recursos/financeiro",
        icon: CreditCard,
        badge: "NOVO",
      },
      {
        title: "Agenda inteligente",
        desc: "Horários, salas e equipe",
        href: "/recursos/agenda-inteligente",
        icon: Calendar,
      },
      {
        title: "Financeiro",
        desc: "Fluxo de caixa e contas",
        href: "/recursos/financeiro",
        icon: DollarSign,
      },
      {
        title: "Relatórios e DRE",
        desc: "Decisões com dados",
        href: "/recursos/financeiro",
        icon: TrendingUp,
      },
      {
        title: "Comissões",
        desc: "Repasse médico automático",
        href: "/recursos/financeiro",
        icon: Repeat,
      },
      {
        title: "Estoque",
        desc: "Lotes, validades e kits",
        href: "/recursos/estoque",
        icon: Package,
      },
      {
        title: "Nota Fiscal",
        desc: "Emissão de NFS-e e DMED",
        href: "/adicionais/nota-fiscal",
        icon: Receipt,
      },
      {
        title: "Termos e contratos",
        desc: "Assinatura eletrônica",
        href: "/adicionais/termos-e-contratos",
        icon: FileSignature,
      },
    ],
  },
];

const ORBIT_NODES = [
  { label: "Agenda", icon: Calendar, href: "/recursos/agenda-inteligente", pos: "top-[14px] left-1/2 -translate-x-1/2", sub: "" },
  { label: "Prontuário", icon: Stethoscope, href: "/recursos/prontuario", pos: "top-[102px] left-[19%]", sub: "" },
  { label: "Marketing", icon: Megaphone, href: "/recursos/marketing", pos: "top-[102px] right-[19%]", sub: "" },
  { label: "Comissões", icon: Repeat, href: "/recursos/financeiro", pos: "top-[182px] left-[27%]", sub: "" },
  { label: "Financeiro", icon: DollarSign, href: "/recursos/financeiro", pos: "top-[148px] left-1/2 -translate-x-1/2", sub: "" },
  { label: "Transcrição", icon: Mic, href: "/adicionais/transcricao-em-tempo-real", pos: "top-[264px] left-1/2 -translate-x-1/2", sub: "" },
  { label: "MedScale", icon: GraduationCap, href: "/institucional/trabalhe-conosco", pos: "bottom-[104px] left-[3%]", sub: "Educação" },
  { label: "Nota fiscal", icon: Receipt, href: "/adicionais/nota-fiscal", pos: "bottom-[34px] left-[12%]", sub: "" },
  { label: "Dra. Conte", icon: Sparkles, href: "/adicionais/atendimento-24h", pos: "bottom-[46px] left-[25%]", sub: "Inteligência artificial", aiOrb: true },
  { label: "MedPago", icon: Wallet, href: "/recursos/financeiro", pos: "bottom-[110px] right-[18%]", sub: "Pagamentos", limeBadge: true },
  { label: "Follow-up", icon: Send, href: "/recursos/marketing", pos: "bottom-[108px] right-[4%]", sub: "" },
  { label: "WhatsApp 24h", icon: MessageSquare, href: "/recursos/medchat", pos: "bottom-[16px] right-[21%]", sub: "" },
];

export function LandingShowcaseSections() {
  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════
          1. SOLUÇÕES DESENHADAS PARA CADA SEGMENTO
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-24 px-6 bg-white dark:bg-[#061224]">
        <div className="max-w-6xl mx-auto space-y-12">
          <MotionReveal className="text-center space-y-3">
            <h2 className="font-sans text-3xl sm:text-4xl md:text-[44px] font-medium tracking-[-0.025em] leading-[1.12] text-zinc-900 dark:text-white">
              Soluções desenhadas
              <br />
              para cada segmento
            </h2>
            <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
              Escolha sua especialidade e conheça o sistema adaptado para você.
            </p>
          </MotionReveal>

          <StaggerGroup stagger={0.16} delay={0.08} className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {SEGMENT_CARDS.map((seg) => (
              <StaggerItem key={seg.title} y={24}>
                <Link
                  href={seg.href}
                  className="group relative block h-[430px] sm:h-[460px] rounded-[28px] overflow-hidden border border-zinc-200/70 dark:border-white/10 shadow-md hover:shadow-2xl transition-all duration-500"
                >
                  <img
                    src={seg.image}
                    alt={seg.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/55" />

                  <div className="relative z-10 h-full p-6 sm:p-7 flex flex-col justify-between text-white">
                    <div>
                      <h3 className="font-sans text-2xl font-medium tracking-tight">
                        {seg.title}
                      </h3>
                      <p className="text-xs text-white/80 mt-0.5">{seg.subtitle}</p>
                    </div>

                    <p className="text-[13px] text-white/95 leading-relaxed font-normal">
                      {seg.desc}
                    </p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          2. TUDO QUE VOCÊ PRECISA EM UM ÚNICO LOGIN (FUNCIONALIDADES)
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-24 px-6 bg-slate-50/70 dark:bg-black/25 border-y border-zinc-200/70 dark:border-white/5">
        <div className="max-w-6xl mx-auto space-y-12">
          <MotionReveal className="text-center space-y-4">
            <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-xs font-medium text-zinc-700 dark:text-zinc-300 shadow-2xs">
              Funcionalidades
            </span>
            <h2 className="font-sans text-3xl sm:text-4xl md:text-[44px] font-medium tracking-[-0.025em] leading-[1.12] text-zinc-900 dark:text-white">
              Tudo que você precisa
              <br />
              em um único login
            </h2>
            <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">
              Mais de 20 soluções conectadas em três frentes: vender mais, atender melhor e gerir melhor.
            </p>
          </MotionReveal>

          {/* 3 Cards Fotográficos das Frentes */}
          <StaggerGroup stagger={0.16} delay={0.08} className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FRONTS_CARDS.map((card) => (
              <StaggerItem key={card.title} y={24}>
                <a
                  href={card.anchor}
                  className="group relative block h-[290px] sm:h-[310px] rounded-[26px] overflow-hidden border border-zinc-200/70 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-500"
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/15" />

                  <div className="relative z-10 h-full p-6 flex flex-col justify-end text-white">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-sans text-xl font-medium tracking-tight">
                        {card.title}
                      </h3>
                      <span className="text-[11px] text-white/75 flex items-center gap-1.5">
                        <span className="w-4 h-px bg-white/40" />
                        {card.count}
                      </span>
                    </div>
                    <div className="flex items-end justify-between gap-3">
                      <p className="text-xs text-white/90 leading-relaxed">
                        {card.desc}
                      </p>
                      <span className="w-8 h-8 rounded-lg bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shrink-0 group-hover:translate-y-0.5 transition-transform">
                        <ArrowDown size={14} />
                      </span>
                    </div>
                  </div>
                </a>
              </StaggerItem>
            ))}
          </StaggerGroup>

          {/* 3 Colunas Detalhadas de Módulos Clicáveis */}
          <div id="frentes-modulos" className="scroll-mt-24">
            <StaggerGroup stagger={0.14} delay={0.1} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {FEATURE_COLUMNS.map((col) => (
                <StaggerItem
                  key={col.header}
                  y={22}
                  className="rounded-3xl bg-white dark:bg-[#0B162C]/80 border border-zinc-200/80 dark:border-white/10 p-5 shadow-2xs"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-500 px-2 pb-3">
                    {col.header}
                  </p>
                  <div className="divide-y divide-zinc-100 dark:divide-white/10">
                    {col.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.title}
                          href={item.href}
                          className="flex items-center gap-3.5 px-2 py-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-white/[0.04] transition-colors group"
                        >
                          <div className="relative shrink-0">
                            {item.badge ? (
                              <div className="w-9 h-9 rounded-xl bg-zinc-900 dark:bg-zinc-800 text-lime-400 flex items-center justify-center shadow-xs">
                                <Icon size={16} />
                              </div>
                            ) : item.aiOrb ? (
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500/15 via-cyan-500/15 to-purple-500/15 border border-cyan-500/30 flex items-center justify-center">
                                <span className="w-4 h-4 rounded-full bg-gradient-to-tr from-indigo-500 via-[#00D4FF] to-purple-300 shadow-[0_0_10px_rgba(0,212,255,0.5)]" />
                              </div>
                            ) : (
                              <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200/70 dark:border-white/10 text-zinc-700 dark:text-zinc-300 flex items-center justify-center">
                                <Icon size={15} />
                              </div>
                            )}

                            {item.badge && (
                              <span className="absolute -top-1.5 -left-1 px-1 py-[1px] rounded bg-lime-400 text-zinc-950 text-[8px] font-black tracking-wider">
                                {item.badge}
                              </span>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-[13px] font-semibold text-zinc-900 dark:text-white group-hover:text-[var(--color-rd-cyan)] transition-colors truncate">
                              {item.title}
                            </p>
                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                              {item.desc}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>

          <MotionReveal delay={0.2} y={10} className="text-center">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              + de 20 módulos trabalhando juntos pela sua clínica
            </p>
          </MotionReveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          3. ECOSSISTEMA MEDCORE (ÓRBITAS CONCÊNTRICAS CONECTADAS)
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-24 px-6 bg-white dark:bg-[#061224] overflow-hidden">
        <div className="max-w-5xl mx-auto space-y-12">
          <MotionReveal className="text-center space-y-4">
            <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Ecossistema MedCore
            </span>
            <h2 className="font-sans text-3xl sm:text-4xl md:text-[44px] font-medium tracking-[-0.025em] leading-[1.12] text-zinc-900 dark:text-white">
              Tudo o que a sua clínica precisa,
              <br />
              do atendimento ao dinheiro na conta
            </h2>
            <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">
              Gestão, inteligência artificial, pagamentos e automação criados para funcionar juntos na rotina da clínica.
            </p>
          </MotionReveal>

          {/* Diagrama Orbital Desktop / Tablet */}
          <MotionReveal delay={0.18} y={24} className="hidden md:block relative h-[430px] max-w-4xl mx-auto select-none overflow-hidden rounded-3xl">
            {/* Glow radial pastel ao centro/base */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[680px] h-[340px] rounded-t-full bg-gradient-to-r from-emerald-200/35 via-sky-200/35 to-purple-200/40 dark:from-emerald-500/10 dark:via-cyan-500/15 dark:to-purple-500/15 blur-2xl pointer-events-none" />

            {/* 3 Órbitas Semicirculares Concêntricas */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-[-360px] w-[780px] h-[780px] rounded-full border border-zinc-200/90 dark:border-white/10 pointer-events-none" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-[-260px] w-[580px] h-[580px] rounded-full border border-zinc-200/90 dark:border-white/10 pointer-events-none" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-[-165px] w-[390px] h-[390px] rounded-full border border-zinc-200/90 dark:border-white/10 pointer-events-none" />

            {/* Núcleo Central MedCore */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-64 h-36 rounded-t-full bg-white/95 dark:bg-[#0B162C]/95 border border-b-0 border-zinc-200 dark:border-white/15 shadow-[0_-10px_40px_rgba(0,0,0,0.06)] flex flex-col items-center justify-end pb-5 px-4 text-center z-20">
              <div className="w-11 h-11 rounded-2xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-black text-base shadow-md mb-2">
                M
              </div>
              <p className="text-sm font-bold text-zinc-900 dark:text-white leading-tight">
                MedCore
              </p>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                Tudo conectado em um único login
              </p>
            </div>

            {/* Pílulas Orbitais Clicáveis */}
            {ORBIT_NODES.map((node) => {
              const Icon = node.icon;
              return (
                <Link
                  key={node.label}
                  href={node.href}
                  className={`absolute ${node.pos} z-20 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/95 dark:bg-[#0F1B33]/95 backdrop-blur-md border border-zinc-200/90 dark:border-white/15 shadow-sm hover:shadow-md hover:border-[#00D4FF]/60 hover:-translate-y-0.5 transition-all`}
                >
                  {node.aiOrb ? (
                    <span className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 via-[#00D4FF] to-purple-300 shadow-[0_0_8px_rgba(0,212,255,0.5)] shrink-0" />
                  ) : node.limeBadge ? (
                    <span className="w-6 h-6 rounded-lg bg-lime-400 text-zinc-950 flex items-center justify-center shrink-0">
                      <Icon size={13} />
                    </span>
                  ) : (
                    <Icon size={14} className="text-zinc-600 dark:text-zinc-300 shrink-0" />
                  )}
                  <div className="leading-tight">
                    <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-100 block whitespace-nowrap">
                      {node.label}
                    </span>
                    {node.sub && (
                      <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block whitespace-nowrap">
                        {node.sub}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </MotionReveal>

          {/* Versão Mobile Compacta do Ecossistema */}
          <StaggerGroup stagger={0.08} delay={0.1} className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 md:hidden">
            {ORBIT_NODES.map((node) => {
              const Icon = node.icon;
              return (
                <StaggerItem key={node.label} y={14}>
                  <Link
                    href={node.href}
                    className="flex items-center gap-2 p-3 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-xs font-semibold"
                  >
                    <Icon size={14} className="text-[var(--color-rd-cyan)] shrink-0" />
                    <span className="truncate">{node.label}</span>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          4. BANNER MOBILE: TODA A SUA CLÍNICA ORGANIZADA, A UM CLIQUE DE DISTÂNCIA
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-14 px-6 bg-white dark:bg-[#061224]">
        <div className="max-w-6xl mx-auto">
          <MotionReveal
            y={28}
            className="relative rounded-[32px] bg-gradient-to-br from-[#646D72] via-[#7A8287] to-[#4A5358] dark:from-[#0E1B31] dark:via-[#162744] dark:to-[#0A1322] text-white overflow-hidden shadow-2xl px-8 sm:px-14 pt-14 pb-14 lg:pb-0 min-h-[390px] grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
          >
            {/* Esquerda: Texto Editorial + CTA */}
            <div className="lg:col-span-6 space-y-5 lg:pb-14">
              <MotionReveal delay={0.12} y={18}>
                <h2 className="font-sans text-3xl sm:text-4xl md:text-[42px] font-medium tracking-[-0.025em] leading-[1.12] text-white">
                  Toda a sua clínica
                  <br />
                  organizada, a um
                  <br />
                  clique de distância
                </h2>
              </MotionReveal>

              <MotionReveal delay={0.26} y={14}>
                <p className="text-sm text-white/85 leading-relaxed max-w-md">
                  Agenda, financeiro, CRM, documentos, estoque e inteligência artificial, tudo em um único login. Feito sob medida para medicina, odontologia e estética.
                </p>
              </MotionReveal>

              <MotionReveal delay={0.38} y={14}>
                <div className="pt-1">
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-semibold text-xs shadow-lg transition-all hover:scale-[1.02]"
                  >
                    Começar Teste Grátis
                  </Link>
                </div>
              </MotionReveal>
            </div>

            {/* Direita: Mockup de iPhone Inclinado Emergindo da Base */}
            <MotionReveal
              delay={0.28}
              x={24}
              y={36}
              className="lg:col-span-6 flex justify-center lg:justify-end self-end"
            >
              <div className="relative w-[290px] sm:w-[320px] rounded-t-[44px] border-[8px] border-b-0 border-[#2B4B77] bg-white text-zinc-900 shadow-[0_24px_70px_rgba(0,0,0,0.45)] rotate-[-5deg] translate-y-4 overflow-hidden">
                {/* Dynamic Island & Status Bar */}
                <div className="px-6 pt-3 pb-2 flex items-center justify-between text-[10px] font-bold text-zinc-900">
                  <span>9:41</span>
                  <span className="w-20 h-5 rounded-full bg-zinc-950 inline-block" />
                  <span className="flex items-center gap-1">5G • 100%</span>
                </div>

                {/* App Header */}
                <div className="px-4 py-2 border-b border-zinc-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#00D4FF] to-indigo-600 text-white text-[10px] font-black flex items-center justify-center">
                      M
                    </span>
                    <span className="text-xs font-bold text-zinc-900">
                      medcore
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-zinc-500">
                    Lista de espera
                  </span>
                </div>

                {/* Mini Grade da Agenda Mobile */}
                <div className="p-3.5 space-y-2.5 bg-zinc-50/70">
                  <div className="flex items-center justify-between text-[10px] font-semibold text-zinc-600">
                    <span className="px-2 py-0.5 rounded bg-white border border-zinc-200">
                      Hoje
                    </span>
                    <span className="flex items-center gap-1">
                      <ChevronLeft size={11} />
                      <span>18 de nov de 2026</span>
                      <ChevronRight size={11} />
                    </span>
                  </div>

                  <div className="space-y-2 text-[10px] relative pb-6">
                    <div className="p-2 rounded-xl bg-violet-100/80 border border-violet-200">
                      <p className="font-bold text-zinc-900">Lavinia C. Cardoso</p>
                      <p className="text-zinc-600">Sessão 2 de 4 • 15:45 - 16:05</p>
                    </div>

                    {/* Card em Destaque com Cursor */}
                    <div className="relative z-10 p-3 rounded-xl bg-lime-200 border border-lime-400 shadow-lg scale-[1.03] -rotate-1">
                      <p className="font-bold text-zinc-950 text-[11px]">
                        Giovanna F. Gomes
                      </p>
                      <p className="text-zinc-800">Consulta médica</p>
                      <p className="font-semibold text-zinc-900 mt-1">
                        16:00 - 16:20
                      </p>
                      <MousePointerClick
                        size={18}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-950 fill-white drop-shadow"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="p-2 rounded-xl bg-sky-100/80 border border-sky-200">
                        <p className="font-bold text-zinc-900 truncate">
                          Adriana P. Alves
                        </p>
                        <p className="text-zinc-600">16:25 - 16:45</p>
                      </div>
                      <div className="p-2 rounded-xl bg-zinc-200/70 border border-zinc-300">
                        <p className="font-bold text-zinc-700 truncate">
                          Horário bloqueado
                        </p>
                        <p className="text-zinc-500">16:45 - 17:05</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </MotionReveal>
          </MotionReveal>
        </div>
      </section>
    </>
  );
}
