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
  signInWithGoogle: () => Promise<void>
  verifyPin: (userId: string, pin: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  signInWithGoogle: async () => {},
  verifyPin: async (_userId: string, _pin: string) => false,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    // Busca a sessão ativa
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user || null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    }
    getSession()

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
    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()
        
      if (error) {
        console.error('AuthContext: Database error:', error.message)
        // Fallback profile is set below
      }

      if (data) {
        setProfile(data)
      } else {
        // Se não houver perfil no banco, usamos um fallback seguro
        setProfile({
          id: userId,
          role: 'individual_user',
          full_name: 'Usuário (Modo Residência)',
          email: user?.email || '',
          company_id: null,
          created_at: new Date().toISOString()
        } as Profile)
      }
    } catch (err) {
      console.error('Exception fetching profile:', err)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  const verifyPin = async (userId: string, pin: string): Promise<boolean> => {
    const { data, error } = await supabase
      .rpc('verify_user_pin', { p_user_id: userId, p_pin: pin })
    
    if (error) {
      console.error('PIN verification error:', error)
      return false
    }
    return !!data
  }

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signOut, signInWithGoogle, verifyPin }}>
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
