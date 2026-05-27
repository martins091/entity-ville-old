drop policy if exists "Public can create orders" on public.orders;
create policy "Public can create orders"
on public.orders for insert
to public
with check (status = 'awaiting_transfer');

drop policy if exists "Public can notify transfer" on public.order_notifications;
create policy "Public can notify transfer"
on public.order_notifications for insert
to public
with check (
  type = 'transfer_notified'
  and public.order_token_matches(order_id, public_token)
);
