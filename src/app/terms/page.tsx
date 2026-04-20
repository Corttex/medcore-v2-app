import React from "react";
import { CopyCheck, Scale, FileText, ArrowLeft, Mail, AlertTriangle, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/modules/shared/components/Logo";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-300 font-sans selection:bg-brand/30">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] border-brand/5 bg-brand/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-500/5 rounded-full blur-[150px]"></div>
      </div>

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 bg-black/50 backdrop-blur-xl border-b border-zinc-800/50">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo />
          </Link>
          <Link 
            href="/login" 
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand hover:text-brand-container transition-colors"
          >
            <ArrowLeft size={14} /> Voltar para o Acesso
          </Link>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto py-20 px-6">
        {/* Title Section */}
        <div className="mb-16 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand/10 border border-brand/20 rounded-full text-[10px] font-black uppercase tracking-widest text-brand mb-6 italic">
            <Scale size={12} /> Contrato de Licenciamento
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter leading-tight mb-6">
            Termos de <span className="text-brand">Serviço.</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
            Regras de utilização da plataforma VitalFlow. 
            Ao acessar o sistema, você concorda com as diretrizes operacionais.
          </p>
        </div>

        {/* Dynamic Grid Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          <div className="p-8 bg-zinc-900/40 border border-zinc-800 rounded-[2rem] hover:border-brand/30 transition-all group">
            <div className="w-12 h-12 bg-brand/10 border border-brand/20 rounded-2xl flex items-center justify-center mb-6 text-brand group-hover:scale-110 transition-transform">
              <FileText size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-4 italic">Licença de Uso</h3>
            <p className="text-sm leading-relaxed text-zinc-400">
              Concedemos uma licença limitada, não exclusiva e intransferível para o uso do software na nuvem, estritamente para gestão e auditoria médica da instituição contratante.
            </p>
          </div>

          <div className="p-8 bg-zinc-900/40 border border-zinc-800 rounded-[2rem] hover:border-brand/30 transition-all group">
            <div className="w-12 h-12 bg-brand/10 border border-brand/20 rounded-2xl flex items-center justify-center mb-6 text-brand group-hover:scale-110 transition-transform">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-4 italic">Responsabilidade de Acesso</h3>
            <p className="text-sm leading-relaxed text-zinc-400">
              O usuário é totalmente responsável por manter a confidencialidade do seu login e senha. Nós não nos responsabilizamos por perdas provenientes do uso não autorizado da sua conta.
            </p>
          </div>

          <div className="p-8 bg-zinc-900/40 border border-zinc-800 rounded-[2rem] hover:border-brand/30 transition-all group">
            <div className="w-12 h-12 bg-brand/10 border border-brand/20 rounded-2xl flex items-center justify-center mb-6 text-brand group-hover:scale-110 transition-transform">
              <ShieldAlert size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-4 italic">Dados Médicos (PHI)</h3>
            <p className="text-sm leading-relaxed text-zinc-400">
              O Contratante garante possuir as bases legais necessárias para o processamento de dados de saúde de seus pacientes através do nosso software, atuando o VitalFlow unicamente como operador.
            </p>
          </div>

          <div className="p-8 bg-zinc-900/40 border border-zinc-800 rounded-[2rem] hover:border-brand/30 transition-all group">
            <div className="w-12 h-12 bg-brand/10 border border-brand/20 rounded-2xl flex items-center justify-center mb-6 text-brand group-hover:scale-110 transition-transform">
              <CopyCheck size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-4 italic">Atualizações de Versão</h3>
            <p className="text-sm leading-relaxed text-zinc-400">
              O VitalFlow se reserva o direito de descontinuar recursos antigos e implementar atualizações regulares para melhorar a segurança e o fluxo operacional do negócio.
            </p>
          </div>
        </div>

        {/* Full Text Section */}
        <div className="prose prose-invert max-w-none space-y-12">
          <section>
            <h2 className="text-2xl font-black text-white italic tracking-tighter mb-4 border-l-4 border-brand pl-4">Restrições de Uso do Sistema</h2>
            <p className="text-zinc-400 leading-relaxed font-medium">
              Você concorda expressamente que não utilizará nenhuma ferramenta, software, dispositivo ou mecanismo manual ou automatizado (incluindo "spiders", "robots", "crawlers", etc.) para monitorar ou extrair dados da nossa infraestrutura, realizar engenharia reversa do código base, ou gerar carga excessiva proposital visando derrubar nossos servidores (DDoS).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white italic tracking-tighter mb-4 border-l-4 border-brand pl-4">Modificação dos Termos</h2>
            <p className="text-zinc-400 leading-relaxed font-medium">
              A MedCore Solutions pode revisar as condições destes Termos de Serviço a qualquer momento sem aviso prévio. Ao usar o software na data subsequente da modificação, você concorda em se submeter à versão mais atual. Notificaremos os usuários administradores em casos de mudanças críticas através da plataforma interna.
            </p>
          </section>

          <div className="pt-12 border-t border-zinc-800 flex flex-col items-center">
            <p className="text-zinc-500 text-sm mb-6">Questões Legais?</p>
            <Link 
              href="mailto:juridico@medcore.com.br"
              className="flex items-center gap-3 px-8 py-4 bg-zinc-900 border-2 border-zinc-700 rounded-2xl hover:bg-zinc-800 transition-all font-bold text-white shadow-xl shadow-black"
            >
              <Mail size={20} className="text-brand" /> Contatar Setor Jurídico
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-20 border-t border-zinc-900 bg-zinc-950/50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-4">A maior plataforma de auditoria inteligente do Brasil.</p>
          <p className="text-zinc-700 text-xs">© 2026 VitalFlow - MedCore Solutions Enterprise. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
