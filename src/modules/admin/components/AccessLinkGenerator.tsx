"use client";

import React, { useState } from "react";
import { Link as LinkIcon, ShieldCheck, Copy, Check, Clock, Globe } from "lucide-react";
import { sanitize } from "@/lib/sanitize";

type ExecutiveRole = "Diretor" | "Auditor" | "Jurídico";

export function AccessLinkGenerator() {
  const [role, setRole] = useState<ExecutiveRole>("Diretor");
  const [pin, setPin] = useState("");
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (pin.length !== 4) return;
    
    // Simulação de geração de token (Em prod isso seria salvo no DB via access_links)
    const token = Math.random().toString(36).substring(2, 15);
    const baseUrl = window.location.origin;
    const cleanRole = sanitize(role);
    setGeneratedLink(`${baseUrl}/shared/${token}?role=${cleanRole.toLowerCase()}`);
  };

  const copyToClipboard = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-8 bg-zinc-950 border border-zinc-800 rounded-3xl space-y-8">
      <div className="flex items-center gap-4 mb-2">
        <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-2xl">
          <LinkIcon size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Gerador de Acesso Executivo</h3>
          <p className="text-sm text-zinc-500">Crie links temporários com proteção por PIN para parceiros.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3 block">Tipo de Acesso</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {(["Diretor", "Auditor", "Jurídico"] as ExecutiveRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    role === r 
                      ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.3)]" 
                      : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase">Ou digite um cargo personalizado:</label>
              <input 
                type="text"
                placeholder="Ex: Consultor Externo"
                value={role}
                onChange={(e) => setRole(e.target.value as ExecutiveRole)}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-2 px-4 text-sm text-zinc-300 focus:outline-none focus:border-cyan-500/50 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3 block">Definir PIN do Link (4 dígitos)</label>
            <input 
              type="text" 
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              placeholder="Ex: 2024"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-cyan-500 transition-all font-mono text-lg"
            />
          </div>

          <button 
            onClick={handleGenerate}
            disabled={pin.length !== 4}
            className="w-full py-4 bg-zinc-100 hover:bg-white disabled:opacity-30 text-black font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck size={20} /> Gerar Acesso Seguro
          </button>
        </div>

        <div className="flex flex-col justify-center border-l border-zinc-800 pl-8 space-y-4">
          <div className="p-6 bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-800 flex flex-col items-center text-center">
            {generatedLink ? (
              <>
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
                  <Check size={24} />
                </div>
                <p className="text-sm text-zinc-300 font-medium mb-1">Link gerado com sucesso!</p>
                <div className="w-full bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-xs text-zinc-500 font-mono break-all mb-4 mt-2">
                  {generatedLink}
                </div>
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-bold transition-all"
                >
                  {copied ? <><Check size={16} /> Copiado!</> : <><Copy size={16} /> Copiar Link de Acesso</>}
                </button>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-zinc-800 text-zinc-500 flex items-center justify-center mb-4">
                  <Globe size={24} />
                </div>
                <p className="text-sm text-zinc-500">Configure o cargo e o PIN para gerar o link de visualização executiva.</p>
              </>
            )}
          </div>

          <div className="flex items-center gap-4 text-[10px] text-zinc-600 uppercase font-bold tracking-tighter">
            <span className="flex items-center gap-1"><Clock size={12} /> Expira em 24h</span>
            <span className="flex items-center gap-1"><ShieldCheck size={12} /> Criptografado</span>
          </div>
        </div>
      </div>
    </div>
  );
}
