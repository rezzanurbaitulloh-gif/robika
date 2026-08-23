create table if not exists public.shop_items (
  item_id text primary key,
  price_stars int,
  price_gems int
);

insert into public.shop_items (item_id, price_stars, price_gems) values
  ('skin-bot-classic', 500, null),
  ('skin-bot-steel', 450, null),
  ('skin-bot-mint', 600, null),
  ('skin-bot-ember', 600, null),
  ('skin-bot-neon', 2500, null),
  ('skin-bot-sunset', 2800, null),
  ('skin-bot-toxic', 3000, null),
  ('skin-bot-graffiti', 3200, null),
  ('skin-bot-gold', null, 250),
  ('skin-bot-abyss', null, 300),
  ('skin-bot-magma', null, 320),
  ('skin-bot-aurora', null, 350),
  ('skin-bot-void', null, 600),
  ('skin-bot-gateway', null, 650),
  ('skin-bot-prisma', null, 700),
  ('skin-bot-prime', null, 900)
on conflict (item_id) do nothing;

create or replace function public.buy_skin(p_item_id text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_price_stars int;
  v_price_gems int;
  v_stars int;
  v_gems int;
begin
  if v_uid is null then
    return jsonb_build_object('error', 'unauthorized');
  end if;

  select price_stars, price_gems
    into v_price_stars, v_price_gems
    from shop_items
   where item_id = p_item_id;
  if not found then
    return jsonb_build_object('error', 'unknown_item');
  end if;

  select stars, gems into v_stars, v_gems
    from wallets
   where profile_id = v_uid
     for update;

  if (v_price_stars is not null and coalesce(v_stars, 0) < v_price_stars)
     or (v_price_gems is not null and coalesce(v_gems, 0) < v_price_gems) then
    return jsonb_build_object(
      'error', 'insufficient_balance',
      'balance', case when v_price_stars is not null then v_stars else v_gems end,
      'price', coalesce(v_price_stars, v_price_gems)
    );
  end if;

  insert into inventory (profile_id, item_id)
  values (v_uid, p_item_id)
  on conflict (profile_id, item_id) do nothing;
  if not found then
    return jsonb_build_object('error', 'already_owned');
  end if;

  update wallets
     set stars = stars - coalesce(v_price_stars, 0),
         gems = gems - coalesce(v_price_gems, 0)
   where profile_id = v_uid;

  return jsonb_build_object('ok', true, 'item_id', p_item_id);
end $$;
