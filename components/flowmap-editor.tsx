"use client"

import { useState, useEffect } from "react"
import FlowMap from "@/components/flowmap"
import FlowNodeContextMenu from "@/components/flow-node-context-menu"
import NodeEditorModal from "@/components/node-editor-modal"
import type { Topic } from "@/app/data/flowmapData"
import {
  findNodePath,
  updateNodeInTree,
  deleteNodeFromTree,
  addNodeToTree,
  reorderNodes,
  getSiblings,
  generateNodeId,
} from "@/app/data/flowmapData"

interface FlowMapEditorProps {
  topics: Topic[]
  onNodeClick: (topic: Topic) => void
  onTopicsChange: (topics: Topic[]) => void
}

export default function FlowMapEditor({
  topics,
  onNodeClick,
  onTopicsChange,
}: FlowMapEditorProps) {
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean
    position: { x: number; y: number }
    nodeId: string | null
  }>({
    isOpen: false,
    position: { x: 0, y: 0 },
    nodeId: null,
  })

  const [editorModal, setEditorModal] = useState<{
    isOpen: boolean
    node: Topic | null
    isNewNode: boolean
    parentId: string | null
  }>({
    isOpen: false,
    node: null,
    isNewNode: false,
    parentId: null,
  })

  const handleContextMenu = (e: React.MouseEvent, position: { x: number; y: number }, nodeId: string) => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenu({
      isOpen: true,
      position,
      nodeId,
    })
  }

  const handleCloseContextMenu = () => {
    setContextMenu({
      isOpen: false,
      position: { x: 0, y: 0 },
      nodeId: null,
    })
  }

  const handleEdit = () => {
    if (!contextMenu.nodeId) return

    const pathResult = findNodePath(topics, contextMenu.nodeId)
    if (!pathResult) return

    setEditorModal({
      isOpen: true,
      node: pathResult.node,
      isNewNode: false,
      parentId: null,
    })
    handleCloseContextMenu()
  }

  const handleAddChild = () => {
    if (!contextMenu.nodeId) return

    setEditorModal({
      isOpen: true,
      node: null,
      isNewNode: true,
      parentId: contextMenu.nodeId,
    })
    handleCloseContextMenu()
  }

  const handleAddRoot = () => {
    setEditorModal({
      isOpen: true,
      node: null,
      isNewNode: true,
      parentId: null,
    })
  }

  const handleDelete = () => {
    if (!contextMenu.nodeId) return

    const confirmed = window.confirm(
      "Are you sure you want to delete this node? This action cannot be undone."
    )

    if (confirmed) {
      const updatedTopics = deleteNodeFromTree(topics, contextMenu.nodeId)
      onTopicsChange(updatedTopics)
    }
    handleCloseContextMenu()
  }

  const handleMoveUp = () => {
    if (!contextMenu.nodeId) return

    const siblingsResult = getSiblings(topics, contextMenu.nodeId)
    if (!siblingsResult) return

    const { siblings, parentId } = siblingsResult
    const currentIndex = siblings.findIndex((s) => s.id === contextMenu.nodeId)

    if (currentIndex > 0) {
      const updatedTopics = reorderNodes(topics, parentId, currentIndex, currentIndex - 1)
      onTopicsChange(updatedTopics)
    }
    handleCloseContextMenu()
  }

  const handleMoveDown = () => {
    if (!contextMenu.nodeId) return

    const siblingsResult = getSiblings(topics, contextMenu.nodeId)
    if (!siblingsResult) return

    const { siblings, parentId } = siblingsResult
    const currentIndex = siblings.findIndex((s) => s.id === contextMenu.nodeId)

    if (currentIndex < siblings.length - 1) {
      const updatedTopics = reorderNodes(topics, parentId, currentIndex, currentIndex + 1)
      onTopicsChange(updatedTopics)
    }
    handleCloseContextMenu()
  }

  const handleSaveNode = (updatedNode: Topic) => {
    if (editorModal.isNewNode) {
      // Add new node
      const newNode: Topic = {
        ...updatedNode,
        id: generateNodeId(),
      }
      const updatedTopics = addNodeToTree(topics, editorModal.parentId, newNode)
      onTopicsChange(updatedTopics)
    } else {
      // Update existing node
      const updatedTopics = updateNodeInTree(topics, updatedNode.id, updatedNode)
      onTopicsChange(updatedTopics)
    }

    setEditorModal({
      isOpen: false,
      node: null,
      isNewNode: false,
      parentId: null,
    })
  }

  const handleReorder = (sourceIndex: number, destinationIndex: number) => {
    const updatedTopics = reorderNodes(topics, null, sourceIndex, destinationIndex)
    onTopicsChange(updatedTopics)
  }

  const getCanMoveUp = (nodeId: string): boolean => {
    const siblingsResult = getSiblings(topics, nodeId)
    if (!siblingsResult) return false

    const { siblings } = siblingsResult
    const currentIndex = siblings.findIndex((s) => s.id === nodeId)
    return currentIndex > 0
  }

  const getCanMoveDown = (nodeId: string): boolean => {
    const siblingsResult = getSiblings(topics, nodeId)
    if (!siblingsResult) return false

    const { siblings } = siblingsResult
    const currentIndex = siblings.findIndex((s) => s.id === nodeId)
    return currentIndex < siblings.length - 1
  }

  const currentNode = contextMenu.nodeId
    ? findNodePath(topics, contextMenu.nodeId)?.node
    : null

  return (
    <>
      <div className="relative">
        {/* Add Root Node Button */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={handleAddRoot}
            className="px-4 py-2 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/50 text-orange-300 transition-colors flex items-center gap-2"
          >
            <span>+</span>
            <span>Add Node</span>
          </button>
        </div>

        <FlowMap
          topics={topics}
          onNodeClick={onNodeClick}
          onReorder={handleReorder}
          isEditMode={true}
          onContextMenu={handleContextMenu}
          getCanMoveUp={getCanMoveUp}
          getCanMoveDown={getCanMoveDown}
        />
      </div>

      {/* Context Menu */}
      {currentNode && (
        <FlowNodeContextMenu
          isOpen={contextMenu.isOpen}
          position={contextMenu.position}
          onClose={handleCloseContextMenu}
          onEdit={handleEdit}
          onAddChild={handleAddChild}
          onDelete={handleDelete}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
          canMoveUp={getCanMoveUp(contextMenu.nodeId!)}
          canMoveDown={getCanMoveDown(contextMenu.nodeId!)}
        />
      )}

      {/* Editor Modal */}
      <NodeEditorModal
        isOpen={editorModal.isOpen}
        node={editorModal.node}
        onClose={() =>
          setEditorModal({
            isOpen: false,
            node: null,
            isNewNode: false,
            parentId: null,
          })
        }
        onSave={handleSaveNode}
        isNewNode={editorModal.isNewNode}
      />
    </>
  )
}

