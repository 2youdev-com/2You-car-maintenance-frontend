'use client'

import { useParams, useRouter } from 'next/navigation'
import {
  ArrowRight, Phone, Mail, Car, Calendar, Wrench,
  DollarSign, Hash, ClipboardList, User,
} from 'lucide-react'
import { getInitials, formatDateShort, formatCurrency, formatMileage, SERVICE_TYPE_LABELS } from '@/lib/utils'
import { useCustomer, useCustomerLogs, useCustomerVehicles } from '@/lib/mock-store'

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const customer = useCustomer(id)
  const vehicles = useCustomerVehicles(id)
  const logs = useCustomerLogs(id)

  if (!customer) {
    return (
      <div className="space-y-4 animate-fade-in text-center py-20">
        <p className="text-lg font-arabic text-foreground">العميل غير موجود</p>
        <button
          onClick={() => router.push('/customers')}
          className="text-sm text-brand-red hover:underline font-arabic"
        >
          العودة إلى قائمة العملاء
        </button>
      </div>
    )
  }

  const totalSpent = logs.reduce((sum, l) => sum + l.total_cost, 0)
  const lastVisit = logs[0]?.date

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back button */}
      <button
        onClick={() => router.push('/customers')}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors font-arabic"
      >
        <ArrowRight size={15} />
        العودة للعملاء
      </button>

      {/* Customer header */}
      <div className="glass-card p-6">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="w-16 h-16 rounded-full bg-brand-red/15 border border-brand-red/20 flex items-center justify-center text-brand-red font-bold text-lg shrink-0">
            {getInitials(customer.full_name)}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-foreground font-arabic">{customer.full_name}</h1>
            <div className="flex items-center gap-4 mt-2 flex-wrap text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Phone size={12} />
                <span className="font-mono">{customer.phone}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Mail size={12} />
                <span className="font-mono text-xs">{customer.email}</span>
              </span>
              <span className="flex items-center gap-1.5 font-arabic">
                <User size={12} />
                عميل منذ {formatDateShort(customer.created_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          <Stat icon={Car}            label="السيارات"      value={vehicles.length.toString()} />
          <Stat icon={ClipboardList}  label="سجلات الصيانة" value={logs.length.toString()} />
          <Stat icon={Calendar}       label="آخر زيارة"     value={lastVisit ? formatDateShort(lastVisit) : '—'} />
          <Stat icon={DollarSign}     label="الإجمالي"      value={formatCurrency(totalSpent)} highlight />
        </div>
      </div>

      {/* Vehicles */}
      <section className="glass-card p-5 space-y-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground font-arabic">
          <Car size={16} className="text-brand-red" />
          السيارات ({vehicles.length})
        </h2>
        {vehicles.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4 font-arabic">لا توجد سيارات مسجلة لهذا العميل</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {vehicles.map((v) => (
              <div key={v.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-700/50 border border-white/[0.04]">
                <div className="w-10 h-10 rounded-xl bg-surface-600 flex items-center justify-center shrink-0">
                  <Car size={16} className="text-brand-red" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{v.make} {v.model} <span className="text-xs text-muted-foreground">({v.year})</span></p>
                  <p className="text-xs text-muted-foreground font-arabic mt-0.5">
                    لوحة: <span className="font-mono">{v.plate_number}</span> · {v.color}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Maintenance History */}
      <section className="glass-card p-5 space-y-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground font-arabic">
          <Wrench size={16} className="text-brand-red" />
          سجلات الصيانة ({logs.length})
        </h2>
        {logs.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4 font-arabic">لا توجد سجلات صيانة</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="font-arabic">التاريخ</th>
                  <th className="font-arabic">الخدمة</th>
                  <th className="font-arabic">السيارة</th>
                  <th className="font-arabic">العداد</th>
                  <th className="font-arabic">التكلفة</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l) => {
                  const veh = vehicles.find((v) => v.id === l.vehicle_id)
                  return (
                    <tr key={l.id}>
                      <td className="font-mono text-xs">{formatDateShort(l.date)}</td>
                      <td className="font-arabic">{SERVICE_TYPE_LABELS[l.service_type] ?? l.service_type}</td>
                      <td className="font-arabic text-xs">
                        {veh ? `${veh.make} ${veh.model}` : '—'}
                      </td>
                      <td className="font-mono text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Hash size={10} />
                          {formatMileage(l.mileage)}
                        </span>
                      </td>
                      <td className="font-mono text-sm font-bold text-emerald-400">
                        {formatCurrency(l.total_cost)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

function Stat({ icon: Icon, label, value, highlight }: {
  icon: React.ElementType
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="bg-surface-700/50 border border-white/[0.04] rounded-xl p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-arabic">
        <Icon size={12} className="text-brand-red" />
        {label}
      </div>
      <p className={`mt-1 text-base font-bold font-mono ${highlight ? 'text-emerald-400' : 'text-foreground'}`}>
        {value}
      </p>
    </div>
  )
}
