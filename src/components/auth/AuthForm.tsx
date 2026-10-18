'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';

type Mode = 'login' | 'register';

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [values, setValues] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) return setError('Enter a valid email address.');
    if (values.password.length < 6) return setError('Use at least 6 characters for the demo password.');
    if (mode === 'register' && !values.name.trim()) return setError('Enter your full name.');
    if (mode === 'register' && values.password !== values.confirm) return setError('Passwords do not match.');
    login(values.email.trim().toLowerCase(), values.name.trim(), values.phone.trim());
    router.push('/account');
  };

  if (submitted) {
    return <div className="border border-taupe bg-beige-100 p-6 text-center text-sm leading-relaxed"><strong>Demo email sent.</strong><br />If this were connected to a backend, reset instructions would be sent to your inbox.</div>;
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      {mode === 'register' && <label><span>Full name</span><input value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} aria-label="Full name" /></label>}
      <label><span>Email address</span><input type="email" value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} aria-label="Email address" /></label>
      {mode === 'register' && <label><span>Phone number <em className="font-normal normal-case tracking-normal text-muted">(optional)</em></span><input type="tel" value={values.phone} onChange={(e) => setValues({ ...values, phone: e.target.value })} aria-label="Phone number" /></label>}
      <label><span>Password</span><input type="password" value={values.password} onChange={(e) => setValues({ ...values, password: e.target.value })} aria-label="Password" /></label>
      {mode === 'register' && <label><span>Confirm password</span><input type="password" value={values.confirm} onChange={(e) => setValues({ ...values, confirm: e.target.value })} aria-label="Confirm password" /></label>}
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <button type="submit" className="btn btn-primary btn-large w-full">{mode === 'login' ? 'Sign in to demo account' : 'Create demo account'}</button>
      {mode === 'login' ? <div className="flex justify-between text-xs text-muted"><Link href="/forgot-password" className="underline underline-offset-4">Forgot password?</Link><Link href="/register" className="underline underline-offset-4">Create account</Link></div> : <p className="text-center text-xs text-muted">Already have an account? <Link href="/login" className="underline underline-offset-4">Sign in</Link></p>}
    </form>
  );
}
