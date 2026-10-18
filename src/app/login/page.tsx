import AuthForm from '@/components/auth/AuthForm';

export default function LoginPage() {
  return <main className="min-h-[65vh] bg-ivory"><div className="mx-auto max-w-md px-6 py-16 lg:py-24"><p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-muted">Welcome back</p><h1 className="mt-3 text-center font-serif text-4xl">Sign in to LADDI</h1><p className="mb-8 mt-3 text-center text-sm text-muted">Demo authentication only. No password is stored.</p><AuthForm mode="login" /></div></main>;
}
