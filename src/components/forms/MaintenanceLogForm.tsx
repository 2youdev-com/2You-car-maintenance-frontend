'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import {
  Plus, Trash2, Save, Wrench, Car, User,
  Gauge, Calendar, DollarSign, FileText, Package
} from 'lucide-react'
import type { MaintenanceLogFormData, SparePart, Profile, Vehicle } from '@/types'

// ── Zod Schema ─────────────────────────────────────────────────
const logSchema = z.object({
  customer_id:       z.string().min(1, 'اختر العميل'),
  vehicle_id:        z.string().min(1, 'اختر السيارة'),
  date:              z.string().min(1, 'التاريخ مطلوب'),
  mileage:           z.coerce.number().min(0),
  next_service_km:   z.coerce.number().min(0),
  next_service_date: z.string().optional(),
  service_type:      z.enum(['oil_change','brake_service','full_service','repair','inspection','tyre_change','other']),
  description:       z.string().optional(),
  notes:             z.string().optional(),
  total_cost:        z.coerce.number().min(0),
  parts: z.array(z.object({
    part_id:       z.string().optional(),
    part_name:     z.string().min(1, 'اسم القطعة مطلوب'),
    quantity_used: z.coerce.number().min(1),
    unit_price:    z.coerce.number().min(0),
  })),
})

// ── Mock data (replace with Supabase) ──────────────────────────
const MOCK_CUSTOMERS: Pick<Profile, 'id' | 'full_name' | 'phone'>[] = [
  { id: 'c1', full_name: 'أحمد محمد السيد',   phone: '01012345678' },
  { id: 'c2', full_name: 'محمد علي إبراهيم',  phone: '01198765432' },
  { id: 'c3', full_name: 'خالد عبدالله حسن',  phone: '01234567890' },
]

const MOCK_VEHICLES: (Pick<Vehicle, 'id' | 'make' | 'model' | 'year' | 'plate_number'> & { customer_id: string })[] = [
  { id: 'v1', customer_id: 'c1', make: 'BMW',      model: '320i',   year: 2021, plate_number: 'أ ب ج 1234' },
  { id: 'v2', customer_id: 'c2', make: 'Mercedes', model: 'C200',   year: 2020, plate_number: 'د ه و 5678' },
  { id: 'v3', customer_id: 'c3', make: 'Toyota',   model: 'Camry',  year: 2022, plate_number: 'ز ح ط 9012' },
]

const MOCK_PARTS: Pick<SparePart, 'id' | 'name' | 'price' | 'quantity'>[] = [
  { id: 'p1', name: 'زيت موتور Castrol 5W40',    price: 280, quantity: 42 },
  { id: 'p2', name: 'فلتر زيت Bosch',             price: 85,  quantity: 30 },
  { id: 'p3', name: 'فلتر هواء Mann',             price: 120, quantity: 18 },
  { id: 'p4', name: 'تيل فرامل Brembo',           price: 350, quantity: 12 },
  { id: 'p5', name: 'بوجيه NGK',                  price: 95,  quantity: 24 },
]

const SERVICE_TYPES = [
  { value: 'oil_change',     label: 'تغيير زيت' },
  { value: 'brake_service',  label: 'صيانة فرامل' },
  { value: 'full_service',   label: 'صيانة كاملة' },
  { value: 'repair',         label: 'إصلاح' },
  { value: 'inspection',     label: 'فحص دوري' },
  { value: 'tyre_change',    label: 'تغيير إطارات' },
  { value: 'other',          label: 'أخرى' },
]

// ── Reusable field wrapper ──────────────────────────────────────
function Field({ label, icon: Icon, error, children }: {
  label: string
  icon?: React.ElementType
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground font-arabic">
        {Icon && <Icon size={12} className="text-brand-red" />}
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-400 font-arabic">{error}</p>}
    </div>
  )
}

function Input({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full h-9 px-3 rounded-lg bg-surface-700 border border-white/[0.08]
        text-sm text-foreground placeholder:text-muted-foreground
        focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red/50
        transition-all duration-150 font-arabic ${className}`}
      {...props}
    />
  )
}

function Select({ className = '', children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return (
    <select
      className={`w-full h-9 px-3 rounded-lg bg-surface-700 border border-white/[0.08]
        text-sm text-foreground focus:outline-none focus:ring-1
        focus:ring-brand-red focus:border-brand-red/50 transition-all duration-150
        font-arabic cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </select>
  )
}

