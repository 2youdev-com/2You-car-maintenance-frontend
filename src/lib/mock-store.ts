'use client'

import { useSyncExternalStore } from 'react'

// ── Types ──────────────────────────────────────────────────
export type MockCustomer = {
  id: string
  full_name: string
  phone: string
  email: string
  created_at: string
}

export type MockVehicle = {
  id: string
  customer_id: string
  make: string
  model: string
  year: number
  color: string
  plate_number: string
  vin?: string
}

export type MockPart = {
  part_id?: string
  part_name: string
  quantity_used: number
  unit_price: number
}

export type MockLog = {
  id: string
  customer_id: string
  vehicle_id: string
  date: string
  service_type: string
  mileage: number
  next_service_km?: number
  next_service_date?: string
  description?: string
  notes?: string
  total_cost: number
  parts: MockPart[]
  created_at: string
}

// ── Seed data ──────────────────────────────────────────────
const SEED_CUSTOMERS: MockCustomer[] = [
  { id: 'c1', full_name: 'أحمد محمد السيد',   phone: '01012345678', email: 'ahmed@mail.com',   created_at: '2023-06-12' },
  { id: 'c2', full_name: 'محمد علي إبراهيم',  phone: '01198765432', email: 'mohamed@mail.com', created_at: '2023-08-03' },
  { id: 'c3', full_name: 'خالد عبدالله حسن',  phone: '01234567890', email: 'khaled@mail.com',  created_at: '2023-11-20' },
  { id: 'c4', full_name: 'سارة أحمد مصطفى',  phone: '01056781234', email: 'sara@mail.com',    created_at: '2024-01-15' },
  { id: 'c5', full_name: 'عمر حسن محمود',    phone: '01112233445', email: 'omar@mail.com',    created_at: '2023-04-28' },
]

const SEED_VEHICLES: MockVehicle[] = [
  { id: 'v1', customer_id: 'c1', make: 'BMW',       model: '320i',    year: 2021, color: 'أبيض',  plate_number: 'أ ب ج 1234', vin: 'WBA3A5G59DNP26082' },
  { id: 'v2', customer_id: 'c2', make: 'Mercedes',  model: 'C200',    year: 2020, color: 'رمادي', plate_number: 'د ه و 5678', vin: 'WDDGF4HB8EA974285' },
  { id: 'v3', customer_id: 'c3', make: 'Toyota',    model: 'Camry',   year: 2022, color: 'أحمر',  plate_number: 'ز ح ط 9012', vin: '4T1BF1FK5CU538825' },
  { id: 'v4', customer_id: 'c4', make: 'Hyundai',   model: 'Elantra', year: 2023, color: 'أزرق',  plate_number: 'ك ل م 3456' },
  { id: 'v5', customer_id: 'c5', make: 'Kia',       model: 'Sportage',year: 2021, color: 'أسود',  plate_number: 'ن س ع 7890', vin: 'KNDPBCAC7E7004193' },
  { id: 'v6', customer_id: 'c2', make: 'Chevrolet', model: 'Optra',   year: 2019, color: 'فضي',   plate_number: 'ف ص ق 1122' },
  { id: 'v7', customer_id: 'c5', make: 'Toyota',    model: 'Corolla', year: 2020, color: 'أبيض',  plate_number: 'ل م ن 3344' },
  { id: 'v8', customer_id: 'c5', make: 'Nissan',    model: 'Sunny',   year: 2022, color: 'فضي',   plate_number: 'ر س ش 5566' },
]

const SEED_LOGS: MockLog[] = [
  { id: 'l1', customer_id: 'c1', vehicle_id: 'v1', date: '2024-05-10', service_type: 'oil_change',    mileage: 35000, total_cost: 1200, parts: [], created_at: '2024-05-10T10:00:00Z' },
  { id: 'l2', customer_id: 'c2', vehicle_id: 'v2', date: '2024-04-22', service_type: 'full_service',  mileage: 48000, total_cost: 4500, parts: [], created_at: '2024-04-22T10:00:00Z' },
  { id: 'l3', customer_id: 'c2', vehicle_id: 'v6', date: '2024-03-05', service_type: 'brake_service', mileage: 62000, total_cost: 2800, parts: [], created_at: '2024-03-05T10:00:00Z' },
  { id: 'l4', customer_id: 'c3', vehicle_id: 'v3', date: '2024-03-15', service_type: 'inspection',    mileage: 22000, total_cost:  500, parts: [], created_at: '2024-03-15T10:00:00Z' },
  { id: 'l5', customer_id: 'c5', vehicle_id: 'v5', date: '2024-04-10', service_type: 'oil_change',    mileage: 55000, total_cost: 1350, parts: [], created_at: '2024-04-10T10:00:00Z' },
  { id: 'l6', customer_id: 'c5', vehicle_id: 'v7', date: '2024-02-18', service_type: 'tyre_change',   mileage: 40000, total_cost: 5200, parts: [], created_at: '2024-02-18T10:00:00Z' },
  { id: 'l7', customer_id: 'c5', vehicle_id: 'v8', date: '2024-05-01', service_type: 'repair',        mileage: 18000, total_cost: 3800, parts: [], created_at: '2024-05-01T10:00:00Z' },
]

