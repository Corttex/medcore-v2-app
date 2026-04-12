"use client";

import React, { useState } from "react";
import { Lock, Save, Loader2, AlertCircle } from "lucide-react";
import { authService } from "../services/authService";

export function PinSettings() {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4) return setError("O PIN deve ter 4 dígitos.");
    if (pin !== confirmPin) return setError("Os PINs não coincidem.");

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await authService.updatePin(pin);
      setSuccess(true);
      setPin("");
      setConfirmPin("");
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar PIN");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-8 bg-zinc-950 border border-zinc-800 rounded-3xl max-w-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-teal-500/10 text-teal-400 rounded-xl">
          <Lock size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">PIN de Segurança</h3>
          <p className="text-xs text-zinc-500">Usado para acessar áreas de auditoria e relatórios.</p>
        </div>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 text-sm flex items-center gap-2">
          <Save size={16} /> PIN atualizado com sucesso!
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 block">Novo PIN (4 dígitos)</label>
            <input 
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              placeholder="••••"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-center text-xl tracking-[1em] text-white focus:outline-none focus:border-teal-500 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 block">Confirmar PIN</label>
            <input 
              type="password"
              maxLength={4}
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
              placeholder="••••"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-center text-xl tracking-[1em] text-white focus:outline-none focus:border-teal-500 transition-all"
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading || pin.length !== 4}
          className="w-full py-3.5 bg-zinc-100 hover:bg-white disabled:opacity-50 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : "Salvar Novo PIN"}
        </button>
      </form>
    </section>
  );
}
