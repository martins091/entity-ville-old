alter table public.orders
  add column if not exists confirmation_sent boolean not null default false,
  add column if not exists transfer_notified_sent boolean not null default false,
  add column if not exists verified_sent boolean not null default false,
  add column if not exists ready_sent boolean not null default false,
  add column if not exists order_notes text,
  add column if not exists shipping_city text,
  add column if not exists shipping_state text,
  add column if not exists shipping_zip text;

create table if not exists public.email_logs (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete set null,
  order_reference text,
  recipient_email text not null,
  type text not null,
  status text not null default 'pending',
  provider_message_id text,
  error_message text,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_orders_reference_email
  on public.orders (order_reference, lower(customer_email));

create index if not exists idx_orders_status_created_at
  on public.orders (status, created_at desc);

create index if not exists idx_email_logs_order_id_created_at
  on public.email_logs (order_id, created_at desc);

alter table public.email_logs enable row level security;

drop policy if exists "Admins can view email logs" on public.email_logs;
create policy "Admins can view email logs"
on public.email_logs for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can insert email logs" on public.email_logs;
create policy "Admins can insert email logs"
on public.email_logs for insert
to authenticated
with check (public.is_admin());
