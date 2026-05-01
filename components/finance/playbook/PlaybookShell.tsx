"use client"

import { useState } from 'react'
import type { ComponentType } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Overview from './sections/Overview'
import MarketPrinciples from './sections/MarketPrinciples'
import Indicators from './sections/Indicators'
import Algorithms from './sections/Algorithms'
import StockScanner from './sections/StockScanner'
import RiskMoney from './sections/RiskMoney'
import Psychology from './sections/Psychology'
import WeeklyPlaybook from './sections/WeeklyPlaybook'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'principles', label: 'Market Principles' },
  { id: 'indicators', label: 'Indicators' },
  { id: 'algorithms', label: 'Algorithms' },
  { id: 'scanner', label: 'Stock Scanner' },
  { id: 'risk', label: 'Risk & Money' },
  { id: 'psychology', label: 'Psychology' },
  { id: 'playbook', label: 'Weekly Playbook' },
] as const

type TabId = (typeof TABS)[number]['id']

const SECTION_MAP: Record<TabId, ComponentType> = {
  overview: Overview,
  principles: MarketPrinciples,
  indicators: Indicators,
  algorithms: Algorithms,
  scanner: StockScanner,
  risk: RiskMoney,
  psychology: Psychology,
  playbook: WeeklyPlaybook,
}

export default function PlaybookShell() {
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const ActiveSection = SECTION_MAP[activeTab]

  return (
    <div className="space-y-0">
      {/* Back nav */}
      <Link
        href="/finance"
        className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-sm mb-5 transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Finance
      </Link>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-white text-3xl font-bold tracking-tight">NSE 100 Swing Trading</h1>
        <p className="text-zinc-500 text-sm mt-1">A complete framework for 10% weekly profit targets — built on decades of market expert consensus</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 border-b border-zinc-800 mb-6 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={[
              'px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0',
              activeTab === tab.id
                ? 'text-[#FF8000] border-b-2 border-[#FF8000] -mb-px'
                : 'text-zinc-500 hover:text-zinc-300',
            ].join(' ')}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active section */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <ActiveSection />
      </motion.div>
    </div>
  )
}
