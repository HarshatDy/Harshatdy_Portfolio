import 'server-only'
import { supabase } from '@/lib/db/client'
import type {
  IndiaStock,
  IndiaStockPrice,
  IndiaStockSignal,
  IndiaStockWithSignal,
  IndiaStockDetailData,
} from '@/app/data/types/indiaFinance'

// ---------------------------------------------------------------------------
// Seed / lookup
// ---------------------------------------------------------------------------

export async function upsertIndiaStocks(stocks: Omit<IndiaStock, 'id'>[]): Promise<void> {
  const { error } = await supabase.from('indian_stocks').upsert(stocks, {
    onConflict: 'ticker',
    ignoreDuplicates: false,
  })
  if (error) throw new Error(`upsertIndiaStocks: ${error.message}`)
}

export async function getActiveIndiaStocks(): Promise<IndiaStock[]> {
  const { data, error } = await supabase
    .from('indian_stocks')
    .select('*')
    .eq('active', true)
    .order('ticker')
  if (error) throw new Error(`getActiveIndiaStocks: ${error.message}`)
  return (data ?? []) as IndiaStock[]
}

// ---------------------------------------------------------------------------
// Price writes
// ---------------------------------------------------------------------------

export async function upsertIndiaPrices(
  prices: Array<{
    stock_id: string
    date: string
    fetch_slot: 'open' | 'midday' | 'close'
    open: number
    high: number
    low: number
    close: number
    volume: number
  }>,
): Promise<void> {
  const { error } = await supabase
    .from('indian_stock_prices')
    .upsert(prices, { onConflict: 'stock_id,date,fetch_slot' })
  if (error) throw new Error(`upsertIndiaPrices: ${error.message}`)
}

// ---------------------------------------------------------------------------
// Signal writes
// ---------------------------------------------------------------------------

export async function upsertIndiaSignal(signal: {
  stock_id: string
  date: string
  score: number
  momentum_score: number
  volume_score: number
  volatility_score: number
  signal: 'BUY' | 'HOLD' | 'SELL'
  target_price?: number | null
  upside_pct?: number | null
  rationale?: string | null
}): Promise<void> {
  const { error } = await supabase
    .from('indian_stock_signals')
    .upsert(signal, { onConflict: 'stock_id,date' })
  if (error) throw new Error(`upsertIndiaSignal: ${error.message}`)
}

// ---------------------------------------------------------------------------
// Update rationale only (after Claude runs)
// ---------------------------------------------------------------------------

export async function updateIndiaSignalRationale(
  stockId: string,
  date: string,
  rationale: string,
  targetPrice: number,
  upsidePct: number,
  strategySignals?: object | null,
): Promise<void> {
  const payload: Record<string, unknown> = { rationale, target_price: targetPrice, upside_pct: upsidePct }
  if (strategySignals !== undefined) payload.strategy_signals = strategySignals

  const { error } = await supabase
    .from('indian_stock_signals')
    .update(payload)
    .eq('stock_id', stockId)
    .eq('date', date)

  if (error) {
    // strategy_signals column not yet migrated — retry without it
    if (strategySignals !== undefined && error.message.includes('strategy_signals')) {
      const { error: fallbackError } = await supabase
        .from('indian_stock_signals')
        .update({ rationale, target_price: targetPrice, upside_pct: upsidePct })
        .eq('stock_id', stockId)
        .eq('date', date)
      if (fallbackError) throw new Error(`updateIndiaSignalRationale: ${fallbackError.message}`)
      return
    }
    throw new Error(`updateIndiaSignalRationale: ${error.message}`)
  }
}

// ---------------------------------------------------------------------------
// Sidebar: all stocks with latest signal + 7D price change
// ---------------------------------------------------------------------------

export async function getIndiaStocksWithSignals(): Promise<IndiaStockWithSignal[]> {
  const { data: stocks, error: stockErr } = await supabase
    .from('indian_stocks')
    .select('*')
    .eq('active', true)
    .order('ticker')

  if (stockErr) throw new Error(`getIndiaStocksWithSignals: ${stockErr.message}`)
  if (!stocks?.length) return []

  const results: IndiaStockWithSignal[] = await Promise.all(
    (stocks as IndiaStock[]).map(async (stock) => {
      // Latest signal
      const { data: signalRows } = await supabase
        .from('indian_stock_signals')
        .select('*')
        .eq('stock_id', stock.id)
        .order('date', { ascending: false })
        .limit(1)

      const latestSignal = ((signalRows ?? [])[0] as IndiaStockSignal) ?? null

      // Last 8 close prices (newest first) for current price + 7-day change
      const { data: priceRows } = await supabase
        .from('indian_stock_prices')
        .select('close, date')
        .eq('stock_id', stock.id)
        .eq('fetch_slot', 'close')
        .order('date', { ascending: false })
        .limit(8)

      const prices = (priceRows ?? []) as Pick<IndiaStockPrice, 'close' | 'date'>[]
      const currentPrice = prices[0]?.close ?? null
      const weekAgoPrice = prices[7]?.close ?? null

      const sevenDayChange =
        currentPrice !== null && weekAgoPrice !== null && weekAgoPrice !== 0
          ? ((currentPrice - weekAgoPrice) / weekAgoPrice) * 100
          : null

      return { stock, latestSignal, sevenDayChange, currentPrice }
    }),
  )

  return results
}

// ---------------------------------------------------------------------------
// Detail: full data for one stock
// ---------------------------------------------------------------------------

export async function getIndiaStockDetail(ticker: string): Promise<IndiaStockDetailData | null> {
  const { data: stockRows, error: stockErr } = await supabase
    .from('indian_stocks')
    .select('*')
    .eq('ticker', ticker)
    .limit(1)

  if (stockErr) throw new Error(`getIndiaStockDetail: ${stockErr.message}`)
  if (!stockRows?.length) return null

  const stock = stockRows[0] as IndiaStock

  // Last 30 days of close-slot prices
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 30)
  const cutoffStr = cutoff.toISOString().split('T')[0]

  const { data: priceRows } = await supabase
    .from('indian_stock_prices')
    .select('*')
    .eq('stock_id', stock.id)
    .eq('fetch_slot', 'close')
    .gte('date', cutoffStr)
    .order('date', { ascending: false })

  const prices = (priceRows ?? []) as IndiaStockPrice[]
  const currentPrice = prices[0]?.close ?? null

  // Last 7 days of signals
  const { data: signalRows } = await supabase
    .from('indian_stock_signals')
    .select('*')
    .eq('stock_id', stock.id)
    .order('date', { ascending: false })
    .limit(7)

  const signals = (signalRows ?? []) as IndiaStockSignal[]
  const latestSignal = signals[0] ?? null

  return { stock, prices, signals, latestSignal, currentPrice }
}
