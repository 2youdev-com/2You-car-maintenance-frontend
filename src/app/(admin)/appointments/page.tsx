'use client'

import { useEffect, useState } from 'react'
import {
  CalendarCheck, Clock, Car, Phone, CheckCircle2,
  XCircle, Clock3, Filter, RefreshCw,
} from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { formatDate, STATUS_BADGE, STATUS_LABELS, SERVICE_TYPE_LABELS } from '@/lib/utils'
import type { AppointmentStatus } from '@/types'

interface ApiAppointment {
  id: string
  requested_at: string
  service_type: string | null
  notes: string | null
  status: AppointmentStatus
  branch: string | null
  vehicle_make: string | null
  vehicle_model: string | null
  vehicle_year: number | null
  vehicle_plate: string | null
  customer_name: string | null
  customer_phone: string | null
  customer: { full_name: string | null; phone: string | null } | null
  vehicle: { make: string | null; model: string | null; plate_number: string | null } | null
}

const FILTER_TABS = [
  { value: 'all',       label: 'الكل' },
  { value: 'pending',   label: 'معلق' },
  { value: 'confirmed', label: 'مؤكد' },
  { value: 'completed', label: 'مكتمل' },
]

function pickName(a: ApiAppointment) {
  return a.customer?.full_name || a.customer_name || 'عميل'
}

function pickPhone(a: ApiAppointment) {
  return a.customer?.phone || a.customer_phone || '—'
}

function pickVehicle(a: ApiAppointment) {
  const make  = a.vehicle?.make  || a.vehicle_make  || ''
  const model = a.vehicle?.model || a.vehicle_model || ''
  const plate = a.vehicle?.plate_number || a.vehicle_plate || ''
  const label = `${make} ${model}`.trim() || 'سيارة غير محددة'
  return { label, plate }
}

function AppointmentCard({ apt, onStatusChange, busyId }: {
  apt: ApiAppointment
  onStatusChange: (id: string, status: AppointmentStatus) => void
  busyId: string | null
}) {
  const time    = new Date(apt.requested_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
  const date    = formatDate(apt.requested_at)
  const veh     = pickVehicle(apt)
  const service = (apt.service_type && SERVICE_TYPE_LABELS[apt.service_type]) || apt.service_type || '—'
  const busy    = busyId === apt.id

  return (
    <div className="glass-card p-5 space-y-4 animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface-600 flex flex-col items-center justify-center shrink-0">
            <CalendarCheck size={16} className="text-brand-red" />
          </div>
          <div>
            <p className="font-semibold text-foreground font-arabic">{pickName(apt)}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <Phone size={10} />
              {pickPhone(apt)}
            </p>
          </div>
        </div>
        <span className={STATUS_BADGE[apt.status] || 'badge-yellow'}>
          {STATUS_LABELS[apt.status] || apt.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Car size={12} className="text-brand-red shrink-0" />
          <span className="font-arabic">{veh.label}{veh.plate ? ` · ${veh.plate}` : ''}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock size={12} className="text-brand-red shrink-0" />
          <span className="font-arabic">{time}</span>
        </div>
        <div className="col-span-2 text-muted-foreground font-arabic">{date}</div>
      </div>

      <div className="flex items-center gap-2 bg-brand-red/5 border border-brand-red/10 rounded-lg px-3 py-2">
        <Clock3 size={13} className="text-brand-red shrink-0" />
        <span className="text-sm font-arabic text-foreground">{service}</span>
      </div>

      {apt.notes && (
        <p className="text-xs text-muted-foreground bg-surface-700 rounded-lg px-3 py-2 font-arabic">
          💬 {apt.notes}
        </p>
      )}

      {apt.status === 'pending' && (
        <div className="flex gap-2 pt-1">
          <button
            disabled={busy}
            onClick={() => onStatusChange(apt.id, 'confirmed')}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg
              bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 text-xs font-medium
              transition-colors font-arabic disabled:opacity-50"
          >
            <CheckCircle2 size={13} />
            تأكيد الموعد
          </button>
          <button
            disabled={busy}
            onClick={() => onStatusChange(apt.id, 'cancelled')}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg
              bg-red-500/15 text-red-400 hover:bg-red-500/25 text-xs font-medium
              transition-colors font-arabic disabled:opacity-50"
          >
            <XCircle size={13} />
            إلغاء
          </button>
        </div>
      )}
      {apt.status === 'confirmed' && (
        <button
          disabled={busy}
          onClick={() => onStatusChange(apt.id, 'completed')}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg
            bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 text-xs font-medium
            transition-colors font-arabic disabled:opacity-50"
        >
          <CheckCircle2 size={13} />
          تحديد كمكتمل
        </button>
      )}
    </div>
  )
}

export default function AppointmentsPage() {
  const [filter,  setFilter]  = useState('all')
  const [apts,    setApts]    = useState<ApiAppointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const [busyId,  setBusyId]  = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await apiFetch<ApiAppointment[]>('/appointments')
      setApts(Array.isArray(data) ? data : [])
    } catch (err: unknown) {
      setError((err as { error?: string })?.error || 'فشل تحميل المواعيد')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleStatusChange = async (id: string, status: AppointmentStatus) => {
    setBusyId(id)
    setApts((prev) => prev.map((a) => a.id === id ? { ...a, status } : a))
    try {
      await apiFetch(`/appointments/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })
    } catch (err: unknown) {
      setError((err as { error?: string })?.error || 'فشل تحديث حالة الموعد')
      load()
    } finally {
      setBusyId(null)
    }
  }

  const filtered = filter === 'all' ? apts : apts.filter((a) => a.status === filter)

  const counts = {
    all:       apts.length,
    pending:   apts.filter((a) => a.status === 'pending').length,
    confirmed: apts.filter((a) => a.status === 'confirmed').length,
    completed: apts.filter((a) => a.status === 'completed').length,
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <CalendarCheck size={20} className="text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground font-arabic">المواعيد</h1>
            <p className="text-sm text-muted-foreground font-arabic">
              {counts.pending} موعد معلق · {counts.confirmed} مؤكد
            </p>
          </div>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-700 text-foreground text-sm hover:bg-surface-600 active:scale-95 transition-all font-arabic disabled:opacity-60"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          تحديث
        </button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Filter size={14} className="text-muted-foreground" />
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors font-arabic ${
              filter === tab.value
                ? 'bg-brand-red text-white'
                : 'bg-surface-700 text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              filter === tab.value ? 'bg-white/20' : 'bg-surface-600'
            }`}>
              {counts[tab.value as keyof typeof counts] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3.5 py-2.5">
          <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
          <p className="text-xs text-red-400 font-arabic">{error}</p>
        </div>
      )}

      {loading && apts.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <RefreshCw size={28} className="mx-auto mb-3 text-muted-foreground/40 animate-spin" />
          <p className="text-muted-foreground font-arabic text-sm">جارٍ تحميل المواعيد...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <CalendarCheck size={40} className="mx-auto mb-3 text-muted-foreground/30" />
          <p className="text-muted-foreground font-arabic">لا توجد مواعيد في هذه الفئة</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((apt) => (
            <AppointmentCard
              key={apt.id}
              apt={apt}
              busyId={busyId}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  )
}
