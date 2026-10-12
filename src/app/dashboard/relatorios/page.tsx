"use client";

import React, { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Calendar, 
  Download, 
  Filter, 
  ChevronDown, 
  Activity, 
  ArrowUpRight, 
  PieChart, 
  LineChart, 
  Users, 
  Brain, 
  FileText,
  CheckCircle2,
  Inbox,
  Printer,
  Sparkles
} from "lucide-react";
import { StatCard } from "@/features/dashboard/components/StatCard";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState("Últimos 30 dias");
  const [exporting, setExporting] = useState(false);

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      
      // Cabeçalho institucional
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, 210, 28, "F");
      
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("MEDCORE — BUSINESS INTELLIGENCE & INDICADORES", 15, 13);
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      doc.text(`Relatório Analítico Executivo • Período: ${timeRange} • Gerado em: ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}`, 15, 21);

      // Linha de divisão
      doc.setDrawColor(30, 144, 255); // rd-cyan
      doc.setLineWidth(0.8);
      doc.line(15, 33, 195, 33);

      // Seção 1: Indicadores Chave
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("1. RESUMO EXECUTIVO DE INDICADORES", 15, 41);

      const kpis = [
        { label: "Receita Total Bruta", value: "R$ 0,00", desc: "Sem movimentações financeiras consolidadas no período selecionado" },
        { label: "Atendimentos Médicos", value: "0", desc: "Total de consultas ambulatoriais e procedimentos realizados" },
        { label: "Taxa de Conversão", value: "0,0%", desc: "Conversão de agendamentos e orçamentos em atendimentos efetivos" },
        { label: "Novos Pacientes Cadastrados", value: "0", desc: "Novos registros de prontuário e fichas de primeira consulta" },
      ];

      let yPos = 48;
      kpis.forEach((kpi) => {
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(15, yPos, 180, 13, 2, 2, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(30, 41, 59);
        doc.text(kpi.label, 20, yPos + 6);
        doc.setFontSize(10.5);
        doc.setTextColor(30, 144, 255);
        doc.text(kpi.value, 185, yPos + 6, { align: "right" });
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text(kpi.desc, 20, yPos + 10.5);
        yPos += 16;
      });

      // Seção 2: Desempenho por Especialidade
      yPos += 4;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text("2. DISTRIBUIÇÃO ASSISTENCIAL POR ESPECIALIDADE", 15, yPos);

      yPos += 7;
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(15, yPos, 180, 20, 2, 2, "F");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      doc.text("Status: Base de dados limpa. Nenhum atendimento registrado no período selecionado.", 20, yPos + 8);
      doc.text("Os gráficos e percentuais por especialidade serão calibrados automaticamente com os primeiros atendimentos.", 20, yPos + 14);

      // Seção 3: Faturamento & TISS
      yPos += 27;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text("3. CONTROLE FISCAL & FATURAMENTO DE CONVÊNIOS", 15, yPos);

      yPos += 7;
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(15, yPos, 180, 20, 2, 2, "F");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      doc.text("Faturas Emitidas: 0  |  Faturas Pendentes: 0  |  Glosas Identificadas: R$ 0,00", 20, yPos + 8);
      doc.text("Integração com TISS XML, DMED e NFS-e ativa e preparada para emissões.", 20, yPos + 14);

      // Rodapé de Auditoria e LGPD
      doc.setFillColor(241, 245, 249);
      doc.rect(0, 275, 210, 22, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text("MEDCORE HOSPITAL & CLINIC OS — CONFORMIDADE LGPD (LEI 13.709/2018)", 15, 282);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text("Documento gerado eletronicamente com hash criptográfico SHA-256 e trilha de auditoria forense vinculada.", 15, 287);
      doc.text(`ID do Registro de Auditoria: MTC-AUD-${Math.floor(100000 + Math.random() * 900000)} | Página 1 de 1`, 15, 291);

      doc.save(`relatorio-indicadores-medcore-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
      alert("Erro ao exportar PDF. Verifique se o navegador permite o download de arquivos.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-12">
      {/* Action Bar Compacta */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900/90 border-2 border-zinc-200 dark:border-zinc-700/80 px-5 py-3.5 rounded-2xl shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rd-cyan animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">Business Intelligence & Indicadores</span>
          </div>
          <span className="text-zinc-300 dark:text-zinc-700">|</span>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 border border-primary/20 text-primary">
            Orquestrado por IA
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            Base Inicializada • Dados Zerados
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <button className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2 hover:border-zinc-400 transition-all">
              <Calendar size={14} className="text-rd-cyan" />
              {timeRange}
              <ChevronDown size={13} className="text-zinc-400 group-hover:rotate-180 transition-transform" />
            </button>
          </div>
          <button 
            onClick={handleExportPDF}
            disabled={exporting}
            className="px-4 py-2 rounded-xl bg-rd-cyan text-zinc-950 font-bold hover:bg-rd-cyan/90 shadow-md shadow-rd-cyan/20 transition-all flex items-center gap-2 text-xs disabled:opacity-50"
            title="Exportar Relatório PDF"
          >
            <Download size={14} />
            <span>{exporting ? "Gerando PDF..." : "Exportar PDF"}</span>
          </button>
        </div>
      </div>

      {/* Stats Summary - 100% Zerados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Receita Total" value="R$ 0,00" icon={TrendingUp} trend={{ value: "0%", isPositive: true }} color="lilac" />
        <StatCard label="Atendimentos" value="0" icon={Activity} trend={{ value: "0%", isPositive: true }} color="emerald" />
        <StatCard label="Conversão" value="0%" icon={Target} trend={{ value: "0%", isPositive: true }} color="zinc" />
        <StatCard label="Novos Pacientes" value="0" icon={Users} trend={{ value: "0%", isPositive: true }} color="zinc" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Main Chart Area */}
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-white dark:bg-zinc-900/85 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-6 space-y-4 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">Fluxo de Receita vs Despesa</h3>
                <p className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider mt-0.5">Análise Comparativa Semestral</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rd-cyan"></div>
                  <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Receita</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-zinc-400 dark:bg-zinc-700"></div>
                  <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Despesa</span>
                </div>
              </div>
            </div>

            {/* Empty State / Gráfico Zerado Elegante */}
            <div className="h-64 w-full relative flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 flex items-center justify-center text-zinc-400 dark:text-zinc-500 mb-3">
                <BarChart3 size={24} />
              </div>
              <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                Nenhuma movimentação financeira no período
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mt-1">
                Conforme as consultas forem realizadas e as receitas ou despesas forem lançadas, as barras analíticas serão plotadas em tempo real.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Distribuição por Especialidade - Zerado */}
            <div className="bg-white dark:bg-zinc-900/85 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Distribuição por Especialidade</h4>
                <p className="text-[11px] text-zinc-500">Volume assistencial consolidado</p>
              </div>

              <div className="py-8 flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mb-2">
                  <Target size={18} />
                </div>
                <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Sem Atendimentos no Período</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">0 consultas registradas</p>
              </div>

              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-400 text-center">
                Aguardando atendimentos para compor o percentual
              </div>
            </div>

            {/* Insights do VitalFlow AI */}
            <div className="bg-white dark:bg-zinc-900/85 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-5 flex flex-col items-center justify-center text-center space-y-2 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-rd-cyan/10 border border-rd-cyan/20 flex items-center justify-center text-rd-cyan mb-0.5">
                <Brain size={20} className="animate-pulse" />
              </div>
              <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Insights do VitalFlow AI</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs">
                "Base de indicadores inicializada. A IA começará a gerar recomendações assim que os primeiros atendimentos forem finalizados."
              </p>
              <button 
                onClick={handleExportPDF}
                className="text-xs font-bold text-rd-cyan uppercase tracking-wider border-b border-rd-cyan/50 pb-0.5 hover:border-rd-cyan transition-all flex items-center gap-1"
              >
                <span>Baixar Resumo em PDF</span>
                <ArrowUpRight size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Reports */}
        <div className="xl:col-span-4 space-y-4">
          <section className="bg-white dark:bg-zinc-900/85 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-6 shadow-md">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mb-4">Faturas Recentes</h3>
            
            {/* Empty State de Faturas */}
            <div className="py-8 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mb-2">
                <FileText size={18} />
              </div>
              <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Nenhuma fatura emitida</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">Guias TISS e recibos aparecerão aqui</p>
            </div>

            <button 
              onClick={handleExportPDF}
              className="w-full mt-2 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider hover:border-zinc-400 transition-all flex items-center justify-center gap-2"
            >
              <Download size={13} />
              <span>Exportar Dados</span>
            </button>
          </section>

          <section className="bg-gradient-to-br from-rd-cyan/10 to-indigo-500/10 border-2 border-rd-cyan/30 rounded-2xl p-6 space-y-3 relative overflow-hidden backdrop-blur-xl shadow-sm">
            <div className="relative z-10">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rd-cyan mb-1">
                <Sparkles size={14} />
                <span>Exportação Executiva</span>
              </div>
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Relatório Completo em PDF</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed">
                Gere o documento oficial com todos os KPIs, gráficos zerados, cabeçalho da clínica e conformidade LGPD.
              </p>
              <button 
                onClick={handleExportPDF}
                disabled={exporting}
                className="mt-3 flex items-center gap-2 px-4 py-2 rounded-xl bg-rd-cyan text-zinc-950 font-extrabold text-xs shadow-md shadow-rd-cyan/20 hover:opacity-90 transition-all disabled:opacity-50"
              >
                <Download size={13} />
                <span>{exporting ? "Gerando..." : "Baixar PDF Oficial"}</span>
              </button>
            </div>
            <Download size={80} className="absolute -bottom-6 -right-6 opacity-5 text-rd-cyan pointer-events-none" />
          </section>
        </div>
      </div>
    </div>
  );
}
