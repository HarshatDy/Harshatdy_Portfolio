import type { IndiaStockPriceData, IndiaStockScore } from '@/app/data/types/indiaFinance'

// ---------------------------------------------------------------------------
// Pure multi-factor scoring — no DB or network calls
// ---------------------------------------------------------------------------

function stdDev(values: number[]): number {
  if (values.length < 2) return 0
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length
  return Math.sqrt(variance)
}

function normalize(values: number[]): number[] {
  const min = Math.min(...values)
  const max = Math.max(...values)
  if (max === min) return values.map(() => 50)
  return values.map((v) => ((v - min) / (max - min)) * 100)
}

/**
 * Score a list of stocks using three factors:
 *   1. Momentum   (40%): 7-day return %
 *   2. Volume surge (30%): today's volume vs 7-day avg
 *   3. Volatility   (30%): inverse of 7-day price std-dev (lower vol = better)
 *
 * All factors are cross-sectionally normalised to [0, 100] before weighting.
 * Final score is rounded to an integer.
 * Signal: ≥65 → BUY, 35–64 → HOLD, <35 → SELL
 */
export function scoreStocks(stocks: IndiaStockPriceData[]): IndiaStockScore[] {
  if (stocks.length === 0) return []

  // ── 1. Compute raw factor values ─────────────────────────────────────────

  const rawMomentum: number[] = stocks.map(({ prices }) => {
    const p0 = prices[0]
    const p6 = prices[6]
    if (!p0 || !p6 || p6 === 0) return 0
    return ((p0 - p6) / p6) * 100
  })

  const rawVolume: number[] = stocks.map(({ volumes }) => {
    const today = volumes[0]
    const past = volumes.slice(1, 8)
    if (!today || past.length === 0) return 1
    const avg = past.reduce((sum, v) => sum + v, 0) / past.length
    if (avg === 0) return 1
    return today / avg
  })

  const rawVolatility: number[] = stocks.map(({ prices }) => {
    const slice = prices.slice(0, 7)
    const sd = stdDev(slice)
    if (sd === 0) return 0 // will become 50 after normalisation
    return 1 / sd
  })

  // ── 2. Normalise each factor cross-sectionally ───────────────────────────

  const normMomentum = normalize(rawMomentum)
  const normVolume = normalize(rawVolume)
  const normVolatility = normalize(rawVolatility)

  // ── 3. Weighted sum + signal ─────────────────────────────────────────────

  return stocks.map(({ ticker }, i) => {
    const momentum_score = Math.round(normMomentum[i])
    const volume_score = Math.round(normVolume[i])
    const volatility_score = Math.round(normVolatility[i])

    const score = Math.round(
      normMomentum[i] * 0.4 + normVolume[i] * 0.3 + normVolatility[i] * 0.3,
    )

    const signal: 'BUY' | 'HOLD' | 'SELL' = score >= 65 ? 'BUY' : score >= 35 ? 'HOLD' : 'SELL'

    return { ticker, score, momentum_score, volume_score, volatility_score, signal }
  })
}
