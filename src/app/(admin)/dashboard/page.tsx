'use client'

import dynamic from 'next/dynamic'
import {
  Users, ClipboardList, Package, TrendingUp,
  AlertTriangle, ArrowUpRight, ArrowDownRight, Calendar
} from 'lucide-react'

const RevenueChart = dynamic(() => import('@/components/charts/RevenueChart'), { ssr: false })

// ── Mock data (replace with API queries) ──────────────────
const stats = [
  {
    label: 'إجمالي العملاء',
    labelEn: 'Total Customers',
    value: '247',
    change: '+12%',
    up: true,
    icon: Users,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    label: 'سجلات الصيانة',
    labelEn: 'Maintenance Logs',
    value: '1,438',
    change: '+8%',
    up: true,
    icon: ClipboardList,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    label: 'مواعيد معلقة',
    labelEn: 'Pending Appointments',
    value: '14',
    change: '-3',
    up: false,
    icon: Calendar,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
  {
    label: 'قطع منخفضة المخزون',
    labelEn: 'Low Stock Parts',
    value: '6',
    change: '+2',
    up: false,
    icon: AlertTriangle,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
  },
]

const revenueData = [
  { month: 'يناير', revenue: 18000 },
  { month: 'فبراير', revenue: 22000 },
  { month: 'مارس',  revenue: 19500 },
  { month: 'أبريل', revenue: 28000 },
  { month: 'مايو',  revenue: 24500 },
  { month: 'يونيو', revenue: 31000 },
]

const recentLogs = [
  { customer: 'أحمد محمد', car: 'BMW 320i 2021', type: 'تغيير زيت', cost: 850, status: 'completed' },
  { customer: 'محمد علي',  car: 'Mercedes C200 2020', type: 'صيانة كاملة', cost: 2400, status: 'in_progress' },
  { customer: 'خالد إبراهيم', car: 'Toyota Camry 2022', type: 'فرامل', cost: 1200, status: 'completed' },
  { customer: 'سارة أحمد', car: 'Hyundai Elantra 2023', type: 'فحص دوري', cost: 400, status: 'pending' },
  { customer: 'عمر حسن',  car: 'Kia Sportage 2021', type: 'تغيير زيت', cost: 750, status: 'completed' },
]

const statusMap: Record<string, string> = {
  completed:   'badge-green',
  in_progress: 'badge-blue',
  pending:     'badge-yellow',
  cancelled:   'badge-red',
}

const statusLabel: Record<string, string> = {
  completed:   'مكتمل',
  in_progress: 'جارٍ',
  pending:     'معلق',
  cancelled:   'ملغي',
}

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground font-arabic">لوحة التحكم</h1>
        <p className="text-sm text-muted-foreground font-arabic mt-1">
          مرحباً بك في نظام إدارة مركز العمريطي
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="stat-card">
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <Icon size={19} className={s.color} />
                </div>
                <span className={`flex items-center gap-1 text-xs font-medium ${s.up ? 'text-emerald-400' : 'text-red-400'}`}>
                  {s.up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                  {s.change}
                </span>
              </div>
              <p className="text-3xl font-bold text-foreground mt-3">{s.value}</p>
              <p className="text-xs text-muted-foreground font-arabic">{s.label}</p>
            </div>
          )
        })}
      </div>

      {/* Revenue Chart + Recent */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Chart */}
        <div className="glass-card p-5 xl:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-foreground font-arabic">الإيرادات الشهرية</h2>
              <p className="text-xs text-muted-foreground mt-0.5">بالجنيه المصري (EGP)</p>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 text-sm font-medium">
              <TrendingUp size={15} />
              <span>+18.4%</span>
            </div>
          </div>
          <RevenueChart data={revenueData} />
        </div>

        {/* Quick stats sidebar */}
        <div className="glass-card p-5 flex flex-col gap-4">
          <h2 className="font-semibold text-foreground font-arabic">ملخص سريع</h2>
          {[
            { label: 'إيراد هذا الشهر', value: '31,000 ج.م', color: 'text-emerald-400' },
            { label: 'متوسط تكلفة الصيانة', value: '1,240 ج.م', color: 'text-blue-400' },
            { label: 'أكثر خدمة مطلوبة', value: 'تغيير الزيت', color: 'text-amber-400' },
            { label: 'نسبة العملاء العائدين', value: '68%', color: 'text-purple-400' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0">
              <span className="text-xs text-muted-foreground font-arabic">{item.label}</span>
              <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Maintenance Logs */}
      <div className="glass-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <h2 className="font-semibold text-foreground font-arabic">آخر سجلات الصيانة</h2>
          <a href="/maintenance" className="text-xs text-brand-red hover:underline font-arabic">
            عرض الكل
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="font-arabic">العميل</th>
                <th className="font-arabic">السيارة</th>
                <th className="font-arabic">نوع الخدمة</th>
                <th className="font-arabic">التكلفة</th>
                <th className="font-arabic">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {recentLogs.map((log, i) => (
                <tr key={i}>
                  <td className="font-medium font-arabic">{log.customer}</td>
                  <td className="text-muted-foreground">{log.car}</td>
                  <td className="font-arabic">{log.type}</td>
                  <td className="font-mono">{log.cost.toLocaleString()} ج.م</td>
                  <td>
                    <span className={statusMap[log.status]}>
                      {statusLabel[log.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
