"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { BookOpen } from "lucide-react"

export default function LearnButton() {
  return (
    <Link href="/learn-with-me">
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed top-8 left-8 z-40 group"
      >
        <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 hover:border-orange-400/50 transition-all duration-300 backdrop-blur-md">
          <motion.div whileHover={{ rotate: 12 }} transition={{ duration: 0.3 }}>
            <BookOpen size={18} className="text-orange-400" />
          </motion.div>
          <span className="text-sm font-medium text-white">Learn</span>
        </div>
      </motion.button>
    </Link>
  )
}
