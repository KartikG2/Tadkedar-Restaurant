'use client';

import { useState, useEffect, useCallback } from 'react';

interface ReservationType {
    _id: string;
    name: string;
    phone: string;
    email: string;
    date: string;
    time: string;
    guests: number;
    notes: string;
    status: string;
    createdAt: string;
}

const statusColors: Record<string, string> = {
    Pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    Confirmed: 'bg-green-50 text-green-700 border-green-200',
    Cancelled: 'bg-red-50 text-red-700 border-red-200',
};

export default function AdminReservationsPage() {
    const [reservations, setReservations] = useState<ReservationType[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReservations = useCallback(async () => {
        try {
            const res = await fetch('/api/reservations');
            const data = await res.json();
            setReservations(data);
        } catch { /* ignore */ } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchReservations(); }, [fetchReservations]);

    // Real-time polling
    useEffect(() => {
        const interval = setInterval(fetchReservations, 5000);
        return () => clearInterval(interval);
    }, [fetchReservations]);

    const updateStatus = async (id: string, status: string) => {
        await fetch(`/api/reservations/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });
        fetchReservations();
    };

    if (loading) return <div className="text-stone text-sm">Loading...</div>;

    return (
        <div>
            <h1 className="font-serif text-2xl text-charcoal mb-8">
                Reservations
                <span className="text-sm text-stone font-sans ml-2">({reservations.length})</span>
            </h1>

            <div className="space-y-4">
                {reservations.map((r) => (
                    <div key={r._id} className="p-6 bg-white border border-border">
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                            <div>
                                <h3 className="text-sm font-medium text-charcoal">{r.name}</h3>
                                <p className="text-xs text-stone mt-1">{r.phone}</p>
                                {r.email && <p className="text-xs text-stone">{r.email}</p>}
                            </div>
                            <span className={`inline-block px-3 py-1 text-xs border ${statusColors[r.status] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                                {r.status}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4 pb-4 border-b border-border">
                            <div>
                                <p className="text-xs text-stone uppercase tracking-wider">Date</p>
                                <p className="text-sm text-charcoal mt-1">{r.date}</p>
                            </div>
                            <div>
                                <p className="text-xs text-stone uppercase tracking-wider">Time</p>
                                <p className="text-sm text-charcoal mt-1">{r.time}</p>
                            </div>
                            <div>
                                <p className="text-xs text-stone uppercase tracking-wider">Guests</p>
                                <p className="text-sm text-charcoal mt-1">{r.guests}</p>
                            </div>
                        </div>

                        {r.notes && (
                            <p className="text-xs text-stone italic mb-4">Note: {r.notes}</p>
                        )}

                        <div className="flex gap-2">
                            {r.status === 'Cancelled' ? (
                                <p className="text-xs text-stone italic uppercase tracking-wider">🔒 Cancelled (Locked)</p>
                            ) : (
                                ['Pending', 'Confirmed', 'Cancelled'].map((status) => {
                                    // Prevent reverting a Confirmed reservation back to Pending
                                    const isDisabled = r.status === status || (r.status === 'Confirmed' && status === 'Pending');
                                    
                                    return (
                                        <button
                                            key={status}
                                            onClick={() => {
                                                if (status === 'Cancelled' && !confirm('Are you sure you want to cancel this reservation?')) return;
                                                updateStatus(r._id, status);
                                            }}
                                            disabled={isDisabled}
                                            className={`px-3 py-1.5 text-xs border tracking-wider uppercase transition-colors ${r.status === status
                                                    ? 'border-charcoal bg-charcoal text-ivory'
                                                    : isDisabled
                                                        ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                                                        : 'border-border text-stone hover:border-stone hover:text-charcoal'
                                                }`}
                                        >
                                            {status}
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>
                ))}

                {reservations.length === 0 && (
                    <p className="text-stone text-sm p-6 bg-white border border-border text-center">
                        No reservations yet.
                    </p>
                )}
            </div>
        </div>
    );
}
