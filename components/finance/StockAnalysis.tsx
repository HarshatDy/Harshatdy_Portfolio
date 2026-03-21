"use client"

import { ChevronDown } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { StockAnalysis as StockAnalysisType } from "@/app/data/types/finance"

interface Props {
  ticker: string
  analysis: StockAnalysisType
}

export default function StockAnalysis({ ticker, analysis }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-zinc-800 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900 hover:bg-zinc-800 transition-colors text-left"
      >
        <span className="text-sm font-medium text-zinc-300">
          Claude Analysis — <span className="font-mono text-[#FF8000]">{ticker}</span>
        </span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} className="text-zinc-500" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-4 bg-zinc-950 space-y-3">
              <p className="text-zinc-300 text-sm leading-relaxed">{analysis.analysis}</p>
              <ul className="space-y-1">
                {analysis.key_points.map((pt, i) => (
                  <li key={i} className="flex gap-2 text-sm text-zinc-400">
                    <span className="text-[#FF8000] mt-0.5">•</span>
                    {pt}
                  </li>
                ))}
              </ul>
              <p className="text-zinc-600 text-xs">Analysis date: {analysis.date}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
