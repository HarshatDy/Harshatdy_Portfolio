/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from '@notionhq/client'
import { blocksToHtml, blocksToPlainText } from '@/lib/utils/notionBlockRenderer'
import type { Domain } from '@/app/data/types/newsletter'

const notion = new Client({ auth: process.env.NOTION_API_KEY })

/** Map domain to its Notion root page ID */
function getDomainRootPageId(domain: Domain): string | null {
  const map: Record<Domain, string | undefined> = {
    platform: process.env.NOTION_PLATFORM_ROOT_PAGE_ID,
    cpp: process.env.NOTION_CPP_ROOT_PAGE_ID,
    os: process.env.NOTION_OS_ROOT_PAGE_ID,
    '5g': process.env.NOTION_5G_ROOT_PAGE_ID,
    finance: process.env.NOTION_FINANCE_ROOT_PAGE_ID,
    'graphs and algorithms': process.env.NOTION_GRAPHS_AND_ALGORITHMS_ROOT_PAGE_ID,
    python: process.env.NOTION_PYTHON_ROOT_PAGE_ID,
    'advanced dsa': process.env.NOTION_ADVANCED_DSA_ROOT_PAGE_ID,
    'advanced multithreading': process.env.NOTION_ADVANCED_MULTITHREADING_ROOT_PAGE_ID,
  }
  return map[domain] ?? null
}

/** Slugify a title for use in URLs */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

/** Fetch all blocks for a page with pagination */
async function fetchAllBlocks(blockId: string): Promise<any[]> {
  const blocks: any[] = []
  let cursor: string | undefined

  do {
    const res = await notion.blocks.children.list({
      block_id: blockId,
      page_size: 100,
      start_cursor: cursor,
    })
    blocks.push(...res.results)
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined
  } while (cursor)

  return blocks
}

/** Recursively fetch page tree under a root page ID */
export interface NotionPageNode {
  pageId: string
  parentPageId: string | null
  title: string
  icon: string | null
  slug: string
  depth: number
  sortOrder: number
  blocks: any[]
  children: NotionPageNode[]
}

async function fetchPageTree(
  pageId: string,
  parentPageId: string | null,
  depth: number,
): Promise<NotionPageNode[]> {
  const blocks = await fetchAllBlocks(pageId)

  // Get page title and icon
  let title = 'Untitled'
  let icon: string | null = null
  try {
    const page = await notion.pages.retrieve({ page_id: pageId })
    const p = page as any
    icon = p.icon?.emoji ?? p.icon?.external?.url ?? null
    const titleProp = p.properties?.title ?? p.properties?.Name
    if (titleProp?.title?.[0]?.plain_text) {
      title = titleProp.title[0].plain_text
    } else if (p.properties) {
      // Try any title property
      for (const prop of Object.values(p.properties) as any[]) {
        if (prop.type === 'title' && prop.title?.[0]?.plain_text) {
          title = prop.title[0].plain_text
          break
        }
      }
    }
  } catch {
    // Use pageId as fallback title if page retrieval fails
  }

  const contentBlocks = blocks.filter((b) => b.type !== 'child_page')
  const childPageBlocks = blocks.filter((b) => b.type === 'child_page')

  const node: NotionPageNode = {
    pageId,
    parentPageId,
    title,
    icon,
    slug: `${slugify(title)}-${pageId.replace(/-/g, '').slice(0, 6)}`,
    depth,
    sortOrder: 0,
    blocks: contentBlocks,
    children: [],
  }

  // Recursively fetch child pages
  const children: NotionPageNode[] = []
  for (let i = 0; i < childPageBlocks.length; i++) {
    const childId = childPageBlocks[i].id
    try {
      const childNodes = await fetchPageTree(childId, pageId, depth + 1)
      if (childNodes[0]) {
        childNodes[0].sortOrder = i
        children.push(childNodes[0])
      }
    } catch (err) {
      console.warn(`[notion] Failed to fetch child page ${childId}:`, err)
    }
  }

  node.children = children
  return [node]
}

/** Flatten a tree of NotionPageNodes into an array for DB insertion */
function flattenTree(nodes: NotionPageNode[]): NotionPageNode[] {
  const flat: NotionPageNode[] = []
  function walk(list: NotionPageNode[]) {
    for (const node of list) {
      flat.push(node)
      walk(node.children)
    }
  }
  walk(nodes)
  return flat
}

/**
 * Fetch all pages for a domain from Notion and return them as flat rows
 * ready for upserting into the notion_pages table.
 */
export async function fetchDomainPages(domain: Domain): Promise<
  {
    notion_page_id: string
    parent_id: string | null
    domain: Domain
    title: string
    slug: string
    icon: string | null
    content_html: string
    depth: number
    sort_order: number
  }[]
> {
  const rootPageId = getDomainRootPageId(domain)
  if (!rootPageId) throw new Error(`No root page ID configured for domain: ${domain}`)

  const tree = await fetchPageTree(rootPageId, null, 0)
  const flat = flattenTree(tree)

  return flat.map((node) => ({
    notion_page_id: node.pageId,
    parent_id: node.parentPageId,
    domain,
    title: node.title,
    slug: node.slug,
    icon: node.icon,
    content_html: blocksToHtml(node.blocks),
    depth: node.depth,
    sort_order: node.sortOrder,
  }))
}

/**
 * Fetch domain content as plain text for newsletter generation.
 * Returns the text content of the root page + top-level child pages.
 */
export async function fetchNotionDomainContent(domain: Domain): Promise<string> {
  const rootPageId = getDomainRootPageId(domain)
  if (!rootPageId) return ''

  try {
    const blocks = await fetchAllBlocks(rootPageId)
    const contentBlocks = blocks.filter((b) => b.type !== 'child_page')
    return blocksToPlainText(contentBlocks)
  } catch (err) {
    console.error(`[notion] fetchNotionDomainContent failed for ${domain}:`, err)
    return ''
  }
}
