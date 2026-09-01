"use client";

import React, { useState, useEffect } from "react";
import { Video, Mic, Share2, Users, Calendar, Clock, ChevronRight, Play, Settings2, MoreHorizontal } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  status: string;
  type: string;
  participants?: number;
  host?: string;
}

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMeetings() {
      setLoading(true);
      try {
        const res = await fetch("/api/meetings");
        if (res.ok) {
          const data = await res.json();
          setMeetings(data.map((m: any) => ({
            ...m,
            participants: 0, // Mocked for now until guests table is fully integrated
            host: "Sistema"
          })));
        }
      } catch (error) {
        console.error("Erro ao buscar reuniões:", error);
      }
      setLoading(false);
    }
    fetchMeetings();
  }, []);

  const activeRooms = meetings.filter(m => m.status === 'LIVE' || m.status === 'Agendada').slice(0, 4);
  const todayMeetings = meetings.filter(m => m.date === new Date().toISOString().split('T')[0]);

  return (
    <>
      <div className="space-y-12 animate-in fade-in duration-700">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
               <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">TRANSCRITOR VITAL ATIVO</span>
            </div>
            <h1 className="font-heading text-6xl font-black tracking-tighter text-on-surface leading-[0.9] italic">
              Zonas de <span className="text-gradient-lilac">Colaboração</span>
            </h1>
            <p className="text-on-surface-variant font-medium italic opacity-80 max-w-xl">
              Sincronização de autoridade e tomada de decisão em salas de guerra clínicas de alta fidelidade.
            </p>
          </div>

          <div className="flex items-center gap-4">
             <button className="flex items-center gap-2 px-6 py-4 bg-surface-container-highest/50 hover:bg-surface-container-highest border border-outline-variant/10 rounded-2xl text-on-surface font-heading font-black text-sm transition-all group">
                <Settings2 size={18} className="text-zinc-500 group-hover:text-lilac transition-colors" />
                Configurar Periferia
             </button>
             <button className="btn-gradient-lilac px-8 py-4 rounded-2xl flex items-center gap-3 hover:shadow-lilac/30 active:scale-95 transition-all text-sm font-heading font-black">
                <Video size={20} />
                Iniciar Nova Sala
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          
          {/* Active Rooms Grid */}
          <div className="xl:col-span-8 space-y-10">
             <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-5 bg-lilac rounded-full"></div>
                <h3 className="font-heading text-xl font-black text-on-surface italic">Salas Ativas no Hub</h3>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {activeRooms.map((room, i) => (
                  <div key={i} className="bg-surface-container-low/50 backdrop-blur-md border border-outline-variant/10 rounded-[2.5rem] p-8 group hover:border-lilac/30 transition-all cursor-pointer relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                       <Users size={120} />
                    </div>
                    
                    <div className="relative z-10 space-y-6">
                       <div className="flex justify-between items-start">
                          <div className={cn("px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest", 
                            room.status === 'LIVE' ? 'bg-error/10 text-error border border-error/20' : 
                            room.status === 'Agendada' ? 'bg-lilac/10 text-lilac border border-lilac/20' : 'bg-zinc-800 text-zinc-500'
                          )}>
                            {room.status === 'LIVE' && <span className="inline-block w-1.5 h-1.5 bg-error rounded-full mr-2 animate-pulse"></span>}
                            {room.status}
                          </div>
                          <button className="text-zinc-600 hover:text-on-surface"><MoreHorizontal size={18}/></button>
                       </div>

                       <div className="space-y-2">
                          <h4 className="font-heading text-2xl font-black text-on-surface tracking-tight italic group-hover:text-lilac transition-colors leading-tight">{room.title}</h4>
                          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">ID: {room.id.slice(0, 8)} • Host: {room.host}</p>
                       </div>

                       <div className="flex items-center justify-between pt-6 border-t border-outline-variant/10">
                          <div className="flex items-center gap-3">
                             <div className="flex -space-x-2">
                                {[1, 2, 3].map(j => (
                                  <div key={j} className="w-8 h-8 rounded-full border-2 border-background bg-surface-container-highest flex items-center justify-center text-[10px] font-black text-zinc-500">P{j}</div>
                                ))}
                             </div>
                             <span className="text-[10px] text-zinc-500 font-black">+{room.participants! > 3 ? room.participants! - 3 : 0} ativos</span>
                          </div>
                          <button className={cn("w-12 h-12 flex items-center justify-center rounded-2xl transition-all shadow-2xl", 
                            room.status === 'LIVE' ? 'bg-error text-white shadow-error/20 hover:scale-110' : 'bg-surface-container-highest text-zinc-500'
                          )}>
                             <Play size={20} fill={room.status === 'LIVE' ? 'currentColor' : 'none'} />
                          </button>
                       </div>
                    </div>
                  </div>
                ))}
                {activeRooms.length === 0 && !loading && (
                   <div className="col-span-full py-12 text-center text-on-surface-variant italic opacity-50">Nenhuma sala ativa encontrada.</div>
                )}
             </div>
          </div>

          {/* Sidebar Area */}
          <aside className="xl:col-span-4 space-y-10">
             <section className="bg-surface-container-low/50 backdrop-blur-md border border-outline-variant/10 rounded-[2.5rem] p-10 overflow-hidden relative group">
                <div className="flex items-center gap-2 mb-10">
                  <div className="w-1 h-5 bg-lilac rounded-full"></div>
                  <h3 className="font-heading text-xl font-black text-on-surface italic">Agendadas Hoje</h3>
                </div>

                <div className="space-y-6">
                   {todayMeetings.map((meet, j) => (
                     <div key={j} className="flex gap-5 p-5 bg-surface-container-highest/20 hover:bg-surface-container-highest/40 border border-outline-variant/5 rounded-2xl transition-all cursor-pointer group/item">
                        <div className="flex flex-col items-center justify-center min-w-[60px] border-r border-outline-variant/10 pr-5">
                           <span className="text-sm font-black text-on-surface font-heading">{meet.time?.substring(0, 5)}</span>
                           <span className="text-[8px] font-black text-zinc-600 uppercase">UTC-3</span>
                        </div>
                        <div>
                           <h5 className="text-[11px] font-black text-lilac uppercase tracking-widest mb-1">{meet.type || 'SINCRO'}</h5>
                           <p className="text-sm font-bold text-on-surface group-hover/item:text-lilac transition-colors">{meet.title}</p>
                        </div>
                     </div>
                   ))}
                   {todayMeetings.length === 0 && !loading && (
                     <p className="text-[10px] text-zinc-600 italic">Sem reuniões para hoje.</p>
                   )}
                </div>

                <div className="mt-12 p-6 rounded-2xl bg-surface-container-highest/30 border border-outline-variant/10 flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-lilac/10 flex items-center justify-center text-lilac shrink-0">
                      <Mic size={18} />
                   </div>
                   <p className="text-[10px] text-zinc-500 font-medium leading-relaxed italic">
                      Hardware de áudio sincronizado via <span className="text-lilac font-bold">Vital Engine</span>. Latência atual: 4ms.
                   </p>
                </div>
             </section>

             <div className="px-6 flex gap-4">
                <button className="flex-1 flex items-center justify-center p-4 bg-surface-container-low border border-outline-variant/10 text-on-surface rounded-2xl hover:bg-surface-container-highest transition-all group">
                   <Share2 size={18} className="group-hover:text-lilac transition-colors" />
                </button>
                <button className="flex-grow-[3] flex items-center justify-between p-4 bg-surface-container-low border border-outline-variant/10 text-on-surface rounded-2xl hover:bg-surface-container-highest transition-all px-8">
                   <span className="text-[10px] font-black uppercase tracking-widest">Acessar Histórico</span>
                   <ChevronRight size={16} className="text-zinc-600" />
                </button>
             </div>
          </aside>
        </div>
      </div>
    </>
  );
}
