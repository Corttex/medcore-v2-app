"use client";

import React, { useState, useEffect } from "react";
import { Activity, Search, Filter } from "lucide-react";

interface AuditLog {
  id: string;
  user: { fullName: string | null; email: string };
  action: string;
  details: string | null;
  createdAt: string;
}

export default function AuditoriaPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/audit-logs");
        if (res.ok) {
          const data = await res.json();
          setLogs(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 w-full">
      {/* Action Bar Compacta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900/90 border-2 border-zinc-200 dark:border-zinc-700/80 px-5 py-3.5 rounded-2xl shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">Trilha de Auditoria & LGPD</span>
          </div>
          <span className="text-zinc-300 dark:text-zinc-700">|</span>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 border border-rose-500/20 text-rose-500">
            {logs.length} Eventos Auditados
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            Imutabilidade e Log Forense Ativo
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Buscar por usuário, ação ou detalhe..." 
              className="bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-rd-cyan focus:outline-none transition-all w-64 shadow-inner"
            />
          </div>
          <button className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 p-2 rounded-xl hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            <Filter size={16} />
          </button>
        </div>
      </div>

      {/* Tabela de Logs Liquid Glass */}
      <div className="w-full bg-white dark:bg-zinc-900/85 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700/80 overflow-hidden shadow-md backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/40 text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                <th className="p-4 font-bold">Data / Hora</th>
                <th className="p-4 font-bold">Usuário</th>
                <th className="p-4 font-bold">Ação</th>
                <th className="p-4 font-bold">Detalhes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
              {loading ? (
                <tr><td colSpan={4} className="p-8 text-center text-zinc-500">Carregando logs de auditoria...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-zinc-500">Nenhum registro de auditoria encontrado.</td></tr>
              ) : (
                logs.map(log => {
                  const date = new Date(log.createdAt);
                  return (
                    <tr key={log.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors group">
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Activity size={14} className="text-rd-cyan shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{date.toLocaleDateString("pt-BR")}</p>
                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{date.toLocaleTimeString("pt-BR")}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{log.user.fullName || "Desconhecido"}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{log.user.email}</p>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center text-xs font-bold px-2.5 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 max-w-sm">{log.details}</p>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
