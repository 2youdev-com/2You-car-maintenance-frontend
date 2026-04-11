'use client'

import { useEffect, useState } from 'react'
import { Package, Search, Filter, Loader2 } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'

interface Part {
  id: string
  name: string
  name_ar: string | null
  brand: string | null
  price: number
  unit: string
  category: string | null
  image_url: string | null
  is_available: boolean
}

const CATEGORIES = [
  { value: '',       label: 'الكل' },
  { value: 'oil',    label: 'زيوت' },
  { value: 'filter', label: 'فلاتر' },
  { value: 'brake',  label: 'فرامل' },
  { value: 'tyre',   label: 'إطارات' },
  { value: 'other',  label: 'أخرى' },
]

const CATEGORY_ICONS: Record<string, string> = {
  oil: '🛢️',
  filter: '🔧',
  brake: '🛑',
  tyre: '🛞',
  other: '📦',
}

export default function ProductsPage() {
  const [parts, setParts] = useState<Part[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    apiFetch<Part[]>('/inventory/public')
      .then(setParts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = parts.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.name_ar?.includes(search)
    const matchCat = !category || p.category === category
    return matchSearch && matchCat
  })

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Package size={22} className="text-brand-red" />
        <h1 className="text-xl font-bold font-arabic text-foreground">المنتجات وقطع الغيار</h1>
      </div>

      {/* Search */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="ابحث عن منتج..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pr-9 pl-3 rounded-xl bg-surface-700 border border-white/[0.08] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-brand-red transition-all font-arabic"
          />
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setCategory(c.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-arabic whitespace-nowrap transition-all ${
              category === c.value
                ? 'bg-brand-red text-white'
                : 'bg-surface-700 text-muted-foreground hover:text-foreground'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={28} className="animate-spin text-brand-red" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Package size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-arabic text-sm">لا توجد منتجات</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((part) => (
            <div key={part.id} className="glass-card p-4 flex items-start justify-between gap-3 hover:border-white/[0.12] transition-all group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{CATEGORY_ICONS[part.category || 'other'] || '📦'}</span>
                  <p className="text-sm font-semibold font-arabic text-foreground truncate">{part.name_ar || part.name}</p>
                </div>
                {part.brand && <p className="text-[11px] text-muted-foreground">{part.brand}</p>}
                <p className="text-xs text-muted-foreground font-arabic mt-1">
                  {part.unit === 'piece' ? 'قطعة' : part.unit === 'liter' ? 'لتر' : 'طقم'}
                </p>
              </div>
              <div className="text-left shrink-0">
                <p className="text-base font-bold font-mono text-brand-red">{formatCurrency(part.price)}</p>
                <span className="badge-green text-[10px] mt-1 inline-block">متاح</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
