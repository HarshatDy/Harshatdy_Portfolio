"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Suspense } from "react"
import SubscribeForm from "@/components/newsletter/SubscribeForm"
import { DOMAINS } from "@/app/data/types/newsletter"

function NewsletterContent() {
  const searchParams = useSearchParams()
  const verified = searchParams.get("verified")
  const error = searchParams.get("error")

  const errorMessages: Record<string, string> = {
    missing_token: "Verification link is missing a token.",
    invalid_token: "This verification link is invalid.",
    expired_token: "This verification link has expired. Please subscribe again.",
    server_error: "Something went wrong. Please try again.",
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-4 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="text-[#FF8000] text-sm font-medium tracking-widest uppercase">Newsletter</span>
          <h1 className="text-4xl font-bold text-white mt-3 mb-4">Stay in the loop</h1>
          <p className="text-zinc-400 leading-relaxed">
            Daily digest across domains I research — curated by me, generated with Claude AI.
            Subscribe to the topics you care about.
          </p>
        </motion.div>

        {/* Verification success banner */}
        {verified === "true" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-center"
          >
            ✓ Email verified! You are now subscribed. Your first newsletter will arrive tomorrow.
          </motion.div>
        )}

        {/* Verification error banner */}
        {error && errorMessages[error] && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-center"
          >
            {errorMessages[error]}
          </motion.div>
        )}

        {/* What you get */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10"
        >
          {DOMAINS.map(({ value, label, icon }) => (
            <div key={value} className="flex gap-3 p-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
              <span className="text-2xl">{icon}</span>
              <div>
                <p className="text-white text-sm font-medium">{label}</p>
                <p className="text-zinc-600 text-xs mt-0.5">Daily digest</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Subscribe form */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8"
        >
          <SubscribeForm />
        </motion.div>
      </div>
    </main>
  )
}

export default function NewsletterPage() {
  return (
    <Suspense>
      <NewsletterContent />
    </Suspense>
  )
}
