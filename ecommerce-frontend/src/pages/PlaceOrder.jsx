import { useContext, useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../api';

const PlaceOrder = () => {
    const { clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [orderData, setOrderData] = useState(null);
    const [isPlacing, setIsPlacing] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (location.state?.orderData) {
            setOrderData(location.state.orderData);
        } else {
            navigate('/payment');
        }
    }, [location, navigate]);

    if (!orderData) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    const { subtotal, shippingCost, promoDiscount, finalTotal, shippingAddress, paymentMethod, cartItems } = orderData;
    const tax = Number((0.15 * subtotal).toFixed(2));
    const totalWithTax = finalTotal + tax;

    const handlePlaceOrder = async () => {
        setIsPlacing(true);
        setError('');
        try {
            let newOrderNumber = '';

            if (user) {
                // Submit to backend API — saves to MySQL
                const { data } = await api.post('/api/orders', {
                    items: cartItems,
                    subtotal,
                    shippingCost,
                    tax,
                    discount: promoDiscount,
                    total: totalWithTax,
                    shippingAddress,
                    paymentMethod
                });
                newOrderNumber = data.orderNumber;
            } else {
                // Guest checkout — simulate
                await new Promise(r => setTimeout(r, 1500));
                newOrderNumber = 'ORD-' + Math.random().toString(36).substring(2, 10).toUpperCase();
            }

            setOrderNumber(newOrderNumber);

            // Save for confirmation page
            localStorage.setItem('lastOrder', JSON.stringify({
                orderNumber: newOrderNumber,
                items: cartItems,
                subtotal, shippingCost, tax,
                promoDiscount, total: totalWithTax,
                shippingAddress, paymentMethod,
                orderDate: new Date().toISOString()
            }));

            clearCart();
            setOrderComplete(true);
            setTimeout(() => navigate('/order-confirmation'), 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place order. Please try again.');
            setIsPlacing(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Progress */}
            <div className="flex justify-center items-center mb-10">
                <div className="flex items-center space-x-3 md:space-x-6">
                    {[{ n: 1, label: 'Cart' }, { n: 2, label: 'Checkout' }, { n: 3, label: 'Payment' }, { n: 4, label: 'Place Order', active: true }].map((step, idx) => (
                        <div key={step.n} className="flex items-center">
                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">{step.n}</div>
                                <span className={`text-xs mt-1 font-semibold ${step.active ? 'text-gray-900 border-b-2 border-gray-900 pb-0.5' : 'text-blue-600'}`}>{step.label}</span>
                            </div>
                            {idx < 3 && <div className="w-10 md:w-16 h-0.5 mx-1 bg-blue-600" />}
                        </div>
                    ))}
                </div>
            </div>

            {!orderComplete ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Shipping Review */}
                        <div className="bg-white p-6 rounded-xl border shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-lg font-bold">Shipping Details</h2>
                                <Link to="/shipping" className="text-blue-600 text-sm font-semibold hover:underline">Edit</Link>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p><strong>Name:</strong> {shippingAddress?.firstName} {shippingAddress?.lastName}</p>
                                <p><strong>Email:</strong> {shippingAddress?.email}</p>
                                <p><strong>Address:</strong> {shippingAddress?.shippingAddressLine}, {shippingAddress?.shippingCity}, {shippingAddress?.shippingPostalCode}, {shippingAddress?.shippingCountry}</p>
                                <p><strong>Method:</strong> {shippingAddress?.shippingMethod || 'Standard'}</p>
                            </div>
                        </div>

                        {/* Payment Review */}
                        <div className="bg-white p-6 rounded-xl border shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-lg font-bold">Payment Method</h2>
                                <Link to="/payment" className="text-blue-600 text-sm font-semibold hover:underline">Edit</Link>
                            </div>
                            <p className="text-sm text-gray-600">
                                {paymentMethod?.method}
                                {paymentMethod?.cardLast4 && ` (${paymentMethod.cardType} ending in ${paymentMethod.cardLast4})`}
                            </p>
                        </div>

                        {/* Items Review */}
                        <div className="bg-white p-6 rounded-xl border shadow-sm">
                            <h2 className="text-lg font-bold mb-4">Order Items</h2>
                            {cartItems?.map((item, i) => (
                                <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                                    <div className="flex items-center gap-4">
                                        <img src={item.image_url} alt={item.name} className="w-14 h-14 object-cover rounded-lg border" />
                                        <div>
                                            <Link to={`/product/${item.id}`} className="text-blue-600 hover:underline font-medium text-sm">{item.name}</Link>
                                            <p className="text-xs text-gray-500">Qty: {item.qty || 1}</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-sm">€{((item.qty || 1) * Number(item.price)).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 p-6 rounded-xl border sticky top-24">
                            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between"><span>Items</span><span>€{subtotal?.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span>Shipping</span><span>{shippingCost === 0 ? 'FREE' : `€${shippingCost?.toFixed(2)}`}</span></div>
                                <div className="flex justify-between"><span>Tax (15%)</span><span>€{tax.toFixed(2)}</span></div>
                                {promoDiscount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-€{promoDiscount.toFixed(2)}</span></div>}
                                <div className="border-t pt-3 flex justify-between text-xl font-extrabold">
                                    <span>Total</span><span>€{totalWithTax.toFixed(2)}</span>
                                </div>
                            </div>

                            {error && <div className="mt-4 bg-red-50 border border-red-200 p-3 rounded-lg text-sm text-red-600">{error}</div>}

                            {!user && (
                                <div className="mt-4 bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-sm text-yellow-700">
                                    <Link to="/login" className="font-semibold underline">Sign in</Link> to save your order history.
                                </div>
                            )}

                            <button onClick={handlePlaceOrder} disabled={isPlacing}
                                className={`w-full py-4 rounded-xl font-bold mt-6 transition ${isPlacing ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                                {isPlacing ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                                        Processing...
                                    </span>
                                ) : 'Place Order'}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Order Placed Successfully!</h2>
                    <p className="text-gray-600 mb-4">Order: <strong className="text-blue-600">{orderNumber}</strong></p>
                    <p className="text-sm text-gray-400">Redirecting to confirmation...</p>
                </div>
            )}
        </div>
    );
};

export default PlaceOrder;