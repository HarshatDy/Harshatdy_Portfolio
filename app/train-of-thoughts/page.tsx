"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Clock, Filter, Menu, X } from "lucide-react"
import Footer from "@/components/footer"
import { SliderBlogPost, sliderblogPosts } from "@/app/data/blogPosts"

// Extract unique categories
const categories = ["All", ...Array.from(new Set(sliderblogPosts.map((post) => post.category)))]

export default function TrainOfThoughts() {
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [filteredPosts, setFilteredPosts] = useState(sliderblogPosts)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredPosts(sliderblogPosts)
    } else {
      setFilteredPosts(sliderblogPosts.filter((post) => post.category === selectedCategory))
    }
  }, [selectedCategory])

   return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-zinc-900 to-black py-20">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat opacity-5" />

        <div className="relative mx-auto max-w-7xl px-4">
          <motion.button
            onClick={() => router.push("/")}
            className="mb-8 flex items-center text-sm text-zinc-400 transition-colors hover:text-[#FF8000]"
            initial={{ opacity: 0, x: -20 }}
            animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Portfolio
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            <h1 className="mb-4 text-5xl font-bold md:text-6xl lg:text-7xl">
              Train of <span className="text-[#FF8000]">Thoughts</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-zinc-400 md:text-xl">
              A collection of insights, experiences, and learnings from my journey in technology and design.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="flex">
          {/* Mobile Filter Toggle */}
          <motion.button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="fixed left-4 top-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900/80 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {sidebarOpen ? <X size={20} className="text-[#FF8000]" /> : <Menu size={20} className="text-[#FF8000]" />}
          </motion.button>

          {/* Sidebar */}
          <motion.aside
            className={`fixed left-0 top-0 z-40 h-full w-80 bg-zinc-900/95 backdrop-blur-md transition-transform lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:translate-x-0 lg:bg-zinc-900/50 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            initial={{ x: -320 }}
            animate={isLoaded ? { x: sidebarOpen || window.innerWidth >= 1024 ? 0 : -320 } : { x: -320 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex h-full flex-col p-6 pt-20 lg:pt-6">
              {/* Filter Header */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Filter size={20} className="text-[#FF8000]" />
                  <h3 className="text-lg font-semibold">Categories</h3>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-[#FF8000] to-transparent" />
              </motion.div>

              {/* Category List */}
              <div className="flex-1 space-y-2">
                {categories.map((category, index) => (
                  <motion.button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category)
                      setSidebarOpen(false) // Close sidebar on mobile after selection
                    }}
                    className={`group relative w-full rounded-lg px-4 py-3 text-left transition-all ${
                      selectedCategory === category ? "text-black" : "text-zinc-400 hover:text-white"
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Active background */}
                    {selectedCategory === category && (
                      <motion.div
                        className="absolute inset-0 rounded-lg bg-[#FF8000]"
                        layoutId="activeCategorySidebar"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}

                    {/* Hover background */}
                    {selectedCategory !== category && (
                      <motion.div
                        className="absolute inset-0 rounded-lg bg-zinc-800/30 opacity-0"
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}

                    <div className="relative z-10 flex items-center justify-between">
                      <span className="font-medium">{category}</span>
                      <span className="text-xs opacity-60">
                        {category === "All"
                          ? sliderblogPosts.length
                          : sliderblogPosts.filter((post) => post.category === category).length}
                      </span>
                    </div>

                    {/* Futuristic accent line */}
                    {selectedCategory === category && (
                      <motion.div
                        className="absolute left-0 top-0 h-full w-1 bg-black"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Results counter */}
              <motion.div
                className="mt-6 rounded-lg bg-zinc-800/50 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.8 }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#FF8000]">{filteredPosts.length}</div>
                  <div className="text-xs text-zinc-400">
                    {filteredPosts.length === 1 ? "article" : "articles"}
                    {selectedCategory !== "All" && (
                      <div className="mt-1">
                        in <span className="text-[#FF8000]">{selectedCategory}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.aside>

          {/* Overlay for mobile */}
          {sidebarOpen && (
            <motion.div
              className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <main className="flex-1 px-4 py-16 lg:pl-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory}
                className="space-y-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {filteredPosts.map((post, index) => (
                  <motion.article
                    key={post.slug}
                    className="group cursor-pointer overflow-hidden rounded-2xl bg-zinc-900/50 backdrop-blur-sm transition-all hover:bg-zinc-900/70"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => router.push(`/blog/${post.slug}`)}
                    layout
                  >
                    <div className="flex flex-col lg:flex-row">
                      {/* Content */}
                      <div className="flex-1 p-8 lg:p-12">
                        <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-zinc-400">
                          <span className="rounded-full bg-[#FF8000]/10 px-3 py-1 text-[#FF8000]">{post.category}</span>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center">
                              <Calendar size={14} className="mr-1" />
                              {post.date}
                            </div>
                            <div className="flex items-center">
                              <Clock size={14} className="mr-1" />
                              {post.readTime}
                            </div>
                          </div>
                        </div>

                        <h2 className="mb-4 text-2xl font-bold transition-colors group-hover:text-[#FF8000] md:text-3xl lg:text-4xl">
                          {post.title}
                        </h2>

                        <p className="mb-6 text-zinc-300 md:text-lg">{post.excerpt}</p>

                        <div className="flex flex-wrap gap-2">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400">
                              {tag}
                            </span>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400">
                              +{post.tags.length - 3} more
                            </span>
                          )}
                        </div>

                        <div className="mt-6 flex items-center text-sm font-medium text-[#FF8000] opacity-0 transition-opacity group-hover:opacity-100">
                          Read Article
                          <svg
                            className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Image */}
                      <div className="aspect-video lg:aspect-square lg:w-80">
                        <div
                          className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                          style={{ backgroundImage: `url(${post.heroImage})` }}
                        />
                      </div>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* No results message */}
            {filteredPosts.length === 0 && (
              <motion.div
                className="py-16 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="mx-auto max-w-md">
                  <div className="mb-4 text-4xl">🔍</div>
                  <h3 className="mb-2 text-xl font-bold">No articles found</h3>
                  <p className="text-zinc-400">
                    No articles match the selected category. Try selecting a different category.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Load More Button (for future expansion) */}
            <motion.div
              className="mt-16 text-center"
              initial={{ opacity: 0 }}
              animate={isLoaded ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <button className="rounded-full border border-zinc-700 px-8 py-3 text-sm font-medium transition-all hover:border-[#FF8000] hover:text-[#FF8000]">
                More thoughts coming soon...
              </button>
            </motion.div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  )
}
