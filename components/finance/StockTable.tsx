"use client"

import { useState } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { StockWithHistory } from "@/app/data/types/finance"
import StockAnalysis from "./StockAnalysis"

type SortKey = "ticker" | "close" | "change" | "volume" | "sentiment"
type SortDir = "asc" | "desc"

interface Props {
  stocks: StockWithHistory[]
}

const SENTIMENT_STYLES = {
  bullish: "bg-green-500/20 text-green-400",
  bearish: "bg-red-500/20 text-red-400",
  neutral: "bg-zinc-700 text-zinc-400",
}

export default function StockTable({ stocks }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("ticker")
  const [sortDir, setSortDir] = useState<SortDir>("asc")
  const [expandedTicker, setExpandedTicker] = useState<string | null>(null)

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  function getChange(s: StockWithHistory) {
    const latest = s.prices[0]
    const prev = s.prices[1]
    if (!latest || !prev) return 0
    return ((latest.close - prev.close) / prev.close) * 100
  }

  const sorted = [...stocks].sort((a, b) => {
    let av: string | number = 0
    let bv: string | number = 0
    if (sortKey === "ticker") { av = a.stock.ticker; bv = b.stock.ticker }
    else if (sortKey === "close") { av = a.prices[0]?.close ?? 0; bv = b.prices[0]?.close ?? 0 }
    else if (sortKey === "change") { av = getChange(a); bv = getChange(b) }
    else if (sortKey === "volume") { av = a.prices[0]?.volume ?? 0; bv = b.prices[0]?.volume ?? 0 }
    else if (sortKey === "sentiment") { av = a.latestAnalysis?.sentiment ?? ""; bv = b.latestAnalysis?.sentiment ?? "" }
    if (av < bv) return sortDir === "asc" ? -1 : 1
    if (av > bv) return sortDir === "asc" ? 1 : -1
    return 0
  })

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronUp size={12} className="text-zinc-600" />
    return sortDir === "asc"
      ? <ChevronUp size={12} className="text-[#FF8000]" />
      : <ChevronDown size={12} className="text-[#FF8000]" />
  }

  function ColHeader({ col, label }: { col: SortKey; label: string }) {
    return (
      <th
        onClick={() => handleSort(col)}
        className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider cursor-pointer hover:text-zinc-300 select-none"
      >
        <span className="flex items-center gap-1">{label} <SortIcon col={col} /></span>
      </th>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800">
      <table className="w-full text-sm">
        <thead className="bg-zinc-900 border-b border-zinc-800">
          <tr>
            <ColHeader col="ticker" label="Ticker" />
            <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Name</th>
            <ColHeader col="close" label="Price" />
            <ColHeader col="change" label="Change %" />
            <ColHeader col="volume" label="Volume" />
            <ColHeader col="sentiment" label="Sentiment" />
            <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Analysis</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/50">
          {sorted.map((s, i) => {
            const latest = s.prices[0]
            const change = getChange(s)
            const isExpanded = expandedTicker === s.stock.ticker

            return (
              <>
                <motion.tr
                  key={s.stock.ticker}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="bg-zinc-950 hover:bg-zinc-900/50 transition-colors"
                >
                  <td className="px-4 py-3 font-mono font-bold text-white">{s.stock.ticker}</td>
                  <td className="px-4 py-3 text-zinc-400 max-w-[160px] truncate">{s.stock.name}</td>
                  <td className="px-4 py-3 text-white font-medium">
                    {latest ? `$${latest.close.toFixed(2)}` : "—"}
                  </td>
                  <td className={`px-4 py-3 font-medium ${change >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {latest ? `${change >= 0 ? "+" : ""}${change.toFixed(2)}%` : "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-400">
                    {latest?.volume ? (latest.volume / 1_000_000).toFixed(1) + "M" : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {s.latestAnalysis ? (
                      <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${SENTIMENT_STYLES[s.latestAnalysis.sentiment]}`}>
                        {s.latestAnalysis.sentiment}
                      </span>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {s.latestAnalysis && (
                      <button
                        onClick={() => setExpandedTicker(isExpanded ? null : s.stock.ticker)}
                        className="text-xs text-[#FF8000] hover:underline"
                      >
                        {isExpanded ? "Hide" : "Show"}
                      </button>
                    )}
                  </td>
                </motion.tr>
                <AnimatePresence>
                  {isExpanded && s.latestAnalysis && (
                    <motion.tr
                      key={`${s.stock.ticker}-analysis`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <td colSpan={7} className="px-4 py-3 bg-zinc-950/50">
                        <StockAnalysis ticker={s.stock.ticker} analysis={s.latestAnalysis} />
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </>
            )
          })}
          {sorted.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-12 text-center text-zinc-600">
                No stocks in watchlist. Add tickers via Supabase dashboard.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
