"use client";

import React, { useState } from "react";
import { 
  HandCoins, 
  RefreshCw, 
  CheckCircle2, 
  ArrowDownLeft, 
  ArrowUpRight, 
  DollarSign, 
  Sparkles, 
  Split, 
  Users, 
  Building2, 
  Check,
  Send,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RetornoItem {
  id: string;
  loteNumero: string;
  convenio: string;
  dataPagamento: string;
  valorTotalFaturado: number;
  valorGlosaRetida: number;
  valorLiquidoRecebido: number;
  status: "conciliado_com_split" | "aguardando_baixa";
  repassesGerados: {
    medico: string;
    procedimento: string;
    valorRepasseLiquido: number;
    splitPercent: number;
    status: "disponivel_no_app" | "processado";
  }[];
}

export default function ConciliacaoRetornoPage() {
  const [isCheckingCron, setIsCheckingCron] = useState(false);

  const [retornos, setRetornos] = useState<RetornoItem[]>([
    {
      id: "RET-2026-081",
      loteNumero: "LT-202609-4102",
      convenio: "Bradesco Saúde Top Nacional",
      dataPagamento: "24/10/2026",
      valorTotalFaturado: 24500.0,
      valorGlosaRetida: 450.0,
      valorLiquidoRecebido: 24050.0,
      status: "conciliado_com_split",
      repassesGerados: [
        {
          medico: "Dr. Carlos Silva",
          procedimento: "Consultas & Procedimentos Dermatológicos (28 guias)",
          valorRepasseLiquido: 14430.0,
          splitPercent: 60,
          status: "disponivel_no_app",
        },
        {
          medico: "Dra. Ana Paula Costa",
          procedimento: "Consultas Especializadas (14 guias)",
          valorRepasseLiquido: 7215.0,
          splitPercent: 70,
          status: "disponivel_no_app",
        },
      ],
    },
    {
      id: "RET-2026-082",
      loteNumero: "LT-202609-4188",
      convenio: "Amil One S6500",
      dataPagamento: "23/10/2026",
      valorTotalFaturado: 12800.0,
      valorGlosaRetida: 0.0,
      valorLiquidoRecebido: 12800.0,
      status: "conciliado_com_split",
      repassesGerados: [
        {
          medico: "Dr. Roberto Justo",
          procedimento: "Exames de Imagem & Laudos (19 guias)",
          valorRepasseLiquido: 6400.0,
          splitPercent: 50,
          status: "disponivel_no_app",
        },
      ],
    },
  ]);

  const handleCronJobCheck = () => {
    setIsCheckingCron(true);
    setTimeout(() => {
      setIsCheckingCron(false);
      alert("⚡ Cronjob TISS 24h Executado com Sucesso!\n\n• Varredura nos servidores das operadoras concluída.\n• Todos os XMLs de Retorno foram processados.\n• 100% dos títulos a receber baixados no ERP.\n• Divisão (Split) realizada automaticamente e creditada no app dos médicos.");
    }, 2000);
  };

  const totalRecebido = retornos.reduce((acc, curr) => acc + curr.valorLiquidoRecebido, 0);
  const totalRepassado = retornos.flatMap((r) => r.repassesGerados).reduce((acc, curr) => acc + curr.valorRepasseLiquido, 0);
  const totalRetencaoClinica = totalRecebido - totalRepassado;

  return (
    <div className="space-y-6 animate-in fade-in p-2 md:p-6 pb-20">
      
      {/* Header da Conciliação de Retorno */}
      <div className="p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <HandCoins className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-heading font-bold text-white">Ciclo Completo: XML de Retorno & Split de Repasses</h2>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Gatilho Automático
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Varredura de demonstrativos de pagamento TISS a cada 24h, baixa no ERP e crédito automático no app dos médicos.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCronJobCheck}
            disabled={isCheckingCron}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 text-zinc-950 hover:bg-emerald-400 font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            <RefreshCw className={cn("h-4 w-4", isCheckingCron && "animate-spin")} />
            {isCheckingCron ? "Buscando XMLs..." : "Executar Cronjob 24h"}
          </button>
        </div>
      </div>

      {/* Indicadores do Ciclo Fechado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Líquido Recebido (Operadoras)</span>
          <p className="text-3xl font-black text-emerald-400">
            {totalRecebido.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </p>
          <p className="text-xs text-zinc-500">100% baixado no ERP</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Repassado aos Médicos (Split)</span>
          <p className="text-3xl font-black text-white">
            {totalRepassado.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </p>
          <p className="text-xs text-zinc-500">Disponível no App do Médico</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Retenção Líquida da Clínica</span>
          <p className="text-3xl font-black text-rd-cyan">
            {totalRetencaoClinica.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </p>
          <p className="text-xs text-zinc-500">Margem operacional retida</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Gatilho de Split</span>
          <p className="text-3xl font-black text-purple-400">&lt; 1 seg</p>
          <p className="text-xs text-zinc-500">Cálculo e crédito instantâneos</p>
        </div>
      </div>

      {/* Lista de Retornos Conciliados com Split Automático */}
      <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div>
            <h4 className="font-bold text-base text-white">Demonstrativos de Pagamento TISS Processados</h4>
            <p className="text-xs text-zinc-400">Cruzamento de XML de retorno com os títulos a receber e divisão médica</p>
          </div>
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
            {retornos.length} lotes quitados
          </span>
        </div>

        <div className="space-y-6">
          {retornos.map((ret) => (
            <div
              key={ret.id}
              className="p-5 rounded-3xl bg-zinc-950/70 border border-zinc-800 space-y-4"
            >
              {/* Header do Lote Quitado */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-rd-cyan">{ret.id}</span>
                    <span className="text-xs text-zinc-400">Lote: <strong>{ret.loteNumero}</strong></span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300">
                      {ret.convenio}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">Data da Liquidação Bancária: {ret.dataPagamento}</p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-zinc-500 font-bold uppercase block">Líquido Aprovado</span>
                  <span className="text-2xl font-black text-emerald-400">
                    {ret.valorLiquidoRecebido.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </span>
                </div>
              </div>

              {/* Sub-tabela de Repasses do Lote */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block flex items-center gap-1.5">
                  <Split className="h-3.5 w-3.5 text-purple-400" />
                  Divisão Automática de Repasses Médicos (Split)
                </span>

                <div className="space-y-2">
                  {ret.repassesGerados.map((rep, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between gap-4 text-xs"
                    >
                      <div>
                        <strong className="text-white text-sm block">{rep.medico}</strong>
                        <span className="text-zinc-400 text-[11px]">{rep.procedimento} ({rep.splitPercent}% comissão)</span>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-bold text-sm text-white">
                          {rep.valorRepasseLiquido.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Saldo no App
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
