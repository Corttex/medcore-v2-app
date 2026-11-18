"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  ChevronDown,
  Copy,
  Check,
  ExternalLink,
  Mail,
  MessageSquare,
  Send,
  ShieldCheck,
  Sparkles,
  Headphones,
  Gift,
  Briefcase,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicLeadChatWidget } from "@/components/layout/PublicLeadChatWidget";
import {
  MotionReveal,
  HeroCascade,
  StaggerGroup,
  StaggerItem,
} from "@/components/animations/MotionReveal";
import {
  ALL_FOOTER_PAGES,
  FooterPageConfig,
} from "@/lib/data/footerPagesData";

interface PublicFeaturePageViewProps {
  page: FooterPageConfig;
}

export function PublicFeaturePageView({ page }: PublicFeaturePageViewProps) {
  // Estados para blocos interativos institucionais (Trabalhe Conosco, Indique e Ganhe, Suporte)
  const [formSent, setFormSent] = useState(false);
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [candidateRole, setCandidateRole] = useState("Engenharia Full-Stack & IA");
  const [candidateMessage, setCandidateMessage] = useState("");

  const [referralClinics, setReferralClinics] = useState(3);
  const [referralLinkCopied, setReferralLinkCopied] = useState(false);
  const [referralTargetName, setReferralTargetName] = useState("");
  const [referralTargetPhone, setReferralTargetPhone] = useState("");
  const [referralSubmitted, setReferralSubmitted] = useState(false);

  const [supportTopic, setSupportTopic] = useState("Configuração Fiscal / NFS-e");
  const [supportClinic, setSupportClinic] = useState("");
  const [supportDesc, setSupportDesc] = useState("");
  const [supportSent, setSupportSent] = useState(false);

  const relatedPages = ALL_FOOTER_PAGES.filter(
    (item) => item.category === page.category && item.slug !== page.slug
  ).slice(0, 6);

  const handleCopyReferral = () => {
    const link = "https://medcore.app.br/register?ref=MEDCORE-PARCEIRO";
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(link);
    }
    setReferralLinkCopied(true);
    setTimeout(() => setReferralLinkCopied(false), 2500);
  };

  return (
    <main className="relative min-h-screen bg-white dark:bg-[#061224] text-zinc-900 dark:text-white overflow-x-hidden">
      {/* ─── NAVBAR FLUTUANTE LIQUIDGLASS FOSCO ──────── */}
      <nav className="fixed top-4 sm:top-5 left-0 right-0 z-50 px-4 sm:px-6 pointer-events-none">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <Link
            href="/"
            aria-label="MedCore Início"
            className="pointer-events-auto px-3 py-1.5 rounded-2xl bg-white/65 dark:bg-zinc-950/60 backdrop-blur-2xl backdrop-saturate-150 border border-zinc-200/70 dark:border-white/15 shadow-sm shrink-0"
          >
            <Logo width={132} height={38} />
          </Link>

          <div className="pointer-events-auto flex items-center gap-2 sm:gap-5 px-2.5 sm:pl-5 sm:pr-2 py-1.5 rounded-2xl bg-white/65 dark:bg-zinc-950/65 backdrop-blur-2xl backdrop-saturate-150 border border-zinc-200/70 dark:border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.4)] text-zinc-800 dark:text-zinc-100">
            <div className="hidden lg:flex items-center gap-5 font-sans font-medium text-[13px]">
              <Link
                href="/#como-funciona"
                className="flex items-center gap-1 hover:opacity-75 transition-opacity whitespace-nowrap"
              >
                Plataforma <ChevronDown size={13} className="opacity-75" />
              </Link>
              <Link
                href="/#planos"
                className="flex items-center gap-1 hover:opacity-75 transition-opacity whitespace-nowrap"
              >
                Planos <ChevronDown size={13} className="opacity-75" />
              </Link>
              <Link
                href="/adicionais/teleconsulta"
                className="hover:opacity-75 transition-opacity whitespace-nowrap"
              >
                Teleconsulta IA
              </Link>
              <Link
                href="/institucional/suporte-remoto"
                className="hover:opacity-75 transition-opacity whitespace-nowrap"
              >
                Suporte
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link
                href="/login"
                className="hidden md:inline-flex items-center justify-center px-3.5 py-2 rounded-xl bg-white/75 hover:bg-white border border-zinc-300/70 text-zinc-900 dark:bg-white/10 dark:hover:bg-white/20 dark:border-white/20 dark:text-white font-medium text-[13px] transition-all whitespace-nowrap backdrop-blur-md"
              >
                Entrar
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-950 font-semibold text-[13px] transition-all shadow-md whitespace-nowrap"
              >
                Teste Grátis
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ─── HERO DA PÁGINA ──────────────────────────── */}
      <section className="relative pt-32 pb-16 px-6 border-b border-zinc-200/70 dark:border-white/10 bg-gradient-to-b from-slate-50/70 via-white to-white dark:from-[#0B1931]/60 dark:via-[#061224] dark:to-[#061224]">
        <div className="max-w-6xl mx-auto">
          <HeroCascade delay={0.05} y={10}>
            <div className="mb-6 flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 hover:text-zinc-900 dark:hover:text-white transition-colors font-semibold"
              >
                <ArrowLeft size={14} />
                Voltar ao início
              </Link>
              <span>/</span>
              <span className="font-medium text-zinc-600 dark:text-zinc-300">
                {page.categoryLabel}
              </span>
              <span>/</span>
              <span className="font-semibold text-[var(--color-rd-cyan)]">
                {page.navLabel}
              </span>
            </div>
          </HeroCascade>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <HeroCascade delay={0.18} y={14}>
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-bold text-[#00A9FF] dark:text-[#00D4FF] uppercase tracking-wider">
                  {page.aiOrb ? (
                    <span className="w-3 h-3 rounded-full bg-gradient-to-tr from-indigo-500 via-[#00D4FF] to-purple-300 shadow-[0_0_8px_rgba(0,212,255,0.6)]" />
                  ) : (
                    <Sparkles size={13} />
                  )}
                  <span>{page.badge}</span>
                </div>
              </HeroCascade>

              <HeroCascade delay={0.32} y={20}>
                <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.12] text-zinc-900 dark:text-white">
                  {page.title}
                </h1>
              </HeroCascade>

              <HeroCascade delay={0.48} y={16}>
                <p className="font-body text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {page.subtitle}
                </p>
              </HeroCascade>

              <HeroCascade delay={0.62} y={14}>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {page.heroSummary}
                </p>
              </HeroCascade>

              <HeroCascade delay={0.78} y={16}>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href="/register"
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#00D4FF] to-blue-600 text-zinc-950 font-black text-sm shadow-lg shadow-cyan-500/20 hover:brightness-110 transition-all inline-flex items-center gap-2"
                  >
                    <span>Começar Teste Grátis</span>
                    <ArrowRight size={16} />
                  </Link>

                  <Link
                    href={page.dashboardHref}
                    className="px-5 py-3.5 rounded-xl border border-zinc-300 dark:border-white/15 bg-white dark:bg-white/5 hover:border-[#00D4FF]/60 text-zinc-800 dark:text-white font-bold text-sm transition-all inline-flex items-center gap-2"
                  >
                    <span>{page.dashboardLabel}</span>
                    <ExternalLink size={15} />
                  </Link>
                </div>
              </HeroCascade>
            </div>

            {/* Painel de Métricas + Demonstração Conversacional da Dra. Conte */}
            <HeroCascade delay={0.45} x={24} y={12} className="lg:col-span-5">
              <div className="rounded-3xl border border-cyan-500/25 bg-[#0B0F19] text-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] space-y-5">
                <StaggerGroup immediate delay={0.6} stagger={0.12} className="grid grid-cols-3 gap-2.5">
                  {page.metrics.map((metric) => (
                    <StaggerItem
                      key={metric.label}
                      y={12}
                      className="rounded-2xl bg-white/[0.04] border border-white/10 p-3 text-center"
                    >
                      <p className="text-base sm:text-lg font-extrabold text-[#00D4FF] leading-tight">
                        {metric.value}
                      </p>
                      <p className="text-[10px] text-[#B8C0CC] mt-1 leading-tight">
                        {metric.label}
                      </p>
                    </StaggerItem>
                  ))}
                </StaggerGroup>

                <HeroCascade delay={0.95} y={12}>
                  <div className="rounded-2xl bg-white/[0.03] border border-cyan-500/20 p-4 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#00D4FF]">
                      <BrainCircuit size={15} />
                      <span>Dra. Conte em Ação neste Módulo</span>
                    </div>

                    <div className="rounded-xl bg-zinc-950/80 border border-white/10 p-3 text-xs text-zinc-200 italic">
                      &ldquo;{page.draConteExamplePrompt}&rdquo;
                    </div>

                    <div className="rounded-xl bg-cyan-500/10 border border-cyan-500/25 p-3 text-xs text-zinc-100 leading-relaxed">
                      <span className="font-bold text-[#00D4FF] block mb-1">
                        Resposta Operacional:
                      </span>
                      {page.draConteExampleReply}
                    </div>
                  </div>
                </HeroCascade>
              </div>
            </HeroCascade>
          </div>
        </div>
      </section>

      {/* ─── DESTAQUES & FUNCIONALIDADES ───────────────── */}
      <section className="py-16 px-6 max-w-6xl mx-auto space-y-14">
        <StaggerGroup stagger={0.14} delay={0.08} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {page.highlights.map((bullet) => (
            <StaggerItem
              key={bullet}
              y={18}
              className="flex items-start gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200/80 dark:border-white/10"
            >
              <CheckCircle2
                size={18}
                className="text-emerald-500 shrink-0 mt-0.5"
              />
              <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                {bullet}
              </span>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <StaggerGroup stagger={0.16} delay={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {page.features.map((feat) => (
            <StaggerItem
              key={feat.title}
              y={24}
              className="p-6 rounded-3xl bg-white dark:bg-[#0B162C] border border-zinc-200 dark:border-white/10 shadow-sm space-y-2.5"
            >
              <h2 className="text-lg font-heading font-bold text-zinc-900 dark:text-white">
                {feat.title}
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {feat.description}
              </p>
            </StaggerItem>
          ))}
        </StaggerGroup>

        {/* ─── BLOCOS ESPECÍFICOS PARA PÁGINAS INSTITUCIONAIS ─── */}
        {page.interactiveType === "careers" && (
          <MotionReveal className="rounded-3xl border border-zinc-200 dark:border-white/10 bg-slate-50 dark:bg-[#0B0F19] p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-[#00D4FF] flex items-center justify-center">
                <Briefcase size={18} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                  Envie sua Candidatura para o Time MedCore
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Nosso time de Talentos e Engenharia avalia cada perfil com atenção.
                </p>
              </div>
            </div>

            {formSent ? (
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 size={18} />
                Candidatura registrada com sucesso! Entraremos em contato pelo e-mail{" "}
                {candidateEmail}.
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setFormSent(true);
                }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <input
                  required
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-white/15 rounded-xl px-4 py-3 text-sm"
                />
                <input
                  required
                  type="email"
                  value={candidateEmail}
                  onChange={(e) => setCandidateEmail(e.target.value)}
                  placeholder="Seu melhor e-mail"
                  className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-white/15 rounded-xl px-4 py-3 text-sm"
                />
                <select
                  value={candidateRole}
                  onChange={(e) => setCandidateRole(e.target.value)}
                  className="sm:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-white/15 rounded-xl px-4 py-3 text-sm"
                >
                  <option>Engenharia Full-Stack & IA</option>
                  <option>Product Design & UX HealthTech</option>
                  <option>Consultor Comercial B2B (Clínicas & Redes)</option>
                  <option>Implantação & Sucesso do Cliente em Saúde</option>
                </select>
                <textarea
                  rows={3}
                  value={candidateMessage}
                  onChange={(e) => setCandidateMessage(e.target.value)}
                  placeholder="Link do LinkedIn/GitHub e breve resumo da sua experiência..."
                  className="sm:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-white/15 rounded-xl px-4 py-3 text-sm"
                />
                <div className="sm:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00D4FF] to-blue-600 text-zinc-950 font-bold text-sm inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Send size={15} />
                    Enviar Candidatura
                  </button>
                </div>
              </form>
            )}
          </MotionReveal>
        )}

        {page.interactiveType === "referral" && (
          <MotionReveal className="rounded-3xl border border-cyan-500/25 bg-[#0B0F19] text-white p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#00D4FF] uppercase tracking-wider">
                <Gift size={15} />
                Simulador de Recompensas Recorrentes
              </div>
              <h3 className="text-2xl font-bold">
                Indique {referralClinics} clínicas e ganhe até{" "}
                <span className="text-[#00D4FF]">
                  R$ {(referralClinics * 109).toLocaleString("pt-BR")}/mês
                </span>
              </h3>
              <input
                type="range"
                min={1}
                max={15}
                value={referralClinics}
                onChange={(e) => setReferralClinics(Number(e.target.value))}
                className="w-full accent-[#00D4FF] cursor-pointer"
              />
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <code className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-cyan-200 flex-1 truncate">
                  https://medcore.app.br/register?ref=MEDCORE-PARCEIRO
                </code>
                <button
                  type="button"
                  onClick={handleCopyReferral}
                  className="px-4 py-2 rounded-xl bg-[#00D4FF] text-zinc-950 font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {referralLinkCopied ? <Check size={14} /> : <Copy size={14} />}
                  {referralLinkCopied ? "Copiado!" : "Copiar Link"}
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-5 space-y-3">
              <h4 className="text-sm font-bold text-white">
                Indicar uma clínica agora
              </h4>
              {referralSubmitted ? (
                <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/35 text-xs text-emerald-300 font-semibold">
                  Indicação registrada para {referralTargetName}! Nosso time comercial entrará em contato mencionando sua indicação.
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setReferralSubmitted(true);
                  }}
                  className="space-y-3"
                >
                  <input
                    required
                    type="text"
                    value={referralTargetName}
                    onChange={(e) => setReferralTargetName(e.target.value)}
                    placeholder="Nome da clínica ou médico indicado"
                    className="w-full bg-zinc-950 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                  <input
                    required
                    type="tel"
                    value={referralTargetPhone}
                    onChange={(e) => setReferralTargetPhone(e.target.value)}
                    placeholder="WhatsApp de contato da clínica"
                    className="w-full bg-zinc-950 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00D4FF] to-blue-600 text-zinc-950 font-bold text-xs cursor-pointer"
                  >
                    Registrar Indicação
                  </button>
                </form>
              )}
            </div>
          </MotionReveal>
        )}

        {page.interactiveType === "support" && (
          <MotionReveal className="rounded-3xl border border-zinc-200 dark:border-white/10 bg-slate-50 dark:bg-[#0B0F19] p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#00D4FF] uppercase tracking-wider">
                <Headphones size={15} />
                Canais Diretos de Suporte Remoto
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">
                Atendimento rápido com especialistas
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                Precisa de ajuda com implantação, faturamento TISS, emissão de NFS-e ou treinamento da recepção? Acione nossa equipe agora.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="https://wa.me/5511989272833"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center gap-2"
                >
                  <MessageSquare size={14} />
                  WhatsApp Suporte (+55 11 98927 2833)
                </a>
                <a
                  href="mailto:sac@medcore.app.br"
                  className="px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-white/15 bg-white dark:bg-white/5 text-xs font-bold inline-flex items-center gap-2"
                >
                  <Mail size={14} />
                  sac@medcore.app.br
                </a>
              </div>
            </div>

            <div>
              {supportSent ? (
                <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-sm font-semibold">
                  Solicitação de suporte remoto registrada para {supportClinic}. Um especialista entrará em contato em minutos.
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSupportSent(true);
                  }}
                  className="space-y-3"
                >
                  <input
                    required
                    type="text"
                    value={supportClinic}
                    onChange={(e) => setSupportClinic(e.target.value)}
                    placeholder="Nome da clínica ou responsável"
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-white/15 rounded-xl px-4 py-2.5 text-sm"
                  />
                  <select
                    value={supportTopic}
                    onChange={(e) => setSupportTopic(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-white/15 rounded-xl px-4 py-2.5 text-sm"
                  >
                    <option>Configuração Fiscal / NFS-e</option>
                    <option>Faturamento TISS & Convênios</option>
                    <option>Importação de Base de Pacientes</option>
                    <option>Treinamento de Equipe & Dra. Conte</option>
                    <option>Suporte Técnico / Sessão Remota</option>
                  </select>
                  <textarea
                    required
                    rows={3}
                    value={supportDesc}
                    onChange={(e) => setSupportDesc(e.target.value)}
                    placeholder="Descreva rapidamente como podemos ajudar..."
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-white/15 rounded-xl px-4 py-2.5 text-sm"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00D4FF] to-blue-600 text-zinc-950 font-bold text-xs cursor-pointer"
                  >
                    Solicitar Acesso Remoto / Atendimento
                  </button>
                </form>
              )}
            </div>
          </MotionReveal>
        )}

        {page.legalSections && page.legalSections.length > 0 && (
          <MotionReveal className="rounded-3xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#0B162C] p-6 md:p-10 space-y-6">
            <div className="flex items-center gap-2.5 text-sm font-bold text-[var(--color-rd-cyan)]">
              <ShieldCheck size={18} />
              <span>Documento Institucional & Compliance MedCore Systems</span>
            </div>
            <StaggerGroup stagger={0.14} delay={0.08} className="space-y-6">
              {page.legalSections.map((section) => (
                <StaggerItem key={section.title} y={14} className="space-y-2 border-b border-zinc-100 dark:border-white/5 pb-5 last:border-b-0 last:pb-0">
                  <h3 className="text-base font-heading font-bold text-zinc-900 dark:text-white">
                    {section.title}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    {section.body}
                  </p>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </MotionReveal>
        )}

        {/* ─── EXPLORAR OUTRAS PÁGINAS DA CATEGORIA ────── */}
        <div className="pt-4 space-y-4">
          <MotionReveal y={14}>
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Explore outros itens em {page.categoryLabel}
            </h3>
          </MotionReveal>
          <StaggerGroup stagger={0.1} delay={0.08} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {relatedPages.map((rel) => (
              <StaggerItem key={rel.slug} y={18}>
                <Link
                  href={`/${rel.category}/${rel.slug}`}
                  className="p-4 rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/[0.03] hover:border-[#00D4FF]/50 transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-zinc-900 dark:text-white truncate group-hover:text-[var(--color-rd-cyan)] transition-colors flex items-center gap-2">
                      <span>{rel.navLabel}</span>
                      {rel.aiOrb && (
                        <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-indigo-500 via-[#00D4FF] to-purple-300 shrink-0" />
                      )}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                      {rel.badge}
                    </p>
                  </div>
                  <ArrowRight
                    size={15}
                    className="text-zinc-400 group-hover:text-[var(--color-rd-cyan)] group-hover:translate-x-0.5 transition-all shrink-0"
                  />
                </Link>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <PublicFooter />

      <PublicLeadChatWidget sourcePage={`${page.navLabel} (/${page.category}/${page.slug})`} />
    </main>
  );
}
