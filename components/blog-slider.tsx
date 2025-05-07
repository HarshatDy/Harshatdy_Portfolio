"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { sliderblogPosts } from "@/app/data/blogPosts"


// useEffect(() => )

// interface BlogPost {
//   slug: string
//   title: string
//   category: string
//   date: string
//   excerpt: string
//   heroImage: string
// }

// // Sample blog data - same as in the blog page
// const blogPosts: BlogPost[] = [
//   {
//     slug: "network-dashboard",
//     title: "Network Dashboard: Real-time Monitoring Reimagined",
//     category: "Web Application",
//     date: "April 14, 2025",
//     excerpt: "How I built a real-time network monitoring dashboard with interactive visualizations.",
//     heroImage: "/placeholder.svg?height=600&width=1200",
//   },
//   {
//     slug: "harshatdy-proof-of-concepts",
//     title: "Mobile App UI: Creating Intuitive User Experiences",
//     category: "UI/UX Design",
//     date: "April 10, 2025",
//     excerpt: "The process behind designing a modern mobile application interface with intuitive navigation.",
//     heroImage: "/placeholder.svg?height=600&width=1200",
//   },
// ]

export default function BlogSlider() {
  const router = useRouter()
  const sliderRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)

  const checkScrollability = () => {
    if (!sliderRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10) // 10px buffer
  }

  useEffect(() => {
    const slider = sliderRef.current
    if (slider) {
      slider.addEventListener("scroll", checkScrollability)
      checkScrollability()
      return () => slider.removeEventListener("scroll", checkScrollability)
    }
  }, [])

  const scrollLeft = () => {
    if (!sliderRef.current) return
    sliderRef.current.scrollBy({ left: -350, behavior: "smooth" })
    setActiveIndex((prev) => Math.max(prev - 1, 0))
  }

  const scrollRight = () => {
    if (!sliderRef.current) return
    sliderRef.current.scrollBy({ left: 350, behavior: "smooth" })
    setActiveIndex((prev) => Math.min(prev + 1, sliderblogPosts.length - 1))
  }

  return (
    <div className="relative w-full">
      <h3 className="mb-4 text-center text-sm font-medium uppercase tracking-wider text-[#FF8000]">Latest Articles</h3>

      <div className="relative">
        {/* Left scroll button */}
        <motion.button
          onClick={scrollLeft}
          className="absolute -left-4 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/80 text-white backdrop-blur-sm transition-all hover:bg-[#FF8000]/80 disabled:opacity-0 md:-left-6 md:h-10 md:w-10"
          disabled={!canScrollLeft}
          initial={{ opacity: 0 }}
          animate={{ opacity: canScrollLeft ? 1 : 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft size={20} />
        </motion.button>

        {/* Slider container */}
        <div
          ref={sliderRef}
          className="hide-scrollbar flex w-full snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4"
        >
          {sliderblogPosts.map((post, index) => (
            <motion.div
              key={post.slug}
              className="relative min-w-[280px] snap-start md:min-w-[320px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
            >
              <div
                className="group h-full cursor-pointer overflow-hidden rounded-xl bg-zinc-900"
                onClick={() => router.push(`/blog/${post.slug}`)}
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${post.heroImage})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                  <div className="absolute bottom-0 left-0 w-full p-3">
                    <div className="mb-1 text-xs font-medium text-[#FF8000]">{post.category}</div>
                    <h4 className="line-clamp-1 text-sm font-bold text-white md:text-base">{post.title}</h4>
                  </div>
                </div>

                <div className="p-3">
                  <p className="text-xs text-zinc-400 line-clamp-1 md:text-sm">{post.excerpt}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-zinc-500">{post.date}</span>
                    <span className="text-xs font-medium text-[#FF8000] group-hover:underline">Read More</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right scroll button */}
        <motion.button
          onClick={scrollRight}
          className="absolute -right-4 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/80 text-white backdrop-blur-sm transition-all hover:bg-[#FF8000]/80 disabled:opacity-0 md:-right-6 md:h-10 md:w-10"
          disabled={!canScrollRight}
          initial={{ opacity: 0 }}
          animate={{ opacity: canScrollRight ? 1 : 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight size={20} />
        </motion.button>
      </div>

      {/* Pagination dots */}
      <div className="mt-4 flex justify-center gap-1">
        {sliderblogPosts.map((_, index) => (
          <motion.button
            key={index}
            className={`h-1.5 rounded-full transition-all ${
              index === activeIndex ? "w-6 bg-[#FF8000]" : "w-1.5 bg-zinc-700"
            }`}
            onClick={() => {
              if (!sliderRef.current) return
              const scrollAmount = index * 350
              sliderRef.current.scrollTo({ left: scrollAmount, behavior: "smooth" })
              setActiveIndex(index)
            }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </div>
  )
}
