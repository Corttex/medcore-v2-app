"use client";

import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";

interface PatrimonioFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function PatrimonioForm({ isOpen, onClose, onSuccess }: PatrimonioFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    codigoTag: "",
    nome: "",
    categoria: "Equipamento Médico",
    localizacao: "",
    estado: "Bom",
    marca: "",
    modelo: "",
    numeroSerie: "",
    fornecedor: "",
    garantiaFim: "",
    observacoes: "",
    dataAquisicao: "",
    valorAquisicao: ""
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/patrimonio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erro ao cadastrar patrimônio");
      }
      
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error(error);
      alert(error.message);
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
          <h2 className="font-heading text-2xl font-semibold text-white">Cadastrar Patrimônio</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
            <X size={16} />
          </button>
        </div>

        <form id="patrimonio-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Código / TAG *</label>
              <input 
                required
                type="text"
                placeholder="Ex: MED-2026-001"
                className={inputClass}
                value={formData.codigoTag}
                onChange={e => setFormData({ ...formData, codigoTag: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Categoria *</label>
              <select 
                required
                className={inputClass}
                value={formData.categoria}
                onChange={e => setFormData({ ...formData, categoria: e.target.value })}
              >
                <option value="Equipamento Médico" className="bg-zinc-800">Equipamento Médico</option>
                <option value="T.I. / Eletrônicos" className="bg-zinc-800">T.I. / Eletrônicos</option>
                <option value="Mobiliário" className="bg-zinc-800">Mobiliário</option>
                <option value="Veículos" className="bg-zinc-800">Veículos</option>
                <option value="Outros" className="bg-zinc-800">Outros</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Nome do Equipamento/Bem *</label>
            <input 
              required
              type="text"
              placeholder="Ex: Aparelho de Ultrassom Portátil"
              className={inputClass}
              value={formData.nome}
              onChange={e => setFormData({ ...formData, nome: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Marca</label>
              <input 
                type="text"
                placeholder="Ex: GE Healthcare"
                className={inputClass}
                value={formData.marca}
                onChange={e => setFormData({ ...formData, marca: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Modelo</label>
              <input 
                type="text"
                placeholder="Ex: Voluson E10"
                className={inputClass}
                value={formData.modelo}
                onChange={e => setFormData({ ...formData, modelo: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Nº de Série</label>
              <input 
                type="text"
                placeholder="Ex: SN-902381"
                className={inputClass}
                value={formData.numeroSerie}
                onChange={e => setFormData({ ...formData, numeroSerie: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Data de Aquisição</label>
              <input 
                type="date"
                className={inputClass}
                value={formData.dataAquisicao}
                onChange={e => setFormData({ ...formData, dataAquisicao: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Valor (R$)</label>
              <input 
                type="number"
                step="0.01"
                placeholder="Ex: 150000.00"
                className={inputClass}
                value={formData.valorAquisicao}
                onChange={e => setFormData({ ...formData, valorAquisicao: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Término da Garantia</label>
              <input 
                type="date"
                className={inputClass}
                value={formData.garantiaFim}
                onChange={e => setFormData({ ...formData, garantiaFim: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Fornecedor</label>
              <input 
                type="text"
                placeholder="Ex: MedTech Solutions"
                className={inputClass}
                value={formData.fornecedor}
                onChange={e => setFormData({ ...formData, fornecedor: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Localização (Setor/Sala)</label>
              <input 
                type="text"
                placeholder="Ex: Consultório 1"
                className={inputClass}
                value={formData.localizacao}
                onChange={e => setFormData({ ...formData, localizacao: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Estado de Conservação</label>
              <select 
                className={inputClass}
                value={formData.estado}
                onChange={e => setFormData({ ...formData, estado: e.target.value })}
              >
                <option value="Novo" className="bg-zinc-800">Novo</option>
                <option value="Bom" className="bg-zinc-800">Bom</option>
                <option value="Regular" className="bg-zinc-800">Regular</option>
                <option value="Ruim" className="bg-zinc-800">Ruim</option>
                <option value="Necessita Reparo" className="bg-zinc-800">Necessita Reparo</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className={labelClass}>Observações</label>
            <textarea 
              rows={3}
              placeholder="Notas adicionais, informações de contrato, etc."
              className={`${inputClass} resize-none`}
              value={formData.observacoes}
              onChange={e => setFormData({ ...formData, observacoes: e.target.value })}
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
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Salvar Patrimônio"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
