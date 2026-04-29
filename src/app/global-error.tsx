"use client";

import React from "react";
import { ShieldAlert, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="bg-black text-white min-h-screen flex items-center justify-center p-6 text-center">
        <div className="space-y-8 max-w-xl">
          <div className="flex flex-col items-center gap-6">
            <div className="w-24 h-24 rounded-[2.5rem] bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <ShieldAlert size={48} className="text-red-500" />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl font-black tracking-tighter italic uppercase">
                Erro Fatal de <span className="text-red-500">Núcleo</span>
              </h1>
              <p className="text-zinc-400 font-medium leading-relaxed italic">
                Ocorreu uma falha no carregamento dos componentes fundamentais do sistema.
              </p>
            </div>
          </div>

          <button
            onClick={() => reset()}
            className="px-10 py-5 rounded-2xl bg-white text-black text-xs font-black uppercase tracking-widest shadow-xl shadow-white/5 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 mx-auto"
          >
            <RotateCcw size={16} />
            Tentar Recuperação Force
          </button>
        </div>
      </body>
    </html>
  );
}
