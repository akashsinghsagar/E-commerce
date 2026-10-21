'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { demoOrders } from '@/data/demo';
import { useAuthStore } from '@/store/auth';

export default function OrderDetailPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  const order = demoOrders.find((item) => item.orderNumber === orderNumber);

  if (status === 'loading') {
    return <div className="container-narrow py-24 text-center text-sm text-muted">Checking your session…</div>;
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-ivory">
        <div className="container-narrow py-24 text-center">
          <h1 className="font-serif text-3xl">Sign in to view this order</h1>
          <Link href={`/login?next=/account/orders/${encodeURIComponent(orderNumber)}`} className="btn btn-primary btn-small mt-6">Sign in</Link>
        </div>
      </main>
    );
  }

  if (!order || (order.userId !== user.id && order.userId !== 'demo-user-001')) {
    return (
      <main className="min-h-screen bg-ivory">
        <div className="container-narrow py-24 text-center">
          <h1 className="font-serif text-3xl">Order not found</h1>
          <Link href="/account/orders" className="mt-6 inline-block text-sm underline underline-offset-4">Back to orders</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ivory">
      <div className="container-narrow py-12 lg:py-16">
        <Link href="/account/orders" className="text-xs text-muted underline underline-offset-4">← Back to orders</Link>
        <div className="mt-8 flex flex-col justify-between gap-4 border-b border-taupe pb-7 sm:flex-row">
          <div><p className="text-xs uppercase tracking-wider text-muted">Demo order</p><h1 className="mt-2 font-serif text-4xl">{order.orderNumber}</h1></div>
          <span className="self-start border border-espresso px-3 py-2 text-xs capitalize text-espresso">{order.orderStatus.replaceAll('_', ' ')}</span>
        </div>
        <div className="grid gap-10 py-8 lg:grid-cols-[1fr_320px]">
          <section>
            <h2 className="font-serif text-2xl">Items</h2>
            <div className="mt-5 divide-y divide-taupe border-y border-taupe">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between gap-4 py-4 text-sm">
                  <div><strong>{item.name}</strong><p className="mt-1 text-xs text-muted">{item.color} · {item.size} · Qty {item.quantity}</p></div>
                  <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </section>
          <aside className="h-fit border border-taupe bg-beige-100 p-6">
            <h2 className="font-serif text-2xl">Delivery</h2>
            <p className="mt-4 text-sm leading-relaxed">{order.deliveryAddress.fullName}<br />{order.deliveryAddress.addressLine1}{order.deliveryAddress.addressLine2 ? <><br />{order.deliveryAddress.addressLine2}</> : null}<br />{order.deliveryAddress.city}, {order.deliveryAddress.state} — {order.deliveryAddress.pincode}<br />{order.deliveryAddress.phone}</p>
            <div className="mt-6 border-t border-taupe pt-4 text-sm">
              <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>₹{order.subtotal.toLocaleString('en-IN')}</span></div>
              <div className="mt-2 flex justify-between"><span className="text-muted">Shipping</span><span>{order.deliveryCharge ? `₹${order.deliveryCharge}` : 'Free'}</span></div>
              <div className="mt-3 flex justify-between border-t border-taupe pt-3 font-semibold"><span>Total</span><span>₹{order.total.toLocaleString('en-IN')}</span></div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
