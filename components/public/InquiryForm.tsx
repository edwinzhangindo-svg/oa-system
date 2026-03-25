'use client'
import { useState } from 'react'

export function InquiryForm({ serviceId, serviceName }: { serviceId: string; serviceName: string }) {
  const [form, setForm] = useState({ companyName: '', contactName: '', phone: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    const res = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, serviceId }),
    })
    setStatus(res.ok ? 'success' : 'error')
  }

  if (status === 'success') {
    return (
      <div className="text-center py-6">
        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
          <span className="text-green-600 text-xl">✓</span>
        </div>
        <h3 className="font-medium text-gray-900 mb-1">提交成功！</h3>
        <p className="text-sm text-gray-400">我们会在1个工作日内联系您</p>
      </div>
    )
  }

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div><label className="label">公司名称 *</label><input className="input" value={form.companyName} onChange={e => set('companyName', e.target.value)} placeholder="您的公司名称" required /></div>
      <div><label className="label">联系人 *</label><input className="input" value={form.contactName} onChange={e => set('contactName', e.target.value)} placeholder="您的姓名" required /></div>
      <div><label className="label">联系电话 *</label><input className="input" type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+86 / +62" required /></div>
      <div><label className="label">邮箱</label><input className="input" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="可选" /></div>
      <div><label className="label">补充说明</label><textarea className="input resize-none" rows={3} value={form.message} onChange={e => set('message', e.target.value)} placeholder={`关于「${serviceName}」的具体需求…`} /></div>
      {status === 'error' && <p className="text-sm text-red-600">提交失败，请稍后重试</p>}
      <button type="submit" disabled={status === 'loading'} className="btn-primary w-full justify-center py-3 disabled:opacity-60">
        {status === 'loading' ? '提交中...' : '立即咨询'}
      </button>
    </form>
  )
}
