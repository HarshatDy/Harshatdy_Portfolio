"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Edit } from "lucide-react"
import Link from "next/link"
import CustomCursor from "@/components/custom-cursor"
import type { Topic, Section } from "@/app/data/flowmapData"
import { updateNodeInTree, saveFlowmapData } from "@/app/data/flowmapData"

interface SectionPageProps {
  topic: Topic
  section: Section
  allTopics: Topic[]
}

export default function SectionPage({ topic, section, allTopics }: SectionPageProps) {
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentSection, setCurrentSection] = useState(section)
  const [sectionContent, setSectionContent] = useState(section.content || "")

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true)
    }, 300)
  }, [])

  const handleSave = async () => {
    const updatedSection = { ...currentSection, content: sectionContent }
    const updatedSections = topic.sections?.map(s => 
      s.id === section.id ? updatedSection : s
    ) || []
    
    const updatedTopic = { ...topic, sections: updatedSections }
    const updatedTopics = updateNodeInTree(allTopics, topic.id, updatedTopic)
    
    const result = await saveFlowmapData(updatedTopics)
    if (result.success) {
      setCurrentSection(updatedSection)
      setIsEditing(false)
      alert("Section updated successfully!")
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
            <Link href={`/learn-with-me/${topic.slug}`}>
              <motion.button
                whileHover={{ scale: 1.08, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 rounded-lg bg-white/10 transition-colors duration-300"
              >
                <ArrowLeft size={18} />
              </motion.button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">{section.label}</h1>
              <p className="text-xs text-white/50 mt-0.5">{topic.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-white transition-all duration-300 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/50 text-orange-300 transition-all duration-300 flex items-center gap-2 text-sm"
                >
                  Save
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/50 text-orange-300 transition-all duration-300 flex items-center gap-2 text-sm"
              >
                <Edit size={16} />
                Edit
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="pt-8 pb-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          className="max-w-3xl mx-auto"
        >
          <div className="rounded-2xl overflow-hidden bg-white/5 hover:bg-white/8 backdrop-blur-sm border border-white/10 p-8 transition-all duration-300">
            {/* Icon and Title */}
            <div className="mb-6 flex items-center gap-4">
              <span className="text-4xl">{section.icon}</span>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">{section.label}</h2>
                <p className="text-white/60">{topic.description}</p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-orange-400/0 via-orange-400/50 to-orange-400/0 mb-8" />

            {/* Content */}
            {isEditing ? (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-white/80">
                  Content
                </label>
                <textarea
                  value={sectionContent}
                  onChange={(e) => setSectionContent(e.target.value)}
                  placeholder="Enter section content..."
                  rows={15}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all resize-none"
                />
              </div>
            ) : (
              <div className="prose prose-invert max-w-none">
                {sectionContent ? (
                  <div className="text-white/80 text-lg leading-relaxed whitespace-pre-wrap">
                    {sectionContent}
                  </div>
                ) : (
                  <p className="text-white/40 italic">No content yet. Click Edit to add content.</p>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

