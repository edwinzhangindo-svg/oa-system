import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { services } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function PATCH(req: NextRequest, { params }: any) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: '未授权' }, { status: 401 })

  const body = await req.json()
  const [updated] = await db.update(services).set({
    name:          body.name,
    category:      body.category,
    description:   body.description   || null,
    longDesc:      body.longDesc       || null,
    highlights:    body.highlights     || [],
    priceMin:      body.priceMin       || null,
    priceMax:      body.priceMax       || null,
    currency:      body.currency       || 'CNY',
    estimatedDays: body.estimatedDays  || null,
    isRecurring:   body.isRecurring    || false,
    recurCycle:    body.recurCycle     || null,
    recurAmount:   body.recurAmount    || null,
    isPublished:   body.isPublished    ?? false,
    sortOrder:     body.sortOrder      || 0,
    updatedAt:     new Date(),
  } as any).where(eq(services.id, params.id)).returning()

  return NextResponse.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: any) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: '未授权' }, { status: 401 })
  await db.delete(services).where(eq(services.id, params.id))
  return NextResponse.json({ ok: true })
}
