'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Plus, Move, Share2, Save, Network, Cloud } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Node {
  id: string
  x: number
  y: number
  label: string
  subLabel?: string
  color?: string
  parentId?: string
}

export default function SectionMindMap() {
  const [viewMode, setViewMode] = useState<'cloud' | 'organogram'>('cloud')
  const [nodes, setNodes] = useState<Node[]>([
    { id: '1', x: 400, y: 100, label: 'Diretoria Clínica', subLabel: 'Nível 1 - Presidência', color: 'bg-indigo-600' },
    { id: '2', x: 250, y: 250, label: 'Almoxarifado', subLabel: 'Logística', parentId: '1' },
    { id: '3', x: 550, y: 250, label: 'Corpo Médico', subLabel: 'Operacional', parentId: '1' },
    { id: '4', x: 550, y: 400, label: 'Enfermagem', subLabel: 'Assistência', parentId: '3' },
  ])

  const [draggingNode, setDraggingNode] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-arrange for organogram
  useEffect(() => {
    if (viewMode === 'organogram') {
      const arrangedNodes = [...nodes]
      const levels: Record<string, number> = { '1': 0 }
      
      // Basic hierarchy calculation
      arrangedNodes.forEach(node => {
        if (node.parentId) levels[node.id] = (levels[node.parentId] || 0) + 1
      })

      const finalNodes = arrangedNodes.map(node => {
        const level = levels[node.id] || 0
        const siblings = arrangedNodes.filter(n => n.parentId === (node.parentId || ''))
        const index = siblings.findIndex(n => n.id === node.id)
        
        return {
          ...node,
          x: 400 + (index - (siblings.length - 1) / 2) * 250,
          y: 100 + level * 150
        }
      })
      setNodes(finalNodes)
    }
  }, [viewMode])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingNode || viewMode === 'organogram' || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setNodes(prev => prev.map(n => n.id === draggingNode ? { ...n, x, y } : n))
  }

  const addNode = () => {
    const id = Math.random().toString(36).substr(2, 9)
    const newNode: Node = {
      id,
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      label: 'Novo Elemento',
      subLabel: 'Personalizável',
      parentId: '1'
    }
    setNodes([...nodes, newNode])
  }

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Organogramas & Esquemas</h2>
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-black mt-1">BioFlow Estruturador Dinâmico</p>
        </div>
        
        <div className="flex items-center gap-4 bg-zinc-900/50 p-1.5 rounded-2xl border border-zinc-800">
          <button 
            onClick={() => setViewMode('cloud')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'cloud' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-zinc-500 hover:text-white'}`}
          >
            <Cloud size={14} /> Cloud
          </button>
          <button 
            onClick={() => setViewMode('organogram')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'organogram' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-zinc-500 hover:text-white'}`}
          >
            <Network size={14} /> Organograma
          </button>
        </div>

        <div className="flex gap-2">
          <button onClick={addNode} className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl hover:bg-indigo-500/20 transition-all border border-indigo-500/20">
            <Plus size={20} />
          </button>
          <button className="p-2.5 bg-zinc-800 text-zinc-400 rounded-xl hover:bg-zinc-700 transition-all border border-white/5">
            <Save size={20} />
          </button>
        </div>
      </div>

      <div 
        ref={containerRef}
        className="flex-1 bg-zinc-950/40 rounded-[32px] border border-zinc-800/50 relative overflow-hidden cursor-crosshair backdrop-blur-sm"
        onMouseMove={handleMouseMove}
        onMouseUp={() => setDraggingNode(null)}
      >
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {nodes.filter(n => n.parentId).map((node) => {
            const parent = nodes.find(n => n.id === node.parentId)
            if (!parent) return null

            return (
              <motion.path 
                key={node.id}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                d={`M ${parent.x} ${parent.y} L ${node.x} ${node.y}`}
                stroke="rgba(99, 102, 241, 0.15)"
                strokeWidth="2"
                fill="none"
              />
            )
          })}
        </svg>

        <AnimatePresence>
          {nodes.map((node) => (
            <motion.div
              key={node.id}
              layout
              onMouseDown={() => setDraggingNode(node.id)}
              style={{ left: node.x, top: node.y, position: 'absolute' }}
              className={`-translate-x-1/2 -translate-y-1/2 p-5 rounded-2xl border cursor-move select-none transition-shadow active:scale-95 ${node.color || 'bg-zinc-900/80 border-white/10'} shadow-2xl hover:shadow-indigo-500/10 min-w-[180px] backdrop-blur-xl group z-10`}
            >
              <div className="flex flex-col gap-1">
                 <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em]">{node.subLabel}</span>
                 <span className="text-sm font-bold text-white leading-tight group-hover:text-indigo-300 transition-colors">{node.label}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="absolute bottom-8 left-8 flex items-center gap-6 py-3 px-6 bg-zinc-900/90 backdrop-blur-2xl border border-zinc-800 rounded-2xl shadow-2xl">
           <div className="flex items-center gap-3">
              <Move size={14} className="text-indigo-400" />
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                {viewMode === 'cloud' ? 'Livre para Organizar' : 'Grid Hierárquico Ativo'}
              </span>
           </div>
           <div className="w-[1px] h-4 bg-zinc-800" />
           <div className="flex items-center gap-3 cursor-pointer hover:text-white transition-colors">
              <Share2 size={14} className="text-indigo-400" />
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Compartilhar</span>
           </div>
        </div>
      </div>
    </div>
  )
}
