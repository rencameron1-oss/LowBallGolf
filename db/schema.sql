-- ============================================================
-- LowballGolf schema v1
-- Paste this whole file into Supabase: SQL Editor -> New query -> Run
-- Safe to re-run on a fresh project only (uses CREATE, not IF NOT EXISTS,
-- so a partial earlier run should be cleaned up first).
-- ============================================================

-- ---------- enums ----------
create type product_category as enum
  ('driver','fairway','hybrid','iron_set','wedge','putter','ball','bag','other');

create type match_status as enum
  ('unmatched',   -- scraped, not yet linked to a product
   'auto',        -- linked by the matcher, above confidence threshold
   'confirmed',   -- human-reviewed and approved
   'rejected');   -- human said "this auto-match was wrong"; never re-match automatically

create type run_status as enum ('running','success','failed');

-- ---------- retailers ----------
create table retailers (
  id                bigint generated always as identity primary key,
  name              text not null,
  slug              text not null unique,               -- 'drummond-golf'
  website_url       text not null,
  platform          text not null,                      -- 'shopify' | 'woocommerce' | 'bigcommerce' | 'magento'
  affiliate_network text,                               -- 'commission_factory' | 'impact' | 'direct' | null
  affiliate_link_template text,                         -- e.g. 'https://t.cfjump.com/...?url={url}' once approved
  active            boolean not null default true,
  created_at        timestamptz not null default now()
);

-- ---------- products (canonical catalogue) ----------
create table products (
  id           bigint generated always as identity primary key,
  brand        text not null,                           -- 'PING'
  model        text not null,                           -- 'G440K'
  category     product_category not null,
  is_ladies    boolean not null default false,
  release_year smallint,                                -- 2025; nullable when unknown
  slug         text not null unique,                    -- 'ping-g440k-driver'
  attributes   jsonb not null default '{}'::jsonb,      -- lofts, shaft options, etc. as they matter
  created_at   timestamptz not null default now(),
  unique (brand, model, category, is_ladies)
);

-- ---------- listings (each retailer's version of a product) ----------
create table listings (
  id                  bigint generated always as identity primary key,
  retailer_id         bigint not null references retailers(id),
  product_id          bigint references products(id),   -- null until matched
  retailer_product_id text not null,                    -- store's own id/handle; stable across scrapes
  title               text not null,                    -- raw title AS LISTED; never normalise in place
  url                 text not null,
  image_url           text,
  match_status        match_status not null default 'unmatched',
  match_confidence    numeric(4,3),                     -- 0.000-1.000 from the matcher
  in_stock            boolean not null default true,
  active              boolean not null default true,    -- false when it disappears from the store
  first_seen_at       timestamptz not null default now(),
  last_seen_at        timestamptz not null default now(),
  unique (retailer_id, retailer_product_id)
);

create index listings_product_idx  on listings (product_id) where product_id is not null;
create index listings_review_idx   on listings (match_status) where match_status in ('unmatched','auto');

-- ---------- prices (current price per listing) ----------
create table prices (
  listing_id bigint primary key references listings(id) on delete cascade,
  price      numeric(10,2) not null,
  rrp        numeric(10,2),                             -- compare-at price when the store shows one
  currency   char(3) not null default 'AUD',
  updated_at timestamptz not null default now()
);

-- ---------- price_history (append-only; one row per CHANGE) ----------
-- A row is written when: listing first seen, price changes, rrp changes,
-- or stock flips. Flat periods are implied between rows.
create table price_history (
  id         bigint generated always as identity primary key,
  listing_id bigint not null references listings(id) on delete cascade,
  price      numeric(10,2) not null,
  rrp        numeric(10,2),
  in_stock   boolean not null,
  changed_at timestamptz not null default now()
);

create index price_history_listing_idx on price_history (listing_id, changed_at desc);

-- ---------- scrape_runs (audit trail: proof each nightly run happened) ----------
create table scrape_runs (
  id               bigint generated always as identity primary key,
  retailer_id      bigint not null references retailers(id),
  status           run_status not null default 'running',
  started_at       timestamptz not null default now(),
  finished_at      timestamptz,
  listings_seen    integer,
  listings_changed integer,
  error            text
);

create index scrape_runs_retailer_idx on scrape_runs (retailer_id, started_at desc);

-- ---------- convenience view: best current price per matched product ----------
create view product_best_price as
select
  p.id            as product_id,
  p.brand, p.model, p.category, p.is_ladies, p.slug,
  min(pr.price)   as best_price,
  max(pr.price)   as worst_price,
  max(pr.price) - min(pr.price) as spread,
  count(distinct l.retailer_id) as retailer_count
from products p
join listings l  on l.product_id = p.id
                and l.active
                and l.match_status in ('auto','confirmed')
join prices  pr  on pr.listing_id = l.id
where l.in_stock
group by p.id;

-- ---------- row level security ----------
-- Public (anon key) may READ catalogue data; only the service role
-- (used by the scraper) may write. Scrape runs stay private.
alter table retailers     enable row level security;
alter table products      enable row level security;
alter table listings      enable row level security;
alter table prices        enable row level security;
alter table price_history enable row level security;
alter table scrape_runs   enable row level security;

create policy "public read retailers"     on retailers     for select using (true);
create policy "public read products"      on products      for select using (true);
create policy "public read listings"      on listings      for select using (true);
create policy "public read prices"        on prices        for select using (true);
create policy "public read price history" on price_history for select using (true);
-- no anon policy on scrape_runs: private by default.
-- Writes: the scraper uses the service-role key, which bypasses RLS. No write policies needed.

-- ---------- seed the retailers we've audited ----------
insert into retailers (name, slug, website_url, platform) values
  ('Drummond Golf',        'drummond-golf',        'https://drummondgolf.com.au',          'shopify'),
  ('Power Golf',           'power-golf',           'https://powergolf.com.au',             'shopify'),
  ('Golf Paradise',        'golf-paradise',        'https://golfparadise.net.au',          'shopify'),
  ('The Golf Factory',     'the-golf-factory',     'https://www.thegolffactory.com.au',    'woocommerce'),
  ('House of Golf',        'house-of-golf',        'https://www.houseofgolf.com.au',       'woocommerce'),
  ('GolfBox',              'golfbox',              'https://www.golfbox.com.au',           'bigcommerce'),
  ('Golf Clearance Outlet','golf-clearance-outlet','https://www.golfclearanceoutlet.com.au','magento');
