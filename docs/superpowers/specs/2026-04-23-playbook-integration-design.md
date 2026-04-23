# NSE 100 Swing Trading Playbook — Finance Integration

**Date:** 2026-04-23
**Status:** Approved

## Summary

Integrate `nse100_swing_trading_playbook.html` into the portfolio's `/finance` section as a fully converted React page at `/finance/playbook`. The playbook content is ported to Tailwind-styled TSX components matching the existing portfolio dark theme. Two entry points are added to the existing finance UI for discovery.

## Route

`app/finance/playbook/page.tsx` — Next.js server component with metadata. Renders `PlaybookShell` (client component).

## Component Structure

```
components/finance/playbook/
  PlaybookShell.tsx          ← 8-tab navigation + active section switcher (useState<Tab>)
  sections/
    Overview.tsx             ← stat cards, 5-layer framework timeline, expert consensus grid
    MarketPrinciples.tsx     ← 5 principles: market hierarchy, price/volume, S/R, trend stages, India specifics
    Indicators.tsx           ← 12 indicator cards grid; click → detail panel (useState<number|null>)
    Algorithms.tsx           ← 8 algo cards, each expand/collapse (useState<Set<number>>)
    StockScanner.tsx         ← 3-stage checklist, entry/exit rules, stock category lists
    RiskMoney.tsx            ← golden rules, interactive position size calculator (useState), R:R table
    Psychology.tsx           ← 5 killers timeline, daily process schedule, journal framework table
    WeeklyPlaybook.tsx       ← 5-day rhythm grid, perfect setup checklist, learning roadmap timeline
```

## Interactive Elements

| Original HTML behaviour | React implementation |
|---|---|
| `showPage(id)` tab switching | `useState<Tab>` in `PlaybookShell` |
| Indicator card click → detail panel | `useState<number \| null>` selectedIndicator in `Indicators` |
| Algo card toggle open/close | `useState<Set<number>>` openAlgos in `Algorithms` |
| Position size calculator (4 inputs) | `useState` for capital, riskPct, stopPct, stockPrice; derived values computed inline |

## Styling

- Background: `bg-black`, cards: `bg-zinc-900 border border-zinc-800 rounded-xl`
- Gold accent: `#FF8000` (matches portfolio) — maps to playbook's `--gold`
- Teal: `text-teal-400`, Green: `text-green-400`, Red: `text-red-400`, Purple: `text-purple-400`, Blue: `text-blue-400`
- Serif headings: `font-serif` (DM Serif Display already loaded)
- Monospace formula blocks: `font-mono bg-black border border-zinc-800 rounded p-3 text-teal-400`
- Tags (BUY/SELL/NEUTRAL): small coloured badge spans with bg-opacity utilities

## Entry Points (changes to existing files)

### 1. `app/finance/FinanceShell.tsx`
Add a `<Link href="/finance/playbook">` ghost button in the top-right of the tab bar row.
- Label: "Playbook" with a book/scroll icon (Lucide `BookOpen`)
- Style: `text-zinc-500 hover:text-zinc-300 text-sm flex items-center gap-1`
- Positioned with `ml-auto` to push to the right end of the tab row

### 2. `app/finance/india/IndiaDashboard.tsx`
Add a contextual banner card at the bottom of the dashboard (after the stock list/detail panel).
- Text: "Learn the strategy behind these signals" + "NSE 100 Swing Trading Playbook →"
- Style: `bg-zinc-900 border border-zinc-800 rounded-xl p-4` with `#FF8000` arrow/accent
- Renders as a `<Link href="/finance/playbook">` block

## Files Changed

| File | Change type |
|---|---|
| `app/finance/playbook/page.tsx` | New |
| `components/finance/playbook/PlaybookShell.tsx` | New |
| `components/finance/playbook/sections/Overview.tsx` | New |
| `components/finance/playbook/sections/MarketPrinciples.tsx` | New |
| `components/finance/playbook/sections/Indicators.tsx` | New |
| `components/finance/playbook/sections/Algorithms.tsx` | New |
| `components/finance/playbook/sections/StockScanner.tsx` | New |
| `components/finance/playbook/sections/RiskMoney.tsx` | New |
| `components/finance/playbook/sections/Psychology.tsx` | New |
| `components/finance/playbook/sections/WeeklyPlaybook.tsx` | New |
| `app/finance/FinanceShell.tsx` | Modified — add Playbook link button |
| `app/finance/india/IndiaDashboard.tsx` | Modified — add bottom banner card |

## Out of Scope

- No backend/API changes
- No database schema changes
- The original `nse100_swing_trading_playbook.html` file is kept as-is (source of truth for content)
