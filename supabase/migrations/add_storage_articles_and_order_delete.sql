insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('product-images', 'product-images', true, 5242880, array['image/png', 'image/jpeg', 'image/webp', 'image/gif']),
  ('article-images', 'article-images', true, 5242880, array['image/png', 'image/jpeg', 'image/webp', 'image/gif'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create table if not exists public.news_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  content text not null default '',
  author text not null default 'Entity Ville Team',
  category text not null default 'News',
  image text,
  active boolean not null default true,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_news_articles_updated_at on public.news_articles;
create trigger set_news_articles_updated_at
before update on public.news_articles
for each row execute function public.set_updated_at();

alter table public.news_articles enable row level security;

drop policy if exists "Public can view active news articles" on public.news_articles;
create policy "Public can view active news articles"
on public.news_articles for select
to public
using (active = true or public.is_admin());

drop policy if exists "Admins can insert news articles" on public.news_articles;
create policy "Admins can insert news articles"
on public.news_articles for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update news articles" on public.news_articles;
create policy "Admins can update news articles"
on public.news_articles for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete news articles" on public.news_articles;
create policy "Admins can delete news articles"
on public.news_articles for delete
to authenticated
using (public.is_admin());

drop policy if exists "Admins can delete orders" on public.orders;
create policy "Admins can delete orders"
on public.orders for delete
to authenticated
using (public.is_admin());

drop policy if exists "Public can read uploaded ecommerce images" on storage.objects;
create policy "Public can read uploaded ecommerce images"
on storage.objects for select
to public
using (bucket_id in ('product-images', 'article-images'));

drop policy if exists "Admins can upload ecommerce images" on storage.objects;
create policy "Admins can upload ecommerce images"
on storage.objects for insert
to authenticated
with check (
  bucket_id in ('product-images', 'article-images')
  and public.is_admin()
);

drop policy if exists "Admins can update ecommerce images" on storage.objects;
create policy "Admins can update ecommerce images"
on storage.objects for update
to authenticated
using (
  bucket_id in ('product-images', 'article-images')
  and public.is_admin()
)
with check (
  bucket_id in ('product-images', 'article-images')
  and public.is_admin()
);

drop policy if exists "Admins can delete ecommerce images" on storage.objects;
create policy "Admins can delete ecommerce images"
on storage.objects for delete
to authenticated
using (
  bucket_id in ('product-images', 'article-images')
  and public.is_admin()
);
