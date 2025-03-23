"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

interface PortfolioItem {
  id: number
  title: string
  category: string
  description: string
  image: string
}

const portfolioData: PortfolioItem[] = [
  {
    id: 1,
    title: "Network Dashboard",
    category: "Web Application",
    description: "Real-time network monitoring dashboard with interactive visualizations.",
    image: "/placeholder.svg?height=500&width=500",
  },
  {
    id: 2,
    title: "Mobile App UI",
    category: "UI/UX Design",
    description: "Modern mobile application interface with intuitive navigation.",
    image: "/placeholder.svg?height=500&width=500",
  },
  {
    id: 3,
    title: "5G Implementation",
    category: "Telecommunications",
    description: "Enterprise-level 5G network implementation for a major corporation.",
    image: "/placeholder.svg?height=500&width=500",
  },
  {
    id: 4,
    title: "E-commerce Platform",
    category: "Web Development",
    description: "Full-stack e-commerce solution with advanced filtering and search capabilities.",
    image: "/placeholder.svg?height=500&width=500",
  },
  {
    id: 5,
    title: "IoT Control System",
    category: "Software Engineering",
    description: "Centralized control system for IoT devices with real-time monitoring.",
    image: "/placeholder.svg?height=500&width=500",
  },
  {
    id: 6,
    title: "Analytics Dashboard",
    category: "Data Visualization",
    description: "Comprehensive analytics dashboard with customizable reports and insights.",
    image: "/placeholder.svg?height=500&width=500",
  },
]

export default function PortfolioGrid() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 })

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-black py-20"
      style={{
        backgroundImage: "url('/placeholder.svg?height=100&width=100')",
        backgroundBlendMode: "overlay",
        backgroundSize: "100px",
        backgroundOpacity: 0.05,
      }}
    >
      <div className="mx-auto max-w-6xl px-4">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center text-4xl font-bold md:text-5xl"
        >
          My <span className="text-[#FF8000]">Portfolio</span>
        </motion.h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {portfolioData.map((item, index) => (
            <PortfolioCard key={item.id} item={item} index={index} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  )
}

function PortfolioCard({
  item,
  index,
  isInView,
}: {
  item: PortfolioItem
  index: number
  isInView: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.25, 0.1, 0.25, 1.0], // Cubic bezier for smoother motion
      }}
      whileHover={{
        scale: 1.05,
        y: -15, // Pop up effect
        zIndex: 10,
        boxShadow: "0 25px 50px -12px rgba(255, 128, 0, 0.15), 0 10px 20px -5px rgba(0, 0, 0, 0.3)",
        transition: {
          duration: 0.4,
          ease: [0.25, 0.1, 0.25, 1.0],
        },
      }}
      className="portfolio-card group relative aspect-square overflow-hidden rounded-xl shadow-xl"
    >
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${item.image})` }}
        whileHover={{
          scale: 1.1,
          transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1.0] },
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80" />

      <motion.div
        className="absolute bottom-0 left-0 w-full p-6"
        initial={{ y: 0 }}
        whileHover={{
          y: "-50%",
          transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] },
        }}
        style={{ translateY: "0" }}
      >
        <h3 className="mb-1 text-xl font-bold text-white">{item.title}</h3>
        <p className="mb-2 text-sm text-[#FF8000]">{item.category}</p>
        <motion.p
          className="max-h-0 overflow-hidden text-sm text-zinc-300"
          initial={{ opacity: 0, height: 0 }}
          whileHover={{
            opacity: 1,
            height: "auto",
            transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] },
          }}
        >
          {item.description}
        </motion.p>
      </motion.div>
    </motion.div>
  )
}

