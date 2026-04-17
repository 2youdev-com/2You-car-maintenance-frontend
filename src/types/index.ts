// ================================================================
// 2Y Cars - Type Definitions
// ================================================================

export type UserRole = 'admin' | 'customer'
export type PlanType = 'trial' | 'monthly' | 'annual'
export type LogStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'
export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'
export type ServiceType =
  | 'oil_change'
  | 'brake_service'
  | 'full_service'
  | 'repair'
  | 'inspection'
  | 'tyre_change'
  | 'other'

export interface Profile {
  id: string
  full_name: string
  phone: string | null
  email: string
  role: UserRole
  avatar_url: string | null
  center_id: string | null
  created_at: string
  updated_at: string
}

export interface Center {
  id: string
  name: string
  name_ar: string | null
  logo_url: string | null
  address: string | null
  phone: string | null
  email: string | null
  qr_code: string | null
  plan: PlanType
  trial_ends: string | null
  is_active: boolean
  created_at: string
}

export interface Vehicle {
  id: string
  customer_id: string
  center_id: string
  make: string
  model: string
  year: number | null
  color: string | null
  vin: string | null
  plate_number: string | null
  created_at: string
  updated_at: string
  // Joins
  customer?: Profile
}

export interface SparePart {
  id: string
  center_id: string
  name: string
  name_ar: string | null
  brand: string | null
  sku: string | null
  price: number
  quantity: number
  unit: string
  category: string | null
  image_url: string | null
  is_available: boolean
  low_stock_threshold: number
  created_at: string
  updated_at: string
}

export interface MaintenanceLogPart {
  id: string
  log_id: string
  part_id: string | null
  part_name: string
  quantity_used: number
  unit_price: number
  total_price: number
  // Join
  part?: SparePart
}

export interface MaintenanceLog {
  id: string
  center_id: string
  vehicle_id: string
  customer_id: string
  technician_id: string | null
  date: string
  mileage: number | null
  next_service_km: number | null
  next_service_date: string | null
  service_type: ServiceType
  description: string | null
  notes: string | null
  total_cost: number
  status: LogStatus
  created_at: string
  updated_at: string
  // Joins
  vehicle?: Vehicle
  customer?: Profile
  technician?: Profile
  parts?: MaintenanceLogPart[]
}

export interface Appointment {
  id: string
  center_id: string
  customer_id: string
  vehicle_id: string
  requested_at: string
  service_type: string | null
  notes: string | null
  status: AppointmentStatus
  created_at: string
  // Joins
  customer?: Profile
  vehicle?: Vehicle
}

// ----------------------------------------------------------------
// Dashboard Stats
// ----------------------------------------------------------------
export interface DashboardStats {
  totalCustomers: number
  pendingAppointments: number
  lowStockParts: number
  monthlyRevenue: number
  totalLogs: number
  revenueChange: number   // percentage vs last month
}

// ----------------------------------------------------------------
// Form Schemas (for react-hook-form)
// ----------------------------------------------------------------
export interface MaintenanceLogFormData {
  customer_id: string
  vehicle_id: string
  date: string
  mileage: number
  next_service_km: number
  next_service_date: string
  service_type: ServiceType
  description: string
  notes: string
  total_cost: number
  parts: {
    part_id: string
    part_name: string
    quantity_used: number
    unit_price: number
  }[]
}

export interface SparePartFormData {
  name: string
  name_ar: string
  brand: string
  sku: string
  price: number
  quantity: number
  unit: string
  category: string
  low_stock_threshold: number
  is_available: boolean
}
