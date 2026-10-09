"use client";

import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Box, CheckCircle2, AlertTriangle, AlertCircle, XCircle, QrCode } from "lucide-react";
import { PatrimonioPlaquetaModal } from "./PatrimonioPlaquetaModal";
import { useState } from "react";

interface Patrimonio {
  id: string;
  codigoTag: string;
  nome: string;
  categoria: string;
  localizacao: string | null;
  estado: string | null;
  status: string;
  createdAt: string;
}

export function PatrimonioTable({ patrimonios, onStatusChange }: { patrimonios: Patrimonio[], onStatusChange: (id: string, status: string) => void }) {
  const [plaquetaPatrimonio, setPlaquetaPatrimonio] = useState<Patrimonio | null>(null);

  const handleStatusChange = (id: string, newStatus: string) => {
    if (newStatus === "Em Manutenção") {
      const isConfirmed = window.confirm("Este equipamento impacta a agenda? Deseja enviar um alerta à recepção (Inbox CRM) para bloqueio da agenda e remarcação de consultas?");
      if (isConfirmed) {
        // Aqui enviaria um alerta para o backend. Para fins de UX do MVP, um alert de sucesso.
        window.alert("Alerta enviado para a Recepção com sucesso! A agenda será notificada.");
      }
    }
    onStatusChange(id, newStatus);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo": return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400";
      case "Em Manutenção": return "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400";
      case "Baixado": return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400";
      case "Inativo": return "bg-zinc-100 text-zinc-700 dark:bg-zinc-500/10 dark:text-zinc-400";
      default: return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Ativo": return <CheckCircle2 className="w-3.5 h-3.5 mr-1" />;
      case "Em Manutenção": return <AlertTriangle className="w-3.5 h-3.5 mr-1" />;
      case "Baixado": return <XCircle className="w-3.5 h-3.5 mr-1" />;
      default: return <AlertCircle className="w-3.5 h-3.5 mr-1" />;
    }
  };

  return (
    <div className="bg-white dark:bg-surface border border-zinc-200 dark:border-white/5 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 dark:bg-white/5 border-b border-zinc-200 dark:border-white/5">
            <tr>
              <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-white">TAG</th>
              <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-white">Equipamento</th>
              <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-white">Localização</th>
              <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-white">Estado</th>
              <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-white">Status</th>
              <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-white text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
            {patrimonios.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-zinc-500 dark:text-zinc-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Box className="w-8 h-8 text-zinc-300 dark:text-zinc-600 mb-2" />
                    <p>Nenhum patrimônio cadastrado.</p>
                  </div>
                </td>
              </tr>
            ) : (
              patrimonios.map(item => (
                <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono font-medium bg-zinc-100 dark:bg-white/10 px-2 py-1 rounded text-zinc-800 dark:text-zinc-200">
                      {item.codigoTag}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-zinc-900 dark:text-white">{item.nome}</p>
                    <p className="text-xs text-zinc-500">{item.categoria}</p>
                  </td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                    {item.localizacao || "-"}
                  </td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                    {item.estado || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center ${getStatusColor(item.status)}`}>
                      {getStatusIcon(item.status)}
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                    <button 
                      onClick={() => setPlaquetaPatrimonio(item)}
                      className="p-1.5 text-zinc-500 hover:text-[var(--color-rd-cyan)] bg-zinc-100 dark:bg-white/5 rounded transition-colors"
                      title="Imprimir Plaqueta"
                    >
                      <QrCode size={16} />
                    </button>
                    <select 
                      className="bg-transparent text-xs border border-zinc-200 dark:border-white/10 rounded-md px-2 py-1 text-zinc-700 dark:text-zinc-300 outline-none focus:border-[var(--color-rd-cyan)]"
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                    >
                      <option value="Ativo">Ativo</option>
                      <option value="Em Manutenção">Em Manutenção</option>
                      <option value="Inativo">Inativo</option>
                      <option value="Baixado">Baixado</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {plaquetaPatrimonio && (
        <PatrimonioPlaquetaModal 
          patrimonio={plaquetaPatrimonio} 
          onClose={() => setPlaquetaPatrimonio(null)} 
          theme="dark" 
        />
      )}
    </div>
  );
}
