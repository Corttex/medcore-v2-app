"use client";

import { useState, useEffect } from "react";
import { LoginForm } from "@/features/authentication/LoginForm";
import { Logo } from "@/components/ui/Logo";
import { ShieldCheck, Activity, Lock, Globe, Cpu, CheckCircle2, Sun, Moon } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") setDark(false);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className={`min-h-screen flex flex-col relative overflow-hidden font-sans transition-colors duration-300 ${dark ? "bg-black text-white" : "bg-zinc-100 text-zinc-900"}`}>

      {/* Efeitos de Fundo */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-brand/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[35%] h-[35%] bg-violet-600/5 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="flex-grow flex flex-col lg:flex-row relative z-10 overflow-hidden">

        {/* LADO ESQUERDO: Formulário de Login — FOCO PRINCIPAL */}
        <div className={`w-full lg:w-[52%] flex flex-col items-center justify-center p-6 lg:p-14 xl:p-20 relative order-1 border-r ${dark ? "border-white/5 bg-zinc-950/20" : "border-zinc-200 bg-white/60"}`}>
          <div className="w-full max-w-[460px] animate-in fade-in slide-in-from-left-8 duration-700">

            {/* Header Mobile */}
            <div className="lg:hidden mb-10 flex flex-col items-center gap-4">
              <Logo width={160} height={48} className="drop-shadow-[0_0_15px_rgba(var(--color-brand-rgb),0.3)]" />
              <div className="h-px w-12 bg-brand/30"></div>
            </div>

            <div className="mb-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 mb-4">
                <CheckCircle2 size={12} className="text-brand" />
                <span className="text-[11px] font-black text-brand uppercase tracking-widest">Sistema Operacional Ativo</span>
              </div>
              <h1 className={`text-5xl font-black uppercase tracking-tight mb-2 leading-none italic ${dark ? "text-white" : "text-zinc-900"}`}>
                Acesso Restrito
              </h1>
              <p className={`text-sm font-bold uppercase tracking-[0.15em] max-w-[320px] lg:max-w-none ${dark ? "text-zinc-400" : "text-zinc-500"}`}>
                Autentique-se para acessar o núcleo MedCore
              </p>
            </div>

            <main className="w-full relative">
              <div className="absolute -inset-0.5 bg-gradient-to-b from-brand/20 to-transparent rounded-[2.5rem] blur opacity-10 transition duration-1000"></div>
              <div className="relative">
                <LoginForm />
              </div>
            </main>
          </div>
        </div>

        {/* LADO DIREITO: Cards de Métricas — COMPACTOS, DECORATIVOS */}
        <div className={`hidden lg:flex w-full lg:w-[48%] relative overflow-hidden flex-col items-center justify-center p-10 order-2 ${dark ? "bg-zinc-950/40" : "bg-zinc-50/80"}`}>
          {/* Grid de Fundo */}
          <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '32px 32px' }}>
          </div>

          <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-6">
            {/* Logo */}
            <div className="flex flex-col items-center gap-3 text-center">
              <Logo width={220} height={66} className="drop-shadow-[0_0_20px_rgba(var(--color-brand-rgb),0.2)]" />
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20">
                <span className="text-[9px] font-black text-brand uppercase tracking-widest">V2.0 Core</span>
              </div>
              <p className={`text-[10px] font-black uppercase tracking-[0.4em] italic ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
                Authorized Personnel Only
              </p>
            </div>

            {/* Cards compactos — 2x2 grid */}
            <div className="grid grid-cols-2 gap-3 w-full">
              {/* Response */}
              <div className={`border rounded-2xl p-4 flex items-center gap-3 transition-all hover:scale-[1.02] ${dark ? "bg-white/[0.03] border-white/5" : "bg-white border-zinc-200 shadow-sm"}`}>
                <div className="w-8 h-8 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
                  <Activity size={15} className="text-brand" />
                </div>
                <div>
                  <p className={`text-[8px] font-black uppercase tracking-widest ${dark ? "text-zinc-500" : "text-zinc-400"}`}>Response</p>
                  <p className={`text-base font-black tabular-nums ${dark ? "text-white" : "text-zinc-900"}`}>0.8ms</p>
                </div>
              </div>

              {/* Encrypted */}
              <div className={`border rounded-2xl p-4 flex items-center gap-3 transition-all hover:scale-[1.02] ${dark ? "bg-white/[0.03] border-white/5" : "bg-white border-zinc-200 shadow-sm"}`}>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <ShieldCheck size={15} className="text-emerald-400" />
                </div>
                <div>
                  <p className={`text-[8px] font-black uppercase tracking-widest ${dark ? "text-zinc-500" : "text-zinc-400"}`}>Encrypted</p>
                  <p className={`text-base font-black uppercase ${dark ? "text-white" : "text-zinc-900"}`}>YES</p>
                </div>
              </div>

              {/* Uptime */}
              <div className={`border rounded-2xl p-4 flex items-center gap-3 transition-all hover:scale-[1.02] ${dark ? "bg-white/[0.03] border-white/5" : "bg-white border-zinc-200 shadow-sm"}`}>
                <div className="w-8 h-8 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
                  <Globe size={15} className="text-violet-400" />
                </div>
                <div>
                  <p className={`text-[8px] font-black uppercase tracking-widest ${dark ? "text-zinc-500" : "text-zinc-400"}`}>Uptime</p>
                  <p className={`text-base font-black tabular-nums ${dark ? "text-white" : "text-zinc-900"}`}>99.98%</p>
                </div>
              </div>

              {/* AES */}
              <div className={`border border-brand/20 rounded-2xl p-4 flex items-center gap-3 transition-all hover:scale-[1.02] bg-gradient-to-br from-brand/10 to-transparent`}>
                <div className="w-8 h-8 rounded-xl bg-brand/20 flex items-center justify-center shrink-0">
                  <Lock size={15} className="text-brand" />
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-brand/70">Security</p>
                  <p className={`text-[11px] font-black uppercase leading-tight ${dark ? "text-white" : "text-zinc-900"}`}>AES-256</p>
                </div>
              </div>
            </div>

            {/* Rodapé decorativo */}
            <div className={`flex items-center gap-5 text-[8px] font-black uppercase tracking-widest ${dark ? "text-zinc-700" : "text-zinc-400"}`}>
              <div className="flex items-center gap-1.5">
                <Cpu size={11} />
                <span>MedCore Neural</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-current opacity-40"></div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={11} />
                <span>Zero Trust</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RODAPÉ */}
      <footer className={`relative z-10 w-full py-3 px-8 border-t flex flex-col md:flex-row items-center justify-between gap-3 backdrop-blur-md ${dark ? "border-white/5 bg-zinc-950/80" : "border-zinc-200 bg-white/80"}`}>
        <div className="flex items-center gap-3">
          <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${dark ? "text-zinc-600" : "text-zinc-400"}`}>MedCore V2.0</span>
          <div className={`w-1 h-1 rounded-full ${dark ? "bg-zinc-800" : "bg-zinc-300"}`}></div>
          <span className={`text-[9px] font-bold uppercase tracking-widest ${dark ? "text-zinc-500" : "text-zinc-400"}`}>v2.0.4 · Build 2026.04.29</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-brand shadow-[0_0_8px_var(--color-brand)]"></div>
          <span className={`text-[9px] font-black uppercase tracking-widest italic ${dark ? "text-white/30" : "text-zinc-400"}`}>Coretech Solutions Corp</span>
        </div>

        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-4 text-[9px] font-black uppercase tracking-widest ${dark ? "text-zinc-600" : "text-zinc-400"}`}>
            <Link href="/termos" className="hover:text-brand transition-colors">Termos</Link>
            <Link href="/privacidade" className="hover:text-brand transition-colors">Privacidade</Link>
            <Link href="/suporte" className="hover:text-brand transition-colors">Suporte</Link>
          </div>

          {/* Toggle Light/Dark */}
          <button
            onClick={() => setDark(!dark)}
            className={`ml-3 flex items-center gap-2 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest transition-all hover:scale-105 ${
              dark
                ? "border-white/10 bg-white/5 text-zinc-400 hover:text-white"
                : "border-zinc-300 bg-zinc-100 text-zinc-500 hover:text-zinc-800"
            }`}
            title="Alternar tema"
          >
            {dark ? <Sun size={11} /> : <Moon size={11} />}
            {dark ? "Light" : "Dark"}
          </button>
        </div>
      </footer>
    </div>
  );
}
