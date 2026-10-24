"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileWarning, 
  ArrowRight, 
  Search, 
  FileCheck, 
  Filter, 
  RefreshCw,
  Sparkles,
  Lock,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PreAuditedGuia {
  id: string;
  pacienteNome: string;
  convenio: string;
  carteirinha: string;
  procedimentoTuss: string;
  tussCodigo: string;
  valor: number;
  hasSoapClinicalEvolution: boolean;
  maskStatus: "valida" | "invalida";
  errorDetails?: string;
  status: "auditada" | "pendente_correcao";
}

export default function AuditoriaPreviaPage() {
  const [filter, setFilter] = useState<"todos" | "auditadas" | "pendentes">("todos");

  const [guias, setGuias] = useState<PreAuditedGuia[]>([
    {
      id: "G-8801",
      pacienteNome: "Mariana Silva",
      convenio: "Unimed Central",
      carteirinha: "0054.1298.4410.0091", // 16 dígitos (máscara exige 17)
      procedimentoTuss: "40101010 - Consulta Médica Geral",
      tussCodigo: "40101010",
      valor: 160.0,
      hasSoapClinicalEvolution: true,
      maskStatus: "invalida",
      errorDetails: "Carteirinha Unimed incompleta: 16 dígitos fornecidos. O padrão contratual exige 17 dígitos.",
      status: "pendente_correcao",
    },
    {
      id: "G-8802",
      pacienteNome: "Roberto Santos",
      convenio: "Bradesco Saúde",
      carteirinha: "712.984.102.341.009",
      procedimentoTuss: "40808033 - Ressonância Magnética com Contraste",
      tussCodigo: "40808033",
      valor: 1150.0,
      hasSoapClinicalEvolution: false, // Glosa Técnica iminente
      maskStatus: "valida",
      errorDetails: "Glosa Técnica Iminente: Procedimento de Alta Complexidade sem registro clínico no Prontuário SOAP.",
      status: "pendente_correcao",
    },
    {
      id: "G-8803",
      pacienteNome: "Ana Paula Costa",
      convenio: "Amil One S6500",
      carteirinha: "981244091",
      procedimentoTuss: "40101010 - Consulta Dermatológica",
      tussCodigo: "40101010",
      valor: 220.0,
      hasSoapClinicalEvolution: true,
      maskStatus: "valida",
      status: "auditada",
    },
    {
      id: "G-8804",
      pacienteNome: "Carlos Eduardo Menezes",
      convenio: "SulAmérica",
      carteirinha: "8821941002341",
      procedimentoTuss: "30101786 - Sutura de Múltiplos Ferimentos Extensos",
      tussCodigo: "30101786",
      valor: 580.0,
      hasSoapClinicalEvolution: true,
      maskStatus: "valida",
      status: "auditada",
    },
  ]);

  const handleFixCarteirinha = (id: string) => {
    const input = prompt("Digite a carteirinha corrigida com 17 dígitos (Unimed):", "0054.1298.4410.0091.2");
    if (input && input.length >= 17) {
      setGuias((prev) =>
        prev.map((g) =>
          g.id === id
            ? { ...g, carteirinha: input, maskStatus: "valida", errorDetails: undefined, status: "auditada" }
            : g
        )
      );
      alert("✅ Máscara validada! Guia liberada para o lote.");
    }
  };

  const handleFixSoapProntuario = (id: string) => {
    alert("Redirecionando para o Prontuário Eletrônico (SOAP) do paciente para preenchimento da justificativa clínica...");
    setGuias((prev) =>
      prev.map((g) =>
        g.id === id
          ? { ...g, hasSoapClinicalEvolution: true, errorDetails: undefined, status: "auditada" }
          : g
      )
    );
  };

  const filteredGuias = guias.filter((g) => {
    if (filter === "auditadas") return g.status === "auditada";
    if (filter === "pendentes") return g.status === "pendente_correcao";
    return true;
  });

  const countAuditadas = guias.filter((g) => g.status === "auditada").length;
  const countPendentes = guias.filter((g) => g.status === "pendente_correcao").length;

  return (
    <div className="space-y-6 animate-in fade-in p-2 md:p-6 pb-20">
      
      {/* Header do Rules Engine */}
      <div className="p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-heading font-bold text-white">Motor de Regras: Auditoria Pré-Faturamento</h2>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Glosas Zero Ativo
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Validação de máscaras contratuais (dígitos de carteirinha) e cruzamento rigoroso com o Prontuário SOAP antes da geração de lote.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (countPendentes > 0) {
                alert(`⚠️ Atenção: Existem ${countPendentes} guias no Kanban de Pendências de Correção. Corrija-as para evitar glosas operacionais.`);
              } else {
                alert("🚀 Todas as guias foram auditadas com sucesso! Lote 100% elegível para transmissão direta SOAP.");
              }
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rd-cyan text-zinc-950 hover:bg-rd-cyan/90 font-bold text-xs uppercase tracking-wider shadow-lg shadow-rd-cyan/20 transition-all hover:scale-[1.02]"
          >
            <FileCheck className="h-4 w-4" />
            Liberar Lote Auditado ({countAuditadas})
          </button>
        </div>
      </div>

      {/* KPIs do Motor de Regras */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Total de Guias Analisadas</span>
          <p className="text-3xl font-black text-white">{guias.length}</p>
          <p className="text-xs text-zinc-500">Varredura automática</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Guias Auditadas (100% OK)</span>
          <p className="text-3xl font-black text-emerald-400">{countAuditadas}</p>
          <p className="text-xs text-zinc-500">Prontas para envio direto</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Pendências de Correção</span>
          <p className="text-3xl font-black text-amber-400">{countPendentes}</p>
          <p className="text-xs text-zinc-500">Bloqueadas pelo Rules Engine</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Valor em Risco Protegido</span>
          <p className="text-3xl font-black text-rd-cyan">R$ 1.310,00</p>
          <p className="text-xs text-zinc-500">Glosas evitadas antes do envio</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex border-b border-zinc-800 gap-4">
        <button
          onClick={() => setFilter("todos")}
          className={cn(
            "pb-3 font-bold text-xs uppercase tracking-wider border-b-2 transition-all",
            filter === "todos" ? "border-rd-cyan text-rd-cyan" : "border-transparent text-zinc-400 hover:text-white"
          )}
        >
          Todas as Guias ({guias.length})
        </button>
        <button
          onClick={() => setFilter("pendentes")}
          className={cn(
            "pb-3 font-bold text-xs uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5",
            filter === "pendentes" ? "border-amber-400 text-amber-400" : "border-transparent text-zinc-400 hover:text-white"
          )}
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          Kanban: Pendência de Correção ({countPendentes})
        </button>
        <button
          onClick={() => setFilter("auditadas")}
          className={cn(
            "pb-3 font-bold text-xs uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5",
            filter === "auditadas" ? "border-emerald-400 text-emerald-400" : "border-transparent text-zinc-400 hover:text-white"
          )}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          Auditadas & Aprovadas ({countAuditadas})
        </button>
      </div>

      {/* Grid de Guias */}
      <div className="space-y-3">
        {filteredGuias.map((guia) => {
          const isPending = guia.status === "pendente_correcao";

          return (
            <div
              key={guia.id}
              className={cn(
                "p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4",
                isPending
                  ? "bg-amber-950/20 border-amber-500/40"
                  : "bg-zinc-950/60 border-zinc-800"
              )}
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-rd-cyan">{guia.id}</span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300">
                    {guia.convenio}
                  </span>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider",
                      isPending
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                    )}
                  >
                    {isPending ? "Pendência de Correção" : "Auditada"}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-white">{guia.pacienteNome}</h4>
                <p className="text-xs text-zinc-400 font-medium">
                  {guia.procedimentoTuss} • Carteirinha: <span className="font-mono text-zinc-200">{guia.carteirinha}</span>
                </p>

                {/* Detalhes da Regra Quebrada */}
                {isPending && guia.errorDetails && (
                  <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2 mt-2">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                    <span>{guia.errorDetails}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 self-end md:self-center">
                <span className="font-black text-lg text-white">
                  {guia.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </span>

                {isPending ? (
                  <div className="flex items-center gap-2">
                    {guia.maskStatus === "invalida" && (
                      <button
                        onClick={() => handleFixCarteirinha(guia.id)}
                        className="px-3.5 py-2 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-all shadow-md"
                      >
                        Corrigir Carteirinha
                      </button>
                    )}
                    {!guia.hasSoapClinicalEvolution && (
                      <button
                        onClick={() => handleFixSoapProntuario(guia.id)}
                        className="px-3.5 py-2 rounded-xl bg-rd-cyan text-zinc-950 font-bold text-xs uppercase tracking-wider hover:bg-rd-cyan/90 transition-all shadow-md"
                      >
                        Vincular Prontuário SOAP
                      </button>
                    )}
                  </div>
                ) : (
                  <span className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" /> Pronta p/ Lote
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
