alter table public.shop_items enable row level security;

create policy "shop_items readable by everyone"
  on public.shop_items
  for select
  using (true);

revoke insert, update, delete on public.shop_items from anon, authenticated;
