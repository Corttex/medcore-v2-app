"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Logo } from "@/components/ui/Logo";
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
  ChevronDown
} from "lucide-react";

// ─── PLANOS ───────────────────────────────────
const plans = [
  {
    name: "Free",
    price: "R$ 0",
    period: "",
    description: "Ideal para profissionais liberais.",
    color: "border-zinc-200",
    highlight: false,
    badge: null,
    features: [
      "1 Unidade Hospitalar",
      "5 Demandas / mês",
      "Agenda Clínica Básica",
      "Cards Kanban (3 quadros)",
      "Drive Cofre: 500 MB",
      "Suporte via E-mail",
      "Sem IA Inteligente",
    ],
    cta: "Começar Grátis",
    href: "/register",
  },
  {
    name: "Pro",
    price: "R$ 39,99",
    period: "/mês",
    description: "Melhor custo-benefício para clínicas.",
    color: "border-zinc-200",
    highlight: false,
    badge: null,
    features: [
      "2 Unidades Hospitalares",
      "Demandas Ilimitadas",
      "Emergency Monitor",
      "Conselho Jurídico IA",
      "Scanner de Documentos",
      "Relatórios BI básicos",
      "Drive Cofre: 2 GB",
      "Suporte Prioritário",
    ],
    cta: "Assinar Pro",
    href: "/register?plan=pro",
  },
  {
    name: "Max",
    price: "R$ 97,99",
    period: "/mês",
    description: "Para hospitais e redes de saúde.",
    color: "border-[var(--color-rd-navy)]",
    highlight: true,
    badge: "Mais Popular",
    features: [
      "5 Unidades Hospitalares",
      "IA em todos os módulos",
      "E-mails integrados (IMAP)",
      "Google, Outlook, Apple",
      "Drive Cofre: 5 GB",
      "Auditoria completa",
      "Relatórios ilimitados",
      "Suporte prioritário",
    ],
    cta: "Assinar Max",
    href: "/register?plan=max",
  },
  {
    name: "Empresas",
    price: "R$ 279,99",
    period: "/mês",
    description: "Rede de hospitais descentralizada.",
    color: "border-zinc-200",
    highlight: false,
    badge: "2 a 10 usuários",
    features: [
      "Usuários ilimitados",
      "Drive Cofre: 20 GB",
      "HubMedcore incluso",
      "API dedicada",
      "SLA 99.9%",
      "Gerente de conta",
      "Onboarding personalizado",
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

export default function Home() {
  const [activeDemo, setActiveDemo] = useState(0);

  return (
    <main className="relative min-h-screen bg-transparent text-zinc-900 dark:text-white overflow-x-hidden">
      <Suspense fallback={null}>
        <AuthCallbackHandler />
      </Suspense>
      {/* Background Shapes / Accents like RD Station */}
      <div className="absolute top-0 right-0 w-[50%] h-[800px] bg-[var(--color-rd-cyan)] opacity-[0.03] rounded-bl-[150px] pointer-events-none" />

      {/* ─── NAVBAR ─────────────────────────────── */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 bg-white/90 dark:bg-[#061224]/90 backdrop-blur-xl border-b border-zinc-200/80 dark:border-white/10 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-12">
          {/* Logo */}
          <Logo width={140} height={42} />

          {/* Nav Links */}
          <div className="hidden lg:flex items-center gap-6 font-body font-bold text-sm text-zinc-800 dark:text-zinc-200">
            <a href="#como-funciona" className="flex items-center gap-1 hover:text-[var(--color-rd-cyan)] transition-colors whitespace-nowrap">
              Plataforma <ChevronDown size={14} />
            </a>
            <a href="#planos" className="flex items-center gap-1 hover:text-[var(--color-rd-cyan)] transition-colors whitespace-nowrap">
              Planos <ChevronDown size={14} />
            </a>
            <a href="#drive" className="hover:text-[var(--color-rd-cyan)] transition-colors whitespace-nowrap">Drive Cofre</a>
            <a href="mailto:sac@medcore.app.br" className="hover:text-[var(--color-rd-cyan)] transition-colors whitespace-nowrap">Contato</a>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/login" className="hidden md:flex font-bold text-sm text-zinc-800 dark:text-zinc-200 hover:opacity-80 transition-opacity whitespace-nowrap">
            Entrar
          </Link>

          <Link href="/register" className="px-5 py-2.5 bg-[var(--color-rd-lime)] text-white text-sm font-black rounded-xl hover:brightness-105 transition-all shadow-md whitespace-nowrap">
            Teste Grátis
          </Link>
        </div>
      </nav>

      {/* ─── HERO ────────────────────────────────── */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6 pt-32 pb-16 max-w-5xl mx-auto">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[var(--color-rd-cyan)] text-white text-xs font-bold uppercase tracking-wider mb-8 shadow-sm">
          MÊS DO CLIENTE
        </div>

        <h1 className="font-heading text-5xl md:text-7xl font-black tracking-tight leading-tight text-zinc-900 dark:text-white mb-6">
          Contrate as soluções MedCore<br />
          e ganhe o 1º mês grátis
        </h1>
        <p className="max-w-2xl font-body text-zinc-600 dark:text-zinc-300 text-lg md:text-xl font-medium leading-relaxed mb-10">
          Estruture clínica, vendas e atendimento agora. Seu hospital cresce mais rápido, sem perder o controle da operação.
        </p>

        <div className="flex flex-col items-center gap-6 mb-20">
          <Link href="/register" className="px-10 py-5 bg-[var(--color-rd-lime)] text-white font-black text-lg rounded-xl shadow-[0_4px_14px_0_rgba(255,90,95,0.39)] hover:scale-105 transition-transform flex items-center justify-center gap-2">
            Começar Gratuitamente <ArrowRight size={20} />
          </Link>
        </div>

        {/* Demo App Placeholder */}
        <div className="w-full relative rounded-2xl border border-zinc-200 dark:border-white/10 overflow-hidden shadow-2xl bg-white dark:bg-[#0F2C59] p-2">
           <div className="bg-zinc-50 dark:bg-black/30 rounded-xl w-full h-[400px] flex items-center justify-center text-zinc-400 font-bold">
             (Interface Preview / Image here)
           </div>
        </div>
      </section>

      {/* ─── COMO FUNCIONA (BENTO GRID) ──────────── */}
      <section id="como-funciona" className="relative z-10 py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-black text-zinc-900 dark:text-white mb-4">
            Do cadastro ao hospital conectado<br />em menos de 10 minutos
          </h2>
          <p className="text-zinc-600 dark:text-zinc-300 max-w-xl mx-auto font-medium">
            Uma jornada simples, guiada passo a passo. Você define o que quer usar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={i} className={`p-8 rounded-[32px] ${step.bg} shadow-sm hover:-translate-y-1 transition-transform flex flex-col justify-between`}>
              <div>
                <div className={`w-14 h-14 rounded-2xl ${step.num === "04" ? "bg-white/10 dark:bg-black/10" : "bg-sky-50 dark:bg-white/10"} flex items-center justify-center mb-6`}>
                  <step.icon className={step.num === "04" ? "text-[var(--color-rd-lime)] dark:text-zinc-900" : "text-[var(--color-rd-cyan)]"} size={24} />
                </div>
                <span className={`text-xs font-black tracking-widest ${step.num === "04" ? "text-white/60 dark:text-zinc-800" : "text-zinc-400 dark:text-zinc-400"} mb-2 block`}>{step.num}</span>
                <h3 className={`text-xl font-heading font-black ${step.color} mb-3 leading-tight`}>{step.title}</h3>
                <p className={`${step.num === "04" ? "text-white/90 dark:text-zinc-800" : "text-zinc-600 dark:text-zinc-300"} text-sm leading-relaxed font-body`}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── PLATAFORMA: MÓDULOS PRINCIPAIS ─────── */}
      <section id="plataforma" className="relative z-10 py-24 bg-slate-50/80 dark:bg-black/30">
        <div className="max-w-6xl mx-auto px-6 space-y-32">
          <div className="text-center">
            <h2 className="font-heading text-4xl md:text-5xl font-black text-zinc-900 dark:text-white">
              Cada módulo é poderoso sozinho.<br />
              Juntos, são imbatíveis.
            </h2>
          </div>

          {mainModules.map((mod, i) => (
            <div
              key={i}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
            >
              {/* Text */}
              <div className={`space-y-6 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                <span className="inline-block px-3.5 py-1 bg-sky-100 dark:bg-white/10 text-zinc-900 dark:text-sky-300 text-xs font-black tracking-wider uppercase rounded-full">
                  {mod.tag}
                </span>
                <h3 className="font-heading text-3xl md:text-4xl font-black text-zinc-900 dark:text-white leading-tight">
                  {mod.title}
                </h3>
                <p className="font-body text-zinc-600 dark:text-zinc-300 text-lg leading-relaxed">{mod.desc}</p>
                <ul className="space-y-4 pt-4">
                  {mod.bullets.map((b, j) => (
                    <li key={j} className="flex items-center gap-3 text-base text-zinc-800 dark:text-zinc-200 font-medium">
                      <div className="w-6 h-6 rounded-lg bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={14} className="text-[var(--color-rd-cyan)]" />
                      </div>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Image Placeholder */}
              <div className={`relative ${i % 2 === 1 ? "lg:order-1" : ""}`}>
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
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── DRIVE COFRE ─────────────────────────── */}
      <section id="drive" className="relative z-10 py-24 px-6 max-w-6xl mx-auto">
        <div className="relative p-12 md:p-16 rounded-[40px] bg-[#0F2C59] text-white overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-[var(--color-rd-cyan)]/20 to-transparent pointer-events-none" />
          
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { plan: "Free", storage: "500 MB", icon: "📁" },
                { plan: "Pro", storage: "2 GB", icon: "💼" },
                { plan: "Max", storage: "5 GB", icon: "🏥" },
                { plan: "Empresas", storage: "20 GB", icon: "🏢" },
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-3xl bg-white/10 border border-white/15 flex flex-col gap-3">
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <p className="text-xs font-bold text-[var(--color-rd-cyan)] uppercase tracking-wider">{item.plan}</p>
                    <p className="text-2xl font-black text-white">{item.storage}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── POR QUE USAR ────────────────────────── */}
      <section className="relative z-10 py-24 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Zap, title: "Produtividade +40%", text: "Decisões mais rápidas com dashboards focados." },
            { icon: Bell, title: "Zero perda de info", text: "Alertas automáticos garantem respostas ágeis." },
            { icon: Lock, title: "Conformidade LGPD", text: "RLS multinível e auditoria completa de ações." },
          ].map((item, i) => (
            <div key={i} className="p-8 rounded-3xl bg-white dark:bg-surface border border-black/5 dark:border-white/10 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-sky-100 dark:bg-white/10 flex items-center justify-center mb-6">
                <item.icon className="text-[var(--color-rd-navy)] dark:text-[var(--color-rd-cyan)]" size={24} />
              </div>
              <h3 className="text-xl font-heading font-black text-zinc-900 dark:text-white mb-3">{item.title}</h3>
              <p className="text-zinc-600 dark:text-zinc-300 font-body leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── PLANOS ──────────────────────────────── */}
      <section id="planos" className="relative z-10 py-24 px-6 bg-slate-50 dark:bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-black text-zinc-900 dark:text-white mb-4">
              Planos e Preços
            </h2>
            <p className="text-zinc-600 dark:text-zinc-300 text-lg max-w-xl mx-auto font-body">Comece grátis. Escale quando precisar.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`relative flex flex-col p-8 rounded-[36px] border bg-white dark:bg-surface transition-transform hover:-translate-y-2 ${
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
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────── */}
      <footer className="bg-white dark:bg-surface border-t border-black/5 dark:border-white/5 py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Logo width={140} height={42} />
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed max-w-sm font-body">
              Plataforma de gestão hospitalar com IA para médicos, clínicas e redes de saúde.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-black text-zinc-900 dark:text-white mb-6">Produto</h4>
            <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400 font-medium">
              <li><a href="#plataforma" className="hover:text-[var(--color-rd-cyan)] transition-colors">Plataforma</a></li>
              <li><a href="#drive" className="hover:text-[var(--color-rd-cyan)] transition-colors whitespace-nowrap">Drive Cofre</a></li>
              <li><a href="#planos" className="hover:text-[var(--color-rd-cyan)] transition-colors">Planos</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-black text-zinc-900 dark:text-white mb-6">Suporte</h4>
            <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400 font-medium">
              <li><a href="mailto:sac@medcore.app.br" className="hover:text-[var(--color-rd-cyan)] transition-colors">Fale Conosco</a></li>
              <li><Link href="/privacy" className="hover:text-[var(--color-rd-cyan)] transition-colors">Privacidade</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-black/5 dark:border-white/5 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">© 2026 Corttex Technologies. Todos os direitos reservados.</p>
        </div>
      </footer>
    </main>
  );
}
