'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  Boxes,
  ChevronDown,
  LayoutDashboard,
  Menu,
  Package,
  Search,
  ShoppingCart,
  Users,
  X,
} from 'lucide-react';
import { demoOrders } from '@/data/demo';
import ProductManager from '@/components/admin/ProductManager';
import { useProductStore } from '@/store/products';
import type { Order, OrderStatus, Product } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/env';

type AdminSection = 'overview' | 'products' | 'orders' | 'inventory' | 'customers';

const customers = [
  { id: 'demo-user-001', name: 'Priya Sharma', email: 'priya@example.com', orders: 3, spend: 7498 },
  { id: 'demo-user-002', name: 'Anita Desai', email: 'anita@example.com', orders: 2, spend: 7097 },
  { id: 'demo-user-003', name: 'Meena Iyer', email: 'meena@example.com', orders: 1, spend: 5999 },
];

const sections: { id: AdminSection; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'inventory', label: 'Inventory', icon: Boxes },
  { id: 'customers', label: 'Customers', icon: Users },
];

const formatINR = (value: number) => `₹${value.toLocaleString('en-IN')}`;

export default function AdminDashboard() {
  const [section, setSection] = useState<AdminSection>('overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const products = useProductStore((state) => state.products);
  const deleteProduct = useProductStore((state) => state.deleteProduct);
  const [orders, setOrders] = useState<Order[]>(demoOrders);
  const [search, setSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState<'all' | OrderStatus>('all');
  const [loading, setLoading] = useState(false);
  const [access, setAccess] = useState<'checking' | 'allowed' | 'denied' | 'setup'>(
    isSupabaseConfigured() ? 'checking' : 'setup',
  );

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const checkAccess = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setAccess('denied');
        return;
      }
      const { data, error } = await supabase.rpc('is_admin');
      setAccess(!error && data === true ? 'allowed' : 'denied');
    };
    void checkAccess();
  }, []);

  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  const lowStock = products.filter((product) =>
    product.variants.some((variant) => variant.quantity - variant.reservedQuantity <= variant.lowStockThreshold),
  );

  const filteredProducts = useMemo(() => products.filter((product) =>
    `${product.name} ${product.categoryName}`.toLowerCase().includes(search.toLowerCase()),
  ), [products, search]);

  const filteredOrders = useMemo(() => orders.filter((order) =>
    (orderFilter === 'all' || order.orderStatus === orderFilter)
      && `${order.orderNumber} ${order.deliveryAddress.fullName}`.toLowerCase().includes(search.toLowerCase()),
  ), [orders, orderFilter, search]);

  if (access === 'checking') {
    return <main className="min-h-screen bg-ivory"><div className="container-narrow py-24 text-center text-sm text-muted">Verifying administrator access…</div></main>;
  }
  if (access === 'denied') {
    return <main className="min-h-screen bg-ivory"><div className="container-narrow py-24 text-center"><h1 className="font-serif text-3xl">Administrator access required</h1><p className="mt-3 text-sm text-muted">Sign in with an authorized LADDI administrator account.</p><Link href="/login" className="btn btn-primary btn-small mt-6">Sign in</Link></div></main>;
  }
  if (access === 'setup') {
    return <main className="min-h-screen bg-ivory"><div className="container-narrow py-24 text-center"><h1 className="font-serif text-3xl">Supabase setup required</h1><p className="mt-3 text-sm text-muted">Configure the public Supabase environment variables before using the admin dashboard.</p></div></main>;
  }

  const navigate = (next: AdminSection) => {
    setSection(next);
    setMobileOpen(false);
    setSearch('');
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders((current) => current.map((order) => (
      order.id === id ? { ...order, orderStatus: status, updatedAt: new Date().toISOString() } : order
    )));
  };

  return (
    <main className="min-h-screen bg-ivory">
      <div className="flex min-h-screen">
        <aside className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-taupe bg-charcoal p-6 text-white transition-transform lg:static lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between">
            <Link href="/" className="font-serif text-2xl tracking-[0.15em]">LADDI</Link>
            <button type="button" onClick={() => setMobileOpen(false)} className="lg:hidden" aria-label="Close admin navigation"><X size={20} /></button>
          </div>
          <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-white/45">Demo admin studio</p>
          <nav className="mt-10 space-y-2">
            {sections.map(({ id, label, icon: Icon }) => (
              <button type="button" key={id} onClick={() => navigate(id)} className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${section === id ? 'bg-espresso text-white' : 'text-white/65 hover:bg-white/10 hover:text-white'}`}>
                <Icon size={17} /> {label}
              </button>
            ))}
          </nav>
          <div className="mt-auto pt-12 text-xs leading-relaxed text-white/40">Frontend-only demo. Admin authorization and data persistence require a secure backend.</div>
        </aside>
        {mobileOpen && <button type="button" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-40 bg-charcoal/50 lg:hidden" aria-label="Close navigation overlay" />}

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-taupe bg-ivory/95 px-5 py-4 backdrop-blur lg:px-10">
            <button type="button" onClick={() => setMobileOpen(true)} className="lg:hidden" aria-label="Open admin navigation"><Menu size={21} /></button>
            <div className="hidden items-center gap-2 text-xs uppercase tracking-[0.15em] text-muted sm:flex"><BarChart3 size={15} /> Admin / {section}</div>
            <span className="ml-auto text-xs text-muted">DEMO MODE</span>
          </header>
          <div className="mx-auto max-w-7xl px-5 py-8 lg:px-10 lg:py-12">
            {section === 'overview' && <Overview orders={orders} revenue={revenue} products={products} customers={customers.length} lowStock={lowStock.length} onNavigate={navigate} />}
            {section === 'products' && <ProductManager />}
            {section === 'orders' && <OrderManagement orders={filteredOrders} search={search} setSearch={setSearch} filter={orderFilter} setFilter={setOrderFilter} onUpdate={updateOrderStatus} />}
            {section === 'inventory' && <Inventory products={lowStock} />}
            {section === 'customers' && <CustomerList search={search} setSearch={setSearch} />}
            {loading && <div className="mt-4 text-xs text-muted">Updating demo data...</div>}
          </div>
        </div>
      </div>
    </main>
  );
}

function Overview({ orders, revenue, products, customers, lowStock, onNavigate }: { orders: Order[]; revenue: number; products: Product[]; customers: number; lowStock: number; onNavigate: (section: AdminSection) => void }) {
  const cards = [
    { label: 'Total orders', value: orders.length, icon: ShoppingCart, section: 'orders' as AdminSection },
    { label: 'Demo revenue', value: formatINR(revenue), icon: BarChart3, section: 'orders' as AdminSection },
    { label: 'Products', value: products.length, icon: Package, section: 'products' as AdminSection },
    { label: 'Customers', value: customers, icon: Users, section: 'customers' as AdminSection },
  ];
  return <><div className="mb-10"><p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">LADDI studio</p><h1 className="mt-2 font-serif text-4xl">Good morning</h1><p className="mt-2 text-sm text-muted">A quick view of your demo store activity.</p></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(({ label, value, icon: Icon, section }) => <button type="button" key={label} onClick={() => onNavigate(section)} className="border border-taupe bg-white p-5 text-left transition-shadow hover:shadow-sm"><Icon size={18} className="text-espresso" /><p className="mt-6 text-xs uppercase tracking-wider text-muted">{label}</p><p className="mt-1 text-2xl font-semibold">{value}</p></button>)}</div><div className="mt-10 grid gap-6 lg:grid-cols-2"><section className="border border-taupe bg-white p-6"><div className="flex items-center justify-between"><h2 className="font-serif text-2xl">Recent orders</h2><button type="button" className="text-xs underline" onClick={() => onNavigate('orders')}>View all</button></div><div className="mt-5 divide-y divide-taupe">{orders.slice(0, 4).map((order) => <div key={order.id} className="flex justify-between gap-3 py-3 text-sm"><span>{order.orderNumber}<small className="ml-2 text-muted">{order.deliveryAddress.fullName}</small></span><span>{formatINR(order.total)}</span></div>)}</div></section><section className="border border-taupe bg-white p-6"><div className="flex items-center justify-between"><h2 className="font-serif text-2xl">Stock attention</h2><button type="button" className="text-xs underline" onClick={() => onNavigate('inventory')}>View inventory</button></div>{lowStock ? <p className="mt-4 text-sm text-espresso">{lowStock} product(s) need a stock review.</p> : <p className="mt-4 text-sm text-muted">All products are comfortably stocked.</p>}</section></div></>;
}

function ProductManagement({ products, search, setSearch, onDelete, onNavigate }: { products: Product[]; search: string; setSearch: (value: string) => void; onDelete: (id: string) => void; onNavigate: (section: AdminSection) => void }) {
  return <><PageHeading title="Products" eyebrow="Catalog management" action={<button type="button" onClick={() => onNavigate('inventory')} className="btn btn-primary btn-small">View stock</button>} /><Toolbar value={search} onChange={setSearch} placeholder="Search products" />{products.length ? <div className="overflow-x-auto border border-taupe bg-white"><table className="w-full min-w-[680px] text-left text-sm"><thead className="border-b border-taupe bg-beige-100 text-xs uppercase tracking-wider text-muted"><tr><th className="p-4">Product</th><th className="p-4">Category</th><th className="p-4">Price</th><th className="p-4">Stock</th><th className="p-4">Action</th></tr></thead><tbody className="divide-y divide-taupe">{products.map((product) => { const stock = product.variants.reduce((sum, variant) => sum + variant.quantity - variant.reservedQuantity, 0); return <tr key={product.id}><td className="p-4 font-medium">{product.name}</td><td className="p-4 text-muted">{product.categoryName}</td><td className="p-4">{formatINR(Math.min(...product.variants.map((variant) => variant.price)))}</td><td className={`p-4 ${stock <= 5 ? 'font-semibold text-espresso' : ''}`}>{stock} units</td><td className="p-4"><button type="button" onClick={() => onDelete(product.id)} className="text-xs text-red-700 underline">Delete demo product</button></td></tr>; })}</tbody></table></div> : <EmptyState label="No products match your search." />}</>;
}

function OrderManagement({ orders, search, setSearch, filter, setFilter, onUpdate }: { orders: Order[]; search: string; setSearch: (value: string) => void; filter: 'all' | OrderStatus; setFilter: (value: 'all' | OrderStatus) => void; onUpdate: (id: string, status: OrderStatus) => void }) {
  return <><PageHeading title="Orders" eyebrow="Order management" /><div className="flex flex-col gap-3 sm:flex-row"><Toolbar value={search} onChange={setSearch} placeholder="Search order or customer" /><select value={filter} onChange={(e) => setFilter(e.target.value as 'all' | OrderStatus)} className="sm:max-w-48"><option value="all">All statuses</option>{['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'].map((status) => <option key={status} value={status}>{status}</option>)}</select></div>{orders.length ? <div className="mt-5 overflow-x-auto border border-taupe bg-white"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-taupe bg-beige-100 text-xs uppercase tracking-wider text-muted"><tr><th className="p-4">Order</th><th className="p-4">Customer</th><th className="p-4">Total</th><th className="p-4">Status</th><th className="p-4">Update</th></tr></thead><tbody className="divide-y divide-taupe">{orders.map((order) => <tr key={order.id}><td className="p-4 font-medium">{order.orderNumber}<small className="block pt-1 text-xs font-normal text-muted">{new Date(order.createdAt).toLocaleDateString('en-IN')}</small></td><td className="p-4">{order.deliveryAddress.fullName}</td><td className="p-4">{formatINR(order.total)}</td><td className="p-4 capitalize text-muted">{order.orderStatus.replaceAll('_', ' ')}</td><td className="p-4"><select value={order.orderStatus} onChange={(e) => onUpdate(order.id, e.target.value as OrderStatus)} className="py-2 text-xs"><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="packed">Packed</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option></select></td></tr>)}</tbody></table></div> : <EmptyState label="No orders match your filters." />}</>;
}

function Inventory({ products }: { products: Product[] }) {
  return <><PageHeading title="Inventory" eyebrow="Stock management" />{products.length ? <div className="grid gap-4 md:grid-cols-2">{products.map((product) => <div key={product.id} className="border border-taupe bg-white p-5"><div className="flex justify-between gap-4"><h2 className="font-medium">{product.name}</h2><span className="text-xs font-semibold text-espresso">Low stock</span></div><div className="mt-5 space-y-2">{product.variants.map((variant) => { const available = variant.quantity - variant.reservedQuantity; return <div key={variant.id} className="flex justify-between text-sm"><span className="text-muted">{variant.color} / {variant.size}</span><span className={available <= variant.lowStockThreshold ? 'font-semibold text-espresso' : ''}>{available} units</span></div>; })}</div></div>)}</div> : <EmptyState label="No low-stock products." />}</>;
}

function CustomerList({ search, setSearch }: { search: string; setSearch: (value: string) => void }) {
  const filtered = customers.filter((customer) => `${customer.name} ${customer.email}`.toLowerCase().includes(search.toLowerCase()));
  return <><PageHeading title="Customers" eyebrow="Customer directory" /><Toolbar value={search} onChange={setSearch} placeholder="Search customers" />{filtered.length ? <div className="mt-5 overflow-x-auto border border-taupe bg-white"><table className="w-full min-w-[620px] text-left text-sm"><thead className="border-b border-taupe bg-beige-100 text-xs uppercase tracking-wider text-muted"><tr><th className="p-4">Customer</th><th className="p-4">Orders</th><th className="p-4">Lifetime demo spend</th></tr></thead><tbody className="divide-y divide-taupe">{filtered.map((customer) => <tr key={customer.id}><td className="p-4"><strong>{customer.name}</strong><small className="block pt-1 text-xs text-muted">{customer.email}</small></td><td className="p-4">{customer.orders}</td><td className="p-4">{formatINR(customer.spend)}</td></tr>)}</tbody></table></div> : <EmptyState label="No customers match your search." />}</>;
}

function PageHeading({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) {
  return <div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">{eyebrow}</p><h1 className="mt-2 font-serif text-4xl">{title}</h1></div>{action}</div>;
}

function Toolbar({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return <label className="relative block max-w-md"><span className="sr-only">{placeholder}</span><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" /><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="pl-9" /></label>;
}

function EmptyState({ label }: { label: string }) {
  return <div className="mt-5 border border-dashed border-taupe px-6 py-16 text-center text-sm text-muted">{label}</div>;
}
