# Indian Stock Dashboard — Design Spec

**Date:** 2026-04-19  
**Status:** Approved  

---

## Overview

A new section of the portfolio Finance page dedicated to Indian equities. Tracks all Nifty 50 stocks, scores them daily via a multi-factor algorithm, generates Buy/Hold/Sell signals with Claude AI rationale and target prices, and shows 7-day signal history per stock. Data is fetched 3× per day during NSE market hours.

---

## Decisions Made

| Topic | Decision |
|---|---|
| Data source | Yahoo Finance (`yahoo-finance2`) with `.NS` suffix |
| Stock universe | Nifty 50 (50 stocks, seeded once) |
| Signal generation | Hybrid: rule-based score → signal + Claude rationale + target price |
| Prediction history | 7 days per stock |
| Layout | Sidebar list + click-to-open detail panel |
| Fetch schedule | 3×/day IST: 9:30 AM, 12:30 PM, 4:00 PM (weekdays only) |

---

## Architecture

### Data Flow

```
Cron (3x/day, weekdays)
  → POST /api/finance/india/fetch?slot=[open|midday|close]
    → Yahoo Finance — fetch OHLCV for all 50 Nifty stocks (.NS tickers)
    → indiaScoring.ts — compute multi-factor score for each stock
    → Signal threshold — BUY / HOLD / SELL from score
    → Claude Haiku (close slot only) — rationale + target price (top changers + top 10 by score)
    → Upsert to Supabase

Browser
  → GET /api/finance/india/stocks         — sidebar list
  → GET /api/finance/india/stock/[ticker] — detail panel data
```

### Scoring Algorithm (`lib/services/indiaScoring.ts`)

Pure function — no DB or API calls. Input: array of `{ ticker, prices[], volumes[] }`. Output: scored + ranked array.

| Factor | Weight | Calculation |
|---|---|---|
| Momentum | 40% | 7-day price return %, normalized 0–100 across all 50 stocks |
| Volume surge | 30% | Today's volume ÷ 7-day avg volume, normalized 0–100 |
| Volatility (inverse) | 30% | 1 ÷ (7-day std deviation of close), normalized 0–100 |
| **Combined score** | 100% | Weighted sum, range 0–100 |

**Signal thresholds:**
- Score ≥ 65 → **BUY**
- Score 35–64 → **HOLD**
- Score < 35 → **SELL**

### Claude Call Strategy

- Runs only on the `close` slot (4:00 PM IST) to avoid 3× daily cost
- Batched: all stocks in a single Claude Haiku call
- Filtered to: stocks that changed signal today + top 10 by score
- Output per stock: 1–2 sentence rationale, sentiment, target price, upside/downside %
- If Claude fails: signal is saved from algorithm, `rationale` is `null` — UI shows "Analysis pending"

---

## Database Schema (Supabase)

### `indian_stocks`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| ticker | text (unique) | e.g. `RELIANCE` |
| yahoo_ticker | text | e.g. `RELIANCE.NS` |
| name | text | Full company name |
| sector | text | e.g. Energy, IT, Banking |
| active | boolean | default true |

### `indian_stock_prices`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| stock_id | uuid (FK) | |
| date | date | |
| fetch_slot | text | `open`, `midday`, or `close` |
| open | numeric | |
| high | numeric | |
| low | numeric | |
| close | numeric | |
| volume | bigint | |

Unique constraint: `(stock_id, date, fetch_slot)`

### `indian_stock_signals`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| stock_id | uuid (FK) | |
| date | date | |
| score | numeric | 0–100 combined score |
| momentum_score | numeric | sub-score |
| volume_score | numeric | sub-score |
| volatility_score | numeric | sub-score |
| signal | text | `BUY`, `HOLD`, or `SELL` |
| target_price | numeric | nullable — from Claude |
| upside_pct | numeric | nullable — (target - close) / close × 100 |
| rationale | text | nullable — from Claude |

