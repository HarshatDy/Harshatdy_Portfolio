import { NextResponse } from 'next/server'
import { validateCronSecret, cronUnauthorized } from '@/lib/utils/cronAuth'
import { getActiveStocks, upsertStockPrices, upsertStockAnalysis } from '@/lib/db/queries/finance'
import { fetchDailyPrices } from '@/lib/services/stocks'
import { analyzeStocks } from '@/lib/services/claude'

export async function POST(request: Request) {
  if (!validateCronSecret(request)) return cronUnauthorized()

  try {
    const stocks = await getActiveStocks()
    if (!stocks.length) {
      return NextResponse.json({ success: true, processed: 0, message: 'No active stocks' })
    }

    // Fetch prices for all tickers (Alpha Vantage → Yahoo fallback)
    const priceHistory: Record<string, { date: string; close: number }[]> = {}
    let processed = 0

    for (const stock of stocks) {
      try {
        const prices = await fetchDailyPrices(stock.ticker)
        // Upsert all fetched prices
        await upsertStockPrices(
          stock.id,
          prices.map((p) => ({
            date: p.date,
            open: p.open,
            high: p.high,
            low: p.low,
            close: p.close,
            volume: p.volume,
          })),
        )
        // Keep last 30 days for Claude analysis
        priceHistory[stock.ticker] = prices.slice(0, 30).map((p) => ({ date: p.date, close: p.close }))
        processed++
      } catch (err) {
        console.error(`[finance/fetch] Failed for ${stock.ticker}:`, err)
      }
    }

    // Single batched Claude call for all tickers
    const today = new Date().toISOString().split('T')[0]
    const { analyses, tokensUsed } = await analyzeStocks(priceHistory)

    for (const stock of stocks) {
      const result = analyses[stock.ticker]
      if (!result) continue
      await upsertStockAnalysis({
        stock_id: stock.id,
        date: today,
        analysis: result.analysis,
        sentiment: result.sentiment,
        key_points: result.key_points,
        claude_tokens: Math.round(tokensUsed / stocks.length), // approximate per-stock
      })
    }

    return NextResponse.json({ success: true, processed, claude_tokens: tokensUsed })
  } catch (err) {
    console.error('[finance/fetch] Error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    )
  }
}
