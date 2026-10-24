"use client";

import React, { useState, useEffect } from "react";
import { 
  PackageSearch, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  Plus, 
  Filter, 
  PackageOpen, 
  ShoppingCart, 
  TrendingUp, 
  Sparkles,
  Layers,
  Box,
  RefreshCw,
  Clock,
  ArrowRight
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useDashboardContext } from "@/features/dashboard/context/DashboardContext";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Micro-gráfico Sparkline integrado no padrão da Visão Executiva
const SparklineMini = ({ data, color = "cyan" }: { data: number[]; color?: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 28;
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={width} height={height} className="overflow-visible opacity-80">
      <polyline
        fill="none"
        stroke={color === "emerald" ? "#10b981" : color === "amber" ? "#f59e0b" : "#2dd4bf"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

export default function EstoquePage() {
  const { theme } = useTheme();
  const { isDemoMode } = useDashboardContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Produtos iniciais caso a base esteja vazia
  const produtosExemplo = [
    { id: "p1", nome: "Toxina Botulínica Tipo A 100UI", sku: "MED-BTX-100", categoria: "Injetáveis", estoqueAtual: 14, estoqueMinimo: 8, valorUnitario: 890.00, consumoSemanal: [18, 16, 20, 14], status: "OK" },
    { id: "p2", nome: "Dysport 300UI", sku: "MED-DYSP-300", categoria: "Injetáveis", estoqueAtual: 4, estoqueMinimo: 6, valorUnitario: 720.00, consumoSemanal: [10, 8, 5, 4], status: "ALERTA" },
    { id: "p3", nome: "Seringa 1ml BD Luer Lock", sku: "MED-SER-1ML", categoria: "Descartáveis", estoqueAtual: 85, estoqueMinimo: 150, valorUnitario: 3.40, consumoSemanal: [180, 140, 110, 85], status: "ALERTA" },
    { id: "p4", nome: "Agulha de Precisão 30G x 4mm", sku: "MED-AGU-30G", categoria: "Descartáveis", estoqueAtual: 450, estoqueMinimo: 150, valorUnitario: 1.10, consumoSemanal: [520, 480, 460, 450], status: "OK" },
    { id: "p5", nome: "Luva Cirúrgica Estéril Nº 7.5", sku: "MED-LUV-75", categoria: "EPIs", estoqueAtual: 20, estoqueMinimo: 50, valorUnitario: 4.80, consumoSemanal: [70, 55, 30, 20], status: "ALERTA" },
    { id: "p6", nome: "Compressa Gaze Estéril 7.5cm", sku: "MED-GAZ-75", categoria: "Descartáveis", estoqueAtual: 850, estoqueMinimo: 200, valorUnitario: 1.80, consumoSemanal: [980, 920, 890, 850], status: "OK" },
    { id: "p7", nome: "Ácido Hialurônico Reticulado 1ml", sku: "MED-AH-1ML", categoria: "Injetáveis", estoqueAtual: 22, estoqueMinimo: 10, valorUnitario: 480.00, consumoSemanal: [25, 20, 24, 22], status: "OK" }
  ];

  const fetchProdutos = async () => {
    try {
      setLoading(true);
      if (!isDemoMode) {
        setProdutos([]);
        setLoading(false);
        return;
      }

      const res = await fetch("/api/estoque/produtos");
      const json = await res.json();
      if (json.success && json.data && json.data.length > 0) {
        setProdutos(json.data);
      } else {
        setProdutos(produtosExemplo);
      }
    } catch (err) {
      console.error("Erro ao buscar produtos", err);
      setProdutos(isDemoMode ? produtosExemplo : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, [isDemoMode]);

  const handleMovimentacao = async (tipo: "ENTRADA" | "SAIDA") => {
    if (produtos.length === 0) return alert("Nenhum produto cadastrado para movimentar.");
    const lista = produtos.map((p, idx) => `[${idx}] ${p.nome} (Atual: ${p.estoqueAtual})`).join("\n");
    const idxStr = window.prompt(`Selecione o número do produto para ${tipo}:\n\n${lista}`);
    if (idxStr === null) return;
    const idx = parseInt(idxStr);
    if (isNaN(idx) || !produtos[idx]) return alert("Produto inválido.");
    const produto = produtos[idx];

    const qtdStr = window.prompt(`Quantidade para ${tipo} de "${produto.nome}":`);
    if (qtdStr === null) return;
    const qtd = parseInt(qtdStr);
    if (isNaN(qtd) || qtd <= 0) return alert("Quantidade inválida.");

    // Atualização local imediata responsiva
    const atualizados = produtos.map((p, i) => {
      if (i === idx) {
        const novoEstoque = tipo === "ENTRADA" ? p.estoqueAtual + qtd : Math.max(0, p.estoqueAtual - qtd);
        return {
          ...p,
          estoqueAtual: novoEstoque,
          status: novoEstoque <= p.estoqueMinimo ? "ALERTA" : "OK"
        };
      }
      return p;
    });
    setProdutos(atualizados);
    alert(`Movimentação de ${tipo} registrada com sucesso para ${produto.nome}!`);
  };

  const filteredProdutos = produtos.filter(p => 
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalItens = produtos.reduce((acc, p) => acc + (p.estoqueAtual || 0), 0);
  const itensEmAlerta = produtos.filter(p => (p.estoqueAtual || 0) <= (p.estoqueMinimo || 0));
  const valorEstoque = produtos.reduce((acc, p) => acc + ((p.estoqueAtual || 0) * (p.valorUnitario || 0)), 0);

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500 pb-20 pt-1">
      {/* Action Bar Superior Compacta - Padrão Visão Executiva */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 px-5 py-3.5 rounded-2xl shadow-sm backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/70 px-3.5 py-1.5 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-rd-cyan animate-pulse mr-2" />
            <p className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
              <strong className="text-rd-cyan font-bold">{totalItens.toLocaleString('pt-BR')}</strong> unidades em almoxarifado
            </p>
          </div>

          {itensEmAlerta.length > 0 ? (
            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-xl text-amber-500 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              {itensEmAlerta.length} itens abaixo do estoque mínimo
            </div>
          ) : (
            <div className="flex items-center bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/70 px-3.5 py-1.5 rounded-xl text-xs font-medium text-emerald-500">
              Estoque 100% Regular
            </div>
          )}

          <div className="flex items-center bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/70 px-3.5 py-1.5 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-300">
            Patrimônio Imobilizado: <strong className="text-emerald-500 font-bold ml-1">R$ {valorEstoque.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleMovimentacao("SAIDA")} 
            className="px-3.5 py-2 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors rounded-xl text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5"
          >
            <ArrowDownRight size={14} className="text-rose-500" /> Registrar Saída
          </button>
          <button 
            onClick={() => handleMovimentacao("ENTRADA")} 
            className="px-4 py-2 bg-rd-cyan hover:bg-rd-cyan/90 transition-colors rounded-xl text-xs font-bold text-zinc-950 flex items-center gap-1.5 shadow-[0_0_15px_rgba(45,212,191,0.3)]"
          >
            <ArrowUpRight size={14} /> Entrada Manual
          </button>
        </div>
      </div>

      {/* Grid de KPIs - 4 Cards Fluidos com Efeito Glass e Sombras Suaves */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Volume */}
        <div className={cn(
          "rounded-2xl p-5 border transition-all duration-300 shadow-sm hover:shadow-md",
          theme === 'dark' ? "bg-zinc-900/60 border-zinc-800/80" : "bg-white border-zinc-200"
        )}>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-rd-cyan/10 text-rd-cyan flex items-center justify-center border border-rd-cyan/20">
              <PackageSearch size={20} />
            </div>
            <SparklineMini data={[300, 320, 310, 345, 380]} color="cyan" />
          </div>
          <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Volume Físico Total</p>
          <h3 className="text-2xl font-bold font-heading text-zinc-900 dark:text-white mt-1">
            {totalItens.toLocaleString('pt-BR')} <span className="text-xs font-normal text-zinc-400">itens</span>
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">Almoxarifado central e salas cirúrgicas</p>
        </div>

        {/* Card 2: Alertas */}
        <div className={cn(
          "rounded-2xl p-5 border transition-all duration-300 shadow-sm hover:shadow-md",
          theme === 'dark' ? "bg-zinc-900/60 border-zinc-800/80" : "bg-white border-zinc-200"
        )}>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
              <AlertTriangle size={20} />
            </div>
            {itensEmAlerta.length > 0 && (
              <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                Ponto de Pedido
              </span>
            )}
          </div>
          <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Abaixo do Mínimo</p>
          <h3 className="text-2xl font-bold font-heading text-zinc-900 dark:text-white mt-1">
            {itensEmAlerta.length} <span className="text-xs font-normal text-amber-500 font-semibold">reposições necessárias</span>
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">Risco iminente de ruptura de atendimento</p>
        </div>

        {/* Card 3: Valor Imobilizado */}
        <div className={cn(
          "rounded-2xl p-5 border transition-all duration-300 shadow-sm hover:shadow-md",
          theme === 'dark' ? "bg-zinc-900/60 border-zinc-800/80" : "bg-white border-zinc-200"
        )}>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
              <TrendingUp size={20} />
            </div>
            <SparklineMini data={[12000, 14500, 16000, 17200, valorEstoque]} color="emerald" />
          </div>
          <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Capital em Estoque</p>
          <h3 className="text-2xl font-bold font-heading text-zinc-900 dark:text-white mt-1">
            R$ {valorEstoque.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">Valor contábil atual de insumos</p>
        </div>

        {/* Card 4: Atalho Central de Compras */}
        <Link 
          href="/dashboard/compras"
          className={cn(
            "rounded-2xl p-5 border transition-all duration-300 shadow-sm hover:shadow-md group block",
            theme === 'dark' ? "bg-zinc-900/60 border-zinc-800/80 hover:border-rd-cyan/50" : "bg-white border-zinc-200 hover:border-rd-cyan/50"
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center border border-purple-500/20 group-hover:scale-105 transition-transform">
              <ShoppingCart size={20} />
            </div>
            <ArrowRight size={16} className="text-zinc-400 group-hover:text-rd-cyan transition-colors" />
          </div>
          <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Central de Compras</p>
          <h3 className="text-xl font-bold font-heading text-zinc-900 dark:text-white mt-1 flex items-center gap-1.5">
            Leitor de NF (IA) <Sparkles size={16} className="text-rd-cyan" />
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">Carregar XML/PDF e faturamento 7-15 dias</p>
        </Link>
      </div>

      {/* Alerta de Sugestão de Reposição Automática */}
      {itensEmAlerta.length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h4 className="font-heading font-bold text-xs text-zinc-900 dark:text-white uppercase tracking-wider">
                Sugestão de Reposição Automática do Algoritmo
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-0.5">
                Existem <strong>{itensEmAlerta.length} itens</strong> com estoque abaixo da margem de segurança clínica: {itensEmAlerta.map(i => i.nome).join(", ")}.
              </p>
            </div>
          </div>
          <Link 
            href="/dashboard/compras"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-xl text-xs transition-colors shrink-0 flex items-center gap-1.5"
          >
            <ShoppingCart size={14} /> Gerar Ordem de Compra
          </Link>
        </div>
      )}

      {/* Barra de Busca de Produtos */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input 
            type="text"
            placeholder="Pesquisar produto por nome, código SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-rd-cyan/30"
          />
        </div>
        <div className="text-xs text-zinc-400">
          Exibindo {filteredProdutos.length} de {produtos.length} insumos
        </div>
      </div>

      {/* Tabela de Produtos no Padrão Executivo */}
      <div className={cn(
        "rounded-2xl border overflow-hidden shadow-sm backdrop-blur-md transition-all",
        theme === 'dark' ? "bg-zinc-900/60 border-zinc-800/80" : "bg-white border-zinc-200"
      )}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Item & SKU</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4">Tendência de Consumo</th>
                <th className="py-3 px-4">Saldo em Estoque</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Valor Un.</th>
                <th className="py-3 px-4">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {filteredProdutos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-zinc-400">
                    <p className="font-semibold text-zinc-500 mb-1">
                      {isDemoMode ? "Nenhum produto encontrado com os filtros selecionados." : "Nenhum produto cadastrado no almoxarifado desta unidade."}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {isDemoMode ? "Tente buscar por outro termo ou SKU." : "Ative o 'Modo Demonstração' na barra superior para visualizar os itens de teste ou registre uma Entrada Manual acima."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredProdutos.map((p) => {
                const isCritico = (p.estoqueAtual || 0) <= (p.estoqueMinimo || 0);
                return (
                  <tr key={p.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100">{p.nome}</div>
                      <div className="font-mono text-[11px] text-zinc-400 mt-0.5">{p.sku || "SKU-GERAL"}</div>
                    </td>

                    <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-300">
                      <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-md text-[11px] font-medium">
                        {p.categoria}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <SparklineMini data={p.consumoSemanal || [10, 8, 12, p.estoqueAtual]} color={isCritico ? "amber" : "cyan"} />
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-heading font-bold text-sm text-zinc-900 dark:text-white">
                        {p.estoqueAtual}
                      </div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">
                        Mínimo seguro: {p.estoqueMinimo}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {isCritico ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                          <AlertTriangle size={10} /> Comprar Reposição
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                          Estoque Regular
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-zinc-700 dark:text-zinc-300">
                      R$ {Number(p.valorUnitario || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-zinc-900 dark:text-white">
                      R$ {((p.estoqueAtual || 0) * (p.valorUnitario || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
