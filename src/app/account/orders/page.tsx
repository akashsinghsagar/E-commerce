'use client';

import Link from 'next/link';
import { demoOrders } from '@/data/demo';
import { useAuthStore } from '@/store/auth';

export default function OrdersPage() {
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  if (status === 'loading') return <div className="container-narrow py-24 text-center text-sm text-muted">Checking your session…</div>;
  if (!user) return <div className="container-narrow py-24 text-center"><h1 className="font-serif text-3xl">Sign in to view orders</h1><Link href="/login" className="btn btn-primary btn-small mt-6">Sign in</Link></div>;
  const orders = demoOrders.filter((order) => order.userId === user.id || order.userId === 'demo-user-001');
  return <main className="min-h-screen bg-ivory"><div className="container-narrow py-12 lg:py-16"><p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">Your account</p><h1 className="mt-2 font-serif text-4xl">Order history</h1><div className="mt-8 space-y-4">{orders.map((order) => <Link href={`/account/orders/${order.orderNumber}`} key={order.id} className="block border border-taupe p-5 hover:border-espresso"><div className="flex flex-col justify-between gap-3 sm:flex-row"><strong>{order.orderNumber}</strong><span className="capitalize text-sm text-muted">{order.orderStatus.replaceAll('_', ' ')}</span></div><div className="mt-4 flex justify-between text-sm"><span className="text-muted">{new Date(order.createdAt).toLocaleDateString('en-IN')} · {order.items.length} item(s)</span><span className="font-semibold">₹{order.total.toLocaleString('en-IN')}</span></div></Link>)}{orders.length === 0 && <p className="border border-dashed border-taupe p-8 text-sm text-muted">No demo orders found.</p>}</div></div></main>;
}
