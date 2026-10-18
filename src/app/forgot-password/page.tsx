'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Enter a valid email address.');
    setError('');
    setSent(true);
  };
  return <main className="min-h-[65vh] bg-ivory"><div className="mx-auto max-w-md px-6 py-16 lg:py-24"><p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-muted">Account help</p><h1 className="mt-3 text-center font-serif text-4xl">Forgot password?</h1><p className="mb-8 mt-3 text-center text-sm text-muted">This demo does not send real reset emails or store passwords.</p>{sent ? <div className="border border-taupe bg-beige-100 p-6 text-center text-sm"><strong>Demo reset request received.</strong><p className="mt-2">No email was sent because this is a frontend-only flow.</p><Link href="/login" className="mt-5 inline-block underline underline-offset-4">Return to sign in</Link></div> : <form onSubmit={submit} className="space-y-5"><label><span>Email address</span><input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} /></label>{error && <p role="alert" className="text-sm text-red-700">{error}</p>}<button className="btn btn-primary btn-large w-full" type="submit">Request demo reset</button><Link href="/login" className="block text-center text-xs text-muted underline underline-offset-4">Back to sign in</Link></form>}</div></main>;
}
