"use client";

import React from "react";
import { PinSettings } from "@/modules/auth/components/PinSettings";
import { Shield, User, Bell, Palette, Camera, Globe, Monitor, Moon, Sun, Smartphone, Heart, ChevronRight } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto pb-24 space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-outline-variant/30 pb-8">
        <h1 className="text-4xl font-black text-on-surface font-heading italic tracking-tighter">Configurações</h1>
        <p className="text-on-surface-variant font-medium opacity-70">Gerencie sua segurança, preferências e identidade profissional em um só lugar.</p>
      </div>

      <div className="grid grid-cols-1 gap-16">
        
        {/* Profile Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <User size={20} />
            </div>
            <h2 className="text-xl font-black text-on-surface font-heading italic">Perfil Profissional</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-surface-container-low border border-outline-variant/30 rounded-[2.5rem] p-8 md:p-10">
            <div className="flex flex-col items-center md:items-start gap-6">
              <div className="relative group">
                <img 
                  src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop" 
                  alt="Dr. Alistair Thorne" 
                  className="w-32 h-32 rounded-[2rem] object-cover ring-4 ring-surface-container shadow-2xl transition-all group-hover:scale-105"
                />
                <button className="absolute -bottom-2 -right-2 p-3 bg-primary text-white rounded-2xl shadow-lg border-4 border-surface shadow-primary/30 hover:scale-110 transition-all">
                  <Camera size={18} />
                </button>
              </div>
              <div className="space-y-1 text-center md:text-left">
                <p className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-1">CRM/SP 123456</p>
                <h3 className="text-2xl font-black text-on-surface font-heading italic">Dr. Alistair Thorne</h3>
                <p className="text-xs text-on-surface-variant font-medium">Médico Diretor - Unidade Central</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block ml-1">E-mail Corporativo</label>
                <input type="text" defaultValue="thorne@medcore.com" className="w-full bg-surface-container-highest/50 border border-outline-variant/30 rounded-2xl py-3 px-4 text-sm font-medium focus:border-primary/50 focus:ring-0 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block ml-1">Especialidade Principal</label>
                <input type="text" defaultValue="Neurocirurgia Executiva" className="w-full bg-surface-container-highest/50 border border-outline-variant/30 rounded-2xl py-3 px-4 text-sm font-medium focus:border-primary/50 focus:ring-0 transition-all" />
              </div>
              <div className="pt-4">
                <button className="px-6 py-3 bg-on-surface text-surface rounded-2xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all">Atualizar Dados</button>
              </div>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
              <Shield size={20} />
            </div>
            <h2 className="text-xl font-black text-on-surface font-heading italic">Segurança & Autenticação</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-surface-container-low border border-outline-variant/30 rounded-[2.5rem] p-1 overflow-hidden">
                <PinSettings />
             </div>
             
             <div className="bg-surface-container-low border border-outline-variant/30 rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-black text-on-surface italic tracking-tight">Login por Biometria</h4>
                      <p className="text-[10px] text-on-surface-variant font-medium">FaceID ou Impressão Digital</p>
                    </div>
                    <div className="w-10 h-5 bg-primary/20 rounded-full relative p-1 cursor-pointer">
                      <div className="w-3 h-3 bg-primary rounded-full translate-x-5 transition-transform"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between opacity-50">
                    <div>
                      <h4 className="text-sm font-black text-on-surface italic tracking-tight">Autenticação em 2 Etapas</h4>
                      <p className="text-[10px] text-on-surface-variant font-medium">Via App ou SMS</p>
                    </div>
                    <div className="w-10 h-5 bg-zinc-800 rounded-full relative p-1 cursor-not-allowed">
                      <div className="w-3 h-3 bg-zinc-600 rounded-full transition-transform"></div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-8 border-t border-outline-variant/20">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-4">Dispositivos Conectados</p>
                  <div className="flex items-center justify-between text-xs font-medium text-on-surface-variant">
                    <span className="flex items-center gap-2 italic"><Smartphone size={14} /> iPhone 15 Pro (Este)</span>
                    <span className="text-emerald-500 font-black tracking-widest uppercase text-[9px]">Ativo</span>
                  </div>
                </div>
             </div>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
              <Bell size={20} />
            </div>
            <h2 className="text-xl font-black text-on-surface font-heading italic">Notificações & Alertas</h2>
          </div>
          
          <div className="bg-surface-container-low border border-outline-variant/30 rounded-[2.5rem] p-8 md:p-10">
            <div className="space-y-6">
              {[
                { title: "Alertas Críticos de CTI", desc: "Notificações push em tempo real para emergências setoriais.", enabled: true },
                { title: "Relatórios de IA", desc: "Resumos executivos gerados pelo CORE a cada final de turno.", enabled: true },
                { title: "Demandas Jurídicas", desc: "Atualizações sobre novos processos ou movimentações críticas.", enabled: false },
                { title: "Status do Sistema", desc: "Informações sobre períodos de manutenção ou degradação.", enabled: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between pb-6 border-b border-outline-variant/20 last:border-0 last:pb-0">
                  <div>
                    <h4 className="text-sm font-black text-on-surface italic tracking-tight">{item.title}</h4>
                    <p className="text-[10px] text-on-surface-variant font-medium opacity-70">{item.desc}</p>
                  </div>
                  <div className={cn(
                    "w-10 h-5 rounded-full relative p-1 cursor-pointer transition-colors",
                    item.enabled ? "bg-primary/20" : "bg-zinc-800"
                  )}>
                    <div className={cn(
                      "w-3 h-3 rounded-full transition-all",
                      item.enabled ? "bg-primary translate-x-5" : "bg-zinc-600 translate-x-0"
                    )}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* System & Appearance */}
        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
              <Palette size={20} />
            </div>
            <h2 className="text-xl font-black text-on-surface font-heading italic">Sistema & Aparência</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-surface-container-low border border-outline-variant/30 rounded-[2.5rem] p-8 md:p-10 space-y-6">
              <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">Modo Visual</h4>
              <div className="grid grid-cols-3 gap-3">
                <button className="flex flex-col items-center gap-2 p-3 bg-surface-container-highest border-2 border-primary rounded-2xl group transition-all">
                   <div className="w-Full h-10 bg-surface rounded-lg mb-1 flex items-center justify-center text-on-surface opacity-50 group-hover:opacity-100 transition-opacity">
                     <Sun size={16} />
                   </div>
                   <span className="text-[9px] font-black uppercase tracking-widest text-primary">Light</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-3 bg-surface-container border-2 border-transparent hover:border-outline-variant/40 rounded-2xl group transition-all">
                   <div className="w-Full h-10 bg-zinc-950 rounded-lg mb-1 flex items-center justify-center text-zinc-500 opacity-50 group-hover:opacity-100 transition-opacity">
                     <Moon size={16} />
                   </div>
                   <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Dark</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-3 bg-surface-container border-2 border-transparent hover:border-outline-variant/40 rounded-2xl group transition-all">
                   <div className="w-Full h-10 bg-gradient-to-br from-surface to-zinc-950 rounded-lg mb-1 flex items-center justify-center text-zinc-500 opacity-50 group-hover:opacity-100 transition-opacity">
                     <Monitor size={16} />
                   </div>
                   <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">System</span>
                </button>
              </div>
            </div>

            <div className="bg-surface-container-low border border-outline-variant/30 rounded-[2.5rem] p-8 md:p-10 space-y-6">
              <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">Idioma & Localidade</h4>
              <div className="space-y-4">
                 <button className="w-full flex items-center justify-between p-4 bg-surface-container border border-outline-variant/20 rounded-2xl hover:border-primary/30 transition-all group">
                   <div className="flex items-center gap-3">
                      <Globe size={18} className="text-zinc-500 group-hover:text-primary transition-colors" />
                      <div>
                        <p className="text-xs font-black text-on-surface italic">Português (Brasil)</p>
                        <p className="text-[9px] text-on-surface-variant font-medium">UTC -03:00</p>
                      </div>
                   </div>
                   <ChevronRight size={14} className="text-zinc-500" />
                 </button>
              </div>
            </div>
          </div>
        </section>

        {/* Action Footer */}
        <div className="pt-12 border-t border-outline-variant/30 flex justify-end gap-4">
          <button className="px-8 py-4 text-zinc-500 text-xs font-black uppercase tracking-widest hover:text-on-surface transition-colors">Descartar Alterações</button>
          <button className="px-8 py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20">Salvar Preferências Mentais</button>
        </div>
      </div>
    </div>
  );
}
