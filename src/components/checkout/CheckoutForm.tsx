'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';

type FormValues = {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pin: string;
};

const initialValues: FormValues = { name: '', phone: '', email: '', address: '', city: '', state: '', pin: '' };

export default function CheckoutForm() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const subtotal = useCartStore((state) => state.getSubtotal());
  const shipping = useCartStore((state) => state.getDeliveryCharge());
  const discount = subtotal >= 5000 ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + shipping - discount;
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<FormValues>>({});
  const [submitting, setSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<string | null>(null);

  const validate = () => {
    const next: Partial<FormValues> = {};
    (Object.keys(values) as (keyof FormValues)[]).forEach((key) => {
      if (!values[key].trim()) next[key] = 'This field is required.';
    });
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = 'Enter a valid email address.';
    if (values.phone && !/^[6-9]\d{9}$/.test(values.phone.replace(/\s/g, ''))) next.phone = 'Enter a valid 10-digit phone number.';
    if (values.pin && !/^\d{6}$/.test(values.pin)) next.pin = 'Enter a valid 6-digit PIN code.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (items.length === 0 || !validate()) return;
    setSubmitting(true);
    const orderNumber = `DEMO-${Date.now().toString().slice(-8)}`;
    localStorage.setItem('laddi-demo-order', JSON.stringify({ orderNumber, customer: values, items, subtotal, shipping, discount, total }));
    clearCart();
    setCompletedOrder(orderNumber);
    setSubmitting(false);
  };

  if (items.length === 0) {
    return <div className="container-narrow py-24 text-center"><h1 className="font-serif text-3xl">Your cart is empty</h1><p className="mt-3 text-sm text-muted">Add a piece before continuing to checkout.</p></div>;
  }

  const field = (key: keyof FormValues, label: string, type = 'text') => (
    <label key={key}>
      <span>{label}</span>
      <input type={type} value={values[key]} onChange={(event) => { setValues({ ...values, [key]: event.target.value }); setErrors({ ...errors, [key]: undefined }); }} aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `${key}-error` : undefined} />
      {errors[key] && <span id={`${key}-error`} className="mt-1 block text-xs font-normal normal-case tracking-normal text-red-700">{errors[key]}</span>}
    </label>
  );

  return (
    <>
      <form onSubmit={submit} className="container-narrow py-12 lg:py-16">
      <div className="mb-8 border border-espresso/30 bg-espresso/5 p-4 text-sm text-espresso"><strong>Demo checkout:</strong> no payment is processed and no real order is placed.</div>
      <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
        <div>
          <h1 className="font-serif text-4xl">Delivery details</h1>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {field('name', 'Full name')}
            {field('phone', 'Phone number', 'tel')}
            {field('email', 'Email address', 'email')}
            {field('address', 'Address', 'text')}
            {field('city', 'City')}
            {field('state', 'State')}
            {field('pin', 'PIN code', 'text')}
          </div>
          <fieldset className="mt-8 border-t border-taupe pt-6">
            <legend className="text-xs font-semibold uppercase tracking-wider">Payment method</legend>
            <label className="mt-4 flex items-center gap-3 normal-case tracking-normal text-charcoal">
              <input type="radio" checked readOnly className="h-4 w-4" />
              Cash on Delivery <span className="text-xs text-muted">(demo only)</span>
            </label>
          </fieldset>
        </div>
        <aside className="h-fit border border-taupe bg-beige-100 p-6">
          <h2 className="font-serif text-2xl">Demo order summary</h2>
          <div className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between"><span className="text-muted">Shipping</span><span>{shipping ? `₹${shipping}` : 'Free'}</span></div>
            {discount > 0 && <div className="flex justify-between text-espresso"><span>Demo discount</span><span>-₹{discount.toLocaleString('en-IN')}</span></div>}
            <div className="flex justify-between border-t border-taupe pt-4 font-semibold"><span>Total</span><span>₹{total.toLocaleString('en-IN')}</span></div>
          </div>
          <button type="submit" disabled={submitting} className="btn btn-primary mt-7 w-full">{submitting ? 'Submitting demo order...' : 'Place demo order'}</button>
        </aside>
      </div>
      </form>
      {completedOrder && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-charcoal/45 px-5" role="dialog" aria-modal="true" aria-labelledby="order-received-title">
          <div className="w-full max-w-md border border-taupe bg-ivory p-7 text-center shadow-2xl sm:p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-espresso text-2xl text-white">✓</div>
            <p className="mt-5 text-xs font-medium uppercase tracking-[0.2em] text-espresso">Order received</p>
            <h2 id="order-received-title" className="mt-3 font-serif text-3xl">Your order is confirmed</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">Thank you, {values.name}. Your LADDI order has been received and is being prepared for delivery.</p>
            <p className="mt-5 border border-taupe px-4 py-3 text-sm">Reference: <strong>{completedOrder}</strong></p>
            <button type="button" className="btn btn-primary btn-large mt-7 w-full" onClick={() => router.push(`/order-confirmation?order=${completedOrder}`)}>View order details</button>
          </div>
        </div>
      )}
    </>
  );
}
