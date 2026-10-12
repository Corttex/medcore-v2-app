"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  UserCheck, 
  Sparkles, 
  ArrowRight,
  Loader2
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import Link from "next/link";

function AtivarContaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState<{
    fullName: string;
    email: string;
    cargo: string;
    role: string;
    unidade: string;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Token de convite não encontrado. Verifique o link enviado por e-mail.");
      setLoading(false);
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch(`/api/auth/activate?token=${encodeURIComponent(token)}`);
        const data = await res.json();
        if (res.ok && data.success) {
          setMember(data.member);
        } else {
          setError(data.error || "Convite inválido ou expirado.");
        }
      } catch {
        setError("Erro ao verificar o convite. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas digitadas não coincidem.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 2500);
      } else {
        setError(data.error || "Falha ao ativar a conta.");
      }
    } catch {
      setError("Erro de rede ao salvar a senha.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-rd-cyan/30">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-rd-cyan/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-500">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="inline-block scale-110 mb-2">
            <Logo />
          </div>
          <p className="text-xs font-semibold text-rd-cyan uppercase tracking-widest">
            Ativação de Conta • Primeiro Acesso Seguro
          </p>
        </div>

        {/* Card Principal */}
        <div className="bg-zinc-900/90 border-2 border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-rd-cyan animate-spin" />
              <p className="text-xs text-zinc-400 font-medium">Validando token de convite...</p>
            </div>
          ) : error && !member ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-12 h-12 bg-rose-500/15 border border-rose-500/30 text-rose-400 rounded-2xl flex items-center justify-center mx-auto">
                <AlertCircle size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Link Inválido ou Expirado</h3>
                <p className="text-xs text-zinc-400 mt-1">{error}</p>
              </div>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold rounded-xl text-zinc-200 transition-all"
              >
                Voltar para o Login
              </Link>
            </div>
          ) : success ? (
            <div className="py-6 text-center space-y-4 animate-in fade-in duration-300">
              <div className="w-14 h-14 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Conta Ativada com Sucesso!</h3>
                <p className="text-xs text-zinc-400">
                  Sua senha definitiva foi salva e o Diretor/Gestor foi notificado no painel. Redirecionando para o login...
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="w-full py-3 bg-rd-cyan text-zinc-950 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-rd-cyan/20 hover:bg-rd-cyan/90 transition-all"
                >
                  Ir para o Login Agora <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Boas-Vindas com dados do Colaborador */}
              <div className="p-4 bg-zinc-800/60 rounded-2xl border border-zinc-750 space-y-2">
                <div className="flex items-center gap-2 text-rd-cyan">
                  <UserCheck size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">Convite Institucional</span>
                </div>
                <h2 className="text-base font-bold text-white leading-tight">
                  Olá, {member?.fullName}!
                </h2>
                <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400 pt-1 border-t border-zinc-700/60">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-500 block">Cargo</span>
                    <span className="text-zinc-300 font-medium truncate block">{member?.cargo}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-500 block">Lotação</span>
                    <span className="text-zinc-300 font-medium truncate block">{member?.unidade}</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* Formulário de Criação de Senha */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                    Crie sua Senha Pessoal Definitiva *
                  </label>
                  <div className="relative">
                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      minLength={6}
                      placeholder="Mínimo de 6 caracteres"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full bg-zinc-800/80 border border-zinc-700 rounded-xl px-3.5 pr-10 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-rd-cyan"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                    Confirme sua Senha *
                  </label>
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    minLength={6}
                    placeholder="Repita a mesma senha"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full bg-zinc-800/80 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-rd-cyan"
                  />
                </div>

                <div className="p-3 bg-zinc-800/30 rounded-xl border border-zinc-750 text-[11px] text-zinc-400 space-y-1">
                  <p className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <ShieldCheck size={13} /> Segurança Hospitalar LGPD
                  </p>
                  <p>
                    Ao definir sua senha, seu acesso aos módulos permitidos pelo seu perfil será ativado de imediato e o gestor será notificado.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-rd-cyan text-zinc-950 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-rd-cyan/25 hover:bg-rd-cyan/90 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <><Loader2 size={16} className="animate-spin" /> Salvando...</>
                  ) : (
                    <><Lock size={15} /> Ativar Conta e Acessar</>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-[11px] text-zinc-500">
          MedCore v2.4 • Segurança da Informação Hospitalar
        </p>
      </div>
    </div>
  );
}

export default function AtivarContaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Carregando...</div>}>
      <AtivarContaContent />
    </Suspense>
  );
}
