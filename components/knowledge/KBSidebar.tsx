"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, Menu } from "lucide-react"
import KBSidebarNode from "./KBSidebarNode"
import type { KBNode } from "@/app/data/types/knowledge"
import { DOMAINS } from "@/app/data/types/newsletter"
import type { Domain } from "@/app/data/types/newsletter"

interface Props {
  tree: Record<Domain, KBNode[]>
  activePageId: string | null
  onSelect: (node: KBNode) => void
}

export default function KBSidebar({ tree, activePageId, onSelect }: Props) {
  const [activeDomain, setActiveDomain] = useState<Domain>(DOMAINS[0].value)
  const [mobileOpen, setMobileOpen] = useState(false)

  const domainNodes = tree[activeDomain] ?? []

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Domain tabs */}
      <div className="p-3 border-b border-zinc-800">
        <div className="flex flex-wrap gap-1">
          {DOMAINS.map(({ value, icon }) => (
            <button
              key={value}
              onClick={() => setActiveDomain(value)}
              title={value}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all ${
                activeDomain === value
                  ? "bg-[#FF8000]/20 text-[#FF8000] border border-[#FF8000]/30"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
              }`}
            >
              <span>{icon}</span>
              <span className="capitalize">{value}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Page tree */}
      <div className="flex-1 overflow-y-auto py-2 px-1">
        {domainNodes.length === 0 ? (
          <p className="text-zinc-600 text-xs px-3 py-4">
            No pages synced yet. Trigger a sync via the cron job.
          </p>
        ) : (
          domainNodes.map((node) => (
            <KBSidebarNode
              key={node.notion_page_id}
              node={node}
              activePageId={activePageId}
              onSelect={(n) => {
                onSelect(n)
                setMobileOpen(false)
              }}
            />
          ))
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed bottom-6 left-6 z-40 p-3 bg-zinc-900 border border-zinc-700 rounded-full shadow-lg text-white"
      >
        <Menu size={20} />
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            className="relative z-10 w-72 bg-zinc-950 border-r border-zinc-800 h-full"
          >
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <span className="text-white font-semibold text-sm">Knowledge Base</span>
              <button onClick={() => setMobileOpen(false)}>
                <X size={18} className="text-zinc-400" />
              </button>
            </div>
            {sidebarContent}
          </motion.div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col w-72 flex-shrink-0 bg-zinc-950 border-r border-zinc-800 h-screen sticky top-0 overflow-hidden">
        <div className="p-4 border-b border-zinc-800">
          <h2 className="text-white font-semibold text-sm">Knowledge Base</h2>
          <p className="text-zinc-600 text-xs mt-0.5">Synced from Notion</p>
        </div>
        {sidebarContent}
      </div>
    </>
  )
}
