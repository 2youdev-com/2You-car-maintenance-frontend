import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString('ar-EG', { minimumFractionDigits: 0 })} ج.م`
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('ar-EG', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

export function formatDateShort(date: string): string {
  return new Date(date).toLocaleDateString('ar-EG')
}

export function formatMileage(km: number): string {
  return `${km.toLocaleString('ar-EG')} كم`
}

export function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
}

export const SERVICE_TYPE_LABELS: Record<string, string> = {
  oil_change:    'تغيير زيت',
  brake_service: 'صيانة فرامل',
  full_service:  'صيانة كاملة',
  repair:        'إصلاح',
  inspection:    'فحص دوري',
  tyre_change:   'تغيير إطارات',
  other:         'أخرى',
}

export const STATUS_LABELS: Record<string, string> = {
  completed:   'مكتمل',
  in_progress: 'جارٍ',
  pending:     'معلق',
  cancelled:   'ملغي',
}

export const STATUS_BADGE: Record<string, string> = {
  completed:   'badge-green',
  in_progress: 'badge-blue',
  pending:     'badge-yellow',
  cancelled:   'badge-red',
}
