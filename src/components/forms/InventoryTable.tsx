'use client'

import { useState } from 'react'
import {
  Plus, Search, Edit2, Trash2, Package, AlertTriangle,
  CheckCircle2, XCircle, ChevronUp, ChevronDown, X, Save
} from 'lucide-react'
import { toast } from 'sonner'
import type { SparePart, SparePartFormData } from '@/types'

// ── Mock data ──────────────────────────────────────────────────
const INITIAL_PARTS: SparePart[] = [
  { id: 'p1', center_id: 'c1', name: 'زيت موتور Castrol 5W40',    name_ar: null, brand: 'Castrol', sku: 'CAS-5W40-4L', price: 280, quantity: 42, unit: 'liter',  category: 'oil',    image_url: null, is_available: true, low_stock_threshold: 10, created_at: '', updated_at: '' },
  { id: 'p2', center_id: 'c1', name: 'فلتر زيت Bosch',             name_ar: null, brand: 'Bosch',   sku: 'BSH-OF-001',  price: 85,  quantity: 30, unit: 'piece',  category: 'filter', image_url: null, is_available: true, low_stock_threshold: 8,  created_at: '', updated_at: '' },
  { id: 'p3', center_id: 'c1', name: 'فلتر هواء Mann',             name_ar: null, brand: 'Mann',    sku: 'MAN-AF-200',  price: 120, quantity: 18, unit: 'piece',  category: 'filter', image_url: null, is_available: true, low_stock_threshold: 5,  created_at: '', updated_at: '' },
  { id: 'p4', center_id: 'c1', name: 'تيل فرامل Brembo',           name_ar: null, brand: 'Brembo',  sku: 'BRM-BP-101',  price: 350, quantity: 4,  unit: 'set',    category: 'brake',  image_url: null, is_available: true, low_stock_threshold: 6,  created_at: '', updated_at: '' },
  { id: 'p5', center_id: 'c1', name: 'بوجيه NGK Iridium',          name_ar: null, brand: 'NGK',     sku: 'NGK-IR-IX',   price: 95,  quantity: 24, unit: 'piece',  category: 'other',  image_url: null, is_available: true, low_stock_threshold: 8,  created_at: '', updated_at: '' },
  { id: 'p6', center_id: 'c1', name: 'إطار Bridgestone 205/55R16', name_ar: null, brand: 'Bridgestone', sku: 'BRD-T-001',price: 1200,quantity: 3,  unit: 'piece',  category: 'tyre',   image_url: null, is_available: false,low_stock_threshold: 4,  created_at: '', updated_at: '' },
  { id: 'p7', center_id: 'c1', name: 'ماء تبريد Mobil',            name_ar: null, brand: 'Mobil',   sku: 'MOB-CL-5L',   price: 65,  quantity: 15, unit: 'liter',  category: 'oil',    image_url: null, is_available: true, low_stock_threshold: 5,  created_at: '', updated_at: '' },
]

const CATEGORIES = [
  { value: 'all',    label: 'الكل' },
  { value: 'oil',    label: 'زيوت' },
  { value: 'filter', label: 'فلاتر' },
  { value: 'brake',  label: 'فرامل' },
  { value: 'tyre',   label: 'إطارات' },
  { value: 'other',  label: 'أخرى' },
]

const EMPTY_FORM: SparePartFormData = {
  name: '', name_ar: '', brand: '', sku: '', price: 0,
  quantity: 0, unit: 'piece', category: 'other',
  low_stock_threshold: 5, is_available: true,
}

type SortKey = 'name' | 'price' | 'quantity'

