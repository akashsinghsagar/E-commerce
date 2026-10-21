'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { ImagePlus, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { demoCategories } from '@/data/demo';
import { useProductStore } from '@/store/products';
import type { Product, ProductImage, ProductVariant } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { createSupabaseCategory, fetchAdminCategories, fetchAdminProducts, saveSupabaseProduct, deleteSupabaseProduct } from '@/lib/supabase/catalogue';
import { isSupabaseConfigured } from '@/lib/supabase/env';

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const emptyForm = {
  name: '', sku: '', categoryId: demoCategories[0]?.id || '', subcategory: '',
  shortDescription: '', description: '', price: '', originalPrice: '',
  sizes: ['S', 'M', 'L'] as string[], colors: 'Ivory', stockBySize: { S: 0, M: 0, L: 0 } as Record<string, number>,
  fabric: '', fit: '', occasion: '', careInstructions: '',
  featured: false, bestseller: false, newArrival: true, active: true,
};

type FormState = typeof emptyForm;

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const formatINR = (value: number) => `₹${value.toLocaleString('en-IN')}`;

export default function ProductManager() {
  const { products, addProduct, updateProduct, deleteProduct } = useProductStore();
  const hydrated = useProductStore((state) => state.hydrated);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('newest');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [supabaseError, setSupabaseError] = useState('');
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const load = async () => {
      try {
        const client = createClient();
        const [remoteProducts, remoteCategories] = await Promise.all([
          fetchAdminProducts(client),
          fetchAdminCategories(client),
        ]);
        useProductStore.setState({ products: remoteProducts });
        setCategories(remoteCategories);
        if (remoteCategories.length > 0) {
          setForm((current) => ({
            ...current,
            categoryId: remoteCategories.some((category) => category.id === current.categoryId)
              ? current.categoryId
              : remoteCategories[0].id,
          }));
        }
      } catch (loadError) {
        setSupabaseError(loadError instanceof Error ? loadError.message : 'Unable to load Supabase catalogue.');
      }
    };
    void load();
  }, []);

  const filtered = useMemo(() => products
    .filter((product) => `${product.name} ${product.sku || product.variants[0]?.sku || ''}`.toLowerCase().includes(query.toLowerCase()))
    .filter((product) => category === 'all' || product.categoryId === category)
    .sort((a, b) => sort === 'price' ? a.variants[0].price - b.variants[0].price : sort === 'name' ? a.name.localeCompare(b.name) : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [category, products, query, sort]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setImagePreviews([]);
    setImageFiles([]);
    setError('');
    setMessage('');
  };

  const openEdit = (product: Product) => {
    const stockBySize = Object.fromEntries(product.variants.map((variant) => [variant.size, variant.quantity])) as Record<string, number>;
    setEditing(product);
    setForm({
      name: product.name, sku: product.sku || product.variants[0]?.sku || '', categoryId: product.categoryId,
      subcategory: product.subcategory || '', shortDescription: product.shortDescription, description: product.description,
      price: String(product.variants[0]?.price || ''), originalPrice: String(product.variants[0]?.compareAtPrice || ''),
      sizes: [...new Set(product.variants.map((variant) => variant.size))],
      colors: [...new Set(product.variants.map((variant) => variant.color))].join(', '),
      stockBySize, fabric: product.fabric, fit: product.fit || '', occasion: product.occasion || '',
      careInstructions: product.careInstructions, featured: product.isFeatured, bestseller: product.isBestseller || false,
      newArrival: product.collectionIds.includes('col-001'), active: product.isActive,
    });
    setImagePreviews(product.images.map((image) => image.url).filter(Boolean));
    setImageFiles([]);
    setError('');
    setMessage('');
  };

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((current) => ({ ...current, [key]: value }));

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      const categoryItem = isSupabaseConfigured()
        ? await createSupabaseCategory(createClient(), newCategory)
        : {
            id: `category-admin-${Date.now()}`,
            name: newCategory.trim(),
          };
      setCategories((current) => [...current, categoryItem]);
      updateField('categoryId', categoryItem.id);
      setNewCategory('');
      setMessage(`${categoryItem.name} is ready to assign to a product.`);
    } catch (categoryError) {
      setError(categoryError instanceof Error ? categoryError.message : 'Unable to create category.');
    }
  };

  const selectImages = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const invalid = files.find((file) => !file.type.startsWith('image/') || file.size > 5 * 1024 * 1024);
    if (invalid) {
      setError('Images must be valid image files under 5 MB each.');
      return;
    }
    setError('');
    setImageFiles((current) => [...current, ...files]);
    setImagePreviews((current) => [...current, ...files.map((file) => URL.createObjectURL(file))]);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');
    const price = Number(form.price);
    const originalPrice = form.originalPrice ? Number(form.originalPrice) : undefined;
    const colors = form.colors.split(',').map((color) => color.trim()).filter(Boolean);
    const skuExists = products.some((product) => (product.sku || product.variants[0]?.sku) === form.sku.trim() && product.id !== editing?.id);
    const invalidStock = form.sizes.some((size) => !Number.isInteger(Number(form.stockBySize[size])) || Number(form.stockBySize[size]) < 0);
    const missingFields = [
      !form.name.trim() && 'Product name',
      !form.sku.trim() && 'Product ID / SKU',
      !form.description.trim() && 'Full product description',
      !form.fabric.trim() && 'Fabric',
      !colors.length && 'At least one color',
      !form.sizes.length && 'At least one size',
      !form.categoryId && 'Category',
    ].filter((field): field is string => Boolean(field));
    if (missingFields.length) return setError(`Complete these required fields: ${missingFields.join(', ')}.`);
    if (!Number.isFinite(price) || price <= 0) return setError('Selling price must be greater than ₹0.');
    if (originalPrice !== undefined && (!Number.isFinite(originalPrice) || originalPrice < price)) return setError('Original price must be greater than or equal to the selling price.');
    if (skuExists) return setError('Product ID / SKU must be unique.');
    if (invalidStock) return setError('Size-wise stock must be whole numbers of zero or more.');

    const availableCategories = isSupabaseConfigured() ? categories : demoCategories;
    const categoryItem = availableCategories.find((item) => item.id === form.categoryId);
    if (!categoryItem) return setError('Select a valid category before saving the product.');
    const productId = editing?.id || `prod-admin-${Date.now()}`;
    const now = new Date().toISOString();
    const variants: ProductVariant[] = form.sizes.flatMap((size, sizeIndex) => colors.map((color, colorIndex) => ({
      id: `${productId}-var-${sizeIndex}-${colorIndex}`,
      productId, sku: `${form.sku.trim()}-${size}-${slugify(color).toUpperCase()}`, size, color,
      colorHex: '#D8C7B9', price, compareAtPrice: originalPrice,
      quantity: Number(form.stockBySize[size]) || 0, reservedQuantity: 0, lowStockThreshold: 3,
    })));
    const images: ProductImage[] = (imagePreviews.length ? imagePreviews : [editing?.images[0]?.url || '']).map((url, index) => ({
      id: `${productId}-image-${index}`, url, alt: `${form.name} image ${index + 1}`, position: index + 1,
    }));
    const product: Product = {
      id: productId, name: form.name.trim(), slug: editing?.slug || `${slugify(form.name)}-${productId.slice(-6)}`,
      description: form.description.trim(), shortDescription: form.shortDescription.trim() || form.description.trim(),
      fabric: form.fabric.trim(), careInstructions: form.careInstructions.trim() || 'Follow garment care label.',
      categoryId: categoryItem.id, categoryName: categoryItem.name, collectionIds: [
        ...(form.newArrival ? ['col-001'] : []),
        ...(form.bestseller || form.featured ? ['col-002'] : []),
      ],
      images, variants, tags: [form.occasion, form.fit].filter(Boolean), isActive: form.active, isFeatured: form.featured,
      isBestseller: form.bestseller, subcategory: form.subcategory.trim(), fit: form.fit.trim(), occasion: form.occasion.trim(),
      sku: form.sku.trim(), createdAt: editing?.createdAt || now, updatedAt: now,
    };
    try {
      if (isSupabaseConfigured()) {
        const client = createClient();
        const uploadedPaths = await Promise.all(imageFiles.map(async (file) => {
          const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
          const path = `${productId}/${crypto.randomUUID()}.${extension}`;
          const upload = await client.storage.from('product-images').upload(path, file, { contentType: file.type, upsert: false });
          if (upload.error) throw upload.error;
          return path;
        }));
        const existingPaths = imagePreviews
          .filter((preview) => !preview.startsWith('blob:'))
          .map((preview) => preview.split('/product-images/').pop() || '')
          .filter(Boolean);
        const paths = [...existingPaths, ...uploadedPaths];
        await saveSupabaseProduct(client, {
          id: editing?.id,
          sku: form.sku.trim(),
          name: product.name,
          slug: product.slug,
          description: product.description,
          shortDescription: product.shortDescription,
          categoryId: categoryItem.id,
          price,
          originalPrice,
          sizes: form.sizes,
          colors,
          stock: variants.reduce((sum, variant) => sum + variant.quantity, 0),
          fabric: product.fabric,
          occasion: product.occasion || '',
          active: product.isActive,
          featured: product.isFeatured,
          bestseller: product.isBestseller || false,
          newArrival: form.newArrival,
          images: paths.map((path, index) => ({ path, alt: `${product.name} image ${index + 1}`, position: index })),
          variants: variants.map((variant) => ({ sku: variant.sku, size: variant.size, color: variant.color, price: variant.price, stock: variant.quantity })),
        });
        const refreshed = await fetchAdminProducts(client);
        useProductStore.setState({ products: refreshed });
        setMessage(editing ? 'Product updated in Supabase.' : 'Product added to Supabase.');
        setEditing(refreshed.find((item) => item.id === (editing?.id || product.id)) || null);
      } else {
        if (editing) updateProduct(editing.id, product);
        else addProduct(product);
        setMessage(editing ? 'Product updated in the demo catalogue.' : 'Product added to the demo catalogue.');
        setEditing(product);
      }
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save product.');
    }
  };

  const remove = async (product: Product) => {
    if (window.confirm(`Delete "${product.name}" from the demo catalogue?`)) {
      if (isSupabaseConfigured()) {
        try {
          await deleteSupabaseProduct(createClient(), product.id);
          useProductStore.setState((state) => ({ products: state.products.filter((item) => item.id !== product.id) }));
          setMessage('Product deleted from Supabase.');
        } catch (deleteError) {
          setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete product.');
        }
      } else {
        deleteProduct(product.id);
        setMessage('Product deleted from the demo catalogue.');
      }
      if (editing?.id === product.id) openCreate();
    }
  };

  const discount = form.price && form.originalPrice && Number(form.originalPrice) >= Number(form.price)
    ? Math.round((1 - Number(form.price) / Number(form.originalPrice)) * 100) : 0;
  const suggestedCategories = demoCategories.map((item) => ({
    id: `suggestion-${item.slug}`,
    name: item.name,
  }));
  const categoryOptions = [...categories, ...suggestedCategories.filter(
    (suggestion) => !categories.some((categoryItem) => categoryItem.name.toLowerCase() === suggestion.name.toLowerCase()),
  )];

  const selectCategory = async (categoryId: string) => {
    const selected = categoryOptions.find((item) => item.id === categoryId);
    if (!selected) {
      updateField('categoryId', '');
      return;
    }
    if (isSupabaseConfigured() && categoryId.startsWith('suggestion-')) {
      try {
        const created = await createSupabaseCategory(createClient(), selected.name);
        setCategories((current) => [...current, created]);
        updateField('categoryId', created.id);
        setMessage(`${created.name} was added to your Supabase categories.`);
      } catch (categoryError) {
        setError(categoryError instanceof Error ? categoryError.message : 'Unable to add the selected category.');
      }
      return;
    }
    if (!isSupabaseConfigured() && categoryId.startsWith('suggestion-')) {
      const demoCategory = demoCategories.find((item) => `suggestion-${item.slug}` === categoryId);
      updateField('categoryId', demoCategory?.id || '');
      return;
    }
    updateField('categoryId', categoryId);
  };

  return (
    <div>
      {!hydrated && <p className="mb-6 border border-taupe bg-white p-4 text-sm text-muted" role="status">Loading demo catalogue…</p>}
      {supabaseError && <p role="alert" className="mb-6 border border-red-200 bg-red-50 p-4 text-sm text-red-700">{supabaseError}</p>}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">Catalog management</p><h1 className="mt-2 font-serif text-4xl">Products</h1><p className="mt-2 text-sm text-muted">Demo changes are shared with the storefront and persisted in this browser.</p></div>
        <button type="button" onClick={openCreate} className="btn btn-primary btn-small"><Plus size={14} /> Add product</button>
      </div>
      {message && <p role="status" className="mb-5 border border-espresso/30 bg-espresso/5 p-3 text-sm text-espresso">{message}</p>}
      <section className="mb-8 border border-taupe bg-white p-5 sm:p-6" aria-labelledby="category-management-title">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">Catalogue structure</p>
            <h2 id="category-management-title" className="mt-1 font-serif text-2xl">Manage categories</h2>
            <p className="mt-2 text-sm text-muted">Add a category before assigning it to a product.</p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[22rem] sm:flex-row">
            <label htmlFor="new-category" className="sr-only">New category name</label>
            <input
              id="new-category"
              value={newCategory}
              onChange={(event) => setNewCategory(event.target.value)}
              placeholder="e.g. Handwoven Sarees"
              className="min-w-0 flex-1"
            />
            <button type="button" onClick={addCategory} disabled={!newCategory.trim() || (isSupabaseConfigured() && !hydrated)} className="btn btn-primary btn-small flex-shrink-0 disabled:cursor-not-allowed disabled:opacity-50">
              Add category
            </button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {categoryOptions.length > 0 ? categoryOptions.map((item) => (
            <button key={item.id} type="button" onClick={() => void selectCategory(item.id)} className={`border px-3 py-2 text-xs transition-colors ${form.categoryId === item.id ? 'border-espresso bg-espresso text-white' : 'border-taupe text-charcoal hover:border-espresso'}`}>
              {item.name}
            </button>
          )) : <p className="text-sm text-muted">No categories have been added yet. Use the field above to create one.</p>}
        </div>
      </section>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row"><label className="relative flex-1"><span className="sr-only">Search products</span><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by product name or SKU" className="pl-9" /></label><select value={category} onChange={(event) => setCategory(event.target.value)} className="sm:max-w-52"><option value="all">All categories</option>{demoCategories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><select value={sort} onChange={(event) => setSort(event.target.value)} className="sm:max-w-44"><option value="newest">Newest</option><option value="name">Name</option><option value="price">Price</option></select></div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filtered.map((product) => {
        const stock = product.variants.reduce((sum, variant) => sum + variant.quantity - variant.reservedQuantity, 0);
        const price = product.variants[0]?.price || 0;
        const original = product.variants[0]?.compareAtPrice;
        return <article key={product.id} className="border border-taupe bg-white p-4"><div className="relative aspect-[4/3] overflow-hidden bg-beige-100">{product.images[0]?.url ? <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-xs text-muted">No image</div>}<span className={`absolute right-2 top-2 px-2 py-1 text-[10px] uppercase tracking-wider ${product.isActive ? 'bg-espresso text-white' : 'bg-charcoal text-white'}`}>{product.isActive ? 'Active' : 'Inactive'}</span></div><div className="mt-4 flex justify-between gap-3"><div><h2 className="font-medium">{product.name}</h2><p className="mt-1 text-xs text-muted">{product.sku || product.variants[0]?.sku}</p></div><p className="text-sm font-semibold">{formatINR(price)}{original && <span className="ml-1 text-xs font-normal text-muted line-through">{formatINR(original)}</span>}</p></div><div className="mt-3 flex flex-wrap gap-2 text-xs text-muted"><span>{product.categoryName}</span><span>·</span><span>{product.variants.length} variants</span><span>·</span><span className={stock <= 5 ? 'font-semibold text-espresso' : ''}>{stock} in stock</span></div><div className="mt-4 flex gap-2 border-t border-taupe pt-4"><button type="button" onClick={() => openEdit(product)} className="btn btn-secondary btn-small flex-1"><Pencil size={13} /> Edit</button><button type="button" onClick={() => remove(product)} className="btn btn-small text-red-700" aria-label={`Delete ${product.name}`}><Trash2 size={14} /></button></div></article>;
      })}</div>
      {filtered.length === 0 && <div className="border border-dashed border-taupe px-6 py-16 text-center text-sm text-muted">No products match your search or category.</div>}
      <form onSubmit={submit} className="admin-form mt-10 border border-taupe bg-white p-5 sm:p-7">
        <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">{editing ? 'Edit product' : 'New product'}</p><h2 className="mt-1 font-serif text-3xl">{editing ? editing.name : 'Add a catalogue piece'}</h2></div>{editing && <button type="button" onClick={openCreate} className="text-muted" aria-label="Close product editor"><X size={20} /></button>}</div>
        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <label><span>Product name *</span><input value={form.name} onChange={(e) => updateField('name', e.target.value)} /></label>
          <label><span>Product ID / SKU *</span><input value={form.sku} onChange={(e) => updateField('sku', e.target.value.toUpperCase())} /></label>
          <div className="min-w-0"><label htmlFor="product-category">Category *</label><select id="product-category" value={form.categoryId} onChange={(e) => void selectCategory(e.target.value)} required><option value="">Select a category</option>{categoryOptions.map((item) => <option key={item.id} value={item.id}>{item.name}{item.id.startsWith('suggestion-') ? ' (suggested)' : ''}</option>)}</select><p className="mt-2 text-xs text-muted">Suggested categories are added automatically when selected.</p></div>
          <label><span>Subcategory</span><input value={form.subcategory} onChange={(e) => updateField('subcategory', e.target.value)} placeholder="e.g. Chikankari" /></label>
          <label className="sm:col-span-2"><span>Short description</span><input value={form.shortDescription} onChange={(e) => updateField('shortDescription', e.target.value)} /></label>
          <label className="sm:col-span-2"><span>Full product description *</span><textarea rows={4} value={form.description} onChange={(e) => updateField('description', e.target.value)} /></label>
          <label><span>Selling price (INR) *</span><input type="number" min="1" step="0.01" value={form.price} onChange={(e) => updateField('price', e.target.value)} /></label>
          <label><span>Original price</span><input type="number" min="1" step="0.01" value={form.originalPrice} onChange={(e) => updateField('originalPrice', e.target.value)} />{discount > 0 && <small className="mt-1 block text-espresso">{discount}% discount</small>}</label>
          <label><span>Colors * <small className="font-normal normal-case tracking-normal">(comma separated)</small></span><input value={form.colors} onChange={(e) => updateField('colors', e.target.value)} /></label>
          <label><span>Available sizes *</span><div className="mt-2 flex flex-wrap gap-2">{sizes.map((size) => <button type="button" key={size} onClick={() => updateField('sizes', form.sizes.includes(size) ? form.sizes.filter((item) => item !== size) : [...form.sizes, size])} className={`border px-3 py-2 text-xs ${form.sizes.includes(size) ? 'border-espresso bg-espresso text-white' : 'border-taupe'}`}>{size}</button>)}</div></label>
          <div className="sm:col-span-2"><span className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted">Size-wise inventory *</span><div className="grid grid-cols-3 gap-3 sm:grid-cols-6">{form.sizes.map((size) => <label key={size}><span>{size}</span><input type="number" min="0" step="1" value={form.stockBySize[size] ?? 0} onChange={(e) => updateField('stockBySize', { ...form.stockBySize, [size]: Number(e.target.value) })} /></label>)}</div></div>
          <label><span>Fabric *</span><input value={form.fabric} onChange={(e) => updateField('fabric', e.target.value)} /></label>
          <label><span>Fit</span><input value={form.fit} onChange={(e) => updateField('fit', e.target.value)} placeholder="e.g. Relaxed" /></label>
          <label><span>Occasion</span><input value={form.occasion} onChange={(e) => updateField('occasion', e.target.value)} placeholder="e.g. Festive" /></label>
          <label><span>Care instructions</span><input value={form.careInstructions} onChange={(e) => updateField('careInstructions', e.target.value)} /></label>
          <div className="sm:col-span-2"><span className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted">Product images <small className="font-normal normal-case tracking-normal">(demo preview, max 5 MB each)</small></span><label className="flex cursor-pointer items-center gap-2 border border-dashed border-taupe p-4 text-sm text-muted hover:border-espresso"><ImagePlus size={18} /> Select main or gallery images<input type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={selectImages} className="sr-only" /></label>{imagePreviews.length > 0 && <div className="mt-3 flex gap-3 overflow-x-auto">{imagePreviews.map((src, index) => <div key={`${src}-${index}`} className="relative h-24 w-20 flex-shrink-0 overflow-hidden bg-beige-100"><img src={src} alt="" className="h-full w-full object-cover" /><button type="button" onClick={() => setImagePreviews(imagePreviews.filter((_, imageIndex) => imageIndex !== index))} className="absolute right-1 top-1 rounded-full bg-charcoal p-1 text-white" aria-label="Remove image"><X size={11} /></button></div>)}</div>}</div>
          <div className="flex flex-wrap gap-4 sm:col-span-2">{[['featured', 'Featured'], ['bestseller', 'Bestseller'], ['newArrival', 'New arrival'], ['active', 'Active / visible']].map(([key, label]) => <label key={key} className="flex items-center gap-2 normal-case tracking-normal text-charcoal"><input type="checkbox" checked={form[key as keyof FormState] as boolean} onChange={(e) => updateField(key as keyof FormState, e.target.checked as FormState[keyof FormState])} className="h-4 w-4" /> {label}</label>)}</div>
        </div>
        {error && <p role="alert" className="mt-5 text-sm text-red-700">{error}</p>}
        <div className="mt-7 flex flex-wrap gap-3"><button type="submit" className="btn btn-primary btn-small">{editing ? 'Save product changes' : 'Add product to catalogue'}</button><button type="button" onClick={openCreate} className="btn btn-secondary btn-small">Clear form</button></div>
        <p className="mt-5 text-xs leading-relaxed text-muted">Demo limitation: selected image previews use temporary browser object URLs and are not persisted as large files. Production uploads must use the authenticated backend and object storage.</p>
      </form>
    </div>
  );
}
