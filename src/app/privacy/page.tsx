import React from "react";
import { ShieldCheck, Lock, EyeOff, Server, FileCheck, ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/modules/shared/components/Logo";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-300 font-sans selection:bg-teal-500/30">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-500/5 rounded-full blur-[120px]"></div>
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
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-teal-400 hover:text-teal-300 transition-colors"
          >
            <ArrowLeft size={14} /> Voltar para o Acesso
          </Link>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto py-20 px-6">
        {/* Title Section */}
        <div className="mb-16 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-500/10 border border-teal-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-teal-400 mb-6 italic">
            <ShieldCheck size={12} /> Protocolos VitalFlow V2
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter leading-tight mb-6">
            Política de <span className="text-teal-400">Privacidade.</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
            Seu compromisso com a saúde e nossa responsabilidade com seus dados. 
            Transparência total sobre como protegemos sua clínica e seus pacientes.
          </p>
        </div>

        {/* Dynamic Grid Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          <div className="p-8 bg-zinc-900/40 border border-zinc-800 rounded-[2rem] hover:border-teal-500/30 transition-all group">
            <div className="w-12 h-12 bg-teal-500/10 border border-teal-500/20 rounded-2xl flex items-center justify-center mb-6 text-teal-400 group-hover:scale-110 transition-transform">
              <Lock size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-4 italic">Criptografia Ponta-a-Ponta</h3>
            <p className="text-sm leading-relaxed text-zinc-400">
              Todos os dados clínicos e administrativos são protegidos por TLS 256-bit e criptografia AES-256 em repouso. 
              Sua senha é transformada em um hash irreversível antes de ser armazenada.
            </p>
          </div>

          <div className="p-8 bg-zinc-900/40 border border-zinc-800 rounded-[2rem] hover:border-teal-500/30 transition-all group">
            <div className="w-12 h-12 bg-teal-500/10 border border-teal-500/20 rounded-2xl flex items-center justify-center mb-6 text-teal-400 group-hover:scale-110 transition-transform">
              <EyeOff size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-4 italic">Privacidade Zero-Knowledge</h3>
            <p className="text-sm leading-relaxed text-zinc-400">
              Nossa equipe não possui acesso aos prontuários ou diagnósticos processados pela IA Executiva sem sua autorização explícita para suporte técnico.
            </p>
          </div>

          <div className="p-8 bg-zinc-900/40 border border-zinc-800 rounded-[2rem] hover:border-teal-500/30 transition-all group">
            <div className="w-12 h-12 bg-teal-500/10 border border-teal-500/20 rounded-2xl flex items-center justify-center mb-6 text-teal-400 group-hover:scale-110 transition-transform">
              <FileCheck size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-4 italic">Conformidade LGPD</h3>
            <p className="text-sm leading-relaxed text-zinc-400">
              Estamos 100% alinhados com a Lei Geral de Proteção de Dados (Brasil) e o framework HIPAA internacional para dados de saúde sensíveis.
            </p>
          </div>

          <div className="p-8 bg-zinc-900/40 border border-zinc-800 rounded-[2rem] hover:border-teal-500/30 transition-all group">
            <div className="w-12 h-12 bg-teal-500/10 border border-teal-500/20 rounded-2xl flex items-center justify-center mb-6 text-teal-400 group-hover:scale-110 transition-transform">
              <Server size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-4 italic">Cloud Drive Seguro</h3>
            <p className="text-sm leading-relaxed text-zinc-400">
              O Drive Cofre utiliza armazenamento isolado com auditoria de acesso em tempo real, garantindo que arquivos de exames e laudos nunca vazem do ecossistema.
            </p>
          </div>
        </div>

        {/* Full Text Section */}
        <div className="prose prose-invert max-w-none space-y-12">
          <section>
            <h2 className="text-2xl font-black text-white italic tracking-tighter mb-4 border-l-4 border-teal-500 pl-4">1. Coleta e Uso</h2>
            <p className="text-zinc-400 leading-relaxed font-medium">
              Coletamos informações profissionais básicas (Nome, CRM, E-mail, Telefone) para autenticação e gestão de licença. 
              Dados clínicos inseridos na plataforma são de propriedade exclusiva do profissional/unidade de saúde, sendo o VitalFlow apenas o operador tecnológico.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white italic tracking-tighter mb-4 border-l-4 border-teal-500 pl-4">2. Retenção de Dados</h2>
            <p className="text-zinc-400 leading-relaxed font-medium">
              Manteremos seus dados enquanto sua conta estiver ativa. Em caso de cancelamento, você tem o direito de exportar todos os seus prontuários e arquivos antes do encerramento definitivo e exclusão dos backups corporativos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white italic tracking-tighter mb-4 border-l-4 border-teal-500 pl-4">3. Direitos do Usuário</h2>
            <ul className="list-none space-y-3">
              {[
                "Acesso e Correção de informações pessoais.",
                "Portabilidade de dados clínicos exportáveis.",
                "Revogação de consentimento de marketing.",
                "Exclusão total de conta e logs associados."
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-bold">
                   <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                   {item}
                </li>
              ))}
            </ul>
          </section>

          <div className="pt-12 border-t border-zinc-800 flex flex-col items-center">
            <p className="text-zinc-500 text-sm mb-6">Dúvidas sobre seus dados?</p>
            <Link 
              href="mailto:suporte@medcore.com.br"
              className="flex items-center gap-3 px-8 py-4 bg-zinc-900 border-2 border-zinc-700 rounded-2xl hover:bg-zinc-800 transition-all font-bold text-white shadow-xl shadow-black"
            >
              <Mail size={20} className="text-teal-400" /> Falar com DPO (Proteção de Dados)
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
