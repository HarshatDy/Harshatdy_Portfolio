# Adding a New Knowledge Base Domain

A "domain" is a topic area (e.g. `cpp`, `os`, `5g`). Each domain has:
- Its own Notion root page (source of content)
- A sidebar tab in the Knowledge Base
- A newsletter subscription option
- A daily newsletter cron job

Adding a new domain requires changes to **5 files** and one env var. Example below uses `rust` as the new domain.

---

## Step 1 — Add to the Domain type and DOMAINS list

**File:** `app/data/types/newsletter.ts`

```ts
// Before
export type Domain = 'platform' | 'cpp' | 'os' | '5g' | 'finance'

// After
export type Domain = 'platform' | 'cpp' | 'os' | '5g' | 'finance' | 'rust'
```

```ts
export const DOMAINS = [
  { value: 'platform', label: 'Platform Engineering', icon: '🏗️' },
  { value: 'cpp',      label: 'C++ Development',      icon: '⚙️' },
  { value: 'os',       label: 'OS Development',        icon: '🖥️' },
  { value: '5g',       label: '5G & Networking',       icon: '📡' },
  { value: 'finance',  label: 'Finance & Stocks',      icon: '📈' },
  { value: 'rust',     label: 'Rust Programming',      icon: '🦀' }, // ← add this
]
```

This is the only file that controls what appears in the sidebar tabs and the newsletter subscribe form.

---

## Step 2 — Add the Notion env var mapping

**File:** `lib/services/notion.ts` — inside `getDomainRootPageId()`

```ts
const map: Record<Domain, string | undefined> = {
  platform: process.env.NOTION_PLATFORM_ROOT_PAGE_ID,
  cpp:      process.env.NOTION_CPP_ROOT_PAGE_ID,
  os:       process.env.NOTION_OS_ROOT_PAGE_ID,
  '5g':     process.env.NOTION_5G_ROOT_PAGE_ID,
  finance:  process.env.NOTION_FINANCE_ROOT_PAGE_ID,
  rust:     process.env.NOTION_RUST_ROOT_PAGE_ID,  // ← add this
}
```

---

## Step 3 — Add to the sync route's domain list

**File:** `app/api/knowledge/sync/route.ts`

```ts
// Before
const ALL_DOMAINS: Domain[] = ['platform', 'cpp', 'os', '5g', 'finance']

// After
const ALL_DOMAINS: Domain[] = ['platform', 'cpp', 'os', '5g', 'finance', 'rust']
```

---

## Step 4 — Add to the newsletter subscribe route

**File:** `app/api/newsletter/subscribe/route.ts`

```ts
// Before
const VALID_DOMAINS: Domain[] = ['platform', 'cpp', 'os', '5g', 'finance']

// After
const VALID_DOMAINS: Domain[] = ['platform', 'cpp', 'os', '5g', 'finance', 'rust']
```

---

## Step 5 — Add to the GitHub Actions newsletter cron

**File:** `.github/workflows/newsletter-cron.yml`

```yaml
matrix:
  # Before
  domain: [platform, cpp, os, 5g, finance]

  # After
  domain: [platform, cpp, os, 5g, finance, rust]
```

---

## Step 6 — Add env vars

**`.env.local`** (local dev):
```env
NOTION_RUST_ROOT_PAGE_ID=your_32_char_notion_page_id
```

**GitHub repo secrets** (production — Settings → Secrets and variables → Actions):

No new secret needed for the domain itself. The cron workflow already uses `SITE_URL` and `CRON_SECRET`. Just add the Notion page ID to your deployed environment (Vercel/Railway env vars, etc.).

> To get the Notion page ID: open the page in Notion, copy the URL, take the 32-character hex string at the end after the last `-`.
>
> Don't forget to share the page with your Notion integration (open page → ... → Connections → select your integration).

---

## Step 7 — Sync and verify

```bash
# Restart dev server to pick up the new env var
npm run dev

# In a second terminal, run the sync for just the new domain
node scripts/test-triggers.js sync rust
```

Expected output:
```
✓ 200: { "success": true, "total_synced": 42, "results": [{ "domain": "rust", "synced": 42 }] }
```

Then open `/knowledge` in your browser — the new domain tab should appear in the sidebar with all its pages.

---

## Checklist

- [ ] `app/data/types/newsletter.ts` — type union + DOMAINS array
- [ ] `lib/services/notion.ts` — env var mapping in `getDomainRootPageId`
- [ ] `app/api/knowledge/sync/route.ts` — ALL_DOMAINS array
- [ ] `app/api/newsletter/subscribe/route.ts` — VALID_DOMAINS array
- [ ] `.github/workflows/newsletter-cron.yml` — matrix domain list
- [ ] `.env.local` — new `NOTION_*_ROOT_PAGE_ID` var
- [ ] Notion page shared with integration
- [ ] `node scripts/test-triggers.js sync <domain>` run successfully

---

## Removing a domain

Reverse the same 5 file changes, then delete the rows from Supabase:

```sql
delete from notion_pages where domain = 'rust';
delete from subscriber_domains where domain = 'rust';
```
