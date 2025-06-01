"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Brain } from "lucide-react"

export default function StickyThoughtsButton() {
  const router = useRouter()

  return (
    <motion.button
      onClick={() => router.push("/train-of-thoughts")}
      className="fixed bottom-8 right-8 z-50 flex items-center gap-2 rounded-full bg-[#FF8000] px-4 py-3 text-sm font-medium text-black shadow-lg backdrop-blur-sm transition-all hover:bg-[#FF8000]/90 hover:shadow-xl md:px-6 md:py-4 md:text-base"
      initial={{ opacity: 0, scale: 0.8, y: 100 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 2.5 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Brain size={20} />
      <span className="hidden md:inline">Train of thoughts</span>
      <span className="md:hidden">Thoughts</span>
    </motion.button>
  )
}
