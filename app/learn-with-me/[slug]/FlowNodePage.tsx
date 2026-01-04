"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Edit } from "lucide-react"
import Link from "next/link"
import CustomCursor from "@/components/custom-cursor"
import NodeEditorModal from "@/components/node-editor-modal"
import SubtopicEditor from "@/components/subtopic-editor"
import type { Topic } from "@/app/data/flowmapData"
import { updateNodeInTree, saveFlowmapData } from "@/app/data/flowmapData"

interface FlowNodePageProps {
  topic: Topic
  allTopics: Topic[]
}

export default function FlowNodePage({ topic, allTopics }: FlowNodePageProps) {
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentTopic, setCurrentTopic] = useState(topic)

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true)
    }, 300)
  }, [])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSaveNode = async (updatedNode: Topic) => {
    // Update the topic in the allTopics tree
    const updatedTopics = updateNodeInTree(allTopics, currentTopic.id, updatedNode)
    
    // Save to file
    const result = await saveFlowmapData(updatedTopics)
    if (result.success) {
      setCurrentTopic(updatedNode)
      setIsEditing(false)
      alert("Node updated successfully!")
      // Reload the page to reflect changes
      router.refresh()
    } else {
      alert(`Failed to save: ${result.error || 'Unknown error'}`)
    }
  }

  const handleSubtopicsChange = async (newSubtopics: Topic[]) => {
    // Update the current topic with new subtopics
    const updatedTopic = { ...currentTopic, subtopics: newSubtopics }
    const updatedTopics = updateNodeInTree(allTopics, currentTopic.id, updatedTopic)
    
    // Save to file
    const result = await saveFlowmapData(updatedTopics)
    if (result.success) {
      setCurrentTopic(updatedTopic)
      alert("Subtopics updated successfully!")
      router.refresh()
    } else {
      alert(`Failed to save: ${result.error || 'Unknown error'}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-slate-900 text-white">
      <CustomCursor />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        className="sticky top-0 z-30 bg-black/40 backdrop-blur-xl border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/learn-with-me">
              <motion.button
                whileHover={{ scale: 1.08, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 rounded-lg bg-white/10 transition-colors duration-300 flex items-center gap-2"
              >
                <ArrowLeft size={18} />
                <span className="text-sm">Back to Flowmap</span>
              </motion.button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Learn With Me</h1>
              <p className="text-xs text-white/50 mt-0.5">Explore knowledge and grow</p>
            </div>
          </div>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            onClick={handleEdit}
            className="px-4 py-2 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/50 text-orange-300 transition-all duration-300 flex items-center gap-2 text-sm"
          >
            <Edit size={16} />
            Edit Node
          </motion.button>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Icon and Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="text-6xl mb-4">{currentTopic.icon}</div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">{currentTopic.title}</h2>
          {currentTopic.description && (
            <p className="text-white/60 text-lg">{currentTopic.description}</p>
          )}
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-orange-400/0 via-orange-400/50 to-orange-400/0 mb-8" />

        {/* Content Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="prose prose-invert max-w-none prose-headings:text-orange-400 prose-a:text-orange-400"
        >
          {currentTopic.content ? (
            <div className="text-white/80 text-lg leading-relaxed whitespace-pre-wrap">
              {currentTopic.content}
            </div>
          ) : (
            <div className="text-white/60 text-lg">
              No content available for this topic yet.
            </div>
          )}
        </motion.div>

        {/* Subtopics Section - Always show editor for easy management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12"
        >
          <SubtopicEditor
            subtopics={currentTopic.subtopics || []}
            onSubtopicsChange={handleSubtopicsChange}
            parentTopicId={currentTopic.id}
            allTopics={allTopics}
          />
        </motion.div>
      </div>

      {/* Edit Modal */}
      <NodeEditorModal
        isOpen={isEditing}
        node={currentTopic}
        onClose={() => setIsEditing(false)}
        onSave={handleSaveNode}
        isNewNode={false}
      />
    </div>
  )
}

