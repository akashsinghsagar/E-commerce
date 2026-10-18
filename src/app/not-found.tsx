import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="bg-ivory">
      <div className="container-narrow flex min-h-[55vh] flex-col items-center justify-center px-6 py-20 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">LADDI</p>
        <h1 className="mt-4 font-serif text-4xl text-charcoal">This piece is no longer here</h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
          The product may have sold out or the link may be incorrect. Explore the collection to find your next favourite.
        </p>
        <Link href="/shop" className="btn btn-primary btn-large mt-8">Explore the collection</Link>
      </div>
    </main>
  );
}
