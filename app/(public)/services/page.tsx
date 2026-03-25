import { db } from '@/lib/db'
import { services } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import { SERVICE_CATEGORY_LABELS, formatCurrency } from '@/lib/utils'

export const metadata = { title: '服务产品' }

export default async function ServicesPage({ searchParams }: any) {
  let allServices: any[] = []
  try {
    allServices = await db.select().from(services).where(eq(services.isPublished, true))
  } catch (e) {}

  const activeCategory = searchParams?.category ?? 'all'
  const filtered = activeCategory === 'all' ? allServices : allServices.filter((s: any) => s.category === activeCategory)

  const categories = [
    { key: 'all', label: '全部服务' },
    ...Object.entries(SERVICE_CATEGORY_LABELS).map(([k, v]) => ({ key: k, label: v })),
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 mb-3 block">← 返回首页</Link>
          <h1 className="text-2xl font-bold text-gray-900">服务产品</h1>
          <p className="text-gray-500 mt-1">共 {allServices.length} 项专业服务</p>
        </div>
        <div className="max-w-6xl mx-auto px-6 overflow-x-auto">
          <div className="flex gap-1 border-b border-gray-100">
            {categories.map((cat) => (
              <Link key={cat.key}
                href={cat.key === 'all' ? '/services' : `/services?category=${cat.key}`}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeCategory === cat.key ? 'border-brand-500 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}>
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-400">暂无服务，请联系我们咨询</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((svc: any) => (
              <Link key={svc.id} href={`/services/${svc.id}`}
                className="bg-white rounded-xl border border-gray-100 p-5 hover:border-brand-200 hover:shadow-md transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <span className="badge badge-blue">{SERVICE_CATEGORY_LABELS[svc.category]}</span>
                  {svc.estimatedDays && <span className="text-xs text-gray-400">约 {svc.estimatedDays} 天</span>}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-brand-600 transition-colors">{svc.name}</h3>
                {svc.description && <p className="text-sm text-gray-500 line-clamp-2 mb-3">{svc.description}</p>}
                {(svc.priceMin || svc.priceMax) && (
                  <p className="text-sm font-medium text-brand-600">
                    {svc.priceMin && svc.priceMax
                      ? `${formatCurrency(svc.priceMin, svc.currency)} – ${formatCurrency(svc.priceMax, svc.currency)}`
                      : `从 ${formatCurrency(svc.priceMin ?? svc.priceMax, svc.currency)}`}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
