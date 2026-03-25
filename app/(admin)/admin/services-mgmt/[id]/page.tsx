import { db } from '@/lib/db'
import { services, sopSteps } from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'
import { ServiceForm } from '@/components/admin/ServiceForm'
import { SopStepsEditor } from '@/components/admin/SopStepsEditor'

export default async function ServiceEditPage({ params }: any) {
  const isNew = params.id === 'new'
  let service: any = null
  let steps: any[] = []

  if (!isNew) {
    try {
      const rows = await db.select().from(services).where(eq(services.id, params.id)).limit(1)
      service = rows[0] ?? null
      if (service) {
        steps = await db.select().from(sopSteps).where(eq(sopSteps.serviceId, params.id)).orderBy(asc(sopSteps.stepOrder))
      }
    } catch (e) {}
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{isNew ? '新建服务产品' : '编辑服务产品'}</h1>
        <p className="text-sm text-gray-500 mt-1">填写服务信息后点击保存，上架后客户可在前台查看</p>
      </div>
      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 mb-5">基本信息</h2>
        <ServiceForm service={service} />
      </div>
      {!isNew && service && (
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-1">SOP 流程步骤</h2>
          <p className="text-sm text-gray-400 mb-5">配置后客户在服务详情页可看到完整办理流程</p>
          <SopStepsEditor serviceId={service.id} initialSteps={steps} />
        </div>
      )}
      {isNew && (
        <p className="text-sm text-gray-400 bg-amber-50 border border-amber-100 rounded-lg px-4 py-3">
          💡 保存基本信息后，可以继续配置 SOP 流程步骤
        </p>
      )}
    </div>
  )
}
