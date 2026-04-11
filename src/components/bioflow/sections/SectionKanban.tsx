'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, MoreHorizontal, Layout, Calendar, Briefcase, CheckCircle2, MessageSquare } from 'lucide-react'

interface KanbanItem {
  id: string
  title: string
  type: 'process' | 'meeting' | 'demand'
  status: 'todo' | 'doing' | 'done'
  date: string
  comments?: number
}

const INITIAL_ITEMS: KanbanItem[] = [
  { id: '1', title: 'Auditoria Mensal de Vales', type: 'process', status: 'todo', date: '12 Out', comments: 3 },
  { id: '2', title: 'Check-up de Staff Oncológico', type: 'meeting', status: 'doing', date: 'Hoje', comments: 5 },
  { id: '3', title: 'Implementar Nova Triagem', type: 'demand', status: 'doing', date: 'Amanhã', comments: 12 },
  { id: '4', title: 'Treinamento Residentes', type: 'process', status: 'done', date: 'Concluído', comments: 8 },
]

export function SectionKanban() {
  const [items] = useState<KanbanItem[]>(INITIAL_ITEMS)

  const columns = [
    { id: 'todo', title: 'A FAZER', color: 'text-zinc-400' },
    { id: 'doing', title: 'EM ANDAMENTO', color: 'text-indigo-400' },
    { id: 'done', title: 'CONCLUÍDO', color: 'text-emerald-400' },
  ] as const

  const getIcon = (type: KanbanItem['type']) => {
    switch (type) {
      case 'process': return <Layout size={14} className="text-blue-400" />
      case 'meeting': return <Calendar size={14} className="text-purple-400" />
      case 'demand': return <Briefcase size={14} className="text-orange-400" />
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Hub Interligado</h2>
          <p className="text-zinc-500 text-sm">Gerencie reuniões, processos e demandas em um só lugar.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl transition-all text-sm font-medium">
          <Plus size={18} />
          Novo Item
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-6 h-full overflow-x-auto pb-4 custom-scrollbar">
        {columns.map((col) => (
          <div key={col.id} className="flex-shrink-0 w-80 flex flex-col h-full bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black uppercase tracking-widest ${col.color}`}>{col.title}</span>
                <span className="bg-zinc-800 text-zinc-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {items.filter(i => i.status === col.id).length}
                </span>
              </div>
              <button className="text-zinc-600 hover:text-white transition-colors">
                <MoreHorizontal size={16} />
              </button>
            </div>

            <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1">
              {items.filter(i => i.status === col.id).map((item) => (
                <motion.div
                  layoutId={item.id}
                  key={item.id}
                  className="bg-zinc-800/40 border border-zinc-700/50 p-4 rounded-xl hover:border-zinc-600/50 transition-all group cursor-pointer"
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider bg-zinc-900/50 px-2 py-1 rounded-md flex items-center gap-2">
                      {getIcon(item.type)}
                      {item.type}
                    </span>
                    <button className="text-zinc-600 group-hover:text-zinc-400 opacity-0 group-hover:opacity-100 transition-all">
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                  
                  <h4 className="text-white font-medium text-sm mb-4 line-clamp-2 leading-relaxed">
                    {item.title}
                  </h4>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3 text-[10px] text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {item.date}
                      </span>
                      {item.comments && (
                        <span className="flex items-center gap-1 text-indigo-400/80">
                          <MessageSquare size={12} />
                          {item.comments}
                        </span>
                      )}
                    </div>
                    {col.id === 'done' && <CheckCircle2 size={16} className="text-emerald-500" />}
                  </div>
                </motion.div>
              ))}
              
              <button className="w-full py-2 border border-dashed border-zinc-800 rounded-xl text-zinc-600 hover:text-zinc-400 hover:border-zinc-700 text-xs font-medium transition-all mt-2">
                + Adicionar Card
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
