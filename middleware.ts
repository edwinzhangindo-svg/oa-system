export { default } from 'next-auth/middleware'

export const config = {
  matcher: ['/admin/dashboard/:path*', '/admin/services-mgmt/:path*'],
}
