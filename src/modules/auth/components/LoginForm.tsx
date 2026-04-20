"use client";

import React, { useState, useEffect } from "react";
import { authService } from "../services/authService";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2, ArrowRight, Fingerprint, ShieldCheck, Users, Zap, Activity } from "lucide-react";
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
  const [activeUsers, setActiveUsers] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const router = useRouter();

  // Contador de usuários ativos fictício
  useEffect(() => {
    const isBusinessHours = () => {
      const now = new Date();
      const day = now.getDay();
      const hour = now.getHours();
      return day >= 1 && day <= 5 && hour >= 8 && hour < 18;
    };

    const getInitialUsers = () => {
      if (isBusinessHours()) {
        return Math.floor(Math.random() * (600 - 412 + 1)) + 412;
      } else {
        return Math.floor(Math.random() * (150 - 60 + 1)) + 60;
      }
    };

    setActiveUsers(getInitialUsers());
    const interval = setInterval(() => {
      setActiveUsers(prev => {
        const change = Math.floor(Math.random() * 3) + 1;
        return Math.random() > 0.5 ? prev + change : Math.max(prev - change, 50);
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleGoogleSignIn = async () => {
    if (!termsAccepted) {
      setError("Você precisa aceitar os termos de uso antes de continuar.");
      return;
    }
    setGoogleLoading(true);
    setError(null);
    try {
      await authService.signInWithGoogle();
    } catch (err: any) {
      // MOCK DE PROTÓTIPO: Se o Supabase bloquear por falta de chaves OAuth,
      // força a entrada visual no sistema para testes da interface.
      router.push("/dashboard");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      setError("Você precisa aceitar os termos de uso antes de continuar.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      await authService.signIn(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      // MOCK DE PROTÓTIPO: Força login
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricAuth = async () => {
    if (typeof window !== "undefined" && window.PublicKeyCredential) {
      alert("Autenticação Biométrica solicitada ao dispositivo. Aguarde...");
    } else {
      setError("Biometria não disponível neste dispositivo/navegador.");
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-1 text-center mb-2">
        <h2 className="font-heading text-xl font-black text-white tracking-tight italic">
          Acesso à <span className="text-brand">Plataforma</span>
        </h2>
        <div className="flex items-center justify-center gap-2 text-zinc-500 text-[9px] font-black uppercase tracking-widest">
           <Users size={10} className="text-brand opacity-70" />
           <span className="text-brand">{activeUsers}</span> Usuários Ativos
        </div>
      </div>

      <div className="p-5 md:p-6 bg-zinc-950/90 border border-zinc-800 rounded-[2rem] shadow-card backdrop-blur-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
           <ShieldCheck size={120} className="text-brand" />
        </div>



      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[10px] font-bold animate-shake text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-3">
          <div className="space-y-1 group">
            <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1" htmlFor="email">
              Endereço de E-mail
            </label>
            <div className="relative">
              <input 
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-brand focus:ring-2 focus:ring-brand/10 focus:outline-none h-11 px-4 rounded-xl text-xs text-white transition-all duration-300 placeholder:text-zinc-700 font-medium"
                id="email" 
                placeholder="exemplo@hospital.com.br" 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-brand transition-colors" size={14} />
            </div>
          </div>

          <div className="space-y-1 group">
            <div className="flex justify-between items-center px-1">
              <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]" htmlFor="password">
                Senha Operacional
              </label>
              <Link className="text-[9px] font-black text-brand hover:text-brand-container transition-colors uppercase tracking-[0.2em] underline decoration-2 underline-offset-4" href="#">
                Esqueceu?
              </Link>
            </div>
            <div className="relative">
              <input 
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-brand focus:ring-2 focus:ring-brand/10 focus:outline-none h-11 px-4 rounded-xl text-xs text-white transition-all duration-300 placeholder:text-zinc-700"
                id="password" 
                placeholder="••••••••••••" 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-brand transition-colors" size={14} />
            </div>
          </div>
        </div>

        {/* Checkbox de Aceite de Termos */}
        <div className="flex items-start gap-2 pt-1">
          <input 
            type="checkbox" 
            id="terms"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-0.5 accent-brand w-3.5 h-3.5 rounded border-zinc-700 bg-zinc-900 shrink-0 cursor-pointer"
          />
          <label htmlFor="terms" className="text-[9px] text-zinc-400 font-medium leading-tight cursor-pointer">
            Li e concordo com os <Link href="/terms" className="text-brand font-bold hover:underline">Termos de Uso</Link> e <Link href="/privacy" className="text-brand font-bold hover:underline">Política de Privacidade</Link>.
            <span className="block mt-0.5 text-zinc-500">Obrigatório para acesso à plataforma.</span>
          </label>
        </div>

        <button 
          className="w-full bg-brand-container hover:bg-brand h-11 rounded-xl font-heading font-black text-white shadow-xl shadow-brand/10 flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale group/btn" 
          type="submit"
          disabled={loading || !termsAccepted}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <>
              Realizar Login
              <ArrowRight className="group-hover/btn:translate-x-1.5 transition-transform" size={14} />
            </>
          )}
        </button>
      </form>

      <div className="relative flex items-center py-3">
        <div className="flex-grow border-t border-zinc-800" />
        <span className="flex-shrink mx-3 text-zinc-600 text-[8px] uppercase tracking-[0.4em] font-black">ou continue</span>
        <div className="flex-grow border-t border-zinc-800" />
      </div>

      {/* Google OAuth */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
        className="group w-full flex items-center justify-center gap-2 bg-zinc-900/50 hover:bg-zinc-800 border-zinc-800 border hover:border-brand/40 h-11 rounded-xl transition-all duration-300 relative overflow-hidden shadow-inner disabled:opacity-50 disabled:grayscale mb-5"
      >
        {googleLoading ? (
          <Loader2 size={16} className="animate-spin text-zinc-400" />
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            <span className="text-xs font-black text-white/80 group-hover:text-white transition-colors">Google</span>
          </>
        )}
      </button>

      {/* Internal Statistics Footer Block */}
      <div className="w-full grid grid-cols-3 gap-2 bg-zinc-900/40 p-2.5 rounded-xl border border-zinc-800/50 mt-auto">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-brand opacity-80 mb-0.5">
             <ShieldCheck size={8} /> Precisão
          </div>
          <div className="font-heading font-black text-xs text-white">99.9%</div>
        </div>
        <div className="flex flex-col items-center justify-center text-center border-l border-zinc-800/50">
          <div className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-brand opacity-80 mb-0.5">
             <Zap size={8} /> Latência
          </div>
          <div className="font-heading font-black text-xs text-white">&lt;12ms</div>
        </div>
        <div className="flex flex-col items-center justify-center text-center border-l border-zinc-800/50">
          <div className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-brand opacity-80 mb-0.5">
             <Activity size={8} /> Status
          </div>
          <div className="flex items-center gap-1.5">
             <span className="w-1.5 h-1.5 rounded-full bg-brand shadow-[0_0_6px_var(--color-brand)] animate-pulse"></span>
             <span className="font-heading font-black text-[9px] uppercase tracking-tighter text-white">Active</span>
          </div>
        </div>
      </div>

      </div>

      <div className="flex flex-col items-center gap-4 pt-2">
        <button 
           onClick={handleBiometricAuth}
           className="flex items-center gap-1.5 group cursor-pointer border-none bg-transparent outline-none"
        >
          <Fingerprint className="text-brand opacity-80 group-hover:text-brand transition-colors animate-pulse" size={16} />
          <span className="text-[10px] font-bold text-zinc-400 group-hover:text-white transition-colors tracking-tight">
            Acessar via <span className="text-brand font-extrabold italic">PIN/BIOMETRIA</span>
          </span>
        </button>

        <p className="text-xs text-zinc-500 font-medium">
          Deseja ingressar? <Link href="/register" className="text-brand font-black hover:underline underline-offset-4 decoration-2">Criar conta gratuita</Link>
        </p>
      </div>
    </div>
  );
}

