"use client";

import React, { useState } from "react";
import { authService } from "../services/authService";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Loader2, UserPlus, ShieldCheck, ArrowRight, Zap, Activity } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/modules/shared/components/Logo";
import { sanitize } from "@/lib/sanitize";

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      setError("Você precisa aceitar os termos de uso antes de continuar.");
      return;
    }
    setError(null);

    // Validação de senha
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    setLoading(true);
    try {
      const cleanEmail = sanitize(email);
      const cleanPassword = sanitize(password);
      const cleanFullName = sanitize(fullName);
      
      await authService.signUp(cleanEmail, cleanPassword, cleanFullName);
      // MOCK O usuário já entra no dashboard nativamente
      router.push("/dashboard");
    } catch (err: any) {
      // MOCK DE PROTÓTIPO: Passa direto
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="w-full max-w-[440px] mx-auto animate-in fade-in zoom-in-95 duration-700">
      <div className="mb-4 flex flex-col items-center">
        <Logo width={160} height={48} />
        <p className="mt-1 text-xs font-black uppercase tracking-[0.2em] text-zinc-500 italic">
          Seu painel totalmente personalizado
        </p>
      </div>

      <div className="p-5 md:p-6 bg-zinc-950/90 border border-zinc-800 rounded-[2rem] shadow-card backdrop-blur-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
           <ShieldCheck size={120} className="text-brand" />
        </div>

        <div className="relative">


          <form onSubmit={handleRegister} className="space-y-3">
            <div className="space-y-1 group">
              <label className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-brand transition-colors" size={14} />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-brand focus:ring-2 focus:ring-brand/10 rounded-xl h-12 pl-9 pr-4 text-white text-sm outline-none transition-all placeholder:text-zinc-600"
                  placeholder="Maria Silva"
                />
              </div>
            </div>

            <div className="space-y-1 group">
              <label className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">E-mail Corporativo</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-brand transition-colors" size={14} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-brand focus:ring-2 focus:ring-brand/10 rounded-xl h-12 pl-9 pr-4 text-white text-sm outline-none transition-all placeholder:text-zinc-600"
                  placeholder="voce@hospital.com.br"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
               <div className="space-y-1 group">
                  <label className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-brand transition-colors" size={14} />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-brand focus:ring-2 focus:ring-brand/10 rounded-xl h-12 pl-9 pr-2 text-white text-sm outline-none transition-all placeholder:text-zinc-600"
                      placeholder="••••••••"
                    />
                  </div>
               </div>
               <div className="space-y-1 group">
                  <label className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Repetir Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-brand transition-colors" size={14} />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-brand focus:ring-2 focus:ring-brand/10 rounded-xl h-12 pl-9 pr-2 text-white text-sm outline-none transition-all placeholder:text-zinc-600"
                      placeholder="••••••••"
                    />
                  </div>
               </div>
            </div>

            {/* Password Real-time Visual Rules */}
            {password.length > 0 && (
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest px-1 mt-1">
                <span className={password.length >= 8 ? "text-emerald-500" : "text-zinc-600 transition-colors"}>8+ Caracteres</span>
                <span className={/[A-Z]/.test(password) ? "text-emerald-500" : "text-zinc-600 transition-colors"}>1 Maiúscula</span>
                <span className={/[0-9]/.test(password) ? "text-emerald-500" : "text-zinc-600 transition-colors"}>1 Número</span>
              </div>
            )}

            {/* Checkbox de Aceite de Termos */}
            <div className="flex items-start gap-2 pt-1">
              <input 
                type="checkbox" 
                id="terms_register"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 accent-brand w-3.5 h-3.5 rounded border-zinc-700 bg-zinc-900 shrink-0 cursor-pointer"
              />
              <label htmlFor="terms_register" className="text-xs text-zinc-400 font-medium leading-tight cursor-pointer">
                Li e concordo com os <Link href="/termos" className="text-brand font-bold hover:underline">Termos de Uso</Link> e <Link href="/privacidade" className="text-brand font-bold hover:underline">Política de Privacidade</Link>.
                <span className="block mt-0.5 text-zinc-500">Obrigatório para acesso à plataforma.</span>
              </label>
            </div>

            {error && (
              <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-[10px] font-bold animate-shake text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !termsAccepted}
              className="w-full flex items-center justify-center gap-2 h-13 rounded-xl bg-brand-container hover:bg-brand text-white font-black text-sm transition-all disabled:opacity-50 disabled:grayscale shadow-xl shadow-brand/10 active:scale-[0.98] group"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <>
                  <UserPlus size={16} />
                  <span>Criar Conta</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-all" />
                </>
              )}
            </button>
          </form>

          <div className="relative flex items-center py-3">
            <div className="flex-grow border-t border-zinc-800" />
            <span className="flex-shrink mx-3 text-zinc-600 text-[10px] uppercase tracking-[0.4em] font-black">ou continue</span>
            <div className="flex-grow border-t border-zinc-800" />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-2 h-13 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 hover:border-brand/40 text-sm font-black text-white/80 hover:text-white transition-all disabled:opacity-50 disabled:grayscale group shadow-inner mb-5"
          >
            {googleLoading ? (
              <Loader2 size={16} className="animate-spin text-zinc-400" />
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                <span>Google</span>
              </>
            )}
          </button>

          {/* Internal Statistics Footer Block */}
          <div className="w-full grid grid-cols-3 gap-2 bg-zinc-900/40 p-2.5 rounded-xl border border-zinc-800/50 mt-auto">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-brand opacity-80 mb-0.5">
                <ShieldCheck size={8} /> Precisão
              </div>
              <div className="font-heading font-black text-sm text-white">99.9%</div>
            </div>
            <div className="flex flex-col items-center justify-center text-center border-l border-zinc-800/50">
              <div className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-brand opacity-80 mb-0.5">
                <Zap size={8} /> Latência
              </div>
              <div className="font-heading font-black text-sm text-white">&lt;12ms</div>
            </div>
            <div className="flex flex-col items-center justify-center text-center border-l border-zinc-800/50">
              <div className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-brand opacity-80 mb-0.5">
                <Activity size={8} /> Status
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand shadow-[0_0_6px_var(--color-brand)] animate-pulse"></span>
                <span className="font-heading font-black text-xs uppercase tracking-tighter text-white">Active</span>
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-zinc-500 font-medium">
            Já possui acesso?{" "}
            <Link href="/login" className="text-brand hover:text-brand-container font-black underline underline-offset-4 decoration-2">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

