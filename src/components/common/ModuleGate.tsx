'use client'

import { useModules } from '@/contexts/ModuleContext'
import { Lock } from 'lucide-react'

interface ModuleGateProps {
  module: string
  children: React.ReactNode
  fallback?: 'hide' | 'lock' | 'modal'
}

export function ModuleGate({ module, children, fallback = 'lock' }: ModuleGateProps) {
  const { isModuleEnabled, loading } = useModules()

  if (loading) return null

  const isEnabled = isModuleEnabled(module)

  if (isEnabled) {
    return <>{children}</>
  }

  if (fallback === 'hide') {
    return null
  }

  if (fallback === 'lock') {
    return (
      <div className="relative group cursor-not-allowed">
        <div className="opacity-40 grayscale pointer-events-none">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-slate-900/80 p-2 rounded-full border border-teal-500/30 text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity">
            <Lock size={16} />
          </div>
        </div>
      </div>
    )
  }

  // Exemplo de modal seria melhor integrado a um context de UI
  return (
    <div className="cursor-pointer" onClick={() => alert('Este módulo é Premium. Faça upgrade para acessar!')}>
      <div className="opacity-40 grayscale">
        {children}
      </div>
    </div>
  )
}
