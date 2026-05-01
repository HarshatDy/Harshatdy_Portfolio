import type {
  IndiaStockAnalysisResult,
  StrategySignalEntry,
  StrategySignals,
} from '@/app/data/types/indiaFinance'

export interface IndiaStockAnalysisInput {
  ticker: string
  name: string
  currentPrice: number
  score: number
  momentum_score: number
  volume_score: number
  volatility_score: number
  signal: 'BUY' | 'HOLD' | 'SELL'
  // All arrays: newest-first, up to 60 days
  closes: number[]
  volumes: number[]
  highs: number[]
  lows: number[]
  opens: number[]
}

type AlgoResult = { score: number; details: Record<string, string> }

// ─── Math helpers ────────────────────────────────────────────────────────────

function mean(arr: number[]): number {
  if (!arr.length) return 0
  return arr.reduce((s, v) => s + v, 0) / arr.length
}

function sd(arr: number[]): number {
  if (arr.length < 2) return 0
  const m = mean(arr)
  return Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length)
}

function pct(v: number, decimals = 1): string {
  return (v >= 0 ? '+' : '') + v.toFixed(decimals) + '%'
}

function yesNo(b: boolean): string {
  return b ? 'Yes' : 'No'
}

/** EMA on oldest-first array */
function ema(prices: number[], period: number): number[] {
  if (prices.length < period) return []
  const k = 2 / (period + 1)
  const result: number[] = [mean(prices.slice(0, period))]
  for (let i = period; i < prices.length; i++) {
    result.push(prices[i] * k + result[result.length - 1] * (1 - k))
  }
  return result
}

/** RSI series on oldest-first array */
function rsiSeries(closes: number[], period = 14): number[] {
  if (closes.length < period + 1) return []
  let avgG = 0, avgL = 0
  for (let i = 1; i <= period; i++) {
    const d = closes[i] - closes[i - 1]
    if (d > 0) avgG += d; else avgL -= d
  }
  avgG /= period
  avgL /= period
  const result: number[] = [avgL === 0 ? 100 : 100 - 100 / (1 + avgG / avgL)]
  for (let i = period + 1; i < closes.length; i++) {
    const d = closes[i] - closes[i - 1]
    avgG = (avgG * (period - 1) + Math.max(0, d)) / period
    avgL = (avgL * (period - 1) + Math.max(0, -d)) / period
    result.push(avgL === 0 ? 100 : 100 - 100 / (1 + avgG / avgL))
  }
  return result
}

function fmt(n: number, decimals = 2): string {
  return n.toFixed(decimals)
}

/**
 * Convert a 0-100 score to BUY/HOLD/SELL percentage distribution.
 * BUY ≥ 65 | HOLD 35-64 | SELL < 35
 */
function scoreToSignal(score: number, details: Record<string, string>): StrategySignalEntry {
  const s = Math.max(0, Math.min(100, score))
  let buy: number, hold: number, sell: number
  if (s >= 65) {
    buy = Math.round(50 + ((s - 65) / 35) * 50)
    sell = 0
    hold = 100 - buy
  } else if (s >= 35) {
    const dev = s - 50
    buy = Math.max(0, Math.round((dev / 15) * 50))
    sell = Math.max(0, Math.round((-dev / 15) * 50))
    hold = 100 - buy - sell
  } else {
    sell = Math.round(50 + ((35 - s) / 35) * 50)
    buy = 0
    hold = 100 - sell
  }
  const signal: 'BUY' | 'HOLD' | 'SELL' = s >= 65 ? 'BUY' : s >= 35 ? 'HOLD' : 'SELL'
  return { signal, buy, hold, sell, details }
}

// ─── Algorithm 1: VCP ────────────────────────────────────────────────────────

