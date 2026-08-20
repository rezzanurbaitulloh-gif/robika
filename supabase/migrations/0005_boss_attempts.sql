create table if not exists public.boss_attempts (
  profile_id uuid primary key references public.profiles (id) on delete cascade,
  attempted_at timestamptz not null default now()
);

alter table public.boss_attempts enable row level security;

create policy "boss_attempts_select_own"
  on public.boss_attempts for select
  using (auth.uid() = profile_id);

create policy "boss_attempts_insert_own"
  on public.boss_attempts for insert
  with check (auth.uid() = profile_id);

create policy "boss_attempts_update_own"
  on public.boss_attempts for update
  using (auth.uid() = profile_id);