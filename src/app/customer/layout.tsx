'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Home, CalendarPlus, Package, Wrench, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/customer',             label: 'الرئيسية', icon: Home },
  { href: '/customer/booking',     label: 'حجز موعد', icon: CalendarPlus },
  { href: '/customer/products',    label: 'المنتجات', icon: Package },
  { href: '/customer/maintenance', label: 'صيانتي',   icon: Wrench },
]

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const handleLogout = () => {
    localStorage.removeItem('token')
    document.cookie = 'token=; path=/; max-age=0'
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-surface-900 flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-surface-800/80 backdrop-blur-xl border-b border-white/[0.06] px-4 py-3 flex items-center justify-between">
        <Image src="/logo.png" alt="2Y Cars" width={110} height={33} priority
          onError={(e) => { (e.target as HTMLImageElement).src = '/logo.svg' }} />
        <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors font-arabic">
          <LogOut size={14} />
          خروج
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 pb-20 lg:pb-6">
        {children}
      </main>

      {/* Bottom nav (mobile) + Desktop nav */}
      <nav className="fixed bottom-0 inset-x-0 z-30 bg-surface-800/90 backdrop-blur-xl border-t border-white/[0.06] lg:sticky lg:bottom-auto lg:top-[53px] lg:border-t-0 lg:border-b">
        <div className="flex items-center justify-around max-w-lg mx-auto py-2">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all text-[10px] font-arabic',
                  active ? 'text-brand-red' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
                <span>{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
