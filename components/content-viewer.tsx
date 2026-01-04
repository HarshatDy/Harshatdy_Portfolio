"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Edit, Settings } from "lucide-react"
import NodeEditorModal from "@/components/node-editor-modal"
import SectionEditor from "@/components/section-editor"
import { useState, useEffect } from "react"
import type { Topic } from "@/app/data/flowmapData"
import { updateNodeInTree, saveFlowmapData } from "@/app/data/flowmapData"

interface ContentViewProps {
  title: string
  description: string
  content: string
  topic?: Topic // Optional: if provided, enable editing
  allTopics?: Topic[] // Optional: needed for saving
  onTopicUpdate?: (updatedTopics: Topic[]) => void // Optional: callback for updates
}

export default function ContentView({ 
  title, 
  description, 
  content,
  topic,
  allTopics,
  onTopicUpdate
}: ContentViewProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isEditingSections, setIsEditingSections] = useState(false)
  const [currentTopic, setCurrentTopic] = useState(topic)
  const canEdit = !!topic && !!allTopics
  const sections = currentTopic?.sections || []

  // Update currentTopic when topic prop changes
  useEffect(() => {
    setCurrentTopic(topic)
  }, [topic])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSaveNode = async (updatedNode: Topic) => {
    if (!allTopics || !currentTopic) return

    const updatedTopics = updateNodeInTree(allTopics, currentTopic.id, updatedNode)
    const result = await saveFlowmapData(updatedTopics)
    
    if (result.success) {
      // Update local state immediately
      setCurrentTopic(updatedNode)
      setIsEditing(false)
      alert("Node updated successfully!")
      if (onTopicUpdate) {
        onTopicUpdate(updatedTopics)
      }
      // If node has a slug, navigate to the slug page
      if (updatedNode.slug && updatedNode.slug !== currentTopic.slug) {
        router.push(`/learn-with-me/${updatedNode.slug}`)
      } else {
        // router.refresh() // Commented out to avoid losing state
      }
    } else {
      alert(`Failed to save: ${result.error || 'Unknown error'}`)
    }
  }

  const handleSectionsChange = async (newSections: typeof sections) => {
    if (!allTopics || !currentTopic) return

    const updatedTopic = { ...currentTopic, sections: newSections }
    const updatedTopics = updateNodeInTree(allTopics, currentTopic.id, updatedTopic)
    const result = await saveFlowmapData(updatedTopics)
    
    if (result.success) {
      // Update local state immediately
      setCurrentTopic(updatedTopic)
      
      // Update parent component
      if (onTopicUpdate) {
        onTopicUpdate(updatedTopics)
      }
      
      // Optionally refresh to ensure data is synced
      // router.refresh() // Commented out to avoid losing state
    } else {
      alert(`Failed to save sections: ${result.error || 'Unknown error'}`)
    }
  }

  const handleSectionClick = (section: typeof sections[0]) => {
    if (!currentTopic?.slug) {
      alert("Topic must have a slug to navigate to sections")
      return
    }
    router.push(`/learn-with-me/${currentTopic.slug}/${section.slug}`)
  }

  const handleNavigateToSlug = () => {
    if (currentTopic?.slug) {
      router.push(`/learn-with-me/${currentTopic.slug}`)
    }
  }
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto"
      >
        <div className="rounded-2xl overflow-hidden bg-white/5 hover:bg-white/8 backdrop-blur-sm border border-white/10 p-8 transition-all duration-300">
          {/* Header Section */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mb-8">
            <div className="flex items-start justify-between gap-4">
              <motion.div variants={itemVariants} className="flex-1">
                <h2 className="text-4xl font-bold text-white mb-3">{title}</h2>
                <p className="text-white/60 text-lg">{description}</p>
              </motion.div>
              {canEdit && (
                <div className="flex items-center gap-2">
                  <motion.button
                    variants={itemVariants}
                    onClick={() => setIsEditingSections(!isEditingSections)}
                    className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-white transition-all duration-300 flex items-center gap-2 text-sm flex-shrink-0"
                  >
                    <Settings size={16} />
                    {isEditingSections ? "Done" : "Edit Sections"}
                  </motion.button>
                  <motion.button
                    variants={itemVariants}
                    onClick={handleEdit}
                    className="px-4 py-2 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/50 text-orange-300 transition-all duration-300 flex items-center gap-2 text-sm flex-shrink-0"
                  >
                    <Edit size={16} />
                    Edit
                  </motion.button>
                </div>
              )}
              {currentTopic?.slug && (
                <motion.button
                  variants={itemVariants}
                  onClick={handleNavigateToSlug}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-white transition-all duration-300 text-sm flex-shrink-0"
                >
                  View Full Page
                </motion.button>
              )}
            </div>
          </motion.div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-orange-400/0 via-orange-400/50 to-orange-400/0 mb-8" />

        {/* Content Section */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
          <motion.p variants={itemVariants} className="text-white/80 text-lg leading-relaxed">
            {content}
          </motion.p>

          {/* Sections Editor or Display */}
          {isEditingSections && canEdit ? (
            <motion.div variants={itemVariants} className="mt-8">
              <SectionEditor
                sections={sections}
                onSectionsChange={handleSectionsChange}
                topicSlug={currentTopic?.slug}
              />
            </motion.div>
          ) : (
            sections.length > 0 && (
              <motion.div variants={itemVariants} className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3">
                {sections.map((section, i) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                    onClick={() => handleSectionClick(section)}
                    className="flex items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-orange-400/30 transition-all duration-300 group cursor-pointer"
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform">{section.icon}</span>
                    <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors flex-1">
                      {section.label}
                    </span>
                    {currentTopic?.slug && (
                      <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors">
                        →
                      </span>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )
          )}
        </motion.div>
      </div>
    </motion.div>

    {/* Edit Modal */}
    {canEdit && currentTopic && (
      <NodeEditorModal
        isOpen={isEditing}
        node={currentTopic}
        onClose={() => setIsEditing(false)}
        onSave={handleSaveNode}
        isNewNode={false}
      />
    )}
    </>
  )
}
