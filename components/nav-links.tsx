"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Mail, BookOpen, TrendingUp } from "lucide-react"

const links = [
  { href: "/newsletter", icon: Mail, label: "Newsletter" },
  { href: "/knowledge", icon: BookOpen, label: "Knowledge" },
  { href: "/finance", icon: TrendingUp, label: "Finance" },
]

export default function NavLinks() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="fixed top-8 left-8 z-40 flex items-center gap-2"
    >
      {links.map(({ href, icon: Icon, label }) => (
        <Link key={href} href={href}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 hover:border-orange-400/50 transition-all duration-300 backdrop-blur-md"
          >
            <Icon size={15} className="text-orange-400" />
            <span className="text-sm font-medium text-white">{label}</span>
          </motion.div>
        </Link>
      ))}
    </motion.div>
  )
}
