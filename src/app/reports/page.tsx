'use client'

import dynamic from 'next/dynamic'
import {
  BarChart3, TrendingUp, TrendingDown, DollarSign,
  Users, Wrench, Package,
} from 'lucide-react'

const RevenueExpensesChart = dynamic(() => import('@/components/charts/ReportsCharts').then(m => m.RevenueExpensesChart), { ssr: false })
const ServicePieChart      = dynamic(() => import('@/components/charts/ReportsCharts').then(m => m.ServicePieChart), { ssr: false })
const CustomersBarChart    = dynamic(() => import('@/components/charts/ReportsCharts').then(m => m.CustomersBarChart), { ssr: false })

const revenueData = [
  { month: 'يناير', revenue: 18000, expenses: 8000 },
  { month: 'فبراير', revenue: 22000, expenses: 9500 },
  { month: 'مارس',  revenue: 19500, expenses: 8200 },
  { month: 'أبريل', revenue: 28000, expenses: 11000 },
  { month: 'مايو',  revenue: 24500, expenses: 10000 },
  { month: 'يونيو', revenue: 31000, expenses: 12500 },
]

const serviceData = [
  { name: 'تغيير زيت',   value: 42, fill: '#E63946' },
  { name: 'فرامل',       value: 18, fill: '#457B9D' },
  { name: 'صيانة كاملة', value: 15, fill: '#2A9D8F' },
  { name: 'إطارات',      value: 12, fill: '#E9C46A' },
  { name: 'أخرى',        value: 13, fill: '#F4A261' },
]

const monthlyCustomers = [
  { month: 'يناير', new: 8,  returning: 34 },
  { month: 'فبراير', new: 12, returning: 38 },
  { month: 'مارس',  new: 6,  returning: 41 },
  { month: 'أبريل', new: 15, returning: 45 },
  { month: 'مايو',  new: 9,  returning: 42 },
  { month: 'يونيو', new: 11, returning: 48 },
]

const kpis = [
  { label: 'إجمالي الإيراد',      value: '143,000 ج.م', sub: 'آخر 6 أشهر',    icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10', trend: '+18.4%', up: true },
  { label: 'إجمالي الصيانات',     value: '312',          sub: 'آخر 6 أشهر',    icon: Wrench,     color: 'text-blue-400',   bg: 'bg-blue-500/10',   trend: '+9.2%',  up: true },
  { label: 'عملاء جدد',           value: '61',            sub: 'آخر 6 أشهر',    icon: Users,      color: 'text-purple-400', bg: 'bg-purple-500/10', trend: '+5%',    up: true },
  { label: 'متوسط تكلفة الصيانة', value: '1,240 ج.م',   sub: 'لكل زيارة',     icon: BarChart3,  color: 'text-amber-400',  bg: 'bg-amber-500/10',  trend: '+2.1%',  up: true },
]

export default function ReportsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
          <BarChart3 size={20} className="text-emerald-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground font-arabic">التقارير والإحصائيات</h1>
          <p className="text-sm text-muted-foreground font-arabic">نظرة شاملة على أداء المركز</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k) => {
          const Icon = k.icon
          return (
            <div key={k.label} className="stat-card">
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-xl ${k.bg} flex items-center justify-center`}>
                  <Icon size={18} className={k.color} />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-medium ${k.up ? 'text-emerald-400' : 'text-red-400'}`}>
                  {k.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {k.trend}
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground mt-3">{k.value}</p>
              <p className="text-xs text-muted-foreground font-arabic">{k.label}</p>
              <p className="text-[10px] text-muted-foreground/60 font-arabic">{k.sub}</p>
            </div>
          )
        })}
      </div>

      {/* Revenue vs Expenses */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-semibold text-foreground font-arabic">الإيرادات مقابل المصروفات</h2>
            <p className="text-xs text-muted-foreground mt-0.5 font-arabic">آخر 6 أشهر (ج.م)</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              إيراد
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="w-2.5 h-2.5 rounded-full bg-surface-400" />
              مصروفات
            </span>
          </div>
        </div>
        <RevenueExpensesChart data={revenueData} />
      </div>

      {/* Service breakdown + Customer chart */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Pie chart */}
        <div className="glass-card p-5">
          <h2 className="font-semibold text-foreground font-arabic mb-4">توزيع أنواع الخدمات</h2>
          <div className="flex items-center gap-4">
            <ServicePieChart data={serviceData} />
            <div className="flex-1 space-y-2">
              {serviceData.map((s) => (
                <div key={s.name} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs text-muted-foreground font-arabic">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.fill }} />
                    {s.name}
                  </span>
                  <span className="text-xs font-bold text-foreground">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customers bar chart */}
        <div className="glass-card p-5">
          <h2 className="font-semibold text-foreground font-arabic mb-1">العملاء الجدد مقابل العائدين</h2>
          <p className="text-xs text-muted-foreground mb-4 font-arabic">آخر 6 أشهر</p>
          <CustomersBarChart data={monthlyCustomers} />
        </div>
      </div>

      {/* Top parts used */}
      <div className="glass-card overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.06]">
          <Package size={16} className="text-brand-red" />
          <h2 className="font-semibold text-foreground font-arabic">أكثر قطع الغيار استخداماً</h2>
        </div>
        <div className="p-5 space-y-3">
          {[
            { name: 'زيت موتور Castrol 5W40', used: 89, revenue: 24920 },
            { name: 'فلتر زيت Bosch',         used: 72, revenue:  6120 },
            { name: 'فلتر هواء Mann',         used: 45, revenue:  5400 },
            { name: 'تيل فرامل Brembo',       used: 38, revenue: 13300 },
            { name: 'بوجيه NGK Iridium',      used: 31, revenue:  2945 },
          ].map((part, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-xs font-bold text-muted-foreground w-5 shrink-0">#{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-arabic truncate">{part.name}</p>
                  <span className="text-xs text-muted-foreground font-arabic shrink-0 ml-2">{part.used} مرة</span>
                </div>
                <div className="h-1.5 bg-surface-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-red rounded-full transition-all"
                    style={{ width: `${(part.used / 89) * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-xs font-mono text-emerald-400 shrink-0">
                {part.revenue.toLocaleString()} ج.م
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
