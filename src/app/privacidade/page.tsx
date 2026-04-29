"use client";

import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-black text-white p-8 md:p-24 font-sans relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-brand/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <Link href="/login" className="inline-flex items-center gap-2 text-zinc-500 hover:text-brand transition-colors mb-12 uppercase text-[10px] font-black tracking-widest">
          <ArrowLeft size={14} />
          Voltar para o Terminal
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center">
            <Shield className="text-brand" size={24} />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">Privacidade</h1>
        </div>

        <div className="space-y-8 text-zinc-400 text-sm leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-white font-bold uppercase tracking-widest text-[11px]">01. Coleta de Dados</h2>
            <p>
              O sistema MedCore coleta apenas os dados estritamente necessários para a operação clínica e administrativa, seguindo os mais rigorosos protocolos de segurança digital.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-white font-bold uppercase tracking-widest text-[11px]">02. Uso das Informações</h2>
            <p>
              As informações são utilizadas exclusivamente para a prestação de serviços médicos, gestão de agendamentos e conformidade legal, nunca sendo compartilhadas com terceiros sem consentimento explícito.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-white font-bold uppercase tracking-widest text-[11px]">03. Segurança</h2>
            <p>
              Utilizamos criptografia de nível militar (AES-256) e protocolos Zero Trust para garantir que seus dados permaneçam protegidos contra acessos não autorizados.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
