'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await signIn('credentials', { email, password, redirect: false })
    if (res?.ok) {
      router.push('/admin/dashboard')
    } else {
      setError('邮箱或密码错误')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-brand-500 flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold text-lg">印</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">后台管理系统</h1>
          <p className="text-sm text-gray-400 mt-1">印尼企业服务内部平台</p>
        </div>
        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">邮箱</label>
              <input type="email" className="input" placeholder="your@company.com"
                value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
            </div>
            <div>
              <label className="label">密码</label>
              <input type="password" className="input" placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            {error && <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-2.5 text-sm text-red-600">{error}</div>}
            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center py-3 disabled:opacity-60">
              {loading ? '登录中...' : '登录'}
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-gray-400 mt-6">内部系统，仅限授权人员访问</p>
      </div>
    </div>
  )
}
