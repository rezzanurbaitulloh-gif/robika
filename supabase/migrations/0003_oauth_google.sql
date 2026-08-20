-- Robika — v3: handle_new_user reads Google OAuth metadata
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  meta jsonb := new.raw_user_meta_data;
  fallback_name text := coalesce(meta ->> 'full_name', meta ->> 'name', meta ->> 'username', '');
  fallback_username text;
begin
  fallback_username := coalesce(
    meta ->> 'username',
    regexp_replace(lower(split_part(coalesce(new.email, ''), '@', 1)), '[^a-z0-9_]', '', 'g')
  );
  if fallback_username = '' or fallback_username is null then
    fallback_username := 'user_' || substr(new.id::text, 1, 8);
  end if;
  if exists (select 1 from public.profiles where username = fallback_username) then
    fallback_username := fallback_username || '_' || substr(md5(new.id::text), 1, 6);
  end if;

  insert into public.profiles (id, username, display_name, avatar_url)
  values (new.id, fallback_username, fallback_name, meta ->> 'avatar_url')
  on conflict (id) do nothing;
  insert into public.wallets (profile_id) values (new.id) on conflict do nothing;
  insert into public.hints (profile_id, count, next_refresh_at)
  values (new.id, 3, now() + interval '3 days') on conflict do nothing;
  insert into public.subscriptions (profile_id) values (new.id) on conflict do nothing;
  return new;
end;
$$;