import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: '印尼企业服务', template: '%s | 印尼企业服务' },
  description: '专注印度尼西亚市场，为中国企业提供公司注册、财税、人事、资质许可一站式服务',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
