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
    <div className="min-h-screen bg-surface p-8 font-body animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-[--color-outline-variant]/30 pb-6">
          <h1 className="text-4xl font-bold tracking-tight text-[--color-rd-navy]">Analytics: Faturamento TISS</h1>
          <p className="text-[--color-on-surface-variant] mt-2 font-medium">Visão gerencial da clínica e performance de convênios.</p>
        </div>

        {/* KPIs Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel p-6 rounded-[2rem] flex items-center gap-5 hover:-translate-y-1 hover:shadow-xl hover:border-[--color-rd-navy]/20 transition-all duration-300 group cursor-default">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 flex items-center justify-center border border-blue-200 group-hover:scale-110 transition-transform">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-[--color-on-surface-variant] font-bold uppercase tracking-widest mb-1">Faturado Geral</p>
              <h2 className="text-2xl font-bold tracking-tighter text-[--color-rd-navy]">{formatCurrency(kpis.totalBruto)}</h2>
            </div>
          </div>
          
          <div className="glass-panel p-6 rounded-[2rem] flex items-center gap-5 hover:-translate-y-1 hover:shadow-xl hover:border-[--color-rd-navy]/20 transition-all duration-300 group cursor-default">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-50 text-[--color-rd-coral] flex items-center justify-center border border-orange-200 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-[--color-on-surface-variant] font-bold uppercase tracking-widest mb-1">Ticket Médio (Guia)</p>
              <h2 className="text-2xl font-bold tracking-tighter text-[--color-rd-navy]">{formatCurrency(kpis.ticketMedio)}</h2>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-[2rem] flex items-center gap-5 hover:-translate-y-1 hover:shadow-xl hover:border-[--color-rd-navy]/20 transition-all duration-300 group cursor-default">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-100 to-red-50 text-red-600 flex items-center justify-center border border-red-200 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-[--color-on-surface-variant] font-bold uppercase tracking-widest mb-1">Taxa de Glosa</p>
              <h2 className="text-2xl font-bold tracking-tighter text-[--color-rd-navy]">{kpis.glosaRate.toFixed(1)}%</h2>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-[2rem] flex items-center gap-5 hover:-translate-y-1 hover:shadow-xl hover:border-[--color-rd-navy]/20 transition-all duration-300 group cursor-default">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-100 to-cyan-50 text-[--color-rd-cyan] flex items-center justify-center border border-cyan-200 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-[--color-on-surface-variant] font-bold uppercase tracking-widest mb-1">Guias Emitidas</p>
              <h2 className="text-2xl font-bold tracking-tighter text-[--color-rd-navy]">{kpis.guiasEmitidas}</h2>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Evolução da Receita (Linha) */}
          <div className="lg:col-span-2 glass-panel rounded-[2rem] p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-6 bg-[--color-rd-cyan] rounded-full"></div>
              <h3 className="text-lg font-bold tracking-tight text-[--color-rd-navy]">Evolução do Faturamento</h3>
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
          <div className="glass-panel rounded-[2rem] p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-6 bg-[--color-rd-coral] rounded-full"></div>
              <h3 className="text-lg font-bold tracking-tight text-[--color-rd-navy]">Receita por Convênio</h3>
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
    </div>
  );
}
