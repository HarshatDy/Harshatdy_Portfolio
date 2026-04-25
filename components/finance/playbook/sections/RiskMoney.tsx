// components/finance/playbook/sections/RiskMoney.tsx
"use client"

import { useState } from 'react'

const RULES = [
  'Never risk more than 1-2% of capital on a single trade. On ₹5L capital = max ₹5,000–₹10,000 risk per trade.',
  'Position size from your stop, not from a fixed amount. If stop is 5% away, your position = (2% capital risk) ÷ (5% stop) = 40% of capital max.',
  'Maximum portfolio risk at any time: 6–8%. If in 4 trades each risking 2%, one bad day can\'t blow you up.',
  'If you lose 10% of capital in a week, stop trading for 2 weeks. This prevents the emotional spiral that destroys accounts.',
]

const RR_ROWS = [
  { rr: '1:1', winRate: '50%', verdict: 'Too Low', color: 'text-red-400' },
  { rr: '1.5:1', winRate: '40%', verdict: 'Acceptable', color: 'text-purple-400' },
  { rr: '2:1', winRate: '33%', verdict: 'Good', color: 'text-green-400' },
  { rr: '3:1', winRate: '25%', verdict: 'Excellent', color: 'text-green-400' },
  { rr: '4:1+', winRate: '20%', verdict: 'Target This', color: 'text-green-400' },
]

export default function RiskMoney() {
  const [capital, setCapital] = useState(500000)
  const [riskPct, setRiskPct] = useState(2)
  const [stopPct, setStopPct] = useState(5)
  const [stockPrice, setStockPrice] = useState(1000)

  const riskAmount = capital * riskPct / 100
  const positionSize = stopPct > 0 ? riskAmount / (stopPct / 100) : 0
  const numShares = stockPrice > 0 ? Math.floor(positionSize / stockPrice) : 0
  const targetProfit = numShares * stockPrice * 0.10

  function fmt(n: number) {
    return '₹' + Math.round(n).toLocaleString('en-IN')
  }

  return (
    <div className="space-y-6">
      {/* Golden rules */}
      <div className="bg-zinc-900 border border-[#FF8000]/30 rounded-xl p-5">
        <h3 className="text-[#FF8000] text-xs font-bold uppercase tracking-widest mb-4">The Golden Rules (from Jack Schwager's Market Wizards)</h3>
        <div className="space-y-2">
          {RULES.map((r, i) => (
            <div key={i} className="border-l-2 border-[#FF8000] pl-4 py-2 bg-zinc-800/40 rounded-r text-sm text-zinc-300">
              <span className="font-bold text-white">{i + 1}.</span> {r}
            </div>
          ))}
        </div>
      </div>

      {/* Position size calculator */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-[#FF8000] text-xs font-bold uppercase tracking-widest mb-4">Position Sizing Calculator</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {[
              { label: 'Capital (₹)', value: capital, onChange: setCapital, step: 10000, min: 10000, max: 10000000 },
              { label: 'Risk per trade (%)', value: riskPct, onChange: setRiskPct, step: 0.5, min: 0.5, max: 5 },
              { label: 'Stop distance (%)', value: stopPct, onChange: setStopPct, step: 0.5, min: 1, max: 15 },
              { label: 'Stock price (₹)', value: stockPrice, onChange: setStockPrice, step: 10, min: 1, max: 100000 },
            ].map(({ label, value, onChange, step, min, max }) => (
              <div key={label}>
                <label className="text-xs text-zinc-500 block mb-1">{label}</label>
                <input
                  type="number"
                  value={value}
                  step={step}
                  min={min}
                  max={max}
                  onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FF8000]/50"
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 content-start">
            {[
              { label: 'Max risk amount', value: fmt(riskAmount), color: 'text-[#FF8000]' },
              { label: 'Position size (₹)', value: fmt(positionSize), color: 'text-teal-400' },
              { label: 'Number of shares', value: numShares.toLocaleString('en-IN'), color: 'text-purple-400' },
              { label: 'Target (10% profit)', value: fmt(targetProfit), color: 'text-green-400' },
            ].map((s) => (
              <div key={s.label} className="bg-zinc-800 rounded-lg p-3">
                <div className="text-xs text-zinc-500">{s.label}</div>
                <div className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* R:R table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-[#FF8000] text-xs font-bold uppercase tracking-widest mb-4">Reward-to-Risk Framework</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left py-2 px-3 text-xs text-zinc-500 font-medium uppercase tracking-wider">R:R Ratio</th>
              <th className="text-left py-2 px-3 text-xs text-zinc-500 font-medium uppercase tracking-wider">Win Rate to Break Even</th>
              <th className="text-left py-2 px-3 text-xs text-zinc-500 font-medium uppercase tracking-wider">Verdict</th>
            </tr>
          </thead>
          <tbody>
            {RR_ROWS.map((row) => (
              <tr key={row.rr} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                <td className="py-2.5 px-3 text-white font-medium">{row.rr}</td>
                <td className="py-2.5 px-3 text-zinc-400">{row.winRate}</td>
                <td className="py-2.5 px-3"><span className={`text-xs font-bold ${row.color}`}>{row.verdict}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-3 border-l-2 border-[#FF8000] pl-3 py-2 bg-zinc-800/40 rounded-r text-xs text-zinc-300">
          For 10% target, stop must be no more than 5-6% away (minimum 1.7:1 R:R). Ideally stop at 3-4% for 2.5–3:1 ratio.
        </div>
      </div>
    </div>
  )
}