function vcp(closesNF: number[], volumesNF: number[]): AlgoResult {
  const c = [...closesNF].reverse()
  const v = [...volumesNF].reverse()

  if (c.length < 20) return { score: 50, details: { 'Data': 'Insufficient (<20 days)' } }

  const n = Math.min(c.length, 30)
  const w = Math.floor(n / 3)
  const segs = [
    { c: c.slice(0, w), v: v.slice(0, w) },
    { c: c.slice(w, 2 * w), v: v.slice(w, 2 * w) },
    { c: c.slice(2 * w, 3 * w), v: v.slice(2 * w, 3 * w) },
  ]
  const ranges = segs.map((s) => {
    const hi = Math.max(...s.c), lo = Math.min(...s.c), m = mean(s.c)
    return m > 0 ? (hi - lo) / m : 0
  })
  const vols = segs.map((s) => mean(s.v))

  let priceContractions = 0, volContractions = 0
  for (let i = 1; i < 3; i++) {
    if (ranges[i] < ranges[i - 1] * 0.9) priceContractions++
    if (vols[i] < vols[i - 1]) volContractions++
  }

  const recentTight = ranges[2] < 0.04 ? 20 : ranges[2] < 0.08 ? 10 : 0
  const sma20 = mean(c.slice(Math.max(0, c.length - 20)))
  const bullish = c[c.length - 1] > sma20
  const recentHigh = Math.max(...c.slice(Math.max(0, c.length - 20)))
  const nearHigh = c[c.length - 1] / recentHigh > 0.9

  const score = Math.min(100,
    priceContractions * 20 + volContractions * 10 + recentTight +
    (bullish ? 15 : 0) + (nearHigh ? 10 : 0),
  )

  return {
    score,
    details: {
      'Price Contractions': `${priceContractions}/2`,
      'Volume Contractions': `${volContractions}/2`,
      'Window 1 Range': pct(ranges[0] * 100, 2),
      'Window 2 Range': pct(ranges[1] * 100, 2),
      'Window 3 Range (tightest)': pct(ranges[2] * 100, 2),
      'Above 20d SMA': yesNo(bullish),
      'Within 10% of 20d High': yesNo(nearHigh),
    },
  }
}

// ─── Algorithm 2: SEPA ───────────────────────────────────────────────────────

function sepa(closesNF: number[], volumesNF: number[]): AlgoResult {
  const c = [...closesNF].reverse()
  const v = [...volumesNF].reverse()
  if (c.length < 21) return { score: 50, details: { 'Data': 'Insufficient (<21 days)' } }

  const cur = c[c.length - 1]
  const curVol = v[v.length - 1]
  const e21arr = ema(c, 21)
  const e21 = e21arr[e21arr.length - 1]
  const e50arr = c.length >= 50 ? ema(c, 50) : ema(c, Math.min(30, c.length))
  const e50 = e50arr[e50arr.length - 1]
  const high60 = Math.max(...c)
  const low60 = Math.min(...c)
  const avgVol20 = mean(v.slice(Math.max(0, v.length - 20)))
  const price7dAgo = c[Math.max(0, c.length - 8)]
  const mom7d = (cur - price7dAgo) / price7dAgo

  let score = 0
  score += cur > e21 ? 20 : cur > e21 * 0.97 ? 10 : 0
  score += e21 > e50 ? 20 : 0
  score += cur >= high60 * 0.75 ? 15 : cur >= high60 * 0.65 ? 8 : 0
  score += cur >= low60 * 1.25 ? 15 : cur >= low60 * 1.15 ? 8 : 0
  score += mom7d > 0.02 ? 15 : mom7d > 0 ? 8 : 0
  score += curVol > avgVol20 * 1.2 ? 15 : curVol > avgVol20 ? 8 : 0

  return {
    score: Math.min(100, score),
    details: {
      'Price vs EMA21': `₹${fmt(cur, 0)} vs ₹${fmt(e21, 0)}`,
      'EMA21 vs EMA50': `₹${fmt(e21, 0)} vs ₹${fmt(e50, 0)}`,
      'EMA21 > EMA50': yesNo(e21 > e50),
      '% Below 60d High': pct(-((high60 - cur) / high60) * 100),
      '% Above 60d Low': pct(((cur - low60) / low60) * 100),
      '7d Momentum': pct(mom7d * 100),
      'Vol vs 20d Avg': pct(((curVol - avgVol20) / avgVol20) * 100),
    },
  }
}

