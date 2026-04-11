'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CalendarPlus, Package, Wrench, Loader2, Clock, User } from 'lucide-react'
import { apiFetch } from '@/lib/api'

interface UserProfile {
  id: string
  full_name: string
  email: string
  phone: string | null
}

export default function CustomerHomePage() {
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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-brand-red" />
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-5 animate-fade-in">
      {/* Welcome */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-brand-red/20 border border-brand-red/30 flex items-center justify-center text-brand-red text-lg font-bold shrink-0">
            {user?.full_name?.charAt(0) || '؟'}
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-arabic">أهلاً بك</p>
            <h1 className="text-lg font-bold text-foreground font-arabic">{user?.full_name}</h1>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground font-arabic px-1">الخدمات</h2>
        <div className="grid grid-cols-1 gap-3">
          <Link href="/customer/booking" className="glass-card p-4 flex items-center gap-4 hover:border-brand-red/30 hover:bg-brand-red/5 transition-all group">
            <div className="w-11 h-11 rounded-xl bg-brand-red/15 flex items-center justify-center group-hover:bg-brand-red/25 transition-colors">
              <CalendarPlus size={20} className="text-brand-red" />
            </div>
            <div>
              <p className="text-sm font-semibold font-arabic text-foreground">حجز موعد صيانة</p>
              <p className="text-[11px] text-muted-foreground font-arabic">احجز موعدك في أقرب فرع</p>
            </div>
          </Link>

          <Link href="/customer/products" className="glass-card p-4 flex items-center gap-4 hover:border-brand-red/30 hover:bg-brand-red/5 transition-all group">
            <div className="w-11 h-11 rounded-xl bg-blue-500/15 flex items-center justify-center group-hover:bg-blue-500/25 transition-colors">
              <Package size={20} className="text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-semibold font-arabic text-foreground">المنتجات والأسعار</p>
              <p className="text-[11px] text-muted-foreground font-arabic">تصفح قطع الغيار والزيوت</p>
            </div>
          </Link>

          <Link href="/customer/maintenance" className="glass-card p-4 flex items-center gap-4 hover:border-brand-red/30 hover:bg-brand-red/5 transition-all group">
            <div className="w-11 h-11 rounded-xl bg-green-500/15 flex items-center justify-center group-hover:bg-green-500/25 transition-colors">
              <Wrench size={20} className="text-green-400" />
            </div>
            <div>
              <p className="text-sm font-semibold font-arabic text-foreground">سجل صيانتي</p>
              <p className="text-[11px] text-muted-foreground font-arabic">سجّل وتابع صيانة سيارتك</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Center Info */}
      <div className="glass-card p-4">
        <h3 className="text-xs font-semibold text-muted-foreground font-arabic mb-3">فروعنا</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-arabic text-foreground">
            <Clock size={13} className="text-brand-red shrink-0" />
            <span>فرع شارع سعد زغلول — المنصورة</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-arabic text-foreground">
            <Clock size={13} className="text-brand-red shrink-0" />
            <span>فرع شارع قناة السويس — المنصورة</span>
          </div>
        </div>
      </div>
    </div>
  )
}
