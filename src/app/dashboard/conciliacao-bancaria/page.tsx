"use client";

import React, { useState } from "react";
import { 
  Building2, 
  ArrowDownLeft, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Sparkles, 
  FileSpreadsheet, 
  CreditCard, 
  DollarSign,
  TrendingUp,
  Search,
  Check,
  Zap,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  date: string;
  type: "credit" | "debit";
  source: "PIX" | "Boleto Bancário" | "Cartão Crédito (Stone)" | "Repasse Convênio" | "Tarifa";
  description: string;
  amount: number;
  openFinanceMatch: {
    matched: boolean;
    erpEntity: string;
    confidence: number;
  };
  status: "conciliado_automatico" | "divergencia" | "pendente";
}

export default function ConciliacaoBancariaPage() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("todos");

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "TX-9901",
      date: "24/10/2026 11:20",
      type: "credit",
      source: "PIX",
      description: "PIX Recebido - Consulta Dermatologia (Mariana Silva)",
      amount: 450.0,
      openFinanceMatch: { matched: true, erpEntity: "Atendimento #8812 - Dr. Alexandre", confidence: 99 },
      status: "conciliado_automatico",
    },
    {
      id: "TX-9902",
      date: "24/10/2026 10:45",
      type: "credit",
      source: "Repasse Convênio",
      description: "Crédito em Conta - Bradesco Saúde Lote TISS-2026-09",
      amount: 14850.0,
      openFinanceMatch: { matched: true, erpEntity: "Faturamento TISS Lote #41 - 100% Baixado", confidence: 98 },
      status: "conciliado_automatico",
    },
    {
      id: "TX-9903",
      date: "24/10/2026 09:15",
      type: "credit",
      source: "Boleto Bancário",
      description: "Boleto Liquidado 34191.76... - Pagamento Pacote Estético",
      amount: 3200.0,
      openFinanceMatch: { matched: false, erpEntity: "Divergência de R$ 50,00 (Multa/Juros não previstos no ERP)", confidence: 60 },
      status: "divergencia",
    },
    {
      id: "TX-9904",
      date: "24/10/2026 08:00",
      type: "debit",
      source: "Tarifa",
      description: "Débito Automático - Energia Elétrica Unidade Matriz (Enel)",
      amount: 1840.5,
      openFinanceMatch: { matched: true, erpEntity: "Contas a Pagar #1029 - Infraestrutura", confidence: 95 },
      status: "conciliado_automatico",
    },
    {
      id: "TX-9905",
      date: "23/10/2026 17:30",
      type: "credit",
      source: "Cartão Crédito (Stone)",
      description: "Lote de Cartões Débito/Crédito - Fechamento de Caixa",
      amount: 8720.0,
      openFinanceMatch: { matched: true, erpEntity: "Frente de Caixa Terminal 01 & 02", confidence: 97 },
      status: "conciliado_automatico",
    },
  ]);

  const handleSyncOpenFinance = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert("⚡ Sincronização Open Finance Concluída!\n\n• Contas Itaú PJ e BTG Pactual atualizadas em tempo real.\n• 4 novos lançamentos conciliados automaticamente sem intervenção humana.");
    }, 1500);
  };

  const handleResolveDivergencia = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "conciliado_automatico" } : t))
    );
  };

  const totalConciliado = transactions
    .filter((t) => t.status === "conciliado_automatico")
    .reduce((acc, curr) => acc + (curr.type === "credit" ? curr.amount : -curr.amount), 0);

  return (
    <div className="space-y-6 animate-in fade-in p-2 md:p-6 pb-20">
      
      {/* Header com Executive AI */}
      <div className="p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <TrendingUp className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-heading font-bold text-white">Conciliação Bancária em Tempo Real (Executive AI)</h2>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Open Finance Plug & Play
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Baixa invisível de faturas, cruzamento de extratos com contas a receber/pagar e detecção preditiva de divergências.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncOpenFinance}
            disabled={isSyncing}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-zinc-950 hover:bg-emerald-400 font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            <RefreshCw className={cn("h-4 w-4", isSyncing && "animate-spin")} />
            {isSyncing ? "Sincronizando Bancos..." : "Sincronizar Open Finance"}
          </button>
        </div>
      </div>

      {/* Indicadores do Painel Executivo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Saldo Conciliado Hoje</span>
          <p className="text-3xl font-black text-emerald-400">
            {totalConciliado.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </p>
          <p className="text-xs text-zinc-500">Itaú PJ + BTG Pactual</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Automação Zero Touch</span>
          <p className="text-3xl font-black text-white">96.8%</p>
          <p className="text-xs text-zinc-500">Baixados sem tocar no teclado</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Divergências Sinalizadas</span>
          <p className="text-3xl font-black text-amber-400">
            {transactions.filter((t) => t.status === "divergencia").length}
          </p>
          <p className="text-xs text-zinc-500">Exige validação do gestor</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Repasses TISS Conciliados</span>
          <p className="text-3xl font-black text-rd-cyan">R$ 14.850,00</p>
          <p className="text-xs text-zinc-500">Bradesco Saúde conciliado</p>
        </div>
      </div>

      {/* Tabela de Lançamentos Conciliados e Divergências */}
      <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
          <div>
            <h4 className="font-bold text-base text-white">Extrato Consolidado & Cruzamento ERP</h4>
            <p className="text-xs text-zinc-400">Alimentação contínua via APIs Bancárias Bacen Open Finance</p>
          </div>
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
            {transactions.length} transações nas últimas 24h
          </span>
        </div>

        <div className="space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className={cn(
                "p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4",
                tx.status === "divergencia"
                  ? "bg-amber-950/20 border-amber-500/40"
                  : "bg-zinc-950/60 border-zinc-800"
              )}
            >
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center font-bold shrink-0 mt-0.5",
                    tx.type === "credit" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                  )}
                >
                  {tx.type === "credit" ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{tx.description}</span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300">
                      {tx.source}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-zinc-500">{tx.date}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-zinc-300">
                      Vínculo ERP: <strong className="text-rd-cyan">{tx.openFinanceMatch.erpEntity}</strong>
                    </span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-emerald-400 font-bold">{tx.openFinanceMatch.confidence}% de certeza</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end md:self-center">
                <span
                  className={cn(
                    "text-lg font-black",
                    tx.type === "credit" ? "text-emerald-400" : "text-zinc-300"
                  )}
                >
                  {tx.type === "credit" ? "+" : "-"}
                  {tx.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </span>

                {tx.status === "divergencia" ? (
                  <button
                    onClick={() => handleResolveDivergencia(tx.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-zinc-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-all shadow-sm"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Aceitar Diferença
                  </button>
                ) : (
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Conciliado
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
