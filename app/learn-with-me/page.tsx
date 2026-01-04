"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { ChevronLeft, Edit, Save, Eye } from "lucide-react"
import Link from "next/link"
import FlowMap from "@/components/flowmap"
import FlowMapEditor from "@/components/flowmap-editor"
import ContentView from "@/components/content-viewer"
import CustomCursor from "@/components/custom-cursor"
import type { Topic } from "@/app/data/flowmapData"
import { loadFlowmapData, saveFlowmapData, findNodePath, updateNodeInTree } from "@/app/data/flowmapData"

type ViewState =
  | { type: "flowmap"; topics: Topic[]; parentId?: string | null }
  | { 
      type: "content"; 
      title: string; 
      description: string; 
      fullContent: string;
      topic?: Topic;
      allTopics?: Topic[];
    }

export default function LearnWithMePage() {
  const [isEditMode, setIsEditMode] = useState(false)
  const [topics, setTopics] = useState<Topic[]>([])
  const [viewStack, setViewStack] = useState<ViewState[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const currentView = viewStack[viewStack.length - 1]

  useEffect(() => {
    const loadData = async () => {
      try {
        const loadedTopics = await loadFlowmapData()
        setTopics(loadedTopics)
        setViewStack([{ type: "flowmap", topics: loadedTopics, parentId: null }])
      } catch (error) {
        console.error("Failed to load flowmap data:", error)
        setViewStack([{ type: "flowmap", topics: [], parentId: null }])
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleNodeClick = (topic: Topic) => {
    if (isEditMode) return // Don't navigate in edit mode

    // If topic has a slug, navigate to the slug page
    if (topic.slug) {
      window.location.href = `/learn-with-me/${topic.slug}`
      return
    }

    // Otherwise, use the existing navigation logic
    if (topic.subtopics && topic.subtopics.length > 0) {
      setViewStack([...viewStack, { type: "flowmap", topics: topic.subtopics, parentId: topic.id }])
    } else if (topic.content) {
      setViewStack([
        ...viewStack,
        {
          type: "content",
          title: topic.title,
          description: topic.description || "",
          fullContent: topic.content,
          topic: topic, // Pass topic for editing
          allTopics: topics, // Pass all topics for saving
        },
      ])
    }
  }

  const handleBack = () => {
    if (viewStack.length > 1) {
      setViewStack(viewStack.slice(0, -1))
    }
  }

  const handleTopicsChange = (newTopics: Topic[]) => {
    // Update the main topics state
    setTopics(newTopics)

    if (currentView?.type === "flowmap") {
      // If we're viewing the root level (parentId is null), update the entire topics array
      if (currentView.parentId === null || currentView.parentId === undefined) {
        const newViewStack = [...viewStack]
        newViewStack[newViewStack.length - 1] = { type: "flowmap", topics: newTopics, parentId: null }
        setViewStack(newViewStack)
      } else {
        // We're in a nested view - update the parent's subtopics in the full tree
        const updatedTopics = updateNodeInTree(topics, currentView.parentId, {
          subtopics: newTopics
        })
        setTopics(updatedTopics)
        
        // Update the current view in the stack
        const newViewStack = [...viewStack]
        newViewStack[newViewStack.length - 1] = { 
          type: "flowmap", 
          topics: newTopics, 
          parentId: currentView.parentId 
        }
        setViewStack(newViewStack)
      }
    } else if (currentView?.type === "content" && currentView.topic) {
      // Update content view - find the updated topic in the new topics tree
      const findTopicById = (topics: Topic[], id: string): Topic | null => {
        for (const topic of topics) {
          if (topic.id === id) {
            return topic
          }
          if (topic.subtopics && topic.subtopics.length > 0) {
            const found = findTopicById(topic.subtopics, id)
            if (found) return found
          }
        }
        return null
      }

      const updatedTopic = findTopicById(newTopics, currentView.topic.id)
      if (updatedTopic) {
        // Update the viewStack with the updated topic
        const newViewStack = [...viewStack]
        newViewStack[newViewStack.length - 1] = {
          type: "content",
          title: updatedTopic.title,
          description: updatedTopic.description || "",
          fullContent: updatedTopic.content || "",
          topic: updatedTopic,
          allTopics: newTopics,
        }
        setViewStack(newViewStack)
      }
    }
  }

  const handleSave = async () => {
    const result = await saveFlowmapData(topics)
    if (result.success) {
      alert("Flowmap data saved successfully! The changes have been updated in the JSON file.")
    } else {
      alert(`Failed to save flowmap data: ${result.error || 'Unknown error'}`)
    }
  }

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode)
    // Reset to root view when entering/exiting edit mode
    if (!isEditMode) {
      setViewStack([{ type: "flowmap", topics: topics, parentId: null }])
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-black via-black to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-white/60">Loading flowmap...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-black to-slate-900 text-white overflow-hidden">
      <CustomCursor />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-30 bg-black/40 backdrop-blur-xl border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.08, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 rounded-lg bg-white/10 transition-colors duration-300"
              >
                <ChevronLeft size={18} />
              </motion.button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Learn With Me</h1>
              <p className="text-xs text-white/50 mt-0.5">Explore knowledge and grow</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {viewStack.length > 1 && !isEditMode && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={handleBack}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 transition-all duration-300 flex items-center gap-2 text-sm"
              >
                <ChevronLeft size={16} />
                Back
              </motion.button>
            )}

            {isEditMode && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/50 text-orange-300 transition-all duration-300 flex items-center gap-2 text-sm"
              >
                <Save size={16} />
                Save
              </motion.button>
            )}

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={toggleEditMode}
              className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 text-sm ${
                isEditMode
                  ? "bg-white/10 hover:bg-white/15 border border-white/20 text-white"
                  : "bg-white/10 hover:bg-white/15 border border-white/20 text-white"
              }`}
            >
              {isEditMode ? (
                <>
                  <Eye size={16} />
                  View Mode
                </>
              ) : (
                <>
                  <Edit size={16} />
                  Edit Mode
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="pt-8 pb-16 px-6">
        <AnimatePresence mode="wait">
          {currentView?.type === "flowmap" ? (
            isEditMode ? (
              <FlowMapEditor
                key="flowmap-editor"
                topics={currentView.topics}
                onNodeClick={handleNodeClick}
                onTopicsChange={handleTopicsChange}
              />
            ) : (
              <FlowMap key="flowmap" topics={currentView.topics} onNodeClick={handleNodeClick} />
            )
          ) : currentView?.type === "content" ? (
            <ContentView
              key="content"
              title={currentView.title}
              description={currentView.description}
              content={currentView.fullContent}
              topic={currentView.topic}
              allTopics={currentView.allTopics}
              onTopicUpdate={handleTopicsChange}
            />
          ) : null}
        </AnimatePresence>
      </div>
    </main>
  )
}
