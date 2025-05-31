"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Calendar, Clock, User } from "lucide-react"
import Footer from "@/components/footer"
import { BlogPost as BlogPostType } from "@/app/data/blogPosts"

interface BlogPostProps {
  post: BlogPostType;
}

export default function BlogPost({ post }: BlogPostProps) {
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoaded(true)
    }, 500)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white font-['Roboto_Mono']">
      {/* Hero Section */}
      <div className="relative h-[50vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${post.heroImage})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full p-8">
          <motion.button
            onClick={() => router.push("/")}
            className="mb-6 flex items-center text-sm text-zinc-400 transition-colors hover:text-[#FF8000] font-light"
            initial={{ opacity: 0, x: -20 }}
            animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Portfolio
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="mb-2 text-sm font-medium text-[#FF8000] font-medium">{post.category}</div>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl font-bold">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400 font-light">
              <div className="flex items-center">
                <User size={14} className="mr-1" />
                {post.author}
              </div>
              <div className="flex items-center">
                <Calendar size={14} className="mr-1" />
                {post.date}
              </div>
              <div className="flex items-center">
                <Clock size={14} className="mr-1" />
                {post.readTime}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* Tags */}
        <motion.div
          className="mb-8 flex flex-wrap gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {post.tags.map((tag: string) => (
            <span key={tag} className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300 font-medium">
              {tag}
            </span>
          ))}
        </motion.div>

        {/* Article Content */}
        <motion.article
          className="prose prose-invert max-w-none prose-headings:text-[#FF8000] prose-a:text-[#FF8000] prose-code:bg-zinc-800 prose-code:p-1"
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {post.content &&
            post.content.map((block: any, index: number) => {
              switch (block.type) {
                case "paragraph":
                  return (
                    <motion.p
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                      className="mb-6 leading-relaxed text-zinc-300 font-normal"
                    >
                      {block.content}
                    </motion.p>
                  )
                case "heading":
                  return (
                    <motion.h2
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                      className="mb-4 mt-8 text-2xl font-bold text-[#FF8000] font-bold"
                    >
                      {block.content}
                    </motion.h2>
                  )
                case "image":
                  return (
                    <motion.figure
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                      className="my-8"
                    >
                      <img
                        src={block.url || "/placeholder.svg"}
                        alt={block.caption || ""}
                        className="w-full rounded-lg"
                      />
                      {block.caption && (
                        <figcaption className="mt-2 text-center text-sm text-zinc-500 font-light">{block.caption}</figcaption>
                      )}
                    </motion.figure>
                  )
                case "code":
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                      className="my-6"
                    >
                      <pre className="rounded-lg bg-zinc-900 p-4 text-sm font-mono">
                        <code className="language-javascript">{block.content}</code>
                      </pre>
                    </motion.div>
                  )
                default:
                  return null
              }
            })}

          {/* If no content is provided, show the excerpt */}
          {(!post.content || post.content.length === 0) && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-lg text-zinc-300 font-normal"
            >
              {post.excerpt}
            </motion.p>
          )}
        </motion.article>

        {/* Divider */}
        <div className="my-12 h-px w-full bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />

        {/* Author Section */}
        <motion.div
          className="rounded-xl bg-zinc-900 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex items-center">
            <div className="mr-4 h-16 w-16 overflow-hidden rounded-full bg-zinc-800">
              <img src="/placeholder.svg?height=64&width=64" alt="Harshat Dy" className="h-full w-full object-cover" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-bold">About the Author</h3>
              <p className="text-sm text-zinc-400 font-light">
                Harshat Dy is a Software Engineer, 5G Expert, Web Designer, and Design Expert with over 10 years of
                experience in the tech industry.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
} 