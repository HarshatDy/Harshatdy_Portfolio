import { NextResponse } from 'next/server'
import { createSubscriber, addSubscriberDomains, findSubscriberByEmail } from '@/lib/db/queries/newsletter'
import { sendVerificationEmail } from '@/lib/services/gmail'
import { generateToken, tokenExpiry } from '@/lib/utils/emailToken'
import type { Domain } from '@/app/data/types/newsletter'

const VALID_DOMAINS: Domain[] = ['platform', 'cpp', 'os', '5g', 'finance']

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email: string = (body.email ?? '').trim().toLowerCase()
    const domains: Domain[] = (body.domains ?? []).filter((d: string) =>
      VALID_DOMAINS.includes(d as Domain),
    )

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    if (domains.length === 0) {
      return NextResponse.json({ error: 'Select at least one domain' }, { status: 400 })
    }

    // Check if already verified — still update domains but skip re-sending verification
    const existing = await findSubscriberByEmail(email)
    if (existing?.verified) {
      await addSubscriberDomains(existing.id, domains)
      return NextResponse.json({ success: true, message: 'Domains updated. You are already verified.' })
    }

    const token = generateToken()
    const expires = tokenExpiry()
    const subscriber = await createSubscriber(email, token, expires)
    await addSubscriberDomains(subscriber.id, domains)
    await sendVerificationEmail(email, token)

    return NextResponse.json({ success: true, message: 'Check your email to verify your subscription.' })
  } catch (err) {
    console.error('[newsletter/subscribe]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal error' },
      { status: 500 },
    )
  }
}
