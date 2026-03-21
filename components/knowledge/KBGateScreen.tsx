"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Lock } from "lucide-react"

interface Props {
  onAccess: (email: string) => void
}

export default function KBGateScreen({ onAccess }: Props) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")
    setErrorMsg("")

    try {
      const res = await fetch("/api/knowledge/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (data.hasAccess) {
        sessionStorage.setItem("kb_email", email.toLowerCase().trim())
        onAccess(email.toLowerCase().trim())
      } else {
        setStatus("error")
        setErrorMsg("No verified subscription found. Subscribe to a newsletter first.")
      }
    } catch {
      setStatus("error")
      setErrorMsg("Network error. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 mb-4">
            <Lock size={24} className="text-[#FF8000]" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Knowledge Base</h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Available exclusively to newsletter subscribers.
            Enter your verified email to access.
          </p>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-zinc-300 block mb-2">
                Your email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF8000] transition-colors"
              />
            </div>

            {status === "error" && (
              <p className="text-red-400 text-sm">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-3 bg-[#FF8000] text-black font-bold rounded-lg hover:bg-[#e57200] transition-colors disabled:opacity-50"
            >
              {status === "loading" ? "Checking..." : "Access Knowledge Base"}
            </button>
          </form>

          <p className="text-zinc-600 text-xs text-center mt-4">
            Not subscribed?{" "}
            <a href="/newsletter" className="text-[#FF8000] hover:underline">
              Subscribe to the newsletter
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
