import { supabase } from '@/lib/db/client'
import type { Stock, StockPrice, StockWithHistory, StockAnalysis } from '@/app/data/types/finance'

export async function getActiveStocks(): Promise<Stock[]> {
  const { data, error } = await supabase
    .from('stocks')
    .select('*')
    .eq('active', true)
    .order('ticker')

  if (error) throw new Error(`getActiveStocks: ${error.message}`)
  return data ?? []
}

export async function upsertStockPrices(
  stockId: string,
  prices: { date: string; open: number; high: number; low: number; close: number; volume: number }[],
): Promise<void> {
  const rows = prices.map((p) => ({ stock_id: stockId, ...p }))
  const { error } = await supabase
    .from('stock_prices')
    .upsert(rows, { onConflict: 'stock_id,date' })

  if (error) throw new Error(`upsertStockPrices: ${error.message}`)
}

export async function upsertStockAnalysis(analysis: {
  stock_id: string
  date: string
  analysis: string
  sentiment: 'bullish' | 'bearish' | 'neutral'
  key_points: string[]
  claude_tokens: number | null
}): Promise<void> {
  const { error } = await supabase
    .from('stock_analyses')
    .upsert(analysis, { onConflict: 'stock_id,date' })

  if (error) throw new Error(`upsertStockAnalysis: ${error.message}`)
}

export async function getStocksWithHistory(days = 30): Promise<StockWithHistory[]> {
  const { data: stocks, error: stockErr } = await supabase
    .from('stocks')
    .select('*')
    .eq('active', true)
    .order('ticker')

  if (stockErr) throw new Error(`getStocksWithHistory: ${stockErr.message}`)
  if (!stocks?.length) return []

  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  const cutoffStr = cutoff.toISOString().split('T')[0]

  const results: StockWithHistory[] = await Promise.all(
    (stocks as Stock[]).map(async (stock) => {
      const { data: prices } = await supabase
        .from('stock_prices')
        .select('*')
        .eq('stock_id', stock.id)
        .gte('date', cutoffStr)
        .order('date', { ascending: false })

      const { data: analyses } = await supabase
        .from('stock_analyses')
        .select('*')
        .eq('stock_id', stock.id)
        .order('date', { ascending: false })
        .limit(1)

      return {
        stock,
        prices: (prices ?? []) as StockPrice[],
        latestAnalysis: ((analyses ?? [])[0] as StockAnalysis) ?? null,
      }
    }),
  )

  return results
}
