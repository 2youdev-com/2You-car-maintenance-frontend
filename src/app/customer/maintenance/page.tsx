'use client'

import { useEffect, useState } from 'react'
import { Wrench, Plus, Loader2, CheckCircle2, Clock, Car } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { SERVICE_TYPE_LABELS, STATUS_LABELS, STATUS_BADGE, formatCurrency, formatDate } from '@/lib/utils'

interface MaintenanceLog {
  id: string
  service_type: string
  date: string
  mileage: number | null
  description: string | null
  total_cost: number
  status: string
  vehicle: { make: string; model: string; plate_number: string } | null
}

const SERVICE_TYPES = [
  { value: 'oil_change',     label: 'تغيير زيت' },
  { value: 'brake_service',  label: 'صيانة فرامل' },
  { value: 'full_service',   label: 'صيانة شاملة' },
  { value: 'repair',         label: 'إصلاح' },
  { value: 'inspection',     label: 'فحص' },
  { value: 'tyre_change',    label: 'تغيير إطارات' },
  { value: 'other',          label: 'أخرى' },
]

export default function MaintenancePage() {
  const [logs, setLogs] = useState<MaintenanceLog[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Form fields
  const [serviceType, setServiceType] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [mileage, setMileage] = useState('')
  const [vehicleMake, setVehicleMake] = useState('')
  const [vehicleModel, setVehicleModel] = useState('')
  const [vehiclePlate, setVehiclePlate] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = () => {
    setLoading(true)
    apiFetch<MaintenanceLog[]>('/maintenance/my')
      .then(setLogs)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!serviceType) { setError('اختر نوع الخدمة'); return }
    setSubmitting(true)
    setError('')

    try {
      await apiFetch('/maintenance/self-log', {
        method: 'POST',
        body: JSON.stringify({
          service_type: serviceType,
          date,
          mileage: mileage ? parseInt(mileage) : undefined,
          vehicle_make: vehicleMake || undefined,
          vehicle_model: vehicleModel || undefined,
          vehicle_plate: vehiclePlate || undefined,
          description: description || undefined,
        }),
      })
      setSuccess(true)
      setShowForm(false)
      fetchLogs()
      // Reset
      setServiceType(''); setMileage(''); setDescription('')
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: unknown) {
      setError((err as { error?: string })?.error || 'فشل تسجيل الصيانة')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = "w-full h-11 px-3.5 rounded-xl bg-surface-700 border border-white/[0.08] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red/50 transition-all"

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Wrench size={22} className="text-brand-red" />
          <h1 className="text-xl font-bold font-arabic text-foreground">صيانتي</h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-red text-white text-xs font-arabic hover:bg-brand-red-dark transition-colors"
        >
          <Plus size={14} />
          تسجيل صيانة
        </button>
      </div>

      {/* Success toast */}
      {success && (
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-3.5 py-2.5 mb-4 animate-fade-in">
          <CheckCircle2 size={16} className="text-green-400" />
          <p className="text-xs text-green-400 font-arabic">تم تسجيل الصيانة بنجاح</p>
        </div>
      )}

      {/* Self-log form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card p-5 mb-6 space-y-4 animate-fade-in">
          <h3 className="text-sm font-semibold font-arabic text-foreground">تسجيل صيانة جديدة</h3>

          {/* Service type grid */}
          <div className="grid grid-cols-2 gap-2">
            {SERVICE_TYPES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setServiceType(s.value)}
                className={`p-2.5 rounded-xl border text-xs font-arabic text-center transition-all ${
                  serviceType === s.value
                    ? 'border-brand-red bg-brand-red/10 text-foreground ring-1 ring-brand-red/30'
                    : 'border-white/[0.08] bg-surface-700 text-muted-foreground hover:text-foreground'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
            <input placeholder="عداد الكيلومترات" type="number" value={mileage} onChange={(e) => setMileage(e.target.value)} className={inputClass} />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <input placeholder="الماركة" value={vehicleMake} onChange={(e) => setVehicleMake(e.target.value)} className={inputClass} />
            <input placeholder="الموديل" value={vehicleModel} onChange={(e) => setVehicleModel(e.target.value)} className={inputClass} />
            <input placeholder="رقم اللوحة" value={vehiclePlate} onChange={(e) => setVehiclePlate(e.target.value)} className={inputClass} />
          </div>

          <textarea
            placeholder="وصف الصيانة..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-700 border border-white/[0.08] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-brand-red transition-all resize-none"
          />

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <p className="text-xs text-red-400 font-arabic">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-10 rounded-xl bg-brand-red text-white text-sm font-arabic flex items-center justify-center gap-2 hover:bg-brand-red-dark transition-all disabled:opacity-60"
          >
            {submitting ? <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : 'تسجيل الصيانة'}
          </button>
        </form>
      )}

      {/* Maintenance logs list */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={28} className="animate-spin text-brand-red" />
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Wrench size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-arabic text-sm">لا توجد سجلات صيانة</p>
          <p className="font-arabic text-xs mt-1">سجّل أول صيانة لسيارتك</p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="glass-card p-4 hover:border-white/[0.12] transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold font-arabic text-foreground">
                    {SERVICE_TYPE_LABELS[log.service_type as keyof typeof SERVICE_TYPE_LABELS] || log.service_type}
                  </p>
                  <p className="text-[11px] text-muted-foreground font-arabic mt-1">
                    {formatDate(log.date)}
                    {log.mileage ? ` · ${log.mileage.toLocaleString()} كم` : ''}
                  </p>
                  {log.vehicle && (
                    <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                      <Car size={10} /> {log.vehicle.make} {log.vehicle.model}
                    </p>
                  )}
                  {log.description && (
                    <p className="text-xs text-muted-foreground font-arabic mt-1.5">{log.description}</p>
                  )}
                </div>
                <div className="text-left">
                  {log.total_cost > 0 && (
                    <p className="text-sm font-bold font-mono text-foreground">{formatCurrency(log.total_cost)}</p>
                  )}
                  <span className={`${STATUS_BADGE[log.status as keyof typeof STATUS_BADGE] || 'badge-yellow'} text-[10px] mt-1 inline-block`}>
                    {STATUS_LABELS[log.status as keyof typeof STATUS_LABELS] || log.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
