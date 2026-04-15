# Notion Sync — Knowledge Base

The Knowledge Base page is populated by syncing content from Notion into Supabase. The page will be empty until a sync has run at least once.

## How it works

```
Notion workspace
  └── Root page per domain (configured via env var)
        ├── Child page 1
        ├── Child page 2  ──→  API: /api/knowledge/sync ──→  Supabase: notion_pages table
        └── Child page 3                                           └── Knowledge Base UI reads from here
```

1. Each domain (`platform`, `cpp`, `os`, `5g`, `finance`) has a **root page ID** set in `.env.local`
2. The sync API walks the full page tree under that root, converts blocks to HTML, and upserts rows into the `notion_pages` Supabase table
3. The Knowledge Base UI reads from Supabase — it never calls Notion directly at runtime

## Prerequisites

### 1. Create a Notion integration

1. Go to [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click **+ New integration**
3. Give it a name (e.g. `portfolio-kb`), select your workspace
4. Copy the **Internal Integration Token** → `NOTION_API_KEY`

### 2. Share your Notion pages with the integration

For each root page you want to sync:

1. Open the page in Notion
2. Click **...** (top right) → **Connections** → select your integration

You must share **each root page** explicitly. Child pages inherit access automatically.

### 3. Get the root page IDs

The page ID is the last part of the Notion URL:
```
https://www.notion.so/Your-Page-Title-<PAGE_ID>
```
Copy the 32-character ID (with or without dashes — both work).

### 4. Add to .env.local

```env
NOTION_API_KEY=secret_...
NOTION_PLATFORM_ROOT_PAGE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_CPP_ROOT_PAGE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_OS_ROOT_PAGE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_5G_ROOT_PAGE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_FINANCE_ROOT_PAGE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

You don't need to set all five — leave blank any domain you aren't using. Syncing a domain with no root page ID will simply skip it.

## Running a sync

### Manually (local dev)

Use the test script:

```bash
node scripts/test-triggers.js sync
# or sync a single domain:
node scripts/test-triggers.js sync platform
```

### Via GitHub Actions (production)

The workflow `.github/workflows/notion-sync-cron.yml` runs automatically at **2 AM UTC daily**.

You can also trigger it manually:
1. Go to your repo on GitHub → **Actions** tab
2. Select **Notion Knowledge Base Sync**
3. Click **Run workflow**

### Direct curl (if you have the CRON_SECRET)

```bash
curl -X POST http://localhost:3000/api/knowledge/sync \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{}'

# Sync only one domain:
curl -X POST http://localhost:3000/api/knowledge/sync \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"domain": "platform"}'
```

## Access control

The Knowledge Base is gated — only **verified newsletter subscribers** can view page content. A user enters their email on the Knowledge page; the frontend calls `/api/knowledge/access` which checks the `subscribers` table for a verified record.

## Supported Notion block types

The renderer (`lib/utils/notionBlockRenderer.ts`) converts these Notion blocks to HTML:

- Paragraphs, headings (H1/H2/H3)
- Bulleted and numbered lists
- Toggle blocks
- Code blocks (with language label)
- Quotes, callouts, dividers
- Bold, italic, inline code, links (inline rich text)

Unsupported blocks (e.g. databases, embeds) are silently skipped.
