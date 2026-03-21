import { NextResponse } from 'next/server'
import { findSubscriberByToken, verifySubscriber } from '@/lib/db/queries/newsletter'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  if (!token) {
    return NextResponse.redirect(`${siteUrl}/newsletter?error=missing_token`)
  }

  try {
    const subscriber = await findSubscriberByToken(token)

    if (!subscriber) {
      return NextResponse.redirect(`${siteUrl}/newsletter?error=invalid_token`)
    }

    if (subscriber.verify_expires && new Date(subscriber.verify_expires) < new Date()) {
      return NextResponse.redirect(`${siteUrl}/newsletter?error=expired_token`)
    }

    await verifySubscriber(subscriber.id)
    return NextResponse.redirect(`${siteUrl}/newsletter?verified=true`)
  } catch (err) {
    console.error('[newsletter/verify]', err)
    return NextResponse.redirect(`${siteUrl}/newsletter?error=server_error`)
  }
}