// ─── Algorithm 3: Cup with Handle ────────────────────────────────────────────

function cupWithHandle(closesNF: number[]): AlgoResult {
  const c = [...closesNF].reverse()
  if (c.length < 30) return { score: 50, details: { 'Data': 'Insufficient (<30 days)' } }

  const n = c.length
  const mid = Math.floor(n / 2)
  const leftRim = Math.max(...c.slice(0, mid))
  const t1 = Math.floor(n / 3), t2 = Math.floor((2 * n) / 3)
  const cupBottom = Math.min(...c.slice(t1, t2))
  const cupDepth = (leftRim - cupBottom) / leftRim
  const cur = c[n - 1]
  const rightRimPct = cur / leftRim
  const last10 = c.slice(Math.max(0, n - 10))
  const handle10High = Math.max(...last10)
  const handle5Low = Math.min(...c.slice(Math.max(0, n - 5)))
  const handleDepth = (handle10High - handle5Low) / handle10High
  const handleOk = handleDepth >= 0.03 && handleDepth <= 0.15

  let score = 0
  score += cupDepth >= 0.1 && cupDepth <= 0.35 ? 25 : cupDepth >= 0.08 && cupDepth <= 0.5 ? 12 : 0
  score += rightRimPct >= 0.95 ? 30 : rightRimPct >= 0.88 ? 20 : rightRimPct >= 0.80 ? 10 : 0
  score += handleOk ? 25 : handleDepth >= 0.01 ? 10 : 0
  score += cur >= handle10High * 0.97 ? 20 : 0

  return {
    score: Math.min(100, score),
    details: {
      'Left Rim (prior high)': `₹${fmt(leftRim, 0)}`,
      'Cup Bottom': `₹${fmt(cupBottom, 0)}`,
      'Cup Depth': pct(cupDepth * 100),
      'Right Rim Recovery': pct(rightRimPct * 100 - 100),
      '10d Handle High': `₹${fmt(handle10High, 0)}`,
      'Handle Depth': pct(handleDepth * 100),
      'Valid Handle (3-15%)': yesNo(handleOk),
      'Near Breakout': yesNo(cur >= handle10High * 0.97),
    },
  }
}

// ─── Algorithm 4: Darvas Box ─────────────────────────────────────────────────

function darvasBox(
  closesNF: number[], volumesNF: number[], highsNF: number[], lowsNF: number[],
): AlgoResult {
  const c = [...closesNF].reverse()
  const v = [...volumesNF].reverse()
  const hi = highsNF.length ? [...highsNF].reverse() : c
  const lo = lowsNF.length ? [...lowsNF].reverse() : c
  if (c.length < 10) return { score: 50, details: { 'Data': 'Insufficient (<10 days)' } }

  const n = c.length
  const lookback = Math.min(20, n - 1)
  const boxHigh = Math.max(...hi.slice(n - lookback - 1, n - 1))
  const boxLow = Math.min(...lo.slice(n - lookback - 1, n - 1))
  const avgVol = mean(v.slice(Math.max(0, n - 20), n - 1))
  const cur = c[n - 1]
  const curVol = v[n - 1]
  const volSpike = avgVol > 0 && curVol > avgVol * 1.5
  const boxRange = (boxHigh - boxLow) / boxLow
  const tightBox = boxRange < 0.1
  let consolidation = 0
  for (let i = n - 2; i >= Math.max(0, n - 20); i--) {
    if (c[i] >= boxLow && c[i] <= boxHigh) consolidation++
    else break
  }

  let score: number
  const position = cur > boxHigh ? 'Above box (breakout)' : cur < boxLow ? 'Below box (breakdown)' : 'Inside box'

  if (cur > boxHigh) {
    score = 65 + (volSpike ? 20 : 0) + (tightBox ? 10 : 0) + (consolidation >= 5 ? 5 : 0)
  } else if (cur < boxLow) {
    score = Math.max(0, 30 - (volSpike ? 15 : 0))
  } else {
    const pos = boxHigh > boxLow ? (cur - boxLow) / (boxHigh - boxLow) : 0.5
    score = Math.round(35 + pos * 30 + (tightBox ? 5 : 0))
  }

  return {
    score: Math.min(100, Math.max(0, score)),
    details: {
      'Box Upper': `₹${fmt(boxHigh, 0)}`,
      'Box Lower': `₹${fmt(boxLow, 0)}`,
      'Box Range': pct(boxRange * 100),
      'Tight Box (<10%)': yesNo(tightBox),
      'Current Position': position,
      'Volume Spike (1.5×)': yesNo(volSpike),
      'Consolidation Days': `${consolidation}d`,
    },
  }
}

