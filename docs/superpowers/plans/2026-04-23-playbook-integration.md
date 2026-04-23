# NSE 100 Playbook Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port `nse100_swing_trading_playbook.html` into a React page at `/finance/playbook` with matching portfolio theme, and add two entry-point links from the existing finance UI.

**Architecture:** A `PlaybookShell` client component manages 8-tab navigation with `useState`. Each of the 8 tabs is an isolated section component. Interactive elements (indicator detail panel, algo expanders, position calculator) use local `useState` within their own section components. Two small modifications to existing files add the entry points.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Lucide React, Framer Motion

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `app/finance/playbook/page.tsx` | Route + metadata |
| Create | `components/finance/playbook/PlaybookShell.tsx` | 8-tab nav switcher |
| Create | `components/finance/playbook/sections/Overview.tsx` | Stat cards, framework, experts |
| Create | `components/finance/playbook/sections/MarketPrinciples.tsx` | 5 principles |
| Create | `components/finance/playbook/sections/Indicators.tsx` | 12 indicator cards + detail panel |
| Create | `components/finance/playbook/sections/Algorithms.tsx` | 8 expandable algo cards |
| Create | `components/finance/playbook/sections/StockScanner.tsx` | 3-stage checklist + entry/exit rules |
| Create | `components/finance/playbook/sections/RiskMoney.tsx` | Rules + position calculator + R:R table |
| Create | `components/finance/playbook/sections/Psychology.tsx` | 5 killers + daily process + journal table |
| Create | `components/finance/playbook/sections/WeeklyPlaybook.tsx` | 5-day grid + checklist + roadmap |
| Modify | `app/finance/FinanceShell.tsx` | Add Playbook link button (top-right of tab bar) |
| Modify | `app/finance/india/IndiaDashboard.tsx` | Add contextual banner at bottom |

---

## Task 1: Route page + PlaybookShell scaffold

**Files:**
- Create: `app/finance/playbook/page.tsx`
- Create: `components/finance/playbook/PlaybookShell.tsx`

- [ ] **Step 1: Create the route page**

```tsx
// app/finance/playbook/page.tsx
import PlaybookShell from '@/components/finance/playbook/PlaybookShell'

export const metadata = {
  title: 'NSE 100 Swing Trading Playbook | Harshat',
  description: 'Complete swing trading framework for NSE 100 stocks — indicators, algorithms, risk management, and weekly playbook',
}

export default function PlaybookPage() {
  return (
    <main className="min-h-screen bg-black text-white px-4 py-12 max-w-7xl mx-auto">
      <PlaybookShell />
    </main>
  )
}
```

- [ ] **Step 2: Create PlaybookShell with stub sections**

```tsx
// components/finance/playbook/PlaybookShell.tsx
"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import Overview from './sections/Overview'
import MarketPrinciples from './sections/MarketPrinciples'
import Indicators from './sections/Indicators'
import Algorithms from './sections/Algorithms'
import StockScanner from './sections/StockScanner'
import RiskMoney from './sections/RiskMoney'
import Psychology from './sections/Psychology'
import WeeklyPlaybook from './sections/WeeklyPlaybook'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'principles', label: 'Market Principles' },
  { id: 'indicators', label: 'Indicators' },
  { id: 'algorithms', label: 'Algorithms' },
  { id: 'scanner', label: 'Stock Scanner' },
  { id: 'risk', label: 'Risk & Money' },
  { id: 'psychology', label: 'Psychology' },
  { id: 'playbook', label: 'Weekly Playbook' },
] as const

type TabId = (typeof TABS)[number]['id']

const SECTION_MAP: Record<TabId, React.ComponentType> = {
  overview: Overview,
  principles: MarketPrinciples,
  indicators: Indicators,
  algorithms: Algorithms,
  scanner: StockScanner,
  risk: RiskMoney,
  psychology: Psychology,
  playbook: WeeklyPlaybook,
}

export default function PlaybookShell() {
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const ActiveSection = SECTION_MAP[activeTab]

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-white text-3xl font-bold tracking-tight font-serif">NSE 100 Swing Trading</h1>
        <p className="text-zinc-500 text-sm mt-1">A complete framework for 10% weekly profit targets — built on decades of market expert consensus</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 border-b border-zinc-800 mb-6 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={[
              'px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0',
              activeTab === tab.id
                ? 'text-[#FF8000] border-b-2 border-[#FF8000] -mb-px'
                : 'text-zinc-500 hover:text-zinc-300',
            ].join(' ')}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active section */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <ActiveSection />
      </motion.div>
    </div>
  )
}
```

