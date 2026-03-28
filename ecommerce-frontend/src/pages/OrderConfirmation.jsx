import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const OrderConfirmation = () => {
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const last = localStorage.getItem('lastOrder');
        if (!last) { navigate('/'); return; }
        setOrder(JSON.parse(last));
    }, [navigate]);

    if (!order) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Order Confirmed!</h1>
                <p className="text-gray-600 text-lg">Thank you for your purchase</p>
                <p className="text-gray-500 mt-1">Order #: <strong className="text-blue-600">{order.orderNumber}</strong></p>
                <p className="text-sm text-gray-400 mt-1">
                    {new Date(order.orderDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl border p-6 mb-6">
                <h2 className="text-lg font-bold mb-4">Order Summary</h2>
                <div className="space-y-3 mb-4 pb-4 border-b">
                    {order.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <span className="text-gray-500 text-sm">{item.qty || 1}x</span>
                                <span className="font-medium text-sm">{item.name}</span>
                            </div>
                            <span className="text-sm">€{((item.qty || 1) * Number(item.price)).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>€{order.subtotal?.toFixed(2)}</span></div>
                    <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{order.shippingCost === 0 ? 'FREE' : `€${order.shippingCost?.toFixed(2)}`}</span></div>
                    {order.tax > 0 && <div className="flex justify-between text-gray-600"><span>Tax</span><span>€{order.tax?.toFixed(2)}</span></div>}
                    {order.promoDiscount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-€{order.promoDiscount?.toFixed(2)}</span></div>}
                    <div className="flex justify-between font-bold text-xl pt-2 border-t"><span>Total</span><span className="text-blue-600">€{order.total?.toFixed(2)}</span></div>
                </div>
            </div>

            {/* Shipping */}
            {order.shippingAddress && (
                <div className="bg-white rounded-xl border p-6 mb-6">
                    <h2 className="text-lg font-bold mb-3">Shipping To</h2>
                    <div className="text-sm text-gray-600 space-y-1">
                        <p className="font-medium text-gray-900">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                        <p>{order.shippingAddress.shippingAddressLine}</p>
                        <p>{order.shippingAddress.shippingCity}, {order.shippingAddress.shippingState} {order.shippingAddress.shippingPostalCode}</p>
                        <p>{order.shippingAddress.shippingCountry}</p>
                    </div>
                </div>
            )}

            {/* Payment */}
            {order.paymentMethod && (
                <div className="bg-white rounded-xl border p-6 mb-6">
                    <h2 className="text-lg font-bold mb-3">Payment</h2>
                    <p className="text-sm text-gray-600">
                        {order.paymentMethod.method}
                        {order.paymentMethod.cardLast4 && ` — ${order.paymentMethod.cardType} •••• ${order.paymentMethod.cardLast4}`}
                    </p>
                </div>
            )}

            <div className="flex gap-4">
                <Link to="/my-orders" className="flex-1 text-center bg-white border border-gray-200 text-gray-700 py-3.5 rounded-xl font-bold hover:bg-gray-50 transition">
                    View My Orders
                </Link>
                <Link to="/" className="flex-1 text-center bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition">
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
};

export default OrderConfirmation;