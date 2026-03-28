'use client';

import Link from 'next/link';

export default function MobileCTABar() {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-charcoal/95 backdrop-blur-md border-t border-ivory/10">
            <div className="flex">
                <Link
                    href="/reservations"
                    className="flex-1 py-4 text-center text-xs tracking-[0.15em] uppercase text-ivory/80 hover:text-ivory transition-colors duration-300 border-r border-ivory/10"
                >
                    Reserve a Table
                </Link>
                <Link
                    href="/menu"
                    className="flex-1 py-4 text-center text-xs tracking-[0.15em] uppercase text-gold hover:text-gold-light transition-colors duration-300"
                >
                    Order Online
                </Link>
            </div>
        </div>
    );
}
