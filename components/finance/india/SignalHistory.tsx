"use client"

import type { IndiaStockSignal } from '@/app/data/types/indiaFinance'
import SignalBadge from './SignalBadge'

interface SignalHistoryProps {
  signals: IndiaStockSignal[]
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
  })
}

export default function SignalHistory({ signals }: SignalHistoryProps) {
  // Take up to 7, newest first → reverse for oldest-to-newest display
  const display = [...signals].slice(0, 7).reverse()

  if (display.length === 0) {
    return <p className="text-zinc-500 text-xs">No signal history available.</p>
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {display.map((s) => (
        <div key={s.id} className="flex flex-col items-center gap-1">
          <span className="text-zinc-500 text-[10px]">{formatDate(s.date)}</span>
          <SignalBadge signal={s.signal} size="sm" />
        </div>
      ))}
    </div>
  )
}
