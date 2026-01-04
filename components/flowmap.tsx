"use client"

import { motion } from "framer-motion"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core"
import { SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from "@dnd-kit/sortable"
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
  onReorder?: (sourceIndex: number, destinationIndex: number) => void
  isEditMode?: boolean
  onContextMenu?: (e: React.MouseEvent, position: { x: number; y: number }, nodeId: string) => void
  getCanMoveUp?: (nodeId: string) => boolean
  getCanMoveDown?: (nodeId: string) => boolean
}

export default function FlowMap({
  topics,
  onNodeClick,
  onReorder,
  isEditMode = false,
  onContextMenu,
  getCanMoveUp,
  getCanMoveDown,
}: FlowMapProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || !onReorder) return

    const sourceIndex = topics.findIndex((topic) => topic.id === active.id)
    const destinationIndex = topics.findIndex((topic) => topic.id === over.id)

    if (sourceIndex !== -1 && destinationIndex !== -1 && sourceIndex !== destinationIndex) {
      onReorder(sourceIndex, destinationIndex)
    }
  }

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

  const content = (
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
            isEditMode={isEditMode}
            isDraggable={isEditMode}
            onContextMenu={
              onContextMenu
                ? (e, position) => onContextMenu(e, position, topic.id)
                : undefined
            }
            canMoveUp={getCanMoveUp ? getCanMoveUp(topic.id) : false}
            canMoveDown={getCanMoveDown ? getCanMoveDown(topic.id) : false}
          />
        ))}
      </div>
    </motion.div>
  )

  if (isEditMode && onReorder) {
    return (
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={topics.map((t) => t.id)} strategy={rectSortingStrategy}>
          {content}
        </SortableContext>
      </DndContext>
    )
  }

  return content
}
