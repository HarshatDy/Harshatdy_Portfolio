"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [cursorText, setCursorText] = useState("")
  const [cursorVariant, setCursorVariant] = useState("default")

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

      // Determine which section the user is viewing based on scroll position
      if (scrollY < windowHeight) {
        setCursorText("Scroll Down")
        setCursorVariant("text")
      } else if (scrollY < windowHeight * 2) {
        setCursorText("Click on this")
        setCursorVariant("text")
      } else {
        setCursorText("Hover over the grid")
        setCursorVariant("text")
      }
    }

    window.addEventListener("mousemove", mouseMove)
    window.addEventListener("scroll", handleSectionChange)

    // Initial call to set the correct text
    handleSectionChange()

    return () => {
      window.removeEventListener("mousemove", mouseMove)
      window.removeEventListener("scroll", handleSectionChange)
    }
  }, [])

  const variants = {
    default: {
      x: mousePosition.x - 8,
      y: mousePosition.y - 8,
      height: 16,
      width: 16,
    },
    text: {
      x: mousePosition.x - 8,
      y: mousePosition.y - 8,
      height: 16,
      width: 16,
    },
  }

  // Create an array of letters for the circular text
  const getCircularText = (text: string) => {
    return text.split("").map((char, i) => (
      <motion.span
        key={i}
        className="absolute text-xs font-light text-white"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          x: Math.cos(i * ((2 * Math.PI) / text.length)) * 30,
          y: Math.sin(i * ((2 * Math.PI) / text.length)) * 30,
        }}
        transition={{
          duration: 0.1,
          delay: i * 0.05,
        }}
        style={{
          transformOrigin: "center",
        }}
      >
        {char}
      </motion.span>
    ))
  }

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-50 flex items-center justify-center rounded-full bg-[#FF8000]"
        variants={variants}
        animate={cursorVariant}
        transition={{ type: "spring", stiffness: 1000, damping: 35 }}
      />

      {cursorVariant === "text" && (
        <motion.div
          className="pointer-events-none fixed left-0 top-0 z-40 flex h-0 w-0 items-center justify-center"
          animate={{
            x: mousePosition.x,
            y: mousePosition.y,
            rotate: [0, 360],
          }}
          transition={{
            rotate: {
              repeat: Number.POSITIVE_INFINITY,
              duration: 10,
              ease: "linear",
            },
            x: { type: "spring", stiffness: 1000, damping: 35 },
            y: { type: "spring", stiffness: 1000, damping: 35 },
          }}
        >
          {getCircularText(cursorText)}
        </motion.div>
      )}

      <style jsx global>{`
        body {
          cursor: none;
        }
      `}</style>
    </>
  )
}
