"use client";

import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export default function TermosPage() {
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
            <FileText className="text-brand" size={24} />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">Termos de Uso</h1>
        </div>

        <div className="space-y-8 text-zinc-400 text-sm leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-white font-bold uppercase tracking-widest text-[11px]">01. Aceitação</h2>
            <p>
              Ao acessar o MedCore V2.0 Core, você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-white font-bold uppercase tracking-widest text-[11px]">02. Licença de Uso</h2>
            <p>
              É concedida permissão para acessar temporariamente o sistema para uso pessoal e profissional, apenas para fins operacionais dentro da clínica autorizada.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-white font-bold uppercase tracking-widest text-[11px]">03. Responsabilidade</h2>
            <p>
              O uso do sistema é restrito a profissionais autorizados. Qualquer violação de segurança ou uso indevido resultará no bloqueio imediato da credencial operacional.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