- [ ] **Step 3: Create stub files for all 8 sections** (one-liner each so imports don't break)

```tsx
// components/finance/playbook/sections/Overview.tsx
export default function Overview() { return <div className="text-zinc-400">Overview</div> }
```

Repeat the same pattern for: `MarketPrinciples.tsx`, `Indicators.tsx`, `Algorithms.tsx`, `StockScanner.tsx`, `RiskMoney.tsx`, `Psychology.tsx`, `WeeklyPlaybook.tsx` — each just exports a named default with its section name as the text.

- [ ] **Step 4: Verify the page builds**

```bash
cd /Users/harshatd/Documents/harshat/git_projects/HARSHATDY_PORTFOLIO/Harshatdy_Portfolio
npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors related to new files.

- [ ] **Step 5: Commit**

```bash
git add app/finance/playbook/page.tsx components/finance/playbook/
git commit -m "feat: scaffold /finance/playbook route and PlaybookShell tab nav"
```

---

## Task 2: Overview section

**Files:**
- Modify: `components/finance/playbook/sections/Overview.tsx`

- [ ] **Step 1: Implement Overview**

```tsx
// components/finance/playbook/sections/Overview.tsx
export default function Overview() {
  const stats = [
    { value: '10%', label: 'Weekly profit target', color: 'text-[#FF8000]' },
    { value: '2–7', label: 'Days avg hold time', color: 'text-teal-400' },
    { value: '3:1', label: 'Reward-to-risk ratio', color: 'text-green-400' },
    { value: '2%', label: 'Max risk per trade', color: 'text-purple-400' },
  ]

  const frameworks = [
    { step: '1. Market Context', body: 'Is Nifty trending? Sector rotation? Macro events?', color: 'bg-purple-400' },
    { step: '2. Stock Selection', body: 'Filter NSE 100 by momentum, volume, relative strength', color: 'bg-blue-400' },
    { step: '3. Chart Analysis', body: 'Pattern + indicator confluence at key price levels', color: 'bg-teal-400' },
    { step: '4. Entry Execution', body: 'Trigger candles, precise entry, stop placement', color: 'bg-[#FF8000]' },
    { step: '5. Trade Management', body: 'Trailing stop, partial profit, full exit rules', color: 'bg-green-400' },
  ]

  const experts = [
    { name: 'Mark Minervini', body: 'SEPA methodology — buy fundamentally strong stocks at precise technical breakouts with tight stops. 97% win rate years proved it\'s about quality of setup, not frequency.' },
    { name: 'William O\'Neil', body: 'CAN SLIM — buy stocks with strong earnings, new highs, institutional buying, and market follow-through days. Cup-with-handle and flat base patterns remain the most reliable breakout setups.' },
    { name: 'Stan Weinstein', body: 'Stage Analysis — only buy in Stage 2 (advancing), never in Stage 1 (basing), never in Stage 3 (topping), never in Stage 4 (declining).' },
    { name: 'Nicolas Darvas', body: 'Buy breakouts from "boxes" (tight consolidation ranges) with expanding volume. Works exceptionally well on NSE mid and large caps during trending markets.' },
    { name: 'Richard Dennis', body: 'Turtle trading rules — trend following with defined entry/exit rules removes emotion. The system wins by cutting losses ruthlessly and letting winners run.' },
    { name: 'IBD Methodology', body: 'Relative Strength Rank, Earnings growth, and institutional accumulation are the three pillars. Applied to NSE 100: focus on stocks where FII/DII are actively accumulating.' },
  ]

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className={`text-3xl font-bold font-serif ${s.color}`}>{s.value}</div>
            <div className="text-zinc-500 text-xs uppercase tracking-widest mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* What is swing trading */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h3 className="text-[#FF8000] text-xs font-bold uppercase tracking-widest mb-3">What is Swing Trading?</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Swing trading captures "swings" — price moves within a larger trend. Unlike day trading (exits same day) or investing (months/years), swing trading holds for 2–7 days, catching the meat of a price move. In NSE 100 stocks, a 10% move per week is achievable but requires strict discipline.
          </p>
          <div className="mt-4 border-t border-zinc-800 pt-4">
            <h3 className="text-[#FF8000] text-xs font-bold uppercase tracking-widest mb-3">The 10% Reality Check</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              10% per week compounded = 142x annually. This is not realistic every week.{' '}
              <span className="text-[#FF8000] font-semibold">Target 3–4 qualifying trades monthly</span>, not every week. Professionals aim for 40–60% annual returns.
            </p>
          </div>
        </div>

        {/* 5-layer framework */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h3 className="text-[#FF8000] text-xs font-bold uppercase tracking-widest mb-4">The 5-Layer Framework</h3>
          <div className="relative pl-5 space-y-4">
            <div className="absolute left-1.5 top-2 bottom-2 w-px bg-zinc-700" />
            {frameworks.map((f) => (
              <div key={f.step} className="relative">
                <div className={`absolute -left-[14px] top-1 w-2.5 h-2.5 rounded-full ${f.color} border-2 border-black`} />
                <div className="text-white text-sm font-semibold">{f.step}</div>
                <div className="text-zinc-500 text-xs mt-0.5">{f.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expert consensus */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-[#FF8000] text-xs font-bold uppercase tracking-widest mb-4">Expert Consensus — What Actually Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {experts.map((e) => (
            <div key={e.name}>
              <span className="inline-block text-xs font-bold text-[#FF8000] border border-[#FF8000]/30 bg-[#FF8000]/10 rounded px-2 py-0.5 mb-2">{e.name}</span>
              <p className="text-zinc-400 text-xs leading-relaxed">{e.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/finance/playbook/sections/Overview.tsx
git commit -m "feat: implement Playbook Overview section"
```

---

## Task 3: Market Principles section

**Files:**
- Modify: `components/finance/playbook/sections/MarketPrinciples.tsx`

- [ ] **Step 1: Implement MarketPrinciples**

```tsx
// components/finance/playbook/sections/MarketPrinciples.tsx
export default function MarketPrinciples() {
  const stages = [
    { label: 'STAGE 1 — BASING', body: 'Price sideways, 30W MA flat. Institutions quietly accumulating. Do NOT buy yet. Watch for breakout.', color: 'text-zinc-400', border: 'border-zinc-700' },
    { label: 'STAGE 2 — ADVANCING ✓', body: 'Price above rising 30W MA. Higher highs, higher lows. Buy here. Add on pullbacks to MA.', color: 'text-green-400', border: 'border-green-800' },
    { label: 'STAGE 3 — TOPPING', body: 'Price churning at highs, 30W MA flattening. Distribution by institutions. Exit positions.', color: 'text-[#FF8000]', border: 'border-orange-800' },
    { label: 'STAGE 4 — DECLINING', body: 'Price below falling 30W MA. Lower highs, lower lows. Never buy. Short only if experienced.', color: 'text-red-400', border: 'border-red-900' },
  ]

  const sectors = [
    { name: 'Financial Services', pct: 36 },
    { name: 'IT & Tech', pct: 15 },
    { name: 'Oil & Gas', pct: 12 },
    { name: 'Consumer Goods', pct: 10 },
    { name: 'Pharma & Health', pct: 8 },
    { name: 'Automobiles', pct: 6 },
    { name: 'Metals', pct: 5 },
    { name: 'Others', pct: 8 },
  ]

  const indiaFactors = [
    { icon: '◆', color: 'text-teal-400', title: 'FII/DII Data', body: 'Check SEBI FII/DII daily data. FII buying = bullish fuel. FII selling = exit signal. Available on NSE website daily.' },
    { icon: '◆', color: 'text-teal-400', title: 'India VIX', body: 'Volatility index. Above 20 = dangerous for swings, reduce position. Below 15 = calm market, normal sizing.' },
    { icon: '◆', color: 'text-teal-400', title: 'NSE Option Chain', body: 'PCR (Put-Call Ratio) above 1.2 = bullish. Below 0.8 = bearish. Max Pain level = price will gravitate to at expiry.' },
    { icon: '◆', color: 'text-teal-400', title: 'Expiry Effect', body: 'Weekly expiry Thursday causes volatility. Avoid new entries on Weds/Thurs unless clear setup.' },
    { icon: '◆', color: 'text-purple-400', title: 'Budget / Result Season', body: 'Q1 results (Jul-Aug), Q2 (Oct-Nov), Q3 (Jan-Feb), Q4 (Apr-May). Stocks move 10–30% on results.' },
    { icon: '◆', color: 'text-purple-400', title: 'RBI Policy', body: 'Bi-monthly MPC meetings. Rate changes affect banking, NBFC, real estate stocks significantly.' },
    { icon: '◆', color: 'text-purple-400', title: 'US Market Correlation', body: 'Nifty has ~0.6 correlation with S&P 500. Global sell-offs drag NSE down regardless of domestic fundamentals.' },
  ]

  return (
    <div className="space-y-6">
      {/* Principle 1 */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-[#FF8000] text-xs font-bold uppercase tracking-widest mb-3">Principle 1 — Market Hierarchy</h3>
        <div className="border-l-2 border-[#FF8000] pl-4 py-2 bg-zinc-800/50 rounded-r-lg mb-4 text-sm text-zinc-300">
          <strong className="text-white">Nifty 50 trend → Nifty 100 sector → Individual stock direction.</strong> A stock in a bearish market that looks bullish will usually fail.
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { label: 'Bull Market Rules', color: 'text-green-400', body: 'Buy breakouts aggressively. Shallow dips are buying opportunities. Add to winners. Nifty above 200 DMA with rising slope.' },
            { label: 'Sideways/Choppy', color: 'text-[#FF8000]', body: 'Reduce position size. Trade only the clearest setups. Nifty between key MAs, no clear direction. Mean reversion better than breakouts.' },
            { label: 'Bear Market Rules', color: 'text-red-400', body: 'Drastically reduce exposure. Fewer trades. Cash is a position. Only short-side or wait. Nifty below 200 DMA, falling slope.' },
          ].map((c) => (
            <div key={c.label} className="bg-zinc-800 rounded-lg p-3">
              <div className={`text-xs font-bold uppercase tracking-widest mb-2 ${c.color}`}>{c.label}</div>
              <p className="text-zinc-400 text-xs leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Principle 2 */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-[#FF8000] text-xs font-bold uppercase tracking-widest mb-3">Principle 2 — Price & Volume: The Only Truth</h3>
        <p className="text-zinc-400 text-sm mb-4">Price is the ultimate indicator. Volume confirms intention. Richard Wyckoff built an entire school of thought solely on price-volume relationships.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-semibold text-green-400 mb-2">Bullish Volume Signals</div>
            {['Breakout on 2x+ average volume = institutional buying (Accumulation)', 'Price rising, volume rising = healthy uptrend', 'Price dips on low volume = weak selling, hold'].map((s) => (
              <div key={s} className="border-l-2 border-green-700 pl-3 py-1.5 bg-zinc-800/40 rounded-r mb-2 text-xs text-zinc-300">{s}</div>
            ))}
          </div>
          <div>
            <div className="text-xs font-semibold text-red-400 mb-2">Bearish Volume Signals</div>
            {['Price rising on declining volume = exhaustion, exit soon', 'Breakdown on heavy volume = Distribution, get out', 'High volume at resistance with little progress = sellers absorbing buyers'].map((s) => (
              <div key={s} className="border-l-2 border-red-800 pl-3 py-1.5 bg-zinc-800/40 rounded-r mb-2 text-xs text-zinc-300">{s}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Principle 3 */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-[#FF8000] text-xs font-bold uppercase tracking-widest mb-3">Principle 3 — Support, Resistance & Structure</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 text-sm text-zinc-400 leading-relaxed">
            <p>Price remembers. The more times a level is tested, the more significant the eventual break.</p>
            {[
              ['Previous highs become resistance', '— sellers who are trapped at these levels sell when price returns'],
              ['Broken resistance becomes support', '— old sellers become new buyers (flip of polarity)'],
              ['Round numbers (1000, 2500, 500)', '— psychological levels with huge option OI'],
              ['52-week highs', '— NSE stocks that break 52W high with volume go up avg 15–25% more'],
            ].map(([title, sub]) => (
              <div key={title} className="flex gap-2">
                <span className="text-[#FF8000] mt-0.5">▸</span>
                <span><strong className="text-white">{title}</strong>{sub}</span>
              </div>
            ))}
          </div>
          <div>
            <div className="text-xs font-bold text-[#FF8000] uppercase tracking-widest mb-3">Nifty 100 Sector Weightages</div>
            {sectors.map((s) => (
              <div key={s.name} className="flex items-center gap-2 mb-2 text-xs">
                <span className="text-zinc-400 w-36 flex-shrink-0">{s.name}</span>
                <div className="flex-1 h-1.5 bg-zinc-800 rounded overflow-hidden">
                  <div className="h-full bg-teal-500 rounded" style={{ width: `${s.pct}%` }} />
                </div>
                <span className="text-zinc-500 w-8 text-right">{s.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Principle 4 */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-[#FF8000] text-xs font-bold uppercase tracking-widest mb-4">Principle 4 — Trend Phases (Dow Theory + Weinstein Stages)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stages.map((s) => (
            <div key={s.label} className={`bg-zinc-800 border rounded-lg p-3 ${s.border}`}>
              <div className={`text-xs font-bold uppercase tracking-widest mb-2 ${s.color}`}>{s.label}</div>
              <p className="text-zinc-400 text-xs leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Principle 5 */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-[#FF8000] text-xs font-bold uppercase tracking-widest mb-4">Principle 5 — Indian Market Specifics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {indiaFactors.map((f) => (
            <div key={f.title} className="flex gap-2 text-sm">
              <span className={`mt-0.5 flex-shrink-0 ${f.color}`}>{f.icon}</span>
              <span className="text-zinc-400"><strong className="text-white">{f.title}</strong> — {f.body}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/finance/playbook/sections/MarketPrinciples.tsx
git commit -m "feat: implement Playbook Market Principles section"
```

---

## Task 4: Indicators section (interactive)

**Files:**
- Modify: `components/finance/playbook/sections/Indicators.tsx`

- [ ] **Step 1: Implement Indicators with click-to-expand detail panel**

```tsx
// components/finance/playbook/sections/Indicators.tsx
"use client"

import { useState } from 'react'

const INDICATORS = [
  { name: 'RSI', cat: 'Momentum', color: 'bg-purple-400',
    formula: 'RSI = 100 - [100/(1 + RS)] where RS = Avg Gain / Avg Loss over 14 periods',
    signal: '<30 = Oversold (potential buy). >70 = Overbought (potential sell). 50-70 = sweet zone for swing longs.',
    use: 'Enter when RSI crosses above 55 in an uptrend. Exit when RSI crosses below 70 from above. RSI divergence (price new high, RSI lower high) = warning signal.',
    avoid: 'Never buy simply because RSI is "oversold" — a stock can stay oversold for months in a downtrend.' },
  { name: 'MACD', cat: 'Trend/Momentum', color: 'bg-blue-400',
    formula: 'MACD Line = EMA(12) - EMA(26)\nSignal Line = EMA(9) of MACD\nHistogram = MACD - Signal',
    signal: 'Bullish: MACD line crosses above signal line. Histogram turns positive. Best when crossing above zero line.',
    use: 'MACD crossover + bullish candle pattern + volume = powerful combination. Use histogram expansion as trend confirmation.',
    avoid: 'MACD lags — it\'s a confirmation tool, not a leading indicator. In choppy markets, multiple false crossovers occur.' },
  { name: 'EMA 20/50/200', cat: 'Trend', color: 'bg-[#FF8000]',
    formula: 'EMA(n) = Price × (2/(n+1)) + EMA_prev × (1 - 2/(n+1))',
    signal: 'Golden Cross (50 crosses above 200) = major bullish signal. Price above EMA 20 = short-term uptrend. EMA 20 > 50 > 200 = full bull alignment.',
    use: 'Use EMA 20 as dynamic support for trailing stops in swing trades. Pullback to EMA 20 in uptrend = buy opportunity. Break below EMA 50 = reduce position.',
    avoid: 'EMAs are lagging. In sideways markets they give no information — price will oscillate around them with whipsaws.' },
  { name: 'Bollinger Bands', cat: 'Volatility', color: 'bg-teal-400',
    formula: 'Middle Band = SMA(20)\nUpper Band = SMA + 2×StdDev\nLower Band = SMA - 2×StdDev',
    signal: 'Band Squeeze (bands narrow) = upcoming volatility explosion. Break above upper band on volume = bullish momentum.',
    use: 'After a Bollinger Squeeze, buy the breakout direction with volume confirmation. For mean-reversion: buy touch of lower band only if RSI is 30-50 and trend is up.',
    avoid: 'Don\'t trade touches alone. In strong trends price "walks the upper band" for weeks — this is strength, not reversal.' },
  { name: 'Volume', cat: 'Confirmation', color: 'bg-green-400',
    formula: 'OBV = Running total of volume with + on up days, - on down days\nVolume MA = SMA(20) of daily volume',
    signal: 'Breakout on 2x+ average volume = institutional interest. Rising price + falling volume = trend weakening.',
    use: 'Every entry must have volume > 1.5x 20-day average on breakout day. No volume = fake breakout, skip trade.',
    avoid: 'Don\'t use volume alone. In pre-results periods, volume spikes on speculation, not genuine institutional activity.' },
  { name: 'ADX', cat: 'Trend Strength', color: 'bg-red-400',
    formula: 'ADX = Smoothed Moving Avg of DX\nDX = |+DI - -DI| / |+DI + -DI| × 100',
    signal: 'ADX > 25 = strong trend, breakout strategies work. ADX < 20 = choppy market, avoid breakouts.',
    use: 'Only enter breakout trades when ADX is above 20 and rising. If ADX is below 20, use mean-reversion setups instead.',
    avoid: 'ADX tells you trend strength but not direction. A falling stock can have ADX > 25. Always combine with +DI/-DI.' },
  { name: 'Stochastic', cat: 'Momentum', color: 'bg-[#FF8000]',
    formula: '%K = (Current Close - Lowest Low)/(Highest High - Lowest Low) × 100\n%D = 3-period SMA of %K',
    signal: '<20 = Oversold. >80 = Overbought. %K crossing above %D in oversold zone = buy signal.',
    use: 'Use for timing pullback entries in uptrends. When stock pulls back to EMA 20 and Stochastic is below 30, entering on %K/%D cross is high probability.',
    avoid: 'Like RSI, ignore oversold signals in downtrends. Only use in context of overall uptrend.' },
  { name: 'Fibonacci', cat: 'Price Levels', color: 'bg-purple-400',
    formula: 'Key levels: 23.6%, 38.2%, 50%, 61.8% retracement of prior swing move',
    signal: '38.2% and 61.8% retracements are the highest probability pullback zones. 61.8% is the "golden ratio".',
    use: 'After a strong up-move, wait for pullback to 38.2–61.8% zone, then look for reversal candles + RSI bounce + volume drying up.',
    avoid: 'Don\'t use Fibonacci in isolation. If price breaks below 61.8% of the prior move, the "pullback" is probably a new downtrend.' },
  { name: 'VWAP', cat: 'Institutional', color: 'bg-teal-400',
    formula: 'VWAP = Cumulative(Price × Volume) / Cumulative Volume (Resets daily)',
    signal: 'Price above VWAP = buyers in control. Below VWAP = sellers in control. Institutional algorithms use VWAP for order execution.',
    use: 'Stocks that gap up and hold above VWAP for first 30 mins = strong for the day. Use VWAP as intraday stop for swing positions entered intraday.',
    avoid: 'VWAP resets daily, so it\'s an intraday tool. Don\'t apply it to swing trade exits.' },
  { name: 'SuperTrend', cat: 'Trend', color: 'bg-green-400',
    formula: 'SuperTrend = (High+Low)/2 ± (Multiplier × ATR)\nDefault: Period=7, Multiplier=3',
    signal: 'Green SuperTrend below price = bullish. Red SuperTrend above price = bearish. Flip from red to green = buy signal.',
    use: 'Many Indian traders use SuperTrend as a simple trailing stop. When SuperTrend flips to green, enter. Trail with SuperTrend line.',
    avoid: 'In sideways markets, SuperTrend flips repeatedly creating many false signals and stop-outs.' },
  { name: 'ATR', cat: 'Volatility', color: 'bg-red-400',
    formula: 'ATR = Smoothed Moving Avg of True Range\nTrue Range = Max(High-Low, |High-PrevClose|, |Low-PrevClose|)',
    signal: 'High ATR = high volatility, widen stops. Low ATR = low volatility (squeeze). ATR breakout = volatility expansion starting.',
    use: 'Set stop-loss as Entry Price - 2×ATR. This adapts to each stock\'s volatility. A ₹200 stock with ATR 8 needs stop at 16 below entry.',
    avoid: 'ATR doesn\'t give direction — only magnitude. Always combine with directional indicator.' },
  { name: 'OBV', cat: 'Volume', color: 'bg-blue-400',
    formula: 'OBV = OBV_prev + Volume (if close > prev close)\nOBV = OBV_prev - Volume (if close < prev close)',
    signal: 'OBV making new highs while price makes new highs = confirmed uptrend. OBV diverging downward while price still rising = distribution warning.',
    use: 'Use OBV divergence as early warning of institutional selling even before price drops. If OBV starts declining while price holds — reduce exposure.',
    avoid: 'OBV is a cumulative measure and can diverge for extended periods before price follows. Don\'t act on divergence alone.' },
]

export default function Indicators() {
  const [selected, setSelected] = useState<number | null>(null)

  const ind = selected !== null ? INDICATORS[selected] : null

  return (
    <div className="space-y-4">
      <p className="text-zinc-500 text-sm">Click any indicator card to see formula, signals, and how to use it in NSE swing trades.</p>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {INDICATORS.map((i, idx) => (
          <button
            key={i.name}
            onClick={() => setSelected(selected === idx ? null : idx)}
            className={[
              'bg-zinc-900 border rounded-lg p-3 text-left transition-all',
              selected === idx
                ? 'border-[#FF8000]/50 bg-[#FF8000]/5'
                : 'border-zinc-800 hover:border-zinc-700',
            ].join(' ')}
          >
            <div className="flex items-start justify-between">
              <span className="text-white text-sm font-semibold">{i.name}</span>
              <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1 ${i.color}`} />
            </div>
            <div className="text-zinc-500 text-xs mt-0.5">{i.cat}</div>
          </button>
        ))}
      </div>

      {/* Detail panel */}
      {ind ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
          <h3 className="text-[#FF8000] text-sm font-bold">{ind.name} — {ind.cat}</h3>
          <div>
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Formula</div>
            <pre className="font-mono text-xs text-teal-400 bg-black border border-zinc-800 rounded p-3 whitespace-pre-wrap leading-relaxed">{ind.formula}</pre>
          </div>
          <div>
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Signals</div>
            <p className="text-zinc-400 text-sm leading-relaxed">{ind.signal}</p>
          </div>
          <div>
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">How to Use for NSE Swings</div>
            <p className="text-zinc-400 text-sm leading-relaxed">{ind.use}</p>
          </div>
          <div>
            <div className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2">⚠ Common Mistake</div>
            <p className="text-zinc-400 text-sm leading-relaxed">{ind.avoid}</p>
          </div>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-center justify-center h-24">
          <p className="text-zinc-600 text-sm">← Select an indicator above to see details</p>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/finance/playbook/sections/Indicators.tsx
git commit -m "feat: implement Playbook Indicators section with interactive detail panel"
```

---

## Task 5: Algorithms section (expandable cards)

**Files:**
- Modify: `components/finance/playbook/sections/Algorithms.tsx`

- [ ] **Step 1: Implement Algorithms**

```tsx
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
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/finance/playbook/sections/Algorithms.tsx
git commit -m "feat: implement Playbook Algorithms section with expandable cards"
```

---

## Task 6: Stock Scanner section

**Files:**
- Modify: `components/finance/playbook/sections/StockScanner.tsx`

- [ ] **Step 1: Implement StockScanner**

```tsx
// components/finance/playbook/sections/StockScanner.tsx
export default function StockScanner() {
  const stage1 = [
    { n: 1, title: 'Market Condition Check', body: 'Nifty 50: above 200 DMA? India VIX below 20? FII data from NSE: net buyers or sellers this week? If all bad — no trading today, wait.' },
    { n: 2, title: 'Sector Strength Scan', body: 'On TradingView/Chartink: which NSE sectors are showing highest RS (Relative Strength) vs Nifty in last 20 days? Only look for trades in top 2-3 sectors.' },
    { n: 3, title: 'Volume Surge Filter', body: 'Screener.in filter: Volume today > 150% of 20-day average AND Price change > 2%. This catches stocks with institutional activity.' },
    { n: 4, title: '52-Week High Proximity', body: 'Filter stocks within 5-10% of 52-week high. Stocks near new highs continue higher more than "cheap" stocks far from highs.' },
  ]

  const stage2 = [
    { n: 5, title: 'Trend Confirmation', body: 'EMA 20 > EMA 50 > EMA 200 on daily chart (bullish alignment). Price above all three EMAs. This is non-negotiable for long trades.' },
    { n: 6, title: 'Pattern Identification', body: 'Is there a recognized setup? Cup with handle, Bull flag, Darvas box breakout, ascending triangle, VCP. No clear pattern = no trade.' },
    { n: 7, title: 'Indicator Confluence', body: 'At minimum 3 indicators must agree: RSI 50-70 range (not overbought), MACD bullish crossover or histogram expanding, volume at pattern breakout > 1.5x average.' },
    { n: 8, title: 'Support/Stop Level', body: 'Identify the stop-loss level BEFORE entry. Must be a clear technical level — recent swing low, pattern low, or key EMA. Stop should be max 5-7% below entry for 10% target (R:R ≥ 1.5:1).' },
  ]

  const stockCategories = [
    { label: 'High Momentum', color: 'text-teal-400', stocks: 'ADANIPORTS, BAJFINANCE, HDFCBANK, ICICIBANK, KOTAKBANK, RELIANCE, TATAMOTORS, TATAPOWER, BAJAJFINSV, SBILIFE' },
    { label: 'High Beta (10%+ movers)', color: 'text-purple-400', stocks: 'TATASTEEL, HINDALCO, JSWSTEEL, SBIN, INDUSINDBK, IDEA, VEDL, ADANIENT, BANKBARODA, CANBK' },
    { label: 'Trend Quality', color: 'text-[#FF8000]', stocks: 'INFY, TCS, WIPRO, HCLTECH, TITAN, DMART, ASIANPAINT, NESTLEIND, BRITANNIA, PIDILITIND' },
  ]

  const entryTriggers = [
    'Breakout candle closes above resistance on daily chart',
    'Volume on breakout day ≥ 1.5x 20-day average volume',
    'RSI crossing above 55 or confirming at 60–65 zone',
    'MACD line crossing above signal line',
  ]

  const exitRules = [
    'Target hit: 10% profit — book 50%, trail rest',
    'Stop-loss hit: Exit 100%, no averaging down',
    'Time stop: 5 days without meaningful move — exit',
    'Breakdown below key EMA — exit regardless of P&L',
  ]

  function ChecklistItem({ n, title, body }: { n: number; title: string; body: string }) {
    return (
      <div className="flex gap-3 py-3 border-b border-zinc-800/50 last:border-0">
        <div className="w-6 h-6 rounded-full bg-[#FF8000]/10 text-[#FF8000] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{n}</div>
        <div>
          <div className="text-white text-sm font-semibold">{title}</div>
          <div className="text-zinc-400 text-xs mt-1 leading-relaxed">{body}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-[#FF8000] text-xs font-bold uppercase tracking-widest mb-3">Stage 1 — Universe Filter (Daily, Takes 10 mins)</h3>
        {stage1.map((item) => <ChecklistItem key={item.n} {...item} />)}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-[#FF8000] text-xs font-bold uppercase tracking-widest mb-3">Stage 2 — Technical Qualification (Chart-by-Chart)</h3>
        {stage2.map((item) => <ChecklistItem key={item.n} {...item} />)}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-[#FF8000] text-xs font-bold uppercase tracking-widest mb-4">Stage 3 — Entry Execution Criteria</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-950/30 border border-green-900/40 rounded-lg p-4">
            <div className="text-green-400 text-xs font-bold uppercase tracking-widest mb-3">Entry Triggers (All 3 Preferred)</div>
            <div className="space-y-2">
              {entryTriggers.map((t) => <div key={t} className="text-zinc-300 text-xs flex gap-2"><span className="text-green-400 flex-shrink-0">✓</span>{t}</div>)}
              <div className="text-green-400 text-xs mt-3">Enter at open next day after breakout close, or on same-day close</div>
            </div>
          </div>
          <div className="bg-red-950/30 border border-red-900/40 rounded-lg p-4">
            <div className="text-red-400 text-xs font-bold uppercase tracking-widest mb-3">Exit Rules (First to trigger wins)</div>
            <div className="space-y-2">
              {exitRules.map((t) => <div key={t} className="text-zinc-300 text-xs flex gap-2"><span className="text-red-400 flex-shrink-0">✓</span>{t}</div>)}
              <div className="text-red-400 text-xs mt-3">Never hold through earnings without specific plan</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-[#FF8000] text-xs font-bold uppercase tracking-widest mb-4">Top NSE 100 Swing Trading Stocks (By Category)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stockCategories.map((c) => (
            <div key={c.label}>
              <div className={`text-xs font-bold uppercase tracking-widest mb-2 ${c.color}`}>{c.label}</div>
              <p className="text-zinc-400 text-xs leading-relaxed">{c.stocks}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Type-check and commit**

```bash
npx tsc --noEmit 2>&1 | head -20
git add components/finance/playbook/sections/StockScanner.tsx
git commit -m "feat: implement Playbook Stock Scanner section"
```

---

## Task 7: Risk & Money section (interactive calculator)

**Files:**
- Modify: `components/finance/playbook/sections/RiskMoney.tsx`

- [ ] **Step 1: Implement RiskMoney with position size calculator**

```tsx
// components/finance/playbook/sections/RiskMoney.tsx
"use client"

import { useState } from 'react'

export default function RiskMoney() {
  const [capital, setCapital] = useState(500000)
  const [riskPct, setRiskPct] = useState(2)
  const [stopPct, setStopPct] = useState(5)
  const [stockPrice, setStockPrice] = useState(1000)

  const riskAmount = capital * riskPct / 100
  const positionSize = stopPct > 0 ? riskAmount / (stopPct / 100) : 0
  const numShares = stockPrice > 0 ? Math.floor(positionSize / stockPrice) : 0
  const targetProfit = numShares * stockPrice * 0.10

  function fmt(n: number) {
    return '₹' + Math.round(n).toLocaleString('en-IN')
  }

  const rules = [
    'Never risk more than 1-2% of capital on a single trade. On ₹5L capital = max ₹5,000–₹10,000 risk per trade.',
    'Position size from your stop, not from a fixed amount. If stop is 5% away, your position = (2% capital risk) ÷ (5% stop) = 40% of capital max.',
    'Maximum portfolio risk at any time: 6–8%. If in 4 trades each risking 2%, one bad day can\'t blow you up.',
    'If you lose 10% of capital in a week, stop trading for 2 weeks. This prevents the emotional spiral that destroys accounts.',
  ]

  const rrRows = [
    { rr: '1:1', winRate: '50%', verdict: 'Too Low', color: 'text-red-400' },
    { rr: '1.5:1', winRate: '40%', verdict: 'Acceptable', color: 'text-purple-400' },
    { rr: '2:1', winRate: '33%', verdict: 'Good', color: 'text-green-400' },
    { rr: '3:1', winRate: '25%', verdict: 'Excellent', color: 'text-green-400' },
    { rr: '4:1+', winRate: '20%', verdict: 'Target This', color: 'text-green-400' },
  ]

  return (
    <div className="space-y-6">
      {/* Golden rules */}
      <div className="bg-zinc-900 border border-[#FF8000]/30 rounded-xl p-5">
        <h3 className="text-[#FF8000] text-xs font-bold uppercase tracking-widest mb-4">The Golden Rules (from Jack Schwager's Market Wizards)</h3>
        <div className="space-y-2">
          {rules.map((r, i) => (
            <div key={i} className="border-l-2 border-[#FF8000] pl-4 py-2 bg-zinc-800/40 rounded-r text-sm text-zinc-300">
              <span className="font-bold text-white">{i + 1}.</span> {r}
            </div>
          ))}
        </div>
      </div>

      {/* Position size calculator */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-[#FF8000] text-xs font-bold uppercase tracking-widest mb-4">Position Sizing Calculator</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {[
              { label: 'Capital (₹)', value: capital, onChange: setCapital, step: 10000, min: 10000, max: 10000000 },
              { label: 'Risk per trade (%)', value: riskPct, onChange: setRiskPct, step: 0.5, min: 0.5, max: 5 },
              { label: 'Stop distance (%)', value: stopPct, onChange: setStopPct, step: 0.5, min: 1, max: 15 },
              { label: 'Stock price (₹)', value: stockPrice, onChange: setStockPrice, step: 10, min: 1, max: 100000 },
            ].map(({ label, value, onChange, step, min, max }) => (
              <div key={label}>
                <label className="text-xs text-zinc-500 block mb-1">{label}</label>
                <input
                  type="number"
                  value={value}
                  step={step}
                  min={min}
                  max={max}
                  onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FF8000]/50"
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 content-start">
            {[
              { label: 'Max risk amount', value: fmt(riskAmount), color: 'text-[#FF8000]' },
              { label: 'Position size (₹)', value: fmt(positionSize), color: 'text-teal-400' },
              { label: 'Number of shares', value: numShares.toLocaleString('en-IN'), color: 'text-purple-400' },
              { label: 'Target (10% profit)', value: fmt(targetProfit), color: 'text-green-400' },
            ].map((s) => (
              <div key={s.label} className="bg-zinc-800 rounded-lg p-3">
                <div className="text-xs text-zinc-500">{s.label}</div>
                <div className={`text-xl font-bold font-serif mt-1 ${s.color}`}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* R:R table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-[#FF8000] text-xs font-bold uppercase tracking-widest mb-4">Reward-to-Risk Framework</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left py-2 px-3 text-xs text-zinc-500 font-medium uppercase tracking-wider">R:R Ratio</th>
              <th className="text-left py-2 px-3 text-xs text-zinc-500 font-medium uppercase tracking-wider">Win Rate to Break Even</th>
              <th className="text-left py-2 px-3 text-xs text-zinc-500 font-medium uppercase tracking-wider">Verdict</th>
            </tr>
          </thead>
          <tbody>
            {rrRows.map((row) => (
              <tr key={row.rr} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                <td className="py-2.5 px-3 text-white font-medium">{row.rr}</td>
                <td className="py-2.5 px-3 text-zinc-400">{row.winRate}</td>
                <td className="py-2.5 px-3"><span className={`text-xs font-bold ${row.color}`}>{row.verdict}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-3 border-l-2 border-[#FF8000] pl-3 py-2 bg-zinc-800/40 rounded-r text-xs text-zinc-300">
          For 10% target, stop must be no more than 5-6% away (minimum 1.7:1 R:R). Ideally stop at 3-4% for 2.5–3:1 ratio.
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Type-check and commit**

```bash
npx tsc --noEmit 2>&1 | head -20
git add components/finance/playbook/sections/RiskMoney.tsx
git commit -m "feat: implement Playbook Risk & Money section with live position calculator"
```

---

## Task 8: Psychology section

**Files:**
- Modify: `components/finance/playbook/sections/Psychology.tsx`

- [ ] **Step 1: Implement Psychology**

```tsx
// components/finance/playbook/sections/Psychology.tsx
export default function Psychology() {
  const killers = [
    { title: 'Averaging Down Losers', body: 'Buying more of a stock that is going against you. The market doesn\'t know your average price. Stop out, wait for setup to reset.' },
    { title: 'Moving the Stop Loss', body: '"Just a little more" is how small losses become account killers. Stop is placed by analysis, not emotion.' },
    { title: 'Overtrading After Loss', body: 'Revenge trading to recover quickly accelerates losses. One stop-out = stop for the day. Review, journal, come back tomorrow.' },
    { title: 'Selling Winners Too Early', body: 'Fear of giving back profit causes you to exit 3% when setup had 10% potential. Let the system work. Trail, don\'t panic-exit.' },
    { title: 'FOMO Entries', body: 'Chasing stocks already up 8-10% without a setup. You become the exit liquidity for those who bought right. Wait for the next pullback.' },
  ]

  const schedule = [
    { time: 'Pre-Market (8:00–9:00 AM)', body: 'Check SGX Nifty / GIFT Nifty. Note US market close. Check VIX. Review India VIX. Scan for overnight news on holdings.', color: 'border-zinc-700' },
    { time: 'Market Open (9:15–9:30 AM)', body: 'Watch, don\'t trade. Let opening volatility settle. See where Nifty is relative to yesterday\'s close.', color: 'border-zinc-700' },
    { time: 'Entry Window (9:30–11:30 AM)', body: 'Best time for breakout entries. Volume is high, institutions are active. Set limit orders, not market orders.', color: 'border-zinc-700' },
    { time: 'Afternoon Review (1:30–2:30 PM)', body: 'Mid-day lull. Review open positions. No new entries unless exceptional setup.', color: 'border-zinc-700' },
    { time: 'Close Watch (3:00–3:30 PM)', body: 'Watch for end-of-day strength or weakness. Closing price matters most. Set next day\'s alerts.', color: 'border-zinc-700' },
    { time: 'Post-Market (4:00–5:00 PM)', body: 'Journal: what worked, what didn\'t. Screenshot charts. Plan next day\'s watchlist. Emotion debrief.', color: 'border-green-800' },
  ]

  const journalFields = [
    { field: 'Setup Type', what: 'Bull flag, VCP, breakout, etc.', why: 'Track which patterns work best for you' },
    { field: 'Market Context', what: 'Nifty trend, VIX, sector RS', why: 'Identify when you trade best' },
    { field: 'Entry Reason', what: 'All 3 criteria met? Which?', why: 'Forces pre-trade discipline' },
    { field: 'Risk:Reward', what: 'Calculated before entry', why: 'Reject trades with poor R:R' },
    { field: 'Emotional State', what: '1-10 scale, key emotions', why: 'Spot when you trade emotionally' },
    { field: 'Outcome', what: 'P&L, exit reason, duration', why: 'Track expectancy per setup' },
    { field: 'Lesson', what: '1 thing you\'d do differently', why: 'Compound learning over time' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 5 killers */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h3 className="text-[#FF8000] text-xs font-bold uppercase tracking-widest mb-4">The 5 Killers of Retail Traders</h3>
          <div className="relative pl-5 space-y-4">
            <div className="absolute left-1.5 top-2 bottom-2 w-px bg-zinc-700" />
            {killers.map((k, i) => (
              <div key={k.title} className="relative">
                <div className="absolute -left-[14px] top-1 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-black" />
                <div className="text-white text-sm font-semibold">{i + 1}. {k.title}</div>
                <div className="text-zinc-400 text-xs mt-0.5 leading-relaxed">{k.body}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily schedule */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h3 className="text-[#FF8000] text-xs font-bold uppercase tracking-widest mb-4">Building a Bulletproof Process</h3>
          <div className="space-y-2">
            {schedule.map((s) => (
              <div key={s.time} className={`border-l-2 ${s.color} pl-3 py-2 bg-zinc-800/40 rounded-r`}>
                <div className="text-white text-xs font-semibold">{s.time}</div>
                <div className="text-zinc-400 text-xs mt-0.5 leading-relaxed">{s.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Journal framework */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-[#FF8000] text-xs font-bold uppercase tracking-widest mb-2">The Trading Journal Framework</h3>
        <p className="text-zinc-400 text-xs mb-4">Mark Douglas found that traders who kept detailed journals improved win rates by 30–40% within 6 months.</p>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left py-2 px-3 text-zinc-500 font-medium uppercase tracking-wider">Field</th>
              <th className="text-left py-2 px-3 text-zinc-500 font-medium uppercase tracking-wider">What to Record</th>
              <th className="text-left py-2 px-3 text-zinc-500 font-medium uppercase tracking-wider">Why It Matters</th>
            </tr>
          </thead>
          <tbody>
            {journalFields.map((j) => (
              <tr key={j.field} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                <td className="py-2.5 px-3 text-white font-medium">{j.field}</td>
                <td className="py-2.5 px-3 text-zinc-400">{j.what}</td>
                <td className="py-2.5 px-3 text-zinc-500">{j.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Type-check and commit**

```bash
npx tsc --noEmit 2>&1 | head -20
git add components/finance/playbook/sections/Psychology.tsx
git commit -m "feat: implement Playbook Psychology section"
```

---

## Task 9: Weekly Playbook section

**Files:**
- Modify: `components/finance/playbook/sections/WeeklyPlaybook.tsx`

- [ ] **Step 1: Implement WeeklyPlaybook**

```tsx
// components/finance/playbook/sections/WeeklyPlaybook.tsx
export default function WeeklyPlaybook() {
  const days = [
    { name: 'Monday', tag: 'SCAN', color: 'text-blue-400', body: 'Run full NSE 100 scan. Identify top 5 watchlist candidates. Mark all key levels.' },
    { name: 'Tuesday', tag: 'ENTER', color: 'text-green-400', body: 'Best day to enter breakout trades. Volume and momentum tend to peak Tue–Wed.' },
    { name: 'Wednesday', tag: 'MANAGE', color: 'text-[#FF8000]', body: 'Check open positions. Trail stops if up 5%+. Enter any missed Tue setups with caution.' },
    { name: 'Thursday', tag: 'EXPIRY', color: 'text-purple-400', body: 'Weekly F&O expiry. Avoid new equity entries unless unrelated to derivatives. High volatility day.' },
    { name: 'Friday', tag: 'REVIEW', color: 'text-red-400', body: 'Close any trades not hitting target by 3:15 PM. Weekend risk — don\'t hold uncertain positions.' },
  ]

  const checklist = [
    'Nifty in uptrend (above 200 DMA)',
    'Stock\'s sector is outperforming Nifty',
    'India VIX below 20',
    'Stock in Stage 2 (EMA 20 > 50 > 200)',
    'Clear pattern: flag, VCP, cup, box, triangle',
    'RSI 50–70 range (not overbought at entry)',
    'MACD bullish crossover or positive histogram',
    'Breakout on volume ≥ 1.5x 20-day avg',
    'Stop-loss clearly defined at technical level',
    'R:R ratio at least 2:1 (ideally 3:1)',
    'No major result / event within hold period',
    'Position size within 2% capital risk rule',
  ]

  const roadmap = [
    { period: 'Month 1–2: Foundation', color: 'bg-blue-400', body: 'Paper trade only. Master reading candlestick charts, S/R levels, basic indicators (RSI, MACD, Volume). Read: Stan Weinstein\'s "Secrets for Profiting" and O\'Neil\'s "How to Make Money in Stocks".' },
    { period: 'Month 3–4: Pattern Recognition', color: 'bg-teal-400', body: 'Study 500+ historical charts (TradingView replay feature). Identify patterns before the move happens. Start with tiny real capital (₹20–50K).' },
    { period: 'Month 5–6: System Building', color: 'bg-[#FF8000]', body: 'Define YOUR rules precisely. Backtest your best 3 setups over 1 year of NSE data. Read: Minervini\'s "Trade Like a Stock Market Wizard".' },
    { period: 'Month 7–12: Execution Mastery', color: 'bg-green-400', body: 'Scale up capital gradually. Trade with full rules, zero exceptions. Review journal monthly. Read: Mark Douglas "Trading in the Zone". Consistent 40–60% annual returns is realistic at this stage.' },
    { period: 'Year 2+: Specialization', color: 'bg-purple-400', body: 'Develop edge in 1–2 specific setups. Consider sector specialization. Explore adding options for protection. Build screeners.' },
  ]

  return (
    <div className="space-y-6">
      {/* 5-day rhythm */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-[#FF8000] text-xs font-bold uppercase tracking-widest mb-4">The Weekly Rhythm</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {days.map((d) => (
            <div key={d.name} className="bg-zinc-800 rounded-lg p-3 text-center">
              <div className="text-zinc-400 text-xs font-semibold uppercase tracking-widest">{d.name}</div>
              <div className={`text-xs font-bold mt-1 mb-2 ${d.color}`}>{d.tag}</div>
              <div className="text-zinc-500 text-xs leading-relaxed text-left">{d.body}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Setup checklist */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h3 className="text-[#FF8000] text-xs font-bold uppercase tracking-widest mb-4">The Perfect NSE Swing Setup Checklist</h3>
          <div className="space-y-1">
            {checklist.map((item) => (
              <div key={item} className="flex items-start gap-2 py-1.5 border-b border-zinc-800/50 last:border-0 text-xs text-zinc-400">
                <span className="text-green-400 flex-shrink-0 mt-0.5">□</span>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Learning roadmap */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h3 className="text-[#FF8000] text-xs font-bold uppercase tracking-widest mb-4">Learning Roadmap</h3>
          <div className="relative pl-5 space-y-5">
            <div className="absolute left-1.5 top-2 bottom-2 w-px bg-zinc-700" />
            {roadmap.map((r) => (
              <div key={r.period} className="relative">
                <div className={`absolute -left-[14px] top-1 w-2.5 h-2.5 rounded-full ${r.color} border-2 border-black`} />
                <div className="text-white text-sm font-semibold">{r.period}</div>
                <div className="text-zinc-400 text-xs mt-0.5 leading-relaxed">{r.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Type-check and commit**

```bash
npx tsc --noEmit 2>&1 | head -20
git add components/finance/playbook/sections/WeeklyPlaybook.tsx
git commit -m "feat: implement Playbook Weekly Playbook section"
```

---

## Task 10: Add entry points to existing files

**Files:**
- Modify: `app/finance/FinanceShell.tsx`
- Modify: `app/finance/india/IndiaDashboard.tsx`

- [ ] **Step 1: Add Playbook button to FinanceShell**

Replace the entire file content of `app/finance/FinanceShell.tsx`:

```tsx
// app/finance/FinanceShell.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { BookOpen } from "lucide-react"
import FinanceDashboard from "./FinanceDashboard"
import IndiaDashboard from "./india/IndiaDashboard"

const TABS = [
  { id: "india", label: "India · Nifty 50" },
  { id: "global", label: "Global" },
] as const

type Tab = (typeof TABS)[number]["id"]

export default function FinanceShell() {
  const [activeTab, setActiveTab] = useState<Tab>("india")

  return (
    <div className="space-y-0">
      <div className="flex items-center gap-1 border-b border-zinc-800 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={[
              "px-4 py-2 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "text-[#FF8000] border-b-2 border-[#FF8000] -mb-px"
                : "text-zinc-500 hover:text-zinc-300",
            ].join(" ")}
          >
            {tab.label}
          </button>
        ))}
        <Link
          href="/finance/playbook"
          className="ml-auto flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-sm py-2 px-3 transition-colors"
        >
          <BookOpen size={14} />
          Playbook
        </Link>
      </div>

      {activeTab === "india" ? <IndiaDashboard /> : <FinanceDashboard />}
    </div>
  )
}
```

- [ ] **Step 2: Add bottom banner to IndiaDashboard**

In `app/finance/india/IndiaDashboard.tsx`, replace the `<footer>` block (last element before the closing `</motion.div>`) with:

```tsx
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
```

Also add `import Link from 'next/link'` to the import block at the top of `IndiaDashboard.tsx`.

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add app/finance/FinanceShell.tsx app/finance/india/IndiaDashboard.tsx
git commit -m "feat: add Playbook entry points to FinanceShell header and India dashboard banner"
```

---

## Task 11: Final verification

- [ ] **Step 1: Full type-check**

```bash
npx tsc --noEmit 2>&1
```

Expected: no errors.

- [ ] **Step 2: Build check**

```bash
npm run build 2>&1 | tail -30
```

Expected: successful build, no errors.

- [ ] **Step 3: Dev server smoke test**

```bash
npm run dev
```

Manually verify:
- `/finance` loads, tab bar shows "India · Nifty 50", "Global", and "Playbook →" link top-right
- India dashboard shows "Learn the strategy behind these signals" banner at bottom
- Clicking either entry point navigates to `/finance/playbook`
- All 8 tabs in the playbook render without error
- Indicators tab: clicking a card shows detail panel
- Algorithms tab: clicking a card expands it; clicking again collapses it
- Risk & Money tab: changing calculator inputs updates all 4 output values live

- [ ] **Step 4: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "fix: playbook integration smoke test fixes"
```
