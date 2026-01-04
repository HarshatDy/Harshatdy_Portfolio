"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Plus, Trash2, Edit2 } from "lucide-react"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import type { Section } from "@/app/data/flowmapData"
import { generateSlug } from "@/app/data/flowmapData"

interface SectionEditorProps {
  sections: Section[]
  onSectionsChange: (sections: Section[]) => void
  topicSlug?: string
}

export default function SectionEditor({ sections, onSectionsChange, topicSlug }: SectionEditorProps) {
  const [editingSection, setEditingSection] = useState<Section | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleAdd = () => {
    const newSection: Section = {
      id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      label: "",
      icon: "",
      slug: "",
      content: "",
    }
    setEditingSection(newSection)
    setIsAddingNew(true)
  }

  const handleEdit = (section: Section) => {
    setEditingSection({ ...section })
    setIsAddingNew(false)
  }

  const handleDelete = (sectionId: string) => {
    if (window.confirm("Are you sure you want to delete this section?")) {
      onSectionsChange(sections.filter((s) => s.id !== sectionId))
    }
  }

  const handleSave = (section: Section) => {
    if (!section.label || !section.icon) {
      alert("Label and icon are required")
      return
    }

    if (!section.slug) {
      section.slug = generateSlug(section.label)
    }

    if (isAddingNew) {
      onSectionsChange([...sections, section])
    } else {
      onSectionsChange(sections.map((s) => (s.id === section.id ? section : s)))
    }

    setEditingSection(null)
    setIsAddingNew(false)
  }

  const handleCancel = () => {
    setEditingSection(null)
    setIsAddingNew(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Sections</h3>
        <button
          onClick={handleAdd}
          className="px-3 py-1.5 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/50 text-orange-300 transition-all duration-300 flex items-center gap-2 text-sm"
        >
          <Plus size={14} />
          Add Section
        </button>
      </div>

      <div className="space-y-2">
        {sections.map((section) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 group"
          >
            <span className="text-lg">{section.icon}</span>
            <span className="flex-1 text-sm font-medium text-white/80">{section.label}</span>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleEdit(section)}
                className="p-1.5 rounded hover:bg-white/10 transition-colors"
                title="Edit section"
              >
                <Edit2 size={14} className="text-white/60 hover:text-white" />
              </button>
              <button
                onClick={() => handleDelete(section.id)}
                className="p-1.5 rounded hover:bg-red-500/20 transition-colors"
                title="Delete section"
              >
                <Trash2 size={14} className="text-red-400/60 hover:text-red-400" />
              </button>
            </div>
          </motion.div>
        ))}

        {sections.length === 0 && (
          <p className="text-sm text-white/40 text-center py-4">No sections yet. Click "Add Section" to create one.</p>
        )}
      </div>

      {/* Edit Modal - Rendered via Portal to avoid clipping */}
      {mounted && createPortal(
        <AnimatePresence>
          {editingSection && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCancel}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                style={{ position: 'fixed' }}
              />
              <div 
                className="fixed inset-0 z-[100] flex items-center justify-center p-5 pointer-events-none"
                style={{ position: 'fixed' }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.2 }}
                  className="w-full max-w-lg max-h-[90vh] bg-black/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
                  style={{ 
                    maxHeight: 'min(90vh, calc(100vh - 40px))',
                    maxWidth: 'min(32rem, calc(100vw - 40px))'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
              <div className="flex items-center justify-between p-6 border-b border-white/10 flex-shrink-0">
                <h2 className="text-xl font-bold text-white">
                  {isAddingNew ? "Add Section" : "Edit Section"}
                </h2>
                <button
                  onClick={handleCancel}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Icon <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingSection.icon}
                    onChange={(e) =>
                      setEditingSection({ ...editingSection, icon: e.target.value })
                    }
                    placeholder="🎯 (emoji)"
                    required
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Label <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingSection.label}
                    onChange={(e) => {
                      const newLabel = e.target.value
                      setEditingSection({
                        ...editingSection,
                        label: newLabel,
                        slug: editingSection.slug || generateSlug(newLabel),
                      })
                    }}
                    placeholder="Core Concepts"
                    required
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={editingSection.slug}
                    onChange={(e) =>
                      setEditingSection({ ...editingSection, slug: e.target.value })
                    }
                    placeholder="core-concepts"
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                  <p className="mt-1 text-xs text-white/50">
                    URL slug for this section (e.g., {topicSlug ? `${topicSlug}/` : ""}core-concepts)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Content
                  </label>
                  <textarea
                    value={editingSection.content || ""}
                    onChange={(e) =>
                      setEditingSection({ ...editingSection, content: e.target.value })
                    }
                    placeholder="Section content (optional - can be edited on the section page)"
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSave(editingSection)}
                    className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  )
}

