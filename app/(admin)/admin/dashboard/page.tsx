import { db } from '@/lib/db'
import { services, inquiries } from '@/lib/db/schema'
import { eq, count } from 'drizzle-orm'
import Link from 'next/link'

export const metadata = { title: '概览看板' }

export default async function DashboardPage() {
  let totalServices = 0, publishedServices = 0, unreadInquiries = 0
  try {
    const [ts] = await db.select({ count: count() }).from(services)
    const [ps] = await db.select({ count: count() }).from(services).where(eq(services.isPublished, true))
    const [ui] = await db.select({ count: count() }).from(inquiries).where(eq(inquiries.isRead, false))
    totalServices = ts.count
    publishedServices = ps.count
    unreadInquiries = ui.count
  } catch (e) {}

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">概览看板</h1>
        <p className="text-sm text-gray-500 mt-1">欢迎回来，查看今日业务状态</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="card p-5">
          <p className="text-sm text-gray-500 mb-2">服务产品总数</p>
          <p className="text-3xl font-bold text-blue-600">{totalServices}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-gray-500 mb-2">已上架服务</p>
          <p className="text-3xl font-bold text-green-600">{publishedServices}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-gray-500 mb-2">未读询价</p>
          <p className="text-3xl font-bold text-amber-600">{unreadInquiries}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: '新建服务', href: '/admin/services-mgmt/new', icon: '➕' },
          { label: '产品管理', href: '/admin/services-mgmt',     icon: '🛍️' },
          { label: '查看前台', href: '/',                        icon: '🌐' },
        ].map((item) => (
          <Link key={item.label} href={item.href}
            className="card p-4 flex flex-col items-center gap-2 hover:border-brand-200 hover:shadow-md transition-all text-center">
            <span className="text-2xl">{item.icon}</span>
            <span className="text-sm font-medium text-gray-700">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
