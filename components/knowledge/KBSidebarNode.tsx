"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { KBNode } from "@/app/data/types/knowledge"

interface Props {
  node: KBNode
  activePageId: string | null
  onSelect: (node: KBNode) => void
  depth?: number
}

export default function KBSidebarNode({ node, activePageId, onSelect, depth = 0 }: Props) {
  const hasChildren = node.children && node.children.length > 0
  const isActive = node.notion_page_id === activePageId
  const [open, setOpen] = useState(depth === 0)

  function handleClick() {
    if (hasChildren) setOpen((o) => !o)
    onSelect(node)
  }

  return (
    <div>
      <button
        onClick={handleClick}
        style={{ paddingLeft: `${12 + depth * 14}px` }}
        className={`w-full flex items-center gap-2 py-1.5 pr-3 text-sm rounded-md transition-all group ${
          isActive
            ? "bg-[#FF8000]/10 text-white border-l-2 border-[#FF8000]"
            : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
        }`}
      >
        {/* Icon */}
        {node.icon ? (
          <span className="text-base flex-shrink-0 w-5 text-center">{node.icon}</span>
        ) : (
          <span className="w-5 flex-shrink-0" />
        )}

        {/* Title */}
        <span className="flex-1 text-left truncate leading-5">{node.title}</span>

        {/* Expand arrow */}
        {hasChildren && (
          <motion.div
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.15 }}
            className="flex-shrink-0"
          >
            <ChevronRight size={14} className="text-zinc-600 group-hover:text-zinc-400" />
          </motion.div>
        )}
      </button>

      {/* Children */}
      <AnimatePresence>
        {hasChildren && open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            {node.children!.map((child) => (
              <KBSidebarNode
                key={child.notion_page_id}
                node={child}
                activePageId={activePageId}
                onSelect={onSelect}
                depth={depth + 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
