import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { sopSteps } from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'

export async function GET(_req: NextRequest, { params }: any) {
  const rows = await db.select().from(sopSteps).where(eq(sopSteps.serviceId, params.id)).orderBy(asc(sopSteps.stepOrder))
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest, { params }: any) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: '未授权' }, { status: 401 })
  const body = await req.json()
  const [created] = await db.insert(sopSteps).values({
    serviceId:    params.id,
    stepOrder:    body.stepOrder,
    title:        body.title,
    description:  body.description  || null,
    requiredDocs: body.requiredDocs  || [],
    assigneeRole: body.assigneeRole  || 'ops',
    slaDays:      body.slaDays       || null,
  } as any).returning()
  return NextResponse.json(created, { status: 201 })
}
