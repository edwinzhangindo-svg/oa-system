import { db } from '@/lib/db'
import { services } from '@/lib/db/schema'
import Link from 'next/link'
import { SERVICE_CATEGORY_LABELS, formatCurrency } from '@/lib/utils'

export const metadata = { title: '产品管理' }

export default async function ServicesMgmtPage() {
  let allServices: any[] = []
  try {
    allServices = await db.select().from(services)
  } catch (e) {}

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">产品管理</h1>
          <p className="text-sm text-gray-500 mt-1">管理对外展示的服务产品和 SOP 流程</p>
        </div>
        <Link href="/admin/services-mgmt/new" className="btn-primary">+ 新建服务</Link>
      </div>

      <div className="flex gap-4 text-sm">
        <span className="badge badge-green">{allServices.filter((s: any) => s.isPublished).length} 个已上架</span>
        <span className="badge badge-gray">{allServices.filter((s: any) => !s.isPublished).length} 个未上架</span>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-5 py-3 font-medium text-gray-500">服务名称</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">分类</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">价格区间</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">状态</th>
              <th className="text-right px-5 py-3 font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {allServices.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-16 text-gray-400">
                还没有服务产品，<Link href="/admin/services-mgmt/new" className="text-brand-500 hover:underline">点击新建</Link>
              </td></tr>
            ) : allServices.map((svc: any) => (
              <tr key={svc.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-4">
                  <p className="font-medium text-gray-900">{svc.name}</p>
                  {svc.description && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{svc.description}</p>}
                </td>
                <td className="px-5 py-4"><span className="badge badge-blue">{SERVICE_CATEGORY_LABELS[svc.category]}</span></td>
                <td className="px-5 py-4 text-gray-600">
                  {svc.priceMin && svc.priceMax
                    ? `${formatCurrency(svc.priceMin, svc.currency)} – ${formatCurrency(svc.priceMax, svc.currency)}`
                    : svc.priceMin ? `从 ${formatCurrency(svc.priceMin, svc.currency)}` : '—'}
                </td>
                <td className="px-5 py-4">
                  <span className={`badge ${svc.isPublished ? 'badge-green' : 'badge-gray'}`}>
                    {svc.isPublished ? '已上架' : '未上架'}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <Link href={`/admin/services-mgmt/${svc.id}`} className="text-sm text-brand-600 hover:underline mr-4">编辑</Link>
                  <Link href={`/services/${svc.id}`} target="_blank" className="text-sm text-gray-400 hover:text-gray-600">预览 ↗</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
