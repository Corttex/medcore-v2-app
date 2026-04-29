"use client";

import Link from "next/link";
import { ArrowLeft, Headphones } from "lucide-react";

export default function SuportePage() {
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
            <Headphones className="text-brand" size={24} />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">Suporte Técnico</h1>
        </div>

        <div className="space-y-8 text-zinc-400 text-sm leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-white font-bold uppercase tracking-widest text-[11px]">Canais de Atendimento</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl">
                <h3 className="text-white font-bold mb-2">E-mail Operacional</h3>
                <p className="text-xs">suporte@medcore.com.br</p>
                <p className="text-[10px] text-zinc-600 mt-2">Resposta em até 4 horas úteis</p>
              </div>
              <div className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl">
                <h3 className="text-white font-bold mb-2">WhatsApp Urgência</h3>
                <p className="text-xs">+55 11 99999-9999</p>
                <p className="text-[10px] text-zinc-600 mt-2">Apenas para incidentes críticos</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-white font-bold uppercase tracking-widest text-[11px]">Horário de Operação</h2>
            <p>
              Nossa equipe de engenharia está disponível 24/7 para monitoramento do sistema, com suporte humano de Segunda a Sexta, das 08h às 20h.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
