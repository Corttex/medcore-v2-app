"use client";

import React, { useState } from "react";
import { Link2, Copy, CheckCircle2, UserPlus, Clock } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function AccessLinkGenerator() {
  const [role, setRole] = useState("executive");
  const [duration, setDuration] = useState("24h");
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    // Simulando a geração do link de acesso
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const link = `${window.location.origin}/invite?token=${token}`;
    setGeneratedLink(link);
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-surface-container-low border border-outline-variant/30 rounded-[2.5rem] p-10 space-y-8">
      <div className="space-y-2">
        <h3 className="text-2xl font-black text-on-surface font-heading tracking-tight italic flex items-center gap-3">
          <Link2 className="text-primary" /> Gerador de Acessos
        </h3>
        <p className="text-xs text-zinc-500 font-medium italic">
          Crie links temporários de acesso para novos membros ou consultores externos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
            <UserPlus size={12} /> Nível de Acesso
          </label>
          <select 
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-xl p-3 text-sm font-medium text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none"
          >
            <option value="executive">Executivo (Acesso Premium)</option>
            <option value="manager">Gerente (Gestão Operacional)</option>
            <option value="employee">Funcionário (Acesso Padrão)</option>
            <option value="viewer">Visualizador (Apenas Leitura)</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
            <Clock size={12} /> Duração do Convite
          </label>
          <select 
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-xl p-3 text-sm font-medium text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none"
          >
            <option value="12h">12 Horas</option>
            <option value="24h">24 Horas</option>
            <option value="7d">7 Dias</option>
            <option value="30d">30 Dias</option>
          </select>
        </div>
      </div>

      <button 
        onClick={handleGenerate}
        className="px-6 py-3 bg-primary text-on-primary rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
      >
        <Link2 size={16} />
        Gerar Link de Acesso
      </button>

      {generatedLink && (
        <div className="mt-6 p-4 bg-surface-container border border-primary/20 rounded-xl flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2">
          <div className="overflow-hidden">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Link Gerado com Sucesso</p>
            <p className="text-sm font-medium text-on-surface truncate font-mono bg-surface-container-highest/50 p-2 rounded-lg inline-block">
              {generatedLink}
            </p>
          </div>
          <button 
            onClick={handleCopy}
            className={cn(
              "p-3 rounded-xl transition-all flex items-center justify-center shrink-0",
              copied 
                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                : "bg-surface-container-highest text-zinc-400 hover:text-on-surface border border-outline-variant/20"
            )}
          >
            {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
          </button>
        </div>
      )}
    </div>
  );
}
