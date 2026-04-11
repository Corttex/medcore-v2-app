'use client'

import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { ClipboardList, Users, Stethoscope, Clock } from 'lucide-react'

export default function WorkspaceDashboard() {
  return (
    <div className="flex flex-col">
      <DashboardHeader title="Área de Trabalho" subtitle="Atendimento ao paciente e operações clínicas" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          <StatCard title="Pacientes Hoje" value="8" icon={Users} trend="Total agendado" />
          <StatCard title="Triagens Pendentes" value="3" icon={ClipboardList} trend="Urgente" />
          <StatCard title="Atendimentos" value="12" icon={Stethoscope} trend="+2 concluídos" />
          <StatCard title="Fila de Espera" value="14 min" icon={Clock} trend="Média" />
        </div>

        <section className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold text-white mb-6">Próximos Atendimentos</h3>
            <div className="space-y-4">
              <PatientItem name="Maria Silva" time="14:30" type="Consulta Geral" status="waiting" />
              <PatientItem name="João Santos" time="15:00" type="Retorno Exame" status="confirmed" />
              <PatientItem name="Ana Oliveira" time="15:45" type="Telemedicina" status="confirmed" />
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Módulos de Apoio</h3>
            <div className="cc-card p-6 border-white/5 bg-slate-900/30 space-y-4">
              <ModuleLink name="Base de Conhecimento" active={true} />
              <ModuleLink name="Calculadoras Médicas" active={true} />
              <ModuleLink name="Estoque de Insumos" active={false} />
            </div>
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
        <span className="text-[10px] font-bold text-slate-500 bg-white/5 px-2 py-1 rounded-full">{trend}</span>
      </div>
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{title}</p>
        <h4 className="text-2xl font-black text-white mt-1">{value}</h4>
      </div>
    </div>
  )
}

interface PatientItemProps {
  name: string
  time: string
  type: string
  status: 'waiting' | 'confirmed'
}

function PatientItem({ name, time, type, status }: PatientItemProps) {
  return (
    <div className="cc-card p-4 border-white/5 bg-slate-900/40 flex items-center justify-between hover:border-teal-500/30 transition-all cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-teal-400">
          {name.charAt(0)}
        </div>
        <div>
          <span className="text-sm font-bold text-white block">{name}</span>
          <span className="text-[11px] text-slate-500">{type}</span>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <span className="text-xs font-black text-white block">{time}</span>
          <span className={`text-[9px] font-black uppercase tracking-widest ${status === 'waiting' ? 'text-amber-500' : 'text-teal-500'}`}>
            {status === 'waiting' ? 'Aguardando' : 'Confirmado'}
          </span>
        </div>
      </div>
    </div>
  )
}

interface ModuleLinkProps {
  name: string
  active: boolean
}

function ModuleLink({ name, active }: ModuleLinkProps) {
  return (
    <div className={`p-3 rounded-xl border flex items-center justify-between transition-all ${active ? 'border-white/5 bg-white/5 hover:bg-white/10' : 'border-red-500/10 bg-red-500/5 opacity-50 cursor-not-allowed'}`}>
      <span className="text-xs font-medium text-slate-300">{name}</span>
      <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-teal-400' : 'bg-red-400'}`} />
    </div>
  )
}
