'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!profile || (profile.role !== 'individual_user' && profile.role !== 'super_admin'))) {
      router.push('/')
    }
  }, [profile, loading, router])

  if (loading || !profile || (profile.role !== 'individual_user' && profile.role !== 'super_admin')) {
    return (
      <div style={{ minHeight: '100vh', background: '#0D0A1A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid rgba(168,85,247,0.25)', borderTopColor: '#A855F7', borderRadius: '50%', animation: 'ccSpin 1s linear infinite' }} />
      </div>
    )
  }

  return <>{children}</>
}
