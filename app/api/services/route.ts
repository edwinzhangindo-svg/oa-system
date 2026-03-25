import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { services } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  const rows = await db.select().from(services).where(eq(services.isPublished, true))
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: '未授权' }, { status: 401 })

  const body = await req.json()
  const [created] = await db.insert(services).values({
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
    isPublished:   body.isPublished    || false,
    sortOrder:     body.sortOrder      || 0,
  } as any).returning()

  return NextResponse.json(created, { status: 201 })
}
