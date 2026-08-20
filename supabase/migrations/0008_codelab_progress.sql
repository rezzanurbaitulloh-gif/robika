-- 0008: reward CodeLab (codelab_progress)

-- progress tantangan CodeLab yang sudah diselesaikan user (reward sekali per tantangan)
create table public.codelab_progress (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  challenge_id text not null,
  completed_at timestamptz not null default now(),
  primary key (profile_id, challenge_id)
);

create index codelab_progress_profile_idx on public.codelab_progress(profile_id);

alter table public.codelab_progress enable row level security;

create policy "codelab_progress_select_own" on public.codelab_progress
  for select using (auth.uid() = profile_id);
create policy "codelab_progress_insert_own" on public.codelab_progress
  for insert with check (auth.uid() = profile_id);
