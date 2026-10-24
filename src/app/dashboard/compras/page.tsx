"use client";

import React, { useState, useEffect } from "react";
import { 
  ShoppingCart, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  DollarSign, 
  Building2, 
  PackageCheck, 
  Sparkles, 
  FileSpreadsheet, 
  ArrowUpRight, 
  Plus, 
  RefreshCw,
  Search,
  Check,
  X
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useDashboardContext } from "@/features/dashboard/context/DashboardContext";
import { cn } from "@/lib/utils";

const PEDIDOS_DEMO = [
  {
    id: "PC-8902",
    fornecedor: "Dermamed Distribuidora Farmacêutica",
    cnpj: "61.412.110/0001-55",
    notaFiscal: "000.184.920",
    valorTotal: 10150.00,
    dataPedido: "2026-10-18",
    prazoFaturamento: "15 dias (Boleto)",
    dataVencimento: "2026-11-02",
    status: "RECEBIDO_ESTOQUE",
    statusPagamento: "A_VENCER",
    itensQtd: 4
  },
  {
    id: "PC-8890",
    fornecedor: "Galderma Brasil Farmacêutica",
    cnpj: "00.123.456/0001-99",
    notaFiscal: "000.183.114",
    valorTotal: 8400.00,
    dataPedido: "2026-10-12",
    prazoFaturamento: "10 dias",
    dataVencimento: "2026-10-22",
    status: "RECEBIDO_ESTOQUE",
    statusPagamento: "PAGO",
    itensQtd: 2
  },
  {
    id: "PC-8915",
    fornecedor: "Cremer & BD Hospitalar",
    cnpj: "82.641.328/0001-20",
    notaFiscal: "Pendente Envio",
    valorTotal: 1850.00,
    dataPedido: "2026-10-20",
    prazoFaturamento: "7 dias",
    dataVencimento: "2026-10-27",
    status: "AGUARDANDO_ENTREGA",
    statusPagamento: "PENDENTE",
    itensQtd: 6
  }
];

