"use client"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ChevronUp, ChevronDown } from "lucide-react"
import TimelineModal from "./timeline-modal"

export interface TimelineItem {
  id: number
  year: string
  title: string
  description: string
  image: string
  detailedInfo?: {
    metrics?: Array<{ value: string, label: string }>
    fullDescription?: string
    achievements?: string[]
    links?: Array<{ text: string, url: string }>
  }
}

const timelineData: TimelineItem[] = [
    {
    id: 2,
    year: "2024",
    title: "5G Private Network Deployment",
    description:
      "Led a client project in the UK for end-to-end live deployment of a private 5G network across multiple sites in Bath, Liverpool, Shrewsbury, and Cardiff.",
    image: "/img/5G_Private_Deployment.jpeg",
    detailedInfo: {
      metrics: [
        { value: "90%", label: "Efficiency" },
        { value: "12+", label: "Team Members" },
        { value: "2 mo", label: "Time Frame" },
      ],
      fullDescription: `Completely deployed a private 5G network across multiple regions, ensuring seamless communication and high-performance connectivity.

This project involved extensive collaboration across multiple departments, implementing cutting-edge 5G technologies and methodologies to achieve outstanding results. The solutions developed continue to provide significant value and have become a benchmark for similar initiatives in the industry.`,
      achievements: [
        "Successfully deployed a private 5G network across multiple locations under budget and ahead of schedule.",
        "Optimized 5G L2 algorithms for improved network performance and efficiency.",
        "Ensured seamless communication between multiple 5G components using RRC, PDCP, NGAP, and X2AP protocols."
      ]
    }
  },
  {
    id: 1,
    year: "2022",
    title: "OneAppNR - 5G NR Dashboard",
    description:
      "Developed a web-based 5G NR dashboard for real-time analysis of Throughput, EPRE, Link Budget, and Timing Advance, aiding efficient 5G system optimization.",
    image: "/img/OneAppNR.webp",
    detailedInfo: {
      metrics: [
        { value: "85%", label: "Performance Improvement" },
        { value: "5", label: "Team Members" },
        { value: "4 mo", label: "Time Frame" },
      ],
      fullDescription: `Created a comprehensive 5G New Radio (NR) web application to analyze critical network parameters such as throughput, link budget, and timing advance, providing real-time insights for system optimization.

This project involved integrating Python-based backend processing with a React.js-based interactive front end, enabling engineers to visualize and evaluate 5G NR system performance efficiently. The solution remains a benchmark for advanced 5G analytics and optimization.`,
      achievements: [
        "Developed OneAppNR, a dynamic React.js-based dashboard with a Django backend for 5G NR analysis.",
        "Implemented real-time data visualization for EPRE, Link Budget, and Timing Advance calculations.",
        "Hosted the application using Docker and Kubernetes, ensuring scalability and efficient deployment.",
        "Integrated 5G NR algorithms to automate Throughput and Link Budget estimations."
      ],
    }
  },
  {
    id: 3,
    year: "2025",
    title: "Envisage - AI-Powered News Summarization",
    description:
      "Conceptualized and developed an AI-driven web platform to generate summarized, authentic content on trending topics across various Categories.",
    image: "/img/Envisage-Web.png",
    detailedInfo: {
      metrics: [
        { value: "50%", label: "Faster Content Creation" },
        { value: "1", label: "Team Members" },
        { value: "2 mo+ Ongoing", label: "Time Frame" },
      ],
      fullDescription: `Developed an AI-powered content generation platform, enabling automated summarization and intelligent content curation across multiple new categories.

This project involved extensive collaboration across AI, backend, and frontend teams, implementing state-of-the-art natural language processing (NLP) and web technologies. The solution continues to provide significant value and has become a benchmark for AI-driven content platforms.`,
      achievements: [
        "Integrated AI-powered text summarization for quick information retrieval.",
        "Developed a Django-based backend with Kafka integration for real-time content updates.",
        "Implemented a seamless UI/UX using Figma and Bootstrap."
      ]
    }
  },
  {
    id: 4,
    year: "2025",
    title: "Stocks Tipper - AI-Based Stock Prediction",
    description:
      "Developed an AI-driven stock prediction system for intraday trading, providing accurate market forecasts after market close.",
    image: "/img/Stocks_Tipper.webp",
    detailedInfo: {
      metrics: [
        { value: "80%", label: "Prediction Accuracy" },
        { value: "5+", label: "Team Members" },
        { value: "6 mo", label: "Time Frame" },
      ],
      fullDescription: `Designed and implemented a machine learning-based stock prediction model, leveraging historical market data to generate actionable trading insights.

This project involved extensive collaboration across financial and data science teams, utilizing advanced AI algorithms, feature engineering, and real-time data analysis. The solution continues to provide significant value and has become a benchmark for AI-driven stock prediction tools.`,
      achievements: [
        "Implemented machine learning models to predict intraday stock price movements.",
        "Integrated Python, TensorFlow, and financial data APIs for real-time processing.",
        "Developed a user-friendly dashboard for visualization of stock trends and predictions.",
        "Optimized feature selection techniques to improve model accuracy and reliability."
      ]
    }
  },
]

