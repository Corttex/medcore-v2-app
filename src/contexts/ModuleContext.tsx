'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useAuth } from './AuthContext'



interface ModuleContextType {
  activeModules: string[]
  loading: boolean
  isModuleEnabled: (_moduleId: string) => boolean
}

const ModuleContext = createContext<ModuleContextType>({
  activeModules: [],
  loading: true,
  isModuleEnabled: (_moduleId: string) => false,
})

export function ModuleProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useAuth()
  const [activeModules, setActiveModules] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchModules = async () => {
      if (!profile?.company_id) {
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('company_modules')
          .select('module_id')
          .eq('company_id', profile.company_id)
          .eq('is_active', true)

        if (error) throw error

        setActiveModules(data.map(m => m.module_id))
      } catch (err) {
        console.error('Error fetching company modules:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchModules()
  }, [profile?.company_id])

  const isModuleEnabled = (moduleId: string) => {
    return activeModules.includes(moduleId)
  }

  return (
    <ModuleContext.Provider value={{ activeModules, loading, isModuleEnabled }}>
      {children}
    </ModuleContext.Provider>
  )
}

export const useModules = () => useContext(ModuleContext)
