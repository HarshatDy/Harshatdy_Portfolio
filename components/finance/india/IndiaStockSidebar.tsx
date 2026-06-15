"use client"

import { useState } from 'react'
import type { IndiaStockWithSignal } from '@/app/data/types/indiaFinance'
import SignalBadge from './SignalBadge'

type SignalFilter = 'ALL' | 'BUY' | 'HOLD' | 'SELL'

interface IndiaStockSidebarProps {
  stocks: IndiaStockWithSignal[]
  selectedTicker: string | null
  onSelect: (ticker: string) => void
  loading: boolean
}

function SkeletonRows() {
  return (
    <div className="flex flex-col gap-3 p-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse flex flex-col gap-2 py-2">
          <div className="bg-zinc-800 rounded h-4 w-20" />
          <div className="bg-zinc-800 rounded h-3 w-32" />
        </div>
      ))}
    </div>
  )
}

const filterStyles: Record<SignalFilter, string> = {
  ALL:  'text-zinc-300 border-zinc-600 bg-zinc-800',
  BUY:  'text-green-400 border-green-500/40 bg-green-500/10',
  HOLD: 'text-zinc-400 border-zinc-500/40 bg-zinc-500/10',
  SELL: 'text-red-400  border-red-500/40  bg-red-500/10',
}

const filterInactive = 'text-zinc-600 border-transparent bg-transparent hover:text-zinc-400'

export default function IndiaStockSidebar({
  stocks,
  selectedTicker,
  onSelect,
  loading,
}: IndiaStockSidebarProps) {
  const [filter, setFilter] = useState<SignalFilter>('ALL')
  const [search, setSearch] = useState('')

  const filteredStocks = stocks
    .filter((item) => filter === 'ALL' || item.latestSignal?.signal === filter)
    .filter((item) => {
      if (!search.trim()) return true
      const q = search.toLowerCase()
      return (
        item.stock.ticker.toLowerCase().includes(q) ||
        item.stock.name.toLowerCase().includes(q)
      )
    })

  return (
    <div className="w-full md:w-72 flex-shrink-0 bg-[#111] rounded-xl border border-zinc-800 overflow-hidden flex flex-col h-[calc(100vh-180px)] md:sticky md:top-4 md:h-[calc(100vh-200px)]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-800 flex-shrink-0">
        <p className="text-zinc-500 text-xs font-semibold tracking-widest uppercase">
          NIFTY 50
        </p>
        {!loading && (
          <p className="text-zinc-600 text-[10px] mt-0.5">{filteredStocks.length} stocks</p>
        )}

        {/* Signal filter pills */}
        <div className="flex gap-1.5 mt-2.5">
          {(['ALL', 'BUY', 'HOLD', 'SELL'] as SignalFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-all ${
                filter === f ? filterStyles[f] : filterInactive
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mt-2.5 relative">
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ticker or name…"
            className="w-full bg-zinc-900 border border-zinc-700/60 rounded-lg pl-7 pr-6 py-1.5 text-xs text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors text-[10px] leading-none"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Stock list */}
      <div className="overflow-y-auto flex-1">
        {loading ? (
          <SkeletonRows />
        ) : filteredStocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12 px-4 text-center">
            <p className="text-zinc-500 text-sm">No stocks found</p>
            <p className="text-zinc-600 text-xs mt-1">
              {search ? 'Try a different search term' : 'No stocks match this filter'}
            </p>
          </div>
        ) : (
          filteredStocks.map((item, index) => {
            const { stock, latestSignal, sevenDayChange } = item
            const isSelected = selectedTicker === stock.ticker
            const isTopPick = index < 3

            const changeColor =
              sevenDayChange === null
                ? 'text-zinc-500'
                : sevenDayChange >= 0
                ? 'text-green-400'
                : 'text-red-400'

            const changeLabel =
              sevenDayChange === null
                ? '—'
                : `${sevenDayChange >= 0 ? '+' : ''}${sevenDayChange.toFixed(1)}%`

            return (
              <div
                key={stock.id}
                onClick={() => onSelect(stock.ticker)}
                className="cursor-pointer hover:bg-zinc-900 transition-colors px-3 py-2.5 border-b border-zinc-800/50"
                style={{
                  borderLeft: isSelected
                    ? '2px solid #FF8000'
                    : '2px solid transparent',
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  {/* Left: ticker + name + sector */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-white font-bold text-sm">
                        {stock.ticker}
                      </span>
                      {isTopPick && (
                        <span className="text-[10px] bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded px-1 font-semibold">
                          TOP PICK
                        </span>
                      )}
                    </div>
                    <p className="text-zinc-500 text-xs truncate mt-0.5">
                      {stock.name}
                    </p>
                    <p className="text-zinc-600 text-xs">{stock.sector}</p>
                  </div>

                  {/* Right: signal badge + 7D change */}
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    {latestSignal ? (
                      <SignalBadge signal={latestSignal.signal} size="sm" />
                    ) : (
                      <span className="text-zinc-600 text-xs">—</span>
                    )}
                    <span className={`text-xs font-medium ${changeColor}`}>
                      {changeLabel}
                    </span>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
