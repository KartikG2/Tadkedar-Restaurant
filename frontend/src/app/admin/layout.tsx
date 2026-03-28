'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

const sidebarLinks = [
    { href: '/admin', label: 'Overview', icon: '📊' },
    { href: '/admin/menu', label: 'Menu Items', icon: '🍽️' },
    { href: '/admin/orders', label: 'Orders', icon: '📦' },
    { href: '/admin/reservations', label: 'Reservations', icon: '📅' },
    { href: '/admin/history', label: 'History', icon: '📜' },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const isLoginPage = pathname === '/admin/login';

    // Check authentication on mount
    useEffect(() => {
        if (!isLoginPage) {
            const token = localStorage.getItem('admin_token');
            if (!token) {
                router.push('/admin/login');
            } else {
                setIsAuthenticated(true);
            }
        }
    }, [isLoginPage, router]);

    // Login page — no sidebar, no header, elegant dark theme
    if (isLoginPage) {
        return (
            <div className="min-h-screen bg-charcoal flex items-center justify-center px-4">
                {children}
            </div>
        );
    }

    const handleLogout = async () => {
        try {
            await apiFetch('/api/admin/logout', { method: 'POST' });
        } catch (error) {
            console.error('Logout error:', error);
        }
        localStorage.removeItem('admin_token');
        window.location.href = '/admin/login';
    };

    return (
        <div className="min-h-screen bg-ivory-warm font-sans text-charcoal">
            {/* Admin Top Bar */}
            <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-charcoal border-b border-border-dark flex items-center justify-between px-6 lg:px-8 shadow-sm">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin"
                        className="font-serif text-xl text-ivory tracking-wide"
                    >
                        Tadkedar <span className="text-gold text-sm font-sans font-medium ml-1">Admin</span>
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    <Link
                        href="/"
                        className="text-sm text-stone-light hover:text-gold transition-colors duration-200"
                        target="_blank"
                    >
                        View Site ↗
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="text-sm text-stone-light hover:text-red-400 transition-colors duration-200 cursor-pointer"
                    >
                        Sign Out
                    </button>
                </div>
            </header>

            {/* Desktop Sidebar */}
            <aside className="fixed top-16 left-0 bottom-0 w-60 bg-charcoal-light border-r border-border-dark hidden lg:block overflow-y-auto">
                <nav className="p-4 space-y-1">
                    {sidebarLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-none text-sm transition-all duration-200 border-l-2 ${isActive
                                    ? 'bg-gold/10 text-gold border-gold font-medium'
                                    : 'border-transparent text-stone-light hover:bg-charcoal-muted hover:text-ivory'
                                    }`}
                            >
                                <span>{link.icon}</span>
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Mobile nav */}
            <div className="lg:hidden fixed top-16 left-0 right-0 z-40 bg-charcoal-light border-b border-border-dark overflow-x-auto">
                <div className="flex min-w-max px-4 py-2 gap-1">
                    {sidebarLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-4 py-2 text-xs tracking-wider uppercase whitespace-nowrap transition-all duration-200 border-b-2 ${isActive
                                    ? 'bg-gold/10 text-gold border-gold font-medium'
                                    : 'border-transparent text-stone-light hover:text-ivory hover:bg-charcoal-muted'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:ml-60 pt-[112px] lg:pt-16">
                <div className="pt-0 lg:pt-0">
                    <div className="max-w-6xl mx-auto p-6 lg:p-10">
                        {children}
                    </div>
                </div>
            </div>

            {/* Mobile spacer for mobile nav */}
            <div className="lg:hidden h-12" />
        </div>
    );
}
