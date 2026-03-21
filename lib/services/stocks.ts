import type { StockDayData } from '@/app/data/types/finance'

const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_API_KEY

/** Fetch daily OHLCV from Alpha Vantage (compact = last 100 trading days) */
async function fetchFromAlphaVantage(ticker: string): Promise<StockDayData[]> {
  if (!ALPHA_VANTAGE_KEY) throw new Error('ALPHA_VANTAGE_API_KEY not set')

  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&outputsize=compact&apikey=${ALPHA_VANTAGE_KEY}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Alpha Vantage HTTP ${res.status}`)

  const json = await res.json()

  if (json['Note'] || json['Information']) {
    throw new Error('Alpha Vantage rate limit reached')
  }

  const timeSeries = json['Time Series (Daily)']
  if (!timeSeries) throw new Error('No time series data in Alpha Vantage response')

  return Object.entries(timeSeries)
    .map(([date, vals]: [string, unknown]) => {
      const v = vals as Record<string, string>
      return {
        date,
        open: parseFloat(v['1. open']),
        high: parseFloat(v['2. high']),
        low: parseFloat(v['3. low']),
        close: parseFloat(v['4. close']),
        volume: parseInt(v['5. volume'], 10),
      }
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1)) // newest first
}

/** Fallback: Yahoo Finance via yahoo-finance2 */
async function fetchFromYahoo(ticker: string): Promise<StockDayData[]> {
  // Dynamic import to avoid issues if package is missing
  const yahooFinance = (await import('yahoo-finance2')).default
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 100)

  const result = await yahooFinance.historical(ticker, {
    period1: startDate.toISOString().split('T')[0],
    period2: endDate.toISOString().split('T')[0],
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (result as any[])
    .map((d: { date: Date; open?: number; high?: number; low?: number; close: number; volume?: number }) => ({
      date: d.date.toISOString().split('T')[0],
      open: d.open ?? 0,
      high: d.high ?? 0,
      low: d.low ?? 0,
      close: d.close,
      volume: d.volume ?? 0,
    }))
    .sort((a: { date: string }, b: { date: string }) => (a.date < b.date ? 1 : -1))
}

/** Fetch daily prices for a ticker — Alpha Vantage primary, Yahoo fallback */
export async function fetchDailyPrices(ticker: string): Promise<StockDayData[]> {
  try {
    return await fetchFromAlphaVantage(ticker)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.warn(`[stocks] Alpha Vantage failed for ${ticker}: ${msg}. Trying Yahoo Finance...`)
    await new Promise((r) => setTimeout(r, 500)) // be polite
    return await fetchFromYahoo(ticker)
  }
}
