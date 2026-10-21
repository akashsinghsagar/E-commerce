-- Initialize the canonical storefront categories. Existing categories/products
-- are preserved; the unique slug prevents duplicate category records.
insert into public.categories (name, slug, is_visible)
values
  ('Kurtis', 'kurtis', true),
  ('Co-ord Sets', 'co-ord-sets', true),
  ('Dresses', 'dresses', true),
  ('Festive Wear', 'festive-wear', true),
  ('Everyday Wear', 'everyday-wear', true)
on conflict (slug) do update
set name = excluded.name,
    is_visible = true,
    updated_at = now();
