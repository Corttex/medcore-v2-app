"use client";

import React, { useState } from "react";
import { FileText, Search, Filter, Folder, Download, Eye, Clock, ShieldCheck, MoreVertical, Plus } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { sanitize } from "@/lib/utils";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const initialDocuments = [
  { name: "Manual_Operacional_MedCore.pdf", type: "SISTEMA", size: "1.2MB", date: "Hoje", status: "AUDITADO", auditor: "Sistema" },
];

import { useUser } from "@/modules/shared/context/UserContext";

export default function DocumentsPage() {
  const { user } = useUser();
  const [search, setSearch] = useState("");
  const [documents] = useState(initialDocuments);

  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(search.toLowerCase()) || 
    doc.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="space-y-12 animate-in fade-in duration-700">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
               <span className="px-3 py-1 bg-lilac/10 border border-lilac/20 text-lilac text-[10px] font-black uppercase tracking-widest rounded-full">REPOSITORY MODULE</span>
            </div>
            <h1 className="font-heading text-6xl font-black tracking-tighter text-on-surface leading-[0.9] italic">
              Arquivo <span className="text-gradient-lilac">Estratégico</span>
            </h1>
            <p className="text-on-surface-variant font-medium italic opacity-80 max-w-xl">
              Célula de armazenamento de alta fidelidade para documentos clínicos sensíveis e protocolos de autoridade.
            </p>
          </div>

          <div className="flex items-center gap-4">
             <div className="bg-surface-container-highest/50 px-5 py-3 rounded-2xl border border-outline-variant/10 focus-within:border-lilac/40 transition-all flex items-center group">
                <Search size={18} className="text-zinc-600 group-focus-within:text-lilac transition-colors" />
                <input 
                  placeholder="Buscar no repositório..." 
                  className="bg-transparent border-none focus:ring-0 text-sm ml-3 w-64 text-on-surface" 
                  value={search}
                  onChange={(e) => setSearch(sanitize(e.target.value))}
                />
             </div>
             <button className="btn-gradient-lilac px-8 py-4 rounded-2xl flex items-center gap-3 hover:shadow-lilac/30 active:scale-95 transition-all text-sm font-heading font-black">
                <Plus size={20} />
                Novo Documento
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          
          {/* Main List Area */}
          <div className="xl:col-span-8 space-y-8">
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                   <div className="w-1 h-5 bg-lilac rounded-full"></div>
                   <h3 className="font-heading text-xl font-black text-on-surface italic">Registros Recentes</h3>
                </div>
                <button className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-on-surface transition-colors">
                   <Filter size={14} /> Refinar Vista
                </button>
             </div>

             <div className="space-y-4">
                {documents.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-6 bg-surface-container-low/50 backdrop-blur-md border border-outline-variant/5 hover:border-lilac/20 rounded-[2rem] group transition-all cursor-pointer">
                    <div className="flex items-center gap-6">
                       <div className="w-14 h-14 rounded-2xl bg-surface-container-highest flex items-center justify-center text-zinc-500 border border-outline-variant/10 group-hover:text-lilac group-hover:border-lilac/20 transition-all relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-lilac/5 to-transparent"></div>
                          <FileText size={24} />
                       </div>
                       <div className="space-y-1">
                          <h4 className="font-heading font-black text-on-surface text-lg leading-tight group-hover:text-lilac transition-colors">{doc.name}</h4>
                          <div className="flex items-center gap-3">
                             <span className="text-[10px] text-lilac/70 font-black uppercase tracking-widest">{doc.type}</span>
                             <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
                             <span className="text-[10px] text-zinc-600 font-medium">{doc.size}</span>
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center gap-8">
                       <div className="hidden lg:block text-right">
                          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">DATA DE REGISTRO</p>
                          <p className="text-xs font-bold text-on-surface-variant italic">{doc.date}</p>
                       </div>
                       
                       <div className="flex items-center gap-3 bg-surface-container-highest/30 px-4 py-2 rounded-xl border border-outline-variant/5">
                          <div className={cn("w-1.5 h-1.5 rounded-full", doc.status === 'AUDITADO' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-amber-500')}></div>
                          <div className="flex flex-col">
                             <span className="text-[9px] font-black uppercase tracking-tighter text-on-surface">{doc.status}</span>
                             <span className="text-[8px] text-zinc-600 font-bold uppercase">{doc.auditor}</span>
                          </div>
                       </div>

                       <div className="flex items-center gap-2">
                          <button className="p-3 text-zinc-500 hover:text-lilac transition-colors hover:bg-lilac/10 rounded-xl"><Eye size={18}/></button>
                          <button className="p-3 text-zinc-500 hover:text-lilac transition-colors hover:bg-lilac/10 rounded-xl"><Download size={18}/></button>
                       </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Directory Sidebar */}
          <aside className="xl:col-span-4 space-y-10">
             <section className="bg-surface-container-low/50 backdrop-blur-md border border-outline-variant/10 rounded-[2.5rem] p-10">
                <div className="flex items-center gap-2 mb-10">
                  <div className="w-1 h-5 bg-lilac rounded-full"></div>
                  <h3 className="font-heading text-xl font-black text-on-surface italic">Diretórios Core</h3>
                </div>

                <div className="space-y-6">
                   {[
                     { name: "Protocolos Clínicos", count: 48, icon: ShieldCheck, color: "text-lilac" },
                     { name: "Laudos Sensíveis", count: 124, icon: Folder, color: "text-emerald-500" },
                     { name: "Auditoria Jurídica", count: 12, icon: Folder, color: "text-amber-500" },
                     { name: "Arquivos de Base", count: 850, icon: Folder, color: "text-zinc-500" }
                   ].map((folder, k) => (
                     <div key={k} className="flex items-center justify-between p-5 bg-surface-container-highest/20 hover:bg-surface-container-highest/40 border border-outline-variant/5 rounded-[1.5rem] cursor-pointer group transition-all">
                        <div className="flex items-center gap-4">
                           <folder.icon size={20} className={cn("transition-all group-hover:scale-110", folder.color)} />
                           <span className="text-sm font-black text-on-surface/80 group-hover:text-on-surface transition-colors">{folder.name}</span>
                        </div>
                        <span className="px-2.5 py-1 bg-surface-container-highest/50 text-[10px] font-black text-zinc-500 rounded-lg group-hover:text-lilac transition-colors">{folder.count}</span>
                     </div>
                   ))}
                </div>

                <div className="mt-12 p-8 bg-lilac/5 rounded-[2rem] border border-lilac/10 relative overflow-hidden group/audit">
                   <div className="absolute inset-0 bg-gradient-to-br from-lilac/10 to-transparent"></div>
                   <div className="relative z-10 space-y-4">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-lilac/20 text-lilac rounded-lg animate-pulse"><Clock size={16}/></div>
                         <h5 className="text-[10px] font-black text-lilac uppercase tracking-[0.2em]">Auditoria de Integrity</h5>
                      </div>
                      <p className="text-[11px] text-zinc-500 font-medium italic leading-relaxed">
                         98.4% dos documentos neste diretório possuem assinatura digital <span className="text-on-surface font-bold">Vital Core</span> válida.
                      </p>
                      <button className="w-full py-3 bg-lilac/10 hover:bg-lilac/20 border border-lilac/20 text-lilac text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">Verificar Repositório</button>
                   </div>
                </div>
             </section>
          </aside>
        </div>
      </div>
    </>
  );
}
