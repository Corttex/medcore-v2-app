"use client";

import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";

interface OSFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function OSForm({ isOpen, onClose, onSuccess }: OSFormProps) {
  const [loading, setLoading] = useState(false);
  const [patrimonios, setPatrimonios] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    categoria: "Manutenção Predial",
    descricao: "",
    prioridade: "Normal",
    patrimonioId: "",
    prazoSLA: "",
    valorCusto: "",
  });

  React.useEffect(() => {
    if (isOpen) {
      fetch("/api/patrimonio").then(r => r.json()).then(setPatrimonios).catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/os", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Erro ao criar OS");
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Falha ao abrir OS");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-black/20 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:border-[var(--color-rd-cyan)] focus:ring-1 focus:ring-[var(--color-rd-cyan)] focus:outline-none transition-all shadow-inner [color-scheme:dark]";
  const labelClass = "text-sm font-bold text-zinc-300 uppercase tracking-[0.15em] mb-2 block ml-1";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900/80 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] w-full max-w-2xl p-8 space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto backdrop-blur-2xl">
        
        <div className="flex items-center justify-between shrink-0 mb-4">
          <h2 className="font-heading text-2xl font-semibold text-white">Nova Ordem de Serviço</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Categoria *</label>
              <select 
                required
                className={inputClass}
                value={formData.categoria}
                onChange={e => setFormData({ ...formData, categoria: e.target.value })}
              >
                <option value="Manutenção Predial" className="bg-zinc-800">Manutenção Predial</option>
                <option value="Equipamento Médico" className="bg-zinc-800">Equipamento Médico</option>
                <option value="T.I. e Sistemas" className="bg-zinc-800">T.I. e Sistemas</option>
                <option value="Limpeza e Higienização" className="bg-zinc-800">Limpeza e Higienização</option>
                <option value="Outros" className="bg-zinc-800">Outros</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Equipamento (Opcional)</label>
              <select 
                className={inputClass}
                value={formData.patrimonioId}
                onChange={e => setFormData({ ...formData, patrimonioId: e.target.value })}
              >
                <option value="" className="bg-zinc-800">-- Nenhum --</option>
                {patrimonios.map(p => (
                  <option key={p.id} value={p.id} className="bg-zinc-800">{p.nome} (Tag: {p.codigoTag})</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Prioridade</label>
            <div className="flex gap-2">
              {["Baixa", "Normal", "Alta", "Crítica"].map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFormData({ ...formData, prioridade: p })}
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all border ${
                    formData.prioridade === p 
                    ? "bg-[var(--color-rd-cyan)]/20 border-[var(--color-rd-cyan)]/50 text-[var(--color-rd-cyan)]"
                    : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Prazo SLA (Opcional)</label>
              <input 
                type="datetime-local"
                className={inputClass}
                value={formData.prazoSLA}
                onChange={e => setFormData({ ...formData, prazoSLA: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Custo Estimado (R$)</label>
              <input 
                type="number"
                step="0.01"
                placeholder="Ex: 150.00"
                className={inputClass}
                value={formData.valorCusto}
                onChange={e => setFormData({ ...formData, valorCusto: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Descrição do Problema *</label>
            <textarea 
              required
              rows={4}
              placeholder="Descreva o que está acontecendo..."
              className={`${inputClass} resize-none`}
              value={formData.descricao}
              onChange={e => setFormData({ ...formData, descricao: e.target.value })}
            />
          </div>

          <div className="flex gap-4 pt-4 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-white/10 bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 text-sm font-semibold transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-gradient py-3 rounded-xl text-sm font-semibold shadow-[0_0_20px_rgba(45,212,191,0.4)] hover:shadow-[0_0_30px_rgba(45,212,191,0.6)] flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Abrir Chamado"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
