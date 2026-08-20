-- 0007: fix trial (subscriptions update RLS) + belajar reward (learn_progress)

-- fix: user session gagal update subscriptions karena tidak ada policy UPDATE
create policy "subscriptions_update_own" on public.subscriptions
  for update using (auth.uid() = profile_id);

-- progress belajar: materi & kuis yang sudah diselesaikan user
create table public.learn_progress (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  item_type text not null check (item_type in ('module', 'quiz')),
  item_id text not null,
  completed_at timestamptz not null default now(),
  primary key (profile_id, item_type, item_id)
);

create index learn_progress_profile_idx on public.learn_progress(profile_id);

alter table public.learn_progress enable row level security;

create policy "learn_progress_select_own" on public.learn_progress
  for select using (auth.uid() = profile_id);
create policy "learn_progress_insert_own" on public.learn_progress
  for insert with check (auth.uid() = profile_id);
create policy "learn_progress_delete_own" on public.learn_progress
  for delete using (auth.uid() = profile_id);