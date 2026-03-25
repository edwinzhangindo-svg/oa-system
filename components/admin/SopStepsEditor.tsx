'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

const ROLES = [
  { value: 'ops', label: '运营' },
  { value: 'sales', label: '销售' },
  { value: 'accountant', label: '财务' },
  { value: 'admin', label: '管理员' },
]

export function SopStepsEditor({ serviceId, initialSteps }: { serviceId: string; initialSteps: any[] }) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [steps, setSteps] = useState(initialSteps)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  const emptyDraft = () => ({
    id: `new-${Date.now()}`, serviceId, stepOrder: steps.length + 1,
    title: '', description: '', requiredDocs: [], assigneeRole: 'ops', slaDays: null, isNew: true,
  })

  async function saveStep(step: any) {
    if (!step) return
    setSaving(true)
    const isNew = step.isNew
    const res = await fetch(
      isNew ? `/api/services/${serviceId}/sop` : `/api/services/${serviceId}/sop/${step.id}`,
      { method: isNew ? 'POST' : 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: step.title, description: step.description, requiredDocs: step.requiredDocs, assigneeRole: step.assigneeRole, slaDays: step.slaDays, stepOrder: step.stepOrder }) }
    )
    if (res.ok) { setDraft(null); setEditingId(null); startTransition(() => router.refresh()) }
    setSaving(false)
  }

  async function deleteStep(id: string) {
    if (!confirm('确定删除这个步骤？')) return
    await fetch(`/api/services/${serviceId}/sop/${id}`, { method: 'DELETE' })
    startTransition(() => router.refresh())
  }

  const allSteps = draft ? [...steps, draft] : steps

  return (
    <div className="space-y-3">
      {allSteps.map((step: any, idx: number) => {
        const isEditing = editingId === step.id || step.isNew
        const isDraft = step.isNew
        const current = isDraft ? draft : steps.find((s: any) => s.id === step.id)
        const setCurrent = (k: string, v: any) => {
          if (isDraft) setDraft((d: any) => ({ ...d, [k]: v }))
          else setSteps(ss => ss.map((s: any) => s.id === step.id ? { ...s, [k]: v } : s))
        }

        if (isEditing && current) return (
          <div key={step.id} className="border border-brand-200 rounded-xl p-4 bg-brand-50/30 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-brand-600 mb-2">
              <span className="w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center text-xs">{idx + 1}</span>
              {isDraft ? '新步骤' : '编辑步骤'}
            </div>
            <div><label className="label">步骤名称 *</label><input className="input" value={current.title} onChange={e => setCurrent('title', e.target.value)} placeholder="例：在 OSS 系统申请 NIB 营业执照" required /></div>
            <div><label className="label">操作说明</label><textarea className="input resize-y text-sm" rows={2} value={current.description ?? ''} onChange={e => setCurrent('description', e.target.value)} placeholder="描述这个步骤具体做什么" /></div>
            <div>
              <label className="label">所需文件清单（每行一项）</label>
              <textarea className="input resize-y text-sm font-mono" rows={3}
                value={(current.requiredDocs ?? []).join('\n')}
                onChange={e => setCurrent('requiredDocs', e.target.value.split('\n').map((s: string) => s.trim()).filter(Boolean))}
                placeholder={"护照复印件\n公司章程\n股东信息表"} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">负责角色</label>
                <select className="input" value={current.assigneeRole ?? 'ops'} onChange={e => setCurrent('assigneeRole', e.target.value)}>
                  {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
              <div><label className="label">参考工期（天）</label>
                <input className="input" type="number" value={current.slaDays ?? ''} onChange={e => setCurrent('slaDays', e.target.value ? parseInt(e.target.value) : null)} placeholder="7" />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => saveStep(current)} disabled={saving || !current.title} className="btn-primary text-sm py-2 disabled:opacity-60">
                {saving ? '保存中...' : '保存步骤'}
              </button>
              <button onClick={() => { setEditingId(null); setDraft(null) }} className="btn-secondary text-sm py-2">取消</button>
            </div>
          </div>
        )

        return (
          <div key={step.id} className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <span className="w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5">{idx + 1}</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{step.title}</p>
                  {step.description && <p className="text-xs text-gray-400 mt-1 leading-relaxed">{step.description}</p>}
                  {step.requiredDocs && (step.requiredDocs as string[]).length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {(step.requiredDocs as string[]).map((doc: string, i: number) => (
                        <span key={i} className="badge badge-blue text-xs">{doc}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {step.slaDays && <span className="text-xs text-gray-400">约 {step.slaDays} 天</span>}
                <button onClick={() => setEditingId(step.id)} className="text-xs text-brand-600 hover:underline">编辑</button>
                <button onClick={() => deleteStep(step.id)} className="text-xs text-red-400 hover:text-red-600">删除</button>
              </div>
            </div>
          </div>
        )
      })}

      {!draft && (
        <button onClick={() => setDraft(emptyDraft())}
          className="w-full border-2 border-dashed border-gray-200 rounded-xl py-3 text-sm text-gray-400 hover:border-brand-300 hover:text-brand-500 transition-colors">
          + 添加步骤
        </button>
      )}
    </div>
  )
}
