"use client"

import { motion } from "framer-motion"

interface Props {
  view: "table" | "chart"
  onChange: (view: "table" | "chart") => void
}

export default function DashboardToggle({ view, onChange }: Props) {
  return (
    <div className="relative flex bg-zinc-900 rounded-lg p-1 w-fit border border-zinc-800">
      <motion.div
        className="absolute top-1 bottom-1 rounded-md bg-[#FF8000]"
        animate={{ left: view === "table" ? "4px" : "50%", width: "calc(50% - 4px)" }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
      {(["table", "chart"] as const).map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={`relative z-10 px-6 py-2 text-sm font-medium capitalize transition-colors duration-200 ${
            view === v ? "text-black" : "text-zinc-400 hover:text-white"
          }`}
        >
          {v === "table" ? "Table View" : "Chart View"}
        </button>
      ))}
    </div>
  )
}
