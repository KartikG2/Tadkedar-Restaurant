'use client';

import { useState } from 'react';

export default function AdminLoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                window.location.href = '/admin';
            } else {
                const data = await res.json();
                setError(data.error || 'Login failed');
            }
        } catch {
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-sm relative z-10 shadow-2xl">
            <div className="bg-ivory border border-border p-8 md:p-10">
                <div className="text-center mb-10">
                    <h1 className="font-serif text-4xl text-charcoal mb-2 tracking-wide">Tadkedar</h1>
                    <div className="h-px bg-gold/50 w-12 mx-auto mb-3" />
                    <p className="text-gold text-xs font-medium tracking-[0.2em] uppercase">Admin Portal</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-[10px] tracking-[0.15em] uppercase text-stone mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-3 border border-border bg-white text-charcoal text-sm focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-all duration-200 placeholder:text-stone/50"
                            placeholder="Store manager username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] tracking-[0.15em] uppercase text-stone mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 border border-border bg-white text-charcoal text-sm focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-all duration-200 placeholder:text-stone/50"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-charcoal text-ivory text-xs font-medium tracking-[0.15em] uppercase hover:bg-gold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                <p className="text-[10px] uppercase tracking-wider text-stone/60 text-center mt-8">
                    Authorized Personnel Only
                </p>
            </div>
        </div>
    );
}
