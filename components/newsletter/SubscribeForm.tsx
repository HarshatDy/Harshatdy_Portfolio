"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import DomainSelector from "./DomainSelector"
import type { Domain } from "@/app/data/types/newsletter"

type Status = "idle" | "loading" | "success" | "error"

export default function SubscribeForm() {
  const [email, setEmail] = useState("")
  const [domains, setDomains] = useState<Domain[]>([])
  const [status, setStatus] = useState<Status>("idle")
  const [message, setMessage] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (domains.length === 0) {
      setMessage("Please select at least one domain.")
      setStatus("error")
      return
    }
    setStatus("loading")
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, domains }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus("success")
        setMessage(data.message ?? "Check your email to verify your subscription.")
      } else {
        setStatus("error")
        setMessage(data.error ?? "Something went wrong. Please try again.")
      }
    } catch {
      setStatus("error")
      setMessage("Network error. Please try again.")
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="text-5xl mb-4">📬</div>
            <h3 className="text-xl font-bold text-white mb-2">Almost there!</h3>
            <p className="text-zinc-400">{message}</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Email input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF8000] transition-colors"
              />
            </div>

            {/* Domain selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                Subscribe to domains{" "}
                <span className="text-zinc-600 font-normal">(select all that apply)</span>
              </label>
              <DomainSelector selected={domains} onChange={setDomains} />
            </div>

            {/* Error message */}
            {status === "error" && (
              <p className="text-red-400 text-sm">{message}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-3 bg-[#FF8000] text-black font-bold rounded-lg hover:bg-[#e57200] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "Subscribing..." : "Subscribe"}
            </button>

            <p className="text-zinc-600 text-xs text-center">
              You&apos;ll receive a verification email. Unsubscribe anytime.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
