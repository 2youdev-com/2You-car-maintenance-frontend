'use client'

import { useState } from 'react'
import {
  CalendarCheck, Clock, Car, Phone, CheckCircle2,
  XCircle, Clock3, Plus, Filter,
} from 'lucide-react'
import { formatDate, STATUS_BADGE, STATUS_LABELS } from '@/lib/utils'
import type { AppointmentStatus } from '@/types'

// Mock data
const appointments = [
  {
    id: 'a1',
    customer: { full_name: 'أحمد محمد السيد', phone: '01012345678' },
    vehicle:  { make: 'BMW', model: '320i', plate_number: 'أ ب ج 1234' },
    requested_at: '2024-06-15T09:00:00',
    service_type: 'تغيير زيت',
    notes: 'يفضل الفحص الشامل أيضاً',
    status: 'confirmed' as AppointmentStatus,
  },
  {
    id: 'a2',
    customer: { full_name: 'محمد علي إبراهيم', phone: '01198765432' },
    vehicle:  { make: 'Mercedes', model: 'C200', plate_number: 'د ه و 5678' },
    requested_at: '2024-06-15T11:30:00',
    service_type: 'صيانة فرامل',
    notes: null,
    status: 'pending' as AppointmentStatus,
  },
  {
    id: 'a3',
    customer: { full_name: 'خالد عبدالله حسن', phone: '01234567890' },
    vehicle:  { make: 'Toyota', model: 'Camry', plate_number: 'ز ح ط 9012' },
    requested_at: '2024-06-16T10:00:00',
    service_type: 'فحص دوري',
    notes: 'صوت غريب من المحرك',
    status: 'pending' as AppointmentStatus,
  },
  {
    id: 'a4',
    customer: { full_name: 'سارة أحمد مصطفى', phone: '01056781234' },
    vehicle:  { make: 'Hyundai', model: 'Elantra', plate_number: 'ك ل م 3456' },
    requested_at: '2024-06-16T14:00:00',
    service_type: 'تغيير إطارات',
    notes: null,
    status: 'confirmed' as AppointmentStatus,
  },
  {
    id: 'a5',
    customer: { full_name: 'عمر حسن محمود', phone: '01112233445' },
    vehicle:  { make: 'Kia', model: 'Sportage', plate_number: 'ن س ع 7890' },
    requested_at: '2024-06-14T09:30:00',
    service_type: 'صيانة كاملة',
    notes: null,
    status: 'completed' as AppointmentStatus,
  },
]

const FILTER_TABS = [
  { value: 'all',       label: 'الكل' },
  { value: 'pending',   label: 'معلق' },
  { value: 'confirmed', label: 'مؤكد' },
  { value: 'completed', label: 'مكتمل' },
]

function AppointmentCard({ apt, onStatusChange }: {
  apt: typeof appointments[0]
  onStatusChange: (id: string, status: AppointmentStatus) => void
}) {
  const time = new Date(apt.requested_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
  const date = formatDate(apt.requested_at)

  return (
    <div className="glass-card p-5 space-y-4 animate-fade-in">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface-600 flex flex-col items-center justify-center shrink-0">
            <CalendarCheck size={16} className="text-brand-red" />
          </div>
          <div>
            <p className="font-semibold text-foreground font-arabic">{apt.customer.full_name}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <Phone size={10} />
              {apt.customer.phone}
            </p>
          </div>
        </div>
        <span className={STATUS_BADGE[apt.status]}>
          {STATUS_LABELS[apt.status]}
        </span>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Car size={12} className="text-brand-red shrink-0" />
          <span className="font-arabic">{apt.vehicle.make} {apt.vehicle.model}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock size={12} className="text-brand-red shrink-0" />
          <span className="font-arabic">{time}</span>
        </div>
        <div className="col-span-2 text-muted-foreground font-arabic">{date}</div>
      </div>

      {/* Service */}
      <div className="flex items-center gap-2 bg-brand-red/5 border border-brand-red/10 rounded-lg px-3 py-2">
        <Clock3 size={13} className="text-brand-red shrink-0" />
        <span className="text-sm font-arabic text-foreground">{apt.service_type}</span>
      </div>

      {/* Notes */}
      {apt.notes && (
        <p className="text-xs text-muted-foreground bg-surface-700 rounded-lg px-3 py-2 font-arabic">
          💬 {apt.notes}
        </p>
      )}

      {/* Actions */}
      {apt.status === 'pending' && (
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => onStatusChange(apt.id, 'confirmed')}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg
              bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 text-xs font-medium
              transition-colors font-arabic"
          >
            <CheckCircle2 size={13} />
            تأكيد الموعد
          </button>
          <button
            onClick={() => onStatusChange(apt.id, 'cancelled')}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg
              bg-red-500/15 text-red-400 hover:bg-red-500/25 text-xs font-medium
              transition-colors font-arabic"
          >
            <XCircle size={13} />
            إلغاء
          </button>
        </div>
      )}
      {apt.status === 'confirmed' && (
        <button
          onClick={() => onStatusChange(apt.id, 'completed')}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg
            bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 text-xs font-medium
            transition-colors font-arabic"
        >
          <CheckCircle2 size={13} />
          تحديد كمكتمل
        </button>
      )}
    </div>
  )
}

export default function AppointmentsPage() {
  const [filter, setFilter] = useState('all')
  const [apts,   setApts]   = useState(appointments)

  const filtered = filter === 'all' ? apts : apts.filter((a) => a.status === filter)

  const handleStatusChange = (id: string, status: AppointmentStatus) => {
    setApts((prev) => prev.map((a) => a.id === id ? { ...a, status } : a))
  }

  const counts = {
    all:       apts.length,
    pending:   apts.filter((a) => a.status === 'pending').length,
    confirmed: apts.filter((a) => a.status === 'confirmed').length,
    completed: apts.filter((a) => a.status === 'completed').length,
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
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
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-red text-white text-sm hover:bg-brand-red-dark active:scale-95 transition-all glow-red font-arabic">
          <Plus size={15} />
          موعد جديد
        </button>
      </div>

      {/* Filter tabs */}
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

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <CalendarCheck size={40} className="mx-auto mb-3 text-muted-foreground/30" />
          <p className="text-muted-foreground font-arabic">لا توجد مواعيد في هذه الفئة</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((apt) => (
            <AppointmentCard key={apt.id} apt={apt} onStatusChange={handleStatusChange} />
          ))}
        </div>
      )}
    </div>
  )
}
