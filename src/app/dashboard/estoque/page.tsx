"use client";

import React, { useState, useEffect } from "react";
import { PackageSearch, AlertTriangle, ArrowUpRight, ArrowDownRight, Search, Plus, Filter, PackageOpen, MoreVertical } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

export default function EstoquePage() {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProdutos = async () => {
    try {
      const res = await fetch("/api/estoque/produtos");
      const json = await res.json();
      if (json.success) setProdutos(json.data);
    } catch (err) {
      console.error("Erro ao buscar produtos", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  const handleMovimentacao = async (tipo: "ENTRADA" | "SAIDA") => {
    if (produtos.length === 0) return alert("Nenhum produto cadastrado para movimentar.");
    
    // MVP: Window prompt simples para simular ação
    const lista = produtos.map((p, idx) => `[${idx}] ${p.nome} (Atual: ${p.estoqueAtual})`).join("\n");
    const idxStr = window.prompt(`Selecione o número do produto para ${tipo}:\n\n${lista}`);
    
    if (idxStr === null) return;
    const idx = parseInt(idxStr);
    
    if (isNaN(idx) || !produtos[idx]) return alert("Produto inválido.");
    const produto = produtos[idx];

    const qtdStr = window.prompt(`Quantidade para ${tipo} do produto "${produto.nome}":`);
    if (qtdStr === null) return;
    const qtd = parseInt(qtdStr);

    if (isNaN(qtd) || qtd <= 0) return alert("Quantidade inválida.");

    try {
      const res = await fetch("/api/estoque/movimentacoes", {
        method: "POST",
        body: JSON.stringify({
          produtoId: produto.id,
          tipo,
          quantidade: qtd,
          motivo: `Atualização manual de ${tipo} via Dashboard`
        })
      });
      const json = await res.json();
      
      if (json.success) {
        alert("Movimentação registrada com sucesso!");
        fetchProdutos();
      } else {
        alert(json.error || "Erro ao registrar movimentação.");
      }
    } catch (err) {
      alert("Erro ao conectar com API.");
    }
  };

  const filteredProdutos = produtos.filter(p => 
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItens = produtos.reduce((acc, p) => acc + p.estoqueAtual, 0);
  const itensEmAlerta = produtos.filter(p => p.status === "ALERTA" || p.status === "ESGOTADO").length;
  const valorEstoque = produtos.reduce((acc, p) => acc + (p.estoqueAtual * p.valorUnitario), 0);


  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20 pt-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-on-surface">Estoque Clínico</h1>
          <p className="text-sm text-on-surface-variant mt-1">Gerencie suprimentos, medicamentos e alertas de reposição.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleMovimentacao("SAIDA")} className="px-4 py-2 bg-surface-container border border-outline-variant hover:bg-surface-container-high transition-colors rounded-xl text-sm font-semibold text-on-surface flex items-center gap-2">
            <ArrowDownRight size={16} className="text-error" />
            Registrar Saída
          </button>
          <button onClick={() => handleMovimentacao("ENTRADA")} className="px-4 py-2 bg-rd-cyan hover:bg-rd-cyan/90 transition-colors rounded-xl text-sm font-semibold text-zinc-950 flex items-center gap-2 shadow-[0_0_15px_rgba(45,212,191,0.3)]">
            <ArrowUpRight size={16} />
            Nova Entrada
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={cn(
          "p-5 rounded-2xl border-2 transition-all shadow-sm",
          theme === 'dark' ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-zinc-200"
        )}>
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-rd-cyan/15 flex items-center justify-center text-rd-cyan border border-rd-cyan/20">
              <PackageSearch size={20} />
            </div>
          </div>
          <p className="text-sm font-medium text-on-surface-variant uppercase tracking-wider mb-1">Total de Itens (Volume)</p>
          <h3 className="text-3xl font-heading font-bold text-on-surface">{totalItens.toLocaleString('pt-BR')}</h3>
        </div>

        <div className={cn(
          "p-5 rounded-2xl border-2 transition-all shadow-sm",
          theme === 'dark' ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-zinc-200"
        )}>
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-500 border border-amber-500/20">
              <AlertTriangle size={20} />
            </div>
            {itensEmAlerta > 0 && <span className="text-xs font-semibold bg-error/10 text-error px-2 py-1 rounded-lg border border-error/20">Ação Requerida</span>}
          </div>
          <p className="text-sm font-medium text-on-surface-variant uppercase tracking-wider mb-1">Itens em Alerta</p>
          <h3 className="text-3xl font-heading font-bold text-on-surface">{itensEmAlerta}</h3>
        </div>

        <div className={cn(
          "p-5 rounded-2xl border-2 transition-all shadow-sm relative overflow-hidden",
          theme === 'dark' ? "bg-rd-cyan/5 border-rd-cyan/20" : "bg-rd-cyan/5 border-rd-cyan/20"
        )}>
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <PackageOpen size={100} />
          </div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
              <ArrowUpRight size={20} />
            </div>
          </div>
          <p className="text-sm font-medium text-rd-cyan uppercase tracking-wider mb-1 relative z-10">Valor em Estoque</p>
          <h3 className="text-3xl font-heading font-bold text-on-surface relative z-10">R$ {valorEstoque.toLocaleString('pt-BR', {minimumFractionDigits:2})}</h3>
        </div>
      </div>

      {/* Lista de Produtos */}
      <div className={cn(
        "rounded-2xl border-2 overflow-hidden shadow-sm",
        theme === 'dark' ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-zinc-200"
      )}>
        <div className="p-4 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface-container/30">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60" size={16} />
            <input 
              type="text" 
              placeholder="Buscar por SKU ou Nome..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-surface rounded-xl border border-outline-variant/50 focus:border-rd-cyan/50 focus:ring-1 focus:ring-rd-cyan/50 outline-none transition-all text-sm text-on-surface placeholder:text-on-surface-variant/40"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex items-center gap-2 px-3 py-2 border border-outline-variant/50 rounded-xl text-sm font-semibold text-on-surface hover:bg-surface-container transition-colors">
              <Filter size={16} />
              Filtrar
            </button>
            <button className="flex items-center gap-2 px-3 py-2 border border-rd-cyan/30 bg-rd-cyan/5 text-rd-cyan rounded-xl text-sm font-semibold hover:bg-rd-cyan/15 transition-colors">
              <Plus size={16} />
              Novo Produto
            </button>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={cn(
                "border-b border-outline-variant text-[11px] uppercase tracking-wider",
                theme === 'dark' ? "bg-zinc-900" : "bg-zinc-50"
              )}>
                <th className="p-4 font-semibold text-on-surface-variant">Produto</th>
                <th className="p-4 font-semibold text-on-surface-variant hidden md:table-cell">SKU</th>
                <th className="p-4 font-semibold text-on-surface-variant">Categoria</th>
                <th className="p-4 font-semibold text-on-surface-variant">Estoque</th>
                <th className="p-4 font-semibold text-on-surface-variant hidden sm:table-cell">Status</th>
                <th className="p-4 font-semibold text-on-surface-variant text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredProdutos.map((produto) => (
                <tr 
                  key={produto.id} 
                  className={cn(
                    "border-b border-outline-variant/50 hover:bg-surface-container/50 transition-colors group",
                    produto.status === "ESGOTADO" && (theme === 'dark' ? "bg-error/5" : "bg-error/5")
                  )}
                >
                  <td className="p-4">
                    <div className="font-semibold text-on-surface">{produto.nome}</div>
                    <div className="text-xs text-on-surface-variant md:hidden mt-0.5">SKU: {produto.sku}</div>
                  </td>
                  <td className="p-4 hidden md:table-cell text-on-surface-variant font-mono text-xs">{produto.sku}</td>
                  <td className="p-4">
                    <span className={cn(
                      "px-2 py-1 rounded-md text-sm font-bold border",
                      theme === 'dark' ? "bg-zinc-800 text-zinc-300 border-zinc-700" : "bg-zinc-100 text-zinc-600 border-zinc-200"
                    )}>
                      {produto.categoria}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "font-bold text-base",
                        produto.status === "ESGOTADO" ? "text-error" : 
                        produto.status === "ALERTA" ? "text-amber-500" : "text-on-surface"
                      )}>
                        {produto.estoqueAtual}
                      </span>
                      <span className="text-xs text-on-surface-variant">{produto.unidade}</span>
                    </div>
                    <div className="text-sm text-on-surface-variant/60 mt-0.5">Mín: {produto.estoqueMinimo} {produto.unidade}</div>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    {produto.status === "OK" && (
                      <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-lg text-sm font-bold flex items-center w-fit gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Adequado
                      </span>
                    )}
                    {produto.status === "ALERTA" && (
                      <span className="px-2 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-lg text-sm font-bold flex items-center w-fit gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div> Repor
                      </span>
                    )}
                    {produto.status === "ESGOTADO" && (
                      <span className="px-2 py-1 bg-error/10 text-error border border-error/20 rounded-lg text-sm font-bold flex items-center w-fit gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-error"></div> Esgotado
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-2 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-rd-cyan transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredProdutos.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-on-surface-variant text-sm">
                    Nenhum produto encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
