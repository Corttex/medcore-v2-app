'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { Building2, Users, Package, UsersRound } from 'lucide-react'

export default function AdminDashboard() {
  const supabase = createClient()
  const [stats, setStats] = useState({
    companies: 0 as number,
    users: 0 as number,
    modules: 0 as number,
    teams: 0 as number,
    loading: true as boolean,
  })
  const [showDemoAccess, setShowDemoAccess] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from('system_settings').select('value').eq('key', 'show_demo_access').single()
      if (data) setShowDemoAccess(data.value === true)
    }

    async function fetchStats() {
      const [
        { count: companies },
        { count: users },
        { count: modules },
        { count: teams }
      ] = await Promise.all([
        supabase.from('companies').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('modules').select('*', { count: 'exact', head: true }),
        supabase.from('teams').select('*', { count: 'exact', head: true })
      ])

      setStats({
        companies: companies || 0,
        users: users || 0,
        modules: modules || 0,
        teams: teams || 0,
        loading: false
      })
    }
    fetchStats()
    fetchSettings()
  }, [])

  const toggleDemoAccess = async () => {
    setIsUpdating(true)
    const newValue = !showDemoAccess
    const { error } = await supabase
      .from('system_settings')
      .update({ value: newValue })
      .eq('key', 'show_demo_access')
    
    if (!error) setShowDemoAccess(newValue)
    setIsUpdating(false)
  }

  return (
    <div className="flex flex-col">
      <DashboardHeader title="Painel Geral (SuperAdmin)" subtitle="Gestão global da infraestrutura MedCore" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
        <StatCard title="Empresas Ativas" value={stats.loading ? '...' : stats.companies} icon={Building2} trend="+3 este mês" />
        <StatCard title="Total Usuários" value={stats.loading ? '...' : stats.users} icon={Users} trend="+12% YoY" />
        <StatCard title="Módulos Ativos" value={stats.loading ? '...' : stats.modules} icon={Package} trend="Estável" />
        <StatCard title="Total de Times" value={stats.loading ? '...' : stats.teams} icon={UsersRound} trend="Global" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        <section>
          <h3 className="text-xl font-bold text-white mb-6">Configurações do Portal</h3>
          <div className="cc-card p-6 border-white/10 bg-slate-900/40 backdrop-blur-xl">
             <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Acesso Rápido (Modo Demo)</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Exibir atalhos diretos para os painéis na tela de login.</p>
                </div>
                <button 
                  onClick={toggleDemoAccess}
                  disabled={isUpdating}
                  className={`w-12 h-6 rounded-full transition-all relative ${showDemoAccess ? 'bg-teal-500' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${showDemoAccess ? 'left-7' : 'left-1'}`} />
                </button>
             </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-bold text-white mb-6">Controle de Módulos Globais</h3>
          <div className="cc-card p-6 border-white/10 bg-slate-900/40 backdrop-blur-xl">
             <p className="text-slate-400 text-sm">Gerenciamento de SKUs e disponibilidade por região em breve.</p>
          </div>
        </section>
      </div>
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
