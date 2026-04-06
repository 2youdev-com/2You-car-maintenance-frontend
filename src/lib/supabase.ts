// ================================================================
// Supabase Client — Browser & Server
// ================================================================
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Browser client (use in client components)
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// ----------------------------------------------------------------
// Server client — use in Server Components / Route Handlers
// ----------------------------------------------------------------
// server.ts (separate file for server usage):
// import { createServerClient } from '@supabase/ssr'
// import { cookies } from 'next/headers'
