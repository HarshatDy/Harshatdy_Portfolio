"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react"
import NodeEditorModal from "@/components/node-editor-modal"
import type { Topic } from "@/app/data/flowmapData"
import { useRouter } from "next/navigation"
import { generateNodeId } from "@/app/data/flowmapData"

interface SubtopicEditorProps {
  subtopics: Topic[]
  onSubtopicsChange: (subtopics: Topic[]) => void
  parentTopicId: string
  allTopics: Topic[]
}

export default function SubtopicEditor({
  subtopics,
  onSubtopicsChange,
  parentTopicId,
  allTopics,
}: SubtopicEditorProps) {
  const router = useRouter()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  const handleAdd = () => {
    setIsAdding(true)
  }

  const handleEdit = (subtopic: Topic) => {
    setEditingId(subtopic.id)
  }

  const handleDelete = (subtopicId: string) => {
    if (window.confirm("Are you sure you want to delete this subtopic?")) {
      const updated = subtopics.filter((t) => t.id !== subtopicId)
      onSubtopicsChange(updated)
    }
  }

  const handleSave = (updatedNode: Topic) => {
    if (editingId) {
      // Update existing
      const updated = subtopics.map((t) => (t.id === editingId ? updatedNode : t))
      onSubtopicsChange(updated)
      setEditingId(null)
    } else {
      // Add new - ensure it has an ID
      const newNode: Topic = {
        ...updatedNode,
        id: updatedNode.id || generateNodeId(),
      }
      onSubtopicsChange([...subtopics, newNode])
      setIsAdding(false)
    }
  }

  const handleNavigate = (subtopic: Topic) => {
    if (subtopic.slug) {
      router.push(`/learn-with-me/${subtopic.slug}`)
    }
  }

  const currentEditingTopic = editingId ? subtopics.find((t) => t.id === editingId) : null

  return (
    <>
      <div className="space-y-4">
        {/* Header with Add Button */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">Subtopics</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
            className="px-4 py-2 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/50 text-orange-300 transition-all duration-300 flex items-center gap-2 text-sm"
          >
            <Plus size={16} />
            Add Subtopic
          </motion.button>
        </div>

        {/* Subtopics List */}
        {subtopics.length === 0 ? (
          <div className="text-center py-12 text-white/40">
            <p>No subtopics yet. Click "Add Subtopic" to create one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {subtopics.map((subtopic, index) => (
                <motion.div
                  key={subtopic.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative p-4 rounded-xl bg-white/5 hover:bg-white/8 backdrop-blur-sm border border-white/10 hover:border-orange-400/30 transition-all duration-300"
                >
                  {/* Actions */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {subtopic.slug && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleNavigate(subtopic)}
                        className="p-1.5 rounded hover:bg-white/10 transition-colors"
                        title="Open page"
                      >
                        <ExternalLink size={14} className="text-white/60 hover:text-white" />
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(subtopic)}
                      className="p-1.5 rounded hover:bg-white/10 transition-colors"
                      title="Edit"
                    >
                      <Edit size={14} className="text-white/60 hover:text-white" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(subtopic.id)}
                      className="p-1.5 rounded hover:bg-red-500/20 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} className="text-red-400/60 hover:text-red-400" />
                    </motion.button>
                  </div>

                  {/* Content */}
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      if (subtopic.slug) {
                        handleNavigate(subtopic)
                      }
                    }}
                  >
                    <div className="text-3xl mb-2">{subtopic.icon}</div>
                    <h4 className="text-lg font-semibold text-white mb-1 group-hover:text-orange-400 transition-colors">
                      {subtopic.title}
                    </h4>
                    {subtopic.description && (
                      <p className="text-sm text-white/60 line-clamp-2">{subtopic.description}</p>
                    )}
                    {subtopic.slug && (
                      <div className="mt-2 text-xs text-orange-400/60 flex items-center gap-1">
                        <ExternalLink size={12} />
                        <span>Has dedicated page</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <NodeEditorModal
        isOpen={editingId !== null || isAdding}
        node={currentEditingTopic || null}
        onClose={() => {
          setEditingId(null)
          setIsAdding(false)
        }}
        onSave={handleSave}
        isNewNode={!editingId}
      />
    </>
  )
}

