'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import type {
  MaintenanceLog, SparePart, Vehicle, Profile,
  Appointment, DashboardStats,
} from '@/types'

const supabase = createClient()

// ── Generic hook ───────────────────────────────────────────────
function useSupabase<T>(
  fetcher: () => Promise<{ data: T | null; error: unknown }>,
  deps: unknown[] = []
) {
  const [data,    setData]    = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data: result, error: err } = await fetcher()
    if (err) setError(String(err))
    else     setData(result)
    setLoading(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => { load() }, [load])

  return { data, loading, error, refetch: load }
}

// ── Dashboard Stats ────────────────────────────────────────────
export function useDashboardStats(centerId: string) {
  return useSupabase<DashboardStats>(async () => {
    const now       = new Date()
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    const [
      { count: totalCustomers },
      { count: pendingAppointments },
      { count: totalLogs },
      { data: revData },
      { data: lowStock },
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
      supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('center_id', centerId).eq('status', 'pending'),
      supabase.from('maintenance_logs').select('*', { count: 'exact', head: true }).eq('center_id', centerId),
      supabase.from('maintenance_logs').select('total_cost').eq('center_id', centerId).gte('date', thisMonth),
      supabase.from('spare_parts').select('id').eq('center_id', centerId).lte('quantity', 5),
    ])

    const monthlyRevenue = (revData || []).reduce((s, l) => s + (l.total_cost || 0), 0)

    return {
      data: {
        totalCustomers:      totalCustomers ?? 0,
        pendingAppointments: pendingAppointments ?? 0,
        lowStockParts:       (lowStock || []).length,
        monthlyRevenue,
        totalLogs:           totalLogs ?? 0,
        revenueChange:       18.4, // TODO: compare with last month
      },
      error: null,
    }
  }, [centerId])
}

// ── Maintenance Logs ──────────────────────────────────────────
export function useMaintenanceLogs(centerId: string, filters?: {
  vehicle_id?: string
  customer_id?: string
  status?: string
  limit?: number
}) {
  return useSupabase<MaintenanceLog[]>(async () => {
    let query = supabase
      .from('maintenance_logs')
      .select(`
        *,
        vehicle:vehicles(make, model, year, plate_number),
        customer:profiles!customer_id(full_name, phone),
        parts:maintenance_log_parts(*)
      `)
      .eq('center_id', centerId)
      .order('date', { ascending: false })
      .limit(filters?.limit ?? 50)

    if (filters?.vehicle_id)  query = query.eq('vehicle_id', filters.vehicle_id)
    if (filters?.customer_id) query = query.eq('customer_id', filters.customer_id)
    if (filters?.status)      query = query.eq('status', filters.status)

    return query as never
  }, [centerId, filters?.vehicle_id, filters?.customer_id, filters?.status])
}

// ── Spare Parts / Inventory ───────────────────────────────────
export function useInventory(centerId: string, search?: string) {
  return useSupabase<SparePart[]>(async () => {
    let query = supabase
      .from('spare_parts')
      .select('*')
      .eq('center_id', centerId)
      .order('name', { ascending: true })

    if (search) query = query.ilike('name', `%${search}%`)

    return query as never
  }, [centerId, search])
}

// ── Vehicles ──────────────────────────────────────────────────
export function useVehicles(centerId: string, customerId?: string) {
  return useSupabase<Vehicle[]>(async () => {
    let query = supabase
      .from('vehicles')
      .select('*, customer:profiles!customer_id(full_name, phone)')
      .eq('center_id', centerId)
      .order('created_at', { ascending: false })

    if (customerId) query = query.eq('customer_id', customerId)

    return query as never
  }, [centerId, customerId])
}

// ── Customers ─────────────────────────────────────────────────
export function useCustomers(centerId: string) {
  return useSupabase<Profile[]>(async () => {
    const { data: vehicleLinks } = await supabase
      .from('vehicles')
      .select('customer_id')
      .eq('center_id', centerId)

    const ids = [...new Set((vehicleLinks || []).map((v: { customer_id: string }) => v.customer_id))]
    if (ids.length === 0) return { data: [], error: null }

    return supabase
      .from('profiles')
      .select('*')
      .in('id', ids)
      .eq('role', 'customer')
      .order('full_name') as never
  }, [centerId])
}

// ── Appointments ──────────────────────────────────────────────
export function useAppointments(centerId: string, status?: string) {
  return useSupabase<Appointment[]>(async () => {
    let query = supabase
      .from('appointments')
      .select(`
        *,
        customer:profiles!customer_id(full_name, phone),
        vehicle:vehicles(make, model, plate_number)
      `)
      .eq('center_id', centerId)
      .order('requested_at', { ascending: true })

    if (status) query = query.eq('status', status)

    return query as never
  }, [centerId, status])
}

// ── Current User Profile ──────────────────────────────────────
export function useProfile() {
  return useSupabase<Profile>(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { data: null, error: 'Not authenticated' }

    return supabase.from('profiles').select('*').eq('id', user.id).single() as never
  }, [])
}

// ── Revenue Chart Data ────────────────────────────────────────
export function useRevenueChart(centerId: string, months = 6) {
  return useSupabase<{ month: string; revenue: number }[]>(async () => {
    const since = new Date(Date.now() - months * 30 * 24 * 60 * 60 * 1000).toISOString()

    const { data, error } = await supabase
      .from('maintenance_logs')
      .select('date, total_cost')
      .eq('center_id', centerId)
      .gte('date', since)
      .eq('status', 'completed')

    if (error) return { data: null, error }

    const grouped: Record<string, number> = {}
    for (const log of data || []) {
      const month = log.date.slice(0, 7)
      grouped[month] = (grouped[month] || 0) + log.total_cost
    }

    return {
      data: Object.entries(grouped).map(([month, revenue]) => ({ month, revenue })),
      error: null,
    }
  }, [centerId, months])
}