// ─── Algorithm 5: EMA Pullback ───────────────────────────────────────────────

function emaPullback(closesNF: number[], volumesNF: number[]): AlgoResult {
  const c = [...closesNF].reverse()
  const v = [...volumesNF].reverse()
  if (c.length < 21) return { score: 50, details: { 'Data': 'Insufficient (<21 days)' } }

  const n = c.length
  const e9arr = ema(c, 9)
  const e21arr = ema(c, 21)
  const e50arr = c.length >= 50 ? ema(c, 50) : ema(c, Math.min(30, c.length))
  const e9 = e9arr[e9arr.length - 1]
  const e21 = e21arr[e21arr.length - 1]
  const e50 = e50arr[e50arr.length - 1]
  const cur = c[n - 1]
  const prev = c[n - 2]
  const curVol = v[n - 1]
  const avgVol10 = mean(v.slice(Math.max(0, n - 10)))
  const bullTrend = e9 > e21 && e21 > e50
  const bearTrend = e9 < e21 && e21 < e50
  const last5c = c.slice(Math.max(0, n - 5))
  const last5e21 = e21arr.slice(Math.max(0, e21arr.length - 5))
  const touchedEMA21 = last5c.some(
    (p, i) => last5e21[i] !== undefined && Math.abs(p / last5e21[i] - 1) <= 0.03,
  )
  const bouncing = cur > e21 && cur > prev
  const volOk = avgVol10 > 0 && curVol > avgVol10 * 1.1

  let score: number
  if (bullTrend) {
    score = 60 + (touchedEMA21 ? 15 : 0) + (bouncing ? 10 : 0) + (volOk ? 10 : 0) + (cur / e21 < 1.1 ? 5 : 0)
  } else if (bearTrend) {
    score = Math.max(0, 30 - (cur < e21 ? 5 : 0))
  } else {
    score = Math.round(45 + (e9 > e21 ? 5 : -5) + (cur > e21 ? 5 : 0))
  }

  return {
    score: Math.min(100, Math.max(0, score)),
    details: {
      'EMA9': `₹${fmt(e9, 0)}`,
      'EMA21': `₹${fmt(e21, 0)}`,
      'EMA50': `₹${fmt(e50, 0)}`,
      'Trend Alignment': bullTrend ? 'Bullish (9>21>50)' : bearTrend ? 'Bearish (9<21<50)' : 'Mixed',
      'Pulled Back to EMA21': yesNo(touchedEMA21),
      'Bouncing Above EMA21': yesNo(bouncing),
      'Volume Expanding': yesNo(volOk),
      'Price vs EMA21': pct(((cur - e21) / e21) * 100),
    },
  }
}

// ─── Algorithm 6: RSI Divergence ─────────────────────────────────────────────

