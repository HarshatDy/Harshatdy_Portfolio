import { NextResponse } from 'next/server'
import { unsubscribeDomains } from '@/lib/db/queries/newsletter'
import type { Domain } from '@/app/data/types/newsletter'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email: string = (body.email ?? '').trim().toLowerCase()
    const domains: Domain[] = body.domains ?? []

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    await unsubscribeDomains(email, domains)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[newsletter/unsubscribe]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal error' },
      { status: 500 },
    )
  }
}
