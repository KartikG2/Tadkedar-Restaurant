'use client';

import { useState, useEffect, useCallback } from 'react';

interface Stats {
    orderCount: number;
    pendingOrders: number;
    reservationCount: number;
    pendingReservations: number;
    menuItemCount: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({
        orderCount: 0,
        pendingOrders: 0,
        reservationCount: 0,
        pendingReservations: 0,
        menuItemCount: 0,
    });
    const [loading, setLoading] = useState(true);

    const fetchStats = useCallback(async () => {
        try {
            const [ordersRes, reservationsRes, menuRes] = await Promise.all([
                fetch('/api/orders'),
                fetch('/api/reservations'),
                fetch('/api/menu'),
            ]);

            const orders = ordersRes.ok ? await ordersRes.json() : [];
            const reservations = reservationsRes.ok ? await reservationsRes.json() : [];
            const menu = menuRes.ok ? await menuRes.json() : [];

            setStats({
                orderCount: Array.isArray(orders) ? orders.length : 0,
                pendingOrders: Array.isArray(orders) ? orders.filter((o: any) => o.status === 'Pending').length : 0,
                reservationCount: Array.isArray(reservations) ? reservations.length : 0,
                pendingReservations: Array.isArray(reservations) ? reservations.filter((r: any) => r.status === 'Pending').length : 0,
                menuItemCount: Array.isArray(menu) ? menu.length : 0,
            });
        } catch {
            // Ignore fetch errors during polling
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    // Real-time polling every 5 seconds
    useEffect(() => {
        const interval = setInterval(fetchStats, 5000);
        return () => clearInterval(interval);
    }, [fetchStats]);

    const handleSeed = async () => {
        if (!confirm('This will wipe the current DB and seed it with dummy data. Proceed?')) return;
        try {
            await fetch('/api/admin/seed', { method: 'POST' });
            alert('Database seeded successfully!');
            fetchStats();
        } catch (e) {
            alert('Error seeding database');
        }
    };

    const cards = [
        { label: 'Total Orders', value: stats.orderCount, accent: false },
        { label: 'Pending Orders', value: stats.pendingOrders, accent: stats.pendingOrders > 0 },
        { label: 'Total Reservations', value: stats.reservationCount, accent: false },
        { label: 'Pending Reservations', value: stats.pendingReservations, accent: stats.pendingReservations > 0 },
        { label: 'Menu Items', value: stats.menuItemCount, accent: false },
    ];

    if (loading) return <div className="text-stone text-sm">Loading dashboard...</div>;

    return (
        <div>
            <h1 className="font-serif text-2xl text-charcoal mb-8">Overview</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((card) => (
                    <div
                        key={card.label}
                        className={`p-6 bg-white border ${card.accent ? 'border-gold' : 'border-border'
                            }`}
                    >
                        <p className="text-xs tracking-[0.15em] uppercase text-stone mb-3">
                            {card.label}
                        </p>
                        <p className={`text-3xl font-light ${card.accent ? 'text-gold' : 'text-charcoal'}`}>
                            {card.value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-12 p-6 bg-white border border-border">
                <h2 className="font-serif text-lg text-charcoal mb-4">Quick Start</h2>
                <div className="space-y-3 text-sm text-stone">
                    <p className="flex items-center gap-3">
                        1. Seed the database 
                        <button onClick={handleSeed} className="bg-charcoal text-ivory px-3 py-1 text-xs hover:bg-gold transition-colors">
                            Run Seed
                        </button>
                    </p>
                    <p>2. Manage menu items from the <strong>Menu Items</strong> tab</p>
                    <p>3. View and manage orders from the <strong>Orders</strong> tab</p>
                    <p>4. Manage table reservations from the <strong>Reservations</strong> tab</p>
                </div>
            </div>
        </div>
    );
}
