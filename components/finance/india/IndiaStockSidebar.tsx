"use client"

import type { IndiaStockWithSignal } from '@/app/data/types/indiaFinance'
import SignalBadge from './SignalBadge'

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

export default function IndiaStockSidebar({
  stocks,
  selectedTicker,
  onSelect,
  loading,
}: IndiaStockSidebarProps) {
  return (
    <div className="w-72 flex-shrink-0 bg-[#111] rounded-xl border border-zinc-800 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-800">
        <p className="text-zinc-500 text-xs font-semibold tracking-widest uppercase">
          NIFTY 50
        </p>
        {!loading && (
          <p className="text-zinc-600 text-[10px] mt-0.5">{stocks.length} stocks</p>
        )}
      </div>

      {/* Stock list */}
      <div className="overflow-y-auto flex-1">
        {loading ? (
          <SkeletonRows />
        ) : (
          stocks.map((item, index) => {
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
