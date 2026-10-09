"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2, ArrowRight, User, Info } from "lucide-react";
import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };
  
  const strengthScore = getPasswordStrength(password);
  const isStrong = strengthScore === 4;
  const passwordsMatch = password === confirmPassword && password.length > 0;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStrong) {
      setError("A senha precisa ser forte (8+ caracteres, maiúscula, número e símbolo).");
      return;
    }
    if (!passwordsMatch) {
      setError("As senhas não coincidem.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // Basic placeholder for registration logic
      // await authService.signUp(name, email, password);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Falha no cadastro.");
      setLoading(false);
    }
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

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-4">
            
            <div className="space-y-1.5 group">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">
                Nome Completo
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white dark:bg-black/20 border border-zinc-200 dark:border-white/10 focus:border-[var(--color-rd-cyan)] focus:ring-2 focus:ring-[var(--color-rd-cyan)]/20 focus:outline-none h-12 px-4 rounded-xl text-sm text-[var(--color-rd-navy)] dark:text-white transition-all duration-300 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                  placeholder="Dr. João Silva"
                />
                <User className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[var(--color-rd-cyan)] transition-colors" size={16} />
              </div>
            </div>

            <div className="space-y-1.5 group">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">
                E-mail Profissional
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white dark:bg-black/20 border border-zinc-200 dark:border-white/10 focus:border-[var(--color-rd-cyan)] focus:ring-2 focus:ring-[var(--color-rd-cyan)]/20 focus:outline-none h-12 px-4 rounded-xl text-sm text-[var(--color-rd-navy)] dark:text-white transition-all duration-300 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                  placeholder="contato@hospital.com.br"
                />
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[var(--color-rd-cyan)] transition-colors" size={16} />
              </div>
            </div>

            <div className="space-y-1.5 group">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">
                Senha Segura
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white dark:bg-black/20 border border-zinc-200 dark:border-white/10 focus:border-[var(--color-rd-cyan)] focus:ring-2 focus:ring-[var(--color-rd-cyan)]/20 focus:outline-none h-12 px-4 rounded-xl text-sm text-[var(--color-rd-navy)] dark:text-white transition-all duration-300 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                  placeholder="••••••••"
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[var(--color-rd-cyan)] transition-colors" size={16} />
              </div>
              {password.length > 0 && (
                <div className="flex items-center gap-2 mt-2 px-1">
                  <div className="flex-1 h-1.5 bg-zinc-200 dark:bg-white/10 rounded-full overflow-hidden flex gap-1">
                    <div className={cn("h-full transition-all duration-300", strengthScore >= 1 ? (strengthScore === 4 ? "bg-[var(--color-rd-cyan)]" : strengthScore >= 2 ? "bg-amber-400" : "bg-red-400") : "bg-transparent")} style={{ width: '25%' }}></div>
                    <div className={cn("h-full transition-all duration-300", strengthScore >= 2 ? (strengthScore === 4 ? "bg-[var(--color-rd-cyan)]" : "bg-amber-400") : "bg-transparent")} style={{ width: '25%' }}></div>
                    <div className={cn("h-full transition-all duration-300", strengthScore >= 3 ? (strengthScore === 4 ? "bg-[var(--color-rd-cyan)]" : "bg-amber-400") : "bg-transparent")} style={{ width: '25%' }}></div>
                    <div className={cn("h-full transition-all duration-300", strengthScore >= 4 ? "bg-[var(--color-rd-cyan)]" : "bg-transparent")} style={{ width: '25%' }}></div>
                  </div>
                  <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 w-12 text-right">
                    {strengthScore < 2 ? "Fraca" : strengthScore < 4 ? "Média" : "Forte"}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-1.5 group">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">
                Confirmar Senha
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white dark:bg-black/20 border border-zinc-200 dark:border-white/10 focus:border-[var(--color-rd-cyan)] focus:ring-2 focus:ring-[var(--color-rd-cyan)]/20 focus:outline-none h-12 px-4 rounded-xl text-sm text-[var(--color-rd-navy)] dark:text-white transition-all duration-300 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                  placeholder="••••••••"
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[var(--color-rd-cyan)] transition-colors" size={16} />
              </div>
            </div>
            
          </div>

          <button
            type="submit"
            disabled={loading || !isStrong || !passwordsMatch}
            className={cn(
              "w-full mt-2 bg-[var(--color-rd-lime)] hover:bg-[#eb5257] h-12 rounded-xl font-heading font-semibold text-[15px] text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50 group/btn shadow-sm"
            )}
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>Cadastrar <ArrowRight className="group-hover/btn:translate-x-1 transition-transform" size={16} /></>
            )}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Já possui uma conta?{' '}
            <Link href="/login" className="text-[var(--color-rd-cyan)] hover:underline font-semibold">
              Fazer Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
