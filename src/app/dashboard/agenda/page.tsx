"use client";

import React from "react";
import { Calendar as CalendarIcon, Clock, Users, MapPin, ChevronLeft, ChevronRight, Plus, Filter, Search } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const appointments = [
  { time: "08:30", duration: "45min", title: "Review de Protocolo Cirúrgico", location: "Sala de Conferência A", doctors: ["Dr. Thorne", "Dra. Helena"], status: "CONFIRMADO", type: "CRÍTICO" },
  { time: "10:00", duration: "1h", title: "Sincronização BioFlow Core", location: "Auditório Virtual", doctors: ["Alistair Thorne", "IA Alpha"], status: "EM ANDAMENTO", type: "ESTRATÉGICO" },
  { time: "14:30", duration: "30min", title: "Auditoria de Conformidade", location: "Ala de Diagnósticos", doctors: ["Dra. Helena"], status: "PENDENTE", type: "ADMIN" },
  { time: "16:00", duration: "45min", title: "Conselho de Administração", location: "Suíte Executiva", doctors: ["Board MedCore"], status: "CONFIRMADO", type: "ESTRATÉGICO" },
];

export default function AgendaPage() {
  return (
    <>
      <div className="space-y-12 animate-in fade-in duration-700">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
               <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">TEMPORAL MODULE</span>
            </div>
            <h1 className="font-heading text-6xl font-black tracking-tighter text-on-surface leading-[0.9] italic">
              Agenda <span className="text-gradient">Institucional</span>
            </h1>
            <p className="text-on-surface-variant font-medium italic opacity-80 max-w-xl">
              Orquestração de janelas críticas e sincronização de autoridade clínica no ecossistema BioFlow.
            </p>
          </div>

          <div className="flex items-center gap-4">
             <button className="flex items-center gap-2 px-6 py-4 bg-surface-container-highest/50 hover:bg-surface-container-highest border border-outline-variant/10 rounded-2xl text-on-surface font-heading font-black text-sm transition-all group">
                <Filter size={18} className="text-zinc-500 group-hover:text-primary transition-colors" />
                Refinar Vista
             </button>
             <button className="btn-gradient px-8 py-4 rounded-2xl flex items-center gap-3 hover:shadow-primary/30 active:scale-95 transition-all text-sm font-heading font-black">
                <Plus size={20} />
                Agendar Slot
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
          
          {/* Main Calendar View */}
          <div className="xl:col-span-8 space-y-10">
            
            {/* Calendar Header / Selector */}
            <section className="bg-surface-container-low/50 backdrop-blur-md border border-outline-variant/10 rounded-[2.5rem] p-8 overflow-hidden">
               <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-6">
                     <h3 className="font-heading text-3xl font-black text-on-surface italic">Novembro, 2026</h3>
                     <div className="flex items-center gap-1 bg-surface-container-highest/30 p-1 rounded-xl">
                        <button className="p-2 hover:bg-primary/20 hover:text-primary rounded-lg transition-all text-zinc-500"><ChevronLeft size={20} /></button>
                        <button className="p-2 hover:bg-primary/20 hover:text-primary rounded-lg transition-all text-zinc-500"><ChevronRight size={20} /></button>
                     </div>
                  </div>
                  <div className="flex bg-surface-container-highest/30 p-1.5 rounded-2xl border border-outline-variant/5">
                     <button className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-on-surface bg-surface-container-low border border-outline-variant/10 rounded-xl shadow-2xl transition-all">Dia</button>
                     <button className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-on-surface transition-all">Semana</button>
                     <button className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-on-surface transition-all">Mês</button>
                  </div>
               </div>

               <div className="grid grid-cols-7 gap-2 mb-4">
                  {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map(day => (
                    <div key={day} className="text-center text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] py-2">{day}</div>
                  ))}
               </div>

               <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 35 }).map((_, i) => {
                    const day = (i % 31) + 1;
                    const isToday = day === 12;
                    const isOtherMonth = i < 1 || i > 31;
                    return (
                      <div key={i} className={cn(
                        "h-32 p-4 rounded-3xl border transition-all cursor-pointer relative group",
                        isToday ? "bg-primary/5 border-primary/30 shadow-[0_0_30px_rgba(58,223,250,0.1)]" : "bg-surface-container-highest/20 border-outline-variant/5 hover:border-primary/20",
                        isOtherMonth ? "opacity-20 select-none pointer-events-none" : "opacity-100"
                      )}>
                        <div className="flex justify-between items-start">
                           <span className={cn("font-heading text-lg font-black", isToday ? "text-primary italic" : "text-zinc-400 group-hover:text-on-surface")}>{day}</span>
                           {isToday && <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_#3adffa]"></div>}
                        </div>
                        {day === 12 && (
                          <div className="mt-4 space-y-1">
                             <div className="text-[8px] font-black bg-primary/20 text-primary px-1.5 py-0.5 rounded truncate uppercase tracking-tighter">Review Protocolo</div>
                             <div className="text-[8px] font-black bg-emerald-500/20 text-emerald-500 px-1.5 py-0.5 rounded truncate uppercase tracking-tighter">Sinc. BioFlow</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
               </div>
            </section>
          </div>

          {/* Timeline View / Upcoming */}
          <aside className="xl:col-span-4 space-y-10">
             <section className="bg-surface-container-low/50 backdrop-blur-md border border-outline-variant/10 rounded-[2.5rem] p-10 overflow-hidden relative">
                <div className="flex items-center gap-2 mb-10">
                  <div className="w-1 h-5 bg-primary rounded-full"></div>
                  <h3 className="font-heading text-xl font-black text-on-surface italic">Próximos Slots</h3>
                </div>

                <div className="space-y-12 relative">
                   {/* Vertical Line */}
                   <div className="absolute left-3 top-2 bottom-0 w-[1px] bg-outline-variant/10"></div>

                   {appointments.map((item, i) => (
                     <div key={i} className="flex gap-8 relative group cursor-pointer">
                        <div className={cn("w-6 h-6 rounded-full border-2 border-background ring-4 ring-offset-0 flex-shrink-0 z-10 transition-all group-hover:scale-125", 
                          item.status === 'EM ANDAMENTO' ? 'bg-primary border-primary ring-primary/20 shadow-[0_0_15px_#3adffa]' : 'bg-surface-container-highest border-zinc-700 ring-transparent')}>
                        </div>
                        <div className="space-y-3 pb-2 w-full">
                           <div className="flex justify-between items-start">
                              <p className="text-[10px] font-black tracking-widest uppercase">
                                <span className="text-zinc-500">{item.time} — </span>
                                <span className={cn(
                                  item.type === 'CRÍTICO' ? 'text-error' : 
                                  item.type === 'ESTRATÉGICO' ? 'text-primary' : 'text-zinc-400'
                                )}>{item.type}</span>
                              </p>
                              <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">{item.duration}</span>
                           </div>
                           <div className="bg-surface-container-highest/30 hover:bg-surface-container-highest/50 border border-outline-variant/5 hover:border-primary/20 p-5 rounded-2xl transition-all">
                              <h4 className="font-heading font-black text-on-surface text-base mb-2 group-hover:text-primary transition-colors">{item.title}</h4>
                              <div className="flex flex-col gap-2">
                                 <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-medium">
                                    <MapPin size={12} className="text-zinc-600" />
                                    {item.location}
                                 </div>
                                 <div className="flex items-center gap-2">
                                    <div className="flex -space-x-1.5">
                                       {item.doctors.map((doc, j) => (
                                         <div key={j} className="w-5 h-5 rounded-full bg-zinc-800 border border-background flex items-center justify-center text-[6px] font-black">{doc[0]}</div>
                                       ))}
                                    </div>
                                    <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter truncate max-w-[120px]">Convidados Ativos</span>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="mt-12 pt-10 border-t border-outline-variant/10 text-center">
                   <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2 italic">Timeline Sincronizada com Cloud Core</p>
                   <div className="flex justify-center items-center gap-1">
                      <Clock size={12} className="text-primary/50" />
                      <span className="text-[9px] text-primary/70 font-black">UTC-3 EXECUTIVO</span>
                   </div>
                </div>
             </section>
          </aside>
        </div>
      </div>
    </>
  );
}
