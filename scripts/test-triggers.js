/**
 * Manual trigger script for testing cron-protected API endpoints locally.
 *
 * Usage:
 *   node scripts/test-triggers.js <command> [options]
 *
 * Commands:
 *   newsletter [domain]   Send newsletter for one domain or all domains
 *   sync [domain]         Sync Notion pages for one domain or all domains
 *   finance               Fetch stock prices and generate Claude analysis
 *
 * Examples:
 *   node scripts/test-triggers.js newsletter platform
 *   node scripts/test-triggers.js newsletter          # all domains
 *   node scripts/test-triggers.js sync cpp
 *   node scripts/test-triggers.js sync               # all domains
 *   node scripts/test-triggers.js finance
 */

require('dotenv').config({ path: '.env.local' })

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const CRON_SECRET = process.env.CRON_SECRET

const ALL_DOMAINS = ['platform', 'cpp', 'os', '5g', 'finance']

if (!CRON_SECRET) {
  console.error('ERROR: CRON_SECRET is not set in .env.local')
  process.exit(1)
}

async function callEndpoint(path, body = {}) {
  const url = `${BASE_URL}${path}`
  console.log(`\n→ POST ${url}`)
  console.log(`  body: ${JSON.stringify(body)}`)

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CRON_SECRET}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const text = await res.text()
  let data
  try {
    data = JSON.parse(text)
  } catch {
    data = text
  }

  const status = res.ok ? '✓' : '✗'
  console.log(`  ${status} ${res.status}: ${JSON.stringify(data, null, 2)}`)
  return res.ok
}

async function runNewsletter(domain) {
  const domains = domain ? [domain] : ALL_DOMAINS
  let allOk = true
  for (const d of domains) {
    const ok = await callEndpoint('/api/newsletter/send', { domain: d })
    if (!ok) allOk = false
  }
  return allOk
}

async function runSync(domain) {
  const body = domain ? { domain } : {}
  return callEndpoint('/api/knowledge/sync', body)
}

async function runFinance() {
  return callEndpoint('/api/finance/fetch', {})
}

async function main() {
  const [, , command, arg] = process.argv

  const commands = {
    newsletter: () => runNewsletter(arg),
    sync: () => runSync(arg),
    finance: () => runFinance(),
  }

  if (!command || !commands[command]) {
    console.log('Usage: node scripts/test-triggers.js <newsletter|sync|finance> [domain]')
    console.log('\nDomains:', ALL_DOMAINS.join(', '))
    process.exit(1)
  }

  console.log(`\n=== Test Trigger: ${command}${arg ? ` (${arg})` : ' (all)'} ===`)
  console.log(`Base URL: ${BASE_URL}`)

  const ok = await commands[command]()
  process.exit(ok ? 0 : 1)
}

main().catch((err) => {
  console.error('Fatal error:', err.message)
  process.exit(1)
})
