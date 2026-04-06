import { Car, Clock, DollarSign, Wrench, Package, QrCode } from 'lucide-react'

// Mock customer data
const serviceHistory = [
  { date: '2024-05-10', service: 'تغيير زيت', car: 'BMW 320i 2021', mileage: 45000, cost: 850, status: 'completed' },
  { date: '2024-03-02', service: 'صيانة فرامل', car: 'BMW 320i 2021', mileage: 40200, cost: 1400, status: 'completed' },
  { date: '2024-01-15', service: 'فحص دوري', car: 'BMW 320i 2021', mileage: 35800, cost: 400, status: 'completed' },
]

const catalog = [
  { name: 'زيت موتور Castrol 5W40', brand: 'Castrol', price: 280, available: true },
  { name: 'فلتر زيت Bosch',         brand: 'Bosch',   price: 85,  available: true },
  { name: 'تيل فرامل Brembo',       brand: 'Brembo',  price: 350, available: true },
  { name: 'إطار Bridgestone',        brand: 'Bridgestone', price: 1200, available: false },
]

export default function CustomerPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in py-6 px-4">
      {/* Header card */}
      <div className="glass-card p-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-brand-red/20 border border-brand-red/30 flex items-center justify-center text-brand-red text-xl font-bold shrink-0">
          أ
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-foreground font-arabic">أحمد محمد السيد</h1>
          <p className="text-sm text-muted-foreground font-arabic">01012345678 · عميل مركز العمريطي</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-surface-600 flex items-center justify-center shrink-0">
          <QrCode size={22} className="text-muted-foreground" />
        </div>
      </div>

      {/* Vehicle card */}
      <div className="glass-card p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground font-arabic mb-4">
          <Car size={16} className="text-brand-red" />
          سيارتي
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'الماركة',     value: 'BMW' },
            { label: 'الموديل',     value: '320i' },
            { label: 'سنة الصنع',   value: '2021' },
            { label: 'رقم اللوحة',  value: 'أ ب ج 1234' },
          ].map((item) => (
            <div key={item.label} className="bg-surface-700 rounded-xl p-3">
              <p className="text-[11px] text-muted-foreground font-arabic">{item.label}</p>
              <p className="text-sm font-semibold text-foreground font-arabic mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 bg-brand-red/10 rounded-xl p-3">
          <Clock size={14} className="text-brand-red shrink-0" />
          <p className="text-xs font-arabic text-foreground">
            الصيانة القادمة: <span className="font-semibold text-brand-red">تغيير زيت</span> عند 50,000 كم · مارس 2025
          </p>
        </div>
      </div>

      {/* Service History */}
      <div className="glass-card overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.06]">
          <Wrench size={16} className="text-brand-red" />
          <h2 className="font-semibold text-foreground font-arabic">سجل الصيانة</h2>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {serviceHistory.map((log, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-4 hover:bg-surface-700/30 transition-colors">
              <div>
                <p className="text-sm font-medium font-arabic text-foreground">{log.service}</p>
                <p className="text-xs text-muted-foreground font-arabic mt-0.5">
                  {new Date(log.date).toLocaleDateString('ar-EG')} · {log.mileage.toLocaleString()} كم
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold font-mono text-foreground">
                  {log.cost.toLocaleString()} ج.م
                </span>
                <span className="badge-green">مكتمل</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Parts Catalog */}
      <div className="glass-card overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.06]">
          <Package size={16} className="text-brand-red" />
          <h2 className="font-semibold text-foreground font-arabic">كتالوج قطع الغيار</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
          {catalog.map((part, i) => (
            <div key={i} className="flex items-center justify-between p-3.5 bg-surface-700 rounded-xl">
              <div>
                <p className="text-sm font-medium font-arabic text-foreground">{part.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{part.brand}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-sm font-bold font-mono text-brand-red">{part.price.toLocaleString()} ج.م</span>
                {part.available
                  ? <span className="badge-green">متاح</span>
                  : <span className="badge-red">غير متاح</span>
                }
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
