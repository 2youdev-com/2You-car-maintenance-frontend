'use client'

import { useState } from 'react'
import {
  Settings, Building2, Bell, Shield, QrCode,
  Save, Copy, Check,
} from 'lucide-react'
import { toast } from 'sonner'

const inputCls = `w-full h-10 px-3.5 rounded-xl bg-surface-700 border border-white/[0.08]
  text-sm text-foreground placeholder:text-muted-foreground font-arabic
  focus:outline-none focus:ring-1 focus:ring-brand-red transition-all`

function Section({ icon: Icon, title, children }: {
  icon: React.ElementType
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/[0.06]">
        <Icon size={16} className="text-brand-red" />
        <h2 className="font-semibold text-foreground font-arabic">{title}</h2>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  )
}

function Toggle({ label, sub, value, onChange }: {
  label: string; sub?: string; value: boolean; onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm text-foreground font-arabic">{label}</p>
        {sub && <p className="text-xs text-muted-foreground font-arabic mt-0.5">{sub}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${value ? 'bg-brand-red' : 'bg-surface-500'}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ${value ? 'left-[22px]' : 'left-0.5'}`} />
      </button>
    </div>
  )
}

export default function SettingsPage() {
  const [copied, setCopied] = useState(false)
  const [notifications, setNotifications] = useState({
    maintenance: true,
    appointments: true,
    lowStock: true,
    sms: false,
    email: true,
  })

  const QR_CODE = '2YCARS-001'

  const copyQR = () => {
    navigator.clipboard.writeText(QR_CODE)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = () => toast.success('تم حفظ الإعدادات بنجاح')

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-surface-600 flex items-center justify-center">
          <Settings size={20} className="text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground font-arabic">الإعدادات</h1>
          <p className="text-sm text-muted-foreground font-arabic">إدارة بيانات المركز والتفضيلات</p>
        </div>
      </div>

      {/* Center Info */}
      <Section icon={Building2} title="بيانات المركز">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block font-arabic">اسم المركز (إنجليزي)</label>
            <input className={inputCls} defaultValue="2Y Cars" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block font-arabic">اسم المركز (عربي)</label>
            <input className={inputCls} defaultValue="2Y Cars" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block font-arabic">رقم الهاتف</label>
            <input className={inputCls} type="tel" defaultValue="01012345678" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block font-arabic">البريد الإلكتروني</label>
            <input className={inputCls} type="email" defaultValue="info@2ycars.com" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-muted-foreground mb-1.5 block font-arabic">العنوان</label>
            <input className={inputCls} defaultValue="المنصورة، الدقهلية، مصر" />
          </div>
        </div>
      </Section>

      {/* QR Code */}
      <Section icon={QrCode} title="رمز QR للتسجيل السريع">
        <p className="text-xs text-muted-foreground font-arabic">
          ضع هذا الرمز في مركزك — سيتمكن العملاء من مسحه وإنشاء حساب مرتبط بمركزك فوراً.
        </p>
        <div className="flex items-center gap-3 bg-surface-700 rounded-xl p-4">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground font-arabic mb-1">كود المركز</p>
            <p className="text-lg font-bold font-mono text-brand-red tracking-widest">{QR_CODE}</p>
          </div>
          <button
            onClick={copyQR}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-600 text-xs text-muted-foreground hover:text-foreground transition-colors font-arabic"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            {copied ? 'تم النسخ' : 'نسخ'}
          </button>
        </div>
        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
          <span className="text-amber-400 text-lg">⚠</span>
          <p className="text-xs text-amber-400/90 font-arabic">
            لا تشارك هذا الكود علنياً — فقط للعملاء الموجودين في مركزك
          </p>
        </div>
      </Section>

      {/* Notifications */}
      <Section icon={Bell} title="إعدادات الإشعارات">
        <div className="space-y-4 divide-y divide-white/[0.04]">
          <Toggle
            label="تذكير الصيانة الدورية"
            sub="إشعار العملاء قبل موعد الصيانة القادمة"
            value={notifications.maintenance}
            onChange={(v) => setNotifications((p) => ({ ...p, maintenance: v }))}
          />
          <div className="pt-4">
            <Toggle
              label="تأكيد المواعيد"
              sub="إرسال تأكيد تلقائي عند حجز موعد"
              value={notifications.appointments}
              onChange={(v) => setNotifications((p) => ({ ...p, appointments: v }))}
            />
          </div>
          <div className="pt-4">
            <Toggle
              label="تنبيه المخزون المنخفض"
              sub="إشعار عند نفاد قطعة من المخزون"
              value={notifications.lowStock}
              onChange={(v) => setNotifications((p) => ({ ...p, lowStock: v }))}
            />
          </div>
          <div className="pt-4">
            <Toggle
              label="إشعارات SMS"
              sub="إرسال رسائل نصية للعملاء (تكلفة إضافية)"
              value={notifications.sms}
              onChange={(v) => setNotifications((p) => ({ ...p, sms: v }))}
            />
          </div>
          <div className="pt-4">
            <Toggle
              label="إشعارات البريد الإلكتروني"
              value={notifications.email}
              onChange={(v) => setNotifications((p) => ({ ...p, email: v }))}
            />
          </div>
        </div>
      </Section>

      {/* Security */}
      <Section icon={Shield} title="الأمان">
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block font-arabic">كلمة المرور الحالية</label>
            <input className={inputCls} type="password" placeholder="••••••••" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block font-arabic">كلمة المرور الجديدة</label>
            <input className={inputCls} type="password" placeholder="••••••••" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block font-arabic">تأكيد كلمة المرور</label>
            <input className={inputCls} type="password" placeholder="••••••••" />
          </div>
        </div>
      </Section>

      {/* Save */}
      <div className="flex justify-end pb-4">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-red text-white text-sm font-medium hover:bg-brand-red-dark active:scale-95 transition-all glow-red font-arabic"
        >
          <Save size={15} />
          حفظ جميع الإعدادات
        </button>
      </div>
    </div>
  )
}
