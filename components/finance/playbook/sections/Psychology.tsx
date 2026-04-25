// components/finance/playbook/sections/Psychology.tsx
const KILLERS = [
  { title: 'Averaging Down Losers', body: 'Buying more of a stock that is going against you. The market doesn\'t know your average price. Stop out, wait for setup to reset.' },
  { title: 'Moving the Stop Loss', body: '"Just a little more" is how small losses become account killers. Stop is placed by analysis, not emotion.' },
  { title: 'Overtrading After Loss', body: 'Revenge trading to recover quickly accelerates losses. One stop-out = stop for the day. Review, journal, come back tomorrow.' },
  { title: 'Selling Winners Too Early', body: 'Fear of giving back profit causes you to exit 3% when setup had 10% potential. Let the system work. Trail, don\'t panic-exit.' },
  { title: 'FOMO Entries', body: 'Chasing stocks already up 8-10% without a setup. You become the exit liquidity for those who bought right. Wait for the next pullback.' },
]

const SCHEDULE = [
  { time: 'Pre-Market (8:00–9:00 AM)', body: 'Check SGX Nifty / GIFT Nifty. Note US market close. Check VIX. Review India VIX. Scan for overnight news on holdings.', color: 'border-zinc-700' },
  { time: 'Market Open (9:15–9:30 AM)', body: 'Watch, don\'t trade. Let opening volatility settle. See where Nifty is relative to yesterday\'s close.', color: 'border-zinc-700' },
  { time: 'Entry Window (9:30–11:30 AM)', body: 'Best time for breakout entries. Volume is high, institutions are active. Set limit orders, not market orders.', color: 'border-zinc-700' },
  { time: 'Afternoon Review (1:30–2:30 PM)', body: 'Mid-day lull. Review open positions. No new entries unless exceptional setup.', color: 'border-zinc-700' },
  { time: 'Close Watch (3:00–3:30 PM)', body: 'Watch for end-of-day strength or weakness. Closing price matters most. Set next day\'s alerts.', color: 'border-zinc-700' },
  { time: 'Post-Market (4:00–5:00 PM)', body: 'Journal: what worked, what didn\'t. Screenshot charts. Plan next day\'s watchlist. Emotion debrief.', color: 'border-green-800' },
]

const JOURNAL_FIELDS = [
  { field: 'Setup Type', what: 'Bull flag, VCP, breakout, etc.', why: 'Track which patterns work best for you' },
  { field: 'Market Context', what: 'Nifty trend, VIX, sector RS', why: 'Identify when you trade best' },
  { field: 'Entry Reason', what: 'All 3 criteria met? Which?', why: 'Forces pre-trade discipline' },
  { field: 'Risk:Reward', what: 'Calculated before entry', why: 'Reject trades with poor R:R' },
  { field: 'Emotional State', what: '1-10 scale, key emotions', why: 'Spot when you trade emotionally' },
  { field: 'Outcome', what: 'P&L, exit reason, duration', why: 'Track expectancy per setup' },
  { field: 'Lesson', what: '1 thing you\'d do differently', why: 'Compound learning over time' },
]

export default function Psychology() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 5 killers */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h3 className="text-[#FF8000] text-xs font-bold uppercase tracking-widest mb-4">The 5 Killers of Retail Traders</h3>
          <div className="relative pl-5 space-y-4">
            <div className="absolute left-1.5 top-2 bottom-2 w-px bg-zinc-700" />
            {KILLERS.map((k, i) => (
              <div key={k.title} className="relative">
                <div className="absolute -left-[14px] top-1 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-black" />
                <div className="text-white text-sm font-semibold">{i + 1}. {k.title}</div>
                <div className="text-zinc-400 text-xs mt-0.5 leading-relaxed">{k.body}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily schedule */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h3 className="text-[#FF8000] text-xs font-bold uppercase tracking-widest mb-4">Building a Bulletproof Process</h3>
          <div className="space-y-2">
            {SCHEDULE.map((s) => (
              <div key={s.time} className={`border-l-2 ${s.color} pl-3 py-2 bg-zinc-800/40 rounded-r`}>
                <div className="text-white text-xs font-semibold">{s.time}</div>
                <div className="text-zinc-400 text-xs mt-0.5 leading-relaxed">{s.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Journal framework */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-[#FF8000] text-xs font-bold uppercase tracking-widest mb-2">The Trading Journal Framework</h3>
        <p className="text-zinc-400 text-xs mb-4">Mark Douglas found that traders who kept detailed journals improved win rates by 30–40% within 6 months.</p>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left py-2 px-3 text-zinc-500 font-medium uppercase tracking-wider">Field</th>
              <th className="text-left py-2 px-3 text-zinc-500 font-medium uppercase tracking-wider">What to Record</th>
              <th className="text-left py-2 px-3 text-zinc-500 font-medium uppercase tracking-wider">Why It Matters</th>
            </tr>
          </thead>
          <tbody>
            {JOURNAL_FIELDS.map((j) => (
              <tr key={j.field} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                <td className="py-2.5 px-3 text-white font-medium">{j.field}</td>
                <td className="py-2.5 px-3 text-zinc-400">{j.what}</td>
                <td className="py-2.5 px-3 text-zinc-500">{j.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
