'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { SERVICE_CATEGORY_LABELS } from '@/lib/utils'

export function ServiceForm({ service }: { service: any }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name:          service?.name          ?? '',
    category:      service?.category      ?? 'company_registration',
    description:   service?.description   ?? '',
    longDesc:      service?.longDesc       ?? '',
    highlights:    ((service?.highlights as string[]) ?? []).join('\n'),
    priceMin:      service?.priceMin       ?? '',
    priceMax:      service?.priceMax       ?? '',
    currency:      service?.currency       ?? 'CNY',
    estimatedDays: service?.estimatedDays?.toString() ?? '',
    isRecurring:   service?.isRecurring    ?? false,
    recurCycle:    service?.recurCycle     ?? 'month',
    recurAmount:   service?.recurAmount    ?? '',
    isPublished:   service?.isPublished    ?? false,
    sortOrder:     service?.sortOrder?.toString() ?? '0',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const payload = {
      ...form,
      highlights:    form.highlights.split('\n').map((s: string) => s.trim()).filter(Boolean),
      priceMin:      form.priceMin      || null,
      priceMax:      form.priceMax      || null,
      estimatedDays: form.estimatedDays ? parseInt(form.estimatedDays) : null,
      recurAmount:   form.recurAmount   || null,
      sortOrder:     parseInt(form.sortOrder) || 0,
    }
    const url    = service ? `/api/services/${service.id}` : '/api/services'
    const method = service ? 'PATCH' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (!res.ok) { setError('保存失败，请重试'); return }
    const saved = await res.json()
    startTransition(() => { router.push(`/admin/services-mgmt/${saved.id}`); router.refresh() })
  }

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">服务名称 *</label>
          <input className="input" value={form.name} onChange={e => set('name', e.target.value)} required placeholder="例：PT PMA 外商独资公司注册" />
        </div>
        <div>
          <label className="label">服务分类 *</label>
          <select className="input" value={form.category} onChange={e => set('category', e.target.value)}>
            {Object.entries(SERVICE_CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="label">简短描述（列表页显示）</label>
        <input className="input" value={form.description} onChange={e => set('description', e.target.value)} placeholder="一句话介绍，50字以内" />
      </div>
      <div>
        <label className="label">详细介绍（详情页显示）</label>
        <textarea className="input min-h-24 resize-y" value={form.longDesc} onChange={e => set('longDesc', e.target.value)} placeholder="详细说明服务内容、注意事项等" />
      </div>
      <div>
        <label className="label">服务亮点（每行一条，最多4条）</label>
        <textarea className="input min-h-20 resize-y font-mono text-sm" value={form.highlights} onChange={e => set('highlights', e.target.value)} placeholder={"专业本地团队\n全程进度追踪\n明码标价\n中文服务"} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div><label className="label">最低价格</label><input className="input" type="number" value={form.priceMin} onChange={e => set('priceMin', e.target.value)} placeholder="15000" /></div>
        <div><label className="label">最高价格</label><input className="input" type="number" value={form.priceMax} onChange={e => set('priceMax', e.target.value)} placeholder="25000" /></div>
        <div>
          <label className="label">币种</label>
          <select className="input" value={form.currency} onChange={e => set('currency', e.target.value)}>
            <option value="CNY">人民币 CNY</option>
            <option value="IDR">印尼盾 IDR</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="label">参考办理周期（天）</label><input className="input" type="number" value={form.estimatedDays} onChange={e => set('estimatedDays', e.target.value)} placeholder="30" /></div>
        <div><label className="label">排序权重</label><input className="input" type="number" value={form.sortOrder} onChange={e => set('sortOrder', e.target.value)} placeholder="0" /></div>
      </div>
      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={form.isPublished} onChange={e => set('isPublished', e.target.checked)} className="w-4 h-4 accent-brand-500" />
        <span className="text-sm font-medium text-gray-700">立即上架（勾选后前台可见）</span>
      </label>
      {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2.5">{error}</p>}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={isPending} className="btn-primary disabled:opacity-60">
          {isPending ? '保存中...' : service ? '保存修改' : '创建服务'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-secondary">取消</button>
      </div>
    </form>
  )
}
