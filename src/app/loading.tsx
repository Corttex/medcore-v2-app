"use client";

import React from "react";
import { BrainCircuit } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center space-y-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/5 blur-[120px] rounded-full"></div>
      
      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="relative">
          <div className="absolute inset-0 bg-brand/20 blur-3xl rounded-full animate-pulse"></div>
          <div className="w-20 h-20 rounded-3xl bg-zinc-900 border border-brand/20 flex items-center justify-center relative z-10">
             <BrainCircuit size={40} className="text-brand animate-pulse" />
          </div>
          
          {/* Circular Loader */}
          <div className="absolute -inset-4 w-28 h-28 border border-brand/30 rounded-full border-t-transparent animate-spin"></div>
        </div>
        
        <div className="space-y-3">
          <h2 className="font-heading text-xl font-black italic tracking-tighter text-white uppercase flex items-center justify-center gap-3">
            Sincronizando <span className="text-brand animate-pulse">Rede VitalFlow</span>
          </h2>
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] italic animate-pulse">
            Acessando Base de Dados Supabase • Criptografia Ativa
          </p>
        </div>
      </div>
    </div>
  );
}
