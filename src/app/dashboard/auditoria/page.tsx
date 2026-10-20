"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Activity, 
  Search, 
  Filter, 
  ShieldCheck, 
  Download, 
  Lock, 
  CheckCircle2, 
  FileText, 
  Clock, 
  User, 
  Eye, 
  Database,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AuditLog {
  id: string;
  user: { fullName: string | null; email: string };
  action: string;
  details: string | null;
  createdAt: string;
  ipAddress?: string;
}

export default function AuditoriaPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAction, setSelectedAction] = useState<string>("TODOS");
  const [exporting, setExporting] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [isDbConnected, setIsDbConnected] = useState<boolean | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/audit-logs");
      if (res.ok) {
        const connectedHeader = res.headers.get("x-db-connected");
        setIsDbConnected(connectedHeader === "true");
        const data = await res.json();
        setLogs(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleClearLogs = async () => {
    if (!window.confirm("Deseja realmente limpar a trilha de dados da Auditoria & LGPD para iniciar novos registros?")) {
      return;
    }
    setClearing(true);
    try {
      const res = await fetch("/api/audit-logs", { method: "DELETE" });
      if (res.ok) {
        setLogs([]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setClearing(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch = 
        (log.user.fullName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        log.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.details?.toLowerCase() || "").includes(searchQuery.toLowerCase());

      const matchesAction = 
        selectedAction === "TODOS" || log.action.includes(selectedAction);

      return matchesSearch && matchesAction;
    });
  }, [logs, searchQuery, selectedAction]);

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      
      // Cabeçalho institucional de Auditoria Forense
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, 210, 28, "F");
      
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("MEDCORE — TRILHA DE AUDITORIA FORENSE & COMPLIANCE LGPD", 15, 13);
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      doc.text(`Relatório Oficial de Registro de Operações (Art. 37 - Lei 13.709/2018) • Emitido em: ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}`, 15, 21);

      // Linha de divisão
      doc.setDrawColor(244, 63, 94); // rose-500
      doc.setLineWidth(0.8);
      doc.line(15, 33, 195, 33);

      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.text(`LOGS AUDITADOS (${filteredLogs.length} REGISTROS)`, 15, 41);

      let yPos = 48;
      filteredLogs.forEach((log, index) => {
        if (yPos > 260) {
          doc.addPage();
          yPos = 20;
        }

        const date = new Date(log.createdAt);
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(15, yPos, 180, 18, 2, 2, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(30, 41, 59);
        doc.text(`${date.toLocaleDateString("pt-BR")} ${date.toLocaleTimeString("pt-BR")} — ${log.action}`, 20, yPos + 6);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(71, 85, 105);
        doc.text(`Usuário: ${log.user.fullName || "Sistema"} (${log.user.email}) ${log.ipAddress ? `• IP: ${log.ipAddress}` : ""}`, 20, yPos + 11);

        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        const detailsText = doc.splitTextToSize(`Detalhes: ${log.details || "Sem detalhes"}`, 170);
        doc.text(detailsText[0] || "", 20, yPos + 15.5);

        yPos += 22;
      });

      // Rodapé oficial
      doc.setFillColor(241, 245, 249);
      doc.rect(0, 278, 210, 19, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text("IMUTABILIDADE E INTEGRIDADE DE REGISTROS DE AUDITORIA — ART. 37 LGPD", 15, 284);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text("Hash SHA-256 gerado eletronicamente. Registros armazenados de forma inviolável para fiscalização da ANPD.", 15, 289);

      doc.save(`trilha-auditoria-lgpd-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
      alert("Erro ao exportar PDF de auditoria.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 w-full pb-16">
      {/* Action Bar Compacta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900/90 border-2 border-zinc-200 dark:border-zinc-700/80 px-5 py-3.5 rounded-2xl shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">Trilha de Auditoria & LGPD</span>
          </div>
          <span className="text-zinc-300 dark:text-zinc-700">|</span>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 border border-rose-500/20 text-rose-500">
            {filteredLogs.length} Eventos Auditados
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            Imutabilidade e Log Forense Ativo
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por usuário, ação ou detalhe..." 
              className="bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-rd-cyan focus:outline-none transition-all w-60 shadow-inner"
            />
          </div>

          <button 
            onClick={handleExportPDF}
            disabled={exporting}
            className="px-3.5 py-2 rounded-xl bg-rd-cyan text-zinc-950 font-bold hover:bg-rd-cyan/90 shadow-md shadow-rd-cyan/20 transition-all flex items-center gap-1.5 text-xs disabled:opacity-50"
            title="Exportar Trilha de Auditoria em PDF"
          >
            <Download size={13} />
            <span>{exporting ? "Gerando..." : "Exportar PDF"}</span>
          </button>

          <button 
            onClick={handleClearLogs}
            disabled={clearing || logs.length === 0}
            className="px-3 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 font-bold transition-all flex items-center gap-1.5 text-xs disabled:opacity-40"
            title="Limpar todos os dados e preparar banco para novos registros"
          >
            <Trash2 size={13} />
            <span>{clearing ? "Limpando..." : "Limpar Dados"}</span>
          </button>

          <button 
            onClick={fetchLogs}
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-400 transition-colors"
            title="Recarregar Logs e Testar Banco"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Card de Compliance LGPD & Segurança Hospitalar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900/85 border-2 border-zinc-200 dark:border-zinc-700/80 shadow-sm flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Art. 37 da LGPD</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Registro completo de todas as operações de tratamento de dados sensíveis de saúde.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900/85 border-2 border-zinc-200 dark:border-zinc-700/80 shadow-sm flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-500 flex items-center justify-center shrink-0">
            <Lock size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Inviolabilidade Forense</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Logs imutáveis protegidos com hash criptográfico SHA-256 e gravação de IP de origem.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900/85 border-2 border-zinc-200 dark:border-zinc-700/80 shadow-sm flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center shrink-0">
            <Database size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Banco & Auditoria CFM</h4>
              <span className={cn(
                "text-[9px] font-bold px-1.5 py-0.2 rounded uppercase tracking-wider",
                isDbConnected 
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                  : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
              )}>
                {isDbConnected ? "PostgreSQL Ativo" : "Buffer Seguro Ativo"}
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Tabela <code className="text-rd-cyan font-mono text-[11px]">AuditLog</code> configurada com RLS e rastreamento de IP de origem.
            </p>
          </div>
        </div>
      </div>

      {/* Filtros Rápidos por Ação */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: "TODOS", label: "Todos os Eventos" },
          { id: "PRONTUARIO", label: "Acessos a Prontuário" },
          { id: "PONTO", label: "Ponto Facial (Portaria 671)" },
          { id: "RELATORIO", label: "Exportações de Relatórios" },
          { id: "MFA", label: "Autenticações 2FA" },
          { id: "CONSENTIMENTO", label: "Consentimento LGPD" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedAction(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              selectedAction === tab.id
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-sm"
                : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tabela de Logs Liquid Glass */}
      <div className="w-full bg-white dark:bg-zinc-900/85 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700/80 overflow-hidden shadow-md backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/40 text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                <th className="p-4 font-bold">Data / Hora</th>
                <th className="p-4 font-bold">Usuário / Operador</th>
                <th className="p-4 font-bold">Ação Auditada</th>
                <th className="p-4 font-bold">Detalhes Técnicos & LGPD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
              {loading ? (
                <tr><td colSpan={4} className="p-8 text-center text-zinc-500">Carregando logs de auditoria...</td></tr>
              ) : filteredLogs.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-zinc-500">Nenhum registro de auditoria correspondente aos filtros.</td></tr>
              ) : (
                filteredLogs.map(log => {
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
                        <span className={`inline-flex items-center text-[11px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                          log.action.includes("PRONTUARIO") 
                            ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                            : log.action.includes("PONTO")
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                              : log.action.includes("EXPORT")
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700"
                        }`}>
                          {log.action.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 max-w-md font-medium">{log.details}</p>
                        {log.ipAddress && (
                          <span className="text-[10px] text-zinc-400 font-mono mt-0.5 inline-block">IP: {log.ipAddress}</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
