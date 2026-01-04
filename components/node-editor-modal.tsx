"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Save } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import type { Topic } from "@/app/data/flowmapData"
import { generateSlug } from "@/app/data/flowmapData"

interface NodeEditorModalProps {
  isOpen: boolean
  node: Topic | null
  onClose: () => void
  onSave: (node: Topic) => void
  isNewNode?: boolean
}

export default function NodeEditorModal({
  isOpen,
  node,
  onClose,
  onSave,
  isNewNode = false,
}: NodeEditorModalProps) {
  const [formData, setFormData] = useState<Partial<Topic>>({
    id: "",
    title: "",
    icon: "",
    description: "",
    content: "",
    slug: "",
  })
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (node) {
      setFormData({
        id: node.id,
        title: node.title,
        icon: node.icon,
        description: node.description || "",
        content: node.content || "",
        slug: node.slug || "",
      })
    } else if (isNewNode) {
      setFormData({
        id: "",
        title: "",
        icon: "",
        description: "",
        content: "",
        slug: "",
      })
    }
  }, [node, isNewNode])

  // Notify cursor component when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      window.dispatchEvent(new CustomEvent("modalOpen"))
    } else {
      window.dispatchEvent(new CustomEvent("modalClose"))
    }
  }, [isOpen])


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.icon) {
      alert("Title and icon are required")
      return
    }

    const updatedNode: Topic = {
      id: formData.id || `node-${Date.now()}`,
      title: formData.title,
      icon: formData.icon,
      description: formData.description,
      content: formData.content,
      slug: formData.slug || undefined,
      subtopics: node?.subtopics || [],
    }

    onSave(updatedNode)
    onClose()
  }

  const handleClose = () => {
    setFormData({
      id: "",
      title: "",
      icon: "",
      description: "",
      content: "",
      slug: "",
    })
    onClose()
  }


  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal Container - ensures it stays within viewport */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-5 pointer-events-none">
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl max-h-[90vh] bg-black/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
              style={{
                maxWidth: 'min(calc(100vw - 40px), 42rem)',
                maxHeight: 'min(calc(100vh - 40px), 90vh)',
              }}
            >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white">
                {isNewNode ? "Add New Node" : "Edit Node"}
              </h2>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X size={20} className="text-white" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-6">
                {/* Icon */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Icon <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="🌐 (emoji or text)"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
                  />
                  <p className="mt-1 text-xs text-white/50">
                    Enter an emoji or text to represent this node
                  </p>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter node title"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter a brief description"
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all resize-none"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Slug (for HTML page)
                  </label>
                  <input
                    type="text"
                    value={formData.slug || ""}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g., react-fundamentals (creates /learn-with-me/react-fundamentals)"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
                  />
                  <p className="mt-1 text-xs text-white/50">
                    Optional: Create a dedicated HTML page for this node (like blog posts). Leave empty to use inline content. 
                    {formData.title && !formData.slug && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, slug: generateSlug(formData.title || "") })}
                        className="ml-2 text-orange-400 hover:text-orange-300 underline"
                      >
                        Generate from title
                      </button>
                    )}
                  </p>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Content
                  </label>
                  <textarea
                    value={formData.content || ""}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Enter detailed content (shown when node has no subtopics or slug)"
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all resize-none"
                  />
                  <p className="mt-1 text-xs text-white/50">
                    This content will be displayed when the node has no child subtopics. If a slug is provided, this content appears on the dedicated page.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors flex items-center gap-2"
                >
                  <Save size={16} />
                  Save
                </button>
              </div>
            </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

