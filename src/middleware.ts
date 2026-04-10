import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const token = request.cookies.get('token')?.value

  const adminRoutes = ['/dashboard', '/maintenance', '/inventory', '/customers', '/vehicles', '/appointments', '/reports', '/settings']
  const isAdminRoute = adminRoutes.some((r) => pathname.startsWith(r))

  // Protected routes: redirect to login if no token
  if (isAdminRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Already logged in: redirect away from login page
  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
