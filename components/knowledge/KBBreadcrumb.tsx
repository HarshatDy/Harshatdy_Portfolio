"use client"

import { ChevronRight } from "lucide-react"
import type { KBNode } from "@/app/data/types/knowledge"

interface Props {
  path: KBNode[]
  onNavigate: (node: KBNode | null) => void
}

export default function KBBreadcrumb({ path, onNavigate }: Props) {
  if (path.length === 0) return null

  return (
    <nav className="flex items-center gap-1 text-sm text-zinc-500 flex-wrap">
      <button
        onClick={() => onNavigate(null)}
        className="hover:text-zinc-200 transition-colors"
      >
        Home
      </button>
      {path.map((node, i) => (
        <span key={node.notion_page_id} className="flex items-center gap-1">
          <ChevronRight size={14} className="text-zinc-700" />
          <button
            onClick={() => onNavigate(node)}
            className={
              i === path.length - 1
                ? "text-white font-medium"
                : "hover:text-zinc-200 transition-colors"
            }
          >
            {node.icon && <span className="mr-1">{node.icon}</span>}
            {node.title}
          </button>
        </span>
      ))}
    </nav>
  )
}
