'use client'

import { Car, Clock, Wrench, Package, QrCode, LogOut, Loader2, Inbox } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { apiFetch } from '@/lib/api'

interface UserProfile {
  id: string
  full_name: string
  email: string
  phone: string | null
  role: string
}

export default function CustomerPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch<UserProfile>('/auth/me')
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('token')
        document.cookie = 'token=; path=/; max-age=0'
        router.push('/login')
      })
      .finally(() => setLoading(false))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    document.cookie = 'token=; path=/; max-age=0'
    window.location.href = '/login'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-brand-red" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in py-6 px-4">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Image src="/logo.svg" alt="El Amrety" width={120} height={36} priority />
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors font-arabic">
          <LogOut size={16} />
          تسجيل الخروج
        </button>
      </div>

      {/* Header card */}
      <div className="glass-card p-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-brand-red/20 border border-brand-red/30 flex items-center justify-center text-brand-red text-xl font-bold shrink-0">
          {user?.full_name?.charAt(0) || '؟'}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-foreground font-arabic">{user?.full_name}</h1>
          <p className="text-sm text-muted-foreground font-arabic">{user?.phone || user?.email} · عميل مركز العمريطي</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-surface-600 flex items-center justify-center shrink-0">
          <QrCode size={22} className="text-muted-foreground" />
        </div>
      </div>

      {/* Service History — empty state */}
      <div className="glass-card overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.06]">
          <Wrench size={16} className="text-brand-red" />
          <h2 className="font-semibold text-foreground font-arabic">سجل الصيانة</h2>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Inbox size={32} className="mb-3 opacity-40" />
          <p className="text-sm font-arabic">لا توجد سجلات صيانة بعد</p>
        </div>
      </div>

      {/* Parts Catalog — empty state */}
      <div className="glass-card overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.06]">
          <Package size={16} className="text-brand-red" />
          <h2 className="font-semibold text-foreground font-arabic">كتالوج قطع الغيار</h2>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Inbox size={32} className="mb-3 opacity-40" />
          <p className="text-sm font-arabic">لا توجد قطع غيار حالياً</p>
        </div>
      </div>
    </div>
  )
}
