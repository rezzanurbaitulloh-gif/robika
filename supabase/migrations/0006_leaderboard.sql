create or replace function public.get_leaderboard(limit_rows integer default 20)
returns table (
  id uuid,
  username text,
  xp integer,
  level integer,
  streak integer
)
language sql
security definer
set search_path = public
as $$
  select p.id, p.username, p.xp, p.level, coalesce(p.streak, 0)
  from public.profiles p
  where p.username is not null
  order by p.xp desc, p.level desc
  limit greatest(1, least(limit_rows, 100));
$$;