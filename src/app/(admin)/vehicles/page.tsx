'use client'

import { useState } from 'react'
import {
  Car, Plus, Search, Hash, User, Calendar,
  Edit2, Trash2, ChevronRight, X, Save,
} from 'lucide-react'
import { toast } from 'sonner'

const MOCK_VEHICLES = [
  { id: 'v1', make: 'BMW',       model: '320i',    year: 2021, color: 'أبيض',  plate_number: 'أ ب ج 1234', vin: 'WBA3A5G59DNP26082', customer: { full_name: 'أحمد محمد السيد',  phone: '01012345678' } },
  { id: 'v2', make: 'Mercedes',  model: 'C200',    year: 2020, color: 'رمادي', plate_number: 'د ه و 5678', vin: 'WDDGF4HB8EA974285', customer: { full_name: 'محمد علي إبراهيم', phone: '01198765432' } },
  { id: 'v3', make: 'Toyota',    model: 'Camry',   year: 2022, color: 'أحمر',  plate_number: 'ز ح ط 9012', vin: '4T1BF1FK5CU538825',  customer: { full_name: 'خالد عبدالله حسن', phone: '01234567890' } },
  { id: 'v4', make: 'Hyundai',   model: 'Elantra', year: 2023, color: 'أزرق',  plate_number: 'ك ل م 3456', vin: null,               customer: { full_name: 'سارة أحمد مصطفى',  phone: '01056781234' } },
  { id: 'v5', make: 'Kia',       model: 'Sportage',year: 2021, color: 'أسود',  plate_number: 'ن س ع 7890', vin: 'KNDPBCAC7E7004193',  customer: { full_name: 'عمر حسن محمود',    phone: '01112233445' } },
  { id: 'v6', make: 'Chevrolet', model: 'Optra',   year: 2019, color: 'فضي',   plate_number: 'ف ص ق 1122', vin: null,               customer: { full_name: 'محمد علي إبراهيم', phone: '01198765432' } },
]

type Vehicle = typeof MOCK_VEHICLES[0]

const CAR_COLORS: Record<string, string> = {
  أبيض: 'bg-gray-100',
  رمادي: 'bg-gray-400',
  أحمر: 'bg-red-500',
  أزرق: 'bg-blue-500',
  أسود: 'bg-gray-900',
  فضي: 'bg-gray-300',
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState(MOCK_VEHICLES)
  const [search,   setSearch]   = useState('')
  const [selected, setSelected] = useState<Vehicle | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = vehicles.filter((v) =>
    `${v.make} ${v.model} ${v.plate_number} ${v.customer.full_name}`
      .toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = (id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id))
    setDeleteId(null)
    toast.success('تم حذف السيارة')
  }

  return (
    <>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Car size={20} className="text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground font-arabic">السيارات</h1>
              <p className="text-sm text-muted-foreground font-arabic">{vehicles.length} سيارة مسجلة</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-red text-white text-sm hover:bg-brand-red-dark active:scale-95 transition-all glow-red font-arabic">
            <Plus size={15} />
            تسجيل سيارة
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-surface-700 rounded-xl px-4 py-2.5 max-w-sm">
          <Search size={15} className="text-muted-foreground shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث بالماركة أو اللوحة أو العميل..."
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full font-arabic"
          />
        </div>

        {/* Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="font-arabic">السيارة</th>
                  <th className="font-arabic">اللوحة</th>
                  <th className="font-arabic">VIN</th>
                  <th className="font-arabic">العميل</th>
                  <th className="font-arabic">اللون</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filtered.map((v) => (
                  <tr key={v.id}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-surface-600 flex items-center justify-center shrink-0">
                          <Car size={15} className="text-brand-red" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{v.make} {v.model}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar size={10} />
                            {v.year}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="font-arabic font-mono text-sm bg-surface-600 px-2 py-0.5 rounded-lg">
                        {v.plate_number}
                      </span>
                    </td>
                    <td>
                      {v.vin ? (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                          <Hash size={10} />
                          {v.vin.slice(0, 8)}…
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <User size={12} className="text-muted-foreground shrink-0" />
                        <span className="text-sm font-arabic">{v.customer.full_name}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-3 h-3 rounded-full border border-white/10 ${CAR_COLORS[v.color] || 'bg-surface-500'}`} />
                        <span className="text-xs font-arabic text-muted-foreground">{v.color}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => setSelected(v)}
                          className="w-8 h-8 rounded-lg bg-surface-600 text-muted-foreground hover:text-foreground hover:bg-surface-500 flex items-center justify-center transition-colors"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteId(v.id)}
                          className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                        <button className="w-8 h-8 rounded-lg bg-surface-600 text-muted-foreground hover:text-foreground hover:bg-surface-500 flex items-center justify-center transition-colors">
                          <ChevronRight size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-white/[0.04]">
            <p className="text-xs text-muted-foreground font-arabic">
              عرض {filtered.length} من {vehicles.length} سيارة
            </p>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md animate-fade-in">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <h3 className="font-semibold font-arabic">تعديل بيانات السيارة</h3>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-3">
              {(['make', 'model', 'year', 'color', 'plate_number', 'vin'] as const).map((field) => (
                <div key={field}>
                  <label className="text-xs text-muted-foreground mb-1 block font-arabic">
                    {{ make: 'الماركة', model: 'الموديل', year: 'السنة', color: 'اللون', plate_number: 'رقم اللوحة', vin: 'رقم VIN' }[field]}
                  </label>
                  <input
                    defaultValue={selected[field] ?? ''}
                    className="w-full h-9 px-3 rounded-lg bg-surface-800 border border-white/[0.08]
                      text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-brand-red
                      transition-all font-arabic"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-2 justify-end px-5 py-4 border-t border-white/[0.06]">
              <button onClick={() => setSelected(null)} className="px-4 py-2 rounded-lg border border-white/[0.08] text-sm text-muted-foreground hover:bg-surface-600 transition-colors font-arabic">
                إلغاء
              </button>
              <button
                onClick={() => { toast.success('تم حفظ التعديلات'); setSelected(null) }}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-brand-red text-white text-sm hover:bg-brand-red-dark transition-colors glow-red font-arabic"
              >
                <Save size={14} />حفظ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card w-full max-w-sm p-6 animate-fade-in text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center mx-auto">
              <Trash2 size={22} className="text-red-400" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground font-arabic">حذف السيارة</h3>
              <p className="text-sm text-muted-foreground mt-1 font-arabic">سيتم حذف السيارة وجميع سجلاتها. لا يمكن التراجع.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2 rounded-lg border border-white/[0.08] text-sm text-muted-foreground hover:bg-surface-600 transition-colors font-arabic">إلغاء</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700 transition-colors font-arabic">حذف</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
