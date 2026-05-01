// ---------------------------------------------------------------------------
// India Finance — shared TypeScript types
// ---------------------------------------------------------------------------

export interface IndiaStock {
  id: string
  ticker: string
  yahoo_ticker: string
  name: string
  sector: string
  active: boolean
}

export interface IndiaStockPrice {
  id: string
  stock_id: string
  date: string
  fetch_slot: 'open' | 'midday' | 'close'
  open: number | null
  high: number | null
  low: number | null
  close: number
  volume: number | null
}

export interface IndiaStockSignal {
  id: string
  stock_id: string
  date: string
  score: number
  momentum_score: number
  volume_score: number
  volatility_score: number
  signal: 'BUY' | 'HOLD' | 'SELL'
  target_price: number | null
  upside_pct: number | null
  rationale: string | null
  strategy_signals: StrategySignals | null
}

/** Sidebar row: stock + latest signal + 7-day % price change */
export interface IndiaStockWithSignal {
  stock: IndiaStock
  latestSignal: IndiaStockSignal | null
  sevenDayChange: number | null  // percent, e.g. 4.2 or -1.1
  currentPrice: number | null
}

/** Detail panel data */
export interface IndiaStockDetailData {
  stock: IndiaStock
  prices: IndiaStockPrice[]    // last 30 days (close slot, newest first)
  signals: IndiaStockSignal[]  // last 7 days (newest first)
  latestSignal: IndiaStockSignal | null
  currentPrice: number | null
}

// ---------------------------------------------------------------------------
// Scoring algorithm types
// ---------------------------------------------------------------------------

/** Input to scoreStocks() — raw OHLCV per stock, newest first */
export interface IndiaStockPriceData {
  ticker: string
  prices: number[]   // close prices, newest first, needs ≥7 entries
  volumes: number[]  // volumes,     newest first, needs ≥8 entries
}

/** Output from scoreStocks() */
export interface IndiaStockScore {
  ticker: string
  score: number
  momentum_score: number
  volume_score: number
  volatility_score: number
  signal: 'BUY' | 'HOLD' | 'SELL'
}

// ---------------------------------------------------------------------------
// Strategy algorithm types
// ---------------------------------------------------------------------------

export interface StrategySignalEntry {
  signal: 'BUY' | 'HOLD' | 'SELL'
  buy: number   // 0-100 percent
  hold: number  // 0-100 percent
  sell: number  // 0-100 percent
  details: Record<string, string>  // KPI labels → formatted values
}

export interface StrategySignals {
  vcp:           StrategySignalEntry
  sepa:          StrategySignalEntry
  cup_handle:    StrategySignalEntry
  darvas:        StrategySignalEntry
  ema_pullback:  StrategySignalEntry
  rsi_divergence: StrategySignalEntry
  orb:           StrategySignalEntry
  wyckoff:       StrategySignalEntry
}

// ---------------------------------------------------------------------------
// Analysis result types
// ---------------------------------------------------------------------------

export interface IndiaStockAnalysis {
  rationale: string
  target_price: number
  upside_pct: number
  strategy_signals: StrategySignals
}

export interface IndiaStockAnalysisResult {
  analyses: Record<string, IndiaStockAnalysis>
  tokensUsed: number
}
