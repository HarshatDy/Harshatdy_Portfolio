import { NextResponse } from 'next/server'
import { validateCronSecret, cronUnauthorized } from '@/lib/utils/cronAuth'
import { fetchDomainPages } from '@/lib/services/notion'
import { upsertNotionPages } from '@/lib/db/queries/knowledge'
import type { Domain } from '@/app/data/types/newsletter'

const ALL_DOMAINS: Domain[] = ['platform', 'cpp', 'os', '5g', 'finance']

export async function POST(request: Request) {
  if (!validateCronSecret(request)) return cronUnauthorized()

  try {
    const body = await request.json()
    const targetDomain: Domain | undefined = body.domain

    const domains = targetDomain ? [targetDomain] : ALL_DOMAINS
    const results: { domain: Domain; synced: number; error?: string }[] = []

    for (const domain of domains) {
      try {
        const pages = await fetchDomainPages(domain)
        await upsertNotionPages(pages)
        results.push({ domain, synced: pages.length })
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error'
        console.error(`[knowledge/sync] Failed for domain ${domain}:`, msg)
        results.push({ domain, synced: 0, error: msg })
      }
    }

    const totalSynced = results.reduce((sum, r) => sum + r.synced, 0)
    return NextResponse.json({ success: true, total_synced: totalSynced, results })
  } catch (err) {
    console.error('[knowledge/sync]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal error' },
      { status: 500 },
    )
  }
}
