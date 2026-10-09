"use client";

import React, { useState, useEffect } from "react";
import { authService } from "./authService";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2, ArrowRight, Info } from "lucide-react";
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
  const router = useRouter();

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
    alert("O login social via Google está temporariamente desativado devido à migração de infraestrutura.");
  };

  return (
    <div className="w-full">
      <div className="relative overflow-hidden w-full">
        {error && (
          <div className="mb-4 p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 rounded-xl flex items-start gap-2 animate-shake">
            <Info size={16} className="text-red-500 mt-0.5 shrink-0" />
            <p className="text-sm font-medium text-red-600 dark:text-red-400 leading-relaxed">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-1.5 group">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1" htmlFor="email">
                E-mail Profissional
              </label>
              <div className="relative">
                <input 
                  className="w-full bg-white dark:bg-black/20 border border-zinc-200 dark:border-white/10 focus:border-[var(--color-rd-cyan)] focus:ring-2 focus:ring-[var(--color-rd-cyan)]/20 focus:outline-none h-12 px-4 rounded-xl text-sm text-[var(--color-rd-navy)] dark:text-white transition-all duration-300 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                  id="email" 
                  placeholder="seu.nome@clinica.com.br" 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[var(--color-rd-cyan)] transition-colors" size={16} />
              </div>
            </div>

            <div className="space-y-1.5 group">
              <div className="flex justify-between items-center px-1">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300" htmlFor="password">
                  Senha
                </label>
                <Link className="text-sm font-medium text-[var(--color-rd-cyan)] hover:text-[var(--color-rd-cyan)]/80 transition-colors" href="#">
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <input 
                  className="w-full bg-white dark:bg-black/20 border border-zinc-200 dark:border-white/10 focus:border-[var(--color-rd-cyan)] focus:ring-2 focus:ring-[var(--color-rd-cyan)]/20 focus:outline-none h-12 px-4 rounded-xl text-sm text-[var(--color-rd-navy)] dark:text-white transition-all duration-300 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                  id="password" 
                  placeholder="••••••••••••" 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[var(--color-rd-cyan)] transition-colors" size={16} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <div className="relative flex items-center shrink-0">
              <input 
                type="checkbox" 
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="accent-[var(--color-rd-cyan)] w-4 h-4 rounded border-zinc-300 bg-white cursor-pointer"
              />
            </div>
            <label htmlFor="terms" className="text-sm text-zinc-600 dark:text-zinc-400 cursor-pointer select-none">
              Concordo com os <Link href="/termos" className="text-[var(--color-rd-cyan)] hover:underline">Termos</Link> e a <Link href="/privacidade" className="text-[var(--color-rd-cyan)] hover:underline">Privacidade</Link>.
            </label>
          </div>

          <button 
            className="w-full mt-2 bg-[var(--color-rd-lime)] hover:bg-[#eb5257] h-12 rounded-xl font-heading font-semibold text-[15px] text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50 group/btn shadow-sm" 
            type="submit"
            disabled={loading || !termsAccepted}
          >
            {loading && !email.includes("@") ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                Entrar
                <ArrowRight className="group-hover/btn:translate-x-1 transition-transform" size={16} />
              </>
            )}
          </button>

          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-black/5 dark:border-white/10"></div>
            <span className="flex-shrink mx-4 text-xs font-medium text-zinc-400">ou</span>
            <div className="flex-grow border-t border-black/5 dark:border-white/10"></div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading || !termsAccepted}
            className="w-full bg-white dark:bg-white/5 hover:bg-zinc-50 dark:hover:bg-white/10 border border-zinc-200 dark:border-white/10 h-12 rounded-xl font-heading font-semibold text-sm text-zinc-700 dark:text-zinc-300 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50 group/google"
          >
            <svg className="w-5 h-5 transition-transform group-hover/google:scale-110" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Entrar com Google
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Ainda não tem uma conta?{' '}
            <Link href="/register" className="text-[var(--color-rd-cyan)] hover:underline font-semibold">
              Criar Conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
