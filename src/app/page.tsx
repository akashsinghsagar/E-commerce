import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Truck, Shield, Undo2, Sparkles } from 'lucide-react';
import HomeProductSections from '@/components/home/HomeProductSections';
import HomeCategories from '@/components/home/HomeCategories';
import Newsletter from '@/components/sections/Newsletter';
import {
  demoCollections,
} from '@/data/demo';

// Occasions for "Shop by Occasion"
const occasions = [
  { name: 'Festive & Wedding', image: '/demo/occasions/festive.jpg', href: '/shop?category=festive-wear' },
  { name: 'Work & Office', image: '/demo/occasions/work.jpg', href: '/shop?category=kurtis' },
  { name: 'Casual Weekend', image: '/demo/occasions/casual.jpg', href: '/shop?category=everyday-wear' },
  { name: 'Brunch & Travel', image: '/demo/occasions/brunch.jpg', href: '/shop?category=co-ord-sets' },
];

// Journal entries
const journalEntries = [
  {
    title: 'The Art of Chikankari: Lucknow\'s Living Heritage',
    excerpt: 'A centuries-old embroidery tradition that transforms simple cotton into works of art.',
    category: 'Craft Stories',
    href: '/journal',
  },
  {
    title: 'Building a Capsule Ethnic Wardrobe',
    excerpt: 'Five versatile pieces that take you from weekday meetings to weekend celebrations.',
    category: 'Style Guide',
    href: '/journal',
  },
  {
    title: 'Natural Dyes: From Indigo Fields to Your Wardrobe',
    excerpt: 'How traditional dyeing methods create colours that age beautifully.',
    category: 'Behind the Scenes',
    href: '/journal',
  },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero Section ──────────────────────────────────── */}
      <section className="relative bg-beige overflow-hidden" id="hero-section">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[65vh] lg:min-h-[80vh]">
            {/* Text */}
            <div className="flex flex-col justify-center py-16 lg:py-24 lg:pr-16 order-2 lg:order-1">
              <p className="text-xs tracking-[0.2em] uppercase text-muted font-medium mb-4 animate-fade-in">
                The Festive Edit — Autumn 2026
              </p>
              <h2 className="font-serif text-4xl lg:text-5xl xl:text-6xl text-charcoal leading-[1.1] mb-6 animate-fade-in delay-100">
                Where tradition
                <br />
                meets the
                <br />
                <span className="italic">modern woman</span>
              </h2>
              <p className="text-muted text-base lg:text-lg leading-relaxed max-w-md mb-8 animate-fade-in delay-200">
                Discover handcrafted pieces that honour India&apos;s rich textile heritage
                with a contemporary, minimalist sensibility.
              </p>
              <div className="flex flex-wrap gap-4 animate-fade-in delay-300">
                <Link href="/shop" className="btn btn-primary btn-large">
                  Explore the Collection
                  <ArrowRight size={16} />
                </Link>
                <Link href="/shop" className="btn btn-secondary btn-large">
                  Our Story
                </Link>
              </div>
            </div>

            {/* Hero campaign image */}
            <div className="relative bg-beige-300 min-h-[50vh] lg:min-h-full order-1 lg:order-2 overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85"
                alt="Woman wearing an elegant contemporary Indian outfit"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/25 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Promotion ─────────────────────────────────────── */}
      <section className="bg-espresso text-white" aria-label="Seasonal promotion">
        <div className="container-narrow flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-5 py-4 text-center">
          <Sparkles size={16} className="text-beige-200" aria-hidden="true" />
          <p className="text-xs sm:text-sm tracking-[0.12em] uppercase text-white">
            The Festive Edit is here
          </p>
          <span className="hidden sm:block h-4 w-px bg-white/30" aria-hidden="true" />
          <p className="text-xs text-white">Complimentary shipping on orders over ₹999</p>
          <Link href="/shop?collection=the-festive-edit" className="text-xs text-white uppercase tracking-wider underline underline-offset-4 hover:text-beige-200">
            Shop now
          </Link>
        </div>
      </section>

      {/* ── Trust Bar ──────────────────────────────────────── */}
      <section className="bg-ivory border-y border-taupe" id="trust-bar">
        <div className="container-narrow py-6 lg:py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { icon: Truck, text: 'Free Shipping Over ₹999' },
              { icon: Shield, text: 'Authentic Handcrafted' },
              { icon: Undo2, text: 'Easy 7-Day Returns' },
              { icon: Sparkles, text: 'Premium Quality Fabrics' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 justify-center">
                <Icon size={18} className="text-espresso flex-shrink-0" />
                <span className="text-xs tracking-wider uppercase text-charcoal-800 font-medium">
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HomeProductSections />

      <HomeCategories />

      {/* ── Shop by Occasion ──────────────────────────────── */}
      <section className="section-padding bg-beige-100" id="shop-by-occasion">
        <div className="container-narrow">
          <div className="text-center mb-10">
            <p className="text-xs tracking-[0.15em] uppercase text-muted font-medium mb-2">
              Dress for Every Moment
            </p>
            <h2 className="font-serif text-2xl lg:text-3xl text-charcoal">Shop by Occasion</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {occasions.map((occ) => (
              <Link
                key={occ.name}
                href={occ.href}
                className="group block"
              >
                <div className="aspect-[4/5] bg-beige-300 relative overflow-hidden mb-3 flex items-center justify-center">
                  <p className="font-serif text-lg text-muted italic text-center px-4">{occ.name}</p>
                  <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/10 transition-colors duration-300" />
                </div>
                <h3 className="text-xs tracking-[0.1em] uppercase text-charcoal font-sans font-semibold text-center group-hover:text-espresso transition-colors">
                  {occ.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Collections ──────────────────────────── */}
      <section className="section-padding bg-ivory" id="featured-collections">
        <div className="container-narrow">
          <div className="text-center mb-10">
            <p className="text-xs tracking-[0.15em] uppercase text-muted font-medium mb-2">
              Curated
            </p>
            <h2 className="font-serif text-2xl lg:text-3xl text-charcoal">Featured Collections</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoCollections.filter(c => c.isActive).slice(0, 3).map((collection) => (
              <Link
                key={collection.id}
                href={`/shop?collection=${collection.slug}`}
                className="group block"
              >
                <div className="aspect-[4/3] bg-beige-300 relative overflow-hidden mb-4 flex items-center justify-center">
                  <div className="text-center px-6">
                    <p className="font-serif text-2xl text-muted/70 italic mb-2">{collection.name}</p>
                    <p className="text-xs text-muted/50">{collection.description}</p>
                  </div>
                  <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/5 transition-colors duration-300" />
                </div>
                <h3 className="text-sm tracking-[0.05em] uppercase text-charcoal font-sans font-semibold group-hover:text-espresso transition-colors">
                  {collection.name}
                </h3>
                <p className="text-xs text-muted mt-1 line-clamp-1">{collection.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Brand Story ───────────────────────────────────── */}
      <section className="section-padding bg-charcoal text-white" id="brand-story">
        <div className="container-narrow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-white font-medium mb-4">
                Our Story
              </p>
              <h2 className="font-serif text-3xl lg:text-4xl text-white leading-snug mb-6">
                Rooted in heritage,
                <br />
                <span className="italic">designed for today</span>
              </h2>
              <p className="text-sm text-white leading-relaxed mb-4">
                LADDI was born from a simple belief: that India&apos;s extraordinary textile traditions
                deserve a contemporary voice. We work directly with artisan communities across the
                country — from Lucknow&apos;s Chikankari embroiderers to Jaipur&apos;s block-print masters —
                to create clothing that feels both deeply familiar and refreshingly modern.
              </p>
              <p className="text-sm text-white leading-relaxed mb-8">
                Every piece in our collection tells a story of skilled hands, time-honoured
                techniques, and a commitment to quality that fast fashion simply cannot match.
              </p>
              <Link href="/shop" className="btn bg-espresso text-white hover:bg-espresso/80">
                Read Our Story
                <ArrowRight size={14} />
              </Link>
            </div>
            <div className="relative aspect-[4/5] bg-charcoal-800 overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1000&q=85"
                alt="Textile craftsmanship detail in warm neutral tones"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-charcoal/20" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Fashion Journal ────────────────────────────────── */}
      <section className="section-padding bg-ivory" id="fashion-journal">
        <div className="container-narrow">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs tracking-[0.15em] uppercase text-muted font-medium mb-2">
                Stories & Style
              </p>
              <h2 className="font-serif text-2xl lg:text-3xl text-charcoal">Fashion Journal</h2>
            </div>
            <Link href="/shop" className="btn btn-ghost text-xs hidden sm:flex">
              Read All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {journalEntries.map((entry, index) => (
              <Link key={index} href={entry.href} className="group block">
                <div className="aspect-[4/3] bg-beige-200 mb-4 flex items-center justify-center">
                  <p className="text-xs text-muted/50 tracking-wider uppercase">Journal Image</p>
                </div>
                <p className="text-xs text-espresso tracking-[0.1em] uppercase font-medium mb-2">
                  {entry.category}
                </p>
                <h3 className="text-base font-serif text-charcoal leading-snug mb-2 group-hover:text-espresso transition-colors">
                  {entry.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed line-clamp-2">
                  {entry.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ────────────────────────────────────── */}
      <Newsletter />
    </>
  );
}
