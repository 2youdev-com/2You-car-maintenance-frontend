'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ClipboardList,
  Package,
  Users,
  Car,
  CalendarCheck,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
} from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/dashboard',   label: 'لوحة التحكم',  labelEn: 'Dashboard',   icon: LayoutDashboard },
  { href: '/maintenance', label: 'سجلات الصيانة', labelEn: 'Maintenance', icon: ClipboardList },
  { href: '/inventory',   label: 'المخزون',       labelEn: 'Inventory',   icon: Package },
  { href: '/customers',   label: 'العملاء',       labelEn: 'Customers',   icon: Users },
  { href: '/vehicles',    label: 'السيارات',      labelEn: 'Vehicles',    icon: Car },
  { href: '/appointments',label: 'المواعيد',      labelEn: 'Appointments',icon: CalendarCheck },
  { href: '/reports',     label: 'التقارير',      labelEn: 'Reports',     icon: BarChart3 },
  { href: '/chat',        label: 'المساعد الذكي', labelEn: 'AI Chat',     icon: Sparkles },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    document.cookie = 'token=; path=/; max-age=0'
    window.location.href = '/login'
  }

  const SidebarContent = () => (
    <aside className="flex flex-col h-full w-64 bg-surface-800 border-r border-white/[0.06]">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/[0.06]">
        <Image src="/logo.png" alt="El Amrety" width={140} height={42} priority />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'nav-item',
                active && 'active'
              )}
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={17} className={active ? 'text-brand-red' : ''} />
              <span className="font-arabic">{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-white/[0.06] space-y-0.5">
        <Link href="/settings" className="nav-item">
          <Settings size={17} />
          <span className="font-arabic">الإعدادات</span>
        </Link>
        <button onClick={handleLogout} className="nav-item w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
          <LogOut size={17} />
          <span className="font-arabic">تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  )

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:flex h-screen sticky top-0">
        <SidebarContent />
      </div>

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-5 left-5 z-40 w-12 h-12 rounded-full bg-brand-red text-white flex items-center justify-center shadow-xl glow-red"
      >
        <Menu size={20} />
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="lg:hidden fixed inset-y-0 right-0 z-50 flex animate-slide-in">
            <SidebarContent />
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 left-4 text-muted-foreground hover:text-foreground"
            >
              <X size={20} />
            </button>
          </div>
        </>
      )}
    </>
  )
}
