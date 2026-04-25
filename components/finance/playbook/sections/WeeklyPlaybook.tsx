// components/finance/playbook/sections/WeeklyPlaybook.tsx
const DAYS = [
  { name: 'Monday', tag: 'SCAN', color: 'text-blue-400', body: 'Run full NSE 100 scan. Identify top 5 watchlist candidates. Mark all key levels.' },
  { name: 'Tuesday', tag: 'ENTER', color: 'text-green-400', body: 'Best day to enter breakout trades. Volume and momentum tend to peak Tue–Wed.' },
  { name: 'Wednesday', tag: 'MANAGE', color: 'text-[#FF8000]', body: 'Check open positions. Trail stops if up 5%+. Enter any missed Tue setups with caution.' },
  { name: 'Thursday', tag: 'EXPIRY', color: 'text-purple-400', body: 'Weekly F&O expiry. Avoid new equity entries unless unrelated to derivatives. High volatility day.' },
  { name: 'Friday', tag: 'REVIEW', color: 'text-red-400', body: 'Close any trades not hitting target by 3:15 PM. Weekend risk — don\'t hold uncertain positions.' },
]

const CHECKLIST = [
  'Nifty in uptrend (above 200 DMA)',
  'Stock\'s sector is outperforming Nifty',
  'India VIX below 20',
  'Stock in Stage 2 (EMA 20 > 50 > 200)',
  'Clear pattern: flag, VCP, cup, box, triangle',
  'RSI 50–70 range (not overbought at entry)',
  'MACD bullish crossover or positive histogram',
  'Breakout on volume ≥ 1.5x 20-day avg',
  'Stop-loss clearly defined at technical level',
  'R:R ratio at least 2:1 (ideally 3:1)',
  'No major result / event within hold period',
  'Position size within 2% capital risk rule',
]

const ROADMAP = [
  { period: 'Month 1–2: Foundation', color: 'bg-blue-400', body: 'Paper trade only. Master reading candlestick charts, S/R levels, basic indicators (RSI, MACD, Volume). Read: Stan Weinstein\'s "Secrets for Profiting" and O\'Neil\'s "How to Make Money in Stocks".' },
  { period: 'Month 3–4: Pattern Recognition', color: 'bg-teal-400', body: 'Study 500+ historical charts (TradingView replay feature). Identify patterns before the move happens. Start with tiny real capital (₹20–50K).' },
  { period: 'Month 5–6: System Building', color: 'bg-[#FF8000]', body: 'Define YOUR rules precisely. Backtest your best 3 setups over 1 year of NSE data. Read: Minervini\'s "Trade Like a Stock Market Wizard".' },
  { period: 'Month 7–12: Execution Mastery', color: 'bg-green-400', body: 'Scale up capital gradually. Trade with full rules, zero exceptions. Review journal monthly. Read: Mark Douglas "Trading in the Zone". Consistent 40–60% annual returns is realistic at this stage.' },
  { period: 'Year 2+: Specialization', color: 'bg-purple-400', body: 'Develop edge in 1–2 specific setups. Consider sector specialization. Explore adding options for protection. Build screeners.' },
]

export default function WeeklyPlaybook() {
  return (
    <div className="space-y-6">
      {/* 5-day rhythm */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-[#FF8000] text-xs font-bold uppercase tracking-widest mb-4">The Weekly Rhythm</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {DAYS.map((d) => (
            <div key={d.name} className="bg-zinc-800 rounded-lg p-3 text-center">
              <div className="text-zinc-400 text-xs font-semibold uppercase tracking-widest">{d.name}</div>
              <div className={`text-xs font-bold mt-1 mb-2 ${d.color}`}>{d.tag}</div>
              <div className="text-zinc-500 text-xs leading-relaxed text-left">{d.body}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Setup checklist */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h3 className="text-[#FF8000] text-xs font-bold uppercase tracking-widest mb-4">The Perfect NSE Swing Setup Checklist</h3>
          <div className="space-y-1">
            {CHECKLIST.map((item) => (
              <div key={item} className="flex items-start gap-2 py-1.5 border-b border-zinc-800/50 last:border-0 text-xs text-zinc-400">
                <span className="text-green-400 flex-shrink-0 mt-0.5">□</span>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Learning roadmap */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h3 className="text-[#FF8000] text-xs font-bold uppercase tracking-widest mb-4">Learning Roadmap</h3>
          <div className="relative pl-5 space-y-5">
            <div className="absolute left-1.5 top-2 bottom-2 w-px bg-zinc-700" />
            {ROADMAP.map((r) => (
              <div key={r.period} className="relative">
                <div className={`absolute -left-[14px] top-1 w-2.5 h-2.5 rounded-full ${r.color} border-2 border-black`} />
                <div className="text-white text-sm font-semibold">{r.period}</div>
                <div className="text-zinc-400 text-xs mt-0.5 leading-relaxed">{r.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
