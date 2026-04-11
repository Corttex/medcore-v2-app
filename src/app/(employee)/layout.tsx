'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { DashboardShell } from '@/components/dashboard/DashboardShell'

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!profile || (profile.role !== 'employee' && profile.role !== 'company_admin' && profile.role !== 'super_admin'))) {
      router.push('/')
    }
  }, [profile, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(20,184,166,0.3)]"></div>
      </div>
    )
  }

  if (!profile || (profile.role !== 'employee' && profile.role !== 'company_admin' && profile.role !== 'super_admin')) {
    return null
  }

  return <DashboardShell>{children}</DashboardShell>
}
