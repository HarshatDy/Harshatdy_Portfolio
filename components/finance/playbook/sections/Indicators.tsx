// components/finance/playbook/sections/Indicators.tsx
"use client"

import { useState } from 'react'

const INDICATORS = [
  { name: 'RSI', cat: 'Momentum', color: 'bg-purple-400',
    formula: 'RSI = 100 - [100/(1 + RS)] where RS = Avg Gain / Avg Loss over 14 periods',
    signal: '<30 = Oversold (potential buy). >70 = Overbought (potential sell). 50-70 = sweet zone for swing longs.',
    use: 'Enter when RSI crosses above 55 in an uptrend. Exit when RSI crosses below 70 from above. RSI divergence (price new high, RSI lower high) = warning signal.',
    avoid: 'Never buy simply because RSI is "oversold" — a stock can stay oversold for months in a downtrend.' },
  { name: 'MACD', cat: 'Trend/Momentum', color: 'bg-blue-400',
    formula: 'MACD Line = EMA(12) - EMA(26)\nSignal Line = EMA(9) of MACD\nHistogram = MACD - Signal',
    signal: 'Bullish: MACD line crosses above signal line. Histogram turns positive. Best when crossing above zero line.',
    use: 'MACD crossover + bullish candle pattern + volume = powerful combination. Use histogram expansion as trend confirmation.',
    avoid: 'MACD lags — it\'s a confirmation tool, not a leading indicator. In choppy markets, multiple false crossovers occur.' },
  { name: 'EMA 20/50/200', cat: 'Trend', color: 'bg-[#FF8000]',
    formula: 'EMA(n) = Price × (2/(n+1)) + EMA_prev × (1 - 2/(n+1))',
    signal: 'Golden Cross (50 crosses above 200) = major bullish signal. Price above EMA 20 = short-term uptrend. EMA 20 > 50 > 200 = full bull alignment.',
    use: 'Use EMA 20 as dynamic support for trailing stops in swing trades. Pullback to EMA 20 in uptrend = buy opportunity. Break below EMA 50 = reduce position.',
    avoid: 'EMAs are lagging. In sideways markets they give no information — price will oscillate around them with whipsaws.' },
  { name: 'Bollinger Bands', cat: 'Volatility', color: 'bg-teal-400',
    formula: 'Middle Band = SMA(20)\nUpper Band = SMA + 2×StdDev\nLower Band = SMA - 2×StdDev',
    signal: 'Band Squeeze (bands narrow) = upcoming volatility explosion. Break above upper band on volume = bullish momentum.',
    use: 'After a Bollinger Squeeze, buy the breakout direction with volume confirmation. For mean-reversion: buy touch of lower band only if RSI is 30-50 and trend is up.',
    avoid: 'Don\'t trade touches alone. In strong trends price "walks the upper band" for weeks — this is strength, not reversal.' },
  { name: 'Volume', cat: 'Confirmation', color: 'bg-green-400',
    formula: 'OBV = Running total of volume with + on up days, - on down days\nVolume MA = SMA(20) of daily volume',
    signal: 'Breakout on 2x+ average volume = institutional interest. Rising price + falling volume = trend weakening.',
    use: 'Every entry must have volume > 1.5x 20-day average on breakout day. No volume = fake breakout, skip trade.',
    avoid: 'Don\'t use volume alone. In pre-results periods, volume spikes on speculation, not genuine institutional activity.' },
  { name: 'ADX', cat: 'Trend Strength', color: 'bg-red-400',
    formula: 'ADX = Smoothed Moving Avg of DX\nDX = |+DI - -DI| / |+DI + -DI| × 100',
    signal: 'ADX > 25 = strong trend, breakout strategies work. ADX < 20 = choppy market, avoid breakouts.',
    use: 'Only enter breakout trades when ADX is above 20 and rising. If ADX is below 20, use mean-reversion setups instead.',
    avoid: 'ADX tells you trend strength but not direction. A falling stock can have ADX > 25. Always combine with +DI/-DI.' },
  { name: 'Stochastic', cat: 'Momentum', color: 'bg-[#FF8000]',
    formula: '%K = (Current Close - Lowest Low)/(Highest High - Lowest Low) × 100\n%D = 3-period SMA of %K',
    signal: '<20 = Oversold. >80 = Overbought. %K crossing above %D in oversold zone = buy signal.',
    use: 'Use for timing pullback entries in uptrends. When stock pulls back to EMA 20 and Stochastic is below 30, entering on %K/%D cross is high probability.',
    avoid: 'Like RSI, ignore oversold signals in downtrends. Only use in context of overall uptrend.' },
  { name: 'Fibonacci', cat: 'Price Levels', color: 'bg-purple-400',
    formula: 'Key levels: 23.6%, 38.2%, 50%, 61.8% retracement of prior swing move',
    signal: '38.2% and 61.8% retracements are the highest probability pullback zones. 61.8% is the "golden ratio".',
    use: 'After a strong up-move, wait for pullback to 38.2–61.8% zone, then look for reversal candles + RSI bounce + volume drying up.',
    avoid: 'Don\'t use Fibonacci in isolation. If price breaks below 61.8% of the prior move, the "pullback" is probably a new downtrend.' },
  { name: 'VWAP', cat: 'Institutional', color: 'bg-teal-400',
    formula: 'VWAP = Cumulative(Price × Volume) / Cumulative Volume (Resets daily)',
    signal: 'Price above VWAP = buyers in control. Below VWAP = sellers in control. Institutional algorithms use VWAP for order execution.',
    use: 'Stocks that gap up and hold above VWAP for first 30 mins = strong for the day. Use VWAP as intraday stop for swing positions entered intraday.',
    avoid: 'VWAP resets daily, so it\'s an intraday tool. Don\'t apply it to swing trade exits.' },
  { name: 'SuperTrend', cat: 'Trend', color: 'bg-green-400',
    formula: 'SuperTrend = (High+Low)/2 ± (Multiplier × ATR)\nDefault: Period=7, Multiplier=3',
    signal: 'Green SuperTrend below price = bullish. Red SuperTrend above price = bearish. Flip from red to green = buy signal.',
    use: 'Many Indian traders use SuperTrend as a simple trailing stop. When SuperTrend flips to green, enter. Trail with SuperTrend line.',
    avoid: 'In sideways markets, SuperTrend flips repeatedly creating many false signals and stop-outs.' },
  { name: 'ATR', cat: 'Volatility', color: 'bg-red-400',
    formula: 'ATR = Smoothed Moving Avg of True Range\nTrue Range = Max(High-Low, |High-PrevClose|, |Low-PrevClose|)',
    signal: 'High ATR = high volatility, widen stops. Low ATR = low volatility (squeeze). ATR breakout = volatility expansion starting.',
    use: 'Set stop-loss as Entry Price - 2×ATR. This adapts to each stock\'s volatility. A ₹200 stock with ATR 8 needs stop at 16 below entry.',
    avoid: 'ATR doesn\'t give direction — only magnitude. Always combine with directional indicator.' },
  { name: 'OBV', cat: 'Volume', color: 'bg-blue-400',
    formula: 'OBV = OBV_prev + Volume (if close > prev close)\nOBV = OBV_prev - Volume (if close < prev close)',
    signal: 'OBV making new highs while price makes new highs = confirmed uptrend. OBV diverging downward while price still rising = distribution warning.',
    use: 'Use OBV divergence as early warning of institutional selling even before price drops. If OBV starts declining while price holds — reduce exposure.',
    avoid: 'OBV is a cumulative measure and can diverge for extended periods before price follows. Don\'t act on divergence alone.' },
]

