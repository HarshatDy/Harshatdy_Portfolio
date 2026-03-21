import type { Domain } from './newsletter'

export interface KBNode {
  id: string               // Supabase UUID
  notion_page_id: string
  parent_id: string | null // notion_page_id of parent
  domain: Domain
  title: string
  slug: string
  icon: string | null
  depth: number
  sort_order: number
  last_synced_at: string
  children?: KBNode[]      // populated client-side after fetching flat list
}

export interface KBPageContent {
  notion_page_id: string
  title: string
  icon: string | null
  content_html: string
  last_synced_at: string
}

export interface KBAccessResponse {
  hasAccess: boolean
}
