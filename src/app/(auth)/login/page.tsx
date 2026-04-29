"use client";

import { LoginForm } from "@/modules/auth/components/LoginForm";
import { Logo } from "@/modules/shared/components/Logo";
import { ShieldCheck, Activity, Lock, Globe, Cpu, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden font-sans">
      {/* Efeitos de Fundo */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-brand/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-violet-600/5 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="flex-grow flex flex-col lg:flex-row relative z-10 overflow-hidden">
        {/* LADO ESQUERDO: Terminal de Login */}
        <div className="w-full lg:w-[45%] flex flex-col items-center justify-center p-6 lg:p-12 xl:p-20 relative order-1 border-r border-white/5 bg-zinc-950/20">
          <div className="w-full max-w-[420px] animate-in fade-in slide-in-from-left-8 duration-1000">
            {/* Header Mobile */}
            <div className="lg:hidden mb-10 flex flex-col items-center gap-4">
               <Logo width={160} height={48} className="drop-shadow-[0_0_15px_rgba(var(--color-brand-rgb),0.3)]" />
               <div className="h-px w-12 bg-brand/30"></div>
            </div>
            
            <div className="mb-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 mb-4">
                <CheckCircle2 size={12} className="text-brand" />
                <span className="text-[10px] font-black text-brand uppercase tracking-widest">Sistema Operacional Ativo</span>
              </div>
              <h1 className="text-4xl font-black text-white uppercase tracking-tight mb-2 leading-none italic">Acesso Restrito</h1>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] max-w-[280px] lg:max-w-none">Autentique-se para acessar o núcleo MedCore</p>
            </div>

            <main className="w-full relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-b from-brand/20 to-transparent rounded-[2.5rem] blur opacity-10 transition duration-1000"></div>
              <div className="relative">
                <LoginForm />
              </div>
            </main>
          </div>
        </div>

        {/* LADO DIREITO: Painel de Segurança e Marca */}
        <div className="hidden lg:flex w-full lg:w-[55%] bg-zinc-950/40 relative overflow-hidden flex-col items-center justify-center p-12 xl:p-24 order-2">
          {/* Grid de Fundo Interno */}
          <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '32px 32px' }}>
          </div>

          <div className="relative z-10 w-full max-w-2xl flex flex-col items-center">
            {/* Seção da Marca */}
            <div className="mb-12 flex flex-col items-center space-y-4 text-center animate-in fade-in zoom-in-95 duration-1000">
              <div className="relative">
                <Logo width={300} height={90} className="drop-shadow-[0_0_30_rgba(var(--color-brand-rgb),0.3)]" />
                <div className="absolute -top-6 -right-12 bg-brand/10 border border-brand/20 rounded-full px-4 py-1 backdrop-blur-md">
                  <span className="text-[10px] font-black text-brand uppercase tracking-widest">V2.0 Core</span>
                </div>
              </div>
              <p className="text-xs font-black uppercase tracking-[0.5em] text-zinc-500 italic">
                Authorized Personnel Only
              </p>
            </div>

            {/* Dashboard de Métricas */}
            <div className="grid grid-cols-2 gap-4 w-full animate-in fade-in slide-up-8 duration-1000 delay-300">
              <div className="bg-white/[0.03] border border-white/5 backdrop-blur-xl p-6 rounded-[2rem] flex flex-col items-center group hover:bg-white/[0.05] transition-all text-center">
                <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Activity size={20} className="text-brand" />
                </div>
                <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Response</span>
                <span className="text-2xl font-black text-white tracking-tighter tabular-nums">0.8ms</span>
              </div>

              <div className="bg-white/[0.03] border border-white/5 backdrop-blur-xl p-6 rounded-[2rem] flex flex-col items-center group hover:bg-white/[0.05] transition-all text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ShieldCheck size={20} className="text-emerald-400" />
                </div>
                <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Encrypted</span>
                <span className="text-2xl font-black text-white tracking-tighter tabular-nums uppercase">YES</span>
              </div>

              <div className="bg-white/[0.03] border border-white/5 backdrop-blur-xl p-6 rounded-[2rem] flex flex-col items-center group hover:bg-white/[0.05] transition-all text-center">
                <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Globe size={20} className="text-violet-400" />
                </div>
                <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Uptime</span>
                <span className="text-2xl font-black text-white tracking-tighter tabular-nums">99.98%</span>
              </div>

              <div className="bg-gradient-to-br from-brand/10 to-transparent border border-brand/20 backdrop-blur-2xl p-6 rounded-[2rem] flex flex-col items-center justify-center group hover:from-brand/15 transition-all text-center">
                <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center mb-2">
                  <Lock size={18} className="text-brand" />
                </div>
                <h3 className="text-[9px] font-black text-white uppercase tracking-wider mb-1">Military Grade Security</h3>
                <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">256-bit AES Encryption Active</p>
              </div>
            </div>

            <div className="mt-12 flex items-center gap-8 text-[8px] font-black text-zinc-600 uppercase tracking-widest animate-in fade-in duration-1000 delay-700">
               <div className="flex items-center gap-2">
                 <Cpu size={12} className="text-zinc-700" />
                 <span>Processamento Neural MedCore</span>
               </div>
               <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
               <div className="flex items-center gap-2">
                 <ShieldCheck size={12} className="text-zinc-700" />
                 <span>Protocolo Zero Trust Ativo</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* RODAPÉ SLIM */}
      <footer className="relative z-10 w-full py-4 px-8 border-t border-white/5 bg-zinc-950/80 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em]">MedCore V2.0 Core</span>
          <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">v2.0.4 - Build 2026.04.29</span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-brand shadow-[0_0_8px_var(--color-brand)]"></div>
            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest italic">Desenvolvido por Coretech Solutions Corp</span>
          </div>
          <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest ml-4">Registro Operacional #4429-A</span>
        </div>

        <div className="flex items-center gap-4 text-[9px] font-black text-zinc-600 uppercase tracking-widest">
           <Link href="/termos" className="hover:text-brand transition-colors">Termos</Link>
           <Link href="/privacidade" className="hover:text-brand transition-colors">Privacidade</Link>
           <Link href="/suporte" className="hover:text-brand transition-colors">Suporte</Link>
        </div>
      </footer>
    </div>
  );
}
