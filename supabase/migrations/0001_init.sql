-- Robika — init schema v1
-- Tables: profiles, wallets, hints, inventory, progress, purchases, subscriptions

create extension if not exists "pgcrypto";

-- ============================= PROFILES =============================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null check (char_length(username) between 3 and 20),
  display_name text not null default '',
  avatar_url text,
  level integer not null default 1 check (level >= 1),
  skill_level text not null default 'pemula' check (skill_level in ('pemula', 'menengah', 'lanjut')),
  xp integer not null default 0 check (xp >= 0),
  streak integer not null default 0 check (streak >= 0),
  last_active_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================= WALLETS =============================
create table public.wallets (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  stars integer not null default 0 check (stars >= 0),
  gems integer not null default 0 check (gems >= 0),
  updated_at timestamptz not null default now()
);

-- ============================= HINTS =============================
create table public.hints (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  count integer not null default 3 check (count between 0 and 3),
  next_refresh_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================= INVENTORY =============================
create table public.inventory (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  item_id text not null,
  acquired_at timestamptz not null default now(),
  primary key (profile_id, item_id)
);

-- ============================= PROGRESS =============================
create table public.progress (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  level_id text not null,
  stars integer not null default 0 check (stars between 0 and 3),
  best_score integer not null default 0 check (best_score >= 0),
  completed_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (profile_id, level_id)
);

-- ============================= PURCHASES =============================
create table public.purchases (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  item_type text not null check (item_type in ('hints', 'gems', 'mentor')),
  item_ref text,
  amount integer not null default 0,
  price integer not null default 0,
  status text not null default 'pending' check (status in ('pending', 'paid', 'fulfilled', 'failed', 'refunded')),
  external_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================= SUBSCRIPTIONS =============================
create table public.subscriptions (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  plan text not null default 'none' check (plan in ('none', 'mentor')),
  trial_started_at timestamptz,
  trial_ends_at timestamptz,
  paid_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================= INDEXES =============================
create index progress_profile_idx on public.progress(profile_id);
create index inventory_profile_idx on public.inventory(profile_id);
create index purchases_profile_idx on public.purchases(profile_id);
create index purchases_external_idx on public.purchases(external_id);

-- ============================= TRIGGERS =============================
-- new user → profile + wallet + hints + subscription rows
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', 'user_' || substr(new.id::text, 1, 8)),
    coalesce(new.raw_user_meta_data ->> 'display_name', '')
  );
  insert into public.wallets (profile_id) values (new.id);
  insert into public.hints (profile_id, count, next_refresh_at)
  values (new.id, 3, now() + interval '3 days');
  insert into public.subscriptions (profile_id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at keeper
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();
create trigger wallets_touch before update on public.wallets
  for each row execute function public.touch_updated_at();
create trigger hints_touch before update on public.hints
  for each row execute function public.touch_updated_at();
create trigger purchases_touch before update on public.purchases
  for each row execute function public.touch_updated_at();
create trigger subscriptions_touch before update on public.subscriptions
  for each row execute function public.touch_updated_at();

-- ============================= RLS =============================
alter table public.profiles enable row level security;
alter table public.wallets enable row level security;
alter table public.hints enable row level security;
alter table public.inventory enable row level security;
alter table public.progress enable row level security;
alter table public.purchases enable row level security;
alter table public.subscriptions enable row level security;

-- own-row access
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

create policy "wallets_select_own" on public.wallets
  for select using (auth.uid() = profile_id);
create policy "wallets_update_own" on public.wallets
  for update using (auth.uid() = profile_id);

create policy "hints_select_own" on public.hints
  for select using (auth.uid() = profile_id);
create policy "hints_update_own" on public.hints
  for update using (auth.uid() = profile_id);

create policy "inventory_select_own" on public.inventory
  for select using (auth.uid() = profile_id);
create policy "inventory_insert_own" on public.inventory
  for insert with check (auth.uid() = profile_id);

create policy "progress_select_own" on public.progress
  for select using (auth.uid() = profile_id);
create policy "progress_insert_own" on public.progress
  for insert with check (auth.uid() = profile_id);
create policy "progress_update_own" on public.progress
  for update using (auth.uid() = profile_id);

create policy "purchases_select_own" on public.purchases
  for select using (auth.uid() = profile_id);
create policy "purchases_insert_own" on public.purchases
  for insert with check (auth.uid() = profile_id);

create policy "subscriptions_select_own" on public.subscriptions
  for select using (auth.uid() = profile_id);