// components/finance/playbook/sections/Algorithms.tsx
"use client"

import { useState } from 'react'

const ALGOS = [
  { title: 'VCP — Volatility Contraction Pattern', type: 'Mark Minervini | Breakout',
    detail: 'Stock makes a series of contractions: first pullback 25-30%, then 15-20%, then 10-12%, then 5-7%. Each pullback is smaller = sellers are exhausting. Volume also contracts at each correction.',
    formula: 'Setup: 3-4 contractions, each smaller in % decline and volume\nEntry: Breakout above tightest contraction high on volume 2x+ average\nStop: Below the tightest contraction low\nTarget: Prior base height added to breakout point',
    note: 'NSE Examples: Works beautifully on Nifty 100 stocks coming out of 6-12 month basing structures. Look at RELIANCE 2020, HDFCBANK 2022-23 for classic VCP patterns.' },
  { title: 'SEPA — Specific Entry Point Analysis', type: 'Mark Minervini | Precision Entry',
    detail: 'Combines fundamental + technical + timing. Only buy: highest RS stocks, with earnings acceleration, at a specific technical entry point, in a bull market.',
    formula: 'Trend Template:\n1. Price > 150 DMA and 200 DMA\n2. 150 DMA > 200 DMA\n3. 200 DMA trending up ≥ 1 month\n4. 50 DMA > 150 DMA and 200 DMA\n5. Price > 50 DMA\n6. Price within 25% of 52-week high\n7. Price ≥ 30% above 52-week low',
    note: 'Use this as a pre-qualification checklist for every NSE stock before deeper analysis.' },
  { title: 'Cup with Handle', type: "William O'Neil | Base Pattern",
    detail: 'U-shaped consolidation 7-65 weeks, with a small handle forming in upper right (5-15% pullback on declining volume). Handle should drift down gently, not sharply.',
    formula: 'Cup depth: 12-35% from high to low\nHandle: 5-15% below cup high, volume dries up\nEntry: Above handle high on volume surge\nStop: Below handle low\nTarget: Cup depth added to pivot point',
    note: "O'Neil found that stocks bought at the proper pivot in a cup-with-handle outperformed 80% of the time during confirmed market uptrends." },
  { title: 'Darvas Box System', type: 'Nicolas Darvas | Breakout',
    detail: 'Draw a box around recent consolidation. Top = resistance. Bottom = support. Buy when price breaks out of the top with increasing volume.',
    formula: 'Box Rule:\n- Stock must make a new high in box range\n- Must close back in box 3 times without making new low\n- Box confirmed when top and bottom established\nEntry: 1% above box top on volume\nStop: Below box bottom\nTarget: Box height projected upward',
    note: 'Works exceptionally well on NSE mid-large caps. TradingView has Darvas Box indicator built-in.' },
  { title: 'EMA Pullback Strategy', type: 'Stan Weinstein | Stage 2 Entry',
    detail: 'In a Stage 2 uptrend, stocks pull back to rising EMA 20 or EMA 50 and bounce. These pullbacks are buying opportunities with defined risk at the MA level.',
    formula: 'Conditions:\n1. Stock in Stage 2 (EMA 20 > 50 > 200, all rising)\n2. Price pulls back to EMA 20 or EMA 50\n3. Volume dries up during pullback\n4. Bounce candle: bullish engulfing, hammer, doji+confirm\nEntry: On bounce confirmation candle\nStop: 1-2% below the EMA level\nTarget: Prior high or 2x the risk',
    note: 'This is the most consistent NSE swing setup — works in 60-70% of cases during confirmed uptrends.' },
  { title: 'RSI Divergence Strategy', type: 'Momentum | Reversal',
    detail: 'When price makes a new high/low but RSI fails to confirm — divergence signals momentum is waning and reversal may follow.',
    formula: 'Bearish Divergence: Price new high, RSI lower high → Exit/Short\nBullish Divergence: Price new low, RSI higher low → Potential Long\n\nConfirmation Rules:\n- Divergence must occur at key S/R level\n- RSI divergence + MACD divergence = stronger signal\n- Wait for price reversal candle to confirm',
    note: 'Use bearish RSI divergence to EXIT swing longs before the reversal, not just to short. Primary use: protecting profits.' },
  { title: 'Opening Range Breakout (ORB)', type: 'Toby Crabel | Intraday-Swing',
    detail: 'The high and low of the first 15-30 minutes forms the "Opening Range." Breakout above/below this range with volume signals the direction for the day, and often for 2-3 days.',
    formula: 'ORB Setup (15-min):\n- Record high/low of 9:15–9:30 AM\n- Wait for break above high or below low\n- Confirm with volume > 1.5x typical 15-min volume\n- Entry: 0.1-0.2% above range for long\n- Stop: Opposite side of range\nHold: 1-3 days for swing target',
    note: 'NSE stocks with significant ORB (range > 2%) tend to continue the move for 1-3 days. Track on Nifty 50 constituents for clearest signals.' },
  { title: 'Wyckoff Accumulation', type: 'Richard Wyckoff | Institutional',
    detail: 'Identifies when institutions are silently accumulating stock before a large move. Phases: PS (Preliminary Support) → SC (Selling Climax) → AR (Automatic Rally) → ST (Secondary Test) → Spring → LPS → SOS.',
    formula: 'Key Events:\n- Spring: Price dips below support, quickly reverses → institutions absorb final sellers\n- LPS: Pullback after Spring on low volume → final accumulation\n- SOS: Strong move up on high volume → markup begins\nEntry: At LPS or SOS breakout\nStop: Below Spring low\nTarget: Measured move of trading range',
    note: 'Apply to weekly NSE charts of banking stocks (HDFCBANK, ICICIBANK) during broad market corrections for highest-probability entries.' },
]

export default function Algorithms() {
  const [openSet, setOpenSet] = useState<Set<number>>(new Set())

  function toggle(idx: number) {
    setOpenSet((prev) => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  return (
    <div className="space-y-3">
      <p className="text-zinc-500 text-sm">Proven systematic approaches used by professionals — click each to expand.</p>
      {ALGOS.map((a, idx) => {
        const isOpen = openSet.has(idx)
        return (
          <div
            key={a.title}
            className={[
              'bg-zinc-900 border rounded-xl overflow-hidden transition-colors',
              isOpen ? 'border-[#FF8000]/30' : 'border-zinc-800 hover:border-zinc-700',
            ].join(' ')}
          >
            <button
              onClick={() => toggle(idx)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <div>
                <div className="text-white font-semibold text-sm">{a.title}</div>
                <div className="text-zinc-500 text-xs mt-0.5">{a.type}</div>
              </div>
              <span className={`text-zinc-400 text-lg transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}>›</span>
            </button>
            {isOpen && (
              <div className="px-4 pb-4 space-y-3 border-t border-zinc-800">
                <p className="text-zinc-400 text-sm leading-relaxed mt-3">{a.detail}</p>
                <pre className="font-mono text-xs text-teal-400 bg-black border border-zinc-800 rounded p-3 whitespace-pre-wrap leading-relaxed">{a.formula}</pre>
                <p className="text-zinc-500 text-xs leading-relaxed">{a.note}</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
