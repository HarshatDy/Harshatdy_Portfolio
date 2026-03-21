"use client"

import type { StockWithHistory } from "@/app/data/types/finance"

interface Props {
  data: StockWithHistory
}

const SENTIMENT_STYLES = {
  bullish: "bg-green-500/20 text-green-400 border-green-500/30",
  bearish: "bg-red-500/20 text-red-400 border-red-500/30",
  neutral: "bg-zinc-700/50 text-zinc-400 border-zinc-600/30",
}

export default function StockCard({ data }: Props) {
  const { stock, prices, latestAnalysis } = data
  const latest = prices[0]
  const prev = prices[1]
  const change = latest && prev ? latest.close - prev.close : null
  const pct = change !== null && prev ? (change / prev.close) * 100 : null

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div>
          <span className="font-mono font-bold text-white text-lg">{stock.ticker}</span>
          <p className="text-zinc-500 text-xs mt-0.5">{stock.name}</p>
        </div>
        {latestAnalysis && (
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full border capitalize ${
              SENTIMENT_STYLES[latestAnalysis.sentiment]
            }`}
          >
            {latestAnalysis.sentiment}
          </span>
        )}
      </div>

      {latest && (
        <div className="flex items-end gap-3">
          <span className="text-2xl font-bold text-white">${latest.close.toFixed(2)}</span>
          {change !== null && pct !== null && (
            <span className={`text-sm font-medium ${change >= 0 ? "text-green-400" : "text-red-400"}`}>
              {change >= 0 ? "+" : ""}
              {change.toFixed(2)} ({pct.toFixed(2)}%)
            </span>
          )}
        </div>
      )}

      {stock.sector && <span className="text-zinc-600 text-xs">{stock.sector}</span>}
    </div>
  )
}
