export interface Stock {
  id: string
  ticker: string
  name: string
  sector: string | null
  active: boolean
}

export interface StockPrice {
  id: string
  stock_id: string
  date: string
  open: number | null
  high: number | null
  low: number | null
  close: number
  volume: number | null
}

export interface StockAnalysis {
  id: string
  stock_id: string
  date: string
  analysis: string
  sentiment: 'bullish' | 'bearish' | 'neutral'
  key_points: string[]
  claude_tokens: number | null
}

export interface StockWithHistory {
  stock: Stock
  prices: StockPrice[]           // last 30 days, newest first
  latestAnalysis: StockAnalysis | null
}

export interface StockDayData {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}
