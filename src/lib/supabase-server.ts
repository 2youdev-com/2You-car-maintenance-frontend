import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createServerSupabase() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}

// ── Auth helpers ───────────────────────────────────────────────
export async function getServerUser() {
  const supabase = createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getServerProfile() {
  const supabase = createServerSupabase()
  const user     = await getServerUser()
  if (!user) return null

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return data
}
