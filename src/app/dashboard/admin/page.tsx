"use client";

import React from "react";
import { AccessLinkGenerator } from "@/features/admin/components/AccessLinkGenerator";
import { 
  Shield, Users, ListFilter, Activity, ShieldCheck, Lock, Globe, Fingerprint, 
  ChevronRight, TrendingUp, DollarSign, UserMinus, ToggleRight, Radio, Server,
  Brain, BarChart3, AlertCircle, Sparkles, Lightbulb, Plus
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AdminPage() {
  const [services, setServices] = React.useState([
    { id: 1, label: "Módulo de IA Executive (CORE)", status: "Ligado", color: "text-primary", icon: Brain, active: true },
    { id: 2, label: "Scanner de Documentos Bulk", status: "Ligado", color: "text-primary", icon: Radio, active: true },
    { id: 3, label: "Integrações ERP Externas", status: "Suspenso", color: "text-amber-500", icon: Server, active: false },
    { id: 4, label: "Automação de E-mails MAX", status: "Ligado", color: "text-primary", icon: Globe, active: true },
  ]);

  const toggleService = (id: number) => {
    setServices(services.map(s => {
      if (s.id === id) {
        const newActive = !s.active;
        return {
          ...s,
          active: newActive,
          status: newActive ? "Ligado" : "Desligado",
          color: newActive ? "text-primary" : "text-zinc-500"
        };
      }
      return s;
    }));
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-700 pb-20">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
             <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-sm font-semibold uppercase tracking-widest rounded-full">ADMINMASTER PANEL</span>
          </div>
          <h1 className="font-heading text-6xl font-semibold tracking-tighter text-on-surface leading-[0.9] ">
            Controle <span className="text-gradient">Absoluto</span>
          </h1>
          <p className="text-on-surface-variant font-medium opacity-80 max-w-xl">
            Gestão financeira de elite, cancelamentos e controle global de infraestrutura operacional.
          </p>
        </div>
        
        <div className="flex items-center gap-6 bg-surface-container-low p-4 rounded-3xl border border-outline-variant/30">
          <div className="text-right">
            <p className="text-sm font-semibold text-zinc-500 uppercase tracking-widest leading-none mb-1">Status Global</p>
            <p className="text-sm font-semibold text-emerald-500 flex items-center gap-2 justify-end uppercase tracking-tighter">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Sistema Saudável
            </p>
          </div>
        </div>
      </div>

      {/* Financial Analysis - The "Money" part */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-8 bg-surface-container-low border border-outline-variant/30 rounded-[2.5rem] space-y-4 hover:border-primary/40 transition-all group relative overflow-hidden">
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold text-emerald-500 uppercase tracking-widest">LIVE</span>
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-500 uppercase tracking-widest mb-1">MRR (Mensal)</p>
            <h3 className="text-3xl font-semibold text-on-surface font-heading tracking-tighter">R$ 142.500</h3>
            <p className="text-xs text-emerald-500 font-medium flex items-center gap-1 mt-2">
              <TrendingUp size={12} /> +12.5% este mês
            </p>
          </div>
        </div>

        <div className="p-8 bg-surface-container-low border border-outline-variant/30 rounded-[2.5rem] space-y-4 hover:border-emerald-500/40 transition-all group">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-500 uppercase tracking-widest mb-1">Novas Entradas</p>
            <h3 className="text-3xl font-semibold text-on-surface font-heading tracking-tighter">42 Contratos</h3>
            <p className="text-xs text-zinc-500 font-medium mt-2">Últimas 24 horas</p>
          </div>
        </div>

        <div className="p-8 bg-surface-container-low border border-outline-variant/30 rounded-[2.5rem] space-y-4 hover:border-error/40 transition-all group">
          <div className="w-12 h-12 bg-error/10 rounded-2xl flex items-center justify-center text-error border border-error/20">
            <UserMinus size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-500 uppercase tracking-widest mb-1">Cancelamentos</p>
            <h3 className="text-3xl font-semibold text-on-surface font-heading tracking-tighter">03 <span className="text-xs opacity-50">/mês</span></h3>
            <p className="text-xs text-error/70 font-medium mt-2">Retention Rate: 98.2%</p>
          </div>
        </div>

        <div className="p-8 bg-surface-container-low border border-outline-variant/30 rounded-[2.5rem] space-y-4 hover:border-amber-500/40 transition-all group">
          <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 border border-amber-500/20">
            <BarChart3 size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-500 uppercase tracking-widest mb-1">Aproveitamento</p>
            <h3 className="text-3xl font-semibold text-on-surface font-heading tracking-tighter">94%</h3>
            <p className="text-xs text-zinc-500 font-medium mt-2">Eficiência operacional</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        
        {/* Governance area existing + Global controls */}
        <div className="xl:col-span-8 space-y-16">
          
          <section className="bg-surface-container-low border border-outline-variant/30 rounded-[2.5rem] p-10 relative overflow-hidden group shadow-sm transition-all">
             <div className="flex items-center justify-between mb-12">
                <div className="space-y-1">
                  <h3 className="text-2xl font-semibold text-on-surface font-heading tracking-tight flex items-center gap-3">
                    <ToggleRight className="text-primary" /> Serviços Globais
                  </h3>
                  <p className="text-sm text-zinc-500 font-medium uppercase tracking-[0.2em]">Painel de Ativação Geral</p>
                </div>
                <div className="px-4 py-1 bg-amber-500/10 text-amber-500 text-xs font-semibold uppercase tracking-widest rounded-full border border-amber-500/20 flex items-center gap-2">
                  <AlertCircle size={10} /> Requer Nivel 10
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((servico) => (
                  <div key={servico.id} className="flex items-center justify-between p-6 bg-surface-container-highest/20 hover:bg-surface-container-highest/40 border border-outline-variant/10 rounded-2xl transition-all group/serv">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "p-3 rounded-xl bg-surface-container-highest transition-colors",
                        servico.active ? "text-primary" : "text-zinc-500"
                      )}>
                        <servico.icon size={20} />
                      </div>
                      <span className="text-xs font-medium text-on-surface opacity-80 ">{servico.label}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                       <span className={cn("text-xs font-semibold uppercase tracking-widest", servico.color)}>{servico.status}</span>
                       <div 
                         onClick={() => toggleService(servico.id)}
                         className={cn(
                           "w-10 h-5 rounded-full relative p-0.5 cursor-pointer transition-colors",
                           servico.active ? "bg-primary/20" : "bg-zinc-800"
                         )}
                       >
                         <div className={cn(
                           "w-4 h-4 rounded-full transition-all shadow-sm",
                           servico.active ? "bg-primary translate-x-5" : "bg-zinc-600 translate-x-0"
                         )}></div>
                       </div>
                    </div>
                  </div>
                ))}
             </div>
          </section>

          <section className="animate-in slide-in-from-bottom-4 duration-700">
            <AccessLinkGenerator />
          </section>

          <section className="bg-surface-container-low border border-outline-variant/30 rounded-[2.5rem] p-10 relative overflow-hidden group shadow-sm transition-all animate-in slide-in-from-bottom-5 duration-700">
             <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div className="space-y-1">
                  <h3 className="text-2xl font-semibold text-on-surface font-heading tracking-tight flex items-center gap-3">
                    <Lightbulb className="text-amber-500" /> Ideias & Inovações
                  </h3>
                  <p className="text-sm text-zinc-500 font-medium uppercase tracking-[0.2em]">Painel de Backlog e Melhorias Contínuas</p>
                </div>
                <button className="px-4 py-3 md:py-2 bg-primary text-on-primary text-sm font-semibold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                  <Plus size={16} /> Cadastrar Nova Ideia
                </button>
             </div>
             
             <div className="space-y-4">
                <div className="p-5 bg-surface-container-highest/20 border border-outline-variant/10 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 group/idea hover:bg-surface-container-highest/40 transition-all">
                  <div>
                     <h4 className="text-sm font-medium text-on-surface mb-1">Chatbot de Agendamento WhatsApp</h4>
                     <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">Implementar um fluxo de IA para pacientes marcarem consultas via WhatsApp, integrando direto na tela de Agenda.</p>
                  </div>
                  <span className="shrink-0 px-3 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-semibold uppercase tracking-widest rounded-full border border-emerald-500/20 w-fit">Aprovado para V3</span>
                </div>
                
                <div className="p-5 bg-surface-container-highest/20 border border-outline-variant/10 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 group/idea hover:bg-surface-container-highest/40 transition-all">
                  <div>
                     <h4 className="text-sm font-medium text-on-surface mb-1">OCR Nativo para Receitas (Drive & Scanner)</h4>
                     <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">Permitir que a câmera do tablet escaneie receitas de outros médicos e transcreva automaticamente para o Prontuário.</p>
                  </div>
                  <span className="shrink-0 px-3 py-1 bg-amber-500/10 text-amber-500 text-xs font-semibold uppercase tracking-widest rounded-full border border-amber-500/20 w-fit">Em Análise Técnica</span>
                </div>
                
                <div className="p-5 bg-surface-container-highest/20 border border-outline-variant/10 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 group/idea hover:bg-surface-container-highest/40 transition-all">
                  <div>
                     <h4 className="text-sm font-medium text-on-surface mb-1">Conciliação Bancária Automática (Asaas)</h4>
                     <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">Cruzamento de extratos com NFs emitidas sem intervenção humana, alertando apenas divergências no Kanban.</p>
                  </div>
                  <span className="shrink-0 px-3 py-1 bg-rd-cyan/10 text-rd-cyan text-xs font-semibold uppercase tracking-widest rounded-full border border-rd-cyan/20 w-fit">Backlog / Ideia</span>
                </div>
             </div>

             <div className="mt-8 pt-6 border-t border-outline-variant/10">
                <p className="text-[11px] text-zinc-400 font-medium ">
                  * Este painel é de uso exclusivo do Operador Master. Anote aqui necessidades pontuais (ex: "precisamos de um botão para exportar PDF aqui") para criarmos soluções proativas, desenvolvendo as melhorias em background sem a necessidade de avaliação burocrática dos usuários comuns.
                </p>
             </div>
          </section>
        </div>

        {/* Security Sidebar (Existing but with better style) */}
        <aside className="xl:col-span-4 space-y-12">
          <section className="bg-surface-container-low border border-primary/20 rounded-[2.5rem] p-10 relative overflow-hidden group">
            <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[80px]"></div>
            
            <h3 className="text-xl font-semibold text-primary mb-10 flex items-center gap-3 font-heading tracking-tight underline decoration-primary/20 decoration-2 underline-offset-8">
              <ShieldCheck size={28} strokeWidth={2.5} /> SEGURANÇA ELITE
            </h3>

            <div className="space-y-10 relative z-10">
              <div className="flex items-start gap-4 group/sec cursor-pointer">
                <div className="p-3 bg-primary/10 text-primary rounded-2xl border border-primary/20 transition-all group-hover/sec:scale-110">
                  <Fingerprint size={22} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-on-surface uppercase tracking-widest mb-1.5 leading-none">Criptografia Ativa</h4>
                  <p className="text-sm text-zinc-500 font-medium leading-relaxed opacity-80 group-hover/sec:opacity-100 transition-opacity">Acesso via AdminMaster blindado com AES-256 e RSA-4096 redundante.</p>
                </div>
              </div>
              
              <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
                  <Sparkles size={40} className="text-primary" />
                </div>
                <h4 className="text-sm font-semibold text-primary uppercase tracking-[0.2em] mb-2">Relatório do CORE</h4>
                <p className="text-xs font-medium text-on-surface leading-relaxed">
                  "O faturamento deste mês está 14% acima da projeção, impulsionado por 12 novos upgrades para o plano MAX."
                </p>
              </div>
            </div>
          </section>

          <div className="px-6">
            <button className="w-full flex items-center justify-between p-4 bg-error/5 hover:bg-error/10 border border-error/10 text-error rounded-2xl transition-all group">
              <div className="flex items-center gap-3">
                <Shield size={16} />
                <span className="text-sm font-semibold uppercase tracking-widest">Protocolo de Limpeza</span>
              </div>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
