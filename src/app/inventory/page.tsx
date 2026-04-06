import InventoryTable from '@/components/forms/InventoryTable'
import { Package } from 'lucide-react'

export default function InventoryPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center">
          <Package size={20} className="text-brand-red" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground font-arabic">إدارة المخزون</h1>
          <p className="text-sm text-muted-foreground font-arabic mt-0.5">
            إضافة وتعديل وحذف قطع الغيار المتاحة
          </p>
        </div>
      </div>
      <InventoryTable />
    </div>
  )
}
