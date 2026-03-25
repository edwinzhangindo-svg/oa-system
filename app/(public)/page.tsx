import Link from 'next/link'
import { db } from '@/lib/db'
import { services } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { SERVICE_CATEGORY_LABELS } from '@/lib/utils'

export default async function HomePage() {
  let publishedServices: any[] = []
  try {
    publishedServices = await db.select().from(services).where(eq(services.isPublished, true)).limit(6)
  } catch (e) {}

  const categories = [
    { key: 'company_registration', icon: '🏢', desc: '外商独资 PT PMA、代表处注册' },
    { key: 'finance_tax',          icon: '📊', desc: '记账报税、年度审计、税务筹划' },
    { key: 'hr_visa',              icon: '📋', desc: 'KITAS 工作签证、BPJS 社保代缴' },
    { key: 'license_permit',       icon: '✅', desc: 'API 进出口、BPOM 认证、SNI' },
    { key: 'legal',                icon: '⚖️', desc: '合同审核、法律尽调、常年顾问' },
    { key: 'location_rental',      icon: '📍', desc: '考察选址、办公室租赁推荐' },
  ]

  return (
    <main className="min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">印</span>
            </div>
            <span className="font-semibold text-gray-900">印尼企业服务</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <Link href="/services" className="hover:text-brand-500 transition-colors">服务产品</Link>
            <Link href="/#contact"  className="hover:text-brand-500 transition-colors">联系我们</Link>
          </div>
          <Link href="/services" className="btn-primary text-sm px-4 py-2">查看全部服务</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-500 to-brand-700 text-white">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse"></span>
              深耕印尼市场，服务中国出海企业
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              印尼企业落地<br />
              <span className="text-yellow-300">一站式服务</span>
            </h1>
            <p className="text-lg text-brand-100 mb-8 leading-relaxed">
              公司注册、财税人事、资质许可、法务服务全覆盖。专业本地团队，透明价格，进度全程可追溯。
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/services" className="bg-white text-brand-600 font-semibold px-6 py-3 rounded-lg hover:bg-brand-50 transition-colors">
                浏览服务产品
              </Link>
              <Link href="/#contact" className="border border-white/40 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition-colors">
                免费咨询
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 服务分类 */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">六大核心服务</h2>
          <p className="text-gray-500">按企业落地顺序提供一站式服务</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link key={cat.key} href={`/services?category=${cat.key}`}
              className="card p-6 hover:border-brand-200 hover:shadow-md transition-all group">
              <div className="text-3xl mb-3">{cat.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-brand-600 transition-colors">
                {SERVICE_CATEGORY_LABELS[cat.key]}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 热门服务 */}
      {publishedServices.length > 0 && (
        <section className="bg-gray-50 py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-bold text-gray-900">热门服务</h2>
              <Link href="/services" className="text-sm text-brand-600 hover:underline">查看全部 →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {publishedServices.map((svc: any) => (
                <Link key={svc.id} href={`/services/${svc.id}`} className="card p-5 hover:shadow-md transition-all">
                  <span className="badge badge-blue mb-3">{SERVICE_CATEGORY_LABELS[svc.category]}</span>
                  <h3 className="font-semibold text-gray-900 mb-2">{svc.name}</h3>
                  {svc.description && <p className="text-sm text-gray-500 line-clamp-2">{svc.description}</p>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 优势 */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">我们的服务优势</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { icon: '💰', title: '明码标价', desc: '不增加额外费用' },
            { icon: '📈', title: '进度可追溯', desc: '每个节点透明' },
            { icon: '⏱️', title: '保证时效', desc: '按期交付' },
            { icon: '🇨🇳', title: '中文服务', desc: '专人对接' },
          ].map((item) => (
            <div key={item.title} className="flex flex-col items-center gap-3">
              <div className="text-4xl">{item.icon}</div>
              <h3 className="font-semibold text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 联系 */}
      <section id="contact" className="bg-brand-500 text-white py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">准备开始了吗？</h2>
          <p className="text-brand-100 mb-8">免费咨询，为您解答印尼投资落地的所有问题</p>
          <Link href="/services" className="bg-white text-brand-600 font-semibold px-8 py-3 rounded-lg hover:bg-brand-50 transition-colors">
            浏览服务产品
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-4 text-sm text-gray-400">
          <span>© 2025 印尼企业服务. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/services" className="hover:text-gray-600">服务产品</Link>
            <Link href="/admin/login" className="hover:text-gray-600">后台登录</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
