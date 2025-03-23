"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { TimelineItem } from "./timeline"
import { useEffect } from "react"

interface TimelineModalProps {
  item: TimelineItem | null
  isOpen: boolean
  onClose: () => void
}

export default function TimelineModal({ item, isOpen, onClose }: TimelineModalProps) {
  // Dispatch custom events for cursor component
  useEffect(() => {
    if (isOpen) {
      const openEvent = new Event("modalOpen")
      window.dispatchEvent(openEvent)
    } else {
      const closeEvent = new Event("modalClose")
      window.dispatchEvent(closeEvent)
    }
  }, [isOpen])

  if (!item) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal - decreased z-index to be below cursor */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative max-h-[90vh] w-full max-w-5xl overflow-auto rounded-xl bg-zinc-900 shadow-[0_0_25px_rgba(255,128,0,0.2)]"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button with higher z-index but still below cursor */}
              <button
                className="absolute right-4 top-4 z-60 rounded-full bg-zinc-800 p-2 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
                onClick={onClose}
              >
                <X size={20} />
              </button>

              <div className="flex flex-col md:flex-row">
                {/* Left side - Image */}
                <div className="md:w-1/2">
                  <div className="relative h-[300px] md:h-full">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent md:bg-gradient-to-r" />
                  </div>
                </div>

                {/* Right side - Content */}
                <div className="flex-1 p-6 md:p-8">
                  {/* Year */}
                  <div className="mb-4 flex items-center">
                    <span className="text-2xl font-bold text-[#FF8000]">{item.year}</span>
                    <div className="ml-4 h-[2px] flex-1 bg-gradient-to-r from-[#FF8000]/80 to-zinc-700"></div>
                  </div>

                  {/* Title */}
                  <h2 className="mb-6 text-3xl font-bold">{item.title}</h2>

                  {/* Infographics */}
                  <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3">
                    <div className="rounded-lg bg-zinc-800 p-4 text-center">
                      <span className="block text-2xl font-bold text-[#FF8000]">85%</span>
                      <span className="text-sm text-zinc-400">Efficiency</span>
                    </div>
                    <div className="rounded-lg bg-zinc-800 p-4 text-center">
                      <span className="block text-2xl font-bold text-[#FF8000]">12+</span>
                      <span className="text-sm text-zinc-400">Team Members</span>
                    </div>
                    <div className="rounded-lg bg-zinc-800 p-4 text-center">
                      <span className="block text-2xl font-bold text-[#FF8000]">6 mo</span>
                      <span className="text-sm text-zinc-400">Time Frame</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="prose prose-invert max-w-none">
                    <p className="text-lg text-zinc-300">{item.description}</p>
                    <p className="mt-4 text-zinc-400">
                      This project involved extensive collaboration across multiple departments,
                      implementing cutting-edge technologies and methodologies to achieve outstanding results.
                      The solutions developed continue to provide significant value and have become a
                      benchmark for similar initiatives in the industry.
                    </p>
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold">Key Achievements:</h3>
                      <ul className="ml-5 mt-2 list-disc text-zinc-400">
                        <li>Successfully delivered project under budget and ahead of schedule</li>
                        <li>Implemented innovative solutions that exceeded client expectations</li>
                        <li>Developed new methodologies that have been adopted company-wide</li>
                        <li>Received industry recognition for excellence in execution</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
