import { db } from '@/lib/db'
import { services, sopSteps } from '@/lib/db/schema'
import { eq, asc, and } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SERVICE_CATEGORY_LABELS, formatCurrency } from '@/lib/utils'
import { InquiryForm } from '@/components/public/InquiryForm'

export default async function ServiceDetailPage({ params }: any) {
  let svc: any = null
  let steps: any[] = []
  try {
    const rows = await db.select().from(services)
      .where(and(eq(services.id, params.id), eq(services.isPublished, true))).limit(1)
    svc = rows[0]
    if (svc) {
      steps = await db.select().from(sopSteps)
        .where(eq(sopSteps.serviceId, params.id)).orderBy(asc(sopSteps.stepOrder))
    }
  } catch (e) {}

  if (!svc) notFound()

  const highlights = (svc.highlights as string[] | null) ?? []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-700">首页</Link>
          <span>/</span>
          <Link href="/services" className="hover:text-gray-700">服务产品</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">{svc.name}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* 标题 */}
            <div>
              <span className="badge badge-blue mb-3">{SERVICE_CATEGORY_LABELS[svc.category]}</span>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">{svc.name}</h1>
              {svc.description && <p className="text-gray-600 leading-relaxed">{svc.description}</p>}
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
                {svc.estimatedDays && <span>⏱ 约 {svc.estimatedDays} 天</span>}
                {steps.length > 0 && <span>📋 {steps.length} 个步骤</span>}
                {(svc.priceMin || svc.priceMax) && (
                  <span className="font-medium text-brand-600">
                    {svc.priceMin && svc.priceMax
                      ? `${formatCurrency(svc.priceMin, svc.currency)} – ${formatCurrency(svc.priceMax, svc.currency)}`
                      : `从 ${formatCurrency(svc.priceMin ?? svc.priceMax, svc.currency)}`}
                  </span>
                )}
              </div>
            </div>

            {/* 亮点 */}
            {highlights.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="font-semibold text-gray-900 mb-4">服务亮点</h2>
                <div className="grid grid-cols-2 gap-3">
                  {highlights.map((h: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="w-5 h-5 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center text-xs flex-shrink-0">✓</span>
                      {h}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 详细介绍 */}
            {svc.longDesc && (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="font-semibold text-gray-900 mb-3">服务介绍</h2>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{svc.longDesc}</p>
              </div>
            )}

            {/* SOP 流程 */}
            {steps.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="font-semibold text-gray-900 mb-6">办理流程</h2>
                <div className="space-y-0">
                  {steps.map((step: any, idx: number) => (
                    <div key={step.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center text-sm font-medium flex-shrink-0">
                          {idx + 1}
                        </div>
                        {idx < steps.length - 1 && (
                          <div className="w-0.5 bg-brand-100 my-1" style={{ minHeight: '24px' }} />
                        )}
                      </div>
                      <div className={`flex-1 ${idx < steps.length - 1 ? 'pb-6' : ''}`}>
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900">{step.title}</h3>
                          {step.slaDays && (
                            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">约 {step.slaDays} 天</span>
                          )}
                        </div>
                        {step.description && <p className="text-sm text-gray-500 mt-1 leading-relaxed">{step.description}</p>}
                        {step.requiredDocs && (step.requiredDocs as string[]).length > 0 && (
                          <details className="mt-2 group">
                            <summary className="text-xs text-brand-600 cursor-pointer hover:underline list-none flex items-center gap-1">
                              <span className="group-open:rotate-90 transition-transform inline-block">›</span>
                              所需材料（{(step.requiredDocs as string[]).length} 项）
                            </summary>
                            <ul className="mt-2 space-y-1 pl-3">
                              {(step.requiredDocs as string[]).map((doc: string, di: number) => (
                                <li key={di} className="text-xs text-gray-500 flex items-center gap-1.5">
                                  <span className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0"></span>{doc}
                                </li>
                              ))}
                            </ul>
                          </details>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 询价卡片 */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="font-semibold text-gray-900 mb-1">免费咨询报价</h2>
                <p className="text-sm text-gray-400 mb-5">填写信息，1个工作日内联系您</p>
                <InquiryForm serviceId={svc.id} serviceName={svc.name} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
