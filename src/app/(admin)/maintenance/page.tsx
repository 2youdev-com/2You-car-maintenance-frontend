'use client'

import MaintenanceLogForm from '@/components/forms/MaintenanceLogForm'
import { ClipboardList } from 'lucide-react'

export default function MaintenancePage() {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center">
          <ClipboardList size={20} className="text-brand-red" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground font-arabic">سجل صيانة جديد</h1>
          <p className="text-sm text-muted-foreground font-arabic mt-0.5">
            أدخل تفاصيل جلسة الصيانة لعميلك
          </p>
        </div>
      </div>
      <MaintenanceLogForm />
    </div>
  )
}
