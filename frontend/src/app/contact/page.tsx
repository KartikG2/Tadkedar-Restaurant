import { Metadata } from 'next';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
    title: 'Contact',
    description:
        'Get in touch with Tadkedar. Visit us at Gadag-Betigeri, call us, or send a WhatsApp message.',
};

export default function ContactPage() {
    return (
        <>
            {/* Header */}
            <section className="pt-32 pb-16 lg:pt-40 lg:pb-20 px-6 bg-charcoal">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-xs tracking-[0.3em] uppercase text-gold mb-4">Reach Us</p>
                    <h1 className="font-serif text-4xl md:text-6xl text-ivory mb-6">Contact</h1>
                    <p className="text-ivory/50 text-lg max-w-xl mx-auto">
                        We&apos;d love to hear from you
                    </p>
                </div>
            </section>

            <section className="py-16 lg:py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Info */}
                        <div className="space-y-12">
                            {/* Address */}
                            <div>
                                <h2 className="text-xs tracking-[0.2em] uppercase text-gold mb-4">Address</h2>
                                <p className="text-charcoal text-lg leading-relaxed">
                                    {siteConfig.address.street}<br />
                                    {siteConfig.address.landmark}<br />
                                    {siteConfig.address.area}<br />
                                    {siteConfig.address.city}, {siteConfig.address.state} {siteConfig.address.zip}
                                </p>
                                <p className="text-stone text-sm mt-2">
                                    Plus Code: {siteConfig.address.plusCode}
                                </p>
                            </div>

                            {/* Phone */}
                            <div>
                                <h2 className="text-xs tracking-[0.2em] uppercase text-gold mb-4">Phone</h2>
                                <a
                                    href={`tel:${siteConfig.contact.phoneRaw}`}
                                    className="text-charcoal text-lg hover:text-gold transition-colors duration-300"
                                >
                                    {siteConfig.contact.phone}
                                </a>
                            </div>

                            {/* WhatsApp */}
                            <div>
                                <h2 className="text-xs tracking-[0.2em] uppercase text-gold mb-4">WhatsApp</h2>
                                <a
                                    href={`https://wa.me/${siteConfig.contact.whatsapp.replace('+', '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-3 text-charcoal text-lg hover:text-gold transition-colors duration-300"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    Send a Message
                                </a>
                            </div>

                            {/* Opening Hours */}
                            <div>
                                <h2 className="text-xs tracking-[0.2em] uppercase text-gold mb-4">
                                    Opening Hours
                                </h2>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-charcoal">
                                        <span>Monday — Sunday</span>
                                        <span>{siteConfig.hours.monday}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <a
                                    href={`tel:${siteConfig.contact.phoneRaw}`}
                                    className="flex-1 py-4 text-center bg-charcoal text-ivory text-sm tracking-[0.15em] uppercase hover:bg-charcoal-light transition-colors duration-300"
                                >
                                    Call Now
                                </a>
                                <a
                                    href={`https://wa.me/${siteConfig.contact.whatsapp.replace('+', '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 py-4 text-center border border-charcoal text-charcoal text-sm tracking-[0.15em] uppercase hover:bg-charcoal hover:text-ivory transition-all duration-300"
                                >
                                    WhatsApp
                                </a>
                            </div>
                        </div>

                        {/* Map Section — styled with label */}
                        <div className="space-y-0">
                            {/* Map Label / Header */}
                            <div className="bg-charcoal px-6 py-5">
                                <div className="flex items-start gap-4">
                                    {/* Pin Icon */}
                                    <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-serif text-lg text-ivory mb-1">{siteConfig.name}</h3>
                                        <p className="text-ivory/40 text-xs leading-relaxed">
                                            {siteConfig.address.street}<br />
                                            {siteConfig.address.landmark}, {siteConfig.address.city}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Map iframe */}
                            <div className="aspect-[4/4] bg-ivory-warm border border-border border-t-0 overflow-hidden relative">
                                <iframe
                                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=Tadkedar+Restaurant,Gadag-Betigeri,Karnataka,India&zoom=17&maptype=roadmap`}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Tadkedar Restaurant Location"
                                />
                            </div>

                            {/* Get Directions */}
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=Tadkedar+Restaurant+Gadag-Betigeri+Karnataka`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block bg-gold text-center py-4 text-white text-sm tracking-[0.15em] uppercase hover:bg-gold-dark transition-colors duration-300"
                            >
                                Get Directions →
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
