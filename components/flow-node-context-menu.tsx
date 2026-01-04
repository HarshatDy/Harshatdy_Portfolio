"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Edit, Plus, Trash2, ArrowUp, ArrowDown, X } from "lucide-react"
import { useEffect, useRef } from "react"

interface FlowNodeContextMenuProps {
  isOpen: boolean
  position: { x: number; y: number }
  onClose: () => void
  onEdit: () => void
  onAddChild: () => void
  onDelete: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  canMoveUp?: boolean
  canMoveDown?: boolean
}

export default function FlowNodeContextMenu({
  isOpen,
  position,
  onClose,
  onEdit,
  onAddChild,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp = false,
  canMoveDown = false,
}: FlowNodeContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  // Adjust position to keep menu within viewport
  const adjustedPosition = useRef({ x: position.x, y: position.y })

  useEffect(() => {
    if (menuRef.current && isOpen) {
      const menu = menuRef.current
      const rect = menu.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      let x = position.x
      let y = position.y

      // Adjust horizontal position
      if (x + rect.width > viewportWidth) {
        x = viewportWidth - rect.width - 10
      }
      if (x < 10) {
        x = 10
      }

      // Adjust vertical position
      if (y + rect.height > viewportHeight) {
        y = viewportHeight - rect.height - 10
      }
      if (y < 10) {
        y = 10
      }

      adjustedPosition.current = { x, y }
    }
  }, [position, isOpen])

  const menuItems = [
    {
      icon: Edit,
      label: "Edit",
      onClick: () => {
        onEdit()
        onClose()
      },
      className: "hover:bg-white/10",
    },
    {
      icon: Plus,
      label: "Add Child",
      onClick: () => {
        onAddChild()
        onClose()
      },
      className: "hover:bg-white/10",
    },
    ...(canMoveUp && onMoveUp
      ? [
          {
            icon: ArrowUp,
            label: "Move Up",
            onClick: () => {
              onMoveUp()
              onClose()
            },
            className: "hover:bg-white/10",
          },
        ]
      : []),
    ...(canMoveDown && onMoveDown
      ? [
          {
            icon: ArrowDown,
            label: "Move Down",
            onClick: () => {
              onMoveDown()
              onClose()
            },
            className: "hover:bg-white/10",
          },
        ]
      : []),
    {
      icon: Trash2,
      label: "Delete",
      onClick: () => {
        onDelete()
        onClose()
      },
      className: "hover:bg-red-500/20 text-red-400 hover:text-red-300",
    },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={onClose}
          />

          {/* Menu */}
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed z-50 min-w-[180px] rounded-lg bg-black/90 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden"
            style={{
              left: `${adjustedPosition.current.x}px`,
              top: `${adjustedPosition.current.y}px`,
            }}
          >
            <div className="p-1">
              {menuItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={item.onClick}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm text-white rounded-md transition-colors ${item.className}`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

