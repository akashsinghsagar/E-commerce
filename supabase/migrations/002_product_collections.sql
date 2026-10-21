-- Persist the product merchandising selections used by the homepage and shop.
alter table public.products
  add column if not exists is_featured boolean not null default false,
  add column if not exists is_bestseller boolean not null default false,
  add column if not exists is_new_arrival boolean not null default false;