// ── Storage ────────────────────────────────────────────────
type Snapshot = {
  customers: MockCustomer[]
  vehicles: MockVehicle[]
  logs: MockLog[]
}

const SEED: Snapshot = { customers: SEED_CUSTOMERS, vehicles: SEED_VEHICLES, logs: SEED_LOGS }
const STORAGE_KEY = 'el-amrety:store:v1'

function readFromStorage(): Snapshot {
  if (typeof window === 'undefined') return SEED
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return SEED
    const parsed = JSON.parse(raw) as Partial<Snapshot>
    return {
      customers: Array.isArray(parsed.customers) ? parsed.customers : SEED_CUSTOMERS,
      vehicles:  Array.isArray(parsed.vehicles)  ? parsed.vehicles  : SEED_VEHICLES,
      logs:      Array.isArray(parsed.logs)      ? parsed.logs      : SEED_LOGS,
    }
  } catch {
    return SEED
  }
}

function writeToStorage(snap: Snapshot) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snap))
  } catch {
    /* ignore quota errors */
  }
}

// ── Pub/sub store ──────────────────────────────────────────
let snapshot: Snapshot = SEED
let initialized = false
const listeners = new Set<() => void>()

function ensureInit() {
  if (initialized || typeof window === 'undefined') return
  snapshot = readFromStorage()
  initialized = true
}

function commit(next: Snapshot) {
  snapshot = next
  writeToStorage(next)
  listeners.forEach((l) => l())
}

export const store = {
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  getSnapshot(): Snapshot {
    ensureInit()
    return snapshot
  },
  getServerSnapshot(): Snapshot {
    return SEED
  },

  // Customers
  addCustomer(data: Omit<MockCustomer, 'id' | 'created_at'>): MockCustomer {
    ensureInit()
    const entry: MockCustomer = {
      ...data,
      id: `c${Date.now()}`,
      created_at: new Date().toISOString().split('T')[0],
    }
    commit({ ...snapshot, customers: [entry, ...snapshot.customers] })
    return entry
  },
  removeCustomer(id: string) {
    ensureInit()
    commit({
      customers: snapshot.customers.filter((c) => c.id !== id),
      vehicles:  snapshot.vehicles.filter((v) => v.customer_id !== id),
      logs:      snapshot.logs.filter((l) => l.customer_id !== id),
    })
  },

  // Vehicles
  addVehicle(data: Omit<MockVehicle, 'id'>): MockVehicle {
    ensureInit()
    const entry: MockVehicle = { ...data, id: `v${Date.now()}` }
    commit({ ...snapshot, vehicles: [entry, ...snapshot.vehicles] })
    return entry
  },
  removeVehicle(id: string) {
    ensureInit()
    commit({
      ...snapshot,
      vehicles: snapshot.vehicles.filter((v) => v.id !== id),
      logs:     snapshot.logs.filter((l) => l.vehicle_id !== id),
    })
  },

  // Logs
  addLog(data: Omit<MockLog, 'id' | 'created_at'>): MockLog {
    ensureInit()
    const entry: MockLog = {
      ...data,
      id: `l${Date.now()}`,
      created_at: new Date().toISOString(),
    }
    commit({ ...snapshot, logs: [entry, ...snapshot.logs] })
    return entry
  },
  removeLog(id: string) {
    ensureInit()
    commit({ ...snapshot, logs: snapshot.logs.filter((l) => l.id !== id) })
  },

  reset() {
    commit(SEED)
  },
}

// Back-compat alias for existing form code
export const maintenanceStore = {
  add: store.addLog,
  remove: store.removeLog,
  reset: store.reset,
}

// ── React hooks ────────────────────────────────────────────
export function useSnapshot(): Snapshot {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot)
}

export function useCustomers(): MockCustomer[] {
  return useSnapshot().customers
}

export function useVehicles(): MockVehicle[] {
  return useSnapshot().vehicles
}

export function useMaintenanceLogs(): MockLog[] {
  return useSnapshot().logs
}

export function useCustomer(id: string | undefined): MockCustomer | undefined {
  const customers = useCustomers()
  return id ? customers.find((c) => c.id === id) : undefined
}

export function useCustomerVehicles(customerId: string | undefined): MockVehicle[] {
  const vehicles = useVehicles()
  if (!customerId) return []
  return vehicles.filter((v) => v.customer_id === customerId)
}

export function useCustomerLogs(customerId: string | undefined): MockLog[] {
  const logs = useMaintenanceLogs()
  if (!customerId) return []
  return logs
    .filter((l) => l.customer_id === customerId)
    .sort((a, b) => b.date.localeCompare(a.date))
}
