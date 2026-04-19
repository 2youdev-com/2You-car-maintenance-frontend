'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Users, Phone, Car, Search, Plus, ChevronRight, X, Save,
  User, Mail, Hash, Palette, Calendar,
} from 'lucide-react'
import { toast } from 'sonner'
import { getInitials, formatDateShort } from '@/lib/utils'
import { store, useCustomers, useVehicles, useMaintenanceLogs } from '@/lib/mock-store'

export default function CustomersPage() {
  const router = useRouter()
  const customers = useCustomers()
  const vehicles = useVehicles()
  const logs = useMaintenanceLogs()

  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    email: '',
    veh_make: '',
    veh_model: '',
    veh_year: '',
    veh_color: '',
    veh_plate: '',
    veh_vin: '',
  })

  const filtered = customers.filter((c) =>
    `${c.full_name} ${c.phone}`.toLowerCase().includes(search.toLowerCase()),
  )

  const resetForm = () => setForm({
    full_name: '', phone: '', email: '',
    veh_make: '', veh_model: '', veh_year: '', veh_color: '', veh_plate: '', veh_vin: '',
  })

  const handleAdd = () => {
    if (!form.full_name.trim() || !form.phone.trim()) {
      toast.error('الاسم ورقم الهاتف مطلوبين')
      return
    }
    const hasVehicleData = [form.veh_make, form.veh_model, form.veh_year, form.veh_plate]
      .some((v) => v.trim() !== '')
    if (hasVehicleData) {
      const missing = !form.veh_make.trim() || !form.veh_model.trim() || !form.veh_plate.trim()
      if (missing) {
        toast.error('بيانات السيارة ناقصة (الماركة، الموديل، رقم اللوحة)')
        return
      }
    }

    const customer = store.addCustomer({
      full_name: form.full_name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
    })

    if (hasVehicleData) {
      store.addVehicle({
        customer_id: customer.id,
        make: form.veh_make.trim(),
        model: form.veh_model.trim(),
        year: Number(form.veh_year) || new Date().getFullYear(),
        color: form.veh_color.trim() || 'غير محدد',
        plate_number: form.veh_plate.trim(),
        vin: form.veh_vin.trim() || undefined,
      })
    }

    resetForm()
    setShowAdd(false)
    toast.success('تم إضافة العميل بنجاح')
  }

  return (
    <>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Users size={20} className="text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground font-arabic">العملاء</h1>
              <p className="text-sm text-muted-foreground font-arabic">{customers.length} عميل مسجل</p>
            </div>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-red text-white text-sm hover:bg-brand-red-dark active:scale-95 transition-all glow-red font-arabic"
          >
            <Plus size={15} />
            إضافة عميل
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-surface-700 rounded-xl px-4 py-2.5 max-w-sm">
          <Search size={15} className="text-muted-foreground shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث بالاسم أو الهاتف..."
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full font-arabic"
          />
        </div>

        {/* Customer Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c) => {
            const vehicleCount = vehicles.filter((v) => v.customer_id === c.id).length
            const customerLogs = logs.filter((l) => l.customer_id === c.id)
              .sort((a, b) => b.date.localeCompare(a.date))
            const totalSpent = customerLogs.reduce((sum, l) => sum + l.total_cost, 0)
            const lastVisit = customerLogs[0]?.date
            return (
              <button
                key={c.id}
                onClick={() => router.push(`/customers/${c.id}`)}
                className="glass-card p-5 hover:border-brand-red/20 hover:bg-surface-700/50 transition-all group cursor-pointer text-right"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-brand-red/15 border border-brand-red/20 flex items-center justify-center text-brand-red font-bold text-sm shrink-0">
                      {getInitials(c.full_name)}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground font-arabic">{c.full_name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Phone size={10} />
                        {c.phone}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground group-hover:text-brand-red transition-colors mt-1 shrink-0" />
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="bg-surface-700 rounded-lg p-2 text-center">
                    <p className="text-xs text-muted-foreground font-arabic">السيارات</p>
                    <p className="text-sm font-bold text-foreground flex items-center justify-center gap-1 mt-0.5">
                      <Car size={12} className="text-brand-red" />
                      {vehicleCount}
                    </p>
                  </div>
                  <div className="bg-surface-700 rounded-lg p-2 text-center">
                    <p className="text-xs text-muted-foreground font-arabic">آخر زيارة</p>
                    <p className="text-xs font-medium text-foreground mt-0.5">
                      {lastVisit ? formatDateShort(lastVisit) : '—'}
                    </p>
                  </div>
                  <div className="bg-surface-700 rounded-lg p-2 text-center">
                    <p className="text-xs text-muted-foreground font-arabic">الإجمالي</p>
                    <p className="text-xs font-bold text-emerald-400 font-mono mt-0.5">
                      {totalSpent.toLocaleString()}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-sm text-muted-foreground font-arabic py-10">
            لا يوجد عملاء مطابقين للبحث
          </p>
        )}
      </div>

      {/* Add Customer Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card w-full max-w-xl animate-fade-in max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] shrink-0">
              <h3 className="font-semibold font-arabic">إضافة عميل جديد</h3>
              <button onClick={() => setShowAdd(false)} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-5 overflow-y-auto">
              {/* Customer section */}
              <section className="space-y-3">
                <h4 className="flex items-center gap-2 text-xs font-semibold text-brand-red font-arabic uppercase tracking-wide">
                  <User size={13} />
                  بيانات العميل
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <ModalField label="الاسم الكامل *" icon={User}>
                    <input
                      value={form.full_name}
                      onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                      placeholder="مثال: أحمد محمد"
                      className={inputCls + ' font-arabic'}
                    />
                  </ModalField>
                  <ModalField label="رقم الهاتف *" icon={Phone}>
                    <input
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      placeholder="01xxxxxxxxx"
                      className={inputCls + ' font-mono'}
                    />
                  </ModalField>
                  <div className="md:col-span-2">
                    <ModalField label="البريد الإلكتروني" icon={Mail}>
                      <input
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        placeholder="example@mail.com"
                        className={inputCls + ' font-mono'}
                      />
                    </ModalField>
                  </div>
                </div>
              </section>

              {/* Vehicle section */}
              <section className="space-y-3 pt-3 border-t border-white/[0.06]">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <h4 className="flex items-center gap-2 text-xs font-semibold text-brand-red font-arabic uppercase tracking-wide">
                    <Car size={13} />
                    بيانات السيارة
                  </h4>
                  <span className="text-[10px] text-muted-foreground font-arabic">اختياري — املأها لو هتضيف سيارة</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <ModalField label="الماركة" icon={Car}>
                    <input
                      value={form.veh_make}
                      onChange={(e) => setForm((f) => ({ ...f, veh_make: e.target.value }))}
                      placeholder="مثال: Toyota"
                      className={inputCls}
                    />
                  </ModalField>
                  <ModalField label="الموديل" icon={Car}>
                    <input
                      value={form.veh_model}
                      onChange={(e) => setForm((f) => ({ ...f, veh_model: e.target.value }))}
                      placeholder="مثال: Camry"
                      className={inputCls}
                    />
                  </ModalField>
                  <ModalField label="سنة الصنع" icon={Calendar}>
                    <input
                      type="number"
                      value={form.veh_year}
                      onChange={(e) => setForm((f) => ({ ...f, veh_year: e.target.value }))}
                      placeholder={new Date().getFullYear().toString()}
                      className={inputCls + ' font-mono'}
                    />
                  </ModalField>
                  <ModalField label="اللون" icon={Palette}>
                    <input
                      value={form.veh_color}
                      onChange={(e) => setForm((f) => ({ ...f, veh_color: e.target.value }))}
                      placeholder="مثال: أبيض"
                      className={inputCls + ' font-arabic'}
                    />
                  </ModalField>
                  <ModalField label="رقم اللوحة" icon={Hash}>
                    <input
                      value={form.veh_plate}
                      onChange={(e) => setForm((f) => ({ ...f, veh_plate: e.target.value }))}
                      placeholder="أ ب ج 1234"
                      className={inputCls + ' font-arabic'}
                    />
                  </ModalField>
                  <ModalField label="رقم الشاسيه (VIN)" icon={Hash}>
                    <input
                      value={form.veh_vin}
                      onChange={(e) => setForm((f) => ({ ...f, veh_vin: e.target.value }))}
                      placeholder="17 رمز"
                      className={inputCls + ' font-mono uppercase'}
                    />
                  </ModalField>
                </div>
              </section>
            </div>
            <div className="flex gap-2 justify-end px-5 py-4 border-t border-white/[0.06] shrink-0">
              <button
                onClick={() => { resetForm(); setShowAdd(false) }}
                className="px-4 py-2 rounded-lg border border-white/[0.08] text-sm text-muted-foreground hover:bg-surface-600 transition-colors font-arabic"
              >
                إلغاء
              </button>
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-brand-red text-white text-sm hover:bg-brand-red-dark transition-colors glow-red font-arabic"
              >
                <Save size={14} />
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const inputCls = `w-full h-9 px-3 rounded-lg bg-surface-800 border border-white/[0.08]
  text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-brand-red
  transition-all`

function ModalField({ label, icon: Icon, children }: {
  label: string
  icon: React.ElementType
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="text-xs text-muted-foreground mb-1 block font-arabic flex items-center gap-1.5">
        <Icon size={11} className="text-brand-red" />
        {label}
      </label>
      {children}
    </div>
  )
}
