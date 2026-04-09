'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { DashboardShell } from '@/components/dashboard/DashboardShell'

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!profile || (profile.role !== 'company_admin' && profile.role !== 'super_admin'))) {
      router.push('/')
    }
  }, [profile, loading, router])

  if (loading || !profile || (profile.role !== 'company_admin' && profile.role !== 'super_admin')) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return <DashboardShell>{children}</DashboardShell>
}
