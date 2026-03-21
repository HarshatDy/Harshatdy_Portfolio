import { supabase } from '@/lib/db/client'
import type { Domain, Subscriber, NewsletterLog } from '@/app/data/types/newsletter'

export async function findSubscriberByEmail(email: string): Promise<Subscriber | null> {
  const { data } = await supabase
    .from('subscribers')
    .select('*')
    .eq('email', email)
    .single()
  return data ?? null
}

export async function findSubscriberByToken(token: string): Promise<Subscriber | null> {
  const { data } = await supabase
    .from('subscribers')
    .select('*')
    .eq('verify_token', token)
    .single()
  return data ?? null
}

export async function createSubscriber(
  email: string,
  verifyToken: string,
  verifyExpires: string,
): Promise<Subscriber> {
  const { data, error } = await supabase
    .from('subscribers')
    .upsert({ email, verify_token: verifyToken, verify_expires: verifyExpires, verified: false })
    .select()
    .single()

  if (error) throw new Error(`createSubscriber: ${error.message}`)
  return data
}

export async function addSubscriberDomains(subscriberId: string, domains: Domain[]): Promise<void> {
  const rows = domains.map((domain) => ({ subscriber_id: subscriberId, domain, active: true }))
  const { error } = await supabase
    .from('subscriber_domains')
    .upsert(rows, { onConflict: 'subscriber_id,domain' })

  if (error) throw new Error(`addSubscriberDomains: ${error.message}`)
}

export async function verifySubscriber(id: string): Promise<void> {
  const { error } = await supabase
    .from('subscribers')
    .update({ verified: true, verify_token: null, verify_expires: null })
    .eq('id', id)

  if (error) throw new Error(`verifySubscriber: ${error.message}`)
}

export async function unsubscribeDomains(email: string, domains: Domain[]): Promise<void> {
  const subscriber = await findSubscriberByEmail(email)
  if (!subscriber) return

  const now = new Date().toISOString()
  if (domains.length === 0) {
    // Unsubscribe from all
    await supabase
      .from('subscriber_domains')
      .update({ active: false, unsubscribed_at: now })
      .eq('subscriber_id', subscriber.id)
  } else {
    await supabase
      .from('subscriber_domains')
      .update({ active: false, unsubscribed_at: now })
      .eq('subscriber_id', subscriber.id)
      .in('domain', domains)
  }
}

export async function getVerifiedEmailsForDomain(domain: Domain): Promise<string[]> {
  const { data, error } = await supabase
    .from('subscriber_domains')
    .select('subscribers!inner(email)')
    .eq('domain', domain)
    .eq('active', true)
    .eq('subscribers.verified', true)

  if (error) throw new Error(`getVerifiedEmailsForDomain: ${error.message}`)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((row: any) => row.subscribers.email)
}

export async function logNewsletter(log: Omit<NewsletterLog, 'id' | 'created_at'>): Promise<void> {
  const { error } = await supabase
    .from('newsletter_logs')
    .upsert(log, { onConflict: 'domain,send_date' })

  if (error) throw new Error(`logNewsletter: ${error.message}`)
}
