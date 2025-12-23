"use client"

import { motion } from "framer-motion"

interface ContentViewProps {
  title: string
  description: string
  content: string
}

export default function ContentView({ title, description, content }: ContentViewProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto"
    >
      <div className="rounded-2xl overflow-hidden bg-white/5 hover:bg-white/8 backdrop-blur-sm border border-white/10 p-8 transition-all duration-300">
        {/* Header Section */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mb-8">
          <motion.div variants={itemVariants}>
            <h2 className="text-4xl font-bold text-white mb-3">{title}</h2>
            <p className="text-white/60 text-lg">{description}</p>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-orange-400/0 via-orange-400/50 to-orange-400/0 mb-8" />

        {/* Content Section */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
          <motion.p variants={itemVariants} className="text-white/80 text-lg leading-relaxed">
            {content}
          </motion.p>

          {/* Learning Points Grid */}
          <motion.div variants={itemVariants} className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { label: "Core Concepts", icon: "🎯" },
              { label: "Best Practices", icon: "✨" },
              { label: "Real-world Applications", icon: "🚀" },
              { label: "Common Patterns", icon: "🔄" },
            ].map((point, i) => (
              <motion.div
                key={point.label}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                className="flex items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-orange-400/30 transition-all duration-300 group cursor-default"
              >
                <span className="text-lg group-hover:scale-110 transition-transform">{point.icon}</span>
                <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                  {point.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}
