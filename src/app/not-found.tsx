"use client";

import React from "react";
import { Search, Home, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center space-y-12 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/10 blur-[120px] rounded-full animate-pulse"></div>
      
      <div className="relative z-10 space-y-8 max-w-2xl">
        <div className="flex flex-col items-center gap-6">
          <div className="w-32 h-32 relative group">
            <div className="absolute inset-0 bg-brand/20 blur-3xl rounded-full animate-pulse"></div>
            <div className="w-full h-full rounded-[3rem] bg-zinc-900/50 border border-brand/20 flex items-center justify-center relative z-10 backdrop-blur-xl">
               <span className="text-6xl font-black italic text-brand tracking-tighter">404</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="w-2 h-8 bg-brand rounded-full shadow-[0_0_15px_rgba(167,139,250,0.4)]" />
              <h1 className="font-heading text-5xl font-black tracking-tighter italic text-white uppercase">
                Destino <span className="text-brand">Inexistente</span>
              </h1>
            </div>
            <p className="text-zinc-400 font-medium leading-relaxed text-lg italic">
              O módulo solicitado não foi localizado no diretório central da rede VitalFlow.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-brand text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-brand/25 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <ArrowLeft size={16} />
            Retornar
          </button>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="w-full sm:w-auto px-10 py-5 rounded-2xl border border-zinc-800 text-zinc-400 text-xs font-black uppercase tracking-widest hover:bg-zinc-900 transition-all flex items-center justify-center gap-3"
          >
            <Home size={16} />
            Dashboard Central
          </button>
        </div>
      </div>

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      
      {/* Footer Branding */}
      <div className="absolute bottom-12 flex items-center gap-2 opacity-30 group">
        <div className="w-1.5 h-1.5 bg-brand rounded-full group-hover:animate-ping"></div>
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] italic transition-colors group-hover:text-brand">
          Network Status • 404 Localized
        </p>
      </div>
    </div>
  );
}
