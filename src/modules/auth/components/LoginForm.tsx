"use client";

import React, { useState } from "react";
import { authService } from "../services/authService";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2, ArrowRight, Fingerprint } from "lucide-react";
import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await authService.signIn(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Falha ao realizar login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="space-y-3">
        <h2 className="font-heading text-4xl font-extrabold text-on-surface tracking-tight italic">
          Bem-vindo ao <span className="text-gradient">MedCore V2</span>
        </h2>
        <p className="text-on-surface-variant font-medium text-sm tracking-wide">
          Acesso Seguro ao Clinical Observer
        </p>
      </div>

      <button className="group w-full flex items-center justify-center gap-4 bg-surface-container-highest/50 hover:bg-surface-container-highest border border-outline-variant/20 h-14 rounded-xl transition-all duration-300 relative overflow-hidden shadow-inner">
        <img 
          alt="Google Logo" 
          className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity" 
          src="https://www.google.com/favicon.ico" 
        />
        <span className="font-body text-sm font-semibold text-on-surface/80 group-hover:text-on-surface">Continuar com Google</span>
        <div className="absolute top-0 right-0 px-3 py-1 bg-primary/20 text-primary text-[10px] font-black uppercase tracking-tighter rounded-bl-lg">Em breve</div>
      </button>

      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-outline-variant/10"></div>
        <span className="flex-shrink mx-4 text-outline-variant text-[10px] uppercase tracking-[0.3em] font-black">ou use seu e-mail</span>
        <div className="flex-grow border-t border-outline-variant/10"></div>
      </div>

      {error && (
        <div className="p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm font-medium animate-shake">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-8">
        <div className="space-y-6">
          <div className="space-y-2 group">
            <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] ml-1" htmlFor="email">
              E-mail Corporativo
            </label>
            <div className="relative">
              <input 
                className="w-full bg-surface-container-highest/40 border border-outline-variant/15 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none h-14 px-5 rounded-xl text-sm text-on-surface transition-all duration-300 placeholder:text-outline-variant/40 font-medium"
                id="email" 
                placeholder="exemplo@medcore.com.br" 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Mail className="absolute right-5 top-1/2 -translate-y-1/2 text-outline-variant/40 group-focus-within:text-primary transition-colors" size={18} />
            </div>
          </div>

          <div className="space-y-2 group">
            <div className="flex justify-between items-center px-1">
              <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]" htmlFor="password">
                Senha de Acesso
              </label>
              <Link className="text-[10px] font-black text-primary hover:text-primary-container transition-colors uppercase tracking-[0.2em]" href="#">
                Esqueceu?
              </Link>
            </div>
            <div className="relative">
              <input 
                className="w-full bg-surface-container-highest/40 border border-outline-variant/15 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none h-14 px-5 rounded-xl text-sm text-on-surface transition-all duration-300 placeholder:text-outline-variant/40"
                id="password" 
                placeholder="••••••••••••" 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Lock className="absolute right-5 top-1/2 -translate-y-1/2 text-outline-variant/40 group-focus-within:text-primary transition-colors" size={18} />
            </div>
          </div>
        </div>

        <button 
          className="w-full btn-gradient h-16 rounded-xl font-heading font-black text-on-primary shadow-2xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50 group/btn" 
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            <>
              Entrar no Dashboard
              <ArrowRight className="group-hover/btn:translate-x-1.5 transition-transform" size={20} />
            </>
          )}
        </button>
      </form>

      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-2 group cursor-pointer">
          <Fingerprint className="text-primary/80 group-hover:text-primary transition-colors" size={20} />
          <Link className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface transition-colors" href="#">
            Acessar via <span className="text-primary font-bold">Código PIN</span>
          </Link>
        </div>

        {/* MODO SIMULADOR RÁPIDO (TEMPORÁRIO) */}
        <div className="w-full mt-4 p-4 rounded-2xl border border-dashed border-teal-500/40 bg-teal-500/5 backdrop-blur-sm animate-pulse-slow">
          <p className="text-[10px] font-black text-teal-400 uppercase tracking-widest text-center mb-3">🛠️ Simulador / Fast-Track</p>
          <div className="flex justify-center gap-2">
            <button 
              type="button"
              onClick={() => { localStorage.setItem("medcore_simulated_plan", "BASIC"); router.push("/dashboard"); }}
              className="flex-1 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs font-bold text-zinc-400 hover:bg-zinc-800 transition-colors"
            >
              BASIC
            </button>
            <button 
              type="button"
              onClick={() => { localStorage.setItem("medcore_simulated_plan", "PRO"); router.push("/dashboard"); }}
              className="flex-1 py-2 bg-teal-900/30 border border-teal-500/30 rounded-lg text-xs font-bold text-teal-400 hover:bg-teal-900/50 transition-colors"
            >
              PRO
            </button>
            <button 
              type="button"
              onClick={() => { localStorage.setItem("medcore_simulated_plan", "MAX"); router.push("/dashboard"); }}
              className="flex-1 py-2 bg-teal-500 text-black border border-teal-400 rounded-lg text-xs font-black shadow-[0_0_15px_rgba(20,184,166,0.3)] hover:bg-teal-400 transition-colors"
            >
              MAX
            </button>
          </div>
        </div>

        <p className="text-[11px] text-center text-outline-variant/60 leading-relaxed font-medium max-w-[280px]">
          Sistema de auditoria médica criptografado. Ao entrar, você concorda com nossos protocolos de privacidade.
        </p>
      </div>
    </div>
  );
}
