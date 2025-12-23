"use client"

import { motion } from "framer-motion"
import FlowNode from "@/components/flow-node"

interface Topic {
  id: string
  title: string
  icon: string
  subtopics?: Topic[]
  content?: string
}

interface FlowMapProps {
  topics: Topic[]
  onNodeClick: (topic: Topic) => void
}

export default function FlowMap({ topics, onNodeClick }: FlowMapProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {topics.map((topic, index) => (
          <FlowNode
            key={topic.id}
            topic={topic}
            index={index}
            onClick={() => onNodeClick(topic)}
            hasChildren={!!(topic.subtopics && topic.subtopics.length > 0) || !!topic.content}
          />
        ))}
      </div>
    </motion.div>
  )
}
