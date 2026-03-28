'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { apiFetch } from '@/lib/api';

interface Category {
    _id: string;
    name: string;
    slug: string;
    order: number;
    isActive: boolean;
}

interface MenuItemType {
    _id: string;
    name: string;
    description: string;
    price: number;
    halfPrice: number;
    quarterPrice: number;
    category: Category | string;
    isAvailable: boolean;
    isVeg: boolean;
    image: string;
}

const emptyForm = {
    name: '', description: '', price: '', halfPrice: '', quarterPrice: '',
    category: '', isVeg: true, isAvailable: true, image: '',
};

export default function AdminMenuPage() {
    const [items, setItems] = useState<MenuItemType[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<MenuItemType | null>(null);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [form, setForm] = useState(emptyForm);

    const fetchData = useCallback(async () => {
        try {
            const res = await apiFetch('/api/menu/admin');
            const data = await res.json();
            setItems(data.items || []);
            setCategories(data.categories || []);
        } catch { /* ignore */ } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    // Real-time polling
    useEffect(() => {
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, [fetchData]);

    /* ── Image Upload ── */
    const uploadImage = async (file: File) => {
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append('image', file);
            const res = await apiFetch('/api/admin/upload', { method: 'POST', body: fd });
            if (res.ok) {
                const data = await res.json();
                setForm((prev) => ({ ...prev, image: data.url }));
            } else {
                const err = await res.json();
                alert(err.error || 'Upload failed');
            }
        } catch {
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation(); setDragActive(false);
        const f = e.dataTransfer.files;
        if (f?.[0]?.type.startsWith('image/')) uploadImage(f[0]);
        else alert('Please drop an image file');
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) uploadImage(e.target.files[0]);
    };

    /* ── Modal ── */
    const openAdd = () => {
        setEditItem(null);
        setForm({ ...emptyForm, category: categories[0]?._id || '' });
        setModalOpen(true);
    };

    const openEdit = (item: MenuItemType) => {
        setEditItem(item);
        setForm({
            name: item.name,
            description: item.description,
            price: item.price.toString(),
            halfPrice: item.halfPrice ? item.halfPrice.toString() : '',
            quarterPrice: item.quarterPrice ? item.quarterPrice.toString() : '',
            category: typeof item.category === 'object' ? item.category._id : item.category,
            isVeg: item.isVeg,
            isAvailable: item.isAvailable,
            image: item.image || '',
        });
        setModalOpen(true);
    };

    const closeModal = () => { setModalOpen(false); setEditItem(null); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            name: form.name, description: form.description,
            price: parseFloat(form.price),
            halfPrice: form.halfPrice ? parseFloat(form.halfPrice) : 0,
            quarterPrice: form.quarterPrice ? parseFloat(form.quarterPrice) : 0,
            category: form.category, isVeg: form.isVeg, isAvailable: form.isAvailable,
            image: form.image,
            ...(editItem ? { _id: editItem._id } : {}),
        };
        const res = await apiFetch('/api/menu/admin', {
            method: editItem ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (res.ok) { closeModal(); fetchData(); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this item?')) return;
        await apiFetch(`/api/menu/admin?id=${id}`, { method: 'DELETE' });
        fetchData();
    };

    const toggleAvailability = async (item: MenuItemType) => {
        await fetch('/api/menu/admin', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ _id: item._id, isAvailable: !item.isAvailable }),
        });
        fetchData();
    };

    if (loading) return <div className="text-stone text-sm">Loading...</div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="font-serif text-2xl text-charcoal">Menu Items</h1>
                <button onClick={openAdd}
                    className="px-5 py-2.5 bg-charcoal text-ivory text-xs tracking-[0.1em] uppercase hover:bg-charcoal-light transition-colors">
                    + Add Item
                </button>
            </div>

            {/* Item Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {items.map((item) => (
                    <div key={item._id} className="bg-white border border-border overflow-hidden group hover:border-gold/30 transition-all duration-300">
                        {/* Thumbnail */}
                        <div className="relative h-36 bg-ivory-warm overflow-hidden">
                            {item.image ? (
                                <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="300px" unoptimized />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <svg className="w-10 h-10 text-stone/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                            {/* Status badge */}
                            <div className="absolute top-2 left-2">
                                <span className={`text-[9px] px-2 py-0.5 tracking-wider uppercase ${item.isAvailable ? 'bg-green-500/90 text-white' : 'bg-red-400/90 text-white'}`}>
                                    {item.isAvailable ? 'Active' : 'Disabled'}
                                </span>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="p-4">
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className="text-sm font-medium text-charcoal truncate">{item.name}</h3>
                                <span className="text-sm text-charcoal font-medium whitespace-nowrap">₹{item.price}</span>
                            </div>
                            <div className="flex gap-2 text-[10px] text-stone mb-3">
                                {item.halfPrice > 0 && <span className="bg-ivory-warm px-1.5 py-0.5">Half ₹{item.halfPrice}</span>}
                                {item.quarterPrice > 0 && <span className="bg-ivory-warm px-1.5 py-0.5">Qtr ₹{item.quarterPrice}</span>}
                                {typeof item.category === 'object' && <span className="bg-ivory-warm px-1.5 py-0.5">{item.category.name}</span>}
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => openEdit(item)}
                                    className="flex-1 py-1.5 text-xs text-stone hover:text-charcoal border border-border hover:border-gold transition-colors">
                                    Edit
                                </button>
                                <button onClick={() => toggleAvailability(item)}
                                    className="flex-1 py-1.5 text-xs text-stone hover:text-charcoal border border-border hover:border-stone transition-colors">
                                    {item.isAvailable ? 'Disable' : 'Enable'}
                                </button>
                                <button onClick={() => handleDelete(item._id)}
                                    className="py-1.5 px-3 text-xs text-red-400 hover:text-red-600 border border-border hover:border-red-300 transition-colors">
                                    ✕
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {items.length === 0 && (
                <p className="text-stone text-sm p-8 bg-white border border-border text-center mt-4">
                    No menu items yet. Seed the database or add items manually.
                </p>
            )}

            {/* ── Modal Overlay ── */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />

                    {/* Modal */}
                    <div className="relative bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between z-10">
                            <h2 className="font-serif text-lg text-charcoal">
                                {editItem ? 'Edit Item' : 'Add New Item'}
                            </h2>
                            <button onClick={closeModal} className="text-stone hover:text-charcoal text-xl leading-none">✕</button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Drag & Drop */}
                            <div
                                className={`relative border-2 border-dashed rounded-lg transition-all duration-300 ${dragActive ? 'border-gold bg-gold/5' : form.image ? 'border-green-300 bg-green-50/30' : 'border-border bg-ivory hover:border-stone-light'
                                    }`}
                                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                                onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
                                onDrop={handleDrop}
                            >
                                {form.image ? (
                                    <div className="relative">
                                        <div className="relative w-full h-44 overflow-hidden rounded-lg">
                                            <Image src={form.image} alt="Preview" fill className="object-cover" sizes="500px" unoptimized />
                                        </div>
                                        <div className="absolute top-3 right-3 flex gap-2">
                                            <button type="button" onClick={() => fileInputRef.current?.click()}
                                                className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-xs text-charcoal border border-border hover:bg-white rounded transition-colors">
                                                Replace
                                            </button>
                                            <button type="button" onClick={() => setForm((p) => ({ ...p, image: '' }))}
                                                className="px-3 py-1.5 bg-red-500/90 text-xs text-white hover:bg-red-600 rounded transition-colors">
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-10 px-6 text-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                        {uploading ? (
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                                                <p className="text-sm text-stone">Uploading...</p>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-ivory-warm flex items-center justify-center">
                                                    <svg className="w-7 h-7 text-stone" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <p className="text-sm text-charcoal font-medium mb-1">
                                                    Drop image here or <span className="text-gold">click to browse</span>
                                                </p>
                                                <p className="text-xs text-stone">JPG, PNG, WebP, or GIF · Max 5MB</p>
                                            </>
                                        )}
                                    </div>
                                )}
                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                            </div>

                            {/* Name */}
                            <div>
                                <label className="text-[10px] text-stone tracking-wider uppercase block mb-1.5">Item Name *</label>
                                <input type="text" required
                                    className="w-full px-4 py-3 border border-border bg-ivory text-sm text-charcoal focus:border-gold outline-none"
                                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="text-[10px] text-stone tracking-wider uppercase block mb-1.5">Category</label>
                                <select className="w-full px-4 py-3 border border-border bg-ivory text-sm text-charcoal focus:border-gold outline-none"
                                    value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                                    <option value="">Select Category</option>
                                    {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                                </select>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="text-[10px] text-stone tracking-wider uppercase block mb-1.5">Description</label>
                                <textarea rows={2}
                                    className="w-full px-4 py-3 border border-border bg-ivory text-sm text-charcoal focus:border-gold outline-none resize-none"
                                    value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                            </div>

                            {/* Pricing */}
                            <div>
                                <label className="text-[10px] text-stone tracking-wider uppercase block mb-2">Pricing</label>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <span className="text-[10px] text-stone block mb-1">Full *</span>
                                        <input type="number" required step="0.01" min="0" placeholder="₹"
                                            className="w-full px-3 py-2.5 border border-border bg-ivory text-sm text-charcoal focus:border-gold outline-none"
                                            value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-stone block mb-1">Half</span>
                                        <input type="number" step="0.01" min="0" placeholder="₹ 0"
                                            className="w-full px-3 py-2.5 border border-border bg-ivory text-sm text-charcoal focus:border-gold outline-none"
                                            value={form.halfPrice} onChange={(e) => setForm({ ...form, halfPrice: e.target.value })} />
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-stone block mb-1">Quarter</span>
                                        <input type="number" step="0.01" min="0" placeholder="₹ 0"
                                            className="w-full px-3 py-2.5 border border-border bg-ivory text-sm text-charcoal focus:border-gold outline-none"
                                            value={form.quarterPrice} onChange={(e) => setForm({ ...form, quarterPrice: e.target.value })} />
                                    </div>
                                </div>
                            </div>

                            {/* Toggles */}
                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2 text-sm text-charcoal cursor-pointer">
                                    <input type="checkbox" checked={form.isVeg} onChange={(e) => setForm({ ...form, isVeg: e.target.checked })} className="accent-green-600" />
                                    Vegetarian
                                </label>
                                <label className="flex items-center gap-2 text-sm text-charcoal cursor-pointer">
                                    <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} className="accent-gold" />
                                    Available
                                </label>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button type="submit"
                                    className="flex-1 py-3 bg-gold text-white text-xs tracking-[0.1em] uppercase hover:bg-gold-dark transition-colors">
                                    {editItem ? 'Update Item' : 'Add Item'}
                                </button>
                                <button type="button" onClick={closeModal}
                                    className="px-6 py-3 border border-border text-xs text-stone tracking-[0.1em] uppercase hover:text-charcoal hover:border-charcoal transition-colors">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
