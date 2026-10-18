'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function Confirmation() {
  const order = useSearchParams().get('order');
  return (
    <main className="min-h-[60vh] bg-ivory">
      <div className="container-narrow flex flex-col items-center justify-center py-24 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-espresso">Demo confirmation</p>
        <h1 className="mt-4 font-serif text-4xl">Thank you for trying LADDI</h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">This is a demonstration only. No payment was processed and no real order was placed.</p>
        {order && <p className="mt-6 border border-taupe px-5 py-3 text-sm">Demo reference: <strong>{order}</strong></p>}
        <Link href="/shop" className="btn btn-primary btn-large mt-8">Continue shopping</Link>
      </div>
    </main>
  );
}

export default function OrderConfirmationPage() {
  return <Suspense fallback={<div className="container-narrow py-24 text-center text-sm text-muted">Loading confirmation...</div>}><Confirmation /></Suspense>;
}
