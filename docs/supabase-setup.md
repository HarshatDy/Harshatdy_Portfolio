# Supabase Setup

Supabase (hosted Postgres) is used as the database for subscribers, knowledge base pages, stock data, and newsletter logs.

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in (free tier is sufficient)
2. Click **New project**, choose a name and region
3. Wait for the project to provision (~1 min)

## 2. Get your credentials

Go to **Project Settings → API**:

- **Project URL** → `SUPABASE_URL`
- **service_role** key (under "Project API keys") → `SUPABASE_SERVICE_ROLE_KEY`

Add both to your `.env.local`:

```env
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

> The service role key bypasses Row Level Security — never expose it in client-side code. It is only used in server-side API routes (`lib/db/client.ts` uses `import 'server-only'`).

## 3. Create the tables

Open **SQL Editor** in the Supabase dashboard and run the following:

```sql
-- Newsletter subscribers
create table subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  verified boolean default false,
  verify_token text,
  verify_expires text,
  created_at timestamptz default now()
);

-- Per-domain subscription preferences
create table subscriber_domains (
  id uuid primary key default gen_random_uuid(),
  subscriber_id uuid references subscribers(id) on delete cascade,
  domain text not null,
  active boolean default true,
  subscribed_at timestamptz default now(),
  unsubscribed_at timestamptz,
  unique(subscriber_id, domain)
);

-- Newsletter send history
create table newsletter_logs (
  id uuid primary key default gen_random_uuid(),
  domain text not null,
  send_date date not null,
  recipient_count int default 0,
  claude_tokens int,
  status text default 'pending',
  error_message text,
  created_at timestamptz default now(),
  unique(domain, send_date)
);

-- Knowledge base pages synced from Notion
create table notion_pages (
  id uuid primary key default gen_random_uuid(),
  notion_page_id text unique not null,
  parent_id text,
  domain text not null,
  title text not null,
  slug text not null,
  icon text,
  content_html text default '',
  depth int default 0,
  sort_order int default 0,
  last_synced_at timestamptz default now()
);

-- Finance: tracked stocks
create table stocks (
  id uuid primary key default gen_random_uuid(),
  ticker text unique not null,
  name text,
  active boolean default true,
  created_at timestamptz default now()
);

-- Finance: daily price history
create table stock_prices (
  id uuid primary key default gen_random_uuid(),
  stock_id uuid references stocks(id) on delete cascade,
  date date not null,
  open numeric,
  high numeric,
  low numeric,
  close numeric,
  volume bigint,
  unique(stock_id, date)
);

-- Finance: Claude-generated analysis
create table stock_analysis (
  id uuid primary key default gen_random_uuid(),
  stock_id uuid references stocks(id) on delete cascade,
  date date not null,
  analysis text,
  sentiment text,
  key_points jsonb,
  claude_tokens int,
  unique(stock_id, date)
);
```

## 4. Disable Row Level Security (RLS)

The API routes use the service role key which bypasses RLS, but to keep things simple disable RLS on all tables:

```sql
alter table subscribers disable row level security;
alter table subscriber_domains disable row level security;
alter table newsletter_logs disable row level security;
alter table notion_pages disable row level security;
alter table stocks disable row level security;
alter table stock_prices disable row level security;
alter table stock_analysis disable row level security;
```

## 5. Seed initial stocks (optional)

If you want the Finance page to show data, insert the tickers you want to track:

```sql
insert into stocks (ticker, name) values
  ('AAPL', 'Apple Inc.'),
  ('NVDA', 'NVIDIA Corporation'),
  ('MSFT', 'Microsoft Corporation'),
  ('GOOGL', 'Alphabet Inc.');
```
