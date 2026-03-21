import { supabase } from '@/lib/db/client'
import type { KBNode, KBPageContent } from '@/app/data/types/knowledge'
import type { Domain } from '@/app/data/types/newsletter'

export async function upsertNotionPages(
  pages: {
    notion_page_id: string
    parent_id: string | null
    domain: Domain
    title: string
    slug: string
    icon: string | null
    content_html: string
    depth: number
    sort_order: number
  }[],
): Promise<void> {
  const rows = pages.map((p) => ({ ...p, last_synced_at: new Date().toISOString() }))
  const { error } = await supabase
    .from('notion_pages')
    .upsert(rows, { onConflict: 'notion_page_id' })

  if (error) throw new Error(`upsertNotionPages: ${error.message}`)
}

export async function getPagesByDomain(domain: Domain): Promise<KBNode[]> {
  const { data, error } = await supabase
    .from('notion_pages')
    .select('id, notion_page_id, parent_id, domain, title, slug, icon, depth, sort_order, last_synced_at')
    .eq('domain', domain)
    .order('depth')
    .order('sort_order')

  if (error) throw new Error(`getPagesByDomain: ${error.message}`)
  return (data ?? []) as KBNode[]
}

export async function getAllPages(): Promise<KBNode[]> {
  const { data, error } = await supabase
    .from('notion_pages')
    .select('id, notion_page_id, parent_id, domain, title, slug, icon, depth, sort_order, last_synced_at')
    .order('depth')
    .order('sort_order')

  if (error) throw new Error(`getAllPages: ${error.message}`)
  return (data ?? []) as KBNode[]
}

export async function getPageContent(notionPageId: string): Promise<KBPageContent | null> {
  const { data, error } = await supabase
    .from('notion_pages')
    .select('notion_page_id, title, icon, content_html, last_synced_at')
    .eq('notion_page_id', notionPageId)
    .single()

  if (error) return null
  return data as KBPageContent
}

export async function isVerifiedSubscriber(email: string): Promise<boolean> {
  const { data } = await supabase
    .from('subscribers')
    .select('id')
    .eq('email', email.toLowerCase())
    .eq('verified', true)
    .single()

  return !!data
}
