"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { IndiaStockWithSignal } from '@/app/data/types/indiaFinance'
import IndiaStockSidebar from '@/components/finance/india/IndiaStockSidebar'
import IndiaStockDetail from '@/components/finance/india/IndiaStockDetail'

function EmptyState() {
  return (
    <div className="flex-1 min-w-0 bg-[#111] rounded-xl border border-zinc-800 flex items-center justify-center p-12">
      <div className="text-center">
        <p className="text-zinc-500 text-sm">Select a stock from the sidebar</p>
        <p className="text-zinc-600 text-xs mt-1">to view signals, price chart and AI analysis</p>
      </div>
    </div>
  )
}

export default function IndiaDashboard() {
  const [stocks, setStocks] = useState<IndiaStockWithSignal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    fetch('/api/finance/india/stocks')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<{ stocks: IndiaStockWithSignal[] }>
      })
      .then(({ stocks: data }) => {
        setStocks(data)
        if (data.length > 0 && data[0].stock?.ticker) {
          setSelectedTicker(data[0].stock.ticker)
        }
        setLoading(false)
      })
      .catch((err: Error) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  // Derive latest date from stocks for "As of" label
  const latestDate = stocks.find((s) => s.latestSignal?.date)?.latestSignal?.date

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Header */}
      <header className="mb-6">
        <h2 className="text-white text-2xl font-bold tracking-tight">
          India Stocks · Nifty 50
        </h2>
        <p className="text-zinc-500 text-sm mt-1">
          BUY/HOLD/SELL signals · 8 strategy algorithms · Updated 3× daily
        </p>
        {latestDate && (
          <p className="text-zinc-600 text-xs mt-0.5">
            As of{' '}
            {new Date(latestDate).toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        )}
      </header>

      {error && (
        <p className="text-red-400 text-sm mb-4">Failed to load stocks: {error}</p>
      )}

      {/* Main layout: sidebar + detail */}
      <div className="flex gap-4 mt-4 items-start">
        {/* Sidebar */}
        <IndiaStockSidebar
          stocks={stocks}
          selectedTicker={selectedTicker}
          onSelect={setSelectedTicker}
          loading={loading}
        />

        {/* Detail panel */}
        {selectedTicker ? (
          <IndiaStockDetail ticker={selectedTicker} />
        ) : (
          <EmptyState />
        )}
      </div>

      {/* Playbook banner */}
      <Link
        href="/finance/playbook"
        className="mt-6 flex items-center justify-between bg-zinc-900 border border-zinc-800 hover:border-[#FF8000]/40 rounded-xl p-4 transition-colors group"
      >
        <div>
          <p className="text-zinc-400 text-sm">Learn the strategy behind these signals</p>
          <p className="text-white font-semibold text-sm mt-0.5">NSE 100 Swing Trading Playbook</p>
        </div>
        <span className="text-[#FF8000] text-lg group-hover:translate-x-1 transition-transform">→</span>
      </Link>

      {/* Footer */}
      <footer className="mt-4 border-t border-zinc-800 pt-4">
        <p className="text-zinc-600 text-xs text-center">
          Analysis by Claude Haiku · Data via Yahoo Finance · Not financial advice
        </p>
      </footer>
    </motion.div>
  )
}
