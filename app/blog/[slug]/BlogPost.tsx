"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Calendar, Clock, User } from "lucide-react"
import Footer from "@/components/footer"

// Sample blog data - in a real app, this would come from a database or CMS
const blogPosts = [
  {
    slug: "network-dashboard",
    title: "Network Dashboard: Real-time Monitoring Reimagined",
    category: "Web Application",
    author: "Harshat Dy",
    date: "April 14, 2025",
    readTime: "8 min read",
    tags: ["Dashboard", "Real-time", "Monitoring", "Web Development"],
    heroImage: "/placeholder.svg?height=600&width=1200",
    excerpt: "How I built a real-time network monitoring dashboard with interactive visualizations.",
    content: [
      {
        type: "paragraph",
        content:
          "In today's interconnected world, network monitoring has become more critical than ever. Organizations rely on robust networks to maintain operations, and any downtime can result in significant financial losses and productivity setbacks. This is where real-time network monitoring dashboards come into play, providing immediate insights into network performance and potential issues.",
      },
      {
        type: "heading",
        content: "The Challenge",
      },
      {
        type: "paragraph",
        content:
          "When I was approached to design a network monitoring dashboard, the client had a specific set of requirements: the dashboard needed to be intuitive, provide real-time data, and offer actionable insights at a glance. The existing solution was outdated, with a clunky interface that made it difficult for network administrators to quickly identify and address issues.",
      },
      {
        type: "image",
        url: "/placeholder.svg?height=400&width=800",
        caption: "Early wireframe of the dashboard layout",
      },
      {
        type: "heading",
        content: "The Approach",
      },
      {
        type: "paragraph",
        content:
          "I started by conducting extensive user research, interviewing network administrators to understand their workflows and pain points. This research revealed that administrators needed quick access to critical metrics, the ability to drill down into specific issues, and customizable views based on their specific responsibilities.",
      },
      {
        type: "paragraph",
        content:
          "With these insights, I designed a dashboard that prioritized the most important metrics, used color coding to indicate status (green for normal, yellow for warning, red for critical), and implemented interactive elements that allowed administrators to explore data in more detail when needed.",
      },
      {
        type: "code",
        language: "javascript",
        content: `// Sample code for real-time data fetching
const fetchNetworkData = async () => {
  try {
    const response = await fetch('/api/network-status');
    const data = await response.json();
    
    // Update dashboard with new data
    updateDashboardMetrics(data);
    
    // Check for critical alerts
    if (data.alerts.filter(alert => alert.severity === 'critical').length > 0) {
      triggerAlertNotification();
    }
  } catch (error) {
    console.error('Failed to fetch network data:', error);
  }
};

// Set up polling interval
setInterval(fetchNetworkData, 5000); // Fetch every 5 seconds`,
      },
      {
        type: "heading",
        content: "The Implementation",
      },
      {
        type: "paragraph",
        content:
          "The dashboard was built using React for the frontend, with a Node.js backend that connected to various network monitoring tools via APIs. For real-time updates, I implemented WebSockets to push data to the client as soon as it was available, rather than relying on polling.",
      },
      {
        type: "paragraph",
        content:
          "One of the key features was a customizable widget system that allowed administrators to arrange their dashboard based on their specific needs. This included widgets for network traffic, server status, error rates, and bandwidth utilization.",
      },
      {
        type: "image",
        url: "/placeholder.svg?height=400&width=800",
        caption: "Final dashboard implementation with custom widgets",
      },
      {
        type: "heading",
        content: "The Results",
      },
      {
        type: "paragraph",
        content:
          "The new dashboard was met with overwhelmingly positive feedback. Network administrators reported that they were able to identify and address issues much more quickly, leading to a 30% reduction in network downtime. The customizable nature of the dashboard also meant that different team members could focus on the metrics most relevant to their roles.",
      },
      {
        type: "paragraph",
        content:
          "The client was so pleased with the results that they commissioned additional dashboards for other aspects of their operations, including server performance and application monitoring.",
      },
      {
        type: "heading",
        content: "Conclusion",
      },
      {
        type: "paragraph",
        content:
          "This project reinforced the importance of user-centered design in technical applications. By understanding the specific needs and workflows of network administrators, I was able to create a solution that not only looked good but also significantly improved their ability to do their jobs effectively.",
      },
      {
        type: "paragraph",
        content:
          "If you're interested in learning more about this project or discussing how a similar approach could benefit your organization, please don't hesitate to reach out.",
      },
    ],
  },
  {
    slug: "mobile-app-ui",
    title: "Mobile App UI: Creating Intuitive User Experiences",
    category: "UI/UX Design",
    author: "Harshat Dy",
    date: "April 10, 2025",
    readTime: "6 min read",
    tags: ["Mobile", "UI/UX", "Design", "User Experience"],
    heroImage: "/placeholder.svg?height=600&width=1200",
    excerpt: "The process behind designing a modern mobile application interface with intuitive navigation.",
    content: [
      {
        type: "paragraph",
        content:
          "Mobile app design presents unique challenges and opportunities. With limited screen real estate and users who expect intuitive, seamless experiences, creating effective mobile interfaces requires a thoughtful approach to design.",
      },
      {
        type: "heading",
        content: "Understanding User Needs",
      },
      {
        type: "paragraph",
        content:
          "Before diving into design, I conducted extensive user research to understand the target audience's needs, preferences, and pain points. This involved user interviews, competitive analysis, and usability testing of existing solutions.",
      },
      {
        type: "paragraph",
        content:
          "The insights gathered from this research phase informed every aspect of the design process, ensuring that the final product would truly meet user needs rather than just looking good.",
      },
    ],
  },
  {
    slug: "5g-implementation",
    title: "Enterprise 5G Implementation: A Case Study",
    category: "Telecommunications",
    author: "Harshat Dy",
    date: "April 5, 2025",
    readTime: "10 min read",
    tags: ["5G", "Enterprise", "Telecommunications", "Networking"],
    heroImage: "/placeholder.svg?height=600&width=1200",
    excerpt: "How I led the implementation of a 5G network for a major corporation.",
    content: [
      {
        type: "paragraph",
        content:
          "5G technology represents a significant leap forward in telecommunications, offering unprecedented speed, reliability, and capacity. For enterprises, 5G opens up new possibilities for IoT deployments, real-time data processing, and enhanced mobile experiences.",
      },
      {
        type: "heading",
        content: "Project Overview",
      },
      {
        type: "paragraph",
        content:
          "I was tasked with leading the implementation of a private 5G network for a Fortune 500 manufacturing company. The goal was to replace their existing Wi-Fi infrastructure with a more robust, secure, and high-performance 5G network to support their Industry 4.0 initiatives.",
      },
    ],
  },
  {
    slug: "e-commerce-platform",
    title: "Building a Modern E-commerce Platform",
    category: "Web Development",
    author: "Harshat Dy",
    date: "March 28, 2025",
    readTime: "7 min read",
    tags: ["E-commerce", "Web Development", "UX", "Performance"],
    heroImage: "/placeholder.svg?height=600&width=1200",
    excerpt: "The development process behind a full-stack e-commerce solution with advanced features.",
    content: [],
  },
  {
    slug: "iot-control-system",
    title: "IoT Control System: Connecting the Physical World",
    category: "Software Engineering",
    author: "Harshat Dy",
    date: "March 20, 2025",
    readTime: "9 min read",
    tags: ["IoT", "Control Systems", "Software Engineering", "Real-time"],
    heroImage: "/placeholder.svg?height=600&width=1200",
    excerpt: "Designing and implementing a centralized control system for IoT devices.",
    content: [],
  },
  {
    slug: "analytics-dashboard",
    title: "Data Visualization: Analytics Dashboard Design",
    category: "Data Visualization",
    author: "Harshat Dy",
    date: "March 15, 2025",
    readTime: "8 min read",
    tags: ["Analytics", "Dashboard", "Data Visualization", "UX"],
    heroImage: "/placeholder.svg?height=600&width=1200",
    excerpt: "Creating a comprehensive analytics dashboard with customizable reports and insights.",
    content: [],
  },
]

