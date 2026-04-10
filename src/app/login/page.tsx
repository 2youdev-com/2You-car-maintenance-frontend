'use client'

import { useState } from 'react'
import { Eye, EyeOff, LogIn, Wrench } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { apiFetch } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const data = await apiFetch<{ token: string; user: { id: string; role: string } }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

      localStorage.setItem('token', data.token)
      document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`

      router.push('/dashboard')
    } catch {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center p-4">
      {/* Background grid */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Glow */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-brand-red/10 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Card */}
        <div className="glass-card p-8 space-y-7">
          {/* Logo */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-brand-red flex items-center justify-center mx-auto glow-red">
              <Wrench size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">El Amrety</h1>
              <p className="text-sm text-muted-foreground font-arabic mt-1">نظام إدارة مركز الصيانة</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground font-arabic">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                required
                className="w-full h-10 px-3.5 rounded-xl bg-surface-700 border border-white/[0.08]
                  text-sm text-foreground placeholder:text-muted-foreground
                  focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red/50
                  transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground font-arabic">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-10 px-3.5 pr-10 rounded-xl bg-surface-700 border border-white/[0.08]
                    text-sm text-foreground placeholder:text-muted-foreground
                    focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red/50
                    transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3.5 py-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                <p className="text-xs text-red-400 font-arabic">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-xl bg-brand-red text-white text-sm font-medium
                flex items-center justify-center gap-2
                hover:bg-brand-red-dark active:scale-[0.98] transition-all
                disabled:opacity-60 disabled:cursor-not-allowed glow-red mt-2 font-arabic"
            >
              {loading ? (
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <>
                  <LogIn size={15} />
                  تسجيل الدخول
                </>
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="border-t border-white/[0.05] pt-4">
            <p className="text-[11px] text-muted-foreground text-center font-arabic">
              للتجربة: ادخل البريد وكلمة المرور المرسلة من المركز
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-5 font-arabic">
          © 2024 El Amrety Center · جميع الحقوق محفوظة
        </p>
      </div>
    </div>
  )
}
