"use client"

import { useEffect, useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { IndiaStockDetailData, StrategySignals, StrategySignalEntry } from '@/app/data/types/indiaFinance'
import SignalBadge from './SignalBadge'
import ScoreRing from './ScoreRing'
import SignalHistory from './SignalHistory'

interface IndiaStockDetailProps {
  ticker: string
  onClose?: () => void
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
  })
}

function SkeletonDetail() {
  return (
    <div className="animate-pulse flex flex-col gap-5 p-6">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <div className="bg-zinc-800 rounded h-7 w-28" />
          <div className="bg-zinc-800 rounded h-4 w-40" />
          <div className="bg-zinc-800 rounded h-8 w-24 mt-1" />
        </div>
        <div className="bg-zinc-800 rounded-full w-16 h-16" />
      </div>
      <div className="bg-zinc-800 rounded h-44 w-full" />
      <div className="flex gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1 items-center">
            <div className="bg-zinc-800 rounded h-3 w-10" />
            <div className="bg-zinc-800 rounded-full h-5 w-12" />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1">
            <div className="bg-zinc-800 rounded h-3 w-24" />
            <div className="bg-zinc-800 rounded h-1.5 w-full" />
          </div>
        ))}
      </div>
      <div className="bg-zinc-800 rounded-lg h-16 w-full" />
    </div>
  )
}

