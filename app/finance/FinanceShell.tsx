"use client"

import { useState } from "react"
import Link from "next/link"
import { BookOpen } from "lucide-react"
import FinanceDashboard from "./FinanceDashboard"
import IndiaDashboard from "./india/IndiaDashboard"

const TABS = [
  { id: "india", label: "India · Nifty 50" },
  { id: "global", label: "Global" },
] as const

type Tab = (typeof TABS)[number]["id"]

export default function FinanceShell() {
  const [activeTab, setActiveTab] = useState<Tab>("india")

  return (
    <div className="space-y-0">
      <div className="flex items-center gap-1 border-b border-zinc-800 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={[
              "px-4 py-2 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "text-[#FF8000] border-b-2 border-[#FF8000] -mb-px"
                : "text-zinc-500 hover:text-zinc-300",
            ].join(" ")}
          >
            {tab.label}
          </button>
        ))}
        <Link
          href="/finance/playbook"
          className="ml-auto flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-sm py-2 px-3 transition-colors"
        >
          <BookOpen size={14} />
          Playbook
        </Link>
      </div>

      {activeTab === "india" ? <IndiaDashboard /> : <FinanceDashboard />}
    </div>
  )
}
