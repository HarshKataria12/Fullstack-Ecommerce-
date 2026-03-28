import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Package, ChevronRight, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';

const statusConfig = {
    placed: { label: 'Placed', color: 'bg-blue-100 text-blue-700', icon: Clock },
    processing: { label: 'Processing', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-700', icon: Truck },
    delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: CheckCircle },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XCircle },
};

const MyOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/api/orders/myorders');
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
            setLoading(false);
        };
        fetchOrders();
    }, []);

    if (loading) return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
                ))}
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Orders</h1>

            {orders.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-xl text-gray-500 mb-2">No orders yet</p>
                    <p className="text-gray-400 mb-6">When you place an order, it will appear here.</p>
                    <Link to="/" className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => {
                        const status = statusConfig[order.status] || statusConfig.placed;
                        const StatusIcon = status.icon;
                        return (
                            <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-bold text-gray-900">{order.order_number}</h3>
                                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${status.color}`}>
                                                <StatusIcon className="w-3 h-3" /> {status.label}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            Placed on {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                        <div className="flex gap-2 mt-3 overflow-x-auto">
                                            {order.items?.slice(0, 4).map((item, idx) => (
                                                <img key={idx} src={item.product_image} alt={item.product_name}
                                                    className="w-12 h-12 object-cover rounded-lg border border-gray-200 flex-shrink-0" />
                                            ))}
                                            {order.items?.length > 4 && (
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-bold text-gray-500">
                                                    +{order.items.length - 4}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-xl font-extrabold text-gray-900">€{Number(order.total).toFixed(2)}</p>
                                            <p className="text-xs text-gray-500">{order.items?.reduce((a, i) => a + i.quantity, 0)} item(s)</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                    </div>
                                </div>

                                {/* Order Status Tracker */}
                                {order.status !== 'cancelled' && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <div className="flex items-center justify-between">
                                            {['placed', 'processing', 'shipped', 'delivered'].map((step, idx) => {
                                                const stepOrder = ['placed', 'processing', 'shipped', 'delivered'];
                                                const currentIdx = stepOrder.indexOf(order.status);
                                                const isCompleted = idx <= currentIdx;
                                                const isCurrent = idx === currentIdx;
                                                return (
                                                    <div key={step} className="flex items-center flex-1">
                                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${isCompleted ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'} ${isCurrent ? 'ring-2 ring-blue-300' : ''}`}>
                                                            {isCompleted ? '✓' : idx + 1}
                                                        </div>
                                                        {idx < 3 && (
                                                            <div className={`flex-1 h-0.5 mx-1 ${idx < currentIdx ? 'bg-blue-600' : 'bg-gray-200'}`} />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="flex justify-between mt-1">
                                            {['Placed', 'Processing', 'Shipped', 'Delivered'].map((label) => (
                                                <span key={label} className="text-xs text-gray-500">{label}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyOrdersPage;