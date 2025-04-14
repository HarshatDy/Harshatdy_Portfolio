"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

interface PortfolioItem {
  id: number
  title: string
  category: string
  description: string
  image: string
  url?: string
}

const portfolioData: PortfolioItem[] = [
  {
    id: 1,
    title: "OneAppNR",
    category: "Web Application",
    description: "Comprehensive 5G NR dashboard for real-time analysis and optimization of network parameters.",
    image: "/img/OneAppNR.webp",
    url: "https://github.com/HarshatDy/OneAppNR"
  },
  {
    id: 2,
    title: "Portfolio Website",
    category: "UI/UX Design",
    description: "Modern, interactive portfolio website with custom animations and responsive design.",
    image: "/img/Portfolio.png",
    url: "https://github.com/HarshatDy/Harshatdy_Portfolio"
  },
  {
    id: 3,
    title: "Envisage Web App",
    category: "Web Development",
    description: "AI-powered content generation and summarization platform with real-time updates.",
    image: "/img/Envisage-Web.png",
    url: "https://github.com/HarshatDy/Envisage_Web_App"
  },
  {
    id: 4,
    title: "Algorithmic Trading",
    category: "Financial Technology",
    description: "ML-based stock prediction system for intraday trading with high accuracy forecasts.",
    image: "/img/Stocks_Tipper.webp",
    url: "https://github.com/HarshatDy/Stocks_Tipper"
  },
  {
    id: 5,
    title: "Envisage V0.0",
    category: "Software Engineering",
    description: "Early prototype of the Envisage platform with core content generation capabilities.",
    image: "/placeholder.svg?height=500&width=500",
    url: "https://github.com/HarshatDy/EnvisageV0_0"
  },
  {
    id: 6,
    title: "Societe v1.1",
    category: "Data Visualization",
    description: "Social network analytics dashboard with interactive data visualization tools.",
    image: "/placeholder.svg?height=500&width=500",
    url: "https://github.com/HarshatDy/Societe_v_1_1"
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
        backgroundColor: "rgba(0, 0, 0, 0.95)", // Using rgba for transparency instead of backgroundOpacity
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
        ease: [0.25, 0.1, 0.25, 1.0],
      }}
      whileHover={{
        scale: 1.05,
        y: -15,
        zIndex: 10,
        boxShadow: "0 25px 50px -12px rgba(255, 128, 0, 0.15), 0 10px 20px -5px rgba(0, 0, 0, 0.3)",
        transition: {
          duration: 0.4,
          ease: [0.25, 0.1, 0.25, 1.0],
        },
      }}
      className="portfolio-card group relative aspect-square overflow-hidden rounded-xl shadow-xl"
      onClick={() => item.url && window.open(item.url, '_blank')}
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
          y: "-40%",
          transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] },
        }}
        style={{ translateY: "0" }}
      >
        <h3 className="mb-1 text-xl font-bold text-white">{item.title}</h3>
        <p className="mb-2 text-sm text-[#FF8000]">{item.category}</p>
        <motion.div
          className="flex flex-col gap-3 overflow-hidden text-sm text-zinc-300"
          initial={{ opacity: 0, height: 0 }}
          whileHover={{
            opacity: 1,
            height: "auto",
            transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] },
          }}
        >
          <p>{item.description}</p>
          {item.url && (
            <a 
              href={item.url}
              className="mt-2 inline-flex items-center text-[#FF8000] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              View Project <span className="ml-1">→</span>
            </a>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

