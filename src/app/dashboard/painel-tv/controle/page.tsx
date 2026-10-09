"use client";

import React, { useState } from "react";
import { Megaphone, Plus, MonitorPlay, Check, Clock } from "lucide-react";
import { toast } from "react-hot-toast";

const MOCK_GUICHES = ["Consultório 1", "Consultório 2", "Consultório 3", "Recepção", "Triagem"];
const MOCK_RECENT_CALLS = [
  { id: 1, senha: "Maria Fernanda Silva", guiche: "Consultório 3", time: "Agora", status: "CHAMANDO" },
  { id: 2, senha: "Pedro Henrique Costa", guiche: "Recepção", time: "Há 5 min", status: "FINALIZADO" },
];

export default function PainelControlePage() {
  const [senhaOuNome, setSenhaOuNome] = useState("");
  const [guiche, setGuiche] = useState(MOCK_GUICHES[0]);
  const [isCalling, setIsCalling] = useState(false);

  const handleCall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senhaOuNome.trim()) {
      toast.error("Preencha a senha ou nome do paciente");
      return;
    }
    
    setIsCalling(true);
    // Simulate API call
    setTimeout(() => {
      toast.success(`${senhaOuNome} chamado(a) no ${guiche}`);
      setSenhaOuNome("");
      setIsCalling(false);
    }, 800);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 pt-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-on-surface flex items-center gap-2">
            <MonitorPlay className="text-rd-cyan" size={28} />
            Controle do Painel de TV
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">Acione senhas ou nomes de pacientes para aparecerem na TV da recepção.</p>
        </div>
        
        <a href="/dashboard/painel-tv" target="_blank" className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-xl text-sm font-semibold hover:bg-surface-container transition-colors">
          Abrir Painel TV
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Formulário de Chamada */}
        <div className="md:col-span-1 bg-surface border border-outline-variant rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-heading font-bold text-on-surface mb-4 flex items-center gap-2">
            <Megaphone className="text-rd-cyan" size={20} />
            Nova Chamada
          </h2>

          <form onSubmit={handleCall} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1.5">
                Senha ou Nome
              </label>
              <input
                type="text"
                placeholder="Ex: A015 ou João da Silva"
                className="w-full bg-surface-container/50 border border-outline-variant rounded-xl px-4 py-3 text-on-surface outline-none focus:border-rd-cyan transition-colors"
                value={senhaOuNome}
                onChange={(e) => setSenhaOuNome(e.target.value)}
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1.5">
                Guichê / Local
              </label>
              <select
                className="w-full bg-surface-container/50 border border-outline-variant rounded-xl px-4 py-3 text-on-surface outline-none focus:border-rd-cyan transition-colors appearance-none"
                value={guiche}
                onChange={(e) => setGuiche(e.target.value)}
              >
                {MOCK_GUICHES.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isCalling || !senhaOuNome.trim()}
              className="w-full py-3.5 bg-rd-cyan text-zinc-950 font-bold rounded-xl hover:bg-rd-cyan/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-4 shadow-md shadow-rd-cyan/20"
            >
              {isCalling ? (
                <div className="w-5 h-5 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
              ) : (
                <Megaphone size={20} />
              )}
              Chamar na TV
            </button>
          </form>
        </div>

        {/* Histórico Recente */}
        <div className="md:col-span-2 bg-surface border border-outline-variant rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-outline-variant bg-surface-container/10">
            <h2 className="text-lg font-heading font-bold text-on-surface flex items-center gap-2">
              <Clock className="text-zinc-500" size={20} />
              Últimas Chamadas Realizadas
            </h2>
          </div>

          <div className="flex-1 overflow-auto p-0">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-container/30 sticky top-0">
                <tr className="border-b border-outline-variant/50 text-on-surface-variant">
                  <th className="px-6 py-3 text-xs uppercase font-bold tracking-wider">Identificação</th>
                  <th className="px-6 py-3 text-xs uppercase font-bold tracking-wider">Local</th>
                  <th className="px-6 py-3 text-xs uppercase font-bold tracking-wider">Tempo</th>
                  <th className="px-6 py-3 text-xs uppercase font-bold tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {MOCK_RECENT_CALLS.map(call => (
                  <tr key={call.id} className="hover:bg-surface-container/10 transition-colors">
                    <td className="px-6 py-4 font-bold text-on-surface">{call.senha}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{call.guiche}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{call.time}</td>
                    <td className="px-6 py-4 text-right">
                      {call.status === "CHAMANDO" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          Na Tela
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-500/10 text-zinc-500 text-xs font-bold uppercase">
                          <Check size={14} /> Finalizado
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
