"use client";

import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { Logo } from "@/components/ui/Logo";
import { ShieldCheck, Activity, Zap, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

import Image from "next/image";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen bg-white dark:bg-background">
      
      {/* LADO ESQUERDO: BRANDING (Oculto em telas menores) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[var(--color-rd-mint)] dark:bg-surface relative flex-col justify-between p-12 overflow-hidden">
        
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/bg-hospital.jpg" 
            alt="Profissional de saúde utilizando sistema em um hospital moderno" 
            fill 
            priority
            className="object-cover opacity-10 dark:opacity-15 mix-blend-multiply dark:mix-blend-overlay"
          />
        </div>

        {/* Abstract Background Element */}
        <div className="absolute -top-[20%] -left-[10%] w-[80%] h-[60%] rounded-full bg-[var(--color-rd-cyan)]/20 blur-[100px] pointer-events-none animate-float z-0" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-[var(--color-rd-lime)]/10 blur-[100px] pointer-events-none animate-float-delayed z-0" />

        {/* Top: Logo */}
        <div className="relative z-10">
          <Link href="/">
            <Logo width={200} height={55} />
          </Link>
        </div>

        {/* Middle: Proposta de Valor */}
        <div className="relative z-10 max-w-lg mt-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 mb-6 shadow-sm">
            <CheckCircle2 size={14} className="text-[var(--color-rd-cyan)]" />
            <span className="text-xs font-semibold text-black dark:text-white uppercase tracking-widest">
              Acesso Seguro
            </span>
          </div>
          
          <h1 className="font-heading text-4xl xl:text-5xl font-semibold leading-tight text-black dark:text-white mb-6">
            Escale sua <span className="text-[var(--color-rd-cyan)]">operação</span>.
          </h1>
          
          <p className="font-body text-lg text-black dark:text-white mb-10 leading-relaxed">
            Junte-se ao MedCore e transforme a maneira como você gerencia sua clínica e atende seus pacientes.
          </p>

          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center shrink-0 shadow-sm border border-black/5 dark:border-white/5">
                <Activity className="text-[var(--color-rd-cyan)]" size={20} />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-black dark:text-white text-sm mb-1">Prontuário com IA</h3>
                <p className="text-sm text-black dark:text-white">Automatize o registro clínico com assistência inteligente.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center shrink-0 shadow-sm border border-black/5 dark:border-white/5">
                <Zap className="text-[var(--color-rd-cyan)]" size={20} />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-black dark:text-white text-sm mb-1">Agenda Integrada</h3>
                <p className="text-sm text-black dark:text-white">Sincronização bidirecional com Google e Outlook.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center shrink-0 shadow-sm border border-black/5 dark:border-white/5">
                <ShieldCheck className="text-[var(--color-rd-cyan)]" size={20} />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-black dark:text-white text-sm mb-1">Criptografia E2E</h3>
                <p className="text-sm text-black dark:text-white">Segurança de ponta a ponta, compatível com a LGPD.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Versão */}
        <div className="relative z-10 mt-12 flex items-center gap-3">
          <span className="font-heading text-xs font-semibold uppercase tracking-widest text-black dark:text-white">MedCore V2.0</span>
          <div className="w-1 h-1 rounded-full bg-black dark:bg-white"></div>
          <span className="font-body text-xs font-medium text-black dark:text-white">Build 2026.09.10</span>
        </div>
      </div>

      {/* LADO DIREITO: FORMULÁRIO DE REGISTRO */}
      <div className="w-full lg:w-1/2 flex flex-col relative z-10 max-h-screen overflow-y-auto">
        
        {/* Header Responsivo (Apenas mobile/tablet) */}
        <div className="lg:hidden flex items-center justify-between p-6 border-b border-black/5 dark:border-white/5 bg-white/50 dark:bg-background/50 backdrop-blur-md">
          <Link href="/">
            <Logo width={140} height={40} />
          </Link>
          <ThemeToggle />
        </div>

        {/* Toggle Theme Desktop */}
        <div className="hidden lg:flex absolute top-6 right-8 z-50">
          <ThemeToggle />
        </div>

        {/* Área Central do Formulário */}
        <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12">
          <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            <div className="mb-8">
              <Link href="/" className="inline-flex items-center text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-[var(--color-rd-cyan)] dark:hover:text-[var(--color-rd-cyan)] transition-colors mb-6">
                ← Voltar para o site
              </Link>
              <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-zinc-900 dark:text-white mb-2">
                Criar Nova Conta
              </h2>
              <p className="font-body text-sm text-zinc-500 dark:text-zinc-400">
                Preencha os dados abaixo para iniciar no MedCore.
              </p>
            </div>

            <RegisterForm />
          </div>
        </div>

        {/* Footer do Lado Direito */}
        <div className="p-6 flex justify-center lg:justify-between items-center gap-4 text-xs font-medium text-zinc-500 border-t border-black/5 dark:border-white/5 mt-auto">
          <p className="hidden lg:block">© 2026 Corttex Technologies.</p>
          <div className="flex items-center gap-4">
            <Link href="/termos" className="hover:text-[var(--color-rd-cyan)] transition-colors">Termos de Uso</Link>
            <Link href="/privacidade" className="hover:text-[var(--color-rd-cyan)] transition-colors">Privacidade</Link>
            <Link href="/suporte" className="hover:text-[var(--color-rd-cyan)] transition-colors">Suporte</Link>
          </div>
        </div>

      </div>

    </div>
  );
}
