import type { KBNode } from '@/app/data/types/knowledge'

/** Build a nested tree from a flat list of KBNodes */
export function buildTree(flat: KBNode[]): KBNode[] {
  const map = new Map<string, KBNode>()
  const roots: KBNode[] = []

  for (const node of flat) {
    map.set(node.notion_page_id, { ...node, children: [] })
  }

  for (const node of flat) {
    const current = map.get(node.notion_page_id)!
    if (!node.parent_id) {
      roots.push(current)
    } else {
      const parent = map.get(node.parent_id)
      if (parent) {
        parent.children = parent.children ?? []
        parent.children.push(current)
      } else {
        roots.push(current) // orphaned node — treat as root
      }
    }
  }

  return roots
}
