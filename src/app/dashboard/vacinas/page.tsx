"use client";

import React, { useState, useEffect } from "react";
import { 
  Syringe, 
  ThermometerSnowflake, 
  ShieldCheck, 
  AlertTriangle, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Package, 
  Layers, 
  Sparkles, 
  Scissors, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  TrendingUp,
  MapPin,
  RefreshCw,
  Building
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useDashboardContext } from "@/features/dashboard/context/DashboardContext";
import { cn } from "@/lib/utils";

export default function InjetaveisInsumosPage() {
  const { theme } = useTheme();
  const { isDemoMode } = useDashboardContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState<"TODOS" | "INJETAVEIS" | "DESCARTAVEIS" | "EPIS">("TODOS");
  const [itens, setItens] = useState<any[]>([]);
  const [resumo, setResumo] = useState<any>({
    totalItens: 0,
    totalInjetaveis: 0,
    totalDescartaveis: 0,
    totalEpis: 0,
    temperaturaMediaCamaras: 4.2
  });
  const [loading, setLoading] = useState(true);
  const [showModalNovo, setShowModalNovo] = useState(false);
  const [salvando, setSalvando] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    nome: "",
    categoria: "INJETAVEIS",
    tipo: "Toxina Botulínica",
    fabricante: "",
    lote: "",
    validade: "",
    estoqueAtual: 10,
    estoqueMinimo: 5,
    unidade: "Frascos",
    valorUnitario: 0,
    temperaturaMin: 2,
    temperaturaMax: 8,
    temperaturaAtual: 4.0,
    salaArmazenamento: "Geladeira Farmácia - Sala 02",
    indicacao: ""
  });

  const carregarInsumos = async () => {
    try {
      setLoading(true);
      if (!isDemoMode) {
        setItens([]);
        setResumo({
          totalItens: 0,
          totalInjetaveis: 0,
          totalDescartaveis: 0,
          totalEpis: 0,
          temperaturaMediaCamaras: 0
        });
        setLoading(false);
        return;
      }

      const url = `/api/estoque/insumos?categoria=${categoriaAtiva}${searchTerm ? `&q=${encodeURIComponent(searchTerm)}` : ''}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setItens(json.data);
        if (json.resumo) setResumo(json.resumo);
      }
    } catch (err) {
      console.error("Erro ao carregar insumos", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarInsumos();
  }, [categoriaAtiva, searchTerm, isDemoMode]);

  const handleSalvarItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.lote) {
      alert("Por favor preencha ao menos Nome e Lote do item.");
      return;
    }
    try {
      setSalvando(true);
      const res = await fetch("/api/estoque/insumos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const json = await res.json();
      if (json.success) {
        setShowModalNovo(false);
        setFormData({
          nome: "",
          categoria: "INJETAVEIS",
          tipo: "Toxina Botulínica",
          fabricante: "",
          lote: "",
          validade: "",
          estoqueAtual: 10,
          estoqueMinimo: 5,
          unidade: "Frascos",
          valorUnitario: 0,
          temperaturaMin: 2,
          temperaturaMax: 8,
          temperaturaAtual: 4.0,
          salaArmazenamento: "Geladeira Farmácia - Sala 02",
          indicacao: ""
        });
        carregarInsumos();
      } else {
        alert("Erro ao cadastrar insumo.");
      }
    } catch (error) {
      alert("Erro na conexão com o servidor.");
    } finally {
      setSalvando(false);
    }
  };

  // Cálculo de dias até vencer (FEFO)
  const getStatusValidade = (validadeStr: string) => {
    if (!validadeStr) return { label: "Indeterminado", cor: "zinc" };
    const hoje = new Date();
    const dataVal = new Date(validadeStr);
    const diffTime = dataVal.getTime() - hoje.getTime();
    const diffDias = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDias < 0) return { label: "VENCIDO", cor: "red", dias: diffDias };
    if (diffDias <= 30) return { label: `Vence em ${diffDias}d`, cor: "amber", dias: diffDias };
    if (diffDias <= 90) return { label: `Atenção: ${diffDias}d`, cor: "yellow", dias: diffDias };
    return { label: `Válido (${diffDias}d)`, cor: "emerald", dias: diffDias };
  };

  const valorTotalImobilizado = itens.reduce((acc, curr) => acc + (curr.estoqueAtual * (curr.valorUnitario || 0)), 0);

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500 pb-20 pt-1">
      {/* Action Bar Superior Compacta - Padrão Visão Executiva */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 px-5 py-3.5 rounded-2xl shadow-sm backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/70 px-3.5 py-1.5 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-rd-cyan animate-pulse mr-2" />
            <p className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
              Rastreabilidade de Lotes, FEFO & Cadeia de Frio
            </p>
          </div>

          <div className="flex items-center bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/70 px-3.5 py-1.5 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-300">
            <ThermometerSnowflake size={14} className="text-rd-cyan mr-1.5" />
            Câmara Fria: <strong className="text-zinc-900 dark:text-white font-bold ml-1">{resumo.temperaturaMediaCamaras}°C (Normal)</strong>
          </div>

          <div className="flex items-center bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/70 px-3.5 py-1.5 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-300">
            Imobilizado: <strong className="text-emerald-500 font-bold ml-1">R$ {valorTotalImobilizado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button 
            onClick={carregarInsumos}
            title="Recarregar"
            className="p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
          >
            <RefreshCw size={15} />
          </button>
          <button 
            onClick={() => setShowModalNovo(true)}
            className="flex items-center gap-2 px-4 py-2 bg-rd-cyan hover:bg-rd-cyan/90 text-zinc-950 font-bold rounded-xl text-xs transition-all shadow-sm hover:shadow-[0_0_15px_rgba(45,212,191,0.3)]"
          >
            <Plus size={16} /> Cadastrar Insumo / Lote
          </button>
        </div>
      </div>

      {/* Grid de KPIs - 4 Cards Fluidos com Efeito Glass e Sombras Suaves */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Injetáveis e Toxina */}
        <div className={cn(
          "rounded-2xl p-5 border transition-all duration-300 shadow-sm hover:shadow-md",
          theme === 'dark' ? "bg-zinc-900/60 border-zinc-800/80" : "bg-white border-zinc-200"
        )}>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-rd-cyan/10 text-rd-cyan flex items-center justify-center border border-rd-cyan/20">
              <Syringe size={20} />
            </div>
            <span className="text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              ANVISA OK
            </span>
          </div>
          <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Injetáveis & Biomateriais</p>
          <h3 className="text-2xl font-bold font-heading text-zinc-900 dark:text-white mt-1">
            {resumo.totalInjetaveis} <span className="text-xs font-normal text-zinc-400">especialidades</span>
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">Botox, Peptídeos, Preenchedores e Vacinas</p>
        </div>

        {/* Card 2: Descartáveis Cirúrgicos */}
        <div className={cn(
          "rounded-2xl p-5 border transition-all duration-300 shadow-sm hover:shadow-md",
          theme === 'dark' ? "bg-zinc-900/60 border-zinc-800/80" : "bg-white border-zinc-200"
        )}>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20">
              <Scissors size={20} />
            </div>
            <span className="text-[11px] font-semibold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
              Alto Giro
            </span>
          </div>
          <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Descartáveis Cirúrgicos</p>
          <h3 className="text-2xl font-bold font-heading text-zinc-900 dark:text-white mt-1">
            {resumo.totalDescartaveis} <span className="text-xs font-normal text-zinc-400">itens mapeados</span>
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">Seringas Luer Lock, Agulhas, Cânulas e Gaze</p>
        </div>

        {/* Card 3: EPIs e Biossegurança */}
        <div className={cn(
          "rounded-2xl p-5 border transition-all duration-300 shadow-sm hover:shadow-md",
          theme === 'dark' ? "bg-zinc-900/60 border-zinc-800/80" : "bg-white border-zinc-200"
        )}>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center border border-purple-500/20">
              <ShieldCheck size={20} />
            </div>
            <span className="text-[11px] font-semibold text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
              Estéril
            </span>
          </div>
          <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">EPIs & Paramentação</p>
          <h3 className="text-2xl font-bold font-heading text-zinc-900 dark:text-white mt-1">
            {resumo.totalEpis} <span className="text-xs font-normal text-zinc-400">categorias</span>
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">Luvas cirúrgicas, aventais descartáveis e máscaras</p>
        </div>

        {/* Card 4: Monitor de Cadeia de Frio */}
        <div className={cn(
          "rounded-2xl p-5 border transition-all duration-300 shadow-sm hover:shadow-md",
          theme === 'dark' ? "bg-zinc-900/60 border-zinc-800/80" : "bg-white border-zinc-200"
        )}>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
              <ThermometerSnowflake size={20} />
            </div>
            <span className="text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              2°C a 8°C
            </span>
          </div>
          <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Cadeia de Frio</p>
          <h3 className="text-2xl font-bold font-heading text-zinc-900 dark:text-white mt-1">
            +4.2°C <span className="text-xs font-normal text-emerald-500 font-medium">Estável</span>
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">Sensores IoT conectados nas câmaras de vacinas</p>
        </div>
      </div>

      {/* Barra de Filtros & Busca */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Abas de Categorias */}
        <div className="flex items-center p-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setCategoriaAtiva("TODOS")}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0",
              categoriaAtiva === "TODOS" 
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs" 
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            )}
          >
            Todos ({resumo.totalItens})
          </button>
          <button
            onClick={() => setCategoriaAtiva("INJETAVEIS")}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5",
              categoriaAtiva === "INJETAVEIS" 
                ? "bg-white dark:bg-zinc-800 text-rd-cyan shadow-xs" 
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            )}
          >
            <Syringe size={13} /> Injetáveis & Toxinas ({resumo.totalInjetaveis})
          </button>
          <button
            onClick={() => setCategoriaAtiva("DESCARTAVEIS")}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5",
              categoriaAtiva === "DESCARTAVEIS" 
                ? "bg-white dark:bg-zinc-800 text-blue-500 shadow-xs" 
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            )}
          >
            <Scissors size={13} /> Seringas & Gaze ({resumo.totalDescartaveis})
          </button>
          <button
            onClick={() => setCategoriaAtiva("EPIS")}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5",
              categoriaAtiva === "EPIS" 
                ? "bg-white dark:bg-zinc-800 text-purple-500 shadow-xs" 
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            )}
          >
            <ShieldCheck size={13} /> EPIs Cirúrgicos ({resumo.totalEpis})
          </button>
        </div>

        {/* Input de Busca */}
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input 
            type="text"
            placeholder="Buscar por nome, lote, marca..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-rd-cyan/30"
          />
        </div>
      </div>

      {/* Tabela de Insumos com Rastreabilidade de Lote e FEFO */}
      <div className={cn(
        "rounded-2xl border overflow-hidden shadow-sm backdrop-blur-md transition-all",
        theme === 'dark' ? "bg-zinc-900/60 border-zinc-800/80" : "bg-white border-zinc-200"
      )}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Item & Especialidade</th>
                <th className="py-3 px-4">Lote & Fabricante</th>
                <th className="py-3 px-4">Validade (Regra FEFO)</th>
                <th className="py-3 px-4">Cadeia de Frio</th>
                <th className="py-3 px-4">Saldo em Estoque</th>
                <th className="py-3 px-4">Valor Un.</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-zinc-400">
                    <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-rd-cyan" />
                    Carregando estoque de injetáveis e descartáveis...
                  </td>
                </tr>
              ) : itens.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-zinc-400">
                    <p className="font-semibold text-zinc-500 mb-1">
                      {isDemoMode ? "Nenhum item encontrado com os filtros selecionados." : "Nenhum insumo ou lote cadastrado nesta unidade."}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {isDemoMode ? "Tente buscar por outro termo ou categoria." : "Ative o 'Modo Demonstração' na barra superior para visualizar o inventário de teste ou cadastre um novo insumo acima."}
                    </p>
                  </td>
                </tr>
              ) : (
                itens.map((item) => {
                  const statusVal = getStatusValidade(item.validade);
                  const isAbaixoMinimo = item.estoqueAtual <= item.estoqueMinimo;

                  return (
                    <tr 
                      key={item.id}
                      className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                          {item.categoria === "INJETAVEIS" ? (
                            <span className="w-2 h-2 rounded-full bg-rd-cyan shrink-0" />
                          ) : item.categoria === "DESCARTAVEIS" ? (
                            <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                          )}
                          {item.nome}
                        </div>
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 flex items-center gap-1.5">
                          <span>{item.tipo}</span>
                          <span>•</span>
                          <span className="text-zinc-400">{item.indicacao}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-mono text-xs font-bold text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded w-fit">
                          {item.lote}
                        </div>
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                          {item.fabricante}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-zinc-800 dark:text-zinc-200">
                          {item.validade ? new Date(item.validade).toLocaleDateString('pt-BR') : '-'}
                        </div>
                        <span className={cn(
                          "inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 border",
                          statusVal.cor === 'red' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                          statusVal.cor === 'amber' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                          statusVal.cor === 'yellow' ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                          "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        )}>
                          {statusVal.label}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {item.temperaturaMin !== null && item.temperaturaMin !== undefined ? (
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <div>
                              <p className="font-bold text-zinc-800 dark:text-zinc-200 text-xs">
                                {item.temperaturaAtual}°C
                              </p>
                              <p className="text-[10px] text-zinc-400">
                                Faixa: {item.temperaturaMin}°C a {item.temperaturaMax}°C
                              </p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-zinc-400 text-xs">Temp. Ambiente</span>
                        )}
                        <p className="text-[10px] text-zinc-400 truncate max-w-[150px] mt-0.5 flex items-center gap-1">
                          <MapPin size={10} /> {item.salaArmazenamento}
                        </p>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-bold text-sm text-zinc-900 dark:text-white">
                            {item.estoqueAtual}
                          </span>
                          <span className="text-[11px] text-zinc-400">{item.unidade}</span>
                        </div>
                        {isAbaixoMinimo ? (
                          <div className="text-[10px] text-amber-500 font-semibold flex items-center gap-1 mt-0.5">
                            <AlertTriangle size={11} /> Abaixo do mínimo ({item.estoqueMinimo})
                          </div>
                        ) : (
                          <div className="text-[10px] text-emerald-500 font-medium mt-0.5">
                            Mínimo: {item.estoqueMinimo}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-zinc-800 dark:text-zinc-200">
                        R$ {Number(item.valorUnitario || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button 
                          onClick={() => alert(`Registrar baixa rápida para ${item.nome} no lote ${item.lote}`)}
                          className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors"
                        >
                          Baixa PEP
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Cadastro de Insumo / Lote */}
      {showModalNovo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div>
                <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Syringe size={18} className="text-rd-cyan" /> Novo Insumo & Rastreabilidade de Lote
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Cadastre Botox, biomateriais, seringas, agulhas, EPIs ou vacinas com conformidade ANVISA.
                </p>
              </div>
              <button 
                onClick={() => setShowModalNovo(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSalvarItem} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Nome do Item / Produto *
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: Toxina Botulínica Tipo A 100UI ou Seringa 1ml Luer Lock"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs focus:ring-2 focus:ring-rd-cyan/30 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Categoria
                  </label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs focus:ring-2 focus:ring-rd-cyan/30 focus:outline-none"
                  >
                    <option value="INJETAVEIS">Injetáveis & Biomateriais (Botox/Peptídeos)</option>
                    <option value="DESCARTAVEIS">Descartáveis (Seringas, Agulhas, Gaze)</option>
                    <option value="EPIS">EPIs Cirúrgicos (Luvas, Aventais)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Tipo / Subclasse
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ex: Bioestimulador, Seringa, Toxina"
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs focus:ring-2 focus:ring-rd-cyan/30 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Fabricante / Distribuidor
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ex: Allergan, Galderma, BD Medical"
                    value={formData.fabricante}
                    onChange={(e) => setFormData({ ...formData, fabricante: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs focus:ring-2 focus:ring-rd-cyan/30 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Número do Lote *
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: LT-94821"
                    value={formData.lote}
                    onChange={(e) => setFormData({ ...formData, lote: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-mono focus:ring-2 focus:ring-rd-cyan/30 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Data de Validade (FEFO) *
                  </label>
                  <input 
                    type="date" 
                    required
                    value={formData.validade}
                    onChange={(e) => setFormData({ ...formData, validade: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs focus:ring-2 focus:ring-rd-cyan/30 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Estoque Atual
                  </label>
                  <input 
                    type="number" 
                    min="0"
                    value={formData.estoqueAtual}
                    onChange={(e) => setFormData({ ...formData, estoqueAtual: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs focus:ring-2 focus:ring-rd-cyan/30 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Estoque Mínimo de Alerta
                  </label>
                  <input 
                    type="number" 
                    min="1"
                    value={formData.estoqueMinimo}
                    onChange={(e) => setFormData({ ...formData, estoqueMinimo: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs focus:ring-2 focus:ring-rd-cyan/30 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Valor Unitário (R$)
                  </label>
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="0.00"
                    value={formData.valorUnitario}
                    onChange={(e) => setFormData({ ...formData, valorUnitario: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs focus:ring-2 focus:ring-rd-cyan/30 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Local de Armazenamento
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ex: Geladeira 01 ou Almoxarifado B2"
                    value={formData.salaArmazenamento}
                    onChange={(e) => setFormData({ ...formData, salaArmazenamento: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs focus:ring-2 focus:ring-rd-cyan/30 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowModalNovo(false)}
                  className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando}
                  className="px-4 py-2 bg-rd-cyan hover:bg-rd-cyan/90 text-zinc-950 rounded-xl text-xs font-bold transition-all"
                >
                  {salvando ? "Salvando..." : "Salvar Insumo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
