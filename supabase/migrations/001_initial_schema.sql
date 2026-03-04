-- =============================================================
-- The Download — Initial Database Schema
-- =============================================================

-- 1. PROFILES
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  partner_name text,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'display_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. USER PREFERENCES
create table public.user_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  topics text[] not null default '{}',
  tone integer not null default 3 check (tone >= 1 and tone <= 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_preferences enable row level security;

create policy "Users can view own preferences"
  on public.user_preferences for select
  using (auth.uid() = user_id);

create policy "Users can update own preferences"
  on public.user_preferences for update
  using (auth.uid() = user_id);

create policy "Users can insert own preferences"
  on public.user_preferences for insert
  with check (auth.uid() = user_id);

-- 3. DAILY DIGESTS
create table public.daily_digests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  edition_date date not null,
  intro_text text,
  status text not null default 'pending' check (status in ('pending', 'generating', 'ready', 'failed')),
  created_at timestamptz not null default now(),
  unique (user_id, edition_date)
);

create index idx_daily_digests_user_date on public.daily_digests(user_id, edition_date);

alter table public.daily_digests enable row level security;

create policy "Users can view own digests"
  on public.daily_digests for select
  using (auth.uid() = user_id);

-- Service role handles inserts/updates via API routes

-- 4. DIGEST ITEMS
create table public.digest_items (
  id uuid primary key default gen_random_uuid(),
  digest_id uuid not null references public.daily_digests(id) on delete cascade,
  position integer not null,
  headline text not null,
  category text not null check (category in ('ai', 'crypto', 'finance', 'vc')),
  intensity_tag text check (intensity_tag in ('WILD', 'HEATED', 'MEH', 'BREAKING')),
  summary text not null,
  source_url text not null,
  source_name text not null,
  raw_content text,
  created_at timestamptz not null default now()
);

create index idx_digest_items_digest_pos on public.digest_items(digest_id, position);

alter table public.digest_items enable row level security;

create policy "Users can view own digest items"
  on public.digest_items for select
  using (
    exists (
      select 1 from public.daily_digests d
      where d.id = digest_items.digest_id
        and d.user_id = auth.uid()
    )
  );

-- 5. RSS SOURCES (reference table, admin-managed)
create table public.rss_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  feed_url text not null,
  category text not null check (category in ('ai', 'crypto', 'finance', 'vc')),
  is_active boolean not null default true
);

alter table public.rss_sources enable row level security;

create policy "Anyone can read active RSS sources"
  on public.rss_sources for select
  using (is_active = true);

-- Seed default RSS sources
insert into public.rss_sources (name, feed_url, category) values
  ('TechCrunch AI', 'https://techcrunch.com/category/artificial-intelligence/feed/', 'ai'),
  ('The Verge AI', 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml', 'ai'),
  ('CoinDesk', 'https://www.coindesk.com/arc/outboundfeeds/rss/', 'crypto'),
  ('CoinTelegraph', 'https://cointelegraph.com/rss', 'crypto'),
  ('Bloomberg Markets', 'https://feeds.bloomberg.com/markets/news.rss', 'finance'),
  ('CNBC Finance', 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10000664', 'finance'),
  ('TechCrunch VC', 'https://techcrunch.com/category/venture/feed/', 'vc');

-- 6. Utility: auto-update updated_at
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at();

create trigger user_preferences_updated_at
  before update on public.user_preferences
  for each row execute function public.update_updated_at();
