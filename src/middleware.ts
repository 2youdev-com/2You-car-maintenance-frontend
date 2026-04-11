import { NextResponse, type NextRequest } from 'next/server'

function parseJwtPayload(token: string): { role?: string } | null {
  try {
    const base64 = token.split('.')[1]
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(json)
  } catch {
    return null
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const token = request.cookies.get('token')?.value
  const payload = token ? parseJwtPayload(token) : null
  const role = payload?.role

  const adminRoutes = ['/dashboard', '/maintenance', '/inventory', '/customers', '/vehicles', '/appointments', '/reports', '/settings']
  const isAdminRoute = adminRoutes.some((r) => pathname.startsWith(r))
  const isCustomerRoute = pathname.startsWith('/customer')

  // No token → must go to login
  if ((isAdminRoute || isCustomerRoute) && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Customer trying to access admin routes → redirect to /customer
  if (isAdminRoute && role === 'customer') {
    return NextResponse.redirect(new URL('/customer', request.url))
  }

  // Already logged in on login page → redirect based on role
  if (pathname === '/login' && token) {
    const dest = role === 'admin' ? '/dashboard' : '/customer'
    return NextResponse.redirect(new URL(dest, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
