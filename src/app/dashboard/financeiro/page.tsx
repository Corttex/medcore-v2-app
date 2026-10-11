'use client';

import React, { useEffect, useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { DollarSign, TrendingUp, AlertTriangle, FileText } from 'lucide-react';

const COLORS = ['#0F2C59', '#FF5A5F', '#00A9FF', '#F59E0B'];

// Custom Tooltip para o Recharts (Estética Glassmorphism)
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-4 rounded-xl border border-[--color-rd-navy]/20 shadow-xl backdrop-blur-md bg-white/90">
        {label && <p className="text-xs font-bold text-[--color-on-surface-variant] mb-1">{label}</p>}
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <p className="text-sm font-semibold text-[--color-rd-navy]">
              {entry.name}: <span className="font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(entry.value)}</span>
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function FinanceiroDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/financeiro/kpis')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface">
        <p className="text-sm font-bold tracking-widest uppercase text-[--color-on-surface-variant] animate-pulse">Carregando Analytics...</p>
      </div>
    );
  }

  const { kpis, chartLinha, chartPizza } = data;

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Action Bar Superior Compacta - Sem Duplicação de H1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900/90 border-2 border-zinc-200 dark:border-zinc-700/80 px-5 py-3.5 rounded-2xl shadow-sm backdrop-blur-md">
        {/* Lado Esquerdo: Contadores Dinâmicos */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/70 px-3.5 py-1.5 rounded-xl">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              <strong className="text-rd-cyan font-bold">{kpis.guiasEmitidas}</strong> guias auditadas
            </p>
          </div>
          <div className="flex items-center bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/70 px-3.5 py-1.5 rounded-xl text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Faturado: <strong className="text-emerald-500 font-bold ml-1">{formatCurrency(kpis.totalBruto)}</strong>
          </div>
          <div className="flex items-center bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/70 px-3.5 py-1.5 rounded-xl text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Taxa de Glosa: <strong className="text-amber-500 font-bold ml-1">{kpis.glosaRate.toFixed(1)}%</strong>
          </div>
        </div>

        {/* Lado Direito: Info Resumida */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/70 px-3.5 py-1.5 rounded-xl text-xs text-zinc-500 dark:text-zinc-400">
            Ticket Médio / Guia: <span className="font-bold text-zinc-900 dark:text-white ml-1">{formatCurrency(kpis.ticketMedio)}</span>
          </div>
        </div>
      </div>

      {/* KPIs Cards Liquid Glass */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative overflow-hidden bg-white dark:bg-zinc-900/85 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-blue-500/50 transition-all duration-300 group cursor-default">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] via-transparent to-black/[0.1] pointer-events-none" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest mb-0.5">Faturado Geral</p>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">{formatCurrency(kpis.totalBruto)}</h2>
            </div>
          </div>
        </div>
        
        <div className="relative overflow-hidden bg-white dark:bg-zinc-900/85 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-orange-500/50 transition-all duration-300 group cursor-default">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] via-transparent to-black/[0.1] pointer-events-none" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center border border-orange-500/20 group-hover:scale-110 transition-transform shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest mb-0.5">Ticket Médio (Guia)</p>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">{formatCurrency(kpis.ticketMedio)}</h2>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-white dark:bg-zinc-900/85 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-rose-500/50 transition-all duration-300 group cursor-default">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] via-transparent to-black/[0.1] pointer-events-none" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center border border-rose-500/20 group-hover:scale-110 transition-transform shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest mb-0.5">Taxa de Glosa</p>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">{kpis.glosaRate.toFixed(1)}%</h2>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-white dark:bg-zinc-900/85 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-rd-cyan/50 transition-all duration-300 group cursor-default">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] via-transparent to-black/[0.1] pointer-events-none" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-rd-cyan flex items-center justify-center border border-cyan-500/20 group-hover:scale-110 transition-transform shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest mb-0.5">Guias Emitidas</p>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">{kpis.guiasEmitidas}</h2>
            </div>
          </div>
        </div>
      </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Evolução da Receita (Linha) */}
          <div className="lg:col-span-2 bg-white dark:bg-zinc-900/85 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-3xl p-6 shadow-sm hover:border-rd-cyan/40 transition-all">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-6 bg-[--color-rd-cyan] rounded-full"></div>
              <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">Evolução do Faturamento</h3>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartLinha} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} dy={10} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}}
                    tickFormatter={(val) => `R$${val/1000}k`}
                    dx={-10}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 2, strokeDasharray: '3 3' }} />
                  <Line 
                    type="monotone" 
                    dataKey="receita" 
                    name="Receita"
                    stroke="var(--color-rd-cyan)" 
                    strokeWidth={4}
                    dot={{r: 5, fill: 'var(--color-rd-navy)', strokeWidth: 3, stroke: '#fff'}}
                    activeDot={{r: 8, fill: 'var(--color-rd-cyan)', stroke: '#fff', strokeWidth: 3}}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Divisão por Convênio (Pizza) */}
          <div className="bg-white dark:bg-zinc-900/85 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-3xl p-6 shadow-sm hover:border-rd-cyan/40 transition-all">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-6 bg-[--color-rd-coral] rounded-full"></div>
              <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">Receita por Convênio</h3>
            </div>
            <div className="h-[350px] w-full flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartPizza}
                    cx="50%"
                    cy="45%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                    animationDuration={1500}
                  >
                    {chartPizza.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    wrapperStyle={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-rd-navy)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
    </div>
  );
}
