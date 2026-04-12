import Link from "next/link";
import { Shield, LayoutDashboard, Database, CreditCard, Stethoscope, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden flex flex-col items-center justify-center p-6 sm:p-24 selection:bg-teal-500 selection:text-black">
      
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-teal-500/20 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-cyan-500/10 blur-[100px] rounded-full"></div>

      {/* Glass Navigation */}
      <nav className="fixed top-6 z-50 px-8 py-3 bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-full flex items-center gap-8 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="flex items-center gap-2">
          <Stethoscope className="text-teal-400" size={20} />
          <span className="font-black text-sm tracking-tighter uppercase">Medcore <span className="text-zinc-500">V2</span></span>
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

        <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9]">
          Sua Operação <br />
          <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-500 bg-clip-text text-transparent">Ultra-Leve</span>
        </h1>

        <p className="max-w-xl mx-auto text-zinc-500 text-lg md:text-xl font-medium leading-relaxed">
          Arquitetura modular para performance extrema, auditoria clínica inteligente e gestão financeira em tempo real.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-teal-400 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] group">
            Acessar Painel <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="w-full sm:w-auto px-8 py-4 bg-zinc-900 border border-zinc-800 font-bold rounded-2xl hover:bg-zinc-800 transition-all">
            Ver Planos
          </button>
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

      {/* Footer Decoration */}
      <footer className="mt-24 text-zinc-800 font-black text-[12vw] tracking-tighter select-none opacity-20 pointer-events-none uppercase">
        Medcore V2
      </footer>
    </main>
  );
}