export default function Indicators() {
  const [selected, setSelected] = useState<number | null>(null)

  const ind = selected !== null ? INDICATORS[selected] : null

  return (
    <div className="space-y-4">
      <p className="text-zinc-500 text-sm">Click any indicator card to see formula, signals, and how to use it in NSE swing trades.</p>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {INDICATORS.map((i, idx) => (
          <button
            key={i.name}
            onClick={() => setSelected(selected === idx ? null : idx)}
            className={[
              'bg-zinc-900 border rounded-lg p-3 text-left transition-all',
              selected === idx
                ? 'border-[#FF8000]/50 bg-[#FF8000]/5'
                : 'border-zinc-800 hover:border-zinc-700',
            ].join(' ')}
          >
            <div className="flex items-start justify-between">
              <span className="text-white text-sm font-semibold">{i.name}</span>
              <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1 ${i.color}`} />
            </div>
            <div className="text-zinc-500 text-xs mt-0.5">{i.cat}</div>
          </button>
        ))}
      </div>

      {/* Detail panel */}
      {ind ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
          <h3 className="text-[#FF8000] text-sm font-bold">{ind.name} — {ind.cat}</h3>
          <div>
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Formula</div>
            <pre className="font-mono text-xs text-teal-400 bg-black border border-zinc-800 rounded p-3 whitespace-pre-wrap leading-relaxed">{ind.formula}</pre>
          </div>
          <div>
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Signals</div>
            <p className="text-zinc-400 text-sm leading-relaxed">{ind.signal}</p>
          </div>
          <div>
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">How to Use for NSE Swings</div>
            <p className="text-zinc-400 text-sm leading-relaxed">{ind.use}</p>
          </div>
          <div>
            <div className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2">⚠ Common Mistake</div>
            <p className="text-zinc-400 text-sm leading-relaxed">{ind.avoid}</p>
          </div>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-center justify-center h-24">
          <p className="text-zinc-600 text-sm">← Select an indicator above to see details</p>
        </div>
      )}
    </div>
  )
}
