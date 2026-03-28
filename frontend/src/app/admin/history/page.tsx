'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/lib/api';

interface OrderItem {
    name: string;
    price: number;
    quantity: number;
    portion: string;
}

interface OrderData {
    _id: string;
    orderNumber: string;
    items: OrderItem[];
    customerName: string;
    phone: string;
    email: string;
    orderType: string;
    total: number;
    status: string;
    createdAt: string;
}

interface DailyStats {
    totalRevenue: number;
    totalOrders: number;
    dailyRevenue: number;
    completedOrders: number;
    cancelledOrders: number;
    dineInOrders: number;
    takeawayOrders: number;
    deliveryOrders: number;
}

function formatDate(d: string) {
    return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatTime(d: string) {
    return new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function getDateString(date: Date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export default function AdminHistoryPage() {
    const [orders, setOrders] = useState<OrderData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(getDateString(new Date()));
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterType, setFilterType] = useState('All');
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

    // Real-time polling
    useEffect(() => {
        const interval = setInterval(fetchOrders, 5000);
        return () => clearInterval(interval);
    }, [fetchOrders]);

    // Filter orders by date
    const dateOrders = orders.filter((o) => {
        const orderDate = getDateString(new Date(o.createdAt));
        return orderDate === selectedDate;
    });

    // Apply status & type filters
    const filteredOrders = dateOrders.filter((o) => {
        if (filterStatus !== 'All' && o.status !== filterStatus) return false;
        if (filterType !== 'All' && o.orderType !== filterType) return false;
        return true;
    });

    // Calculate stats
    const stats: DailyStats = {
        totalRevenue: dateOrders.filter(o => o.status === 'Completed').reduce((s, o) => s + o.total, 0),
        totalOrders: dateOrders.length,
        dailyRevenue: dateOrders.reduce((s, o) => s + o.total, 0),
        completedOrders: dateOrders.filter(o => o.status === 'Completed').length,
        cancelledOrders: dateOrders.filter(o => o.status === 'Cancelled').length,
        dineInOrders: dateOrders.filter(o => o.orderType === 'Dine-in').length,
        takeawayOrders: dateOrders.filter(o => o.orderType === 'Takeaway').length,
        deliveryOrders: dateOrders.filter(o => o.orderType === 'Delivery').length,
    };

    const statusColors: Record<string, string> = {
        Pending: 'bg-yellow-100 text-yellow-800',
        Confirmed: 'bg-blue-100 text-blue-800',
        Preparing: 'bg-orange-100 text-orange-800',
        Completed: 'bg-green-100 text-green-800',
        Cancelled: 'bg-red-100 text-red-800',
    };

    if (loading) return <div className="text-stone text-sm">Loading...</div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="font-serif text-2xl text-charcoal">Order History</h1>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-4 py-2 border border-border bg-ivory text-sm text-charcoal focus:border-gold outline-none"
                />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white border border-border p-5">
                    <p className="text-xs text-stone tracking-wider uppercase mb-1">Revenue</p>
                    <p className="text-2xl font-semibold text-charcoal">₹{stats.totalRevenue.toLocaleString()}</p>
                    <p className="text-[10px] text-stone mt-1">{stats.completedOrders} completed</p>
                </div>
                <div className="bg-white border border-border p-5">
                    <p className="text-xs text-stone tracking-wider uppercase mb-1">Orders</p>
                    <p className="text-2xl font-semibold text-charcoal">{stats.totalOrders}</p>
                    <p className="text-[10px] text-stone mt-1">{stats.cancelledOrders} cancelled</p>
                </div>
                <div className="bg-white border border-border p-5">
                    <p className="text-xs text-stone tracking-wider uppercase mb-1">Daily Revenue</p>
                    <p className="text-2xl font-semibold text-charcoal">₹{stats.dailyRevenue.toLocaleString()}</p>
                    <p className="text-[10px] text-stone mt-1">All orders total</p>
                </div>
                <div className="bg-white border border-border p-5">
                    <p className="text-xs text-stone tracking-wider uppercase mb-1">By Type</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                        <span className="text-xs text-charcoal">{stats.dineInOrders} <span className="text-stone">Dine</span></span>
                        <span className="text-xs text-charcoal">{stats.takeawayOrders} <span className="text-stone">Take</span></span>
                        <span className="text-xs text-charcoal">{stats.deliveryOrders} <span className="text-stone">Del</span></span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3 mb-6 flex-wrap">
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-border bg-ivory text-xs text-charcoal focus:border-gold outline-none">
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-2 border border-border bg-ivory text-xs text-charcoal focus:border-gold outline-none">
                    <option value="All">All Types</option>
                    <option value="Dine-in">Dine-in</option>
                    <option value="Takeaway">Takeaway</option>
                    <option value="Delivery">Delivery</option>
                </select>
                <span className="text-xs text-stone self-center ml-auto">
                    {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
                </span>
            </div>

            {/* Order List */}
            <div className="space-y-3">
                {filteredOrders.map((order) => (
                    <div key={order._id} className="bg-white border border-border overflow-hidden">
                        {/* Header Row */}
                        <button
                            onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                            className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 hover:bg-ivory-warm/50 transition-colors text-left gap-3 sm:gap-4"
                        >
                            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 w-full">
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                        <span className="text-xs text-gold font-medium">#{order.orderNumber || '—'}</span>
                                        <span className={`text-[10px] px-2 py-0.5 tracking-wider uppercase ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                                            {order.status}
                                        </span>
                                        <span className="text-[10px] text-stone bg-ivory-warm px-2 py-0.5 uppercase">
                                            {order.orderType}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-charcoal truncate">{order.customerName}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between w-full sm:w-auto gap-4 shrink-0 mt-2 sm:mt-0 pt-2 sm:pt-0 border-t border-border/50 sm:border-0">
                                <span className="text-sm font-medium text-charcoal">₹{order.total}</span>
                                <span className="text-xs text-stone">{formatTime(order.createdAt)}</span>
                                <span className="text-stone text-xs ml-auto sm:ml-0">{expandedOrder === order._id ? '▲' : '▼'}</span>
                            </div>
                        </button>

                        {/* Expanded Details */}
                        {expandedOrder === order._id && (
                            <div className="border-t border-border p-5 bg-ivory/50">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                                    <div>
                                        <span className="text-[10px] text-stone tracking-wider uppercase block">Customer</span>
                                        <p className="text-sm text-charcoal">{order.customerName}</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-stone tracking-wider uppercase block">Phone</span>
                                        <p className="text-sm text-charcoal">{order.phone}</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-stone tracking-wider uppercase block">Email</span>
                                        <p className="text-sm text-charcoal">{order.email || '—'}</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-stone tracking-wider uppercase block">Order Type</span>
                                        <p className="text-sm text-charcoal">{order.orderType}</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-stone tracking-wider uppercase block">Date & Time</span>
                                        <p className="text-sm text-charcoal">{formatDate(order.createdAt)} · {formatTime(order.createdAt)}</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-stone tracking-wider uppercase block">Status</span>
                                        <p className="text-sm text-charcoal">{order.status}</p>
                                    </div>
                                </div>

                                {/* Items Table */}
                                <div className="border border-border bg-white overflow-x-auto">
                                    <table className="w-full text-sm min-w-100">
                                        <thead>
                                            <tr className="border-b border-border">
                                                <th className="text-left text-[10px] text-stone tracking-wider uppercase px-4 py-2.5">Item</th>
                                                <th className="text-center text-[10px] text-stone tracking-wider uppercase px-4 py-2.5">Portion</th>
                                                <th className="text-center text-[10px] text-stone tracking-wider uppercase px-4 py-2.5">Qty</th>
                                                <th className="text-right text-[10px] text-stone tracking-wider uppercase px-4 py-2.5">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.items.map((item, i) => (
                                                <tr key={i} className="border-b border-border/50">
                                                    <td className="px-4 py-2.5 text-charcoal max-w-37.5 truncate">{item.name}</td>
                                                    <td className="px-4 py-2.5 text-center text-stone">{item.portion || 'Full'}</td>
                                                    <td className="px-4 py-2.5 text-center text-charcoal">{item.quantity}</td>
                                                    <td className="px-4 py-2.5 text-right text-charcoal">₹{item.price * item.quantity}</td>
                                                </tr>
                                            ))}
                                            <tr className="font-medium">
                                                <td colSpan={3} className="px-4 py-3 text-charcoal">Total</td>
                                                <td className="px-4 py-3 text-right text-charcoal text-base">₹{order.total}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {filteredOrders.length === 0 && (
                    <p className="text-stone text-sm p-8 bg-white border border-border text-center">
                        No orders found for {formatDate(selectedDate + 'T00:00:00')}.
                    </p>
                )}
            </div>
        </div>
    );
}
