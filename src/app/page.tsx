"use client";

import Link from "next/link";
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
  TrendingUp,
  Lock,
  Bell
} from "lucide-react";

const demoScreens = [
  { label: "Visão Executiva", color: "from-violet-500/20 to-purple-600/20", border: "border-violet-500/30", icon: LayoutDashboard },
  { label: "Agenda Clínica", color: "from-emerald-500/20 to-teal-600/20", border: "border-emerald-500/30", icon: Calendar },
  { label: "IA Executiva", color: "from-cyan-500/20 to-blue-600/20", border: "border-cyan-500/30", icon: Brain },
];

const features = [
  { icon: Brain, title: "IA Clínica Nativa", text: "Análise preditiva de demandas hospitalares e insights em tempo real com MedCode AI.", color: "text-violet-400" },
  { icon: Calendar, title: "Agenda Inteligente", text: "Gerencie compromissos, notificações por WhatsApp e e-mail, com confirmação automática.", color: "text-emerald-400" },
  { icon: Shield, title: "Segurança LGPD", text: "Criptografia de ponta a ponta, RLS multinível e controle de acesso por função hospitalar.", color: "text-teal-400" },
  { icon: FileText, title: "Relatórios + PDF", text: "Exporte relatórios personalizados com logo do hospital, hash de autenticidade e dados do solicitante.", color: "text-cyan-400" },
  { icon: Users, title: "Multi-Usuário", text: "Defina funções, cargos e módulos para cada membro da equipe. Aprovação de acesso em 1 clique.", color: "text-sky-400" },
  { icon: Bell, title: "Notificações em Tempo Real", text: "Receba alertas críticos via app, e-mail ou WhatsApp para eventos hospitalares importantes.", color: "text-amber-400" },
];