export default function Timeline() {
  const [items, setItems] = useState(timelineData)
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 })

  // Reversed this function - now moves the last item to the beginning
  const moveItemToStart = () => {
    setItems((prevItems) => {
      const newItems = [...prevItems]
      const lastItem = newItems.pop()
      if (lastItem) newItems.unshift(lastItem)
      return newItems
    })
  }

  // Reversed this function - now moves the first item to the end
  const moveItemToEnd = () => {
    setItems((prevItems) => {
      const newItems = [...prevItems]
      const firstItem = newItems.shift()
      if (firstItem) newItems.push(firstItem)
      return newItems
    })
  }

  const openModal = (item: TimelineItem) => {
    setSelectedItem(item)
    setIsModalOpen(true)
    // Prevent body scrolling when modal is open
    document.body.style.overflow = "hidden"
  }

  const closeModal = () => {
    setIsModalOpen(false)
    // Re-enable body scrolling when modal is closed
    document.body.style.overflow = "auto"
  }

  return (
    <section ref={sectionRef} className="relative min-h-screen bg-gradient-to-b from-black to-zinc-900 py-20 font-montserrat">
      <div className="mx-auto max-w-6xl px-4">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center text-4xl font-bold md:text-5xl font-unbounded"
        >
          My <span className="text-[#FF8000]">Journey</span>
        </motion.h2>

        <div className="relative">
          {/* Changed the onClick function to moveItemToEnd, which now moves the first item down */}
          <button
            onClick={moveItemToEnd}
            className="absolute -top-12 left-1/2 -translate-x-1/2 rounded-full bg-zinc-800 p-2 text-[#FF8000] transition-all hover:bg-zinc-700"
            aria-label="Show previous projects"
          >
            <ChevronUp size={24} />
          </button>

          <div className="space-y-8">
            {items.map((item, index) => (
              <TimelineCard 
                key={item.id} 
                item={item} 
                index={index} 
                isInView={isInView}
                onClick={() => openModal(item)}
              />
            ))}
          </div>

          {/* Changed the onClick function to moveItemToStart, which now brings the bottom card up */}
          <button
            onClick={moveItemToStart}
            className="absolute -bottom-12 left-1/2 -translate-x-1/2 rounded-full bg-zinc-800 p-2 text-[#FF8000] transition-all hover:bg-zinc-700"
            aria-label="Show more recent projects"
          >
            <ChevronDown size={24} />
          </button>
        </div>
      </div>

      {/* Modal */}
      <TimelineModal 
        item={selectedItem} 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
    </section>
  )
}

function TimelineCard({
  item,
  index,
  isInView,
  onClick,
}: {
  item: TimelineItem
  index: number
  isInView: boolean
  onClick: () => void
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
        scale: 1.03,
        y: -10,
        boxShadow: "0 20px 25px -5px rgba(255, 128, 0, 0.2), 0 10px 10px -5px rgba(255, 128, 0, 0.1)",
        transition: {
          duration: 0.4,
          ease: [0.25, 0.1, 0.25, 1.0],
        },
      }}
      className="timeline-card group relative cursor-pointer overflow-hidden rounded-xl bg-zinc-800 transition-all shadow-[0_4px_8px_0_rgba(255,128,0,0.1)]"
      onClick={onClick}
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
          <h3 className="mb-3 text-2xl font-bold font-unbounded">{item.title}</h3>
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

