import type { StockDayData } from '@/app/data/types/finance'
// eslint-disable-next-line @typescript-eslint/no-require-imports
const YahooFinance = require('yahoo-finance2').default
const yahooFinance = new YahooFinance()

/**
 * Fetch OHLCV data for a single .NS ticker using yahoo-finance2.
 * Returns newest-first array.
 * Stale guard: if the most recent entry is more than 24h old, returns [] to
 * indicate a market holiday / weekend with no fresh data.
 */
export async function fetchIndiaPrices(yahooTicker: string): Promise<StockDayData[]> {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 60)

  const result = await yahooFinance.historical(yahooTicker, {
    period1: startDate.toISOString().split('T')[0],
    period2: endDate.toISOString().split('T')[0],
    interval: '1d',
  })

  if (!result || result.length === 0) return []

  const mapped: StockDayData[] = result
    .map(
      (row: {
        date: Date
        open?: number
        high?: number
        low?: number
        close?: number
        volume?: number
      }) => ({
        date:
          row.date instanceof Date
            ? row.date.toISOString().split('T')[0]
            : String(row.date).split('T')[0],
        open: row.open ?? 0,
        high: row.high ?? 0,
        low: row.low ?? 0,
        close: row.close ?? 0,
        volume: row.volume ?? 0,
      }),
    )
    .filter((d: StockDayData) => d.close > 0)

  // Sort newest first
  mapped.sort((a, b) => (a.date > b.date ? -1 : 1))

  if (mapped.length === 0) return []

  // Stale guard: allow up to 72h to cover weekends and public holidays
  const latestDate = new Date(mapped[0].date + 'T23:59:59Z')
  const threeDaysAgo = new Date(Date.now() - 72 * 60 * 60 * 1000)
  if (latestDate < threeDaysAgo) return []

  return mapped
}
