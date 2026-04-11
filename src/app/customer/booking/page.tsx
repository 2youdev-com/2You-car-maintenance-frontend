'use client'

import { useState } from 'react'
import { CalendarPlus, MapPin, Car, Clock, Send, CheckCircle2, Wrench } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { cn } from '@/lib/utils'

const BRANCHES = [
  { id: 'saad-zaghloul', name: 'فرع شارع سعد زغلول', address: 'شارع سعد زغلول، المنصورة' },
  { id: 'suez-canal',    name: 'فرع شارع قناة السويس', address: 'شارع قناة السويس، المنصورة' },
]

const SERVICE_TYPES = [
  { value: 'oil_change',     label: 'تغيير زيت',      icon: '🛢️' },
  { value: 'brake_service',  label: 'صيانة فرامل',    icon: '🔧' },
  { value: 'full_service',   label: 'صيانة شاملة',    icon: '⚙️' },
  { value: 'repair',         label: 'إصلاح',          icon: '🔩' },
  { value: 'inspection',     label: 'فحص',            icon: '🔍' },
  { value: 'tyre_change',    label: 'تغيير إطارات',   icon: '🛞' },
  { value: 'other',          label: 'أخرى',           icon: '📋' },
]

export default function BookingPage() {
  const [branch, setBranch] = useState('')
  const [serviceType, setServiceType] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [vehicleMake, setVehicleMake] = useState('')
  const [vehicleModel, setVehicleModel] = useState('')
  const [vehicleYear, setVehicleYear] = useState('')
  const [vehiclePlate, setVehiclePlate] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!branch || !serviceType || !date || !time) {
      setError('يرجى ملء جميع الحقول المطلوبة')
      return
    }
    setLoading(true)
    setError('')

    try {
      const requested_at = new Date(`${date}T${time}`).toISOString()
      await apiFetch('/appointments', {
        method: 'POST',
        body: JSON.stringify({
          branch,
          service_type: serviceType,
          requested_at,
          vehicle_make: vehicleMake || undefined,
          vehicle_model: vehicleModel || undefined,
          vehicle_year: vehicleYear ? parseInt(vehicleYear) : undefined,
          vehicle_plate: vehiclePlate || undefined,
          notes: notes || undefined,
        }),
      })
      setSuccess(true)
    } catch (err: unknown) {
      setError((err as { error?: string })?.error || 'فشل حجز الموعد')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center animate-fade-in">
        <div className="glass-card p-8 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle2 size={32} className="text-green-400" />
          </div>
          <h2 className="text-xl font-bold font-arabic text-foreground">تم حجز الموعد بنجاح!</h2>
          <p className="text-sm text-muted-foreground font-arabic">سيتم التواصل معك لتأكيد الموعد</p>
          <button
            onClick={() => { setSuccess(false); setBranch(''); setServiceType(''); setDate(''); setTime(''); setNotes('') }}
            className="mt-4 px-6 py-2.5 rounded-xl bg-brand-red text-white text-sm font-arabic hover:bg-brand-red-dark transition-colors"
          >
            حجز موعد آخر
          </button>
        </div>
      </div>
    )
  }

  const inputClass = "w-full h-11 px-3.5 rounded-xl bg-surface-700 border border-white/[0.08] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red/50 transition-all"

  return (
    <div className="max-w-lg mx-auto px-4 py-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <CalendarPlus size={22} className="text-brand-red" />
        <h1 className="text-xl font-bold font-arabic text-foreground">حجز موعد صيانة</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Branch Selection */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground font-arabic flex items-center gap-1.5">
            <MapPin size={13} /> اختر الفرع *
          </label>
          <div className="grid grid-cols-1 gap-2">
            {BRANCHES.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setBranch(b.id)}
                className={cn(
                  'p-3.5 rounded-xl border text-right transition-all',
                  branch === b.id
                    ? 'border-brand-red bg-brand-red/10 ring-1 ring-brand-red/30'
                    : 'border-white/[0.08] bg-surface-700 hover:border-white/[0.15]'
                )}
              >
                <p className="text-sm font-semibold font-arabic text-foreground">{b.name}</p>
                <p className="text-[11px] text-muted-foreground font-arabic mt-0.5">{b.address}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Service Type */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground font-arabic flex items-center gap-1.5">
            <Wrench size={13} /> نوع الخدمة *
          </label>
          <div className="grid grid-cols-2 gap-2">
            {SERVICE_TYPES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setServiceType(s.value)}
                className={cn(
                  'p-3 rounded-xl border text-center transition-all',
                  serviceType === s.value
                    ? 'border-brand-red bg-brand-red/10 ring-1 ring-brand-red/30'
                    : 'border-white/[0.08] bg-surface-700 hover:border-white/[0.15]'
                )}
              >
                <span className="text-lg">{s.icon}</span>
                <p className="text-xs font-arabic mt-1 text-foreground">{s.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground font-arabic flex items-center gap-1.5">
              <Clock size={13} /> التاريخ *
            </label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className={inputClass} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground font-arabic">الوقت *</label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required className={inputClass} />
          </div>
        </div>

        {/* Vehicle Info */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground font-arabic flex items-center gap-1.5">
            <Car size={13} /> بيانات السيارة
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input placeholder="الماركة (مثلاً BMW)" value={vehicleMake} onChange={(e) => setVehicleMake(e.target.value)} className={inputClass} />
            <input placeholder="الموديل (مثلاً 320i)" value={vehicleModel} onChange={(e) => setVehicleModel(e.target.value)} className={inputClass} />
            <input placeholder="سنة الصنع" type="number" value={vehicleYear} onChange={(e) => setVehicleYear(e.target.value)} className={inputClass} />
            <input placeholder="رقم اللوحة" value={vehiclePlate} onChange={(e) => setVehiclePlate(e.target.value)} className={inputClass} />
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground font-arabic">ملاحظات إضافية</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="وصف المشكلة أو أي ملاحظات..."
            rows={3}
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-700 border border-white/[0.08] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red/50 transition-all resize-none"
          />
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
          className="w-full h-11 rounded-xl bg-brand-red text-white text-sm font-medium font-arabic flex items-center justify-center gap-2 hover:bg-brand-red-dark active:scale-[0.98] transition-all disabled:opacity-60 glow-red"
        >
          {loading ? (
            <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : (
            <>
              <Send size={15} />
              تأكيد الحجز
            </>
          )}
        </button>
      </form>
    </div>
  )
}
