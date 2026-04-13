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
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      await authService.signInWithGoogle();
    } catch (err: any) {
      setError("Falha ao conectar com Google. Tente novamente.");
      setGoogleLoading(false);
    }
  };

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

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
        className="group w-full flex items-center justify-center gap-3 bg-surface-container-highest/50 hover:bg-surface-container-highest border border-outline-variant/20 h-14 rounded-xl transition-all duration-300 relative overflow-hidden shadow-inner disabled:opacity-60"
      >
        {googleLoading ? (
          <Loader2 size={18} className="animate-spin text-on-surface-variant" />
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            <span className="font-body text-sm font-semibold text-on-surface/80 group-hover:text-on-surface">Continuar com Google</span>
          </>
        )}
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
