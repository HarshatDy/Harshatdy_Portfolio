"use client"

interface SignalBadgeProps {
  signal: 'BUY' | 'HOLD' | 'SELL'
  size?: 'sm' | 'md'
}

const colorMap = {
  BUY: 'bg-green-500/10 text-green-400 border border-green-500/20',
  HOLD: 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20',
  SELL: 'bg-red-500/10 text-red-400 border border-red-500/20',
}

export default function SignalBadge({ signal, size = 'sm' }: SignalBadgeProps) {
  const sizeClasses =
    size === 'md'
      ? 'px-3 py-1 text-sm font-semibold'
      : 'px-2 py-0.5 text-xs font-semibold'

  return (
    <span className={`rounded-full ${sizeClasses} ${colorMap[signal]}`}>
      {signal}
    </span>
  )
}
