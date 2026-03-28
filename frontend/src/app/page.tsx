import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/lib/config';
import ScrollReveal from '@/components/ui/ScrollReveal';

function RestaurantJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['Restaurant', 'LocalBusiness'],
    name: siteConfig.fullName,
    description: siteConfig.description,
    url: process.env.NEXT_PUBLIC_SITE_URL,
    telephone: siteConfig.contact.phoneRaw,
    servesCuisine: siteConfig.cuisine,
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.state,
      postalCode: siteConfig.address.zip,
      addressCountry: siteConfig.address.country,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: siteConfig.rating,
      reviewCount: siteConfig.reviewCount,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday',
        'Friday', 'Saturday', 'Sunday',
      ],
      opens: '11:00',
      closes: '22:30',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function HomePage() {
  return (
    <>
      <RestaurantJsonLd />

      {/* ═══ HERO — Full viewport, cinematic fine-dining ═══ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero.png"
            alt="Tadkedar restaurant interior"
            fill
            priority
            className="object-cover"
            sizes="100vw"
            quality={90}
          />
        </div>

        {/* Gradient Overlay — subtle dark for readability, image stays visible */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.65) 100%)',
          }}
        />

        {/* Hero Content — centered with balanced spacing */}
        <div className="relative z-20 text-center px-6 sm:px-8 max-w-4xl mx-auto flex flex-col items-center justify-center">
          {/* Rating Badge */}
          <div className="animate-fade-in-up mb-12 md:mb-14">
            <div className="inline-flex items-center gap-3 px-6 py-2.5 border border-white/10 rounded-full backdrop-blur-sm bg-white/5">
              <span className="text-gold text-sm">★</span>
              <span className="text-[#f5f5f5]/50 text-xs tracking-[0.2em] uppercase font-sans">
                {siteConfig.rating} · {siteConfig.reviewCount} reviews
              </span>
            </div>
          </div>

          {/* Decorative line above title */}
          <div className="animate-fade-in-up w-12 h-px bg-gold/40 mb-8 md:mb-10" />

          {/* Restaurant Name — Playfair Display, luxury sizing */}
          <h1
            className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-[8.5rem] mb-6 md:mb-8 animate-fade-in-up leading-[0.9] tracking-[0.02em] font-medium"
            style={{
              color: '#f5f5f5',
              textShadow: '0 2px 20px rgba(0,0,0,0.4), 0 4px 40px rgba(0,0,0,0.2)',
            }}
          >
            {siteConfig.name}
          </h1>

          {/* Decorative gold divider */}
          <div className="animate-fade-in-up-delay-1 flex items-center gap-4 mb-6 md:mb-8">
            <div className="w-10 h-px bg-gold/50" />
            <span className="text-gold/60 text-xs">✦</span>
            <div className="w-10 h-px bg-gold/50" />
          </div>

          {/* Tagline — Cormorant Garamond, elegant thin styling */}
          <p
            className="animate-fade-in-up-delay-1 text-base sm:text-lg md:text-xl tracking-[0.35em] uppercase mb-16 md:mb-20 font-light"
            style={{
              fontFamily: 'var(--font-elegant)',
              color: '#f5f5f5ff',
              textShadow: '0 1px 10px rgba(0,0,0,0.3)',
            }}
          >
            {siteConfig.tagline}
          </p>

          {/* CTA Buttons — gold primary, transparent secondary */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 animate-fade-in-up-delay-2 w-full sm:w-auto">
            <Link
              href="/reservations"
              className="group relative px-10 sm:px-14 py-4 sm:py-[18px] text-xs sm:text-sm tracking-[0.2em] uppercase font-medium transition-all duration-500 min-w-[220px] sm:min-w-[260px] overflow-hidden"
              style={{ backgroundColor: '#c9a96a', color: '#1F1F1F' }}
            >
              <span className="relative z-10 transition-colors duration-500 group-hover:text-white">
                Reserve a Table
              </span>
              <span className="absolute inset-0 bg-charcoal scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </Link>
            <Link
              href="/menu"
              className="px-10 sm:px-14 py-4 sm:py-[18px] border border-white/15 text-[#f5f5f5]/60 text-xs sm:text-sm tracking-[0.2em] uppercase transition-all duration-500 min-w-[220px] sm:min-w-[260px] hover:border-gold/60 hover:text-gold backdrop-blur-sm hover:shadow-[0_0_30px_rgba(201,169,106,0.1)]"
            >
              Explore Menu
            </Link>
          </div>
        </div>


        {/* <div className="absolute bottom-10 sm:bottom-12 left-1/2 -translate-x-1/2 z-20">
          <div className="flex flex-col items-center gap-3">
            <span className="text-[#f5f5f5]/70 text-[9px] tracking-[0.3em] uppercase" style={{ fontFamily: 'var(--font-sans)' }}>
              Scroll
            </span>
            <div className="w-px h-14 bg-gradient-to-b from-[#f5f5f5]/70 to-transparent animate-pulse" />
          </div>
        </div> */}
      </section>

      {/* ═══ SPACER ═══ */}
      <div className="h-6 bg-ivory" />

      {/* ═══ PHILOSOPHY — Generous whitespace ═══ */}
      <section className="py-32 lg:py-44 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-center">
            <ScrollReveal direction="left" duration={900}>
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src="/images/kitchen.png"
                  alt="Fresh food preparation at Tadkedar"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={85}
                />
                <div className="absolute inset-6 border border-gold/20 pointer-events-none" />
              </div>
            </ScrollReveal>

            <div className="lg:pl-8">
              <ScrollReveal delay={100}>
                <p className="text-xs tracking-[0.4em] uppercase text-gold mb-8">
                  Our Philosophy
                </p>
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal mb-10 leading-[1.1]">
                  Where Tradition<br className="hidden md:block" /> Meets Elegance
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={300}>
                <p className="text-stone text-lg leading-[1.9] mb-10 max-w-lg">
                  At Tadkedar, every dish tells a story of heritage. We bring the rich, aromatic
                  flavors of North India to your table — prepared with the finest ingredients,
                  impeccable hygiene, and genuine care for your family&apos;s dining experience.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={400}>
                <Link
                  href="/about"
                  className="inline-block text-sm tracking-[0.2em] uppercase text-charcoal border-b border-charcoal/20 pb-2 hover:border-gold hover:text-gold transition-all duration-500"
                >
                  Our Story →
                </Link>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ELEGANT DIVIDER ═══ */}
      <ScrollReveal>
        <div className="flex items-center justify-center gap-4 py-4">
          <div className="w-16 h-px bg-border" />
          <span className="text-gold text-xs">✦</span>
          <div className="w-16 h-px bg-border" />
        </div>
      </ScrollReveal>

      {/* ═══ SIGNATURE DISHES — Spacious 3 columns ═══ */}
      <section className="py-32 lg:py-44 px-8">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-24">
              <p className="text-xs tracking-[0.4em] uppercase text-gold mb-6">
                From Our Kitchen
              </p>
              <h2 className="font-serif text-4xl md:text-6xl text-charcoal mb-4">
                Signature Dishes
              </h2>
              <p className="text-stone text-base max-w-md mx-auto mt-6">
                Crafted with heritage recipes and the finest ingredients
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {[
              {
                name: 'Mushroom Fried Rice',
                description: 'Aromatic basmati rice wok-tossed with fresh mushrooms and our signature spice blend.',
                price: '₹180',
                category: 'Rice',
                image: '/images/fried-rice.png',
              },
              {
                name: 'Starters Platter',
                description: 'Crispy golden corn, paneer tikka, and gobi manchurian — a trio of perfection.',
                price: '₹160',
                category: 'Starters',
                image: '/images/starters.png',
              },
              {
                name: 'Paneer Butter Masala',
                description: 'Soft cottage cheese in a rich, velvety tomato-butter gravy with aromatic spices.',
                price: '₹220',
                category: 'Main Course',
                image: '/images/paneer-masala.png',
              },
            ].map((dish, i) => (
              <ScrollReveal key={dish.name} delay={i * 200} duration={800}>
                <div className="group overflow-hidden">
                  <div className="relative aspect-[4/3] overflow-hidden mb-6">
                    <Image
                      src={dish.image}
                      alt={dish.name}
                      fill
                      className="object-cover transition-transform duration-[1s] group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      quality={80}
                    />
                  </div>
                  <p className="text-[11px] tracking-[0.3em] uppercase text-gold mb-3">
                    {dish.category}
                  </p>
                  <h3 className="font-serif text-xl text-charcoal mb-3 group-hover:text-gold transition-colors duration-500">
                    {dish.name}
                  </h3>
                  <p className="text-stone text-sm leading-relaxed mb-4">
                    {dish.description}
                  </p>
                  <p className="text-charcoal font-medium text-lg">{dish.price}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={400}>
            <div className="text-center mt-20">
              <Link
                href="/menu"
                className="inline-block px-12 py-4 border border-charcoal text-charcoal text-sm tracking-[0.2em] uppercase hover:bg-charcoal hover:text-ivory transition-all duration-500"
              >
                View Full Menu
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ FULL-WIDTH AMBIENCE IMAGE ═══ */}
      <ScrollReveal duration={1200}>
        <section className="relative h-[60vh] lg:h-[70vh] overflow-hidden">
          <Image
            src="/images/ambience.png"
            alt="Elegant dining ambience at Tadkedar"
            fill
            className="object-cover"
            sizes="100vw"
            quality={85}
          />
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-0 flex items-center justify-center">
            <ScrollReveal delay={300}>
              <div className="text-center px-8">
                <p className="text-ivory/40 text-xs tracking-[0.4em] uppercase mb-4">
                  Experience
                </p>
                <h3 className="font-serif text-3xl md:text-5xl text-ivory/80 leading-tight">
                  A Calm, Private<br />Ambience
                </h3>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </ScrollReveal>

      {/* ═══ FEATURED DISHES — Alternating rows ═══ */}
      <section className="py-32 lg:py-44 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
            <ScrollReveal direction="left">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src="/images/dal-makhani.png"
                  alt="Creamy Dal Makhani"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={85}
                />
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={200}>
              <div className="lg:pl-8">
                <p className="text-xs tracking-[0.4em] uppercase text-gold mb-6">
                  Slow Cooked
                </p>
                <h3 className="font-serif text-3xl md:text-5xl text-charcoal mb-8 leading-tight">
                  Dal Makhani
                </h3>
                <p className="text-stone text-lg leading-[1.9] mb-8 max-w-md">
                  Black lentils simmered overnight in a rich, creamy butter gravy.
                  A crown jewel of North Indian cuisine — comfort in every spoonful.
                </p>
                <p className="text-charcoal text-2xl font-light">₹190</p>
              </div>
            </ScrollReveal>
          </div>

          <div className="h-px bg-border my-24 lg:my-32 max-w-xs mx-auto" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
            <ScrollReveal direction="left" delay={200} className="order-2 md:order-1">
              <div className="lg:pr-8">
                <p className="text-xs tracking-[0.4em] uppercase text-gold mb-6">
                  From the Tandoor
                </p>
                <h3 className="font-serif text-3xl md:text-5xl text-charcoal mb-8 leading-tight">
                  Artisan Breads
                </h3>
                <p className="text-stone text-lg leading-[1.9] mb-8 max-w-md">
                  Freshly baked in our clay tandoor — butter naan, garlic naan, and
                  laccha paratha. The perfect companion to any curry.
                </p>
                <p className="text-charcoal text-2xl font-light">From ₹35</p>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right" className="order-1 md:order-2">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src="/images/naan.png"
                  alt="Freshly baked artisan naan breads"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={85}
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══ CTA BANNER — Cinematic ═══ */}
      <section className="relative py-36 lg:py-48 px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero.png"
            alt="Restaurant atmosphere"
            fill
            className="object-cover"
            sizes="100vw"
            quality={80}
          />
        </div>
        <div className="absolute inset-0 bg-black/70 z-10" />
        <div className="relative z-20 max-w-2xl mx-auto text-center">
          <ScrollReveal>
            <p className="text-xs tracking-[0.4em] uppercase text-gold mb-8">
              Experience
            </p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h2 className="font-serif text-4xl md:text-6xl text-ivory mb-10 leading-tight">
              Your Table<br />Awaits
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="text-ivory/40 text-lg leading-relaxed mb-14 max-w-lg mx-auto">
              Whether it&apos;s a family celebration, a quiet dinner, or a casual meal —
              we&apos;re here to make it memorable.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link
                href="/reservations"
                className="px-12 py-4 bg-ivory text-charcoal text-sm tracking-[0.2em] uppercase hover:bg-gold hover:text-white transition-all duration-500"
              >
                Reserve Now
              </Link>
              <a
                href={`tel:${siteConfig.contact.phoneRaw}`}
                className="px-12 py-4 border border-ivory/15 text-ivory/60 text-sm tracking-[0.2em] uppercase hover:border-gold hover:text-gold transition-all duration-500"
              >
                Call Us
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