function Textarea({ className = '', ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={3}
      className={`w-full px-3 py-2 rounded-lg bg-surface-700 border border-white/[0.08]
        text-sm text-foreground placeholder:text-muted-foreground resize-none
        focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red/50
        transition-all duration-150 font-arabic ${className}`}
      {...props}
    />
  )
}

// ── Main Form Component ─────────────────────────────────────────
export default function MaintenanceLogForm({ onSuccess }: { onSuccess?: () => void }) {
  const [selectedCustomer, setSelectedCustomer] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MaintenanceLogFormData>({
    resolver: zodResolver(logSchema),
    defaultValues: {
      date:  new Date().toISOString().split('T')[0],
      parts: [],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'parts' })

  const parts = watch('parts')
  const autoTotal = parts.reduce((sum, p) => sum + (p.quantity_used || 0) * (p.unit_price || 0), 0)

  const filteredVehicles = MOCK_VEHICLES.filter((v) => v.customer_id === selectedCustomer)

  const handlePartSelect = (index: number, partId: string) => {
    const part = MOCK_PARTS.find((p) => p.id === partId)
    if (part) {
      setValue(`parts.${index}.part_name`,  part.name)
      setValue(`parts.${index}.unit_price`, part.price)
    }
  }

  const onSubmit = async (data: MaintenanceLogFormData) => {
    setIsSubmitting(true)
    try {
      // TODO: POST to /api/maintenance-logs via Supabase
      console.log('Submitting:', data)
      await new Promise((r) => setTimeout(r, 1000)) // simulate request
      toast.success('تم حفظ سجل الصيانة بنجاح ✅')
      onSuccess?.()
    } catch {
      toast.error('حدث خطأ أثناء الحفظ، يرجى المحاولة مجدداً')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* ── Section: Customer & Vehicle ── */}
      <section className="glass-card p-5 space-y-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground font-arabic">
          <User size={16} className="text-brand-red" />
          بيانات العميل والسيارة
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="العميل" icon={User} error={errors.customer_id?.message}>
            <Select
              {...register('customer_id')}
              onChange={(e) => {
                setSelectedCustomer(e.target.value)
                setValue('customer_id', e.target.value)
                setValue('vehicle_id', '')
              }}
            >
              <option value="">-- اختر العميل --</option>
              {MOCK_CUSTOMERS.map((c) => (
                <option key={c.id} value={c.id}>{c.full_name} · {c.phone}</option>
              ))}
            </Select>
          </Field>

          <Field label="السيارة" icon={Car} error={errors.vehicle_id?.message}>
            <Select {...register('vehicle_id')} disabled={!selectedCustomer}>
              <option value="">-- اختر السيارة --</option>
              {filteredVehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.make} {v.model} {v.year} · {v.plate_number}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </section>

      {/* ── Section: Service Details ── */}
      <section className="glass-card p-5 space-y-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground font-arabic">
          <Wrench size={16} className="text-brand-red" />
          تفاصيل الصيانة
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="تاريخ الصيانة" icon={Calendar}>
            <Input type="date" {...register('date')} />
          </Field>
          <Field label="نوع الخدمة" icon={Wrench} error={errors.service_type?.message}>
            <Select {...register('service_type')}>
              <option value="">-- اختر الخدمة --</option>
              {SERVICE_TYPES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </Select>
          </Field>
          <Field label="قراءة العداد (كم)" icon={Gauge}>
            <Input type="number" placeholder="مثال: 45000" {...register('mileage')} />
          </Field>
          <Field label="العداد عند الصيانة القادمة (كم)" icon={Gauge}>
            <Input type="number" placeholder="مثال: 50000" {...register('next_service_km')} />
          </Field>
          <Field label="تاريخ الصيانة القادمة" icon={Calendar}>
            <Input type="date" {...register('next_service_date')} />
          </Field>
        </div>

        <Field label="وصف العمل المنجز" icon={FileText}>
          <Textarea placeholder="اكتب تفاصيل الصيانة..." {...register('description')} />
        </Field>
        <Field label="ملاحظات إضافية">
          <Textarea placeholder="أي ملاحظات أخرى..." {...register('notes')} />
        </Field>
      </section>

      {/* ── Section: Parts Used ── */}
      <section className="glass-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground font-arabic">
            <Package size={16} className="text-brand-red" />
            قطع الغيار المستخدمة
          </h3>
          <button
            type="button"
            onClick={() => append({ part_id: '', part_name: '', quantity_used: 1, unit_price: 0 })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-red/10 text-brand-red
              hover:bg-brand-red/20 text-xs font-medium transition-colors font-arabic"
          >
            <Plus size={13} />
            إضافة قطعة
          </button>
        </div>

        {fields.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4 font-arabic">
            لا توجد قطع مضافة — اضغط "إضافة قطعة" للبدء
          </p>
        )}

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-12 gap-2 items-end p-3 rounded-xl bg-surface-700/50 border border-white/[0.04] animate-fade-in"
            >
              {/* Part selector */}
              <div className="col-span-12 md:col-span-4">
                <label className="text-[11px] text-muted-foreground font-arabic mb-1 block">من المخزون</label>
                <Select onChange={(e) => handlePartSelect(index, e.target.value)}>
                  <option value="">-- اختر من المخزون --</option>
                  {MOCK_PARTS.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </Select>
              </div>

              {/* Custom name */}
              <div className="col-span-12 md:col-span-3">
                <label className="text-[11px] text-muted-foreground font-arabic mb-1 block">اسم القطعة *</label>
                <Input
                  placeholder="اسم القطعة"
                  {...register(`parts.${index}.part_name`)}
                />
              </div>

              {/* Quantity */}
              <div className="col-span-5 md:col-span-2">
                <label className="text-[11px] text-muted-foreground font-arabic mb-1 block">الكمية</label>
                <Input
                  type="number"
                  min={1}
                  placeholder="1"
                  {...register(`parts.${index}.quantity_used`)}
                />
              </div>

              {/* Unit price */}
              <div className="col-span-5 md:col-span-2">
                <label className="text-[11px] text-muted-foreground font-arabic mb-1 block">السعر (ج.م)</label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="0.00"
                  {...register(`parts.${index}.unit_price`)}
                />
              </div>

              {/* Remove */}
              <div className="col-span-2 md:col-span-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="w-9 h-9 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20
                    flex items-center justify-center transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Auto total */}
        {fields.length > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
            <span className="text-xs text-muted-foreground font-arabic">إجمالي القطع</span>
            <span className="text-sm font-bold text-brand-red font-mono">
              {autoTotal.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م
            </span>
          </div>
        )}
      </section>

      {/* ── Section: Total Cost ── */}
      <section className="glass-card p-5">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-48">
            <Field label="التكلفة الإجمالية (ج.م)" icon={DollarSign} error={errors.total_cost?.message}>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                className="text-lg font-bold font-mono"
                {...register('total_cost')}
              />
            </Field>
          </div>
          {fields.length > 0 && (
            <button
              type="button"
              onClick={() => setValue('total_cost', autoTotal)}
              className="mt-5 text-xs text-brand-red hover:underline font-arabic whitespace-nowrap"
            >
              احسب من القطع ({autoTotal.toLocaleString()} ج.م)
            </button>
          )}
        </div>
      </section>

      {/* ── Submit ── */}
      <div className="flex gap-3 justify-end">
        <button
          type="button"
          className="px-5 py-2.5 rounded-lg border border-white/[0.08] text-sm text-muted-foreground
            hover:text-foreground hover:bg-surface-600 transition-colors font-arabic"
        >
          إلغاء
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-brand-red text-white text-sm font-medium
            hover:bg-brand-red-dark active:scale-95 transition-all duration-150 disabled:opacity-60
            disabled:cursor-not-allowed glow-red font-arabic"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              جارٍ الحفظ...
            </span>
          ) : (
            <>
              <Save size={15} />
              حفظ سجل الصيانة
            </>
          )}
        </button>
      </div>
    </form>
  )
}