export default function IndiaStockDetail({ ticker, onClose }: IndiaStockDetailProps) {
  const [data, setData] = useState<IndiaStockDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!ticker) return
    setLoading(true)
    setError(null)
    setData(null)

    fetch(`/api/finance/india/stock/${ticker}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<{ stock: IndiaStockDetailData }>
      })
      .then(({ stock: json }) => {
        setData(json)
        setLoading(false)
      })
      .catch((err: Error) => {
        setError(err.message)
        setLoading(false)
      })
  }, [ticker])

  if (loading) {
    return (
      <div className="flex-1 min-w-0 bg-[#111] rounded-xl border border-zinc-800">
        <SkeletonDetail />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex-1 min-w-0 bg-[#111] rounded-xl border border-zinc-800 flex items-center justify-center p-8">
        <p className="text-red-400 text-sm">Failed to load stock data</p>
      </div>
    )
  }

  const { stock, prices, signals, latestSignal, currentPrice } = data

  // Reverse prices (newest-first → oldest-first for chart)
  const chartData = [...prices].reverse().map((p) => ({
    date: formatDate(p.date),
    close: p.close,
  }))

  // Show every 7th label on X-axis
  const xAxisTickFormatter = (_: string, index: number) =>
    index % 7 === 0 ? _ : ''

  const upsidePct = latestSignal?.upside_pct ?? null
  const upsideColor =
    upsidePct === null ? 'text-zinc-500' : upsidePct >= 0 ? 'text-green-400' : 'text-red-400'

  const subScores = [
    { label: 'Momentum', value: latestSignal?.momentum_score ?? 0 },
    { label: 'Volume', value: latestSignal?.volume_score ?? 0 },
    { label: 'Volatility', value: latestSignal?.volatility_score ?? 0 },
  ]

  return (
    <div className="flex-1 min-w-0 bg-[#111] rounded-xl border border-zinc-800 overflow-y-auto">
      <div className="p-6 flex flex-col gap-6">

        {/* ── HEADER ── */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-white text-2xl font-bold">{stock.ticker}</h2>
              {latestSignal && <SignalBadge signal={latestSignal.signal} size="md" />}
            </div>
            <p className="text-zinc-500 text-sm">{stock.name}</p>
            <p className="text-zinc-600 text-xs">{stock.sector}</p>

            {currentPrice !== null && (
              <p className="text-white text-3xl font-bold mt-2">
                ₹{currentPrice.toLocaleString('en-IN')}
              </p>
            )}

            {latestSignal?.target_price !== null && latestSignal?.target_price !== undefined && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-zinc-500 text-xs">Target:</span>
                <span className="text-white text-sm font-medium">
                  ₹{latestSignal.target_price.toLocaleString('en-IN')}
                </span>
                {upsidePct !== null && (
                  <span className={`text-xs font-semibold ${upsideColor}`}>
                    ({upsidePct >= 0 ? '+' : ''}{upsidePct.toFixed(1)}%)
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Score ring */}
          {latestSignal && (
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <ScoreRing score={latestSignal.score} size={72} />
              <span className="text-zinc-500 text-[10px]">Score</span>
            </div>
          )}
        </div>

        {/* ── 30-DAY PRICE CHART ── */}
        {chartData.length > 0 && (
          <div>
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-2">
              30-Day Price
            </p>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF8000" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#FF8000" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#71717a', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={xAxisTickFormatter}
                />
                <YAxis
                  tick={{ fill: '#71717a', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={60}
                  tickFormatter={(v: number) => `₹${v.toLocaleString('en-IN')}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #3f3f46',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => {
                    const num = typeof value === 'number' ? value : Number(value ?? 0)
                    return [`₹${num.toLocaleString('en-IN')}`, 'Close']
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="close"
                  stroke="#FF8000"
                  strokeWidth={1.5}
                  fill="url(#priceGrad)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* ── 7-DAY SIGNAL HISTORY ── */}
        <div>
          <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-2">
            7-Day Signal History
          </p>
          <SignalHistory signals={signals} />
        </div>

        {/* ── SUB-SCORE BARS ── */}
        {latestSignal && (
          <div>
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-3">
              Sub-Scores
            </p>
            <div className="flex flex-col gap-3">
              {subScores.map(({ label, value }) => (
                <div key={label}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-zinc-400 text-xs">{label}</span>
                    <span className="text-zinc-300 text-xs font-medium">{Math.round(value)}</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded h-1">
                    <div
                      className="h-1 bg-[#FF8000] rounded"
                      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── RATIONALE ── */}
        <div>
          <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-2">
            Rationale
          </p>
          {latestSignal?.rationale ? (
            <div className="bg-zinc-900 rounded-lg p-3">
              <p className="text-zinc-300 text-sm italic">{latestSignal.rationale}</p>
            </div>
          ) : (
            <p className="text-zinc-500 text-sm">Analysis pending</p>
          )}
        </div>

        {/* ── STRATEGY SIGNALS ── */}
        {latestSignal?.strategy_signals && (
          <StrategySignalsPanel signals={latestSignal.strategy_signals} />
        )}

      </div>
    </div>
  )
}

// ── Strategy Signals Panel ────────────────────────────────────────────────────

const STRATEGY_LABELS: Record<keyof StrategySignals, string> = {
  vcp:            'VCP',
  sepa:           'SEPA',
  cup_handle:     'Cup & Handle',
  darvas:         'Darvas Box',
  ema_pullback:   'EMA Pullback',
  rsi_divergence: 'RSI Divergence',
  orb:            'Opening Range',
  wyckoff:        'Wyckoff',
}

const SIGNAL_COLORS = {
  BUY:  'text-green-400',
  HOLD: 'text-yellow-400',
  SELL: 'text-red-400',
}

function StrategyCard({ label, entry }: { label: string; entry: StrategySignalEntry }) {
  const [open, setOpen] = useState(false)
  const hasDetails = entry.details && Object.keys(entry.details).length > 0

  return (
    <div
      className={`bg-zinc-900 rounded-lg p-3 flex flex-col gap-2 transition-colors ${hasDetails ? 'cursor-pointer hover:bg-zinc-800' : ''}`}
      onClick={() => hasDetails && setOpen((o) => !o)}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-zinc-300 text-xs font-medium">{label}</span>
        <div className="flex items-center gap-1.5">
          <span className={`text-xs font-bold ${SIGNAL_COLORS[entry.signal]}`}>
            {entry.signal}
          </span>
          {hasDetails && (
            <span className="text-zinc-600 text-[10px]">{open ? '▲' : '▼'}</span>
          )}
        </div>
      </div>

      {/* Stacked bar: green | gray | red */}
      <div className="w-full h-1.5 rounded overflow-hidden flex">
        <div className="bg-green-500 h-full" style={{ width: `${entry.buy}%` }} />
        <div className="bg-zinc-600 h-full" style={{ width: `${entry.hold}%` }} />
        <div className="bg-red-500 h-full" style={{ width: `${entry.sell}%` }} />
      </div>

      {/* Percentage labels */}
      <div className="flex justify-between text-[10px]">
        <span className="text-green-500">B {entry.buy}%</span>
        <span className="text-zinc-500">H {entry.hold}%</span>
        <span className="text-red-500">S {entry.sell}%</span>
      </div>

      {/* KPI details — shown on click */}
      {open && hasDetails && (
        <div className="mt-1 pt-2 border-t border-zinc-700 flex flex-col gap-1">
          {Object.entries(entry.details).map(([k, val]) => (
            <div key={k} className="flex justify-between items-baseline gap-2">
              <span className="text-zinc-500 text-[10px] shrink-0">{k}</span>
              <span className="text-zinc-300 text-[10px] font-medium text-right">{val}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function StrategySignalsPanel({ signals }: { signals: StrategySignals }) {
  const keys = Object.keys(STRATEGY_LABELS) as (keyof StrategySignals)[]
  return (
    <div>
      <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">
        Strategy Signals
      </p>
      <p className="text-zinc-600 text-[10px] mb-3">Tap a card to see the KPIs used</p>
      <div className="grid grid-cols-2 gap-2">
        {keys.map((key) => (
          <StrategyCard key={key} label={STRATEGY_LABELS[key]} entry={signals[key]} />
        ))}
      </div>
    </div>
  )
}
