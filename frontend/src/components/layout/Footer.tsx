import Link from 'next/link';
import { siteConfig } from '@/lib/config';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-charcoal text-ivory/70 pb-24 lg:pb-0">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <h3 className="font-serif text-2xl text-ivory mb-4">{siteConfig.name}</h3>
                        <p className="text-sm leading-relaxed text-ivory/50">
                            {siteConfig.description}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-xs tracking-[0.2em] uppercase text-ivory/40 mb-6">
                            Navigate
                        </h4>
                        <ul className="space-y-3">
                            {[
                                { href: '/menu', label: 'Our Menu' },
                                { href: '/order', label: 'Order Online' },
                                { href: '/reservations', label: 'Reserve a Table' },
                                { href: '/about', label: 'Our Story' },
                                { href: '/gallery', label: 'Gallery' },
                                { href: '/contact', label: 'Contact' },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-ivory/50 hover:text-gold transition-colors duration-300"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-xs tracking-[0.2em] uppercase text-ivory/40 mb-6">
                            Contact
                        </h4>
                        <div className="space-y-3 text-sm text-ivory/50">
                            <p>{siteConfig.address.street}</p>
                            <p>{siteConfig.address.landmark}</p>
                            <p>
                                {siteConfig.address.city}, {siteConfig.address.state} {siteConfig.address.zip}
                            </p>
                            <p className="pt-2">
                                <a
                                    href={`tel:${siteConfig.contact.phoneRaw}`}
                                    className="hover:text-gold transition-colors duration-300"
                                >
                                    {siteConfig.contact.phone}
                                </a>
                            </p>
                        </div>
                    </div>

                    {/* Hours */}
                    <div>
                        <h4 className="text-xs tracking-[0.2em] uppercase text-ivory/40 mb-6">
                            Hours
                        </h4>
                        <div className="space-y-2 text-sm text-ivory/50">
                            <div className="flex justify-between">
                                <span>Mon — Sun</span>
                                <span>{siteConfig.hours.monday}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-16 pt-8 border-t border-ivory/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-ivory/30">
                        © {currentYear} {siteConfig.fullName}. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link
                            href="/admin/login"
                            className="text-xs text-ivory/20 hover:text-ivory/40 transition-colors duration-300"
                        >
                            Admin
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
