'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ReservationsPage() {
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        date: '',
        time: '',
        guests: '2',
        notes: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const res = await fetch('/api/reservations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, guests: parseInt(formData.guests) }),
            });

            if (res.ok) {
                setSubmitted(true);
            }
        } catch {
            alert('Something went wrong. Please try again or call us directly.');
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <section className="pt-32 pb-24 px-6 min-h-screen flex items-center justify-center">
                <div className="max-w-lg mx-auto text-center">
                    <div className="w-16 h-16 mx-auto mb-8 rounded-full bg-green-50 flex items-center justify-center">
                        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">
                        Reservation Received
                    </h1>
                    <p className="text-stone text-lg mb-10">
                        Thank you, {formData.name}! We&apos;ll confirm your table shortly.
                    </p>
                    <Link
                        href="/"
                        className="inline-block px-8 py-3 bg-charcoal text-ivory text-sm tracking-[0.15em] uppercase hover:bg-charcoal-light transition-colors duration-300"
                    >
                        Back to Home
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <>
            {/* Header */}
            <section className="pt-32 pb-16 lg:pt-40 lg:pb-20 px-6 bg-charcoal">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-xs tracking-[0.3em] uppercase text-gold mb-4">Reserve</p>
                    <h1 className="font-serif text-4xl md:text-6xl text-ivory mb-6">Book a Table</h1>
                    <p className="text-ivory/50 text-lg max-w-xl mx-auto">
                        Secure your table for a memorable dining experience
                    </p>
                </div>
            </section>

            <section className="py-16 lg:py-24 px-6">
                <div className="max-w-xl mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs tracking-[0.15em] uppercase text-stone mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3.5 border border-border bg-white text-charcoal text-sm focus:border-gold outline-none transition-colors"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs tracking-[0.15em] uppercase text-stone mb-2">
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    required
                                    className="w-full px-4 py-3.5 border border-border bg-white text-charcoal text-sm focus:border-gold outline-none transition-colors"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs tracking-[0.15em] uppercase text-stone mb-2">
                                Email (optional)
                            </label>
                            <input
                                type="email"
                                className="w-full px-4 py-3.5 border border-border bg-white text-charcoal text-sm focus:border-gold outline-none transition-colors"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs tracking-[0.15em] uppercase text-stone mb-2">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    required
                                    className="w-full px-4 py-3.5 border border-border bg-white text-charcoal text-sm focus:border-gold outline-none transition-colors"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs tracking-[0.15em] uppercase text-stone mb-2">
                                    Time
                                </label>
                                <select
                                    required
                                    className="w-full px-4 py-3.5 border border-border bg-white text-charcoal text-sm focus:border-gold outline-none transition-colors"
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                >
                                    <option value="">Select</option>
                                    {['11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00',
                                        '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00',
                                    ].map((t) => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs tracking-[0.15em] uppercase text-stone mb-2">
                                    Guests
                                </label>
                                <select
                                    required
                                    className="w-full px-4 py-3.5 border border-border bg-white text-charcoal text-sm focus:border-gold outline-none transition-colors"
                                    value={formData.guests}
                                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map((n) => (
                                        <option key={n} value={n}>
                                            {n} {n === 1 ? 'guest' : 'guests'}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs tracking-[0.15em] uppercase text-stone mb-2">
                                Special Requests (optional)
                            </label>
                            <textarea
                                rows={4}
                                className="w-full px-4 py-3.5 border border-border bg-white text-charcoal text-sm focus:border-gold outline-none resize-none transition-colors"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-4 bg-charcoal text-ivory text-sm tracking-[0.15em] uppercase hover:bg-charcoal-light transition-colors duration-300 disabled:opacity-50"
                        >
                            {submitting ? 'Confirming...' : 'Reserve Table'}
                        </button>

                        <p className="text-xs text-stone text-center leading-relaxed">
                            You can also call us directly at{' '}
                            <a href="tel:+917022513482" className="text-gold hover:underline">
                                070225 13482
                            </a>{' '}
                            to reserve a table.
                        </p>
                    </form>
                </div>
            </section>
        </>
    );
}
