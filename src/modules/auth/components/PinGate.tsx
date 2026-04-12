"use client";

import React, { useState } from "react";
import { Lock, ShieldCheck, Loader2, X } from "lucide-react";
import { authService } from "../services/authService";

interface PinGateProps {
  onSuccess: () => void;
  onCancel?: () => void;
  title?: string;
}

export function PinGate({ onSuccess, onCancel, title = "Acesso Restrito" }: PinGateProps) {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4) return;

    setLoading(true);
    setError(null);

    try {
      const result = await authService.verifyPin(pin);
      if (result.success) {
        onSuccess();
      } else {
        setError(result.message || "PIN incorreto");
        setPin("");
      }
    } catch (err: any) {
      setError("Erro ao validar PIN");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-zinc-950 border border-zinc-800 p-8 rounded-3xl shadow-2xl relative">
        {onCancel && (
          <button onClick={onCancel} className="absolute top-4 right-4 text-zinc-500 hover:text-white">
            <X size={20} />
          </button>
        )}

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-400 mb-6 border border-teal-500/20">
            <Lock size={32} />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
          <p className="text-zinc-500 text-sm mb-8">Digite seu PIN de 4 dígitos para continuar.</p>

          <form onSubmit={handleVerify} className="w-full space-y-6">
            <div className="flex justify-center gap-3">
              {[0, 1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className={`w-12 h-16 rounded-xl border flex items-center justify-center text-2xl font-bold transition-all ${
                    pin.length > i ? "border-teal-500 bg-teal-500/5 text-teal-400" : "border-zinc-800 bg-zinc-900 text-zinc-600"
                  }`}
                >
                  {pin.length > i ? "•" : ""}
                </div>
              ))}
            </div>

            <input 
              type="password"
              maxLength={4}
              autoFocus
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              className="absolute opacity-0 pointer-events-none"
            />

            {error && <p className="text-red-500 text-xs text-center animate-shake">{error}</p>}

            <button 
              type="submit"
              disabled={loading || pin.length !== 4}
              className="w-full py-4 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-black font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(45,212,191,0.2)] flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <><ShieldCheck size={20} /> Desbloquear</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
