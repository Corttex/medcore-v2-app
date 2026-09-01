"use client";

import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  Search, 
  Filter,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal
} from 'lucide-react';

// Mock de transações para mostrar na UI antes da API ficar pronta
const MOCK_TRANSACTIONS = [
  { id: '1', date: 'Hoje, 14:30', description: 'Consulta Cardiológica - João Silva', amount: 450.00, type: 'income', status: 'RECEIVED', method: 'PIX', invoice: 'Emitida' },
  { id: '2', date: 'Hoje, 10:15', description: 'Exame de Imagem - Maria Oliveira', amount: 1200.00, type: 'income', status: 'PENDING', method: 'CREDIT_CARD', invoice: 'Pendente' },
  { id: '3', date: 'Ontem, 16:45', description: 'Repasse Médico - Dr. Carlos', amount: 3500.00, type: 'expense', status: 'TRANSFERRED', method: 'PIX', invoice: '-' },
  { id: '4', date: 'Ontem, 09:00', description: 'Manutenção de Equipamentos', amount: 850.00, type: 'expense', status: 'RECEIVED', method: 'BOLETO', invoice: 'Recebida' }
];

export default function FinanceDashboard() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="flex-1 overflow-auto bg-neutral-900 min-h-screen text-white">
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-emerald-400" />
              Gestão Financeira
            </h1>
            <p className="text-neutral-400 mt-1">Visão geral de faturamento, repasses e notas fiscais.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg border border-neutral-700 font-medium transition-colors">
              Exportar Relatório
            </button>
            <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/20">
              <Plus className="w-4 h-4" />
              Nova Cobrança
            </button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-800/50 border border-neutral-700/50 p-6 rounded-2xl backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <TrendingUp className="w-16 h-16" />
            </div>
            <p className="text-neutral-400 text-sm font-medium mb-1">Receita (Mês Atual)</p>
            <h3 className="text-3xl font-bold text-white mb-2">R$ 145.200,00</h3>
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
              <ArrowUpRight className="w-4 h-4" />
              <span>+12.5% em relação ao mês anterior</span>
            </div>
          </div>

          <div className="bg-neutral-800/50 border border-neutral-700/50 p-6 rounded-2xl backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <TrendingDown className="w-16 h-16" />
            </div>
            <p className="text-neutral-400 text-sm font-medium mb-1">Despesas & Repasses</p>
            <h3 className="text-3xl font-bold text-white mb-2">R$ 42.850,00</h3>
            <div className="flex items-center gap-2 text-rose-400 text-sm font-medium">
              <ArrowDownRight className="w-4 h-4" />
              <span>+3.2% em relação ao mês anterior</span>
            </div>
          </div>

          <div className="bg-neutral-800/50 border border-neutral-700/50 p-6 rounded-2xl backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <FileText className="w-16 h-16" />
            </div>
            <p className="text-neutral-400 text-sm font-medium mb-1">Notas Fiscais Emitidas</p>
            <h3 className="text-3xl font-bold text-white mb-2">284</h3>
            <div className="flex items-center gap-2 text-blue-400 text-sm font-medium">
              <span>98% de automação Asaas</span>
            </div>
          </div>
        </div>

        {/* Transactions Table Area */}
        <div className="bg-neutral-800/30 border border-neutral-700/50 rounded-2xl overflow-hidden backdrop-blur-md">
          <div className="p-6 border-b border-neutral-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-white">Transações Recentes</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input 
                  type="text" 
                  placeholder="Buscar transação..." 
                  className="pl-9 pr-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-64"
                />
              </div>
              <button className="p-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg text-neutral-300 transition-colors">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-300">
              <thead className="text-xs uppercase bg-neutral-900/50 text-neutral-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Data</th>
                  <th className="px-6 py-4 font-medium">Descrição</th>
                  <th className="px-6 py-4 font-medium">Método</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Nota Fiscal</th>
                  <th className="px-6 py-4 font-medium text-right">Valor</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-700/50">
                {MOCK_TRANSACTIONS.map((txn) => (
                  <tr key={txn.id} className="hover:bg-neutral-800/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">{txn.date}</td>
                    <td className="px-6 py-4 font-medium text-white">{txn.description}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-neutral-700 rounded text-xs font-medium">{txn.method}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        txn.status === 'RECEIVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                        txn.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                        'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`text-xs ${txn.invoice === 'Emitida' ? 'text-emerald-400' : 'text-neutral-500'}`}>
                         {txn.invoice}
                       </span>
                    </td>
                    <td className={`px-6 py-4 text-right font-medium ${txn.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {txn.type === 'income' ? '+' : '-'} R$ {txn.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1 text-neutral-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-neutral-700/50 bg-neutral-900/30 text-center">
            <button className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
              Ver todas as transações
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