// ── Part Form Modal ────────────────────────────────────────────
function PartModal({
  part,
  onClose,
  onSave,
}: {
  part: Partial<SparePart> | null
  onClose: () => void
  onSave: (data: SparePartFormData) => void
}) {
  const [form, setForm] = useState<SparePartFormData>(
    part
      ? { name: part.name!, name_ar: part.name_ar || '', brand: part.brand || '', sku: part.sku || '',
          price: part.price!, quantity: part.quantity!, unit: part.unit!, category: part.category || 'other',
          low_stock_threshold: part.low_stock_threshold!, is_available: part.is_available! }
      : EMPTY_FORM
  )

  const set = (k: keyof SparePartFormData, v: unknown) =>
    setForm((prev) => ({ ...prev, [k]: v }))

  const inputCls = `w-full h-9 px-3 rounded-lg bg-surface-800 border border-white/[0.08]
    text-sm text-foreground placeholder:text-muted-foreground font-arabic
    focus:outline-none focus:ring-1 focus:ring-brand-red transition-all`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-card w-full max-w-lg animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <h3 className="font-semibold text-foreground font-arabic">
            {part?.id ? 'تعديل القطعة' : 'إضافة قطعة جديدة'}
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs text-muted-foreground font-arabic mb-1.5 block">اسم القطعة *</label>
              <input className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="مثال: زيت موتور Castrol 5W40" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-arabic mb-1.5 block">الماركة</label>
              <input className={inputCls} value={form.brand} onChange={(e) => set('brand', e.target.value)} placeholder="مثال: Castrol" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-arabic mb-1.5 block">SKU</label>
              <input className={inputCls} value={form.sku} onChange={(e) => set('sku', e.target.value)} placeholder="مثال: CAS-5W40" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-arabic mb-1.5 block">السعر (ج.م)</label>
              <input className={inputCls} type="number" min={0} step="0.01" value={form.price} onChange={(e) => set('price', +e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-arabic mb-1.5 block">الكمية</label>
              <input className={inputCls} type="number" min={0} value={form.quantity} onChange={(e) => set('quantity', +e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-arabic mb-1.5 block">الوحدة</label>
              <select className={inputCls} value={form.unit} onChange={(e) => set('unit', e.target.value)}>
                <option value="piece">قطعة</option>
                <option value="liter">لتر</option>
                <option value="set">طقم</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-arabic mb-1.5 block">الفئة</label>
              <select className={inputCls} value={form.category} onChange={(e) => set('category', e.target.value)}>
                {CATEGORIES.filter((c) => c.value !== 'all').map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-arabic mb-1.5 block">حد التنبيه (مخزون منخفض)</label>
              <input className={inputCls} type="number" min={0} value={form.low_stock_threshold} onChange={(e) => set('low_stock_threshold', +e.target.value)} />
            </div>
            <div className="col-span-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => set('is_available', !form.is_available)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${form.is_available ? 'bg-brand-red' : 'bg-surface-500'}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ${form.is_available ? 'left-[22px]' : 'left-0.5'}`} />
              </button>
              <span className="text-sm font-arabic text-foreground">{form.is_available ? 'متاح' : 'غير متاح'}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 justify-end px-5 py-4 border-t border-white/[0.06]">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-white/[0.08] text-sm text-muted-foreground hover:text-foreground hover:bg-surface-600 transition-colors font-arabic">
            إلغاء
          </button>
          <button
            onClick={() => onSave(form)}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-brand-red text-white text-sm hover:bg-brand-red-dark transition-colors glow-red font-arabic"
          >
            <Save size={14} />
            حفظ
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Inventory Table ───────────────────────────────────────
export default function InventoryTable() {
  const [parts, setParts]               = useState<SparePart[]>(INITIAL_PARTS)
  const [search, setSearch]             = useState('')
  const [category, setCategory]         = useState('all')
  const [sortKey, setSortKey]           = useState<SortKey>('name')
  const [sortAsc, setSortAsc]           = useState(true)
  const [modalPart, setModalPart]       = useState<Partial<SparePart> | null | false>(false)
  const [deleteId, setDeleteId]         = useState<string | null>(null)

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc((p) => !p)
    else { setSortKey(key); setSortAsc(true) }
  }

  const filtered = parts
    .filter((p) =>
      (category === 'all' || p.category === category) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
       (p.brand || '').toLowerCase().includes(search.toLowerCase()) ||
       (p.sku || '').toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      const av = sortKey === 'name' ? a.name : a[sortKey]
      const bv = sortKey === 'name' ? b.name : b[sortKey]
      return sortAsc
        ? (av as string | number) > (bv as string | number) ? 1 : -1
        : (av as string | number) < (bv as string | number) ? 1 : -1
    })

  const lowStock = parts.filter((p) => p.quantity <= p.low_stock_threshold).length

  const handleSave = (form: SparePartFormData) => {
    if (modalPart && 'id' in modalPart && modalPart.id) {
      setParts((prev) => prev.map((p) => p.id === modalPart.id ? { ...p, ...form } : p))
      toast.success('تم تحديث القطعة بنجاح')
    } else {
      const newPart: SparePart = {
        ...form, id: crypto.randomUUID(), center_id: 'c1',
        image_url: null, name_ar: form.name_ar || null, created_at: '', updated_at: '',
      }
      setParts((prev) => [newPart, ...prev])
      toast.success('تم إضافة القطعة بنجاح')
    }
    setModalPart(false)
  }

  const handleDelete = (id: string) => {
    setParts((prev) => prev.filter((p) => p.id !== id))
    toast.success('تم حذف القطعة')
    setDeleteId(null)
  }

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k
      ? sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />
      : <ChevronUp size={12} className="opacity-20" />

  return (
    <>
      <div className="space-y-4 animate-fade-in">
        {/* ── Toolbar ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="flex items-center gap-2 bg-surface-700 rounded-lg px-3 py-2 w-56">
              <Search size={14} className="text-muted-foreground shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث عن قطعة..."
                className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full font-arabic"
              />
            </div>
            {/* Category filter */}
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium font-arabic transition-colors ${
                  category === c.value
                    ? 'bg-brand-red text-white'
                    : 'bg-surface-700 text-muted-foreground hover:text-foreground'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {lowStock > 0 && (
              <span className="flex items-center gap-1 text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1.5 rounded-lg font-arabic">
                <AlertTriangle size={12} />
                {lowStock} قطعة منخفضة المخزون
              </span>
            )}
            <button
              onClick={() => setModalPart({})}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-red text-white text-sm
                hover:bg-brand-red-dark active:scale-95 transition-all glow-red font-arabic"
            >
              <Plus size={15} />
              إضافة قطعة
            </button>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>
                    <button onClick={() => toggleSort('name')} className="flex items-center gap-1 font-arabic">
                      القطعة <SortIcon k="name" />
                    </button>
                  </th>
                  <th className="font-arabic">الماركة / SKU</th>
                  <th className="font-arabic">الفئة</th>
                  <th>
                    <button onClick={() => toggleSort('price')} className="flex items-center gap-1 font-arabic">
                      السعر <SortIcon k="price" />
                    </button>
                  </th>
                  <th>
                    <button onClick={() => toggleSort('quantity')} className="flex items-center gap-1 font-arabic">
                      المخزون <SortIcon k="quantity" />
                    </button>
                  </th>
                  <th className="font-arabic">الحالة</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-muted-foreground font-arabic">
                      <Package size={32} className="mx-auto mb-2 opacity-30" />
                      لا توجد قطع مطابقة للبحث
                    </td>
                  </tr>
                )}
                {filtered.map((part) => {
                  const isLow = part.quantity <= part.low_stock_threshold
                  return (
                    <tr key={part.id}>
                      <td>
                        <div>
                          <p className="font-medium font-arabic">{part.name}</p>
                          {part.sku && <p className="text-[11px] text-muted-foreground font-mono mt-0.5">{part.sku}</p>}
                        </div>
                      </td>
                      <td className="text-muted-foreground">{part.brand || '—'}</td>
                      <td>
                        {part.category && (
                          <span className="badge-blue capitalize font-arabic">
                            {CATEGORIES.find((c) => c.value === part.category)?.label || part.category}
                          </span>
                        )}
                      </td>
                      <td className="font-mono font-medium">
                        {part.price.toLocaleString('ar-EG')} ج.م
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <span className={`font-bold font-mono ${isLow ? 'text-red-400' : 'text-emerald-400'}`}>
                            {part.quantity}
                          </span>
                          <span className="text-muted-foreground text-xs font-arabic">
                            {part.unit === 'piece' ? 'قطعة' : part.unit === 'liter' ? 'لتر' : 'طقم'}
                          </span>
                          {isLow && <AlertTriangle size={13} className="text-amber-400" />}
                        </div>
                      </td>
                      <td>
                        {part.is_available ? (
                          <span className="badge-green font-arabic">
                            <CheckCircle2 size={11} className="mr-1" />
                            متاح
                          </span>
                        ) : (
                          <span className="badge-red font-arabic">
                            <XCircle size={11} className="mr-1" />
                            غير متاح
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setModalPart(part)}
                            className="w-8 h-8 rounded-lg bg-surface-600 text-muted-foreground
                              hover:text-foreground hover:bg-surface-500 flex items-center justify-center transition-colors"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => setDeleteId(part.id)}
                            className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400
                              hover:bg-red-500/20 flex items-center justify-center transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-white/[0.04] flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-arabic">
              عرض {filtered.length} من {parts.length} قطعة
            </p>
          </div>
        </div>
      </div>

      {/* Part Form Modal */}
      {modalPart !== false && (
        <PartModal
          part={modalPart}
          onClose={() => setModalPart(false)}
          onSave={handleSave}
        />
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card w-full max-w-sm p-6 animate-fade-in text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center mx-auto">
              <Trash2 size={22} className="text-red-400" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground font-arabic">حذف القطعة</h3>
              <p className="text-sm text-muted-foreground mt-1 font-arabic">هل أنت متأكد؟ لا يمكن التراجع عن هذا الإجراء.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2 rounded-lg border border-white/[0.08] text-sm text-muted-foreground hover:text-foreground hover:bg-surface-600 transition-colors font-arabic">
                إلغاء
              </button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700 transition-colors font-arabic">
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
