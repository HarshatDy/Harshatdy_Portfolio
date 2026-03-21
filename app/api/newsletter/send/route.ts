import { NextResponse } from 'next/server'
import { validateCronSecret, cronUnauthorized } from '@/lib/utils/cronAuth'
import { getVerifiedEmailsForDomain, logNewsletter } from '@/lib/db/queries/newsletter'
import { generateNewsletter } from '@/lib/services/claude'
import { sendEmail } from '@/lib/services/gmail'
import { fetchNotionDomainContent } from '@/lib/services/notion'
import { DOMAINS } from '@/app/data/types/newsletter'
import type { Domain } from '@/app/data/types/newsletter'

export async function POST(request: Request) {
  if (!validateCronSecret(request)) return cronUnauthorized()

  try {
    const body = await request.json()
    const domain: Domain = body.domain
    const domainMeta = DOMAINS.find((d) => d.value === domain)

    if (!domainMeta) {
      return NextResponse.json({ error: `Invalid domain: ${domain}` }, { status: 400 })
    }

    const today = new Date().toISOString().split('T')[0]

    // Fetch source content from Notion
    const notionContent = await fetchNotionDomainContent(domain)

    if (!notionContent || notionContent.trim().length < 100) {
      await logNewsletter({
        domain,
        send_date: today,
        recipient_count: 0,
        claude_tokens: null,
        status: 'failed',
        error_message: 'Insufficient Notion content for newsletter generation',
      })
      return NextResponse.json({ success: false, message: 'Not enough content to generate newsletter' })
    }

    // Generate newsletter with Claude
    const { subject, htmlBody, tokensUsed } = await generateNewsletter(
      domain,
      domainMeta.label,
      notionContent,
      today,
    )

    // Get all verified subscribers for this domain
    const emails = await getVerifiedEmailsForDomain(domain)

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
    let sent = 0
    const errors: string[] = []

    for (const email of emails) {
      const unsubUrl = `${siteUrl}/newsletter?unsubscribe=true&email=${encodeURIComponent(email)}&domain=${domain}`
      const body = htmlBody.replace('{{UNSUBSCRIBE_LINK}}', unsubUrl)
      try {
        await sendEmail({ to: email, subject, htmlBody: body })
        sent++
      } catch (err) {
        errors.push(`${email}: ${err instanceof Error ? err.message : 'unknown'}`)
      }
    }

    await logNewsletter({
      domain,
      send_date: today,
      recipient_count: sent,
      claude_tokens: tokensUsed,
      status: errors.length === emails.length && emails.length > 0 ? 'failed' : 'sent',
      error_message: errors.length ? errors.slice(0, 3).join('; ') : null,
    })

    return NextResponse.json({ success: true, sent, total: emails.length, errors: errors.length })
  } catch (err) {
    console.error('[newsletter/send]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal error' },
      { status: 500 },
    )
  }
}