Unique constraint: `(stock_id, date)`

---

## API Routes

| Route | Method | Auth | Purpose |
|---|---|---|---|
| `/api/finance/india/fetch` | POST | cron secret | Fetch prices, score, analyze, upsert |
| `/api/finance/india/stocks` | GET | public | Sidebar list — all 50 stocks with latest signal + 7D change |
| `/api/finance/india/stock/[ticker]` | GET | public | Detail panel — prices (30d), signal history (7d), rationale |

### `/api/finance/india/fetch` query params
- `slot` — `open` | `midday` | `close` (required)

---

## File Structure

```
app/finance/india/
  page.tsx                          — route + metadata
  IndiaDashboard.tsx                — sidebar + detail panel shell

app/api/finance/india/
  fetch/route.ts                    — cron POST endpoint
  stocks/route.ts                   — sidebar GET
  stock/[ticker]/route.ts           — detail GET

components/finance/india/
  IndiaStockSidebar.tsx             — scrollable list, signal badge, 7D %
  IndiaStockDetail.tsx              — detail panel: chart, score, history, rationale
  SignalBadge.tsx                   — BUY/HOLD/SELL pill (reusable)
  SignalHistory.tsx                 — 7-day horizontal signal timeline
  ScoreRing.tsx                     — circular 0–100 score indicator (orange)

lib/db/queries/indiaFinance.ts      — all Supabase queries
lib/services/indiaStocks.ts         — Yahoo Finance fetch for .NS tickers
lib/services/indiaScoring.ts        — multi-factor scoring (pure function)

scripts/seed-india-stocks.ts        — one-time Nifty 50 seed script
```

---

## Cron Schedule

| Slot | IST | UTC | Cron (UTC) |
|---|---|---|---|
| open | 9:30 AM | 04:00 | `0 4 * * 1-5` |
| midday | 12:30 PM | 07:00 | `0 7 * * 1-5` |
| close | 4:00 PM | 10:30 | `30 10 * * 1-5` |

---

## UI Behaviour

### Sidebar (`IndiaStockSidebar`)
- Lists all 50 Nifty stocks sorted by score descending
- Each row: ticker, name, signal badge, 7-day % change (green/red)
- Selected stock highlighted with orange left border
- Top 3 by score get an orange "TOP PICK" indicator

### Detail Panel (`IndiaStockDetail`)
- Header: ticker, full name, sector, current price, score ring
- Signal badge + target price + upside/downside %
- 30-day area chart (orange, existing Recharts setup)
- 7-day signal history timeline (date + BUY/HOLD/SELL pill per day)
- Claude rationale text block (or "Analysis pending" if null)
- Sub-scores breakdown: Momentum / Volume / Volatility bars

### Empty States
| Condition | UI |
|---|---|
| No data yet | Skeleton shimmer in sidebar + "Fetching market data..." |
| Signal pending (Claude failed) | Score + chart shown, "Analysis pending" in rationale area |
| Weekend / holiday | Data shown with "As of [date]" label |
| Stock not in DB | 404 from detail API, panel shows "Stock not found" |

---

## Error Handling

- **Yahoo Finance failure per ticker** — retry once, skip + log, continue batch
- **Claude failure** — signal saved from algorithm, rationale = null
- **Stale data guard** — if Yahoo returns data older than 24h, skip upsert
- **Market holiday** — no special detection needed; stale data guard handles it

---

## Seeding

`scripts/seed-india-stocks.ts` — inserts all 50 Nifty 50 stocks with ticker, yahoo_ticker, name, sector. Run once manually before first cron execution.

All 50 tickers hardcoded in the script (e.g. `RELIANCE` → `RELIANCE.NS`, sector: Energy).

---

## Out of Scope

- Real-time WebSocket price streaming
- BSE stocks (only NSE `.NS` tickers)
- User portfolio tracking / P&L
- Alerts or notifications
- Historical signal accuracy / backtesting
