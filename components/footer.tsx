"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Mail, Twitter, Instagram } from "lucide-react"
import { useRef } from "react"
import { useInView } from "framer-motion"

export default function Footer() {
  const footerRef = useRef(null)
  const isInView = useInView(footerRef, { once: false, amount: 0.3 })

  const socialLinks = [
    { icon: <Github size={20} />, href: "https://github.com/HarshatDy", label: "GitHub" },
    { icon: <Linkedin size={20} />, href: "https://www.linkedin.com/in/harshat-dhanayat-5b715315a/", label: "LinkedIn" },
    { icon: <Twitter size={20} />, href: "https://twitter.com", label: "Twitter" },
    { icon: <Instagram size={20} />, href: "https://instagram.com", label: "Instagram" },
    { icon: <Mail size={20} />, href: "dhanayat.harshat@gmail.com", label: "Email" },
  ]

  return (
    <footer ref={footerRef} className="relative bg-zinc-900 py-16">
      {/* McLaren-inspired decorative element */}
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-[#FF8000] to-transparent opacity-70" />

      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          className="grid gap-12 md:grid-cols-2"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          {/* Brand */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold">Harshat Dy</h3>
            <p className="text-sm text-zinc-400">
              Creating innovative solutions at the intersection of software engineering and design.
            </p>
          </div>

          
          {/* Quick Links
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#FF8000]">Quick Links</h4>
            <ul className="space-y-2">
              {["Home", "Projects", "About", "Services", "Contact"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-zinc-400 transition-colors hover:text-white">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div> */}

          {/* Contact */}
          <div className="space-y-4 md:justify-self-end">
            <h4 className="text-lg font-semibold text-[#FF8000]">Contact</h4>
            <p className="text-sm text-zinc-400">
              Bengaluru, KA
              <br />
              dhanayat.harshat@gmail.com
              <br />
              +91 9967745003
            </p>

            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 transition-colors hover:bg-[#FF8000] hover:text-white"
                  whileHover={{
                    scale: 1.1,
                    transition: { duration: 0.2 },
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.3 + index * 0.1,
                  }}
                  aria-label={link.label}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          className="mt-12 border-t border-zinc-800 pt-8 text-center text-sm text-zinc-500"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <p>© {new Date().getFullYear()} Harshat Dy. All rights reserved.</p>
          <p className="mt-2">
            Designed with <span className="text-[#FF8000]">♥</span> in Bengaluru.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}