export default function BlogPost() {
  const router = useRouter()
  const { slug } = useParams()
  const [post, setPost] = useState<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Find the post that matches the slug
    const foundPost = blogPosts.find((post) => post.slug === slug)
    setPost(foundPost)

    // Simulate loading
    setTimeout(() => {
      setIsLoaded(true)
    }, 500)
  }, [slug])

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Post not found</h1>
          <button
            onClick={() => router.push("/")}
            className="mt-4 rounded-md bg-[#FF8000] px-4 py-2 text-white transition-colors hover:bg-[#FF8000]/80"
          >
            Return Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-[50vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${post.heroImage})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full p-8">
          <motion.button
            onClick={() => router.push("/")}
            className="mb-6 flex items-center text-sm text-zinc-400 transition-colors hover:text-[#FF8000]"
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
            <div className="mb-2 text-sm font-medium text-[#FF8000]">{post.category}</div>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
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
            <span key={tag} className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
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
                      className="mb-6 leading-relaxed text-zinc-300"
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
                      className="mb-4 mt-8 text-2xl font-bold text-[#FF8000]"
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
                        <figcaption className="mt-2 text-center text-sm text-zinc-500">{block.caption}</figcaption>
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
                      <pre className="rounded-lg bg-zinc-900 p-4 text-sm">
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
              className="text-lg text-zinc-300"
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
              <h3 className="text-lg font-bold">About the Author</h3>
              <p className="text-sm text-zinc-400">
                Harshat Dy is a Software Engineer, 5G Expert, Web Designer, and Design Expert with over 10 years of
                experience in the tech industry.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Related Posts */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <h3 className="mb-6 text-2xl font-bold">Related Posts</h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts
              .filter((relatedPost) => relatedPost.slug !== post.slug)
              .slice(0, 3)
              .map((relatedPost) => (
                <div
                  key={relatedPost.slug}
                  className="cursor-pointer overflow-hidden rounded-lg bg-zinc-900 transition-transform hover:scale-105"
                  onClick={() => {
                    router.push(`/blog/${relatedPost.slug}`)
                    window.scrollTo(0, 0)
                  }}
                >
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={relatedPost.heroImage || "/placeholder.svg"}
                      alt={relatedPost.title}
                      className="h-full w-full object-cover transition-transform hover:scale-110"
                    />
                  </div>
                  <div className="p-4">
                    <div className="mb-1 text-xs font-medium text-[#FF8000]">{relatedPost.category}</div>
                    <h4 className="mb-2 text-lg font-bold">{relatedPost.title}</h4>
                    <p className="text-sm text-zinc-400 line-clamp-2">{relatedPost.excerpt}</p>
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
} 