"use client";

import React, { useState, useEffect } from "react";
import { authService } from "./authService";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2, ArrowRight, Fingerprint, Info } from "lucide-react";
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
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [origin, setOrigin] = useState("");
  const router = useRouter();

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      setError("Confirme que aceita os termos operacionais.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const cleanEmail = email.trim().toLowerCase();
      await authService.signIn(cleanEmail, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Falha na autenticação do portal.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    alert("O login social via Google está temporariamente desativado devido à migração de infraestrutura (Supabase -> Prisma).");
  };

  return (
    <div className="w-full">
      <div className="p-6 md:p-8 bg-zinc-950/80 border border-white/5 rounded-[2.5rem] shadow-2xl backdrop-blur-3xl relative overflow-hidden">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 animate-shake">
            <Info size={14} className="text-red-400 mt-0.5 shrink-0" />
            <p className="text-[10px] font-bold text-red-400 leading-relaxed uppercase tracking-tight">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-4">
            <div className="space-y-2 group">
              <label className="block text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2" htmlFor="email">
                E-mail Corporativo
              </label>
              <div className="relative">
                <input 
                  className="w-full bg-zinc-900/50 border border-white/5 focus:border-brand/50 focus:ring-4 focus:ring-brand/5 focus:outline-none h-13 px-5 rounded-2xl text-sm text-white transition-all duration-300 placeholder:text-zinc-600 font-medium"
                  id="email" 
                  placeholder="Seu e-mail profissional" 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-brand transition-colors" size={16} />
              </div>
            </div>

            <div className="space-y-2 group">
              <div className="flex justify-between items-center px-2">
                <label className="block text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em]" htmlFor="password">
                  Senha Operacional
                </label>
                <Link className="text-[11px] font-black text-brand/60 hover:text-brand transition-colors uppercase tracking-[0.2em] underline underline-offset-4" href="#">
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <input 
                  className="w-full bg-zinc-900/50 border border-white/5 focus:border-brand/50 focus:ring-4 focus:ring-brand/5 focus:outline-none h-13 px-5 rounded-2xl text-sm text-white transition-all duration-300 placeholder:text-zinc-600"
                  id="password" 
                  placeholder="••••••••••••" 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-brand transition-colors" size={16} />
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white/[0.02] rounded-2xl border border-white/5 transition-colors hover:bg-white/[0.04]">
            <div className="relative flex items-center h-5">
              <input 
                type="checkbox" 
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="accent-brand w-4 h-4 rounded-md border-white/10 bg-zinc-900 cursor-pointer"
              />
            </div>
            <label htmlFor="terms" className="text-xs text-zinc-500 font-medium leading-normal cursor-pointer select-none">
              Confirmo estar ciente das <Link href="/termos" className="text-brand font-bold">políticas de segurança</Link> e <Link href="/privacidade" className="text-brand font-bold">privacidade</Link>.
            </label>
          </div>

          <button 
            className="w-full bg-brand hover:bg-brand-container h-13 rounded-2xl font-heading font-black text-sm text-white uppercase tracking-widest shadow-2xl shadow-brand/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-30 disabled:grayscale group/btn" 
            type="submit"
            disabled={loading || !termsAccepted}
          >
            {loading && !email.includes("@") ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                Acessar Sistema
                <ArrowRight className="group-hover/btn:translate-x-2 transition-transform" size={16} />
              </>
            )}
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-white/5"></div>
            <span className="flex-shrink mx-4 text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em]">Autenticação Google</span>
            <div className="flex-grow border-t border-white/5"></div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading || !termsAccepted}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 h-13 rounded-2xl font-heading font-black text-sm text-white uppercase tracking-widest flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-30 disabled:grayscale group/google"
          >
            <svg className="w-4 h-4 transition-transform group-hover/google:scale-110" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Entrar com Google
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
          <button 
             type="button"
             onClick={() => alert("Solicite a chave física ao seu supervisor.")}
             className="flex items-center gap-2 group transition-all opacity-60 hover:opacity-100"
          >
            <Fingerprint className="text-brand" size={14} />
            <span className="text-[9px] font-black text-white uppercase tracking-widest">Chave de Hardware</span>
          </button>
          
          <Link href="/register" className="text-[9px] font-black text-zinc-500 hover:text-brand transition-colors uppercase tracking-widest">
            Novo Operador? <span className="text-brand font-bold">Criar Conta</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
