// components/finance/playbook/sections/StockScanner.tsx

function ChecklistItem({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="flex gap-3 py-3 border-b border-zinc-800/50 last:border-0">
      <div className="w-6 h-6 rounded-full bg-[#FF8000]/10 text-[#FF8000] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{n}</div>
      <div>
        <div className="text-white text-sm font-semibold">{title}</div>
        <div className="text-zinc-400 text-xs mt-1 leading-relaxed">{body}</div>
      </div>
    </div>
  )
}

export default function StockScanner() {
  const stage1 = [
    { n: 1, title: 'Market Condition Check', body: 'Nifty 50: above 200 DMA? India VIX below 20? FII data from NSE: net buyers or sellers this week? If all bad — no trading today, wait.' },
    { n: 2, title: 'Sector Strength Scan', body: 'On TradingView/Chartink: which NSE sectors are showing highest RS (Relative Strength) vs Nifty in last 20 days? Only look for trades in top 2-3 sectors.' },
    { n: 3, title: 'Volume Surge Filter', body: 'Screener.in filter: Volume today > 150% of 20-day average AND Price change > 2%. This catches stocks with institutional activity.' },
    { n: 4, title: '52-Week High Proximity', body: 'Filter stocks within 5-10% of 52-week high. Stocks near new highs continue higher more than "cheap" stocks far from highs.' },
  ]

  const stage2 = [
    { n: 5, title: 'Trend Confirmation', body: 'EMA 20 > EMA 50 > EMA 200 on daily chart (bullish alignment). Price above all three EMAs. This is non-negotiable for long trades.' },
    { n: 6, title: 'Pattern Identification', body: 'Is there a recognized setup? Cup with handle, Bull flag, Darvas box breakout, ascending triangle, VCP. No clear pattern = no trade.' },
    { n: 7, title: 'Indicator Confluence', body: 'At minimum 3 indicators must agree: RSI 50-70 range (not overbought), MACD bullish crossover or histogram expanding, volume at pattern breakout > 1.5x average.' },
    { n: 8, title: 'Support/Stop Level', body: 'Identify the stop-loss level BEFORE entry. Must be a clear technical level — recent swing low, pattern low, or key EMA. Stop should be max 5-7% below entry for 10% target (R:R ≥ 1.5:1).' },
  ]

  const stockCategories = [
    { label: 'High Momentum', color: 'text-teal-400', stocks: 'ADANIPORTS, BAJFINANCE, HDFCBANK, ICICIBANK, KOTAKBANK, RELIANCE, TATAMOTORS, TATAPOWER, BAJAJFINSV, SBILIFE' },
    { label: 'High Beta (10%+ movers)', color: 'text-purple-400', stocks: 'TATASTEEL, HINDALCO, JSWSTEEL, SBIN, INDUSINDBK, IDEA, VEDL, ADANIENT, BANKBARODA, CANBK' },
    { label: 'Trend Quality', color: 'text-[#FF8000]', stocks: 'INFY, TCS, WIPRO, HCLTECH, TITAN, DMART, ASIANPAINT, NESTLEIND, BRITANNIA, PIDILITIND' },
  ]

  const entryTriggers = [
    'Breakout candle closes above resistance on daily chart',
    'Volume on breakout day ≥ 1.5x 20-day average volume',
    'RSI crossing above 55 or confirming at 60–65 zone',
    'MACD line crossing above signal line',
  ]

  const exitRules = [
    'Target hit: 10% profit — book 50%, trail rest',
    'Stop-loss hit: Exit 100%, no averaging down',
    'Time stop: 5 days without meaningful move — exit',
    'Breakdown below key EMA — exit regardless of P&L',
  ]

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-[#FF8000] text-xs font-bold uppercase tracking-widest mb-3">Stage 1 — Universe Filter (Daily, Takes 10 mins)</h3>
        {stage1.map((item) => <ChecklistItem key={item.n} {...item} />)}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-[#FF8000] text-xs font-bold uppercase tracking-widest mb-3">Stage 2 — Technical Qualification (Chart-by-Chart)</h3>
        {stage2.map((item) => <ChecklistItem key={item.n} {...item} />)}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-[#FF8000] text-xs font-bold uppercase tracking-widest mb-4">Stage 3 — Entry Execution Criteria</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-950/30 border border-green-900/40 rounded-lg p-4">
            <div className="text-green-400 text-xs font-bold uppercase tracking-widest mb-3">Entry Triggers (All 4 Preferred)</div>
            <div className="space-y-2">
              {entryTriggers.map((t) => <div key={t} className="text-zinc-300 text-xs flex gap-2"><span className="text-green-400 flex-shrink-0">✓</span>{t}</div>)}
              <div className="text-green-400 text-xs mt-3">Enter at open next day after breakout close, or on same-day close</div>
            </div>
          </div>
          <div className="bg-red-950/30 border border-red-900/40 rounded-lg p-4">
            <div className="text-red-400 text-xs font-bold uppercase tracking-widest mb-3">Exit Rules (First to trigger wins)</div>
            <div className="space-y-2">
              {exitRules.map((t) => <div key={t} className="text-zinc-300 text-xs flex gap-2"><span className="text-red-400 flex-shrink-0">✓</span>{t}</div>)}
              <div className="text-red-400 text-xs mt-3">Never hold through earnings without specific plan</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-[#FF8000] text-xs font-bold uppercase tracking-widest mb-4">Top NSE 100 Swing Trading Stocks (By Category)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stockCategories.map((c) => (
            <div key={c.label}>
              <div className={`text-xs font-bold uppercase tracking-widest mb-2 ${c.color}`}>{c.label}</div>
              <p className="text-zinc-400 text-xs leading-relaxed">{c.stocks}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
