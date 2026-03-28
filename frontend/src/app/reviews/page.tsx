import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Reviews',
    description:
        'Read what our guests say about Tadkedar. Rated 4.4 stars with 408 reviews.',
};

const reviews = [
    {
        name: 'Priya Kulkarni',
        rating: 5,
        text: 'Absolutely wonderful experience. The paneer butter masala is the best I\'ve had in Gadag. Clean restaurant, warm service, and the flavors are authentic. My family\'s new favorite.',
        date: '2 weeks ago',
    },
    {
        name: 'Raghavendra S.',
        rating: 5,
        text: 'Finally a restaurant in Gadag that focuses on quality. The dal makhani was rich and perfectly spiced. Will definitely be coming back with family.',
        date: '1 month ago',
    },
    {
        name: 'Anita Desai',
        rating: 4,
        text: 'Very clean and hygienic. The food is fresh and tasty. Love the calm atmosphere — it\'s not too noisy, perfect for a family dinner. The garlic naan was excellent.',
        date: '3 weeks ago',
    },
    {
        name: 'Mahesh P.',
        rating: 5,
        text: 'Best North Indian food in the area. The mushroom fried rice is a must-try. Staff is polite and attentive. Highly recommended for family outings.',
        date: '1 month ago',
    },
    {
        name: 'Sunita Hegde',
        rating: 4,
        text: 'We celebrated our anniversary here and it was lovely. The ambience is peaceful, food is delicious, and everything felt very well-maintained. Great experience overall.',
        date: '2 months ago',
    },
    {
        name: 'Vijay Kumar',
        rating: 5,
        text: 'From the moment you walk in, you feel the difference. No loud music, clean tables, friendly staff. The malai kofta was absolutely divine.',
        date: '1 month ago',
    },
];

function ReviewJsonLd() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Restaurant',
        name: 'Tadkedar North Indian Family Restaurant',
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: 4.4,
            reviewCount: 408,
            bestRating: 5,
        },
        review: reviews.map((r) => ({
            '@type': 'Review',
            author: { '@type': 'Person', name: r.name },
            reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
            reviewBody: r.text,
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}

export default function ReviewsPage() {
    return (
        <>
            <ReviewJsonLd />

            {/* Header */}
            <section className="pt-32 pb-16 lg:pt-40 lg:pb-20 px-6 bg-charcoal">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-xs tracking-[0.3em] uppercase text-gold mb-4">Testimonials</p>
                    <h1 className="font-serif text-4xl md:text-6xl text-ivory mb-6">Guest Reviews</h1>
                    <div className="flex items-center justify-center gap-3 mt-8">
                        <div className="flex gap-1">
                            {[1, 2, 3, 4].map((i) => (
                                <span key={i} className="text-gold text-lg">★</span>
                            ))}
                            <span className="text-gold/40 text-lg">★</span>
                        </div>
                        <span className="text-ivory/50 text-sm">4.4 out of 5 · 408 reviews</span>
                    </div>
                </div>
            </section>

            <section className="py-16 lg:py-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {reviews.map((review, i) => (
                            <div
                                key={i}
                                className="p-8 bg-white border border-border hover:border-stone-light transition-all duration-300"
                            >
                                <div className="flex gap-1 mb-4">
                                    {Array.from({ length: 5 }).map((_, j) => (
                                        <span
                                            key={j}
                                            className={`text-sm ${j < review.rating ? 'text-gold' : 'text-border'}`}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <p className="text-stone text-sm leading-relaxed mb-6">
                                    &ldquo;{review.text}&rdquo;
                                </p>
                                <div className="flex justify-between items-center">
                                    <p className="text-charcoal text-sm font-medium">{review.name}</p>
                                    <p className="text-stone-light text-xs">{review.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
