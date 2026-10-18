'use client';

import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setStatus('error');
      return;
    }
    // In demo mode, simply show success
    setStatus('success');
    setEmail('');
    setTimeout(() => setStatus('idle'), 5000);
  };

  return (
    <section className="bg-beige section-padding" id="newsletter-section">
      <div className="container-narrow text-center max-w-xl mx-auto">
        <h2 className="font-serif text-2xl lg:text-3xl text-charcoal mb-3">
          Stay in the Loop
        </h2>
        <p className="text-sm text-muted mb-8 leading-relaxed">
          Be the first to know about new collections, artisan stories, and exclusive offers.
          No spam, ever — just beautiful things.
        </p>

        {status === 'success' ? (
          <div className="flex items-center justify-center gap-2 text-espresso animate-fade-in">
            <Check size={18} />
            <span className="text-sm font-medium">Welcome to LADDI. Something beautiful is on its way.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
              className={`flex-1 text-sm bg-white border px-4 py-3 ${
                status === 'error' ? 'border-red-400' : 'border-taupe'
              }`}
              required
              id="newsletter-email"
            />
            <button
              type="submit"
              className="btn btn-primary flex items-center gap-2 px-6"
              id="newsletter-submit"
            >
              Subscribe
              <ArrowRight size={14} />
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="text-xs text-red-500 mt-2">Please enter a valid email address.</p>
        )}
      </div>
    </section>
  );
}
