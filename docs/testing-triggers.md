# Manual Testing — Cron Triggers

All cron-protected endpoints (`/api/newsletter/send`, `/api/knowledge/sync`, `/api/finance/fetch`) require a `Bearer CRON_SECRET` header. The test script handles this automatically using your `.env.local`.

## Prerequisites

1. Dev server running: `npm run dev`
2. `.env.local` present with `CRON_SECRET` set

## Usage

```bash
node scripts/test-triggers.js <command> [domain]
```

### Send newsletter

```bash
# Single domain
node scripts/test-triggers.js newsletter platform
node scripts/test-triggers.js newsletter cpp
node scripts/test-triggers.js newsletter os
node scripts/test-triggers.js newsletter 5g
node scripts/test-triggers.js newsletter finance

# All domains (sequential, same as the GitHub Actions cron)
node scripts/test-triggers.js newsletter
```

What it does:
- Fetches the Notion root page for that domain
- Calls Claude to generate the HTML newsletter
- Sends it to all verified subscribers for that domain via Gmail
- Logs the result to `newsletter_logs` in Supabase

> If there are no verified subscribers yet the send count will be 0 but the generation still runs. Check your terminal for the Claude output and any errors.

### Sync Notion knowledge base

```bash
# Single domain
node scripts/test-triggers.js sync platform

# All domains
node scripts/test-triggers.js sync
```

What it does:
- Walks the full page tree under the Notion root page for that domain
- Converts all blocks to HTML
- Upserts rows into the `notion_pages` Supabase table
- The Knowledge Base UI will show the content immediately after sync

### Fetch stock data

```bash
node scripts/test-triggers.js finance
```

What it does:
- Fetches 30-day price history for all active stocks in the `stocks` table
- Calls Claude to generate analysis and sentiment for each ticker
- Upserts results into `stock_prices` and `stock_analysis` tables

## Triggering from GitHub Actions (production)

All three workflows support `workflow_dispatch` — you can trigger them manually without waiting for the schedule:

1. Go to your repo on GitHub → **Actions** tab
2. Select the workflow (e.g. **Daily Newsletter**)
3. Click **Run workflow → Run workflow**

## Checking logs

After a newsletter send, check the result in Supabase:

```sql
select * from newsletter_logs order by created_at desc limit 20;
```
