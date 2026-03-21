"use client"

import { useState } from "react"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import type { StockWithHistory } from "@/app/data/types/finance"
import StockCard from "./StockCard"

interface Props {
  stocks: StockWithHistory[]
}

const COLORS = [
  "#FF8000", "#3b82f6", "#10b981", "#f59e0b",
  "#8b5cf6", "#ef4444", "#06b6d4", "#84cc16",
]

export default function StockChart({ stocks }: Props) {
  const [selected, setSelected] = useState<string>(stocks[0]?.stock.ticker ?? "")

  const current = stocks.find((s) => s.stock.ticker === selected)
  const chartData = current
    ? [...current.prices]
        .reverse()
        .map((p) => ({ date: p.date.slice(5), price: p.close })) // "MM-DD"
    : []

  return (
    <div className="space-y-6">
      {/* Stock card grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {stocks.map((s, i) => (
          <button
            key={s.stock.ticker}
            onClick={() => setSelected(s.stock.ticker)}
            className={`text-left transition-all ${
              selected === s.stock.ticker
                ? "ring-2 ring-[#FF8000] rounded-xl"
                : "opacity-60 hover:opacity-100"
            }`}
          >
            <StockCard data={s} />
          </button>
        ))}
      </div>

      {/* Chart for selected stock */}
      {current && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-1">
            {current.stock.ticker} —{" "}
            <span className="text-zinc-400 font-normal text-sm">{current.stock.name}</span>
          </h3>
          <p className="text-zinc-600 text-xs mb-6">30-day closing price</p>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF8000" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FF8000" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis
                dataKey="date"
                tick={{ fill: "#71717a", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: "#71717a", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${v}`}
                domain={["auto", "auto"]}
              />
              <Tooltip
                contentStyle={{
                  background: "#18181b",
                  border: "1px solid #3f3f46",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#fff",
                }}
                formatter={(value) => [`$${Number(value).toFixed(2)}`, "Close"]}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#FF8000"
                strokeWidth={2}
                fill="url(#priceGrad)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