const plans = [
  {
    name: "Free",
    price: "R$ 0",
    period: "",
    description: "Para profissionais que estão começando.",
    color: "border-zinc-800",
    highlight: false,
    badge: null,
    features: [
      "1 Unidade Hospitalar",
      "5 Demandas/mês",
      "10 Lembretes",
      "10 Cards Kanban",
      "Agenda básica",
      "Relatórios 60 dias",
      "Sem IA",
    ],
    cta: "Começar Grátis",
    href: "/register",
  },
  {
    name: "Pro",
    price: "R$ 49,99",
    period: "/mês",
    description: "Para clínicas e consultórios em crescimento.",
    color: "border-teal-500/40",
    highlight: false,
    badge: null,
    features: [
      "2 Unidades Hospitalares",
      "Demandas ilimitadas",
      "IA para Demandas",
      "Relatórios + PDF",
      "Scanner de documentos",
      "Jurídico com IA",
      "Relatórios 6 meses",
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
    badge: "Recomendado",
    features: [
      "5 Unidades Hospitalares",
      "IA em todos os módulos",
      "E-mails integrados (IMAP)",
      "Google, Outlook, Apple",
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
      "Armazenamento escalável",
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

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden selection:bg-teal-500 selection:text-black">

      {/* Background Orbs */}
      <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] bg-teal-500/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-violet-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Glass Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/80 rounded-full flex items-center gap-6 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-teal-500/15 flex items-center justify-center border border-teal-500/30">
            <Stethoscope className="text-teal-400" size={14} />
          </div>
          <span className="font-black text-sm tracking-tighter italic">
            Medcore <span className="text-teal-400">VitalFlow</span>
          </span>
        </div>
        <div className="h-4 w-[1px] bg-zinc-800" />
        <div className="hidden md:flex items-center gap-5 text-xs font-semibold text-zinc-400">
          <a href="#por-que" className="hover:text-white transition-colors">Por que usar</a>
          <a href="#funcionalidades" className="hover:text-white transition-colors">Funcionalidades</a>
          <a href="#planos" className="hover:text-white transition-colors">Planos</a>
        </div>
        <div className="h-4 w-[1px] bg-zinc-800 hidden md:block" />
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-xs font-bold text-zinc-400 hover:text-white transition-colors">Entrar</Link>
          <Link href="/register" className="px-4 py-2 bg-teal-500 text-black text-xs font-black rounded-full hover:bg-teal-400 transition-all shadow-lg active:scale-95">
            Começar Grátis
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6 pt-24 pb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-8 animate-in fade-in zoom-in-95 duration-700">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
          Plataforma de Gestão Hospitalar Inteligente
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] italic mb-8 animate-in fade-in zoom-in-95 duration-700 delay-150">
          O Sistema que os<br />
          <span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
            Hospitais Precisam
          </span>
        </h1>

        <p className="max-w-2xl text-zinc-400 text-lg md:text-xl font-medium leading-relaxed mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          VitalFlow centraliza agenda, demandas, jurídico, relatórios e IA clínica em uma plataforma modular.
          Do médico autônomo ao grande hospital — tudo em um lugar.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
          <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-teal-500 text-black font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-teal-400 transition-all shadow-[0_0_40px_rgba(20,184,166,0.3)] group text-sm">
            Começar Gratuitamente
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-zinc-900/80 border border-zinc-800 font-bold rounded-2xl hover:bg-zinc-800 transition-all text-sm">
            Já tenho conta — Entrar
          </Link>
        </div>

        {/* Demo Mockups */}
        <div className="flex flex-col md:flex-row items-end justify-center gap-4 w-full max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700">
          {demoScreens.map((screen, i) => (
            <div key={i} className={`relative flex-1 rounded-2xl bg-gradient-to-br ${screen.color} border ${screen.border} p-6 min-h-[200px] md:min-h-[260px] flex flex-col justify-between ${i === 1 ? 'md:scale-105 shadow-2xl z-10' : 'opacity-80'} transition-all hover:opacity-100 hover:scale-105`}>
              <div className="flex items-center gap-2 mb-4">
                <screen.icon size={16} className="text-white/80" />
                <span className="text-xs font-bold text-white/60 uppercase tracking-widest">{screen.label}</span>
              </div>
              <div className="space-y-2">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="h-2 bg-white/10 rounded-full" style={{ width: `${60 + Math.random() * 40}%` }} />
                ))}
              </div>
              <div className="mt-4 h-8 w-24 bg-white/10 rounded-lg" />
            </div>
          ))}
        </div>
      </section>

      {/* Por que usar section */}
      <section id="por-que" className="relative z-10 py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-black uppercase tracking-widest mb-6">
            Por que VitalFlow
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic mb-4">
            Do Caos à <span className="text-teal-400">Precisão Clínica</span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
            A maioria dos hospitais usa planilhas, grupos de WhatsApp e e-mails soltos. VitalFlow centraliza tudo com IA e controle real.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Zap, title: "Produtividade +40%", text: "Médicos e diretores tomam decisões mais rápidas com dashboards que mostram o que importa, na hora certa.", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
            { icon: TrendingUp, title: "Visibilidade Total", text: "Relatórios automáticos de demandas, jurídico, financeiro e produtividade com exportação PDF profissional.", color: "text-teal-400", bg: "bg-teal-500/10 border-teal-500/20" },
            { icon: Lock, title: "Conformidade LGPD", text: "Autenticação em 2 etapas, biometria, controle por função e auditoria de todas as ações com hash criptográfico.", color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
          ].map((item, i) => (
            <div key={i} className={`p-8 rounded-3xl border ${item.bg} group hover:scale-[1.02] transition-all`}>
              <div className={`w-12 h-12 rounded-2xl ${item.bg} border flex items-center justify-center mb-6`}>
                <item.icon className={item.color} size={24} />
              </div>
              <h3 className={`text-2xl font-black tracking-tight mb-3 ${item.color}`}>{item.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Funcionalidades */}
      <section id="funcionalidades" className="relative z-10 py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-black uppercase tracking-widest mb-6">
            Funcionalidades
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic mb-4">
            Uma Plataforma, <span className="text-violet-400">Tudo Dentro</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div key={i} className="p-6 rounded-2xl bg-zinc-950/60 border border-zinc-900 hover:border-zinc-700 transition-all group">
              <f.icon className={`${f.color} mb-4 group-hover:scale-110 transition-transform`} size={24} />
              <h3 className="text-base font-black text-white mb-2">{f.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Depoimento */}
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

      {/* Pricing */}
      <section id="planos" className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-black uppercase tracking-widest mb-6">
            Planos e Preços
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic mb-4">
            Do Free ao <span className="text-cyan-400">Empresarial</span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">Comece grátis. Escale quando precisar. Sem contratos anuais obrigatórios.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative flex flex-col p-6 rounded-3xl border ${plan.color} bg-zinc-950/60 transition-all hover:scale-[1.02] ${plan.highlight ? 'shadow-[0_0_50px_rgba(20,184,166,0.2)] bg-teal-950/30' : ''}`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg ${plan.highlight ? 'bg-teal-500 text-black' : 'bg-zinc-800 text-zinc-300 border border-zinc-700'}`}>
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6 mt-2">
                <h3 className={`text-xs font-black uppercase tracking-widest mb-2 ${plan.highlight ? 'text-teal-400' : 'text-zinc-400'}`}>{plan.name}</h3>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-black text-white">{plan.price}</span>
                  <span className="text-zinc-500 text-sm font-medium pb-1">{plan.period}</span>
                </div>
                <p className="text-xs text-zinc-500 mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-2.5 flex-1 mb-8">
                {plan.features.map((feat, j) => (
                  <li key={j} className="flex items-center gap-2 text-xs text-zinc-300">
                    <CheckCircle2 size={14} className={plan.highlight ? 'text-teal-400 shrink-0' : 'text-zinc-600 shrink-0'} />
                    {feat}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`w-full py-3 rounded-xl text-xs font-black text-center transition-all ${
                  plan.highlight
                    ? 'bg-teal-500 text-black hover:bg-teal-400 shadow-lg'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                }`}
              >
                {plan.cta}
                <ChevronRight size={14} className="inline ml-1" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-3xl mx-auto text-center p-12 rounded-3xl bg-gradient-to-br from-teal-950/60 to-violet-950/60 border border-teal-500/20">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic mb-4">
            Pronto para começar?
          </h2>
          <p className="text-zinc-400 mb-8 text-lg">Crie sua conta grátis em 30 segundos. Sem cartão de crédito.</p>
          <Link href="/register" className="inline-flex items-center gap-2 px-10 py-5 bg-teal-500 text-black font-black rounded-2xl hover:bg-teal-400 transition-all shadow-[0_0_40px_rgba(20,184,166,0.3)] text-base group">
            Criar Conta Gratuita
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
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
              Plataforma de gestão hospitalar inteligente para médicos, clínicas e redes de saúde.
            </p>
            <p className="text-zinc-600 text-xs mt-4">sac@medcore.app.br</p>
          </div>

          <div>
            <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-4">Produto</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><a href="#funcionalidades" className="hover:text-white transition-colors">Funcionalidades</a></li>
              <li><a href="#planos" className="hover:text-white transition-colors">Planos</a></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Acessar Plataforma</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-4">Suporte</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><a href="mailto:sac@medcore.app.br" className="hover:text-white transition-colors">Central de Ajuda</a></li>
              <li><a href="mailto:sac@medcore.app.br" className="hover:text-white transition-colors">Contato</a></li>
              <li><span className="text-zinc-600">Privacidade & LGPD</span></li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-zinc-700 text-xs">© 2026 Corttex Technologies. Todos os direitos reservados.</p>
          <p className="text-zinc-800 font-black text-2xl tracking-tighter italic opacity-40 select-none pointer-events-none">VitalFlow</p>
        </div>
      </footer>
    </main>
  );
}
