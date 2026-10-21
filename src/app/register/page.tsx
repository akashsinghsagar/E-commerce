import AuthForm from '@/components/auth/AuthForm';

export default function RegisterPage() {
  return <main className="min-h-[65vh] bg-ivory"><div className="mx-auto max-w-md px-6 py-16 lg:py-24"><p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-muted">Join LADDI</p><h1 className="mt-3 text-center font-serif text-4xl">Create an account</h1><p className="mb-8 mt-3 text-center text-sm text-muted">Create your secure LADDI customer account.</p><AuthForm mode="register" /></div></main>;
}