function rsiDivergence(closesNF: number[]): AlgoResult {
  const c = [...closesNF].reverse()
  if (c.length < 20) return { score: 50, details: { 'Data': 'Insufficient (<20 days)' } }

  const rsi = rsiSeries(c, 14)
  if (rsi.length < 10) return { score: 50, details: { 'Data': 'Insufficient for RSI(14)' } }

  const lb = Math.min(20, rsi.length)
  const rc = c.slice(c.length - lb)
  const rr = rsi.slice(rsi.length - lb)
  const half = Math.floor(lb / 2)

  const prevCLow = Math.min(...rc.slice(0, half))
  const currCLow = Math.min(...rc.slice(half))
  const prevCHigh = Math.max(...rc.slice(0, half))
  const currCHigh = Math.max(...rc.slice(half))
  const prevRLow = Math.min(...rr.slice(0, half))
  const currRLow = Math.min(...rr.slice(half))
  const prevRHigh = Math.max(...rr.slice(0, half))
  const currRHigh = Math.max(...rr.slice(half))
  const latestRSI = rsi[rsi.length - 1]
  const oversold = latestRSI < 35
  const overbought = latestRSI > 65
  const bullDiv = currCLow < prevCLow * 0.99 && currRLow > prevRLow + 2
  const bearDiv = currCHigh > prevCHigh * 1.01 && currRHigh < prevRHigh - 2

  let score: number
  if (bullDiv) score = oversold ? 85 : 70
  else if (bearDiv) score = overbought ? 15 : 30
  else if (oversold) score = 58
  else if (overbought) score = 42
  else score = 50

  return {
    score,
    details: {
      'Current RSI(14)': fmt(latestRSI),
      'RSI Zone': oversold ? 'Oversold (<35)' : overbought ? 'Overbought (>65)' : 'Neutral',
      'Bullish Divergence': yesNo(bullDiv),
      'Bearish Divergence': yesNo(bearDiv),
      'Prior Price Low': `₹${fmt(prevCLow, 0)}`,
      'Current Price Low': `₹${fmt(currCLow, 0)}`,
      'Prior RSI Low': fmt(prevRLow),
      'Current RSI Low': fmt(currRLow),
    },
  }
}

// ─── Algorithm 7: Opening Range Breakout ─────────────────────────────────────

function orb(
  closesNF: number[], highsNF: number[], lowsNF: number[], volumesNF: number[],
): AlgoResult {
  const c = [...closesNF].reverse()
  const hi = highsNF.length >= 2 ? [...highsNF].reverse() : c
  const lo = lowsNF.length >= 2 ? [...lowsNF].reverse() : c
  const v = [...volumesNF].reverse()
  if (c.length < 3) return { score: 50, details: { 'Data': 'Insufficient (<3 days)' } }

  const n = c.length
  const cur = c[n - 1]
  const prevH = hi[n - 2]
  const prevL = lo[n - 2]
  const curVol = v[n - 1]
  const avgVol5 = mean(v.slice(Math.max(0, n - 6), n - 1))
  const volExp = avgVol5 > 0 ? curVol / avgVol5 : 1
  const rangeSize = prevL > 0 ? (prevH - prevL) / prevL : 0
  const tight = rangeSize < 0.02
  const trend5d = c[Math.max(0, n - 6)] > 0 ? (cur - c[Math.max(0, n - 6)]) / c[Math.max(0, n - 6)] : 0
  const aboveRange = cur > prevH
  const belowRange = cur < prevL

  let score: number
  if (aboveRange) {
    score = Math.min(100, 65 + (volExp > 1.5 ? 15 : 0) + (tight ? 10 : 0) + (trend5d > 0 ? 10 : 0))
  } else if (belowRange) {
    score = Math.max(0, 35 - (volExp > 1.5 ? 15 : 0) - (tight ? 10 : 0) - (trend5d < 0 ? 10 : 0))
  } else {
    const pos = prevH > prevL ? (cur - prevL) / (prevH - prevL) : 0.5
    score = Math.round(35 + pos * 30)
  }

  return {
    score,
    details: {
      'Prior Session High': `₹${fmt(prevH, 0)}`,
      'Prior Session Low': `₹${fmt(prevL, 0)}`,
      'Prior Range Size': pct(rangeSize * 100),
      'Tight Range (<2%)': yesNo(tight),
      'Current Position': aboveRange ? 'Above range (breakout)' : belowRange ? 'Below range (breakdown)' : 'Inside range',
      'Volume Expansion': `${fmt(volExp, 2)}×`,
      '5d Trend': pct(trend5d * 100),
    },
  }
}

