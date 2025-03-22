"use client"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ChevronUp, ChevronDown } from "lucide-react"

interface TimelineItem {
  id: number
  year: string
  title: string
  description: string
  image: string
}

const timelineData: TimelineItem[] = [
  {
    id: 1,
    year: "2023",
    title: "5G Network Optimization",
    description:
      "Led a team to optimize 5G network performance across multiple regions, resulting in 30% improved connectivity.",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 2,
    year: "2022",
    title: "Web Platform Redesign",
    description:
      "Completely redesigned the company's web platform with modern technologies, improving user engagement by 45%.",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 3,
    year: "2021",
    title: "Mobile App Development",
    description:
      "Developed a cross-platform mobile application that streamlined customer service operations and reduced response time by 60%.",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 4,
    year: "2020",
    title: "Cloud Migration Project",
    description:
      "Successfully migrated legacy systems to cloud infrastructure, reducing operational costs by 25% and improving system reliability.",
    image: "/placeholder.svg?height=400&width=600",
  },
]

export default function Timeline() {
  const [items, setItems] = useState(timelineData)
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 })

  const moveItemToEnd = () => {
    setItems((prevItems) => {
      const newItems = [...prevItems]
      const firstItem = newItems.shift()
      if (firstItem) newItems.push(firstItem)
      return newItems
    })
  }

  const moveItemToStart = () => {
    setItems((prevItems) => {
      const newItems = [...prevItems]
      const lastItem = newItems.pop()
      if (lastItem) newItems.unshift(lastItem)
      return newItems
    })
  }

  return (
    <section ref={sectionRef} className="relative min-h-screen bg-gradient-to-b from-black to-zinc-900 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center text-4xl font-bold md:text-5xl"
        >
          My <span className="text-[#FF8000]">Journey</span>
        </motion.h2>

        <div className="relative">
          <button
            onClick={moveItemToStart}
            className="absolute -top-12 left-1/2 -translate-x-1/2 rounded-full bg-zinc-800 p-2 text-[#FF8000] transition-all hover:bg-zinc-700"
            aria-label="Previous project"
          >
            <ChevronUp size={24} />
          </button>

          <div className="space-y-8">
            {items.map((item, index) => (
              <TimelineCard key={item.id} item={item} index={index} isInView={isInView} />
            ))}
          </div>

          <button
            onClick={moveItemToEnd}
            className="absolute -bottom-12 left-1/2 -translate-x-1/2 rounded-full bg-zinc-800 p-2 text-[#FF8000] transition-all hover:bg-zinc-700"
            aria-label="Next project"
          >
            <ChevronDown size={24} />
          </button>
        </div>
      </div>
    </section>
  )
}

function TimelineCard({
  item,
  index,
  isInView,
}: {
  item: TimelineItem
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
        scale: 1.03,
        transition: {
          duration: 0.4,
          ease: [0.25, 0.1, 0.25, 1.0],
        },
      }}
      className="group relative cursor-pointer overflow-hidden rounded-xl bg-zinc-800 transition-all"
    >
      <motion.div
        className="absolute -inset-1 rounded-xl bg-gradient-to-r from-[#FF8000]/0 via-[#FF8000]/30 to-[#FF8000]/0 opacity-0 blur-xl"
        animate={{ opacity: 0 }}
        whileHover={{
          opacity: 1,
          transition: { duration: 0.6 },
        }}
      />
      <div className="relative flex flex-col md:flex-row">
        <div className="flex-1 p-6 md:p-8">
          <div className="mb-4 flex items-center">
            <span className="text-xl font-bold text-[#FF8000]">{item.year}</span>
            <div className="ml-4 h-[1px] flex-1 bg-zinc-700"></div>
          </div>
          <h3 className="mb-3 text-2xl font-bold">{item.title}</h3>
          <p className="text-zinc-400">{item.description}</p>
        </div>
        <div className="aspect-video md:w-2/5">
          <img
            src={item.image || "/placeholder.svg"}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>
      </div>
    </motion.div>
  )
}

