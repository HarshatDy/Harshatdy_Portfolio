"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { RefreshCw, CheckCircle, AlertCircle } from "lucide-react"
import type { Topic } from "@/app/data/flowmapData"
import { regenerateAllSectionSlugs, saveFlowmapData } from "@/app/data/flowmapData"

interface SlugRegeneratorProps {
  topics: Topic[]
  onTopicsChange: (topics: Topic[]) => void
}

export default function SlugRegenerator({ topics, onTopicsChange }: SlugRegeneratorProps) {
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleRegenerateAll = async () => {
    if (!window.confirm(
      "This will regenerate slugs for ALL sections based on their labels. " +
      "This action cannot be undone. Continue?"
    )) {
      return
    }

    setIsRegenerating(true)
    setResult(null)

    try {
      // Regenerate all section slugs
      const updatedTopics = regenerateAllSectionSlugs(topics)
      
      // Save to backend
      const saveResult = await saveFlowmapData(updatedTopics)
      
      if (saveResult.success) {
        // Update parent component
        onTopicsChange(updatedTopics)
        setResult({
          success: true,
          message: "All section slugs have been regenerated successfully!",
        })
      } else {
        setResult({
          success: false,
          message: `Failed to save: ${saveResult.error || 'Unknown error'}`,
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      })
    } finally {
      setIsRegenerating(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Section Slug Management</h3>
          <p className="text-xs text-white/50 mt-1">
            Regenerate slugs for all sections based on their labels
          </p>
        </div>
        <button
          onClick={handleRegenerateAll}
          disabled={isRegenerating}
          className="px-4 py-2 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/50 text-orange-300 transition-all duration-300 flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw 
            size={14} 
            className={isRegenerating ? "animate-spin" : ""} 
          />
          {isRegenerating ? "Regenerating..." : "Regenerate All Slugs"}
        </button>
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-lg border ${
            result.success
              ? "bg-green-500/10 border-green-500/50 text-green-300"
              : "bg-red-500/10 border-red-500/50 text-red-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {result.success ? (
              <CheckCircle size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            <p className="text-sm">{result.message}</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