export default function ComprasSuprimentosPage() {
  const { theme } = useTheme();
  const { isDemoMode } = useDashboardContext();

  // Estados do Leitor de Nota Fiscal com IA
  const [modalUploadAberto, setModalUploadAberto] = useState(false);
  const [analisandoNota, setAnalisandoNota] = useState(false);
  const [notaExtraida, setNotaExtraida] = useState<any>(null);
  const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(null);
  const [itensConferidos, setItensConferidos] = useState<{ [key: string]: boolean }>({});
  const [sucessoImportacao, setSucessoImportacao] = useState(false);

  // Pedidos de Compra Cadastrados
  const [pedidos, setPedidos] = useState<any[]>([]);

  useEffect(() => {
    if (isDemoMode) {
      setPedidos(PEDIDOS_DEMO);
    } else {
      setPedidos([]);
    }
  }, [isDemoMode]);

  // Simulação / Envio de Arquivo para API com IA
  const handleProcessarNota = async (file: File) => {
    try {
      setAnalisandoNota(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("unitCnpj", "12.345.678/0001-90");

      const res = await fetch("/api/estoque/compras/leitor-nf", {
        method: "POST",
        body: formData
      });

      const json = await res.json();
      if (json.success) {
        setNotaExtraida(json.data);
        // Inicializa checklist de conferência marcado
        const conf: { [key: string]: boolean } = {};
        json.data.itens.forEach((it: any) => {
          conf[it.id] = true;
        });
        setItensConferidos(conf);
      } else {
        alert("Erro ao ler nota fiscal: " + json.error);
      }
    } catch (err) {
      alert("Erro na conexão com leitor de NF.");
    } finally {
      setAnalisandoNota(false);
    }
  };

  const handleToggleConferencia = (itemId: string) => {
    setItensConferidos(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleAprovarRecebimento = () => {
    if (!notaExtraida) return;

    const novoPedido = {
      id: `PC-${Math.floor(1000 + Math.random() * 9000)}`,
      fornecedor: notaExtraida.fornecedor.razaoSocial,
      cnpj: notaExtraida.fornecedor.cnpj,
      notaFiscal: notaExtraida.numeroNota,
      valorTotal: notaExtraida.valorTotalNota,
      dataPedido: notaExtraida.dataEmissao,
      prazoFaturamento: `${notaExtraida.faturamento.prazoDias} dias`,
      dataVencimento: notaExtraida.faturamento.dataVencimento,
      status: "RECEBIDO_ESTOQUE",
      statusPagamento: "A_VENCER",
      itensQtd: notaExtraida.itens.length
    };

    setPedidos([novoPedido, ...pedidos]);
    setSucessoImportacao(true);
    setTimeout(() => {
      setSucessoImportacao(false);
      setModalUploadAberto(false);
      setNotaExtraida(null);
      setArquivoSelecionado(null);
    }, 2000);
  };

  const totalEmComprasMes = pedidos.reduce((acc, p) => acc + p.valorTotal, 0);
  const notasPendentes = pedidos.filter(p => p.status === "AGUARDANDO_ENTREGA").length;

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500 pb-20 pt-1">
      {/* Action Bar Superior Compacta - Padrão Visão Executiva */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 px-5 py-3.5 rounded-2xl shadow-sm backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/70 px-3.5 py-1.5 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-rd-cyan animate-pulse mr-2" />
            <p className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
              Central de Compras, Cotações & Leitor de NF com IA
            </p>
          </div>

          <div className="flex items-center bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/70 px-3.5 py-1.5 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-300">
            Faturamento do Mês: <strong className="text-emerald-500 font-bold ml-1">R$ {totalEmComprasMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
          </div>

          {notasPendentes > 0 && (
            <div className="flex items-center bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-amber-500">
              <Clock size={13} className="mr-1.5" /> {notasPendentes} aguardando entrega/conferência
            </div>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => setModalUploadAberto(true)}
            className="flex items-center gap-2 px-4 py-2 bg-rd-cyan hover:bg-rd-cyan/90 text-zinc-950 font-bold rounded-xl text-xs transition-all shadow-sm hover:shadow-[0_0_15px_rgba(45,212,191,0.3)]"
          >
            <UploadCloud size={16} /> Carregar Nota Fiscal (IA)
          </button>
        </div>
      </div>

      {/* Grid de KPIs - 4 Cards Fluidos com Efeito Glass e Sombras Suaves */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Compras Mês */}
        <div className={cn(
          "rounded-2xl p-5 border transition-all duration-300 shadow-sm hover:shadow-md",
          theme === 'dark' ? "bg-zinc-900/60 border-zinc-800/80" : "bg-white border-zinc-200"
        )}>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-rd-cyan/10 text-rd-cyan flex items-center justify-center border border-rd-cyan/20">
              <ShoppingCart size={20} />
            </div>
            <span className="text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Mês Ativo
            </span>
          </div>
          <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Volume de Compras</p>
          <h3 className="text-2xl font-bold font-heading text-zinc-900 dark:text-white mt-1">
            R$ {totalEmComprasMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">Compras faturadas com distribuidores</p>
        </div>

        {/* Card 2: Leitor de NF IA */}
        <div className={cn(
          "rounded-2xl p-5 border transition-all duration-300 shadow-sm hover:shadow-md",
          theme === 'dark' ? "bg-zinc-900/60 border-zinc-800/80" : "bg-white border-zinc-200"
        )}>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center border border-purple-500/20">
              <Sparkles size={20} />
            </div>
            <span className="text-[11px] font-semibold text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
              IA Ativa
            </span>
          </div>
          <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Ingestão por IA</p>
          <h3 className="text-2xl font-bold font-heading text-zinc-900 dark:text-white mt-1">
            100% Automatizado
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">Leitura de PDF/XML, CNPJ e lotes</p>
        </div>

        {/* Card 3: Prazos de Faturamento */}
        <div className={cn(
          "rounded-2xl p-5 border transition-all duration-300 shadow-sm hover:shadow-md",
          theme === 'dark' ? "bg-zinc-900/60 border-zinc-800/80" : "bg-white border-zinc-200"
        )}>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20">
              <Calendar size={20} />
            </div>
            <span className="text-[11px] font-semibold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
              Fluxo Caixa
            </span>
          </div>
          <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Prazos de Faturamento</p>
          <h3 className="text-2xl font-bold font-heading text-zinc-900 dark:text-white mt-1">
            7 a 15 Dias
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">Controle de vencimento e boleto direto</p>
        </div>

        {/* Card 4: Conferência de Estoque */}
        <div className={cn(
          "rounded-2xl p-5 border transition-all duration-300 shadow-sm hover:shadow-md",
          theme === 'dark' ? "bg-zinc-900/60 border-zinc-800/80" : "bg-white border-zinc-200"
        )}>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
              <PackageCheck size={20} />
            </div>
            <span className="text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Auditoria
            </span>
          </div>
          <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Conferência Física</p>
          <h3 className="text-2xl font-bold font-heading text-zinc-900 dark:text-white mt-1">
            Checklist 1-Click
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">Abastecimento instantâneo do almoxarifado</p>
        </div>
      </div>

      {/* Tabela de Ordens e Notas de Compra */}
      <div className={cn(
        "rounded-2xl border overflow-hidden shadow-sm backdrop-blur-md transition-all",
        theme === 'dark' ? "bg-zinc-900/60 border-zinc-800/80" : "bg-white border-zinc-200"
      )}>
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet size={18} className="text-rd-cyan" />
            <h4 className="font-heading font-bold text-sm text-zinc-900 dark:text-white">
              Histórico de Ordens de Compra & Notas Faturadas
            </h4>
          </div>
          <span className="text-xs text-zinc-400">{pedidos.length} pedidos registrados</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Pedido / NF</th>
                <th className="py-3 px-4">Distribuidor / CNPJ</th>
                <th className="py-3 px-4">Emissão</th>
                <th className="py-3 px-4">Prazo de Faturamento</th>
                <th className="py-3 px-4">Status Estoque</th>
                <th className="py-3 px-4">Valor Total</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {pedidos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-zinc-400">
                    <p className="font-semibold text-zinc-500 mb-1">
                      {isDemoMode ? "Nenhuma ordem de compra encontrada." : "Nenhuma ordem de compra ou faturamento lançado nesta unidade."}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {isDemoMode ? "Verifique os filtros de pesquisa." : "Ative o 'Modo Demonstração' na barra superior para visualizar faturamentos de teste ou carregue uma Nota Fiscal acima."}
                    </p>
                  </td>
                </tr>
              ) : (
                pedidos.map((pedido) => (
                  <tr key={pedido.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                    <div className="font-bold text-zinc-900 dark:text-zinc-100">{pedido.id}</div>
                    <div className="text-[11px] text-zinc-500 font-mono mt-0.5">NF: {pedido.notaFiscal}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-zinc-800 dark:text-zinc-200">{pedido.fornecedor}</div>
                    <div className="text-[11px] text-zinc-400 font-mono mt-0.5">CNPJ: {pedido.cnpj}</div>
                  </td>

                  <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-300">
                    {new Date(pedido.dataPedido).toLocaleDateString('pt-BR')}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                      <Clock size={12} className="text-amber-500" />
                      {pedido.prazoFaturamento}
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">
                      Vence em: {new Date(pedido.dataVencimento).toLocaleDateString('pt-BR')}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    {pedido.status === "RECEBIDO_ESTOQUE" ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        <CheckCircle2 size={11} /> Recebido ({pedido.itensQtd} itens)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                        <Clock size={11} /> Aguardando Entrega
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 font-bold text-zinc-900 dark:text-white">
                    R$ {Number(pedido.valorTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button 
                      onClick={() => alert(`Detalhes do pedido ${pedido.id} e nota ${pedido.notaFiscal}`)}
                      className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors"
                    >
                      Ver Detalhes
                    </button>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Leitor de Nota Fiscal com IA & Conferência de Recebimento */}
      {modalUploadAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div>
                <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Sparkles size={18} className="text-rd-cyan" /> Leitor Inteligente de Notas Fiscais (IA)
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Carregue PDF, XML ou foto da NF. A IA extrairá CNPJ, itens, lotes e prazos de faturamento.
                </p>
              </div>
              <button 
                onClick={() => setModalUploadAberto(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                ✕
              </button>
            </div>

            {/* Zona de Upload / Drag & Drop */}
            {!notaExtraida && (
              <div 
                className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl p-8 text-center hover:border-rd-cyan/50 transition-colors bg-zinc-50/50 dark:bg-zinc-800/30 flex flex-col items-center justify-center cursor-pointer"
                onClick={() => document.getElementById("file-nf-input")?.click()}
              >
                <input 
                  id="file-nf-input" 
                  type="file" 
                  accept=".pdf,.xml,image/*" 
                  className="hidden" 
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setArquivoSelecionado(f);
                      handleProcessarNota(f);
                    }
                  }}
                />
                <div className="w-14 h-14 rounded-2xl bg-rd-cyan/15 text-rd-cyan flex items-center justify-center mb-3 shadow-inner">
                  <UploadCloud size={28} />
                </div>
                <h4 className="font-heading font-bold text-sm text-zinc-900 dark:text-white">
                  {analisandoNota ? "A IA está processando a nota fiscal..." : "Clique ou arraste a Nota Fiscal aqui"}
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm">
                  Formatos suportados: PDF (DANFE), XML (NF-e) ou foto escaneada.
                </p>
                {analisandoNota && (
                  <div className="flex items-center gap-2 mt-4 text-xs font-semibold text-rd-cyan">
                    <RefreshCw size={14} className="animate-spin" /> Analisando itens e conferindo CNPJ com a ANVISA...
                  </div>
                )}
              </div>
            )}

            {/* Resultado da Extração da Nota Fiscal */}
            {notaExtraida && (
              <div className="space-y-4 animate-in fade-in">
                {/* Validação de CNPJ e Cabeçalho da Nota */}
                <div className="p-4 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 rounded-2xl space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-700/60 pb-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Nota Fiscal Nº</span>
                      <h4 className="text-base font-bold text-zinc-900 dark:text-white font-mono">{notaExtraida.numeroNota}</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Emissão</span>
                      <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">{new Date(notaExtraida.dataEmissao).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                    <div>
                      <p className="text-zinc-400 text-[11px]">Distribuidor / Emitente:</p>
                      <p className="font-bold text-zinc-800 dark:text-zinc-100">{notaExtraida.fornecedor.razaoSocial}</p>
                      <p className="font-mono text-[11px] text-zinc-500">CNPJ: {notaExtraida.fornecedor.cnpj}</p>
                    </div>
                    <div>
                      <p className="text-zinc-400 text-[11px]">Destinatário (Clínica):</p>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[11px] text-zinc-700 dark:text-zinc-300">{notaExtraida.destinatario.cnpjNota}</span>
                        {notaExtraida.destinatario.cnpjValido ? (
                          <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                            <Check size={10} /> CNPJ Bateu
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 flex items-center gap-1">
                            <AlertTriangle size={10} /> CNPJ Diferente
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-0.5">{notaExtraida.destinatario.razaoSocial}</p>
                    </div>
                  </div>

                  {/* Informação de Faturamento e Prazo de Pagamento (7 a 15 dias) */}
                  <div className="mt-2 pt-2 border-t border-zinc-200 dark:border-zinc-700/60 flex flex-wrap items-center justify-between text-xs bg-white dark:bg-zinc-800 p-2.5 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Clock size={15} className="text-amber-500" />
                      <div>
                        <span className="font-bold text-zinc-800 dark:text-zinc-200">Condição: {notaExtraida.faturamento.formaPagamento} ({notaExtraida.faturamento.prazoDias} dias)</span>
                        <p className="text-[11px] text-zinc-500">Vencimento em: <strong className="text-zinc-900 dark:text-white">{new Date(notaExtraida.faturamento.dataVencimento).toLocaleDateString('pt-BR')}</strong></p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-zinc-400">Total da Nota:</span>
                      <p className="font-heading font-bold text-base text-emerald-500">
                        R$ {Number(notaExtraida.valorTotalNota).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Checklist de Itens Chegados fisicamente na Clínica */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-heading font-bold text-xs text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <PackageCheck size={14} className="text-rd-cyan" /> Conferência Física de Mercadoria
                    </h5>
                    <span className="text-[11px] text-zinc-400">Marque os itens conferidos ao abrir as caixas</span>
                  </div>

                  <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-200 dark:divide-zinc-800 text-xs">
                    {notaExtraida.itens.map((it: any) => {
                      const conferido = itensConferidos[it.id];
                      return (
                        <div 
                          key={it.id} 
                          onClick={() => handleToggleConferencia(it.id)}
                          className={cn(
                            "p-3 flex items-center justify-between cursor-pointer transition-colors",
                            conferido ? "bg-emerald-500/5 dark:bg-emerald-500/10" : "bg-white dark:bg-zinc-900"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-5 h-5 rounded-md flex items-center justify-center border transition-all",
                              conferido ? "bg-emerald-500 text-white border-emerald-500" : "border-zinc-300 dark:border-zinc-600"
                            )}>
                              {conferido && <Check size={12} strokeWidth={3} />}
                            </div>
                            <div>
                              <p className="font-semibold text-zinc-900 dark:text-white">{it.descricao}</p>
                              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-2 mt-0.5 font-mono">
                                <span>Lote: {it.lote}</span>
                                <span>•</span>
                                <span>Val: {it.validade}</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="font-bold text-zinc-900 dark:text-white">
                              {it.quantidadeFaturada} {it.unidade}
                            </div>
                            <div className="text-[11px] text-zinc-400">
                              R$ {Number(it.valorTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {sucessoImportacao && (
                  <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-500 text-xs font-semibold text-center flex items-center justify-center gap-2">
                    <CheckCircle2 size={16} /> Estoque abastecido com sucesso e conta a pagar provisionada!
                  </div>
                )}

                {/* Botões de Ação */}
                <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => {
                      setNotaExtraida(null);
                      setArquivoSelecionado(null);
                    }}
                    className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  >
                    Trocar Arquivo
                  </button>
                  <button
                    type="button"
                    onClick={handleAprovarRecebimento}
                    disabled={sucessoImportacao}
                    className="px-5 py-2 bg-rd-cyan hover:bg-rd-cyan/90 text-zinc-950 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <PackageCheck size={15} /> Aprovar Recebimento & Abastecer Estoque
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
