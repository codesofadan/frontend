"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { orderAPI } from "@/lib/api";

export default function OrdersManagement() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchOrders = React.useCallback(async () => {
        setLoading(true);
        setError("");
        setPage(1);
        setHasMore(true);
        try {
            const filters = { page: 1, limit: 10 };
            if (filterStatus !== "all") {
                filters.status = filterStatus;
            }
            const res = await orderAPI.getAll(filters);
            if (res.success) {
                setOrders(res.data);
                setHasMore(res.data.length === 10);
            } else {
                setError(res.error || "Failed to fetch orders");
            }
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, [filterStatus]);

    const loadMoreOrders = React.useCallback(async () => {
        if (loadingMore || !hasMore) return;
        
        setLoadingMore(true);
        try {
            const nextPage = page + 1;
            const filters = { page: nextPage, limit: 10 };
            if (filterStatus !== "all") {
                filters.status = filterStatus;
            }
            const res = await orderAPI.getAll(filters);
            if (res.success) {
                if (res.data.length > 0) {
                    setOrders(prev => [...prev, ...res.data]);
                    setPage(nextPage);
                    setHasMore(res.data.length === 10);
                } else {
                    setHasMore(false);
                }
            }
        } catch (e) {
            console.error('Error loading more orders:', e);
        } finally {
            setLoadingMore(false);
        }
    }, [loadingMore, hasMore, page, filterStatus]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    useEffect(() => {
        if (loading || loadingMore || !hasMore) return;

        const handleScroll = () => {
            const scrollPosition = window.innerHeight + window.scrollY;
            const threshold = document.documentElement.scrollHeight - 500;
            
            if (scrollPosition >= threshold) {
                loadMoreOrders();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, loadingMore, hasMore, loadMoreOrders]);

    async function updateOrderStatus(orderId, newStatus) {
        try {
            const res = await orderAPI.updateStatus(orderId, newStatus);
            if (res.success) {
                setOrders(orders.map(order => 
                    order._id === orderId ? { ...order, status: newStatus } : order
                ));
                if (selectedOrder && selectedOrder._id === orderId) {
                    setSelectedOrder({ ...selectedOrder, status: newStatus });
                }
                alert('Order status updated successfully');
            } else {
                alert(res.error || 'Failed to update order status');
            }
        } catch (e) {
            alert(e.message);
        }
    }

    function getStatusColor(status) {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'confirmed': return 'bg-blue-100 text-blue-800';
            case 'ready': return 'bg-purple-100 text-purple-800';
            case 'dispatched': return 'bg-indigo-100 text-indigo-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-black';
        }
    }

    const filteredOrders = orders.filter(order => {
        const query = searchQuery.toLowerCase();
        return (
            order.orderNumber?.toLowerCase().includes(query) ||
            order.customerInfo?.firstName?.toLowerCase().includes(query) ||
            order.customerInfo?.lastName?.toLowerCase().includes(query) ||
            order.customerInfo?.phone?.includes(query)
        );
    });

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-6xl mx-auto bg-white rounded shadow p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-black">Orders Management</h1>
                    <a 
                        href="/admin"
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                        ← Back to Products
                    </a>
                </div>

                {/* Filters and Search */}
                <div className="mb-4 space-y-3">
                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search by order number, customer name, or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-black placeholder-black"
                    />

                    {/* Filter and Refresh Row */}
                    <div className="flex gap-2">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded text-black"
                        >
                            <option value="all">All Orders</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="ready">Ready</option>
                            <option value="dispatched">Dispatched</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>

                        <button
                            onClick={fetchOrders}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {/* Loading */}
                {loading ? (
                    <div className="text-center py-8">
                        <p className="text-black">Loading orders...</p>
                    </div>
                ) : (
                    <>
                        {/* Orders Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="px-4 py-2 text-left text-sm font-semibold border text-black">Order #</th>
                                        <th className="px-4 py-2 text-left text-sm font-semibold border text-black">Customer</th>
                                        <th className="px-4 py-2 text-left text-sm font-semibold border text-black">Date</th>
                                        <th className="px-4 py-2 text-left text-sm font-semibold border text-black">Total</th>
                                        <th className="px-4 py-2 text-left text-sm font-semibold border text-black">Status</th>
                                        <th className="px-4 py-2 text-left text-sm font-semibold border text-black">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-4 py-8 text-center text-black border">
                                                No orders found
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredOrders.map((order) => (
                                            <tr key={order._id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 border">
                                                    <span className="font-mono text-sm text-black">{order.orderNumber}</span>
                                                </td>
                                                <td className="px-4 py-3 border">
                                                    <div>
                                                        <p className="font-medium text-black">
                                                            {order.customerInfo?.firstName} {order.customerInfo?.lastName}
                                                        </p>
                                                        <p className="text-sm text-black">{order.customerInfo?.phone}</p>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm border text-black">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-3 font-semibold border text-black">
                                                    Rs {order.total?.toFixed(2)}
                                                </td>
                                                <td className="px-4 py-3 border">
                                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(order.status)}`}>
                                                        {order.status?.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 border">
                                                    <button
                                                        onClick={() => setSelectedOrder(order)}
                                                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                                    >
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Loading More Indicator */}
                        {loadingMore && (
                            <div className="flex justify-center items-center py-6 mt-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
                                <span className="ml-3 text-black">Loading more orders...</span>
                            </div>
                        )}
                        
                        {/* No More Orders Message */}
                        {!hasMore && filteredOrders.length > 0 && (
                            <div className="text-center py-6 mt-4 text-black">
                                All orders loaded.
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedOrder(null)}>
                    <div className="bg-white rounded shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-gray-200 p-4 border-b flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-black">Order Details</h2>
                                <p className="text-sm font-mono text-black">{selectedOrder.orderNumber}</p>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="text-black hover:text-black text-2xl font-bold"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Customer Info */}
                            <div className="border rounded p-4">
                                <h3 className="font-bold text-black mb-3">Customer Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-black">Name</p>
                                        <p className="font-medium text-black">
                                            {selectedOrder.customerInfo?.firstName} {selectedOrder.customerInfo?.lastName}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-black">Phone</p>
                                        <p className="font-medium text-black">{selectedOrder.customerInfo?.phone}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="border rounded p-4">
                                <h3 className="font-bold text-black mb-3">Shipping Address</h3>
                                <p className="text-black">
                                    {selectedOrder.shippingAddress?.street}<br />
                                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}<br />
                                    {selectedOrder.shippingAddress?.country}
                                </p>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h3 className="font-bold text-black mb-3">Order Items</h3>
                                <div className="border rounded">
                                    <table className="w-full">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-sm text-black">Product</th>
                                                <th className="px-4 py-2 text-left text-sm text-black">Shade</th>
                                                <th className="px-4 py-2 text-left text-sm text-black">Qty</th>
                                                <th className="px-4 py-2 text-right text-sm text-black">Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedOrder.items?.map((item, index) => (
                                                <tr key={index} className="border-t">
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                                                {item.image ? (
                                                                    <Image
                                                                        src={item.image}
                                                                        alt={item.name}
                                                                        width={48}
                                                                        height={48}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-black text-xs">
                                                                        No Image
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <span className="font-medium text-black block">{item.name}</span>
                                                                {item.selectedShade && (
                                                                    <span className="text-xs text-gray-600">Shade: {item.selectedShade.name}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {item.selectedShade ? (
                                                            <div className="flex items-center gap-2">
                                                                <div
                                                                    className="w-6 h-6 rounded border border-gray-300 flex-shrink-0"
                                                                    style={{ backgroundColor: item.selectedShade.code }}
                                                                    title={item.selectedShade.name}
                                                                ></div>
                                                                <span className="text-sm text-black">{item.selectedShade.name}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-black text-sm">No shade</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-black">{item.quantity}</td>
                                                    <td className="px-4 py-3 text-right font-semibold text-black">
                                                        Rs {(item.price * item.quantity).toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="border rounded p-4">
                                <h3 className="font-bold text-black mb-3">Order Summary</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-black">Subtotal:</span>
                                        <span className="font-medium text-black">Rs {selectedOrder.subtotal?.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-black">Shipping:</span>
                                        <span className="font-medium text-black">Rs {selectedOrder.shipping?.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-black">Tax (2%):</span>
                                        <span className="font-medium text-black">Rs {selectedOrder.tax?.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t pt-2 flex justify-between text-lg font-bold">
                                        <span className="text-black">Total:</span>
                                        <span className="text-black">Rs {selectedOrder.total?.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="flex items-center gap-2 text-sm">
                                <span className="font-semibold text-black">Payment Method:</span>
                                <span className="uppercase text-black">{selectedOrder.paymentMethod}</span>
                            </div>

                            {/* Notes */}
                            {selectedOrder.notes && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                                    <h3 className="text-sm font-bold mb-1 text-black">Order Notes</h3>
                                    <p className="text-sm text-black">{selectedOrder.notes}</p>
                                </div>
                            )}

                            {/* Status Update */}
                            <div className="border rounded p-4">
                                <h3 className="font-bold text-black mb-3">Update Order Status</h3>
                                <div className="flex flex-wrap gap-2">
                                    {['pending', 'confirmed', 'ready', 'dispatched', 'delivered', 'cancelled'].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => updateOrderStatus(selectedOrder._id, status)}
                                            className={`px-4 py-2 rounded font-medium ${
                                                selectedOrder.status === status
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-200 text-black hover:bg-gray-300'
                                            }`}
                                        >
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}