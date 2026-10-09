"use client";

import React, { useState } from "react";
import { Lock, ShieldAlert, ArrowRight, Loader2 } from "lucide-react";
import { authService } from "@/features/authentication/authService";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function AdminGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (pin.length !== 6) {
      setError("O PIN deve conter exatamente 6 dígitos.");
      return;
    }

    setLoading(true);
    try {
      await authService.verifyPin(pin);
      setUnlocked(true);
    } catch (err: any) {
      setError(err.message || "PIN incorreto. Acesso negado.");
    } finally {
      setLoading(false);
    }
  };

  if (unlocked) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center animate-in fade-in zoom-in duration-500">
      <div className="w-full max-w-md p-8 bg-surface-container-low border border-outline-variant/30 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
        <div className="absolute -top-[20%] -right-[20%] w-[60%] h-[60%] bg-error/5 rounded-full blur-[80px]"></div>

        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-error/10 text-error rounded-full flex items-center justify-center border border-error/20 relative">
            <div className="absolute inset-0 rounded-full border border-error/30 animate-ping opacity-20"></div>
            <Lock size={32} />
          </div>
        </div>

        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl font-black font-heading text-on-surface italic tracking-tight">
            Acesso <span className="text-error">Restrito</span>
          </h2>
          <p className="text-sm text-zinc-500 font-medium italic">
            Área de Controle Máximo. Insira seu PIN operacional para liberar os dados.
          </p>
        </div>

        <form onSubmit={handleUnlock} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-sm font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <ShieldAlert size={12} className="text-error" /> PIN de Segurança
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              placeholder="••••••"
              disabled={loading}
              className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-2xl p-4 text-center text-3xl font-black text-on-surface tracking-[0.5em] focus:border-error focus:ring-1 focus:ring-error outline-none transition-all placeholder:text-zinc-700"
            />
          </div>

          {error && (
            <p className="text-xs text-error font-bold text-center animate-in slide-in-from-top-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || pin.length !== 6}
            className="w-full flex items-center justify-center gap-2 py-4 bg-error text-white rounded-2xl font-bold text-sm hover:bg-error/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed group/btn"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                LIBERAR ACESSO 
                <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
