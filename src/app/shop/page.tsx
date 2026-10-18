import { Suspense } from 'react';
import ShopContent from '@/components/shop/ShopContent';

function CatalogueLoading() {
  return <div className="container-narrow min-h-screen py-24 text-center text-sm text-muted">Loading the collection...</div>;
}

export default function ShopPage() {
  return <Suspense fallback={<CatalogueLoading />}><ShopContent /></Suspense>;
}
