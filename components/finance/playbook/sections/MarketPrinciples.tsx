// components/finance/playbook/sections/MarketPrinciples.tsx
export default function MarketPrinciples() {
  const stages = [
    { label: 'STAGE 1 — BASING', body: 'Price sideways, 30W MA flat. Institutions quietly accumulating. Do NOT buy yet. Watch for breakout.', color: 'text-zinc-400', border: 'border-zinc-700' },
    { label: 'STAGE 2 — ADVANCING ✓', body: 'Price above rising 30W MA. Higher highs, higher lows. Buy here. Add on pullbacks to MA.', color: 'text-green-400', border: 'border-green-800' },
    { label: 'STAGE 3 — TOPPING', body: 'Price churning at highs, 30W MA flattening. Distribution by institutions. Exit positions.', color: 'text-[#FF8000]', border: 'border-orange-800' },
    { label: 'STAGE 4 — DECLINING', body: 'Price below falling 30W MA. Lower highs, lower lows. Never buy. Short only if experienced.', color: 'text-red-400', border: 'border-red-900' },
  ]

  const sectors = [
    { name: 'Financial Services', pct: 36 },
    { name: 'IT & Tech', pct: 15 },
    { name: 'Oil & Gas', pct: 12 },
    { name: 'Consumer Goods', pct: 10 },
    { name: 'Pharma & Health', pct: 8 },
    { name: 'Automobiles', pct: 6 },
    { name: 'Metals', pct: 5 },
    { name: 'Others', pct: 8 },
  ]

  const indiaFactors = [
    { icon: '◆', color: 'text-teal-400', title: 'FII/DII Data', body: 'Check SEBI FII/DII daily data. FII buying = bullish fuel. FII selling = exit signal. Available on NSE website daily.' },
    { icon: '◆', color: 'text-teal-400', title: 'India VIX', body: 'Volatility index. Above 20 = dangerous for swings, reduce position. Below 15 = calm market, normal sizing.' },
    { icon: '◆', color: 'text-teal-400', title: 'NSE Option Chain', body: 'PCR (Put-Call Ratio) above 1.2 = bullish. Below 0.8 = bearish. Max Pain level = price will gravitate to at expiry.' },
    { icon: '◆', color: 'text-teal-400', title: 'Expiry Effect', body: 'Weekly expiry Thursday causes volatility. Avoid new entries on Weds/Thurs unless clear setup.' },
    { icon: '◆', color: 'text-purple-400', title: 'Budget / Result Season', body: 'Q1 results (Jul-Aug), Q2 (Oct-Nov), Q3 (Jan-Feb), Q4 (Apr-May). Stocks move 10–30% on results.' },
    { icon: '◆', color: 'text-purple-400', title: 'RBI Policy', body: 'Bi-monthly MPC meetings. Rate changes affect banking, NBFC, real estate stocks significantly.' },
    { icon: '◆', color: 'text-purple-400', title: 'US Market Correlation', body: 'Nifty has ~0.6 correlation with S&P 500. Global sell-offs drag NSE down regardless of domestic fundamentals.' },
  ]

  return (
    <div className="space-y-6">
      {/* Principle 1 */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-[#FF8000] text-xs font-bold uppercase tracking-widest mb-3">Principle 1 — Market Hierarchy</h3>
        <div className="border-l-2 border-[#FF8000] pl-4 py-2 bg-zinc-800/50 rounded-r-lg mb-4 text-sm text-zinc-300">
          <strong className="text-white">Nifty 50 trend → Nifty 100 sector → Individual stock direction.</strong> A stock in a bearish market that looks bullish will usually fail.
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { label: 'Bull Market Rules', color: 'text-green-400', body: 'Buy breakouts aggressively. Shallow dips are buying opportunities. Add to winners. Nifty above 200 DMA with rising slope.' },
            { label: 'Sideways/Choppy', color: 'text-[#FF8000]', body: 'Reduce position size. Trade only the clearest setups. Nifty between key MAs, no clear direction. Mean reversion better than breakouts.' },
            { label: 'Bear Market Rules', color: 'text-red-400', body: 'Drastically reduce exposure. Fewer trades. Cash is a position. Only short-side or wait. Nifty below 200 DMA, falling slope.' },
          ].map((c) => (
            <div key={c.label} className="bg-zinc-800 rounded-lg p-3">
              <div className={`text-xs font-bold uppercase tracking-widest mb-2 ${c.color}`}>{c.label}</div>
              <p className="text-zinc-400 text-xs leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Principle 2 */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-[#FF8000] text-xs font-bold uppercase tracking-widest mb-3">Principle 2 — Price & Volume: The Only Truth</h3>
        <p className="text-zinc-400 text-sm mb-4">Price is the ultimate indicator. Volume confirms intention. Richard Wyckoff built an entire school of thought solely on price-volume relationships.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-semibold text-green-400 mb-2">Bullish Volume Signals</div>
            {['Breakout on 2x+ average volume = institutional buying (Accumulation)', 'Price rising, volume rising = healthy uptrend', 'Price dips on low volume = weak selling, hold'].map((s) => (
              <div key={s} className="border-l-2 border-green-700 pl-3 py-1.5 bg-zinc-800/40 rounded-r mb-2 text-xs text-zinc-300">{s}</div>
            ))}
          </div>
          <div>
            <div className="text-xs font-semibold text-red-400 mb-2">Bearish Volume Signals</div>
            {['Price rising on declining volume = exhaustion, exit soon', 'Breakdown on heavy volume = Distribution, get out', 'High volume at resistance with little progress = sellers absorbing buyers'].map((s) => (
              <div key={s} className="border-l-2 border-red-800 pl-3 py-1.5 bg-zinc-800/40 rounded-r mb-2 text-xs text-zinc-300">{s}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Principle 3 */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-[#FF8000] text-xs font-bold uppercase tracking-widest mb-3">Principle 3 — Support, Resistance & Structure</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 text-sm text-zinc-400 leading-relaxed">
            <p>Price remembers. The more times a level is tested, the more significant the eventual break.</p>
            {[
              ['Previous highs become resistance', '— sellers who are trapped at these levels sell when price returns'],
              ['Broken resistance becomes support', '— old sellers become new buyers (flip of polarity)'],
              ['Round numbers (1000, 2500, 500)', '— psychological levels with huge option OI'],
              ['52-week highs', '— NSE stocks that break 52W high with volume go up avg 15–25% more'],
            ].map(([title, sub]) => (
              <div key={title} className="flex gap-2">
                <span className="text-[#FF8000] mt-0.5">▸</span>
                <span><strong className="text-white">{title}</strong>{sub}</span>
              </div>
            ))}
          </div>
          <div>
            <div className="text-xs font-bold text-[#FF8000] uppercase tracking-widest mb-3">Nifty 100 Sector Weightages</div>
            {sectors.map((s) => (
              <div key={s.name} className="flex items-center gap-2 mb-2 text-xs">
                <span className="text-zinc-400 w-36 flex-shrink-0">{s.name}</span>
                <div className="flex-1 h-1.5 bg-zinc-800 rounded overflow-hidden">
                  <div className="h-full bg-teal-500 rounded" style={{ width: `${s.pct}%` }} />
                </div>
                <span className="text-zinc-500 w-8 text-right">{s.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Principle 4 */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-[#FF8000] text-xs font-bold uppercase tracking-widest mb-4">Principle 4 — Trend Phases (Dow Theory + Weinstein Stages)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stages.map((s) => (
            <div key={s.label} className={`bg-zinc-800 border rounded-lg p-3 ${s.border}`}>
              <div className={`text-xs font-bold uppercase tracking-widest mb-2 ${s.color}`}>{s.label}</div>
              <p className="text-zinc-400 text-xs leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Principle 5 */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-[#FF8000] text-xs font-bold uppercase tracking-widest mb-4">Principle 5 — Indian Market Specifics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {indiaFactors.map((f) => (
            <div key={f.title} className="flex gap-2 text-sm">
              <span className={`mt-0.5 flex-shrink-0 ${f.color}`}>{f.icon}</span>
              <span className="text-zinc-400"><strong className="text-white">{f.title}</strong> — {f.body}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
