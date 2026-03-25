import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const SERVICE_CATEGORY_LABELS: Record<string, string> = {
  company_registration: '公司注册',
  finance_tax:          '财税服务',
  hr_visa:              '人事签证',
  license_permit:       '资质许可',
  legal:                '法务服务',
  location_rental:      '选址租赁',
}

export function formatCurrency(amount: number | string, currency = 'CNY') {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  if (isNaN(num)) return '面议'
  if (currency === 'IDR') return `Rp ${(num / 1_000_000).toFixed(1)}jt`
  return `¥${num.toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}
