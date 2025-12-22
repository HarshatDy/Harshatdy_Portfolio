"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [cursorText, setCursorText] = useState("")
  const [cursorVariant, setCursorVariant] = useState("default")
  const [isHovering, setIsHovering] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const pathname = usePathname()
  
  // Check if we're on train-of-thoughts pages
  const isTrainOfThoughts = pathname?.startsWith("/train-of-thoughts")
  const isBlogPost = pathname?.match(/^\/train-of-thoughts\/[^/]+$/)

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      })
    }

    const handleSectionChange = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight

      if (isBlogPost) {
        // Custom text for individual blog post pages
        if (scrollY < windowHeight * 0.3) {
          setCursorText("SCROLL TO READ ")
          setCursorVariant("text")
        } else if (scrollY < windowHeight * 1.5) {
          setCursorText("CONTINUE READING ")
          setCursorVariant("text")
        } else {
          setCursorText("READ RELATED POSTS ")
          setCursorVariant("text")
        }
      } else if (isTrainOfThoughts) {
        // Custom text for train-of-thoughts listing page
        if (scrollY < windowHeight * 0.5) {
          setCursorText("EXPLORE THOUGHTS ")
          setCursorVariant("text")
        } else {
          setCursorText("READ ARTICLES ")
          setCursorVariant("text")
        }
      } else {
        // Original portfolio page text
        if (scrollY < windowHeight) {
          setCursorText("SCROLL DOWN ")
          setCursorVariant("text")
        } else if (scrollY < windowHeight * 2) {
          setCursorText("CLICK ON IT ")
          setCursorVariant("text")
        } else {
          setCursorText("CHECKOUT MY GIT ")
          setCursorVariant("text")
        }
      }
    }

    // Simple hover handlers
    const handleMouseEnterCard = () => {
      setIsHovering(true)
      if (isTrainOfThoughts) {
        setCursorText("READ ARTICLE ")
      } else {
        setCursorText("VIEW DETAILS ")
      }
    }
    
    const handleMouseLeaveCard = () => {
      setIsHovering(false)
      handleSectionChange()
    }

    // Card selections - different selectors for train-of-thoughts
    const timelineCards = document.querySelectorAll('.timeline-card')
    const portfolioCards = document.querySelectorAll('.portfolio-card')
    const blogPostCards = document.querySelectorAll('article[class*="cursor-pointer"]')
    const relatedPostCards = document.querySelectorAll('[class*="related-post"]')
    const categoryButtons = document.querySelectorAll('button[class*="rounded-lg"]')
    
    // Event listeners for portfolio cards
    timelineCards.forEach(card => {
      card.addEventListener('mouseenter', handleMouseEnterCard)
      card.addEventListener('mouseleave', handleMouseLeaveCard)
    })
    
    portfolioCards.forEach(card => {
      card.addEventListener('mouseenter', handleMouseEnterCard)
      card.addEventListener('mouseleave', handleMouseLeaveCard)
    })

    // Event listeners for blog post cards (train-of-thoughts listing)
    blogPostCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        setIsHovering(true)
        setCursorText("READ ARTICLE ")
      })
      card.addEventListener('mouseleave', handleMouseLeaveCard)
    })

    // Event listeners for related posts (individual blog post page)
    relatedPostCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        setIsHovering(true)
        setCursorText("READ RELATED ")
      })
      card.addEventListener('mouseleave', handleMouseLeaveCard)
    })

    // Event listeners for category buttons
    if (isTrainOfThoughts && !isBlogPost) {
      categoryButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
          setCursorText("FILTER BY ")
        })
        button.addEventListener('mouseleave', handleMouseLeaveCard)
      })
    }

    // Add event listener for modal state
    const handleModalOpen = () => {
      setIsModalOpen(true)
      setCursorText("CLOSE")
    }

    const handleModalClose = () => {
      setIsModalOpen(false)
      handleSectionChange()
    }

    window.addEventListener("modalOpen", handleModalOpen as EventListener)
    window.addEventListener("modalClose", handleModalClose as EventListener)

    window.addEventListener("mousemove", mouseMove)
    window.addEventListener("scroll", handleSectionChange)

    handleSectionChange()

    return () => {
      window.removeEventListener("mousemove", mouseMove)
      window.removeEventListener("scroll", handleSectionChange)
      
      timelineCards.forEach(card => {
        card.removeEventListener('mouseenter', handleMouseEnterCard)
        card.removeEventListener('mouseleave', handleMouseLeaveCard)
      })
      
      portfolioCards.forEach(card => {
        card.removeEventListener('mouseenter', handleMouseEnterCard)
        card.removeEventListener('mouseleave', handleMouseLeaveCard)
      })

      blogPostCards.forEach(card => {
        card.removeEventListener('mouseenter', () => {
          setIsHovering(true)
          setCursorText("READ ARTICLE ")
        })
        card.removeEventListener('mouseleave', handleMouseLeaveCard)
      })

      relatedPostCards.forEach(card => {
        card.removeEventListener('mouseenter', () => {
          setIsHovering(true)
          setCursorText("READ RELATED ")
        })
        card.removeEventListener('mouseleave', handleMouseLeaveCard)
      })

      categoryButtons.forEach(button => {
        button.removeEventListener('mouseenter', () => {
          setCursorText("FILTER BY ")
        })
        button.removeEventListener('mouseleave', handleMouseLeaveCard)
      })

      window.removeEventListener("modalOpen", handleModalOpen as EventListener)
      window.removeEventListener("modalClose", handleModalClose as EventListener)
    }
  }, [isTrainOfThoughts, isBlogPost])

  // Function to create circular text with each letter facing the center
  const createCircularText = (text: string) => {
    return text.split("").map((char, i) => {
      // Calculate the angle for this character
      const angle = i * (2 * Math.PI / text.length);
      
      // Calculate position using trig functions (30px radius)
      const x = Math.cos(angle) * 30;
      const y = Math.sin(angle) * 30;
      
      // Calculate rotation in degrees (each letter faces center)
      // Convert angle to degrees and add 90 degrees to make letters face inward
      const rotation = (angle * (180 / Math.PI)) + 90;
      
      return (
        <motion.span
          key={i}
          className="absolute font-bold text-xs tracking-wide text-white"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            x: x,
            y: y,
            rotate: rotation,
          }}
          transition={{ duration: 0.2, delay: i * 0.02 }}
          style={{ 
            transformOrigin: "center",
            textShadow: "0 0 2px rgba(0, 0, 0, 0.8)"
          }}
        >
          {char}
        </motion.span>
      );
    });
  };

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 flex items-center justify-center rounded-full bg-[#FF8000]"
        style={{ zIndex: isModalOpen ? 1000 : 50 }}
        animate={{
          x: mousePosition.x - 10,
          y: mousePosition.y - 10,
          height: 20,
          width: 20,
        }}
        transition={{ 
          type: "spring", 
          stiffness: 500, 
          damping: 28,
          mass: 0.8
        }}
      />

      {/* Blur backdrop for text */}
      {cursorVariant === "text" && (
        <motion.div
          className="pointer-events-none fixed left-0 top-0 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-sm"
          style={{ zIndex: isModalOpen ? 500 : 39 }}
          animate={{
            x: mousePosition.x - 40,
            y: mousePosition.y - 40,
            height: 80,
            width: 80,
          }}
          transition={{
            x: { type: "spring", stiffness: 800, damping: 30 },
            y: { type: "spring", stiffness: 800, damping: 30 },
          }}
        />
      )}

      {/* Rotating text */}
      {cursorVariant === "text" && (
        <motion.div
          className="pointer-events-none fixed left-0 top-0 flex h-0 w-0 items-center justify-center"
          style={{ zIndex: isModalOpen ? 999 : 40 }}
          animate={{
            x: mousePosition.x,
            y: mousePosition.y,
            rotate: [0, 360],
          }}
          transition={{
            rotate: {
              repeat: Infinity,
              duration: 15,
              ease: "linear",
            },
            x: { type: "spring", stiffness: 800, damping: 30 },
            y: { type: "spring", stiffness: 800, damping: 30 },
          }}
        >
          {createCircularText(cursorText)}
        </motion.div>
      )}
    </>
  )
}
