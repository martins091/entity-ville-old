create extension if not exists pgcrypto;

create table if not exists public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  category text not null default 'General',
  price numeric not null default 0,
  image text,
  images text[] not null default '{}',
  features text[] not null default '{}',
  specs text[] not null default '{}',
  applications text[] not null default '{}',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_reference text not null unique,
  public_token text not null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  shipping_address text not null,
  shipping_city text not null,
  shipping_state text not null,
  shipping_zip text,
  order_notes text,
  items jsonb not null default '[]'::jsonb,
  total numeric not null default 0,
  status text not null default 'awaiting_transfer',
  admin_note text,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_notifications (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  public_token text not null,
  type text not null default 'transfer_notified',
  message text,
  created_at timestamptz not null default now()
);

-- Add comments to document the columns
comment on column public.orders.shipping_address is 'Street address, building number, etc.';
comment on column public.orders.shipping_city is 'City/District/Town';
comment on column public.orders.shipping_state is 'State/Province/Region';
comment on column public.orders.shipping_zip is 'ZIP/Postal code (optional)';
comment on column public.orders.order_notes is 'Special delivery instructions or additional information from customer';
comment on column public.orders.customer_phone is 'Customer contact phone number for delivery coordination';

-- Create indexes for better query performance
create index if not exists idx_orders_customer_phone on public.orders(customer_phone);
create index if not exists idx_orders_shipping_city on public.orders(shipping_city);
create index if not exists idx_orders_shipping_state on public.orders(shipping_state);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_created_at on public.orders(created_at);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

alter table public.admin_profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_notifications enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles
    where user_id = auth.uid()
  );
$$;

create or replace function public.order_token_matches(check_order_id uuid, check_public_token text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.orders
    where id = check_order_id
      and public_token = check_public_token
  );
$$;

drop policy if exists "Admins can view their admin profile" on public.admin_profiles;
create policy "Admins can view their admin profile"
on public.admin_profiles for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Public can view active products" on public.products;
create policy "Public can view active products"
on public.products for select
to anon, authenticated
using (active = true or public.is_admin());

drop policy if exists "Admins can insert products" on public.products;
create policy "Admins can insert products"
on public.products for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update products" on public.products;
create policy "Admins can update products"
on public.products for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete products" on public.products;
create policy "Admins can delete products"
on public.products for delete
to authenticated
using (public.is_admin());

drop policy if exists "Public can create orders" on public.orders;
create policy "Public can create orders"
on public.orders for insert
to anon, authenticated
with check (status = 'awaiting_transfer');

drop policy if exists "Admins can view orders" on public.orders;
create policy "Admins can view orders"
on public.orders for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can update orders" on public.orders;
create policy "Admins can update orders"
on public.orders for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can notify transfer" on public.order_notifications;
create policy "Public can notify transfer"
on public.order_notifications for insert
to anon, authenticated
with check (
  type = 'transfer_notified'
  and public.order_token_matches(order_id, public_token)
);

drop policy if exists "Admins can view order notifications" on public.order_notifications;
create policy "Admins can view order notifications"
on public.order_notifications for select
to authenticated
using (public.is_admin());