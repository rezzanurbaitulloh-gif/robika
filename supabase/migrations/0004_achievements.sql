create table if not exists public.achievements (
  profile_id uuid not null references public.profiles (id) on delete cascade,
  badge_id text not null,
  earned_at timestamptz not null default now(),
  primary key (profile_id, badge_id)
);

alter table public.achievements enable row level security;

create policy "achievements_select_own"
  on public.achievements for select
  using (auth.uid() = profile_id);

create policy "achievements_insert_own"
  on public.achievements for insert
  with check (auth.uid() = profile_id);