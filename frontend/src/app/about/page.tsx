import Image from 'next/image';
import ScrollReveal from '@/components/ui/ScrollReveal';

export const metadata = {
    title: 'Our Story',
    description: 'The heritage and philosophy behind Tadkedar North Indian Family Restaurant — family, hygiene, quality, and ambience.',
};

export default function AboutPage() {
    return (
        <>
            {/* Hero */}
            <section className="relative pt-32 pb-20 px-6 bg-charcoal overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/kitchen.png"
                        alt="Our kitchen"
                        fill
                        className="object-cover opacity-20"
                        sizes="100vw"
                        quality={60}
                        priority
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-charcoal/80 to-charcoal z-10" />
                <div className="relative z-20 max-w-3xl mx-auto text-center">
                    <p className="text-xs tracking-[0.3em] uppercase text-gold mb-4 animate-fade-in-up">
                        Since the Beginning
                    </p>
                    <h1 className="font-serif text-4xl md:text-6xl text-ivory mb-6 animate-fade-in-up-delay-1">
                        Our Story
                    </h1>
                    <p className="text-ivory/50 text-lg animate-fade-in-up-delay-2">
                        A family&apos;s passion for authentic North Indian cuisine
                    </p>
                </div>
            </section>

            {/* Heritage Section */}
            <section className="py-24 lg:py-36 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <ScrollReveal direction="left" duration={900}>
                            <div className="relative aspect-[4/5] overflow-hidden">
                                <Image
                                    src="/images/hero.png"
                                    alt="Tadkedar restaurant dining"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    quality={80}
                                />
                                <div className="absolute inset-4 border border-ivory/20 pointer-events-none" />
                            </div>
                        </ScrollReveal>

                        <div>
                            <ScrollReveal delay={100}>
                                <p className="text-xs tracking-[0.3em] uppercase text-gold mb-5">
                                    Our Heritage
                                </p>
                            </ScrollReveal>
                            <ScrollReveal delay={200}>
                                <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-8 leading-tight">
                                    A Legacy of<br />Authentic Flavors
                                </h2>
                            </ScrollReveal>
                            <ScrollReveal delay={300}>
                                <p className="text-stone text-lg leading-relaxed mb-6">
                                    Tadkedar was born from a simple belief — that great food should feel like home.
                                    Our journey began in the heart of Gadag-Betigeri, where the rich culinary
                                    traditions of North India found a new address.
                                </p>
                            </ScrollReveal>
                            <ScrollReveal delay={400}>
                                <p className="text-stone text-lg leading-relaxed">
                                    Every recipe we serve carries the warmth of generations — a careful balance
                                    of spices, time-honored techniques, and the kind of attention that turns
                                    a meal into a memory.
                                </p>
                            </ScrollReveal>
                        </div>
                    </div>
                </div>
            </section>

            {/* Full-width Image */}
            <ScrollReveal duration={1000}>
                <section className="relative h-[40vh] lg:h-[50vh] overflow-hidden">
                    <Image
                        src="/images/ambience.png"
                        alt="Dining ambience"
                        fill
                        className="object-cover"
                        sizes="100vw"
                        quality={75}
                    />
                    <div className="absolute inset-0 bg-charcoal/30" />
                </section>
            </ScrollReveal>

            {/* Philosophy */}
            <section className="py-24 lg:py-36 px-6 bg-white">
                <div className="max-w-5xl mx-auto">
                    <ScrollReveal>
                        <div className="text-center mb-20">
                            <p className="text-xs tracking-[0.3em] uppercase text-gold mb-5">
                                The Tadkedar Way
                            </p>
                            <h2 className="font-serif text-3xl md:text-5xl text-charcoal">
                                What We Believe In
                            </h2>
                        </div>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
                        {[
                            {
                                title: 'Family First',
                                description:
                                    'We are a family restaurant, built for families. Every table, every dish, every conversation is designed to bring people closer together.',
                                icon: '◈',
                            },
                            {
                                title: 'Impeccable Hygiene',
                                description:
                                    'From our kitchen to your table, we maintain the highest standards of cleanliness. Your health and comfort are non-negotiable.',
                                icon: '◇',
                            },
                            {
                                title: 'Quality Ingredients',
                                description:
                                    'We source the freshest produce and finest spices. No shortcuts, no compromises — just honest, wholesome cooking.',
                                icon: '◆',
                            },
                            {
                                title: 'Calm Ambience',
                                description:
                                    'Our space is designed for peace. Minimal decor, warm lighting, soft tones — a quiet escape from the everyday.',
                                icon: '○',
                            },
                        ].map((pillar, i) => (
                            <ScrollReveal key={pillar.title} delay={i * 120}>
                                <div className="group p-8 border border-border hover:border-gold/30 transition-all duration-500">
                                    <span className="text-gold text-2xl block mb-5">{pillar.icon}</span>
                                    <h3 className="font-serif text-xl text-charcoal mb-4 group-hover:text-gold transition-colors duration-300">
                                        {pillar.title}
                                    </h3>
                                    <p className="text-stone leading-relaxed">{pillar.description}</p>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Closing */}
            <section className="py-24 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <ScrollReveal>
                        <p className="text-xs tracking-[0.3em] uppercase text-gold mb-6">
                            Our Promise
                        </p>
                    </ScrollReveal>
                    <ScrollReveal delay={100}>
                        <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-8 leading-tight">
                            Every Dish, Crafted with Intention
                        </h2>
                    </ScrollReveal>
                    <ScrollReveal delay={200}>
                        <p className="text-stone text-lg leading-relaxed">
                            We don&apos;t just serve food — we create experiences. At Tadkedar, every ingredient
                            is chosen, every spice is measured, and every plate is presented with the care
                            it deserves. That&apos;s our commitment to you and your family.
                        </p>
                    </ScrollReveal>
                </div>
            </section>
        </>
    );
}
