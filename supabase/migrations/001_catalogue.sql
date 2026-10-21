-- Run once in the Supabase SQL Editor. This migration creates no product rows
-- and does not delete or overwrite application data.
create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique,
  name text not null,
  slug text not null unique,
  description text not null default '',
  short_description text not null default '',
  category_id uuid references public.categories(id) on delete set null,
  price_inr numeric(12, 2) not null check (price_inr > 0),
  original_price_inr numeric(12, 2) check (original_price_inr is null or original_price_inr >= price_inr),
  sizes text[] not null default '{}',
  colors text[] not null default '{}',
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  fabric text not null default '',
  occasion text not null default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  storage_path text not null,
  alt text not null default '',
  position integer not null default 0 check (position >= 0),
  created_at timestamptz not null default now(),
  unique (product_id, storage_path)
);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text not null unique,
  size text not null,
  color text not null,
  price_inr numeric(12, 2) not null check (price_inr > 0),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, size, color)
);

create index if not exists products_active_created_idx on public.products (is_active, created_at desc);
create index if not exists products_category_idx on public.products (category_id);
create index if not exists product_images_product_position_idx on public.product_images (product_id, position);
create index if not exists product_variants_product_idx on public.product_variants (product_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger categories_set_updated_at
  before update on public.categories
  for each row execute procedure public.set_updated_at();

create trigger products_set_updated_at
  before update on public.products
  for each row execute procedure public.set_updated_at();

create trigger product_variants_set_updated_at
  before update on public.product_variants
  for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create policy "Public can read visible categories"
  on public.categories for select to anon, authenticated
  using (is_visible = true);

create policy "Public can read active products"
  on public.products for select to anon, authenticated
  using (is_active = true);

create policy "Public can read images for active products"
  on public.product_images for select to anon, authenticated
  using (exists (select 1 from public.products p where p.id = product_id and p.is_active));

create policy "Public can read variants for active products"
  on public.product_variants for select to anon, authenticated
  using (exists (select 1 from public.products p where p.id = product_id and p.is_active));

create policy "Admins manage categories"
  on public.categories for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "Admins manage products"
  on public.products for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "Admins manage product images"
  on public.product_images for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "Admins manage product variants"
  on public.product_variants for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do nothing;

create policy "Public can view product images"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'product-images');

create policy "Admins can upload product images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());

create policy "Admins can update product images"
  on storage.objects for update to authenticated
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());

create policy "Admins can delete product images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

-- After creating the first user in Supabase Auth, run this manually with that user's UUID:
-- update public.profiles set role = 'admin' where id = 'AUTH_USER_UUID';
