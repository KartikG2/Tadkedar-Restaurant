'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { siteConfig } from '@/lib/config';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Menu & Order' },
    { href: '/reservations', label: 'Reservations' },
    { href: '/about', label: 'About' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                ? 'bg-ivory/95 backdrop-blur-md shadow-sm border-b border-border'
                : 'bg-transparent'
                }`}
        >
            <nav className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="font-serif text-2xl tracking-wide transition-colors duration-300"
                        style={{ color: isScrolled ? '#1F1F1F' : '#FAF7F2' }}
                    >
                        {siteConfig.name}
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm tracking-widest uppercase transition-colors duration-300 hover:text-gold ${isScrolled ? 'text-charcoal-muted' : 'text-ivory/80'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2 transition-colors duration-300"
                        aria-label="Toggle menu"
                        style={{ color: isScrolled ? '#1F1F1F' : '#FAF7F2' }}
                    >
                        <div className="w-6 flex flex-col gap-1.5">
                            <span
                                className={`block h-px w-full transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-[4.5px]' : ''
                                    }`}
                                style={{ backgroundColor: 'currentColor' }}
                            />
                            <span
                                className={`block h-px w-full transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''
                                    }`}
                                style={{ backgroundColor: 'currentColor' }}
                            />
                            <span
                                className={`block h-px w-full transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-[4.5px]' : ''
                                    }`}
                                style={{ backgroundColor: 'currentColor' }}
                            />
                        </div>
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div
                className={`lg:hidden absolute top-full left-0 right-0 bg-ivory/98 backdrop-blur-md border-b border-border transition-all duration-500 overflow-hidden ${isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="px-6 py-8 space-y-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block text-sm tracking-widest uppercase text-charcoal-muted hover:text-gold transition-colors duration-300"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </header>
    );
}
