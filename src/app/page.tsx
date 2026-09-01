"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Shield,
  LayoutDashboard,
  Stethoscope,
  ArrowRight,
  CheckCircle2,
  Brain,
  Calendar,
  FileText,
  Users,
  Zap,
  ChevronRight,
  Star,
  Lock,
  Bell,
  HardDrive,
  MousePointer,
  Settings,
  Sparkles,
  Play,
  Check
} from "lucide-react";

import PageWrapper from "@/components/animations/PageWrapper";

// ─── PLANOS ───────────────────────────────────
const plans = [
  {
    name: "Free",
    price: "R$ 0",
    period: "",
    description: "Ideal para profissionais liberais.",
    color: "border-zinc-800",
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
    color: "border-violet-500/40",
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
    description: "Para hospitais e redes de saúde com múltiplos setores.",
    color: "border-teal-400",
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
    description: "Rede de hospitais com gestão descentralizada.",
    color: "border-cyan-500/30",
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
    color: "text-teal-400",
    border: "border-teal-400/20",
    bg: "bg-teal-400/5",
  },
  {
    num: "02",
    icon: Settings,
    title: "Escolha seus módulos",
    desc: "Selecione quais funcionalidades fazem sentido para sua clínica: agenda, demandas, jurídico, IA, Drive Cofre.",
    color: "text-violet-400",
    border: "border-violet-400/20",
    bg: "bg-violet-400/5",
  },
  {
    num: "03",
    icon: Users,
    title: "Convide sua equipe",
    desc: "Adicione médicos, secretárias e gestores com níveis de acesso por função. Tudo controlado por você.",
    color: "text-amber-400",
    border: "border-amber-400/20",
    bg: "bg-amber-400/5",
  },
  {
    num: "04",
    icon: Sparkles,
    title: "Ative a IA e escale",
    desc: "Com os dados da plataforma, a IA Executiva gera insights automáticos, prevê problemas e reduz erros operacionais.",
    color: "text-emerald-400",
    border: "border-emerald-400/20",
    bg: "bg-emerald-400/5",
  },
];

// ─── MÓDULOS PRINCIPAIS ───────────────────────
const mainModules = [
  {
    tag: "VISÃO EXECUTIVA",
    title: "Dashboards que tomam decisões por você",
    desc: "Painel central com indicadores de precisão clínica, demandas críticas, fluxo de pacientes e alertas de sobrecarga — tudo em tempo real, com filtro por unidade hospitalar.",
    bullets: ["Alertas de nível crítico em tempo real", "Indicadores de aderência ao protocolo", "Fluxo de ações prioritárias por setor"],
    image: "/demo-visao-executiva.png",
    color: "from-violet-600/20 to-purple-900/10",
    border: "border-violet-500/20",
    tag_color: "text-violet-400 border-violet-400/20 bg-violet-400/5",
    dot: "bg-violet-400",
    icon: LayoutDashboard,
  },
  {
    tag: "AGENDA CLÍNICA",
    title: "Gestão de agenda que se encaixa na sua rotina",
    desc: "Organize consultas, cirurgias e reuniões em um calendário inteligente com confirmação automática por WhatsApp e e-mail, sincronizado com Google e Outlook.",
    bullets: ["Confirmação automática via WhatsApp", "Sync com Google Agenda e Outlook", "Visão por médico, sala ou unidade"],
    image: "/demo-agenda-clinica.png",
    color: "from-teal-600/20 to-emerald-900/10",
    border: "border-teal-500/20",
    tag_color: "text-teal-400 border-teal-400/20 bg-teal-400/5",
    dot: "bg-teal-400",
    icon: Calendar,
  },
  {
    tag: "IA EXECUTIVA",
    title: "Inteligência artificial treinada para sua operação",
    desc: "O MedCode AI analisa seus dados clínicos e administrativos para gerar insights preditivos, detectar anomalias e recomendar ações antes dos problemas acontecerem.",
    bullets: ["Previsão de sobrecarga por setor", "Análise de laudos e documentos", "Resumo executivo automático por turno"],
    image: "/demo-ia-executiva.png",
    color: "from-cyan-600/20 to-blue-900/10",
    border: "border-cyan-500/20",
    tag_color: "text-cyan-400 border-cyan-400/20 bg-cyan-400/5",
    dot: "bg-cyan-400",
    icon: Brain,
  },
];

