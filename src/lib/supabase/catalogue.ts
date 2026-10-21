import type { SupabaseClient } from '@supabase/supabase-js';
import type { Product, ProductImage, ProductVariant } from '@/types';

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  is_visible: boolean;
}

interface ImageRow {
  id: string;
  storage_path: string;
  alt: string;
  position: number;
}

interface VariantRow {
  id: string;
  product_id: string;
  sku: string;
  size: string;
  color: string;
  price_inr: number;
  stock_quantity: number;
}

interface ProductRow {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  category_id: string | null;
  price_inr: number;
  original_price_inr: number | null;
  sizes: string[];
  colors: string[];
  stock_quantity: number;
  fabric: string;
  occasion: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  categories: CategoryRow | null;
  product_images: ImageRow[];
  product_variants: VariantRow[];
}

export interface SupabaseProductInput {
  id?: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  categoryId: string | null;
  price: number;
  originalPrice?: number;
  sizes: string[];
  colors: string[];
  stock: number;
  fabric: string;
  occasion: string;
  active: boolean;
  images: Array<{ path: string; alt: string; position: number }>;
  variants: Array<{ sku: string; size: string; color: string; price: number; stock: number }>;
}

const publicImageUrl = (client: SupabaseClient, path: string) =>
  client.storage.from('product-images').getPublicUrl(path).data.publicUrl;

function mapProduct(client: SupabaseClient, row: ProductRow): Product {
  const variants: ProductVariant[] = row.product_variants.map((variant) => ({
    id: variant.id,
    productId: row.id,
    sku: variant.sku,
    size: variant.size,
    color: variant.color,
    price: Number(variant.price_inr),
    quantity: variant.stock_quantity,
    reservedQuantity: 0,
    lowStockThreshold: 3,
  }));
  const images: ProductImage[] = row.product_images
    .sort((a, b) => a.position - b.position)
    .map((image) => ({
      id: image.id,
      url: publicImageUrl(client, image.storage_path),
      alt: image.alt,
      position: image.position,
    }));

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    shortDescription: row.short_description,
    fabric: row.fabric,
    careInstructions: 'Follow garment care label.',
    categoryId: row.category_id || '',
    categoryName: row.categories?.name || 'Uncategorized',
    collectionIds: [],
    images,
    variants,
    tags: row.occasion ? [row.occasion] : [],
    isActive: row.is_active,
    isFeatured: false,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    sku: row.sku,
    occasion: row.occasion,
  };
}

export async function fetchSupabaseProducts(client: SupabaseClient) {
  const result = await client
    .from('products')
    .select('*, categories(id,name,slug,is_visible), product_images(id,storage_path,alt,position), product_variants(id,product_id,sku,size,color,price_inr,stock_quantity)')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  if (result.error) throw result.error;
  return ((result.data || []) as ProductRow[]).map((row) => mapProduct(client, row));
}

export async function fetchAdminProducts(client: SupabaseClient) {
  const result = await client
    .from('products')
    .select('*, categories(id,name,slug,is_visible), product_images(id,storage_path,alt,position), product_variants(id,product_id,sku,size,color,price_inr,stock_quantity)')
    .order('created_at', { ascending: false });
  if (result.error) throw result.error;
  return ((result.data || []) as ProductRow[]).map((row) => mapProduct(client, row));
}

export async function fetchSupabaseCategories(client: SupabaseClient) {
  const result = await client.from('categories').select('id,name,slug,is_visible').eq('is_visible', true).order('name');
  if (result.error) throw result.error;
  return (result.data || []) as CategoryRow[];
}

export async function fetchAdminCategories(client: SupabaseClient) {
  const result = await client.from('categories').select('id,name,slug,is_visible').order('name');
  if (result.error) throw result.error;
  return (result.data || []) as CategoryRow[];
}

export async function createSupabaseCategory(client: SupabaseClient, name: string) {
  const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const result = await client.from('categories').insert({ name: name.trim(), slug, is_visible: true }).select('id,name,slug,is_visible').single();
  if (result.error) throw result.error;
  return result.data as CategoryRow;
}

export async function saveSupabaseProduct(client: SupabaseClient, input: SupabaseProductInput) {
  const productResult = await client.from('products').upsert({
    ...(input.id ? { id: input.id } : {}),
    sku: input.sku,
    name: input.name,
    slug: input.slug,
    description: input.description,
    short_description: input.shortDescription,
    category_id: input.categoryId,
    price_inr: input.price,
    original_price_inr: input.originalPrice ?? null,
    sizes: input.sizes,
    colors: input.colors,
    stock_quantity: input.stock,
    fabric: input.fabric,
    occasion: input.occasion,
    is_active: input.active,
  }).select('id').single();
  if (productResult.error) throw productResult.error;
  const productId = String(productResult.data.id);

  const deleteVariants = await client.from('product_variants').delete().eq('product_id', productId);
  if (deleteVariants.error) throw deleteVariants.error;
  if (input.variants.length) {
    const variants = await client.from('product_variants').insert(input.variants.map((variant) => ({
      product_id: productId,
      sku: variant.sku,
      size: variant.size,
      color: variant.color,
      price_inr: variant.price,
      stock_quantity: variant.stock,
    })));
    if (variants.error) throw variants.error;
  }
  const clearImages = await client.from('product_images').delete().eq('product_id', productId);
  if (clearImages.error) throw clearImages.error;
  const images = await client.from('product_images').insert(
    input.images.map((image) => ({ product_id: productId, storage_path: image.path, alt: image.alt, position: image.position })),
  );
  if (images.error) throw images.error;
  return productId;
}

export async function deleteSupabaseProduct(client: SupabaseClient, productId: string) {
  const result = await client.from('products').delete().eq('id', productId);
  if (result.error) throw result.error;
}