// ─── Algorithm 8: Wyckoff Accumulation ───────────────────────────────────────

function wyckoff(closesNF: number[], volumesNF: number[]): AlgoResult {
  const c = [...closesNF].reverse()
  const v = [...volumesNF].reverse()
  if (c.length < 20) return { score: 50, details: { 'Data': 'Insufficient (<20 days)' } }

  const n = c.length
  const cur = c[n - 1]
  const priceMid = (Math.max(...c) + Math.min(...c)) / 2

  let scVol = 0, scIdx = -1
  for (let i = 0; i < n - 5; i++) {
    if (c[i] < priceMid && v[i] > scVol) { scVol = v[i]; scIdx = i }
  }

  const volDryUp =
    scIdx >= 0 && scIdx < n - 10
      ? mean(v.slice(scIdx + 1, scIdx + 10)) < scVol * 0.6
      : false

  const inMarkup = scIdx >= 0 && cur > c[scIdx]
  const curVol = v[n - 1]
  const avgVol10 = mean(v.slice(Math.max(0, n - 10), n - 1))
  const volExpanding = avgVol10 > 0 && curVol > avgVol10
  const recentSD = sd(c.slice(Math.max(0, n - 10)))
  const recentAvg = mean(c.slice(Math.max(0, n - 10)))
  const lowVol = recentAvg > 0 && recentSD / recentAvg < 0.02
  const sma20 = mean(c.slice(Math.max(0, n - 20)))
  const aboveSMA = cur > sma20

  let score: number
  let phase: string
  if (inMarkup) {
    score = Math.min(100, 60 + (volDryUp ? 15 : 0) + (volExpanding ? 10 : 0) + (aboveSMA ? 10 : 0) + (lowVol ? 5 : 0))
    phase = 'Phase D/E – Markup'
  } else if (scIdx >= 0) {
    score = Math.min(100, 45 + (volDryUp ? 10 : 0) + (lowVol ? 5 : 0))
    phase = 'Phase B/C – Accumulation'
  } else {
    score = aboveSMA ? 55 : 40
    phase = 'No clear SC detected'
  }

  return {
    score,
    details: {
      'Detected Phase': phase,
      'Selling Climax Found': yesNo(scIdx >= 0),
      'SC Price Level': scIdx >= 0 ? `₹${fmt(c[scIdx], 0)}` : 'N/A',
      'Volume Dry-Up Post-SC': yesNo(volDryUp),
      'In Markup (above SC)': yesNo(inMarkup),
      'Volume Expanding': yesNo(volExpanding),
      'Low Volatility (<2%)': yesNo(lowVol),
      'Above 20d SMA': yesNo(aboveSMA),
    },
  }
}

// ─── Target price & rationale ────────────────────────────────────────────────

function calcTarget(currentPrice: number, closes7d: number[], signal: 'BUY' | 'HOLD' | 'SELL') {
  const p0 = closes7d[0] ?? currentPrice
  const p6 = closes7d[6] ?? closes7d[closes7d.length - 1] ?? currentPrice
  const return7d = p6 !== 0 ? ((p0 - p6) / p6) * 100 : 0
  const dampening = signal === 'BUY' ? 0.6 : signal === 'HOLD' ? 0.35 : 0.15
  const raw3m = (return7d / 100) * (65 / 7) * dampening
  const capped = Math.max(-0.2, Math.min(0.25, raw3m))
  const targetPrice = Math.round(currentPrice * (1 + capped))
  const upsidePct = Math.round(((targetPrice - currentPrice) / currentPrice) * 1000) / 10
  return { targetPrice, upsidePct, return7d }
}

