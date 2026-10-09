"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Wrench, CheckCircle2, Clock, AlertCircle } from "lucide-react";

interface OrdemServico {
  id: string;
  protocolo: string;
  categoria: string;
  descricao: string;
  prioridade: string;
  status: string;
  createdAt: string;
  solicitante: { fullName: string } | null;
  responsavel: { fullName: string } | null;
  prazoSLA?: string;
  patrimonio?: { nome: string, localizacao: string } | null;
}

export function OSTable({ ordens, onStatusChange }: { ordens: OrdemServico[], onStatusChange: (id: string, status: string) => void }) {
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aberta": return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400";
      case "Em triagem": return "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400";
      case "Em atendimento": return "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";
      case "Resolvida":
      case "Encerrada": return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400";
      default: return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400";
    }
  };

  const getPriorityIcon = (prio: string) => {
    switch (prio) {
      case "Alta":
      case "Crítica": return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "Baixa": return <Clock className="w-4 h-4 text-zinc-400" />;
      default: return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
    }
  };

  const getSlaInfo = (createdAt: string, prazoSLA?: string, status?: string) => {
    if (!prazoSLA || status === "Resolvida" || status === "Encerrada") return null;
    const start = new Date(createdAt).getTime();
    const end = new Date(prazoSLA).getTime();
    const now = new Date().getTime();
    
    if (end <= start) return { progress: 100, color: "bg-red-500", text: "Expirado" };
    
    const progress = Math.min(Math.max(((now - start) / (end - start)) * 100, 0), 100);
    
    let color = "bg-green-500";
    let text = "No prazo";
    
    if (progress > 90) { color = "bg-red-500 animate-pulse"; text = "Crítico"; }
    else if (progress > 75) { color = "bg-orange-500"; text = "Atenção"; }
    
    return { progress, color, text };
  };

  return (
    <div className="bg-white dark:bg-surface border border-zinc-200 dark:border-white/5 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 dark:bg-white/5 border-b border-zinc-200 dark:border-white/5">
            <tr>
              <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-white">Protocolo</th>
              <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-white">Categoria</th>
              <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-white">Solicitante</th>
              <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-white">Prioridade</th>
              <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-white">Status</th>
              <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-white">Abertura</th>
              <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-white text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
            {ordens.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-zinc-500 dark:text-zinc-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Wrench className="w-8 h-8 text-zinc-300 dark:text-zinc-600 mb-2" />
                    <p>Nenhuma ordem de serviço encontrada.</p>
                  </div>
                </td>
              </tr>
            ) : (
              ordens.map(os => (
                <tr key={os.id} className="hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono font-medium text-[var(--color-rd-cyan)]">{os.protocolo}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-zinc-900 dark:text-white">{os.categoria}</p>
                    <p className="text-xs text-zinc-500 truncate max-w-[200px]">{os.descricao}</p>
                    {os.patrimonio && (
                      <p className="text-sm text-zinc-400 mt-1 uppercase tracking-wider font-semibold">
                        {os.patrimonio.nome}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                    {os.solicitante?.fullName || "Sistema"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 mb-2">
                      {getPriorityIcon(os.prioridade)}
                      <span className="text-zinc-700 dark:text-zinc-300 font-medium">{os.prioridade}</span>
                    </div>
                    {getSlaInfo(os.createdAt, os.prazoSLA, os.status) && (
                      <div className="w-full">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-zinc-500">SLA</span>
                          <span className="font-semibold" style={{ color: getSlaInfo(os.createdAt, os.prazoSLA, os.status)?.color.replace('bg-', '') }}>
                            {getSlaInfo(os.createdAt, os.prazoSLA, os.status)?.text}
                          </span>
                        </div>
                        <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full ${getSlaInfo(os.createdAt, os.prazoSLA, os.status)?.color}`} 
                            style={{ width: `${getSlaInfo(os.createdAt, os.prazoSLA, os.status)?.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center ${getStatusColor(os.status)}`}>
                      {os.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                    {format(new Date(os.createdAt), "dd MMM, HH:mm", { locale: ptBR })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <select 
                      className="bg-transparent text-xs border border-zinc-200 dark:border-white/10 rounded-md px-2 py-1 text-zinc-700 dark:text-zinc-300 outline-none focus:border-[var(--color-rd-cyan)]"
                      value={os.status}
                      onChange={(e) => onStatusChange(os.id, e.target.value)}
                    >
                      <option value="Aberta">Aberta</option>
                      <option value="Em triagem">Em triagem</option>
                      <option value="Em atendimento">Em atendimento</option>
                      <option value="Resolvida">Resolvida</option>
                      <option value="Encerrada">Encerrada</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
