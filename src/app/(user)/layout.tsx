'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // When loading ends, if profile is null or wrong role, redirect to login
    if (!loading && (!profile || (profile.role !== 'individual_user' && profile.role !== 'super_admin'))) {
      router.push('/')
    }
  }, [profile, loading, router])

  // Show spinner only while loading; if done and no valid profile, redirect will happen
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#030712', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid rgba(13,148,136,0.25)', borderTopColor: '#0D9488', borderRadius: '50%', animation: 'ccSpin 1s linear infinite' }} />
      </div>
    )
  }

  if (!profile || (profile.role !== 'individual_user' && profile.role !== 'super_admin')) {
    return null // redirect is already triggered in useEffect
  }

  return <>{children}</>
}
