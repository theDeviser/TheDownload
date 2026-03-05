-- =============================================================
-- The Download — SaaS Platform Schema (Multi-tenant + pgvector)
-- =============================================================

-- 0. ENABLE PGVECTOR
create extension if not exists vector;

-- 1. WORKSPACES
create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  share_slug text not null unique,
  theme_preference text not null default 'dark',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_workspaces_admin on public.workspaces(admin_id);
create unique index idx_workspaces_slug on public.workspaces(share_slug);

alter table public.workspaces enable row level security;

create policy "Admins can view own workspaces"
  on public.workspaces for select
  using (auth.uid() = admin_id);

create policy "Admins can insert own workspaces"
  on public.workspaces for insert
  with check (auth.uid() = admin_id);

create policy "Admins can update own workspaces"
  on public.workspaces for update
  using (auth.uid() = admin_id);

create policy "Admins can delete own workspaces"
  on public.workspaces for delete
  using (auth.uid() = admin_id);

-- 2. SOURCES (ingestion channels per workspace)
create table public.sources (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  platform_name text not null check (platform_name in ('x', 'substack', 'linkedin', 'rss', 'manual')),
  status text not null default 'active' check (status in ('active', 'paused', 'disconnected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_sources_workspace on public.sources(workspace_id);

alter table public.sources enable row level security;

create policy "Workspace admins can manage sources"
  on public.sources for all
  using (
    exists (
      select 1 from public.workspaces w
      where w.id = sources.workspace_id
        and w.admin_id = auth.uid()
    )
  );

-- 3. RAW INGESTIONS (the "Second Brain" data store)
create table public.raw_ingestions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  source_id uuid references public.sources(id) on delete set null,
  original_url text,
  raw_text text not null,
  author text,
  embedding vector(1536),
  is_curated_for_digest boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_raw_ingestions_workspace on public.raw_ingestions(workspace_id);
create index idx_raw_ingestions_curated on public.raw_ingestions(workspace_id, is_curated_for_digest);

alter table public.raw_ingestions enable row level security;

create policy "Workspace admins can manage ingestions"
  on public.raw_ingestions for all
  using (
    exists (
      select 1 from public.workspaces w
      where w.id = raw_ingestions.workspace_id
        and w.admin_id = auth.uid()
    )
  );

-- 4. SAAS DIGESTS (the published daily drops)
create table public.saas_digests (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  publish_date date not null,
  target_persona text not null check (target_persona in ('spouse', 'team')),
  status text not null default 'draft' check (status in ('draft', 'generating', 'published', 'failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, publish_date, target_persona)
);

create index idx_saas_digests_workspace_date on public.saas_digests(workspace_id, publish_date);

alter table public.saas_digests enable row level security;

-- Admins can manage their own digests
create policy "Workspace admins can manage digests"
  on public.saas_digests for all
  using (
    exists (
      select 1 from public.workspaces w
      where w.id = saas_digests.workspace_id
        and w.admin_id = auth.uid()
    )
  );

-- Public read access via share_slug (for subscriber pages)
create policy "Public can read published digests via share slug"
  on public.saas_digests for select
  using (
    status = 'published'
    and exists (
      select 1 from public.workspaces w
      where w.id = saas_digests.workspace_id
    )
  );

-- 5. TRANSLATED ITEMS (the jargon-free digest entries)
create table public.translated_items (
  id uuid primary key default gen_random_uuid(),
  digest_id uuid not null references public.saas_digests(id) on delete cascade,
  raw_ingestion_id uuid references public.raw_ingestions(id) on delete set null,
  translated_headline text not null,
  translated_summary text not null,
  category text not null,
  position integer not null,
  created_at timestamptz not null default now()
);

create index idx_translated_items_digest_pos on public.translated_items(digest_id, position);

alter table public.translated_items enable row level security;

-- Visibility inherits from parent digest
create policy "Translated items visible with digest"
  on public.translated_items for select
  using (
    exists (
      select 1 from public.saas_digests d
      join public.workspaces w on w.id = d.workspace_id
      where d.id = translated_items.digest_id
        and (w.admin_id = auth.uid() or d.status = 'published')
    )
  );

create policy "Workspace admins can manage translated items"
  on public.translated_items for all
  using (
    exists (
      select 1 from public.saas_digests d
      join public.workspaces w on w.id = d.workspace_id
      where d.id = translated_items.digest_id
        and w.admin_id = auth.uid()
    )
  );

-- 6. AUTO-UPDATE TRIGGERS for new tables
create trigger workspaces_updated_at
  before update on public.workspaces
  for each row execute function public.update_updated_at();

create trigger sources_updated_at
  before update on public.sources
  for each row execute function public.update_updated_at();

create trigger raw_ingestions_updated_at
  before update on public.raw_ingestions
  for each row execute function public.update_updated_at();

create trigger saas_digests_updated_at
  before update on public.saas_digests
  for each row execute function public.update_updated_at();
