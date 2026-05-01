-- Run this in the Supabase SQL Editor to create the India stock tables

create table if not exists indian_stocks (
  id           uuid primary key default gen_random_uuid(),
  ticker       text unique not null,
  yahoo_ticker text not null,
  name         text not null,
  sector       text not null,
  active       boolean not null default true
);

create table if not exists indian_stock_prices (
  id         uuid primary key default gen_random_uuid(),
  stock_id   uuid not null references indian_stocks(id) on delete cascade,
  date       date not null,
  fetch_slot text not null check (fetch_slot in ('open', 'midday', 'close')),
  open       numeric,
  high       numeric,
  low        numeric,
  close      numeric not null,
  volume     bigint,
  unique (stock_id, date, fetch_slot)
);

create table if not exists indian_stock_signals (
  id               uuid primary key default gen_random_uuid(),
  stock_id         uuid not null references indian_stocks(id) on delete cascade,
  date             date not null,
  score            numeric not null,
  momentum_score   numeric not null,
  volume_score     numeric not null,
  volatility_score numeric not null,
  signal           text not null check (signal in ('BUY', 'HOLD', 'SELL')),
  target_price     numeric,
  upside_pct       numeric,
  rationale        text,
  unique (stock_id, date)
);

-- Migration: add strategy_signals column (run once if table already exists)
alter table indian_stock_signals
  add column if not exists strategy_signals jsonb;

-- Optional: indexes for common query patterns
create index if not exists idx_indian_stock_prices_stock_date
  on indian_stock_prices (stock_id, date desc);

create index if not exists idx_indian_stock_signals_stock_date
  on indian_stock_signals (stock_id, date desc);
