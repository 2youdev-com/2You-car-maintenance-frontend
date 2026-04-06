import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // ── If Supabase not configured yet, skip auth checks (dev mode) ──
  if (!supabaseUrl || !supabaseKey ||
      supabaseUrl === 'https://YOUR_PROJECT_REF.supabase.co') {
    // Allow everything through — useful for UI development without Supabase
    return NextResponse.next()
  }

  // ── Auth check via Supabase ──────────────────────────────────────
  try {
    const { createServerClient } = await import('@supabase/ssr')

    let response = NextResponse.next({ request: { headers: request.headers } })

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        get(name) { return request.cookies.get(name)?.value },
        set(name, value, options) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name, options) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    })

    const { data: { user } } = await supabase.auth.getUser()

    const adminRoutes = ['/dashboard', '/maintenance', '/inventory', '/customers', '/vehicles', '/appointments', '/reports', '/settings']
    const isAdminRoute = adminRoutes.some((r) => pathname.startsWith(r))

    if (isAdminRoute && !user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (pathname === '/login' && user) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return response
  } catch {
    // If anything fails, just let it through
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
