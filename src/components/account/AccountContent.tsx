'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { demoOrders } from '@/data/demo';
import type { DeliveryAddress } from '@/types';

const blankAddress = { fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', isDefault: false };

export default function AccountContent() {
  const { user, status, logout, updateProfile, addAddress, removeAddress, setDefaultAddress } = useAuthStore();
  const [profile, setProfile] = useState({ name: user?.fullName || '', phone: user?.phone || '' });
  const [address, setAddress] = useState(blankAddress);
  const [message, setMessage] = useState('');

  if (status === 'loading') {
    return <div className="container-narrow flex min-h-[55vh] items-center justify-center py-20 text-center text-sm text-muted">Checking your session…</div>;
  }

  if (!user) {
    return <div className="container-narrow flex min-h-[55vh] flex-col items-center justify-center py-20 text-center"><p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">Your account</p><h1 className="mt-3 font-serif text-4xl">Sign in to view your account</h1><p className="mt-3 text-sm text-muted">Use the frontend-only demo account flow to continue.</p><Link href="/login" className="btn btn-primary btn-large mt-8">Sign in</Link></div>;
  }

  const saveProfile = (event: React.FormEvent) => { event.preventDefault(); updateProfile({ fullName: profile.name.trim(), phone: profile.phone.trim() }); setMessage('Profile saved in this browser for the demo.'); };
  const saveAddress = (event: React.FormEvent) => { event.preventDefault(); if (!address.fullName || !address.addressLine1 || !address.city || !address.state || !/^\d{6}$/.test(address.pincode)) { setMessage('Complete the required address fields and enter a valid 6-digit PIN.'); return; } addAddress(address); setAddress(blankAddress); setMessage('Address saved in this browser for the demo.'); };
  const demoUserOrders = demoOrders.filter((order) => order.userId === user.id || order.userId === 'demo-user-001');

  return <main className="account-page min-h-screen bg-ivory"><div className="container-narrow py-10 sm:py-12 lg:py-16"><div className="account-header flex flex-col justify-between gap-5 border-b border-taupe pb-8 sm:flex-row sm:items-end"><div><p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">Your account</p><h1 className="mt-2 font-serif text-4xl">Hello, {user.fullName}</h1><p className="mt-2 max-w-md text-sm text-muted">Manage your profile, saved addresses, and recent orders.</p></div><button type="button" onClick={logout} className="btn btn-secondary btn-small self-start">Log out</button></div>{message && <p role="status" className="mt-5 border border-taupe px-3 py-3 text-sm text-espresso">{message}</p>}<div className="mt-10 grid gap-12 lg:grid-cols-2">
    <section className="account-section"><h2 className="font-serif text-2xl">Profile details</h2><form onSubmit={saveProfile} className="mt-6 max-w-xl space-y-6"><label><span>Full name</span><input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></label><label><span>Email address</span><input value={user.email} readOnly /></label><label><span>Phone number</span><input type="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></label><button className="btn btn-primary btn-small mt-2" type="submit">Save profile</button></form></section>
    <section className="account-section"><div className="account-section-heading flex items-center justify-between"><h2 className="font-serif text-2xl">Saved addresses</h2><span className="text-xs text-muted">{user.addresses.length} saved</span></div><div className="mt-6 space-y-4">{user.addresses.map((item) => <div key={item.id} className="border border-taupe p-4 text-sm"><div className="flex justify-between gap-3"><strong>{item.fullName}</strong><button type="button" onClick={() => removeAddress(item.id)} className="text-xs text-muted underline">Remove</button></div><p className="mt-2 text-muted">{item.addressLine1}{item.addressLine2 ? `, ${item.addressLine2}` : ''}, {item.city}, {item.state} — {item.pincode}</p><p className="mt-1 text-xs text-muted">{item.phone}</p>{item.isDefault ? <span className="mt-3 inline-block text-xs text-espresso">Default address</span> : <button type="button" onClick={() => setDefaultAddress(item.id)} className="mt-3 text-xs underline">Make default</button>}</div>)}{user.addresses.length === 0 && <p className="border border-dashed border-taupe p-5 text-sm text-muted">No saved addresses yet.</p>}</div></section>
  </div><section className="account-section mt-12 border-t border-taupe pt-10"><div className="account-section-heading flex items-center justify-between"><div><h2 className="font-serif text-2xl">Add an address</h2><p className="mt-1 text-sm text-muted">Save a delivery address for a faster checkout.</p></div><span className="text-xs text-muted">Required fields</span></div><form onSubmit={saveAddress} className="mt-6 grid max-w-4xl gap-x-8 gap-y-6 sm:grid-cols-2">{(['fullName', 'phone', 'addressLine1', 'addressLine2', 'city', 'state', 'pincode'] as (keyof typeof blankAddress)[]).map((key) => <label key={key}><span>{key === 'addressLine1' ? 'Address' : key === 'addressLine2' ? 'Apartment / landmark' : key === 'pincode' ? 'PIN code' : key.replace(/([A-Z])/g, ' $1')}</span><input value={address[key] as string} onChange={(e) => setAddress({ ...address, [key]: e.target.value })} /></label>)}<label className="flex items-center gap-2 normal-case tracking-normal text-charcoal"><input type="checkbox" checked={address.isDefault} onChange={(e) => setAddress({ ...address, isDefault: e.target.checked })} className="h-4 w-4" /> Make this my default address</label><div><button className="btn btn-primary btn-small" type="submit">Save address</button></div></form></section>
  <section className="account-section mt-12 border-t border-taupe pt-10"><div className="account-section-heading flex items-center justify-between"><h2 className="font-serif text-2xl">Recent orders</h2><Link href="/account/orders" className="text-xs underline underline-offset-4">View all</Link></div><div className="mt-6 grid gap-4 md:grid-cols-2">{demoUserOrders.slice(0, 2).map((order) => <Link href={`/account/orders/${order.orderNumber}`} key={order.id} className="border border-taupe p-5 transition-colors hover:border-espresso"><div className="flex justify-between text-sm"><strong>{order.orderNumber}</strong><span className="capitalize text-muted">{order.orderStatus.replaceAll('_', ' ')}</span></div><p className="mt-3 text-xs text-muted">{new Date(order.createdAt).toLocaleDateString('en-IN')} · ₹{order.total.toLocaleString('en-IN')}</p></Link>)}</div></section>
  </div></main>;
}
