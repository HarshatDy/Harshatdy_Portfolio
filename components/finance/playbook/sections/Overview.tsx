// components/finance/playbook/sections/Overview.tsx
export default function Overview() {
  const stats = [
    { value: '10%', label: 'Weekly profit target', color: 'text-[#FF8000]' },
    { value: '2–7', label: 'Days avg hold time', color: 'text-teal-400' },
    { value: '3:1', label: 'Reward-to-risk ratio', color: 'text-green-400' },
    { value: '2%', label: 'Max risk per trade', color: 'text-purple-400' },
  ]

  const frameworks = [
    { step: '1. Market Context', body: 'Is Nifty trending? Sector rotation? Macro events?', color: 'bg-purple-400' },
    { step: '2. Stock Selection', body: 'Filter NSE 100 by momentum, volume, relative strength', color: 'bg-blue-400' },
    { step: '3. Chart Analysis', body: 'Pattern + indicator confluence at key price levels', color: 'bg-teal-400' },
    { step: '4. Entry Execution', body: 'Trigger candles, precise entry, stop placement', color: 'bg-[#FF8000]' },
    { step: '5. Trade Management', body: 'Trailing stop, partial profit, full exit rules', color: 'bg-green-400' },
  ]

  const experts = [
    { name: 'Mark Minervini', body: 'SEPA methodology — buy fundamentally strong stocks at precise technical breakouts with tight stops. 97% win rate years proved it\'s about quality of setup, not frequency.' },
    { name: 'William O\'Neil', body: 'CAN SLIM — buy stocks with strong earnings, new highs, institutional buying, and market follow-through days. Cup-with-handle and flat base patterns remain the most reliable breakout setups.' },
    { name: 'Stan Weinstein', body: 'Stage Analysis — only buy in Stage 2 (advancing), never in Stage 1 (basing), never in Stage 3 (topping), never in Stage 4 (declining).' },
    { name: 'Nicolas Darvas', body: 'Buy breakouts from "boxes" (tight consolidation ranges) with expanding volume. Works exceptionally well on NSE mid and large caps during trending markets.' },
    { name: 'Richard Dennis', body: 'Turtle trading rules — trend following with defined entry/exit rules removes emotion. The system wins by cutting losses ruthlessly and letting winners run.' },
    { name: 'IBD Methodology', body: 'Relative Strength Rank, Earnings growth, and institutional accumulation are the three pillars. Applied to NSE 100: focus on stocks where FII/DII are actively accumulating.' },
  ]

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className={`text-3xl font-bold font-serif ${s.color}`}>{s.value}</div>
            <div className="text-zinc-500 text-xs uppercase tracking-widest mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* What is swing trading */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h3 className="text-[#FF8000] text-xs font-bold uppercase tracking-widest mb-3">What is Swing Trading?</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Swing trading captures "swings" — price moves within a larger trend. Unlike day trading (exits same day) or investing (months/years), swing trading holds for 2–7 days, catching the meat of a price move. In NSE 100 stocks, a 10% move per week is achievable but requires strict discipline.
          </p>
          <div className="mt-4 border-t border-zinc-800 pt-4">
            <h3 className="text-[#FF8000] text-xs font-bold uppercase tracking-widest mb-3">The 10% Reality Check</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              10% per week compounded = 142x annually. This is not realistic every week.{' '}
              <span className="text-[#FF8000] font-semibold">Target 3–4 qualifying trades monthly</span>, not every week. Professionals aim for 40–60% annual returns.
            </p>
          </div>
        </div>

        {/* 5-layer framework */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h3 className="text-[#FF8000] text-xs font-bold uppercase tracking-widest mb-4">The 5-Layer Framework</h3>
          <div className="relative pl-5 space-y-4">
            <div className="absolute left-1.5 top-2 bottom-2 w-px bg-zinc-700" />
            {frameworks.map((f) => (
              <div key={f.step} className="relative">
                <div className={`absolute -left-[14px] top-1 w-2.5 h-2.5 rounded-full ${f.color} border-2 border-black`} />
                <div className="text-white text-sm font-semibold">{f.step}</div>
                <div className="text-zinc-500 text-xs mt-0.5">{f.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expert consensus */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-[#FF8000] text-xs font-bold uppercase tracking-widest mb-4">Expert Consensus — What Actually Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {experts.map((e) => (
            <div key={e.name}>
              <span className="inline-block text-xs font-bold text-[#FF8000] border border-[#FF8000]/30 bg-[#FF8000]/10 rounded px-2 py-0.5 mb-2">{e.name}</span>
              <p className="text-zinc-400 text-xs leading-relaxed">{e.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
