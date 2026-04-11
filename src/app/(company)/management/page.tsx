'use client'

import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { Users, CreditCard, Box, Settings } from 'lucide-react'

export default function ManagementDashboard() {
  return (
    <div className="flex flex-col">
      <DashboardHeader title="Painel da Unidade" subtitle="Gestão administrativa e operacional da empresa" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
        <StatCard title="Total Colaboradores" value="12" icon={Users} trend="Estável" />
        <StatCard title="Faturamento/Mês" value="R$ 14.500" icon={CreditCard} trend="+5.4%" />
        <StatCard title="Módulos Ativos" value="3/12" icon={Box} trend="Upgrade disponível" />
        <StatCard title="Performance" value="84%" icon={Settings} trend="Boa" />
      </div>

      <section className="mt-12">
        <h3 className="text-xl font-bold text-white mb-6">Ativador de Módulos (Seu Plano)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ModuleCard name="Telemedicina" active={true} premium={true} />
          <ModuleCard name="Gestão de Estoque" active={true} premium={false} />
          <ModuleCard name="Prontuário Avançado" active={false} premium={true} />
          <ModuleCard name="Faturamento Convênios" active={false} premium={true} />
        </div>
      </section>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ElementType
  trend: string
}

function StatCard({ title, value, icon: Icon, trend }: StatCardProps) {
  return (
    <div className="cc-card p-6 flex flex-col gap-4 border-white/5 bg-slate-900/30">
      <div className="flex justify-between items-start">
        <div className="p-3 bg-teal-500/10 rounded-xl">
          <Icon className="text-teal-400" size={20} />
        </div>
        <span className="text-[10px] font-bold text-teal-400 bg-teal-400/5 px-2 py-1 rounded-full">{trend}</span>
      </div>
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{title}</p>
        <h4 className="text-2xl font-black text-white mt-1">{value}</h4>
      </div>
    </div>
  )
}

interface ModuleCardProps {
  name: string
  active: boolean
  premium: boolean
}

function ModuleCard({ name, active, premium }: ModuleCardProps) {
  return (
    <div className={`cc-card p-5 border-white/5 flex items-center justify-between ${active ? 'bg-slate-900/40' : 'bg-slate-950/40 opacity-60'}`}>
      <div className="flex items-center gap-4">
        <div className={`w-3 h-3 rounded-full ${active ? 'bg-teal-400' : 'bg-slate-700'}`} />
        <div>
          <span className="text-sm font-bold text-white block">{name}</span>
          {premium && <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Premium</span>}
        </div>
      </div>
      <button className={`text-[10px] font-bold px-4 py-2 rounded-lg transition-all ${active ? 'bg-white/5 text-slate-400' : 'bg-teal-600 text-white'}`}>
        {active ? 'ATIVO' : 'ATIVAR AGORA'}
      </button>
    </div>
  )
}
