import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    if (req.nextUrl.pathname === '/admin/login' && req.nextauth.token) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    }
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized({ token, req }) {
        const { pathname } = req.nextUrl
        if (pathname.startsWith('/admin') && pathname !== '/admin/login') return !!token
        return true
      },
    },
  }
)

export const config = { matcher: ['/admin/:path*'] }
