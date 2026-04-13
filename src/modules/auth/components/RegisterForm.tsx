"use client";

import React, { useState } from "react";
import { authService } from "../services/authService";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Loader2, UserPlus, Stethoscope, ArrowRight } from "lucide-react";
import Link from "next/link";

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authService.signUp(email, password, fullName);
      router.push("/login?message=Verifique seu e-mail para confirmar o cadastro");
    } catch (err: any) {
      setError(err.message || "Falha ao realizar cadastro");
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-4">
          <Stethoscope className="text-teal-400" size={28} />
        </div>
        <h1 className="font-black text-2xl tracking-tighter italic text-white">
          Medcore <span className="text-teal-400">VitalFlow</span>
        </h1>
        <p className="text-zinc-500 text-sm mt-1">Crie sua conta e comece gratuitamente</p>
      </div>

      <div className="p-8 bg-zinc-950/80 border border-zinc-800/80 rounded-3xl shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          {/* Google OAuth */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 h-12 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-sm font-semibold text-zinc-200 transition-all disabled:opacity-60 mb-6 group"
          >
            {googleLoading ? (
              <Loader2 size={18} className="animate-spin text-zinc-400" />
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                <span>Continuar com Google</span>
                <ArrowRight size={14} className="text-zinc-500 group-hover:text-zinc-300 transition-colors" />
              </>
            )}
          </button>

          <div className="relative flex items-center py-2 mb-6">
            <div className="flex-grow border-t border-zinc-800" />
            <span className="flex-shrink mx-4 text-zinc-600 text-[10px] uppercase tracking-[0.3em] font-black">ou use seu e-mail</span>
            <div className="flex-grow border-t border-zinc-800" />
          </div>

          {error && (
            <div className="mb-5 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-0.5">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 rounded-xl py-3 pl-10 pr-4 text-zinc-200 text-sm outline-none transition-all placeholder:text-zinc-700"
                  placeholder="Dr. Maria Silva"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-0.5">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 rounded-xl py-3 pl-10 pr-4 text-zinc-200 text-sm outline-none transition-all placeholder:text-zinc-700"
                  placeholder="voce@hospital.com.br"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-0.5">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 rounded-xl py-3 pl-10 pr-4 text-zinc-200 text-sm outline-none transition-all placeholder:text-zinc-700"
                  placeholder="Mínimo 8 caracteres"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 h-12 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-black text-sm transition-all disabled:opacity-50 shadow-lg shadow-teal-500/20 active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <><UserPlus size={18} />Criar Conta Gratuita</>}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Já tem conta?{" "}
            <Link href="/login" className="text-teal-400 hover:text-teal-300 font-bold">Fazer Login</Link>
          </p>

          <p className="mt-4 text-center text-[10px] text-zinc-700 leading-relaxed">
            Ao criar sua conta, você concorda com nossa Política de Privacidade e Termos de Uso.
          </p>
        </div>
      </div>
    </div>
  );
}
