'use client'

import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

const TOOLTIP_STYLE = {
  background: '#181B22',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '8px',
  color: '#F1FAEE',
  fontSize: 12,
}

export function RevenueExpensesChart({ data }: { data: { month: string; revenue: number; expenses: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#E63946" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#E63946" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#6b7280" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#6b7280" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280', fontFamily: 'Cairo' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
        <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`${v.toLocaleString()} ج.م`]} />
        <Area type="monotone" dataKey="revenue"  stroke="#E63946" strokeWidth={2} fill="url(#revGrad)" name="الإيراد" dot={false} />
        <Area type="monotone" dataKey="expenses" stroke="#6b7280" strokeWidth={1.5} fill="url(#expGrad)" name="المصروفات" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function ServicePieChart({ data }: { data: { name: string; value: number; fill: string }[] }) {
  return (
    <ResponsiveContainer width="50%" height={180}>
      <PieChart>
        <Pie data={data} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
          {data.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
        </Pie>
        <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`${v}%`, 'النسبة']} />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function CustomersBarChart({ data }: { data: { month: string; new: number; returning: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} barGap={4}>
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280', fontFamily: 'Cairo' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'Cairo' }} formatter={(v) => v === 'new' ? 'جدد' : 'عائدون'} />
        <Bar dataKey="returning" name="returning" fill="#457B9D" radius={[4,4,0,0]} />
        <Bar dataKey="new"       name="new"       fill="#E63946" radius={[4,4,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
