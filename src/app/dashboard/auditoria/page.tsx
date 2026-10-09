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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold uppercase tracking-widest rounded-full">Segurança</span>
          </div>
          <h1 className="font-heading text-3xl font-bold tracking-tighter text-on-surface">
            Logs de <span className="text-gradient-lilac">Auditoria</span>
          </h1>
          <p className="text-on-surface-variant text-[11px] font-medium opacity-80">
            Acompanhe as ações críticas realizadas pela sua equipe.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
            <input 
              type="text" 
              placeholder="Buscar log..." 
              className="bg-surface-container border border-outline-variant/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-on-surface focus:border-rd-cyan focus:outline-none transition-all w-64"
            />
          </div>
          <button className="bg-surface-container border border-outline-variant/30 text-on-surface-variant p-2.5 rounded-xl hover:text-on-surface transition-colors">
            <Filter size={16} />
          </button>
        </div>
      </div>

      {/* Tabela de Logs */}
      <div className="w-full bg-surface-container-low rounded-3xl border border-outline-variant/40 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-outline-variant/30 bg-surface/30 text-sm uppercase tracking-widest text-on-surface-variant">
                <th className="p-4 font-semibold">Data / Hora</th>
                <th className="p-4 font-semibold">Usuário</th>
                <th className="p-4 font-semibold">Ação</th>
                <th className="p-4 font-semibold">Detalhes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {loading ? (
                <tr><td colSpan={4} className="p-8 text-center text-on-surface-variant">Carregando logs...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-on-surface-variant">Nenhum log encontrado.</td></tr>
              ) : (
                logs.map(log => {
                  const date = new Date(log.createdAt);
                  return (
                    <tr key={log.id} className="hover:bg-surface-container/50 transition-colors group">
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Activity size={14} className="text-on-surface-variant opacity-50" />
                          <div>
                            <p className="text-sm font-semibold text-on-surface">{date.toLocaleDateString("pt-BR")}</p>
                            <p className="text-sm text-on-surface-variant">{date.toLocaleTimeString("pt-BR")}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-semibold text-on-surface">{log.user.fullName || "Desconhecido"}</p>
                        <p className="text-xs text-on-surface-variant">{log.user.email}</p>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center text-sm font-semibold px-2 py-1 rounded-md border border-outline-variant/50 bg-surface text-on-surface-variant">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="text-xs text-on-surface-variant line-clamp-2 max-w-sm">{log.details}</p>
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
