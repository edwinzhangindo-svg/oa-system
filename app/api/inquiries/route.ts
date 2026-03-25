import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { inquiries } from '@/lib/db/schema'

export async function POST(req: NextRequest) {
  const body = await req.json()
  if (!body.companyName || !body.contactName || !body.phone) {
    return NextResponse.json({ error: '请填写必填项' }, { status: 400 })
  }
  const [created] = await db.insert(inquiries).values({
    companyName: body.companyName,
    contactName: body.contactName,
    phone:       body.phone,
    email:       body.email   || null,
    message:     body.message || null,
  } as any).returning()

  const webhookUrl = process.env.WECOM_WEBHOOK_URL
  if (webhookUrl) {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        msgtype: 'markdown',
        markdown: { content: `## 📩 新询价\n**公司**：${body.companyName}\n**联系人**：${body.contactName}\n**电话**：${body.phone}` },
      }),
    }).catch(console.error)
  }
  return NextResponse.json({ ok: true, id: created.id }, { status: 201 })
}
