"use client"

import { motion } from "framer-motion"
import { ArrowRight, GripVertical, MoreVertical } from "lucide-react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useState, useRef, useEffect } from "react"

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
  isEditMode?: boolean
  isDraggable?: boolean
  onContextMenu?: (e: React.MouseEvent, position: { x: number; y: number }) => void
  canMoveUp?: boolean
  canMoveDown?: boolean
}

export default function FlowNode({
  topic,
  index,
  onClick,
  hasChildren,
  isEditMode = false,
  isDraggable = false,
  onContextMenu,
  canMoveUp = false,
  canMoveDown = false,
}: FlowNodeProps) {
  const [showMenuButton, setShowMenuButton] = useState(false)
  const nodeRef = useRef<HTMLDivElement | null>(null)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: topic.id,
    disabled: !isDraggable,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

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

  const handleContextMenu = (e: React.MouseEvent) => {
    if (isEditMode && onContextMenu) {
      e.preventDefault()
      e.stopPropagation()
      onContextMenu(e, { x: e.clientX, y: e.clientY })
    }
  }

  const handleMenuButtonClick = (e: React.MouseEvent) => {
    if (isEditMode && onContextMenu) {
      e.preventDefault()
      e.stopPropagation()
      if (nodeRef.current) {
        const rect = nodeRef.current.getBoundingClientRect()
        onContextMenu(e, { x: rect.right - 10, y: rect.top + 10 })
      }
    }
  }

  const combinedRef = (node: HTMLDivElement | null) => {
    nodeRef.current = node
    if (node && isDraggable) {
      setNodeRef(node)
    }
  }

  return (
    <motion.div
      ref={combinedRef}
      variants={itemVariants}
      style={style}
      className="group h-full flowmap-node"
      onContextMenu={handleContextMenu}
      onMouseEnter={() => setShowMenuButton(true)}
      onMouseLeave={() => setShowMenuButton(false)}
    >
      <div className="relative h-full rounded-xl overflow-hidden bg-white/5 hover:bg-white/8 backdrop-blur-sm border border-white/10 hover:border-orange-400/30 transition-all duration-300 p-5 flex flex-col justify-between group">
        {/* Edit Mode Controls */}
        {isEditMode && (
          <div className="absolute top-2 right-2 z-20 flex items-center gap-1">
            {/* Drag Handle */}
            {isDraggable && (
              <motion.div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-1.5 rounded hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <GripVertical size={16} className="text-white/60 hover:text-white" />
              </motion.div>
            )}

            {/* Context Menu Button */}
            {(showMenuButton || isEditMode) && (
              <motion.button
                onClick={handleMenuButtonClick}
                className="p-1.5 rounded hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <MoreVertical size={16} className="text-white/60 hover:text-white" />
              </motion.button>
            )}
          </div>
        )}

        {/* Content */}
        <button
          onClick={onClick}
          className="relative z-10 space-y-3 w-full text-left"
          disabled={isDragging}
        >
          {/* Icon */}
          <motion.div whileHover={{ scale: 1.15 }} transition={{ duration: 0.2 }} className="text-3xl">
            {topic.icon}
          </motion.div>

          {/* Title */}
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-orange-400 transition-colors duration-200">
              {topic.title}
            </h3>
            {topic.description && (
              <p className="text-xs text-white/50 mt-1 line-clamp-2">{topic.description}</p>
            )}
          </div>

          {/* Subtopics count and slug indicator */}
          <div className="flex items-center gap-2 text-xs text-white/60 group-hover:text-white/80 transition-colors">
            {topic.subtopics && topic.subtopics.length > 0 && (
              <span>
                {topic.subtopics.length} topic{topic.subtopics.length !== 1 ? "s" : ""}
              </span>
            )}
            {topic.slug && (
              <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 text-xs">
                Page
              </span>
            )}
          </div>
        </button>

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

        {/* Edit Mode Indicator */}
        {isEditMode && (
          <div className="absolute bottom-2 left-2 text-xs text-white/30">
            Edit mode
          </div>
        )}
      </div>
    </motion.div>
  )
}
