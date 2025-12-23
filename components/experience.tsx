"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

interface ExperienceItem {
  id: number
  jobTitle: string
  company: string
  startDate: string
  endDate: string
  description: string
  skills?: string[]
}

const experiences: ExperienceItem[] = [
  {
    id: 1,
    jobTitle: "Senior Software Engineer",
    company: "Tech Innovations Inc",
    startDate: "Jan 2022",
    endDate: "Present",
    description:
      "Led development of scalable web applications using Next.js and TypeScript. Mentored junior developers and established best practices for the team.",
    skills: ["Next.js", "TypeScript", "React", "Node.js"],
  },
  {
    id: 2,
    jobTitle: "5G Network Engineer",
    company: "Telecom Solutions Ltd",
    startDate: "Jun 2020",
    endDate: "Dec 2021",
    description:
      "Designed and implemented 5G network infrastructure solutions. Optimized network performance and reduced latency by 40%.",
    skills: ["5G", "Network Architecture", "System Design"],
  },
  {
    id: 3,
    jobTitle: "Full Stack Web Developer",
    company: "Digital Creative Agency",
    startDate: "Mar 2019",
    endDate: "May 2020",
    description:
      "Developed responsive web applications and designed user interfaces. Collaborated with UX teams to create intuitive digital experiences.",
    skills: ["React", "Node.js", "UI/UX", "PostgreSQL"],
  },
  {
    id: 4,
    jobTitle: "Junior Developer",
    company: "StartUp Hub",
    startDate: "Sep 2018",
    endDate: "Feb 2019",
    description:
      "Built frontend components and implemented features for web applications. Learned best practices in software development and agile methodology.",
    skills: ["JavaScript", "React", "CSS", "Git"],
  },
]

export default function Experience() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const dotVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  }

  return (
    <section className="relative w-full py-24 px-4 md:px-8 lg:px-16 bg-black overflow-hidden" ref={ref}>
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 via-transparent to-transparent pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto mb-16"
      >
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 text-balance">Experience</h2>
        <p className="text-lg text-gray-400">A journey through my professional growth and achievements</p>
      </motion.div>

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="max-w-4xl mx-auto relative"
      >
        {/* Timeline line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500/50 via-orange-500/20 to-transparent" />

        {/* Timeline items */}
        <div className="space-y-12 md:space-y-16">
          {experiences.map((experience, index) => (
            <motion.div
              key={experience.id}
              variants={itemVariants}
              className={`relative flex flex-col md:flex-row gap-8 ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Timeline dot */}
              <motion.div
                variants={dotVariants}
                className="absolute left-0 md:left-1/2 top-0 -translate-x-1/2 w-6 h-6 rounded-full bg-orange-500 border-4 border-black shadow-lg shadow-orange-500/50 z-10"
              />

              {/* Content container */}
              <div className="md:w-1/2 ml-20 md:ml-0">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="group relative p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-orange-500/30 transition-all duration-300 overflow-hidden"
                >
                  {/* Glass background effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Glow effect on hover */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/0 via-orange-500/10 to-orange-500/0 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex flex-col gap-2 mb-4">
                      <h3 className="text-2xl md:text-xl font-semibold text-white group-hover:text-orange-400 transition-colors duration-300">
                        {experience.jobTitle}
                      </h3>
                      <p className="text-orange-400 font-medium text-sm md:text-base">{experience.company}</p>
                    </div>

                    {/* Date */}
                    <div className="text-sm text-gray-400 mb-4 font-light">
                      {experience.startDate} — {experience.endDate}
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-4">{experience.description}</p>

                    {/* Skills */}
                    {experience.skills && experience.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {experience.skills.map((skill, i) => (
                          <motion.span
                            key={i}
                            whileHover={{ scale: 1.05 }}
                            className="px-3 py-1 text-xs rounded-full bg-orange-500/10 text-orange-300 border border-orange-500/30 hover:bg-orange-500/20 transition-colors duration-200"
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
