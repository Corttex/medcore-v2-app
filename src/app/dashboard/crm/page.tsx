"use client";

import React, { useState } from "react";
import { Users, Phone, Calendar, CheckCircle, Search, Filter, MoreHorizontal, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

// Tipos
type Lead = {
  id: string;
  name: string;
  source: string;
  time: string;
  phone: string;
  avatar: string;
};

// Dados Mock
const COLUMNS = [
  { id: "new", title: "Novos Leads", count: 4, color: "bg-blue-500" },
  { id: "contacted", title: "Em Contato", count: 2, color: "bg-amber-500" },
  { id: "scheduled", title: "Agendado", count: 3, color: "bg-emerald-500" },
  { id: "completed", title: "Finalizado / Fidelizado", count: 12, color: "bg-rd-cyan" },
];

const MOCK_LEADS: Record<string, Lead[]> = {
  new: [
    { id: "1", name: "Ana Beatriz", source: "Instagram Ads", time: "Há 10 min", phone: "(11) 98888-7777", avatar: "AB" },
    { id: "2", name: "Carlos Eduardo", source: "WhatsApp", time: "Há 1 hora", phone: "(11) 99999-6666", avatar: "CE" },
    { id: "3", name: "Fernanda Lima", source: "Indicação", time: "Há 3 horas", phone: "(21) 97777-5555", avatar: "FL" },
    { id: "4", name: "Roberto Silva", source: "Google Ads", time: "Ontem", phone: "(31) 96666-4444", avatar: "RS" },
  ],
  contacted: [
    { id: "5", name: "Mariana Souza", source: "WhatsApp", time: "Ontem", phone: "(11) 95555-3333", avatar: "MS" },
    { id: "6", name: "João Pedro", source: "Site", time: "Há 2 dias", phone: "(11) 94444-2222", avatar: "JP" },
  ],
  scheduled: [
    { id: "7", name: "Juliana Costa", source: "Instagram Ads", time: "Amanhã, 14:00", phone: "(21) 93333-1111", avatar: "JC" },
    { id: "8", name: "Marcos Paulo", source: "Google Ads", time: "Qui, 10:30", phone: "(41) 92222-0000", avatar: "MP" },
    { id: "9", name: "Luciana Alves", source: "Site", time: "Sex, 09:00", phone: "(51) 91111-9999", avatar: "LA" },
  ],
  completed: [
    { id: "10", name: "Patrícia Gomes", source: "Indicação", time: "Retorno em 30 dias", phone: "(11) 90000-8888", avatar: "PG" },
    { id: "11", name: "Thiago Ribeiro", source: "WhatsApp", time: "Retorno em 6 meses", phone: "(11) 91234-5678", avatar: "TR" },
  ],
};

export default function CRMPage() {
  const [draggedItem, setDraggedItem] = useState<{ id: string, sourceCol: string } | null>(null);
  const [leads, setLeads] = useState(MOCK_LEADS);

  const handleDragStart = (e: React.DragEvent, id: string, sourceCol: string) => {
    setDraggedItem({ id, sourceCol });
    // Estética ghost
    setTimeout(() => {
      if (e.target instanceof HTMLElement) {
        e.target.style.opacity = '0.5';
      }
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (e.target instanceof HTMLElement) {
      e.target.style.opacity = '1';
    }
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetCol: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.sourceCol === targetCol) return;

    setLeads(prev => {
      const sourceList = [...prev[draggedItem.sourceCol]];
      const targetList = [...prev[targetCol]];
      
      const itemIndex = sourceList.findIndex(i => i.id === draggedItem.id);
      const [item] = sourceList.splice(itemIndex, 1);
      
      targetList.unshift(item);

      return {
        ...prev,
        [draggedItem.sourceCol]: sourceList,
        [targetCol]: targetList
      };
    });
  };

  return (
    <div className="max-w-[1600px] mx-auto h-[calc(100vh-100px)] flex flex-col p-4 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-on-surface flex items-center gap-2">
            <Users className="text-rd-cyan" size={28} />
            CRM de Relacionamento
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Funil de Vendas e Conversão de Pacientes.
          </p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
            <input 
              type="text" 
              placeholder="Buscar paciente..." 
              className="pl-9 pr-4 py-2 border border-outline-variant rounded-xl bg-surface text-sm focus:border-rd-cyan outline-none transition-colors w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity">
            <Filter size={16} />
            Filtros
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 snap-x">
        {COLUMNS.map(col => (
          <div 
            key={col.id} 
            className="flex flex-col min-w-[320px] max-w-[320px] bg-surface-container/10 border border-outline-variant rounded-2xl overflow-hidden snap-start shrink-0"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            {/* Column Header */}
            <div className="p-4 border-b border-outline-variant/50 bg-surface flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <div className={cn("w-3 h-3 rounded-full shadow-sm", col.color)} />
                <h3 className="font-bold text-on-surface">{col.title}</h3>
                <span className="bg-surface-container px-2 py-0.5 rounded-full text-xs font-bold text-on-surface-variant">
                  {leads[col.id].length}
                </span>
              </div>
              <button className="text-on-surface-variant hover:text-on-surface p-1">
                <MoreHorizontal size={18} />
              </button>
            </div>

            {/* Column Cards Area */}
            <div className="flex-1 p-3 overflow-y-auto space-y-3">
              {leads[col.id].map(lead => (
                <div
                  key={lead.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, lead.id, col.id)}
                  onDragEnd={handleDragEnd}
                  className="bg-surface border border-outline-variant rounded-xl p-4 shadow-sm hover:shadow-md hover:border-rd-cyan/50 cursor-grab active:cursor-grabbing transition-all relative group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-3">
                       <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-sm font-bold text-on-surface">
                         {lead.avatar}
                       </div>
                       <div>
                         <h4 className="font-bold text-on-surface text-sm">{lead.name}</h4>
                         <span className="text-sm uppercase font-bold text-on-surface-variant px-1.5 py-0.5 bg-surface-container rounded-sm mt-1 inline-block">
                           {lead.source}
                         </span>
                       </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                      <Calendar size={12} className="text-rd-cyan" />
                      {lead.time}
                    </div>
                    <div className="flex items-center justify-between text-xs font-medium">
                       <div className="flex items-center gap-2 text-on-surface-variant">
                         <Phone size={12} />
                         {lead.phone}
                       </div>
                       
                       <button className="opacity-0 group-hover:opacity-100 transition-opacity bg-green-500/10 text-green-600 dark:text-green-400 p-1.5 rounded-lg hover:bg-green-500/20">
                         <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" className="w-3.5 h-3.5" alt="WhatsApp" />
                       </button>
                    </div>
                  </div>
                </div>
              ))}

              {leads[col.id].length === 0 && (
                 <div className="h-24 border-2 border-dashed border-outline-variant/50 rounded-xl flex items-center justify-center text-sm text-on-surface-variant">
                   Arraste cards para cá
                 </div>
              )}
            </div>

            {/* Column Footer */}
            <div className="p-3 bg-surface border-t border-outline-variant/50">
              <button className="w-full py-2 flex items-center justify-center gap-2 text-sm font-bold text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors">
                <Plus size={16} />
                Adicionar Lead
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
