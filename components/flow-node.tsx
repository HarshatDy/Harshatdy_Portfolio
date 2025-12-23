"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

interface Topic {
  id: string
  title: string
  icon: string
  description?: string
  subtopics?: any[]
  content?: string
}

interface FlowNodeProps {
  topic: Topic
  index: number
  onClick: () => void
  hasChildren: boolean
}

export default function FlowNode({ topic, index, onClick, hasChildren }: FlowNodeProps) {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  return (
    <motion.button variants={itemVariants} onClick={onClick} className="group h-full text-left">
      <div className="relative h-full rounded-xl overflow-hidden bg-white/5 hover:bg-white/8 backdrop-blur-sm border border-white/10 hover:border-orange-400/30 transition-all duration-300 p-5 flex flex-col justify-between group">
        {/* Content */}
        <div className="relative z-10 space-y-3">
          {/* Icon */}
          <motion.div whileHover={{ scale: 1.15 }} transition={{ duration: 0.2 }} className="text-3xl">
            {topic.icon}
          </motion.div>

          {/* Title */}
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-orange-400 transition-colors duration-200">
              {topic.title}
            </h3>
            {topic.description && <p className="text-xs text-white/50 mt-1 line-clamp-2">{topic.description}</p>}
          </div>

          {/* Subtopics count */}
          {topic.subtopics && topic.subtopics.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-white/60 group-hover:text-white/80 transition-colors">
              <span>
                {topic.subtopics.length} topic{topic.subtopics.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {/* Arrow indicator */}
        {hasChildren && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileHover={{ opacity: 1, x: 2 }}
            transition={{ duration: 0.2 }}
            className="mt-4 text-orange-400/70 group-hover:text-orange-400 transition-colors"
          >
            <ArrowRight size={18} />
          </motion.div>
        )}
      </div>
    </motion.button>
  )
}