export default function Home() {
  const [activeDemo, setActiveDemo] = useState(0);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Detecta se voltamos do Google OAuth com código na URL errada
  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      console.log("Detectado código de autenticação na Home, redirecionando para callback...");
      router.push(`/api/auth/callback?code=${code}`);
    }
  }, [searchParams, router]);

  return (
    <main className="relative min-h-screen bg-black text-white overflow-x-hidden selection:bg-teal-500 selection:text-black">
      {/* BG Orbs */}
      <div className="fixed top-[-20%] left-[-10%] w-[700px] h-[700px] bg-teal-500/8 blur-[160px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-violet-500/8 blur-[130px] rounded-full pointer-events-none" />

      {/* ─── NAVBAR ─────────────────────────────── */}
      <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 bg-zinc-900/70 backdrop-blur-xl border border-zinc-800/80 rounded-full flex items-center gap-5 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-violet-500/15 flex items-center justify-center border border-violet-500/30">
            <Stethoscope className="text-violet-400" size={12} />
          </div>
          <span className="font-black text-sm tracking-tighter italic">
            Medcore <span className="text-violet-400">VitalFlow</span>
          </span>
        </div>
        <div className="h-4 w-[1px] bg-zinc-800" />
        <div className="hidden md:flex items-center gap-5 text-xs font-semibold text-zinc-400">
          <a href="#como-funciona" className="hover:text-white transition-colors">Como funciona</a>
          <a href="#plataforma" className="hover:text-white transition-colors">Plataforma</a>
          <a href="#drive" className="hover:text-white transition-colors">Drive Cofre</a>
          <a href="#planos" className="hover:text-white transition-colors">Planos</a>
        </div>
        <div className="h-4 w-[1px] bg-zinc-800 hidden md:block" />
        <div className="flex items-center gap-2">
          <Link href="/login" className="text-xs font-bold text-zinc-400 hover:text-white transition-colors">Entrar</Link>
          <Link href="/register" className="px-3 py-1.5 bg-violet-600 text-white text-xs font-black rounded-full hover:bg-violet-500 transition-all shadow-lg active:scale-95">
            Grátis →
          </Link>
        </div>
      </nav>

      {/* ─── HERO ────────────────────────────────── */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6 pt-24 pb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-8 animate-in fade-in zoom-in-95 duration-700">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
          Plataforma de Gestão Hospitalar com IA
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-tight italic mb-6 animate-in fade-in zoom-in-95 duration-700 delay-150">
          O Sistema que os<br />
          <span className="inline-block bg-gradient-to-r from-teal-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent pb-4 pr-4">
            Hospitais Precisam
          </span>
        </h1>
        <p className="max-w-2xl text-zinc-400 text-lg md:text-xl font-medium leading-relaxed mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          Agenda clínica, IA executiva, jurídico, Drive Cofre e relatórios em PDF — tudo integrado em uma plataforma.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
          <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-violet-600 text-white font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-violet-500 transition-all shadow-[0_0_40px_rgba(139,92,246,0.3)] group text-sm">
            Começar Gratuitamente
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a href="#plataforma" className="w-full sm:w-auto px-8 py-4 bg-zinc-900/80 border border-zinc-800 font-bold rounded-2xl hover:bg-zinc-800 transition-all text-sm flex items-center justify-center gap-2">
            <Play size={16} className="text-violet-400" /> Ver a plataforma
          </a>
        </div>

        {/* Demo Tab Selector */}
        <div className="w-full max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700">
          {/* Tabs */}
          <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
            {mainModules.map((m, i) => (
              <button
                key={i}
                onClick={() => setActiveDemo(i)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black border transition-all ${
                  activeDemo === i
                    ? `${m.tag_color} scale-105`
                    : "border-zinc-800 text-zinc-500 hover:border-zinc-600"
                }`}
              >
                <m.icon size={12} />
                {m.tag}
              </button>
            ))}
          </div>

          {/* Demo Image */}
          <div className={`relative rounded-3xl border overflow-hidden bg-gradient-to-br ${mainModules[activeDemo].color} ${mainModules[activeDemo].border} shadow-2xl`}>
            <div className="absolute top-0 left-0 right-0 h-8 bg-zinc-900/80 flex items-center gap-2 px-4">
              <div className="w-2.5 h-2.5 bg-red-500/70 rounded-full" />
              <div className="w-2.5 h-2.5 bg-amber-500/70 rounded-full" />
              <div className="w-2.5 h-2.5 bg-emerald-500/70 rounded-full" />
              <span className="ml-3 text-[10px] text-zinc-500 font-mono">app.medcore.com.br/dashboard</span>
            </div>
            <img
              src={mainModules[activeDemo].image}
              alt={mainModules[activeDemo].tag}
              className="w-full object-cover pt-8"
              style={{ maxHeight: "480px" }}
            />
          </div>
        </div>
      </section>

      {/* ─── COMO FUNCIONA (PASSO A PASSO) ──────── */}
      <section id="como-funciona" className="relative z-10 py-28 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-black uppercase tracking-widest mb-6">
            Como funciona
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic mb-4">
            Do cadastro ao <span className="text-teal-400">hospital conectado</span><br />em menos de 10 minutos
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto text-base">
            Uma jornada simples, guiada passo a passo. Você define o que quer usar — a plataforma se adapta.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {steps.map((step, i) => (
            <div key={i} className={`relative p-6 rounded-3xl border ${step.border} ${step.bg} group hover:scale-[1.02] transition-all`}>
              {/* Linha conectora (exceto último) */}
              {i < steps.length - 1 && (
                <div className="hidden xl:block absolute top-10 -right-3 w-6 h-[1px] bg-zinc-800 z-10" />
              )}
              <div className="flex items-start justify-between mb-5">
                <div className={`w-11 h-11 rounded-2xl border ${step.border} ${step.bg} flex items-center justify-center`}>
                  <step.icon className={step.color} size={22} />
                </div>
                <span className={`text-4xl font-black opacity-20 ${step.color} font-mono`}>{step.num}</span>
              </div>
              <h3 className={`text-base font-black ${step.color} italic mb-2`}>{step.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed font-medium">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── PLATAFORMA: MÓDULOS PRINCIPAIS ─────── */}
      <section id="plataforma" className="relative z-10 py-24 px-6 max-w-6xl mx-auto space-y-28">
        <div className="text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-black uppercase tracking-widest mb-6">
            Plataforma
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic">
            Cada módulo é <span className="text-violet-400">poderoso sozinho.</span><br />
            Juntos, são imbatíveis.
          </h2>
        </div>

        {mainModules.map((mod, i) => (
          <div
            key={i}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
          >
            {/* Texto */}
            <div className={`space-y-6 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
              <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${mod.tag_color}`}>
                <mod.icon size={12} /> {mod.tag}
              </span>
              <h3 className="text-3xl md:text-4xl font-black tracking-tighter italic leading-tight">
                {mod.title}
              </h3>
              <p className="text-zinc-400 text-base leading-relaxed">{mod.desc}</p>
              <ul className="space-y-3">
                {mod.bullets.map((b, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm text-zinc-300 font-medium">
                    <div className={`w-5 h-5 rounded-full bg-teal-500/10 border ${mod.border} flex items-center justify-center shrink-0`}>
                      <Check size={10} className="text-teal-400" />
                    </div>
                    {b}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className={`inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest ${mod.tag_color.split(" ")[0]} hover:underline mt-2`}
              >
                Começar agora <ArrowRight size={14} />
              </Link>
            </div>

            {/* Imagem */}
            <div className={`relative ${i % 2 === 1 ? "lg:order-1" : ""}`}>
              <div className={`absolute -inset-4 bg-gradient-to-br ${mod.color} blur-2xl rounded-3xl opacity-60`} />
              <div className={`relative rounded-3xl border ${mod.border} overflow-hidden shadow-2xl`}>
                {/* Browser Bar */}
                <div className="flex items-center gap-2 px-4 py-2.5 bg-zinc-950/90 border-b border-zinc-800/50">
                  <div className="w-2.5 h-2.5 bg-red-500/60 rounded-full" />
                  <div className="w-2.5 h-2.5 bg-amber-500/60 rounded-full" />
                  <div className="w-2.5 h-2.5 bg-emerald-500/60 rounded-full" />
                  <div className="ml-2 flex-1 bg-zinc-900 rounded px-3 py-0.5 text-[10px] text-zinc-600 font-mono">
                    app.medcore.com.br/{mod.tag.toLowerCase().replace(" ", "-")}
                  </div>
                </div>
                <img
                  src={mod.image}
                  alt={mod.title}
                  className="w-full object-cover"
                  style={{ maxHeight: "380px" }}
                />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ─── DRIVE COFRE ─────────────────────────── */}
      <section id="drive" className="relative z-10 py-24 px-6 max-w-6xl mx-auto">
        <div className="relative p-10 md:p-14 rounded-[3rem] border border-cyan-500/20 bg-gradient-to-br from-cyan-950/40 to-zinc-950 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-cyan-500/10 blur-[100px] rounded-full" />
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <HardDrive className="text-cyan-400" size={24} />
                </div>
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest">
                  Novo
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic">
                Drive Cofre<br />
                <span className="text-cyan-400">Seus documentos,</span><br />
                protegidos.
              </h2>
              <p className="text-zinc-400 text-base leading-relaxed">
                Armazene documentos, laudos, contratos e prontuários com criptografia de ponta a ponta. Acesse de qualquer dispositivo, compartilhe com controle de permissão por usuário.
              </p>
              <ul className="space-y-2.5">
                {[
                  "Criptografia AES-256 em todos os arquivos",
                  "Compartilhamento com link temporário",
                  "Controle de acesso por função e unidade",
                  "Scanner direto para o Drive (plano PRO+)",
                  "Backup automático diário",
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-zinc-300">
                    <CheckCircle2 size={15} className="text-cyan-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Storage Cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { plan: "Free", storage: "500 MB", icon: "📁", color: "border-zinc-700 bg-zinc-900/60" },
                { plan: "Pro", storage: "2 GB", icon: "💼", color: "border-teal-500/30 bg-teal-950/30" },
                { plan: "Max", storage: "5 GB", icon: "🏥", color: "border-cyan-500/30 bg-cyan-950/30" },
                { plan: "Empresas", storage: "20 GB", icon: "🏢", color: "border-violet-500/30 bg-violet-950/30" },
              ].map((item, i) => (
                <div key={i} className={`p-6 rounded-3xl border ${item.color} flex flex-col gap-3 hover:scale-[1.03] transition-all`}>
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{item.plan}</p>
                    <p className="text-2xl font-black text-white tracking-tight">{item.storage}</p>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full"
                      style={{ width: item.plan === "Free" ? "10%" : item.plan === "Pro" ? "25%" : item.plan === "Max" ? "50%" : "90%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── POR QUE USAR ────────────────────────── */}
      <section className="relative z-10 py-20 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: Zap, title: "Produtividade +40%", text: "Médicos e gestores tomam decisões mais rápidas com dashboards que mostram o que importa, na hora certa.", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
            { icon: Bell, title: "Zero perda de informação", text: "Alertas automáticos por WhatsApp e e-mail garantem que demandas críticas nunca passem despercebidas.", color: "text-teal-400", bg: "bg-teal-500/10 border-teal-500/20" },
            { icon: Lock, title: "Conformidade LGPD", text: "Autenticação 2FA, biometria, RLS multinível e auditoria completa de todas as ações com hash criptográfico.", color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
          ].map((item, i) => (
            <div key={i} className={`p-8 rounded-3xl border ${item.bg} group hover:scale-[1.02] transition-all`}>
              <div className={`w-12 h-12 rounded-2xl ${item.bg} border flex items-center justify-center mb-6`}>
                <item.icon className={item.color} size={24} />
              </div>
              <h3 className={`text-xl font-black tracking-tight mb-3 ${item.color}`}>{item.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── DEPOIMENTO ──────────────────────────── */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => <Star key={i} size={20} className="text-teal-400 fill-teal-400" />)}
          </div>
          <p className="text-xl md:text-2xl text-zinc-300 font-medium italic leading-relaxed mb-6">
            "VitalFlow transformou a forma como gerenciamos nossas demandas. O que levava horas, agora leva minutos. A IA clínica é o diferencial que nenhum outro sistema oferece."
          </p>
          <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Dr. Ricardo A. — Diretor Clínico, Hospital São Lucas</p>
        </div>
      </section>

      {/* ─── PLANOS ──────────────────────────────── */}
      <section id="planos" className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-black uppercase tracking-widest mb-6">
            Planos e Preços
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic mb-4">
            Do Free ao <span className="text-cyan-400">Empresarial</span>
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">Comece grátis. Escale quando precisar. Sem contratos anuais obrigatórios.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative flex flex-col p-6 rounded-3xl border ${plan.color} bg-zinc-950/60 transition-all hover:scale-[1.02] ${plan.highlight ? "shadow-[0_0_60px_rgba(20,184,166,0.15)] bg-teal-950/30" : ""}`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg ${plan.highlight ? "bg-teal-500 text-black" : "bg-zinc-800 text-zinc-300 border border-zinc-700"}`}>
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-5 mt-2">
                <h3 className={`text-xs font-black uppercase tracking-widest mb-2 ${plan.highlight ? "text-teal-400" : "text-zinc-400"}`}>{plan.name}</h3>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-black text-white">{plan.price}</span>
                  <span className="text-zinc-500 text-sm font-medium pb-1">{plan.period}</span>
                </div>
                <p className="text-xs text-zinc-500 mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-2.5 flex-1 mb-8">
                {plan.features.map((feat, j) => (
                  <li key={j} className="flex items-center gap-2 text-xs text-zinc-300">
                    <CheckCircle2 size={13} className={plan.highlight ? "text-teal-400 shrink-0" : "text-zinc-600 shrink-0"} />
                    {feat.includes("Drive Cofre") ? (
                      <span>{feat.split(":")[0]}: <strong className="text-cyan-400">{feat.split(":")[1]}</strong></span>
                    ) : feat}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`w-full py-3 rounded-xl text-xs font-black text-center transition-all ${
                  plan.highlight
                    ? "bg-teal-500 text-black hover:bg-teal-400 shadow-lg"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800"
                }`}
              >
                {plan.cta} <ChevronRight size={13} className="inline ml-0.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA FINAL ───────────────────────────── */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-3xl mx-auto text-center p-12 rounded-3xl bg-gradient-to-br from-teal-950/60 to-violet-950/60 border border-teal-500/20">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic mb-4">Pronto para começar?</h2>
          <p className="text-zinc-400 mb-8 text-lg">Crie sua conta grátis em 30 segundos. Sem cartão de crédito.</p>
          <Link href="/register" className="inline-flex items-center gap-2 px-10 py-5 bg-teal-500 text-black font-black rounded-2xl hover:bg-teal-400 transition-all shadow-[0_0_40px_rgba(20,184,166,0.3)] text-base group">
            Criar Conta Gratuita
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────── */}
      <footer className="relative z-10 border-t border-zinc-900 py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-teal-500/15 flex items-center justify-center border border-teal-500/30">
                <Stethoscope className="text-teal-400" size={16} />
              </div>
              <span className="font-black text-sm tracking-tighter italic">Medcore <span className="text-teal-400">VitalFlow</span></span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
              Plataforma de gestão hospitalar com IA para médicos, clínicas e redes de saúde.
            </p>
            <p className="text-zinc-600 text-xs mt-3">sac@medcore.app.br</p>
          </div>
          <div>
            <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-4">Produto</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><a href="#plataforma" className="hover:text-white transition-colors">Plataforma</a></li>
              <li><a href="#drive" className="hover:text-white transition-colors">Drive Cofre</a></li>
              <li><a href="#planos" className="hover:text-white transition-colors">Planos</a></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Entrar</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-4">Suporte</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><a href="mailto:sac@medcore.app.br" className="hover:text-white transition-colors">Fale Conosco</a></li>
              <li><a href="tel:+551140028922" className="hover:text-white transition-colors">+55 (11) 4002-8922</a></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Política de Privacidade</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-zinc-700 text-xs">© 2026 Corttex Technologies. Todos os direitos reservados.</p>
          <p className="text-zinc-800 font-black text-3xl tracking-tighter italic opacity-30 select-none">VitalFlow</p>
        </div>
      </footer>
    </main>
  );
}
