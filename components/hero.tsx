"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { TypeAnimation } from "react-type-animation"
// import BlogSlider from "./blog-slider"
import { FileDown } from "lucide-react"

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const name = "Harshat Dy"

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 -z-10">
        <div className="relative h-full w-full">
          <motion.div
            className="absolute inset-0 opacity-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: 2 }}
          >
            <div className="grid h-full w-full grid-cols-[repeat(20,1fr)] grid-rows-[repeat(20,1fr)]">
              {Array.from({ length: 400 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="border-[0.5px] border-[#FF8000]/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.001, duration: 2 }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* McLaren-inspired decorative element */}
      <motion.div
        className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-[#FF8000]/5 to-transparent"
        initial={{ x: -100, opacity: 0 }}
        animate={isLoaded ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      />

      <div className="z-10 flex w-full flex-col items-center pt-24 md:pt-32 lg:pt-40">
        <div className="mb-6 flex justify-center">
          {/* CV Download Link with # symbol */}
          <motion.div
            className="relative mr-4 flex items-end"
            initial={{ y: 100, opacity: 0 }}
            animate={isLoaded ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 15,
            }}
          >
            <a
              href="/cv.pdf"
              download="Harshat_Dy_CV.pdf"
              className="group relative flex items-center text-7xl font-bold text-[#FF8000] md:text-8xl lg:text-9xl"
              aria-label="Download CV"
            >
              #
              <motion.span
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF8000] text-xs text-black opacity-0 transition-opacity group-hover:opacity-100 md:h-6 md:w-6"
                whileHover={{ scale: 1.2 }}
              >
                <FileDown size={12} />
              </motion.span>
            </a>

            {/* Permanent CV label */}
            <motion.div
              className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium text-white"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              <em>CV</em>
            </motion.div>
          </motion.div>

          {/* Name */}
          {name.split("").map((letter, index) => (
            <motion.div
              key={index}
              initial={{ y: 100, opacity: 0 }}
              animate={isLoaded ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 15,
                delay: 0.1 * index,
              }}
              className="relative"
            >
              <motion.span
                className="relative inline-block text-7xl font-bold md:text-8xl lg:text-9xl"
                whileHover={{
                  color: "#FF8000",
                  transition: { duration: 0.2 },
                }}
              >
                {letter === " " ? "\u00A0" : letter}
                <motion.span
                  className="absolute bottom-0 left-0 h-1 w-0 bg-[#FF8000]"
                  whileHover={{
                    width: "100%",
                    transition: { duration: 0.3 },
                  }}
                />
              </motion.span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1.5 }}
          className="mb-16 text-xl font-light md:text-2xl lg:text-3xl"
        >
          <TypeAnimation
            sequence={["Software Engineer", 1000, "5G Expert", 1000, "Web Designer", 1000, "Design Expert", 1000]}
            wrapper="span"
            speed={50}
            repeat={Number.POSITIVE_INFINITY}
            className="text-[#FF8000]"
          />
        </motion.div>

        {/* Blog Slider Section */}
        <motion.div
          className="w-full max-w-6xl px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 2 }}
        >
          {/* <BlogSlider /> */}
        </motion.div>
      </div>

      <BackgroundParticles />
    </section>
  )
}

function BackgroundParticles() {
  return (
    <div className="absolute inset-0 -z-10">
      {Array.from({ length: 80 }).map((_, index) => (
        <motion.div
          key={index}
          className="absolute h-1 w-1 rounded-full bg-[#FF8000]/20"
          initial={{
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            x: [Math.random() * 100 + "%", Math.random() * 100 + "%", Math.random() * 100 + "%"],
            y: [Math.random() * 100 + "%", Math.random() * 100 + "%", Math.random() * 100 + "%"],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}
