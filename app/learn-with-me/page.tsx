"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import FlowMap from "@/components/flowmap"
import ContentView from "@/components/content-viewer"

const learningTopics = [
  {
    id: "web-development",
    title: "Web Development",
    icon: "🌐",
    description: "Frontend, backend, and fullstack web technologies",
    subtopics: [
      {
        id: "frontend",
        title: "Frontend",
        icon: "⚡",
        description: "User interface and interactive experiences",
        subtopics: [
          {
            id: "react",
            title: "React & Next.js",
            icon: "⚛️",
            description: "Modern React patterns and Next.js app router",
            content:
              "Learn advanced React patterns, hooks, and Next.js features for building scalable web applications.",
          },
          {
            id: "css",
            title: "CSS & Animations",
            icon: "🎨",
            description: "Styling and motion design",
            content: "Master advanced CSS techniques, Tailwind, and create smooth animations with Framer Motion.",
          },
        ],
      },
      {
        id: "backend",
        title: "Backend",
        icon: "🔧",
        description: "Server-side logic and databases",
        subtopics: [
          {
            id: "databases",
            title: "Databases",
            icon: "💾",
            description: "Data storage and retrieval",
            content: "Explore SQL, NoSQL databases, ORM patterns, and database optimization techniques.",
          },
          {
            id: "apis",
            title: "APIs & Auth",
            icon: "🔐",
            description: "API design and security",
            content: "Build RESTful APIs, implement authentication, and secure your applications with best practices.",
          },
        ],
      },
    ],
  },
  {
    id: "design",
    title: "UI/UX Design",
    icon: "🎭",
    description: "Design systems and user experience",
    subtopics: [
      {
        id: "design-systems",
        title: "Design Systems",
        icon: "📐",
        description: "Building component libraries",
        subtopics: [
          {
            id: "components",
            title: "Components",
            icon: "🧩",
            description: "Reusable UI elements",
            content:
              "Learn to build and maintain scalable component libraries with proper documentation and versioning.",
          },
          {
            id: "typography",
            title: "Typography",
            icon: "📝",
            description: "Font and text design",
            content: "Understand typography principles, font pairing, hierarchy, and readability best practices.",
          },
        ],
      },
      {
        id: "ux-principles",
        title: "UX Principles",
        icon: "👥",
        description: "User-centered design",
        subtopics: [
          {
            id: "user-research",
            title: "User Research",
            icon: "🔍",
            description: "Understanding users",
            content: "Master user research methods, interviews, and data analysis to inform design decisions.",
          },
          {
            id: "usability",
            title: "Usability Testing",
            icon: "✅",
            description: "Validation and iteration",
            content:
              "Learn usability testing methodologies, analyze results, and iterate on designs based on feedback.",
          },
        ],
      },
    ],
  },
  {
    id: "ai-ml",
    title: "AI & Machine Learning",
    icon: "🤖",
    description: "Artificial intelligence and ML models",
    subtopics: [
      {
        id: "fundamentals",
        title: "ML Fundamentals",
        icon: "📊",
        description: "Core ML concepts",
        subtopics: [
          {
            id: "supervised",
            title: "Supervised Learning",
            icon: "📈",
            description: "Classification and regression",
            content:
              "Understand supervised learning algorithms, training, validation, and model evaluation techniques.",
          },
          {
            id: "unsupervised",
            title: "Unsupervised Learning",
            icon: "🎯",
            description: "Clustering and patterns",
            content: "Explore clustering algorithms, dimensionality reduction, and pattern discovery in data.",
          },
        ],
      },
    ],
  },
]

type ViewState =
  | { type: "flowmap"; topics: typeof learningTopics }
  | { type: "content"; title: string; description: string; fullContent: string }

export default function LearnWithMePage() {
  const [viewStack, setViewStack] = useState<ViewState[]>([{ type: "flowmap", topics: learningTopics }])

  const currentView = viewStack[viewStack.length - 1]

  const handleNodeClick = (topic: any) => {
    if (topic.subtopics && topic.subtopics.length > 0) {
      setViewStack([...viewStack, { type: "flowmap", topics: topic.subtopics }])
    } else if (topic.content) {
      setViewStack([
        ...viewStack,
        { type: "content", title: topic.title, description: topic.description, fullContent: topic.content },
      ])
    }
  }

  const handleBack = () => {
    if (viewStack.length > 1) {
      setViewStack(viewStack.slice(0, -1))
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-black to-slate-900 text-white overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-30 bg-black/40 backdrop-blur-xl border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.08, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 rounded-lg bg-white/10 transition-colors duration-300"
              >
                <ChevronLeft size={18} />
              </motion.button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Learn With Me</h1>
              <p className="text-xs text-white/50 mt-0.5">Explore knowledge and grow</p>
            </div>
          </div>

          {viewStack.length > 1 && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={handleBack}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 transition-all duration-300 flex items-center gap-2 text-sm"
            >
              <ChevronLeft size={16} />
              Back
            </motion.button>
          )}
        </div>
      </motion.div>

      <div className="pt-8 pb-16 px-6">
        <AnimatePresence mode="wait">
          {currentView.type === "flowmap" ? (
            <FlowMap key="flowmap" topics={currentView.topics} onNodeClick={handleNodeClick} />
          ) : (
            <ContentView
              key="content"
              title={currentView.title}
              description={currentView.description}
              content={currentView.fullContent}
            />
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
