"use client";

import Link from "next/link";
import { Shield, LayoutDashboard, Database, CreditCard, Stethoscope, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleSimulate = (plan: "BASIC" | "PRO" | "MAX") => {
    localStorage.setItem("medcore_simulated_plan", plan);
    router.push("/master");
  };

  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden flex flex-col items-center justify-center p-6 sm:p-24 selection:bg-teal-500 selection:text-black">
      
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-teal-500/20 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-cyan-500/10 blur-[100px] rounded-full"></div>

      {/* Glass Navigation */}
      <nav className="fixed top-6 z-50 px-8 py-3 bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-full flex items-center gap-8 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center border border-teal-500/20">
            <Stethoscope className="text-teal-400" size={16} />
          </div>
          <span className="font-black text-sm tracking-tighter uppercase italic">Medcore <span className="text-zinc-500">Vital</span></span>
        </div>
        <div className="h-4 w-[1px] bg-zinc-800"></div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-xs font-bold text-zinc-400 hover:text-white transition-colors">Entrar</Link>
          <Link href="/register" className="px-5 py-2 bg-white text-black text-xs font-black rounded-full hover:bg-teal-400 transition-all shadow-lg active:scale-95">Começar Agora</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 text-center space-y-8 animate-in fade-in zoom-in-95 duration-1000">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span> Sistema de Gestão Hospitalar v2.0
        </div>

        <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] italic">
          Operação <br />
          <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-500 bg-clip-text text-transparent">VitalFlow</span>
        </h1>

        <p className="max-w-xl mx-auto text-zinc-500 text-lg md:text-xl font-medium leading-relaxed">
          Arquitetura modular para performance extrema, auditoria clínica inteligente e gestão financeira em tempo real.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/master" className="w-full sm:w-auto px-8 py-4 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-teal-400 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] group italic text-sm">
            Acessar Controle <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a href="#planos" className="w-full sm:w-auto px-8 py-4 bg-zinc-900 border border-zinc-800 font-bold rounded-2xl hover:bg-zinc-800 transition-all cursor-pointer">
            Ver Planos
          </a>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-24 w-full max-w-6xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
        <div className="p-8 rounded-3xl bg-zinc-950/50 border border-zinc-900 group hover:border-teal-500/30 transition-all">
          <Database className="text-teal-500 mb-6" size={24} />
          <h2 className="text-lg font-bold mb-2">Cloud Synced</h2>
          <p className="text-zinc-600 text-sm leading-relaxed">Infraestrutura Supabase com sincronização global instantânea.</p>
        </div>
        <div className="p-8 rounded-3xl bg-zinc-950/50 border border-zinc-900 group hover:border-cyan-500/30 transition-all">
          <LayoutDashboard className="text-cyan-500 mb-6" size={24} />
          <h2 className="text-lg font-bold mb-2">Smart Dashboard</h2>
          <p className="text-zinc-600 text-sm leading-relaxed">Interface focada em UX rápida para médicos e auditores.</p>
        </div>
        <div className="p-8 rounded-3xl bg-zinc-950/50 border border-zinc-900 group hover:border-zinc-500/30 transition-all">
          <Shield className="text-zinc-400 mb-6" size={24} />
          <h2 className="text-lg font-bold mb-2">RBAC & PIN</h2>
          <p className="text-zinc-600 text-sm leading-relaxed">Segurança multinível com proteção por PIN para auditoria.</p>
        </div>
        <div className="p-8 rounded-3xl bg-zinc-950/50 border border-zinc-900 group hover:border-teal-500/30 transition-all">
          <CreditCard className="text-teal-500 mb-6" size={24} />
          <h2 className="text-lg font-bold mb-2">SaaS Billing</h2>
          <p className="text-zinc-600 text-sm leading-relaxed">Ativação automática de módulos via faturamento recorrente.</p>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="planos" className="relative z-10 w-full max-w-6xl mt-32 space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Planos e Preços</h2>
          <p className="text-zinc-500 text-lg">Escolha o nível de inteligência ideal para a sua estrutura clínica.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Basic */}
          <div className="p-6 rounded-3xl bg-zinc-950/50 border border-zinc-900 flex flex-col items-center text-center group hover:border-zinc-500/30 transition-all">
            <h3 className="text-zinc-400 font-bold mb-2 uppercase tracking-widest text-xs">Basic</h3>
            <div className="text-3xl font-black mb-1">R$ 19,99<span className="text-sm text-zinc-600 font-medium">/m</span></div>
            <p className="text-xs text-zinc-600 mt-2 mb-6">Ideal para profissionais autônomos e gestão de agenda.</p>
            <button onClick={() => handleSimulate("BASIC")} className="w-full mt-auto px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-bold hover:bg-zinc-800 transition-colors">Acesso Rápido (Demo)</button>
          </div>

          {/* Pro */}
          <div className="p-6 rounded-3xl bg-zinc-950/50 border border-zinc-900 flex flex-col items-center text-center group hover:border-teal-500/30 transition-all relative overflow-hidden">
            <div className="absolute top-0 w-full h-1 bg-teal-500"></div>
            <h3 className="text-teal-400 font-bold mb-2 uppercase tracking-widest text-xs mt-2">Pro</h3>
            <div className="text-3xl font-black mb-1">R$ 49,99<span className="text-sm text-zinc-600 font-medium">/m</span></div>
            <p className="text-xs text-zinc-600 mt-2 mb-6">Para Clínicas de pequeno porte e IA assistente.</p>
            <button onClick={() => handleSimulate("PRO")} className="w-full mt-auto px-4 py-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold hover:bg-teal-500/20 transition-colors">Acesso Rápido (Demo)</button>
          </div>

          {/* Max */}
          <div className="p-6 rounded-3xl bg-teal-950/20 border border-teal-500/30 flex flex-col items-center text-center hover:border-teal-400/50 transition-all relative transform lg:-translate-y-4 shadow-[0_0_40px_rgba(20,184,166,0.15)]">
            <div className="absolute top-0 w-full flex justify-center -mt-3">
              <span className="bg-teal-500 text-black text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">Recomendado</span>
            </div>
            <h3 className="text-teal-300 font-bold mb-2 uppercase tracking-widest text-xs mt-4">Max</h3>
            <div className="text-3xl xl:text-4xl font-black mb-1 text-white">R$ 97,99<span className="text-sm text-teal-500/50 font-medium">/m</span></div>
            <p className="text-xs text-zinc-400 mt-2 mb-6">Auditoria completa para múltiplos setores.</p>
            <button onClick={() => handleSimulate("MAX")} className="w-full mt-auto px-4 py-3 rounded-xl bg-teal-500 text-black text-xs font-black shadow-lg hover:bg-teal-400 transition-colors">Acesso Rápido (Demo)</button>
          </div>

          {/* Empresas */}
          <div className="p-6 rounded-3xl bg-zinc-950/50 border border-zinc-900 flex flex-col items-center text-center group hover:border-cyan-500/30 transition-all">
            <h3 className="text-cyan-400 font-bold mb-2 uppercase tracking-widest text-xs">Empresas</h3>
            <div className="text-3xl font-black mb-1">R$ 279,99<span className="text-sm text-zinc-600 font-medium">/m</span></div>
            <p className="text-[10px] font-black text-cyan-500/80 mb-2 uppercase tracking-widest bg-cyan-500/10 px-2 py-1 rounded-full">2 a 5 funcionários</p>
            <p className="text-xs text-zinc-600 mb-6">Gestão em rede e faturamento multi-clínica descentralizado.</p>
            <a href="mailto:empresas@medcore.com" className="w-full mt-auto px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold hover:bg-cyan-500/20 transition-colors">Painel Exclusivo</a>
          </div>

          {/* BigData */}
          <div className="p-6 rounded-3xl bg-zinc-950/50 border border-zinc-900 flex flex-col items-center text-center justify-center group hover:border-white/30 transition-all">
            <h3 className="text-white font-bold mb-2 uppercase tracking-widest text-xs">BigData</h3>
            <div className="text-2xl font-black mb-1 text-white">Consultar</div>
            <p className="text-xs text-zinc-600 mt-2 mb-6">Redes de Saúde com ultra volume e IA analítica em massa.</p>
            <a href="mailto:enterprise@medcore.com" className="w-full mt-auto px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-bold text-white hover:bg-zinc-800 transition-colors ring-1 ring-white/10 group-hover:ring-white/30">Falar com Especialista</a>
          </div>
        </div>
      </div>

      {/* Footer Decoration */}
      <footer className="mt-24 text-zinc-800 font-black text-[10vw] tracking-tighter select-none opacity-20 pointer-events-none uppercase italic">
        VitalFlow
      </footer>
    </main>
  );
}
