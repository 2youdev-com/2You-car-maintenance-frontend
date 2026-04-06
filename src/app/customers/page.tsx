import { Users, Phone, Car, Search, Plus, ChevronRight } from 'lucide-react'
import { getInitials, formatDateShort } from '@/lib/utils'

// Mock data — replace with Supabase fetch
const customers = [
  { id: 'c1', full_name: 'أحمد محمد السيد',   phone: '01012345678', email: 'ahmed@mail.com', vehicles: 1, lastVisit: '2024-05-10', totalSpent: 4200 },
  { id: 'c2', full_name: 'محمد علي إبراهيم',  phone: '01198765432', email: 'mohamed@mail.com', vehicles: 2, lastVisit: '2024-04-22', totalSpent: 8750 },
  { id: 'c3', full_name: 'خالد عبدالله حسن',  phone: '01234567890', email: 'khaled@mail.com', vehicles: 1, lastVisit: '2024-03-15', totalSpent: 3100 },
  { id: 'c4', full_name: 'سارة أحمد مصطفى',  phone: '01056781234', email: 'sara@mail.com',   vehicles: 1, lastVisit: '2024-05-01', totalSpent: 1800 },
  { id: 'c5', full_name: 'عمر حسن محمود',    phone: '01112233445', email: 'omar@mail.com',   vehicles: 3, lastVisit: '2024-04-10', totalSpent: 12400 },
]

export default function CustomersPage() {
  return (
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
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-red text-white text-sm hover:bg-brand-red-dark active:scale-95 transition-all glow-red font-arabic">
          <Plus size={15} />
          إضافة عميل
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-surface-700 rounded-xl px-4 py-2.5 max-w-sm">
        <Search size={15} className="text-muted-foreground shrink-0" />
        <input
          placeholder="ابحث بالاسم أو الهاتف..."
          className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full font-arabic"
        />
      </div>

      {/* Customer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {customers.map((c) => (
          <a
            key={c.id}
            href={`/customers/${c.id}`}
            className="glass-card p-5 hover:border-brand-red/20 hover:bg-surface-700/50 transition-all group cursor-pointer"
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
                  {c.vehicles}
                </p>
              </div>
              <div className="bg-surface-700 rounded-lg p-2 text-center">
                <p className="text-xs text-muted-foreground font-arabic">آخر زيارة</p>
                <p className="text-xs font-medium text-foreground mt-0.5">{formatDateShort(c.lastVisit)}</p>
              </div>
              <div className="bg-surface-700 rounded-lg p-2 text-center">
                <p className="text-xs text-muted-foreground font-arabic">الإجمالي</p>
                <p className="text-xs font-bold text-emerald-400 font-mono mt-0.5">{c.totalSpent.toLocaleString()}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
