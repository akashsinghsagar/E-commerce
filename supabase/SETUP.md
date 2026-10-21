# LADDI Supabase database setup

This is a manual, non-destructive setup for the LADDI catalogue. The current
website still uses its local demo store until the Supabase data-access stage is
implemented.

## 1. Configure project secrets locally

Create `.env.local` in the repository root. Never commit this file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

The publishable key is safe for browser use only when Row Level Security is
enabled. Never put a service-role or secret key in `.env.local` or client code.

## 2. Run the SQL migration

In Supabase Dashboard:

1. Open **SQL Editor**.
2. Create a new query.
3. Paste and run `supabase/migrations/001_catalogue.sql` once.
4. Paste and run `supabase/migrations/002_product_collections.sql` once.
5. Confirm that `categories`, `products`, `product_images`,
   `product_variants`, and `profiles` exist under `public`.
6. Confirm that RLS is enabled on all five public tables.

The scripts do not seed products, delete rows, or alter existing product
records. The second migration adds the merchandising flags used by the
homepage and collection pages. It creates the `product-images` bucket only if
it does not exist.

## 3. Configure the first administrator

Do not insert an admin role from the browser. The migration creates every new
Auth user's profile with the `customer` role, and the `profiles` table has no
client write policy.

1. Create the first user in **Authentication > Users**.
2. Copy that user's UUID.
3. In SQL Editor, run this one-time statement after replacing the placeholder:

```sql
update public.profiles
set role = 'admin', updated_at = now()
where id = 'AUTH_USER_UUID'
  and role = 'customer';
```

Only a trusted project owner should run this statement. Do not expose it in
the application.

## 4. Storage configuration

The migration creates a public `product-images` bucket for storefront image
URLs. It adds RLS policies that allow:

- Public reads from `product-images`.
- Upload, replacement, and deletion only when `public.is_admin()` is true.
- No anonymous or ordinary authenticated writes.

In **Storage > Buckets > product-images**, set:

- Maximum file size: `5 MB`
- Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`

The application must store the returned object path in
`public.product_images.storage_path`. Do not delete an object until no
`product_images` row references its path.

## 5. Security checks before application integration

Verify in the Supabase Dashboard:

- RLS is enabled for every table created by the migration.
- Anonymous users can select only visible categories and active products.
- Anonymous users cannot insert, update, or delete catalogue rows.
- Authenticated non-admin users cannot write catalogue rows or Storage objects.
- `profiles.role` cannot be changed through the browser.
- The `is_admin()` function is `security definer`, has
  `set search_path = public`, and is executable only for `anon` and
  `authenticated` as a boolean check. It does not accept a caller-supplied
  role.

The current SQL intentionally has no public policy on `profiles`; this avoids
role disclosure and prevents client-side role escalation. Admin authorization
is checked server-side by querying that protected table through the
`security definer` function.

## Required before proceeding

- Run the migration manually.
- Create and promote the first administrator manually.
- Configure the Storage size and MIME restrictions.
- Confirm the RLS checks above.
- Provide the configured project environment to the local development process.

Database deployment and production catalogue integration are not complete
until those steps have been performed and tested.
