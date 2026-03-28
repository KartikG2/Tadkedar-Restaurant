import Image from 'next/image';
import ScrollReveal from '@/components/ui/ScrollReveal';

export const metadata = {
    title: 'Gallery',
    description: 'A visual journey through the Tadkedar dining experience — our dishes, ambience, and moments.',
};

const galleryItems = [
    { src: '/images/hero.png', alt: 'Restaurant interior at night', label: 'The Dining Room', span: 'md:col-span-2 md:row-span-2' },
    { src: '/images/paneer-masala.png', alt: 'Paneer Butter Masala', label: 'Paneer Butter Masala', span: '' },
    { src: '/images/starters.png', alt: 'Starters platter', label: 'Starter Selection', span: '' },
    { src: '/images/fried-rice.png', alt: 'Mushroom fried rice', label: 'Mushroom Fried Rice', span: 'md:col-span-2' },
    { src: '/images/kitchen.png', alt: 'Kitchen preparation', label: 'From Our Kitchen', span: '' },
    { src: '/images/naan.png', alt: 'Artisan breads', label: 'Artisan Breads', span: '' },
    { src: '/images/dal-makhani.png', alt: 'Dal Makhani', label: 'Dal Makhani', span: '' },
    { src: '/images/ambience.png', alt: 'Table setting', label: 'Quiet Elegance', span: 'md:col-span-2' },
];

export default function GalleryPage() {
    return (
        <>
            {/* Hero */}
            <section className="relative pt-32 pb-20 px-6 bg-charcoal overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/ambience.png"
                        alt="Gallery"
                        fill
                        className="object-cover opacity-15"
                        sizes="100vw"
                        quality={60}
                        priority
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-charcoal/80 to-charcoal z-10" />
                <div className="relative z-20 max-w-3xl mx-auto text-center">
                    <p className="text-xs tracking-[0.3em] uppercase text-gold mb-4 animate-fade-in-up">
                        Visual Journey
                    </p>
                    <h1 className="font-serif text-4xl md:text-6xl text-ivory mb-6 animate-fade-in-up-delay-1">
                        Gallery
                    </h1>
                    <p className="text-ivory/50 text-lg animate-fade-in-up-delay-2">
                        Moments from our kitchen and dining room
                    </p>
                </div>
            </section>

            {/* Gallery Grid */}
            <section className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {galleryItems.map((item, i) => (
                        <ScrollReveal
                            key={item.alt}
                            delay={i * 100}
                            duration={800}
                            className={item.span}
                        >
                            <div className="group relative aspect-square overflow-hidden cursor-pointer">
                                <Image
                                    src={item.src}
                                    alt={item.alt}
                                    fill
                                    className="object-cover transition-all duration-700 group-hover:scale-105"
                                    sizes={item.span.includes('col-span-2') ? '66vw' : '33vw'}
                                    quality={80}
                                />
                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/40 transition-all duration-500 flex items-end">
                                    <div className="p-6 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                        <p className="text-ivory text-sm tracking-wider">{item.label}</p>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </section>
        </>
    );
}
