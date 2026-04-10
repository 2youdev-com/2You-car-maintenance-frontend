'use client'

import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts'

export default function RevenueChart({ data }: { data: { month: string; revenue: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#E63946" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#E63946" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: '#6b7280', fontFamily: 'Cairo' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${(v/1000).toFixed(0)}k`}
        />
        <Tooltip
          contentStyle={{
            background: '#181B22',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '8px',
            color: '#F1FAEE',
            fontSize: 12,
          }}
          formatter={(v: number) => [`${v.toLocaleString()} ج.م`, 'الإيراد']}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#E63946"
          strokeWidth={2}
          fill="url(#revenueGrad)"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
