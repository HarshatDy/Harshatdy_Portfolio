import { NextResponse } from 'next/server'
import { isVerifiedSubscriber } from '@/lib/db/queries/knowledge'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email: string = (body.email ?? '').trim().toLowerCase()

    if (!email) {
      return NextResponse.json({ hasAccess: false })
    }

    const hasAccess = await isVerifiedSubscriber(email)
    return NextResponse.json({ hasAccess })
  } catch (err) {
    console.error('[knowledge/access]', err)
    return NextResponse.json({ hasAccess: false })
  }
}
