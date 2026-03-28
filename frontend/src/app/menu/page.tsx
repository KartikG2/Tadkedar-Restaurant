'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

/* ── Types ─────────────────────────────────────────── */
interface MenuItemData {
    _id: string;
    name: string;
    description: string;
    price: number;
    halfPrice: number;
    quarterPrice: number;
    isVeg: boolean;
    isAvailable: boolean;
    image: string;
    category: { _id: string; name: string; slug: string } | string;
}

type Portion = 'Full' | 'Half' | 'Quarter';
type OrderType = 'Dine-in' | 'Takeaway' | 'Delivery';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    portion: Portion;
    image: string;
}

interface GroupedCategory {
    _id: string;
    name: string;
    slug: string;
    items: MenuItemData[];
}

/* ── Sample Data (fallback when DB is empty) ──────── */
const sampleMenu: GroupedCategory[] = [
    {
        _id: '1', name: 'Rice', slug: 'rice',
        items: [
            { _id: '101', name: 'Mushroom Fried Rice', description: 'Aromatic basmati rice wok-tossed with fresh mushrooms and spices', price: 180, halfPrice: 110, quarterPrice: 0, isVeg: true, isAvailable: true, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80', category: '1' },
            { _id: '102', name: 'Veg Fried Rice', description: 'Classic fried rice with mixed vegetables', price: 160, halfPrice: 100, quarterPrice: 0, isVeg: true, isAvailable: true, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=80', category: '1' },
            { _id: '103', name: 'Jeera Rice', description: 'Fragrant basmati rice tempered with cumin seeds', price: 120, halfPrice: 70, quarterPrice: 0, isVeg: true, isAvailable: true, image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&q=80', category: '1' },
        ],
    },
    {
        _id: '2', name: 'Starters', slug: 'starters',
        items: [
            { _id: '201', name: 'Paneer Tikka', description: 'Char-grilled cottage cheese marinated in yogurt and spices', price: 200, halfPrice: 120, quarterPrice: 70, isVeg: true, isAvailable: true, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80', category: '2' },
            { _id: '202', name: 'Gobi Manchurian', description: 'Crispy cauliflower florets in Indo-Chinese sauce', price: 170, halfPrice: 100, quarterPrice: 60, isVeg: true, isAvailable: true, image: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=400&q=80', category: '2' },
            { _id: '203', name: 'Corn Dry', description: 'Crispy golden corn in a fragrant spice mix', price: 160, halfPrice: 100, quarterPrice: 60, isVeg: true, isAvailable: true, image: 'https://images.unsplash.com/photo-1551326844-4df70f78d0e9?w=400&q=80', category: '2' },
        ],
    },
    {
        _id: '3', name: 'Main Course', slug: 'main-course',
        items: [
            { _id: '301', name: 'Paneer Butter Masala', description: 'Soft paneer in rich tomato-butter gravy', price: 220, halfPrice: 130, quarterPrice: 80, isVeg: true, isAvailable: true, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80', category: '3' },
            { _id: '302', name: 'Dal Makhani', description: 'Slow-cooked black lentils in creamy, buttery gravy', price: 190, halfPrice: 110, quarterPrice: 70, isVeg: true, isAvailable: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80', category: '3' },
            { _id: '303', name: 'Malai Kofta', description: 'Soft vegetable and paneer dumplings in creamy gravy', price: 230, halfPrice: 140, quarterPrice: 80, isVeg: true, isAvailable: true, image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80', category: '3' },
        ],
    },
    {
        _id: '4', name: 'Breads', slug: 'breads',
        items: [
            { _id: '401', name: 'Butter Naan', description: 'Soft leavened bread brushed with butter', price: 50, halfPrice: 0, quarterPrice: 0, isVeg: true, isAvailable: true, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80', category: '4' },
            { _id: '402', name: 'Garlic Naan', description: 'Naan topped with minced garlic and coriander', price: 60, halfPrice: 0, quarterPrice: 0, isVeg: true, isAvailable: true, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80', category: '4' },
            { _id: '403', name: 'Tandoori Roti', description: 'Whole wheat bread baked in clay oven', price: 35, halfPrice: 0, quarterPrice: 0, isVeg: true, isAvailable: true, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80', category: '4' },
        ],
    },
];

/* ── Price helper ──────────────────────────────────── */
function getPortionPrice(item: MenuItemData, portion: Portion): number {
    if (portion === 'Half' && item.halfPrice > 0) return item.halfPrice;
    if (portion === 'Quarter' && item.quarterPrice > 0) return item.quarterPrice;
    return item.price;
}

function getAvailablePortions(item: MenuItemData): Portion[] {
    const portions: Portion[] = ['Full'];
    if (item.halfPrice && item.halfPrice > 0) portions.push('Half');
    if (item.quarterPrice && item.quarterPrice > 0) portions.push('Quarter');
    return portions;
}

/* ── Component ─────────────────────────────────────── */
export default function MenuPage() {
    const [menu, setMenu] = useState<GroupedCategory[]>(sampleMenu);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [orderType, setOrderType] = useState<OrderType>('Dine-in');
    const [showCheckout, setShowCheckout] = useState(false);
    const [showMobileCart, setShowMobileCart] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [activeCategory, setActiveCategory] = useState('');
    const [formData, setFormData] = useState({
        customerName: '', phone: '', email: '', address: '', notes: '', tableNumber: '',
    });

    // Fetch menu from API
    const fetchMenu = useCallback(() => {
        apiFetch('/api/menu')
            .then((r: Response) => r.json())
            .then((items: MenuItemData[]) => {
                if (!items || !Array.isArray(items) || items.length === 0) return;
                // Group items by category
                const grouped: Record<string, GroupedCategory> = {};
                items.forEach((item) => {
                    const cat = typeof item.category === 'object' ? item.category : null;
                    if (!cat) return;
                    if (!grouped[cat._id]) {
                        grouped[cat._id] = { _id: cat._id, name: cat.name, slug: cat.slug, items: [] };
                    }
                    grouped[cat._id].items.push(item);
                });
                const sorted = Object.values(grouped);
                if (sorted.length > 0) setMenu(sorted);
            })
            .catch(() => { });
    }, []);

    useEffect(() => {
        fetchMenu();
        const interval = setInterval(fetchMenu, 5000);
        return () => clearInterval(interval);
    }, [fetchMenu]);

    // Load cart from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('tadkedar_cart');
        if (saved) { try { setCart(JSON.parse(saved)); } catch { /* ignore */ } }
        const savedType = localStorage.getItem('tadkedar_ordertype');
        if (savedType) setOrderType(savedType as OrderType);
    }, []);

    // Save cart
    useEffect(() => {
        localStorage.setItem('tadkedar_cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        localStorage.setItem('tadkedar_ordertype', orderType);
    }, [orderType]);

    // Set first category as active
    useEffect(() => {
        if (menu.length > 0 && !activeCategory) setActiveCategory(menu[0].slug);
    }, [menu, activeCategory]);

    const addToCart = useCallback((item: MenuItemData, portion: Portion) => {
        const price = getPortionPrice(item, portion);
        const cartKey = `${item._id}_${portion}`;
        setCart((prev) => {
            const existing = prev.find((c) => c.id === cartKey);
            if (existing) {
                return prev.map((c) => c.id === cartKey ? { ...c, quantity: c.quantity + 1 } : c);
            }
            return [...prev, { id: cartKey, name: item.name, price, quantity: 1, portion, image: item.image || '' }];
        });
    }, []);

    const updateQuantity = useCallback((id: string, delta: number) => {
        setCart((prev) => prev.map((c) => c.id === id ? { ...c, quantity: c.quantity + delta } : c).filter((c) => c.quantity > 0));
    }, []);

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await apiFetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cart.map((c) => ({
                        menuItemId: c.id.split('_')[0],
                        name: c.name,
                        price: c.price,
                        quantity: c.quantity,
                        portion: c.portion,
                        image: c.image,
                    })),
                    ...formData,
                    total,
                    orderType,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setOrderPlaced(true);
                setOrderNumber(data.orderNumber || '');
                setCart([]);
                localStorage.removeItem('tadkedar_cart');
            } else {
                alert(data.error || 'Failed to place order. Please try again.');
            }
        } catch (err) {
            console.error('Order error:', err);
            alert('Network error. Please check your connection and try again.');
        } finally {
            setSubmitting(false);
        }
    };

    /* ── Order Success ─────────────────────────────── */
    if (orderPlaced) {
        return (
            <section className="pt-32 pb-24 px-6 min-h-screen flex items-center justify-center">
                <div className="max-w-lg mx-auto text-center">
                    <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-green-50 flex items-center justify-center">
                        <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">Order Placed!</h1>
                    {orderNumber && (
                        <p className="text-gold text-lg font-medium mb-4 tracking-wider">#{orderNumber}</p>
                    )}
                    <p className="text-stone text-lg mb-4">
                        Thank you! Your {orderType.toLowerCase()} order has been received.
                    </p>
                    {formData.email && (
                        <p className="text-stone/70 text-sm mb-10">
                            A confirmation has been sent to {formData.email}
                        </p>
                    )}
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

    /* ── Cart Widget ───────────────────────────────── */
    const renderCartContent = () => (
        <>
            <h3 className="font-serif text-xl text-charcoal mb-2">
                Your Order
                {itemCount > 0 && <span className="text-sm text-stone font-sans ml-2">({itemCount})</span>}
            </h3>
            <div className="flex items-center gap-1.5 mb-6">
                <span className="text-xs text-gold tracking-wider uppercase">{orderType}</span>
            </div>

            {cart.length === 0 ? (
                <p className="text-stone text-sm py-8 text-center">Your cart is empty</p>
            ) : (
                <>
                    <div className="space-y-4 mb-6 max-h-75 overflow-y-auto pr-1">
                        {cart.map((item) => (
                            <div key={item.id} className="flex gap-3 items-start">
                                {item.image && (
                                    <div className="w-12 h-12 rounded-sm overflow-hidden shrink-0 relative">
                                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" unoptimized />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-charcoal truncate">{item.name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        {item.portion !== 'Full' && (
                                            <span className="text-[10px] text-gold bg-gold/10 px-1.5 py-0.5 rounded">{item.portion}</span>
                                        )}
                                        <div className="flex items-center gap-1.5">
                                            <button onClick={() => updateQuantity(item.id, -1)} className="w-5 h-5 rounded-full border border-border text-[10px] flex items-center justify-center text-stone hover:text-charcoal hover:border-charcoal transition-colors">−</button>
                                            <span className="text-xs text-charcoal min-w-3.5 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)} className="w-5 h-5 rounded-full border border-border text-[10px] flex items-center justify-center text-stone hover:text-charcoal hover:border-charcoal transition-colors">+</button>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-charcoal whitespace-nowrap">₹{item.price * item.quantity}</p>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-border pt-4 mb-6">
                        <div className="flex justify-between">
                            <span className="text-sm font-medium text-charcoal">Total</span>
                            <span className="text-lg font-semibold text-charcoal">₹{total}</span>
                        </div>
                    </div>

                    {!showCheckout ? (
                        <button
                            onClick={() => setShowCheckout(true)}
                            className="w-full py-3.5 bg-charcoal text-ivory text-sm tracking-[0.15em] uppercase hover:bg-charcoal-light transition-colors duration-300"
                        >
                            Checkout
                        </button>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <input type="text" placeholder="Your Name *" required
                                className="w-full px-3.5 py-2.5 border border-border bg-ivory text-sm text-charcoal placeholder:text-stone/50 focus:border-gold outline-none transition-colors"
                                value={formData.customerName} onChange={(e) => setFormData({ ...formData, customerName: e.target.value })} />
                            <input type="tel" placeholder="Phone Number *" required
                                className="w-full px-3.5 py-2.5 border border-border bg-ivory text-sm text-charcoal placeholder:text-stone/50 focus:border-gold outline-none transition-colors"
                                value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                            <input type="email" placeholder="Email (for receipt)"
                                className="w-full px-3.5 py-2.5 border border-border bg-ivory text-sm text-charcoal placeholder:text-stone/50 focus:border-gold outline-none transition-colors"
                                value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                            {orderType === 'Delivery' && (
                                <input type="text" placeholder="Delivery Address *" required
                                    className="w-full px-3.5 py-2.5 border border-border bg-ivory text-sm text-charcoal placeholder:text-stone/50 focus:border-gold outline-none transition-colors"
                                    value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                            )}
                            {orderType === 'Dine-in' && (
                                <input type="text" placeholder="Table Number"
                                    className="w-full px-3.5 py-2.5 border border-border bg-ivory text-sm text-charcoal placeholder:text-stone/50 focus:border-gold outline-none transition-colors"
                                    value={formData.tableNumber} onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })} />
                            )}
                            <textarea placeholder="Special instructions" rows={2}
                                className="w-full px-3.5 py-2.5 border border-border bg-ivory text-sm text-charcoal placeholder:text-stone/50 focus:border-gold outline-none resize-none transition-colors"
                                value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
                            <button type="submit" disabled={submitting}
                                className="w-full py-3.5 bg-gold text-white text-sm tracking-[0.15em] uppercase hover:bg-gold-dark transition-colors duration-300 disabled:opacity-50">
                                {submitting ? 'Placing...' : `Place Order · ₹${total}`}
                            </button>
                            <button type="button" onClick={() => setShowCheckout(false)}
                                className="w-full py-2 text-xs text-stone hover:text-charcoal transition-colors">
                                ← Back to cart
                            </button>
                        </form>
                    )}
                </>
            )}
        </>
    );

    /* ── Main Render ───────────────────────────────── */
    return (
        <>
            {/* Hero */}
            <section className="relative pt-32 pb-16 px-6 bg-charcoal overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image src="/images/starters.png" alt="Menu" fill className="object-cover opacity-20" sizes="100vw" quality={60} priority />
                </div>
                <div className="absolute inset-0 bg-linear-to-b from-charcoal/80 to-charcoal z-10" />
                <div className="relative z-20 max-w-4xl mx-auto text-center">
                    <p className="text-xs tracking-[0.3em] uppercase text-gold mb-4 animate-fade-in-up">Explore & Order</p>
                    <h1 className="font-serif text-4xl md:text-6xl text-ivory mb-6 animate-fade-in-up-delay-1">Our Menu</h1>
                    <p className="text-ivory/50 text-lg mb-10 animate-fade-in-up-delay-2">
                        Select your dishes, choose a portion, and place your order
                    </p>

                    {/* Order Type Selector */}
                    <div className="inline-flex bg-charcoal-light/50 backdrop-blur-sm p-1.5 gap-1 animate-fade-in-up-delay-3">
                        {(['Dine-in', 'Takeaway', 'Delivery'] as OrderType[]).map((type) => (
                            <button
                                key={type}
                                onClick={() => setOrderType(type)}
                                className={`px-6 py-2.5 text-xs tracking-[0.15em] uppercase transition-all duration-300 ${orderType === type
                                    ? 'bg-gold text-white'
                                    : 'text-ivory/50 hover:text-ivory'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Category Navigation */}
            <nav className="sticky top-18 z-30 bg-ivory/95 backdrop-blur-sm border-b border-border">
                <div className="max-w-6xl mx-auto px-6 py-3 flex gap-6 overflow-x-auto">
                    {menu.map((cat) => (
                        <a
                            key={cat._id}
                            href={`#cat-${cat.slug}`}
                            onClick={() => setActiveCategory(cat.slug)}
                            className={`text-xs tracking-[0.15em] uppercase whitespace-nowrap transition-colors duration-300 pb-1 border-b-2 ${activeCategory === cat.slug
                                ? 'text-gold border-gold'
                                : 'text-stone hover:text-charcoal border-transparent'
                                }`}
                        >
                            {cat.name}
                        </a>
                    ))}
                </div>
            </nav>

            {/* Menu + Cart Layout */}
            <section className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12">
                    {/* Menu Items */}
                    <div>
                        {menu.map((cat) => (
                            <div key={cat._id} id={`cat-${cat.slug}`} className="mb-16 last:mb-0 scroll-mt-36">
                                <div className="flex items-center gap-4 mb-8">
                                    <h2 className="font-serif text-2xl md:text-3xl text-charcoal">{cat.name}</h2>
                                    <div className="flex-1 h-px bg-border" />
                                    <span className="text-xs text-stone">{cat.items.filter(i => i.isAvailable !== false).length} items</span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {cat.items.filter(i => i.isAvailable !== false).map((item) => {
                                        const portions = getAvailablePortions(item);
                                        return (
                                            <DishCard
                                                key={item._id}
                                                item={item}
                                                portions={portions}
                                                cart={cart}
                                                onAdd={addToCart}
                                                onUpdateQty={updateQuantity}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Cart Sidebar — Desktop */}
                    <div className="hidden lg:block">
                        <div className="sticky top-36 bg-white border border-border p-6">
                            {renderCartContent()}
                        </div>
                    </div>
                </div>
            </section>

            {/* Mobile Cart Button */}
            {itemCount > 0 && (
                <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 p-4 bg-ivory/90 backdrop-blur-sm border-t border-border">
                    <button
                        onClick={() => setShowMobileCart(true)}
                        className="w-full py-3.5 bg-charcoal text-ivory text-sm tracking-[0.15em] uppercase flex items-center justify-center gap-3"
                    >
                        <span className="w-6 h-6 bg-gold text-white text-xs rounded-full flex items-center justify-center">{itemCount}</span>
                        View Cart · ₹{total}
                    </button>
                </div>
            )}

            {/* Mobile Cart Sheet */}
            {showMobileCart && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-charcoal/50" onClick={() => setShowMobileCart(false)} />
                    <div className="absolute bottom-0 inset-x-0 bg-white max-h-[85vh] overflow-y-auto p-6 rounded-t-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-serif text-lg text-charcoal">Your Order</h3>
                            <button onClick={() => setShowMobileCart(false)} className="text-stone hover:text-charcoal text-lg">✕</button>
                        </div>
                        {renderCartContent()}
                    </div>
                </div>
            )}
        </>
    );
}

/* ── Dish Card Component ─────────────────────────── */
function DishCard({
    item,
    portions,
    cart,
    onAdd,
    onUpdateQty,
}: {
    item: MenuItemData;
    portions: Portion[];
    cart: CartItem[];
    onAdd: (item: MenuItemData, portion: Portion) => void;
    onUpdateQty: (id: string, delta: number) => void;
}) {
    const [selectedPortion, setSelectedPortion] = useState<Portion>('Full');
    const cartKey = `${item._id}_${selectedPortion}`;
    const cartItem = cart.find((c) => c.id === cartKey);
    const currentPrice = getPortionPrice(item, selectedPortion);

    return (
        <div className="group bg-white border border-border hover:border-gold/30 transition-all duration-300 overflow-hidden flex flex-col">
            {/* Dish Image */}
            {item.image && (
                <div className="relative aspect-16/10 overflow-hidden">
                    <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 300px"
                        unoptimized
                    />
                    {/* Veg badge */}
                    <div className="absolute top-3 left-3">
                        <span className={`w-5 h-5 rounded-sm border-2 ${item.isVeg ? 'border-green-600' : 'border-red-500'
                            } flex items-center justify-center bg-white/90`}>
                            <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-500'
                                }`} />
                        </span>
                    </div>
                </div>
            )}

            {/* Info */}
            <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-serif text-base text-charcoal mb-1 group-hover:text-gold transition-colors duration-300">
                    {item.name}
                </h3>
                <p className="text-stone text-xs leading-relaxed mb-3 flex-1">{item.description}</p>

                {/* Portion Dropdown + Price */}
                <div className="flex items-center gap-3 mb-3">
                    <select
                        value={selectedPortion}
                        onChange={(e) => setSelectedPortion(e.target.value as Portion)}
                        className="px-3 py-1.5 border border-border bg-ivory text-xs text-charcoal focus:border-gold outline-none cursor-pointer appearance-none"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%238A8579' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 6px center', backgroundSize: '16px', paddingRight: '28px' }}
                    >
                        {portions.map((p) => (
                            <option key={p} value={p}>
                                {p} — ₹{getPortionPrice(item, p)}
                            </option>
                        ))}
                    </select>
                    <span className="text-charcoal font-semibold text-base">₹{currentPrice}</span>
                </div>

                {/* Add / Qty controls */}
                <div className="mt-auto">
                    {cartItem ? (
                        <div className="flex items-center justify-between border border-gold">
                            <button onClick={() => onUpdateQty(cartKey, -1)}
                                className="w-9 h-9 flex items-center justify-center text-charcoal hover:bg-ivory-warm transition-colors text-sm">−</button>
                            <span className="text-sm font-medium text-charcoal">{cartItem.quantity}</span>
                            <button onClick={() => onUpdateQty(cartKey, 1)}
                                className="w-9 h-9 flex items-center justify-center text-charcoal hover:bg-ivory-warm transition-colors text-sm">+</button>
                        </div>
                    ) : (
                        <button
                            onClick={() => onAdd(item, selectedPortion)}
                            className="w-full py-2 border border-charcoal text-charcoal text-xs tracking-widest uppercase hover:bg-charcoal hover:text-ivory transition-all duration-300"
                        >
                            Add to Cart
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
