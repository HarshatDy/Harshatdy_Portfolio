"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import type { KBNode } from "@/app/data/types/knowledge"
import type { KBPageContent } from "@/app/data/types/knowledge"
import KBBreadcrumb from "./KBBreadcrumb"

interface Props {
  selectedNode: KBNode | null
  breadcrumbPath: KBNode[]
  email: string
  onNavigate: (node: KBNode | null) => void
}

export default function KBContentView({ selectedNode, breadcrumbPath, email, onNavigate }: Props) {
  const [content, setContent] = useState<KBPageContent | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!selectedNode) {
      setContent(null)
      return
    }

    setLoading(true)
    fetch(`/api/knowledge/pages/${selectedNode.notion_page_id}`, {
      headers: { "X-KB-Email": email },
    })
      .then((r) => r.json())
      .then((d) => setContent(d))
      .catch(() => setContent(null))
      .finally(() => setLoading(false))
  }, [selectedNode, email])

  if (!selectedNode) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-600 text-sm">
        Select a page from the sidebar to start reading.
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <KBBreadcrumb path={breadcrumbPath} onNavigate={onNavigate} />

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-5 h-5 border-2 border-[#FF8000] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : content ? (
          <motion.div
            key={selectedNode.notion_page_id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Page header */}
            <div className="mt-6 mb-8">
              {content.icon && (
                <span className="text-4xl block mb-3">{content.icon}</span>
              )}
              <h1 className="text-3xl font-bold text-white">{content.title}</h1>
              <p className="text-zinc-600 text-xs mt-2">
                Last synced: {new Date(content.last_synced_at).toLocaleDateString()}
              </p>
            </div>

            {/* Notion content */}
            <div
              className="prose prose-invert prose-zinc max-w-none
                prose-headings:font-bold prose-headings:text-white
                prose-p:text-zinc-300 prose-p:leading-7
                prose-a:text-[#FF8000] prose-a:no-underline hover:prose-a:underline
                prose-code:text-[#FF8000] prose-code:bg-zinc-900 prose-code:px-1 prose-code:rounded
                prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800
                prose-blockquote:border-l-[#FF8000] prose-blockquote:text-zinc-400
                prose-hr:border-zinc-800
                prose-li:text-zinc-300
                prose-strong:text-white"
              dangerouslySetInnerHTML={{ __html: content.content_html }}
            />
          </motion.div>
        ) : (
          <p className="text-zinc-600 mt-8 text-sm">Failed to load content. Try again.</p>
        )}
      </div>
    </div>
  )
}
