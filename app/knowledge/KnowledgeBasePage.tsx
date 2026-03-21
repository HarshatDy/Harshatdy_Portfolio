"use client"

import { useEffect, useState } from "react"
import KBGateScreen from "@/components/knowledge/KBGateScreen"
import KBSidebar from "@/components/knowledge/KBSidebar"
import KBContentView from "@/components/knowledge/KBContentView"
import { buildTree } from "@/lib/kb-utils"
import type { KBNode } from "@/app/data/types/knowledge"
import type { Domain } from "@/app/data/types/newsletter"
import { DOMAINS } from "@/app/data/types/newsletter"

interface Props {
  // Flat list of all pages — passed from server component via RSC
  allPages: KBNode[]
}

export default function KnowledgeBasePage({ allPages }: Props) {
  const [email, setEmail] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<KBNode | null>(null)
  const [breadcrumbPath, setBreadcrumbPath] = useState<KBNode[]>([])

  // On mount: check sessionStorage for saved email
  useEffect(() => {
    const saved = sessionStorage.getItem("kb_email")
    if (saved) setEmail(saved)
  }, [])

  // Build tree grouped by domain
  const tree = Object.fromEntries(
    DOMAINS.map(({ value }) => {
      const domainPages = allPages.filter((p) => p.domain === value)
      return [value, buildTree(domainPages)]
    }),
  ) as Record<Domain, KBNode[]>

  // Build breadcrumb path for a given node
  function buildPath(node: KBNode): KBNode[] {
    const path: KBNode[] = []
    let current: KBNode | undefined = node
    const pageMap = new Map(allPages.map((p) => [p.notion_page_id, p]))

    while (current) {
      path.unshift(current)
      current = current.parent_id ? pageMap.get(current.parent_id) : undefined
    }
    return path
  }

  function handleSelect(node: KBNode) {
    setSelectedNode(node)
    setBreadcrumbPath(buildPath(node))
  }

  function handleBreadcrumbNavigate(node: KBNode | null) {
    if (!node) {
      setSelectedNode(null)
      setBreadcrumbPath([])
    } else {
      handleSelect(node)
    }
  }

  if (!email) {
    return (
      <KBGateScreen
        onAccess={(e) => {
          setEmail(e)
        }}
      />
    )
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      <KBSidebar
        tree={tree}
        activePageId={selectedNode?.notion_page_id ?? null}
        onSelect={handleSelect}
      />
      <KBContentView
        selectedNode={selectedNode}
        breadcrumbPath={breadcrumbPath}
        email={email}
        onNavigate={handleBreadcrumbNavigate}
      />
    </div>
  )
}