function buildRationale(input: IndiaStockAnalysisInput, return7d: number, targetPrice: number, upsidePct: number): string {
  const { name, score, signal, momentum_score, volume_score, volatility_score } = input
  const dir = return7d >= 0 ? 'gained' : 'lost'
  const mag = Math.abs(return7d).toFixed(1)
  const scoreTier = score >= 65 ? 'strong' : score >= 50 ? 'above-average' : score >= 35 ? 'moderate' : 'weak'
  const volLabel = volume_score >= 65 ? 'above-average volume confirms the move' : volume_score >= 35 ? 'volume is steady' : 'volume is declining, signalling weak conviction'
  const voltyLabel = volatility_score >= 65 ? 'low volatility indicating a stable trend' : volatility_score >= 35 ? 'moderate price volatility' : 'high volatility adding execution risk'
  const momLabel = momentum_score >= 65 ? 'strong momentum' : momentum_score >= 35 ? 'moderate momentum' : 'weak momentum'
  const upDownLabel = upsidePct >= 0 ? `${upsidePct}% upside` : `${Math.abs(upsidePct)}% downside`
  if (signal === 'BUY')
    return `${name} has ${dir} ${mag}% over 7 days with ${momLabel} and a ${scoreTier} composite score of ${score}. ${volLabel} alongside ${voltyLabel}. 3-month target ₹${targetPrice} implies ${upDownLabel}.`
  if (signal === 'SELL')
    return `${name} has ${dir} ${mag}% over 7 days with ${momLabel} and a ${scoreTier} composite score of ${score}. ${volLabel} with ${voltyLabel}. 3-month target ₹${targetPrice} implies ${upDownLabel} — consider reducing exposure.`
  return `${name} has ${dir} ${mag}% over 7 days (score ${score}, ${scoreTier}). ${volLabel} and ${voltyLabel}. Hold with 3-month target ₹${targetPrice} (${upDownLabel}).`
}

// ─── Public API ──────────────────────────────────────────────────────────────

export function analyzeIndiaStocksFormula(stocks: IndiaStockAnalysisInput[]): IndiaStockAnalysisResult {
  const analyses: IndiaStockAnalysisResult['analyses'] = {}

  for (const stock of stocks) {
    const { closes, volumes, highs, lows, signal } = stock
    const { targetPrice, upsidePct, return7d } = calcTarget(stock.currentPrice, closes.slice(0, 7), signal)

    const vcpR   = vcp(closes, volumes)
    const sepaR  = sepa(closes, volumes)
    const cupR   = cupWithHandle(closes)
    const drvR   = darvasBox(closes, volumes, highs, lows)
    const emaR   = emaPullback(closes, volumes)
    const rsiR   = rsiDivergence(closes)
    const orbR   = orb(closes, highs, lows, volumes)
    const wykR   = wyckoff(closes, volumes)

    const strategy_signals: StrategySignals = {
      vcp:            scoreToSignal(vcpR.score,  vcpR.details),
      sepa:           scoreToSignal(sepaR.score, sepaR.details),
      cup_handle:     scoreToSignal(cupR.score,  cupR.details),
      darvas:         scoreToSignal(drvR.score,  drvR.details),
      ema_pullback:   scoreToSignal(emaR.score,  emaR.details),
      rsi_divergence: scoreToSignal(rsiR.score,  rsiR.details),
      orb:            scoreToSignal(orbR.score,  orbR.details),
      wyckoff:        scoreToSignal(wykR.score,  wykR.details),
    }

    analyses[stock.ticker] = {
      rationale: buildRationale(stock, return7d, targetPrice, upsidePct),
      target_price: targetPrice,
      upside_pct: upsidePct,
      strategy_signals,
    }
  }

  return { analyses, tokensUsed: 0 }
}
