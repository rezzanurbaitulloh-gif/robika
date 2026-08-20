-- Robika — v2: allow hint top-up beyond the free 3
alter table public.hints drop constraint hints_count_check;
alter table public.hints add constraint hints_count_check check (count >= 0);