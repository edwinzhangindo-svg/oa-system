import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { sopSteps } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function PATCH(req: NextRequest, { params }: any) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: '未授权' }, { status: 401 })
  const body = await req.json()
  const [updated] = await db.update(sopSteps).set({
    title:        body.title,
    description:  body.description  || null,
    requiredDocs: body.requiredDocs  || [],
    assigneeRole: body.assigneeRole  || 'ops',
    slaDays:      body.slaDays       || null,
    stepOrder:    body.stepOrder,
  } as any).where(eq(sopSteps.id, params.stepId)).returning()
  return NextResponse.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: any) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: '未授权' }, { status: 401 })
  await db.delete(sopSteps).where(eq(sopSteps.id, params.stepId))
  return NextResponse.json({ ok: true })
}
