"use client";

import React, { useState } from "react";
import { BrainCircuit, Send, Sparkles, Activity, ShieldCheck, Zap, ArrowRight, MessageSquare, Terminal, RefreshCw } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { sanitize } from "@/lib/sanitize";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const aiInsights = [
  { type: "PREDITIVO", content: "Probabilidade de sobrecarga na Unidade de Emergência nas próximas 6 horas: 82.4%. Recomenda-se realocação de 3 médicos.", color: "text-lilac" },
  { type: "OTIMIZAÇÃO", content: "Protocolo de Auditoria VitalFlow detectou redução de 14% na latência de faturamento após ajuste no módulo de laudos.", color: "text-emerald-500" },
  { type: "ESTRATÉGICO", content: "Análise de mercado sugere integração imediata com o Hub Regional de Telemedicina para expansão de cobertura.", color: "text-amber-500" },
];

import { useUser } from "@/modules/shared/context/UserContext";

export default function AIExecPage() {
  const { user } = useUser();
  const [input, setInput] = useState("");
  
  const initials = user?.full_name 
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : "OP";
    
  const firstName = user?.full_name ? user.full_name.split(' ')[0] : "Operador";
  const handleSend = () => {
    if (!input.trim()) return;
    const cleanInput = sanitize(input);
    console.log("AI Command:", cleanInput);
    // Processamento da IA ocorreria aqui
    setInput("");
  };

  return (
    <>
      <div className="space-y-12 animate-in fade-in duration-700">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
               <span className="px-3 py-1 bg-lilac/10 border border-lilac/20 text-lilac text-[10px] font-black uppercase tracking-widest rounded-full">INTELLIGENCE CORE MODULE</span>
               <div className="flex items-center gap-1.5 ml-2">
                 <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></span>
                 <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest leading-none">Stream Neural ATIVO</span>
               </div>
            </div>
            <h1 className="font-heading text-6xl font-black tracking-tighter text-on-surface leading-[0.9] italic">
              IA <span className="text-gradient-lilac">Executiva</span>
            </h1>
            <p className="text-on-surface-variant font-medium italic opacity-80 max-w-xl">
              O núcleo de processamento neural do MedCore V2, projetado para sintetizar dados complexos em decisões de alta fidelidade.
            </p>
          </div>

          <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-6 py-4 bg-surface-container-highest/50 hover:bg-surface-container-highest border border-outline-variant/10 rounded-2xl text-on-surface font-heading font-black text-sm transition-all group">
                 <RefreshCw size={18} className="text-zinc-500 group-hover:text-lilac transition-colors group-hover:rotate-180 duration-500" />
                 Recalibrar IA
              </button>
              <button className="relative btn-gradient-lilac px-8 py-4 rounded-2xl flex items-center gap-3 hover:shadow-lilac/40 active:scale-95 transition-all text-sm font-heading font-black overflow-hidden group">
                 <span className="absolute inset-0 rounded-2xl border-2 border-lilac/40 animate-ping opacity-30" />
                 <Terminal size={20} />
                 Acessar Raw Logs
                 <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          
          {/* Neural Interface Area */}
          <div className="xl:col-span-8 flex flex-col min-h-[700px]">
             
             {/* Chat Display Areas */}
             <div className="flex-1 bg-surface-container-low/50 backdrop-blur-md border border-outline-variant/10 rounded-t-[3rem] p-10 space-y-8 overflow-y-auto custom-scrollbar">
                
                <div className="flex gap-6 max-w-3xl">
                   <div className="w-12 h-12 rounded-2xl bg-lilac/10 border border-lilac/20 flex items-center justify-center text-lilac shrink-0 relative overflow-hidden">
                      <div className="absolute inset-0 bg-lilac/5 animate-pulse"></div>
                      <BrainCircuit size={24} />
                   </div>
                   <div className="space-y-4">
                      <div className="bg-surface-container-highest/40 border border-outline-variant/5 p-6 rounded-3xl rounded-tl-none">
                         <p className="text-on-surface-variant font-medium leading-relaxed italic">
                            Saudações, {firstName ? `Dr(a). ${firstName}` : "Operador"}. Estou analisando o fluxo VitalFlow de hoje. Detectei um desvio na precisão diagnóstica da ala cardíaca que requer sua atenção. Como deseja proceder?
                         </p>
                      </div>
                      <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest pl-2">SISTEMA ALPHA CORE • AGORA</p>
                   </div>
                </div>

                <div className="flex gap-6 max-w-3xl ml-auto flex-row-reverse">
                   <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500 shrink-0">
                      <span className="text-xs font-black">{initials}</span>
                   </div>
                   <div className="space-y-4 text-right">
                      <div className="bg-lilac/20 border border-lilac/20 p-6 rounded-3xl rounded-tr-none">
                         <p className="text-on-surface font-medium leading-relaxed italic">
                            Execute uma varredura completa nos últimos 12 laudos da ala cardíaca e compare com o protocolo Vital-C3.
                         </p>
                      </div>
                      <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest pr-2">{user?.full_name || "OPERADOR"} • HÁ 1MIN</p>
                   </div>
                </div>

                <div className="flex gap-6 max-w-3xl">
                   <div className="w-12 h-12 rounded-2xl bg-lilac/10 border border-lilac/20 flex items-center justify-center text-lilac shrink-0 relative overflow-hidden">
                      <div className="absolute inset-0 bg-lilac/5 animate-pulse"></div>
                      <BrainCircuit size={24} />
                   </div>
                   <div className="space-y-4">
                      <div className="bg-surface-container-highest/40 border border-outline-variant/5 p-6 rounded-3xl rounded-tl-none">
                         <div className="flex items-center gap-3 mb-4">
                            <span className="w-2 h-2 bg-lilac rounded-full animate-bounce shadow-[0_0_10px_#a78bfa]"></span>
                            <span className="text-[10px] font-black text-lilac uppercase tracking-[0.3em]">ANALISANDO DATASET...</span>
                         </div>
                         <p className="text-on-surface-variant font-medium leading-relaxed italic">
                            Varredura iniciada. Processando 1.482 pontos de dados clínicos. Latência neural estimada: 1.2s.
                         </p>
                      </div>
                   </div>
                </div>

             </div>

             {/* Input Area */}
             <div className="bg-surface-container-low backdrop-blur-md border-x border-b border-outline-variant/10 rounded-b-[3rem] p-6">
                <p className="text-[10px] font-black text-lilac uppercase tracking-widest mb-3 flex items-center gap-2">
                  <MessageSquare size={12} /> Digite aqui para interagir com a IA
                </p>
                <div className="relative group">
                   <input 
                     value={input}
                     onChange={(e) => setInput(e.target.value)}
                     onKeyDown={(e) => e.key === "Enter" && handleSend()}
                     placeholder="Ex: Gere um resumo executivo das demandas críticas desta semana..." 
                     className="w-full bg-surface-container-highest/50 border-2 border-lilac/30 hover:border-lilac/50 focus:border-lilac focus:ring-4 focus:ring-lilac/10 focus:outline-none h-16 px-6 pr-20 rounded-2xl text-sm text-on-surface transition-all duration-300 placeholder:text-outline-variant/50 font-medium"
                   />
                   <button 
                     onClick={handleSend}
                     disabled={!input.trim()}
                     className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-lilac text-white rounded-xl flex items-center justify-center hover:shadow-[0_0_20px_rgba(167,139,250,0.5)] hover:scale-110 active:scale-95 transition-all group/btn disabled:opacity-50"
                   >
                      <Send size={18} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                   </button>
                </div>
                <div className="flex justify-between items-center mt-3 px-1">
                   <div className="flex gap-4">
                      <button className="text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-lilac transition-colors flex items-center gap-1.5"><Sparkles size={12}/> Gerar Insights</button>
                      <button className="text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-lilac transition-colors flex items-center gap-1.5"><MessageSquare size={12}/> Sugestões Rápidas</button>
                   </div>
                   <p className="text-[9px] text-zinc-700 font-bold italic">MedCode IA v4.28.1</p>
                </div>
             </div>

          </div>

          {/* Neural Analytics Sidebar */}
          <aside className="xl:col-span-4 space-y-10">
             
             <section className="bg-surface-container-low/50 backdrop-blur-md border border-outline-variant/10 rounded-[2.5rem] p-10 overflow-hidden relative">
                <div className="flex items-center gap-2 mb-10">
                  <div className="w-1 h-5 bg-lilac rounded-full"></div>
                  <h3 className="font-heading text-xl font-black text-on-surface italic">Alpha Insights</h3>
                </div>

                <div className="space-y-8">
                   {aiInsights.map((insight, i) => (
                     <div key={i} className="p-6 bg-surface-container-highest/20 border border-outline-variant/5 rounded-2xl space-y-3 relative group overflow-hidden hover:bg-surface-container-highest/40 transition-all cursor-pointer">
                        <div className="flex justify-between items-center relative z-10">
                           <span className={cn("text-[10px] font-black uppercase tracking-[0.2em]", insight.color)}>{insight.type}</span>
                           <ShieldCheck size={14} className="text-zinc-700" />
                        </div>
                        <p className="text-[11px] text-on-surface-variant font-medium leading-relaxed italic relative z-10">
                           {insight.content}
                        </p>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-lilac/5 rounded-full blur-3xl -translate-y-12 translate-x-12"></div>
                     </div>
                   ))}
                </div>

                <button className="w-full mt-12 py-5 bg-surface-container-highest/50 border border-outline-variant/10 rounded-2xl flex items-center justify-between px-8 hover:bg-surface-container-highest transition-all group">
                   <div className="flex items-center gap-3">
                      <Activity size={18} className="text-lilac"/>
                      <span className="text-[10px] font-black text-on-surface uppercase tracking-widest">Ver Matriz Neural</span>
                   </div>
                   <ArrowRight size={18} className="text-zinc-600 group-hover:text-lilac group-hover:translate-x-1 transition-all" />
                </button>
             </section>

             <section className="p-10 bg-surface-container-highest/20 border border-outline-variant/10 rounded-[2.5rem] relative overflow-hidden">
                <div className="relative z-10 space-y-6">
                   <div className="flex justify-between items-end">
                      <div className="space-y-1">
                         <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Sincronização</p>
                         <p className="font-heading text-4xl font-black text-on-surface italic">100<span className="text-lilac">%</span></p>
                      </div>
                      <Zap size={32} className="text-lilac shadow-[0_0_15px_#a78bfa]"/>
                   </div>
                   <div className="h-2 bg-surface-container-highest/50 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-lilac rounded-full animate-pulse shadow-[0_0_8px_#a78bfa]"></div>
                   </div>
                   <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest text-center">Conexão Estável com Cloud-Brain 01</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-lilac/5 to-transparent"></div>
             </section>

          </aside>
        </div>
      </div>
    </>
  );
}
