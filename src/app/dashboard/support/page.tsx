"use client";

import React from "react";
import { LifeBuoy, MessageSquare, Mail, Phone, BookOpen, ChevronRight, Search, PlayCircle, FileText } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function SupportPage() {
  const faqs = [
    { question: "Como configurar meu PIN de segurança?", category: "Segurança" },
    { question: "Onde vejo meu faturamento mensal?", category: "Financeiro" },
    { question: "Como ativar a IA Executiva no meu dashboard?", category: "Módulos" },
    { question: "Quais são os limites do plano BASIC?", category: "Planos" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      {/* Search & Hero */}
      <div className="text-center space-y-6 pt-8">
        <h1 className="text-5xl font-black font-heading tracking-tighter text-on-surface italic">
          Como podemos <span className="text-primary italic">ajudar</span> hoje?
        </h1>
        <p className="text-on-surface-variant max-w-2xl mx-auto font-medium opacity-80">
          Nossa equipe de suporte técnico e comercial está pronta para garantir que sua experiência com o MedCore seja impecável.
        </p>
        
        <div className="max-w-xl mx-auto relative group mt-10">
          <div className="absolute inset-x-0 -bottom-2 h-10 bg-primary/20 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
          <div className="relative flex items-center bg-surface-container-low border border-outline-variant/50 rounded-2xl px-5 py-4 shadow-sm focus-within:border-primary/50 transition-all">
            <Search className="text-on-surface-variant/40" size={20} />
            <input 
              type="text" 
              placeholder="Pesquisar tutoriais, guias e erros comuns..." 
              className="bg-transparent border-none focus:ring-0 w-full ml-4 text-sm font-medium placeholder:text-zinc-500"
            />
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-surface-container rounded-md border border-outline-variant text-[10px] font-black text-zinc-500 uppercase">
              CMD K
            </kbd>
          </div>
        </div>
      </div>

      {/* Main Support Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="group p-8 bg-surface-container-low border border-outline-variant/30 rounded-[2.5rem] hover:border-primary/40 transition-all cursor-pointer relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
            <MessageSquare size={100} />
          </div>
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all">
            <MessageSquare size={28} />
          </div>
          <h3 className="text-xl font-black text-on-surface font-heading tracking-tight mb-2 italic">Chat em Tempo Real</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed opacity-70">Tempo médio de resposta: <span className="text-primary font-bold">~2 min</span></p>
          <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary group-hover:gap-4 transition-all">
            Iniciar Conversa <ChevronRight size={14} />
          </div>
        </div>

        <div className="group p-8 bg-surface-container-low border border-outline-variant/30 rounded-[2.5rem] hover:border-emerald-500/40 transition-all cursor-pointer relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
            <Phone size={100} />
          </div>
          <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-6 border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white transition-all">
            <Phone size={28} />
          </div>
          <h3 className="text-xl font-black text-on-surface font-heading tracking-tight mb-2 italic">Call de Emergência</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed opacity-70">Exclusivo para parceiros <span className="text-emerald-600 font-bold uppercase tracking-tighter">Gold & Platinum</span></p>
          <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500 group-hover:gap-4 transition-all">
            Agendar Chamada <ChevronRight size={14} />
          </div>
        </div>

        <div className="group p-8 bg-surface-container-low border border-outline-variant/30 rounded-[2.5rem] hover:border-secondary/40 transition-all cursor-pointer relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
            <Mail size={100} />
          </div>
          <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mb-6 border border-secondary/20 group-hover:bg-secondary group-hover:text-white transition-all">
            <Mail size={28} />
          </div>
          <h3 className="text-xl font-black text-on-surface font-heading tracking-tight mb-2 italic">E-mail Corporativo</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed opacity-70">Para questões administrativas e faturamento.</p>
          <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-secondary group-hover:gap-4 transition-all">
            Abrir Ticket <ChevronRight size={14} />
          </div>
        </div>
      </div>

      {/* Guides & FAQ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8">
        <div className="lg:col-span-8 space-y-10">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-black text-on-surface font-heading tracking-tight italic">Tópicos Frequentes</h2>
            <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Ver Base de Conhecimento</button>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="group flex items-center justify-between p-6 bg-surface-container-low/50 border border-outline-variant/20 rounded-2xl hover:bg-surface-container-low hover:border-outline-variant/40 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary/40 group-hover:bg-primary transition-all shadow-[0_0_8px_rgba(58,223,250,0.1)]"></div>
                  <span className="text-sm font-bold text-on-surface group-hover:translate-x-1 transition-transform">{faq.question}</span>
                </div>
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest bg-outline-variant/10 px-2 py-0.5 rounded-full border border-outline-variant/20">{faq.category}</span>
              </div>
            ))}
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-6">
          <div className="p-8 bg-primary rounded-[2.5rem] text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-20 -rotate-12 group-hover:rotate-0 transition-transform">
              <Sparkles size={120} />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-black font-heading italic tracking-tighter mb-4">Aprenda com Especialistas</h3>
              <p className="text-xs font-medium text-white/80 leading-relaxed mb-8 italic">
                Acesse nossa Masterclass exclusiva sobre como otimizar o fluxo do seu hospital usando inteligência artificial.
              </p>
              <button className="w-full flex items-center justify-center gap-3 py-4 bg-white text-primary rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
                <PlayCircle size={18} /> Assistir Agora
              </button>
            </div>
          </div>

          <div className="p-8 bg-surface-container-highest/20 border border-outline-variant/20 rounded-[2.5rem] space-y-6">
            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Documentação Útil</h4>
            <div className="space-y-4">
               <button className="w-full flex items-center justify-between p-3 hover:bg-surface-container transition-all rounded-xl group">
                 <div className="flex items-center gap-3">
                   <FileText size={16} className="text-zinc-500" />
                   <span className="text-xs font-bold text-on-surface opacity-80">Guia do Administrador</span>
                 </div>
                 <ChevronRight size={14} className="opacity-0 group-hover:opacity-100" />
               </button>
               <button className="w-full flex items-center justify-between p-3 hover:bg-surface-container transition-all rounded-xl group">
                 <div className="flex items-center gap-3">
                   <BookOpen size={16} className="text-zinc-500" />
                   <span className="text-xs font-bold text-on-surface opacity-80">API Reference</span>
                 </div>
                 <ChevronRight size={14} className="opacity-0 group-hover:opacity-100" />
               </button>
            </div>
          </div>
        </aside>
      </div>

      {/* AdminMaster Hook */}
      <footer className="pt-12 border-t border-outline-variant/30 flex flex-col items-center text-center">
        <LifeBuoy size={40} className="text-primary/20 mb-4" />
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-2">MedCore Unified Support Ecosystem</p>
        <p className="text-xs text-zinc-600 font-medium max-w-sm">
          Informações sincronizadas via AdminMaster. Gerenciado pelo núcleo de governança institucional.
        </p>
      </footer>
    </div>
  );
}

function Sparkles({ size, className }: { size?: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
