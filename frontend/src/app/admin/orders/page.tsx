'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/lib/api';

interface OrderItem {
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
    portion?: string;
}

interface OrderType {
    _id: string;
    orderNumber: string;
    items: OrderItem[];
    customerName: string;
    phone: string;
    email: string;
    address: string;
    notes: string;
    total: number;
    orderType: string;
    tableNumber: string;
    status: string;
    createdAt: string;
}

const statusFlow = ['Pending', 'Confirmed', 'Preparing', 'Completed', 'Cancelled'] as const;

const statusColors: Record<string, string> = {
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
    Preparing: 'bg-orange-50 text-orange-700 border-orange-200',
    Completed: 'bg-green-50 text-green-700 border-green-200',
    Cancelled: 'bg-red-50 text-red-700 border-red-200',
};

const statusIcons: Record<string, string> = {
    Pending: '⏳',
    Confirmed: '✓',
    Preparing: '🍳',
    Completed: '✅',
    Cancelled: '✕',
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<OrderType[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCompleted, setShowCompleted] = useState(false);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    const fetchOrders = useCallback(async () => {
        try {
            const res = await apiFetch('/api/orders');
            const data = await res.json();
            if (Array.isArray(data)) setOrders(data);
        } catch { /* ignore */ } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    // Refresh every 5s for real-time feel
    useEffect(() => {
        const interval = setInterval(fetchOrders, 5000);
        return () => clearInterval(interval);
    }, [fetchOrders]);

    const updateStatus = async (id: string, status: string) => {
        await apiFetch(`/api/orders/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });
        fetchOrders();
    };

    // Filter: show only active orders by default
    const activeOrders = orders.filter((o) => o.status !== 'Completed' && o.status !== 'Cancelled');
    const completedOrders = orders.filter((o) => o.status === 'Completed' || o.status === 'Cancelled');
    const displayOrders = showCompleted ? completedOrders : activeOrders;

    const getNextStatus = (current: string): string | null => {
        const idx = statusFlow.indexOf(current as typeof statusFlow[number]);
        if (idx === -1 || idx >= statusFlow.length - 2) return null; // No next after Preparing  
        return statusFlow[idx + 1];
    };

    function formatTime(d: string) {
        return new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    }

    function formatDate(d: string) {
        return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    }

    function timeSince(d: string) {
        const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
        if (mins < 1) return 'Just now';
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        return `${hrs}h ${mins % 60}m ago`;
    }

    if (loading) return <div className="text-stone text-sm">Loading...</div>;

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div>
                    <h1 className="font-serif text-2xl text-charcoal">
                        Orders
                        <span className="text-sm text-stone font-sans ml-2">
                            ({activeOrders.length} active)
                        </span>
                    </h1>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setShowCompleted(false)}
                        className={`px-4 py-2 text-xs tracking-[0.1em] uppercase transition-colors ${!showCompleted
                            ? 'bg-charcoal text-ivory'
                            : 'border border-border text-stone hover:text-charcoal'
                            }`}
                    >
                        Active ({activeOrders.length})
                    </button>
                    <button
                        onClick={() => setShowCompleted(true)}
                        className={`px-4 py-2 text-xs tracking-[0.1em] uppercase transition-colors ${showCompleted
                            ? 'bg-charcoal text-ivory'
                            : 'border border-border text-stone hover:text-charcoal'
                            }`}
                    >
                        Completed ({completedOrders.length})
                    </button>
                    <button
                        onClick={fetchOrders}
                        className="px-3 py-2 border border-border text-stone hover:text-charcoal text-xs transition-colors"
                        title="Refresh"
                    >
                        ↻
                    </button>
                </div>
            </div>

            {/* Orders */}
            <div className="space-y-3">
                {displayOrders.map((order) => {
                    const nextStatus = getNextStatus(order.status);
                    const isExpanded = expandedOrder === order._id;

                    return (
                        <div key={order._id} className="bg-white border border-border overflow-hidden">
                            {/* Order Header — clickable */}
                            <button
                                onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                                className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 hover:bg-ivory/50 transition-colors text-left gap-3 sm:gap-4"
                            >
                                <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto flex-1 min-w-0">
                                    {/* Status icon */}
                                    <span className="text-lg flex-shrink-0 self-start sm:self-center">
                                        {statusIcons[order.status] || '•'}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                            <span className="text-xs text-gold font-medium">
                                                #{order.orderNumber || '—'}
                                            </span>
                                            <span className={`text-[10px] px-2 py-0.5 tracking-wider uppercase border ${statusColors[order.status] || ''}`}>
                                                {order.status}
                                            </span>
                                            <span className="text-[10px] text-stone bg-ivory-warm px-1.5 py-0.5 uppercase">
                                                {order.orderType}
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium text-charcoal truncate">
                                            {order.customerName}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between w-full sm:w-auto gap-4 flex-shrink-0 mt-2 sm:mt-0 pt-2 sm:pt-0 border-t border-border/50 sm:border-0 pl-8 sm:pl-0">
                                    <div className="text-left sm:text-right flex sm:block items-center gap-3">
                                        <p className="text-sm font-semibold text-charcoal">₹{order.total}</p>
                                        <p className="text-[10px] text-stone">{timeSince(order.createdAt)}</p>
                                    </div>
                                    <span className="text-stone text-xs ml-auto sm:ml-0">{isExpanded ? '▲' : '▼'}</span>
                                </div>
                            </button>

                            {/* Expanded Details */}
                            {isExpanded && (
                                <div className="border-t border-border">
                                    {/* Customer Info */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-5 py-4 bg-ivory/30">
                                        <div>
                                            <span className="text-[10px] text-stone tracking-wider uppercase block">Phone</span>
                                            <a href={`tel:${order.phone}`} className="text-sm text-charcoal hover:text-gold">{order.phone}</a>
                                        </div>
                                        {order.email && (
                                            <div>
                                                <span className="text-[10px] text-stone tracking-wider uppercase block">Email</span>
                                                <p className="text-sm text-charcoal truncate">{order.email}</p>
                                            </div>
                                        )}
                                        <div>
                                            <span className="text-[10px] text-stone tracking-wider uppercase block">Time</span>
                                            <p className="text-sm text-charcoal">{formatDate(order.createdAt)} · {formatTime(order.createdAt)}</p>
                                        </div>
                                        {order.tableNumber && (
                                            <div>
                                                <span className="text-[10px] text-stone tracking-wider uppercase block">Table</span>
                                                <p className="text-sm text-charcoal">{order.tableNumber}</p>
                                            </div>
                                        )}
                                        {order.address && (
                                            <div className="col-span-2">
                                                <span className="text-[10px] text-stone tracking-wider uppercase block">Address</span>
                                                <p className="text-sm text-charcoal">{order.address}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Items */}
                                    <div className="px-5 py-4">
                                        <div className="space-y-1.5 mb-3">
                                            {order.items.map((item, i) => (
                                                <div key={i} className="flex justify-between text-sm">
                                                    <span className="text-stone">
                                                        {item.name}
                                                        {item.portion && item.portion !== 'Full' && (
                                                            <span className="text-gold text-xs ml-1">({item.portion})</span>
                                                        )}
                                                        <span className="text-stone/50 ml-1">× {item.quantity}</span>
                                                    </span>
                                                    <span className="text-charcoal font-medium">₹{item.price * item.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-between text-sm font-medium pt-2 border-t border-border">
                                            <span className="text-charcoal">Total</span>
                                            <span className="text-charcoal text-base">₹{order.total}</span>
                                        </div>
                                        {order.notes && (
                                            <p className="text-xs text-stone italic mt-3 p-2 bg-ivory-warm">📝 {order.notes}</p>
                                        )}
                                    </div>

                                    {/* Status Actions */}
                                    <div className="px-5 py-4 bg-ivory/30 border-t border-border">
                                        {(order.status === 'Completed' || order.status === 'Cancelled') ? (
                                            <div className="flex items-center gap-3 text-sm text-stone">
                                                <span className="text-base">{order.status === 'Completed' ? '🔒' : '🚫'}</span>
                                                <span>This order is <strong className="text-charcoal">{order.status.toLowerCase()}</strong> and cannot be modified.</span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-wrap gap-2">
                                                {/* Primary action: advance to next status */}
                                                {nextStatus && (
                                                    <button
                                                        onClick={() => updateStatus(order._id, nextStatus)}
                                                        className="px-5 py-2 bg-gold text-white text-xs tracking-[0.1em] uppercase hover:bg-gold-dark transition-colors flex items-center gap-2"
                                                    >
                                                        {statusIcons[nextStatus]} Mark as {nextStatus}
                                                    </button>
                                                )}

                                                {/* Complete button — skip ahead */}
                                                {nextStatus !== 'Completed' && (
                                                    <button
                                                        onClick={() => updateStatus(order._id, 'Completed')}
                                                        className="px-4 py-2 border border-green-300 text-green-700 text-xs tracking-[0.05em] uppercase hover:bg-green-50 transition-colors"
                                                    >
                                                        ✅ Complete
                                                    </button>
                                                )}

                                                {/* Cancel */}
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Cancel this order? This cannot be undone.')) updateStatus(order._id, 'Cancelled');
                                                    }}
                                                    className="px-4 py-2 border border-red-200 text-red-400 text-xs tracking-[0.05em] uppercase hover:bg-red-50 hover:text-red-600 transition-colors ml-auto"
                                                >
                                                    Cancel Order
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {displayOrders.length === 0 && (
                    <div className="text-center p-12 bg-white border border-border">
                        <p className="text-stone text-sm">
                            {showCompleted
                                ? 'No completed or cancelled orders yet.'
                                : 'No active orders right now. All clear! 🎉'
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
