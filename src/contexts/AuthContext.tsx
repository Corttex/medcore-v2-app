'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'
import type { Database } from '@/types/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    // Busca a sessão atual ativa
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Error fetching session', error)
      }
      
      setSession(session)
      setUser(session?.user || null)
      
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    }

    getSession()

    // Ouve mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session)
        setUser(session?.user || null)
        
        if (session?.user) {
           fetchProfile(session.user.id)
        } else {
           setProfile(null)
           setLoading(false)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
        
      if (error || !data) {
        console.warn('Profile fetch issue (will auto-create):', error?.message || error)
        
        // Auto-create or fallback setup
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({ id: userId, role: 'individual_user' })
          .select()
          .single()
          
        if (insertError) {
          console.error('Error creating default profile:', insertError.message || insertError)
          // Fallback na memória para quebrar o loop infinito de redirecionamento!
          setProfile({ 
            id: userId, 
            role: 'individual_user', 
            company_id: null, 
            email: null, 
            full_name: null, 
            pin: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
        } else {
          setProfile(newProfile)
        }
      } else {
        setProfile(data)
      }
    } catch (err) {
      console.error('Exception fetching profile:', err)
      // Ultimate Fallback
      setProfile({ 
        id: userId, 
        role: 'individual_user', 
        company_id: null, 
        email: null, 
        full_name: null, 
        pin: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
