"use client";

import React, { useEffect } from "react";
import { AlertCircle, RotateCcw, Home, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Critical System Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center space-y-12 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/10 blur-[120px] rounded-full animate-pulse"></div>
      
      <div className="relative z-10 space-y-8 max-w-2xl">
        <div className="flex flex-col items-center gap-6">
          <div className="w-24 h-24 rounded-[2.5rem] bg-red-500/10 border border-red-500/20 flex items-center justify-center relative group">
            <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <ShieldAlert size={48} className="text-red-500 animate-bounce" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="w-2 h-8 bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.4)]" />
              <h1 className="font-heading text-5xl font-black tracking-tighter italic text-white uppercase">
                Anomalia de <span className="text-red-500">Sistema</span>
              </h1>
            </div>
            <p className="text-zinc-400 font-medium leading-relaxed text-lg italic">
              O ecossistema VitalFlow detectou uma falha crítica na execução do protocolo.
            </p>
          </div>
        </div>

        {/* Error Details */}
        <div className="bg-zinc-900/40 border border-red-500/10 rounded-[2rem] p-8 backdrop-blur-md">
          <div className="flex items-start gap-4 text-left">
            <AlertCircle size={24} className="text-red-400 shrink-0 mt-1" />
            <div className="space-y-2">
              <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Diagnóstico Técnico</p>
              <p className="text-sm font-mono text-zinc-300 break-all leading-relaxed">
                {error.message || "Erro desconhecido durante o processamento do módulo."}
              </p>
              {error.digest && (
                <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter mt-2">
                  ID de Auditoria: {error.digest}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white text-black text-xs font-black uppercase tracking-widest shadow-xl shadow-white/5 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <RotateCcw size={16} />
            Reiniciar Protocolo
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full sm:w-auto px-10 py-5 rounded-2xl border border-zinc-800 text-zinc-400 text-xs font-black uppercase tracking-widest hover:bg-zinc-900 transition-all flex items-center justify-center gap-3"
          >
            <Home size={16} />
            Terminal Base
          </button>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-12 flex items-center gap-2 opacity-30 group">
        <div className="w-1.5 h-1.5 bg-red-500 rounded-full group-hover:animate-ping"></div>
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] italic transition-colors group-hover:text-red-500">
          Emergency Mode • MedCore V2
        </p>
      </div>
    </div>
  );
}
