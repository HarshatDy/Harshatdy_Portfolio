import { NextResponse } from 'next/server'
import { validateCronSecret, cronUnauthorized } from '@/lib/utils/cronAuth'
import {
  getActiveIndiaStocks,
  upsertIndiaPrices,
  upsertIndiaSignal,
  updateIndiaSignalRationale,
} from '@/lib/db/queries/indiaFinance'
import { fetchIndiaPrices } from '@/lib/services/indiaStocks'
import { scoreStocks } from '@/lib/services/indiaScoring'
import { analyzeIndiaStocksFormula } from '@/lib/services/indiaAnalysis'
import type { IndiaStockPriceData } from '@/app/data/types/indiaFinance'
import type { StockDayData } from '@/app/data/types/finance'

const VALID_SLOTS = ['open', 'midday', 'close'] as const
type FetchSlot = (typeof VALID_SLOTS)[number]

async function runFetch(request: Request): Promise<NextResponse> {
  if (!validateCronSecret(request)) return cronUnauthorized()

  const url = new URL(request.url)
  const slotParam = url.searchParams.get('slot')

  if (!slotParam || !VALID_SLOTS.includes(slotParam as FetchSlot)) {
    return NextResponse.json(
      { error: 'Missing or invalid ?slot=open|midday|close' },
      { status: 400 },
    )
  }

  const slot = slotParam as FetchSlot
  const today = new Date().toISOString().split('T')[0]

  // ── 1. Get all active stocks ─────────────────────────────────────────────
  const stocks = await getActiveIndiaStocks()
  if (!stocks.length) {
    return NextResponse.json({ slot, processed: 0, scored: 0, analysed: 0 })
  }

  // ── 2. Fetch prices per stock ────────────────────────────────────────────
  type StockPriceEntry = {
    stockId: string
    ticker: string
    name: string
    priceData: IndiaStockPriceData
    ohlcv: StockDayData[]   // full newest-first OHLCV for algorithm analysis
    currentPrice: number
  }

  const fetched: StockPriceEntry[] = []

  for (const stock of stocks) {
    try {
      const prices = await fetchIndiaPrices(stock.yahoo_ticker)

      if (prices.length === 0) {
        console.warn(`[india/fetch] Stale/empty data for ${stock.ticker} — skipping`)
        continue
      }

      // Upsert today's OHLCV row for this slot
      await upsertIndiaPrices([
        {
          stock_id: stock.id,
          date: today,
          fetch_slot: slot,
          open: prices[0].open,
          high: prices[0].high,
          low: prices[0].low,
          close: prices[0].close,
          volume: prices[0].volume,
        },
      ])

      // Need ≥8 prices for scoring
      if (prices.length >= 8) {
        fetched.push({
          stockId: stock.id,
          ticker: stock.ticker,
          name: stock.name,
          priceData: {
            ticker: stock.ticker,
            prices: prices.map((p) => p.close),
            volumes: prices.map((p) => p.volume),
          },
          ohlcv: prices,
          currentPrice: prices[0].close,
        })
      }
    } catch (err) {
      console.error(`[india/fetch] Failed for ${stock.ticker}:`, err)
    }
  }

  const processed = fetched.length

  // ── 3. Score all stocks ──────────────────────────────────────────────────
  const scores = scoreStocks(fetched.map((f) => f.priceData))
  const scoreMap = new Map(scores.map((s) => [s.ticker, s]))

  // ── 4. Upsert signals ────────────────────────────────────────────────────
  for (const entry of fetched) {
    const s = scoreMap.get(entry.ticker)
    if (!s) continue
    try {
      await upsertIndiaSignal({
        stock_id: entry.stockId,
        date: today,
        score: s.score,
        momentum_score: s.momentum_score,
        volume_score: s.volume_score,
        volatility_score: s.volatility_score,
        signal: s.signal,
      })
    } catch (err) {
      console.error(`[india/fetch] Signal upsert failed for ${entry.ticker}:`, err)
    }
  }

  const scored = scores.length

  // ── 5. Formula-based analysis (all 8 algorithms) ─────────────────────────
  let analysed = 0

  if (fetched.length > 0) {
    const { analyses } = analyzeIndiaStocksFormula(
      fetched.map((f) => {
        const s = scoreMap.get(f.ticker)!
        return {
          ticker: f.ticker,
          name: f.name,
          currentPrice: f.currentPrice,
          score: s.score,
          momentum_score: s.momentum_score,
          volume_score: s.volume_score,
          volatility_score: s.volatility_score,
          signal: s.signal,
          closes:  f.ohlcv.map((p) => p.close),
          volumes: f.ohlcv.map((p) => p.volume),
          highs:   f.ohlcv.map((p) => p.high),
          lows:    f.ohlcv.map((p) => p.low),
          opens:   f.ohlcv.map((p) => p.open),
        }
      }),
    )

    for (const entry of fetched) {
      const analysis = analyses[entry.ticker]
      if (!analysis) continue
      try {
        await updateIndiaSignalRationale(
          entry.stockId,
          today,
          analysis.rationale,
          analysis.target_price,
          analysis.upside_pct,
          analysis.strategy_signals,
        )
        analysed++
      } catch (err) {
        console.error(`[india/fetch] Rationale update failed for ${entry.ticker}:`, err)
      }
    }
  }

  return NextResponse.json({ slot, processed, scored, analysed })
}

// Vercel cron jobs send GET; manual triggers can use POST
export function GET(request: Request) { return runFetch(request) }
export function POST(request: Request) { return runFetch(request) }
