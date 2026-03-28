import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const PaymentPage = () => {
    const { shippingAddress, savePaymentMethod, cartItems, cartTotal } = useContext(CartContext);
    const navigate = useNavigate();

    const [selectedMethod, setSelectedMethod] = useState('Credit Card');
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [errors, setErrors] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (!shippingAddress || !shippingAddress.shippingAddressLine) navigate('/shipping');
    }, [shippingAddress, navigate]);

    const subtotal = cartTotal;
    const shippingCost = shippingAddress?.shippingCost || 5.00;
    const promoDiscount = shippingAddress?.promoDiscount || 0;
    const finalTotal = subtotal + shippingCost - promoDiscount;

    const formatCardNumber = (v) => {
        const clean = v.replace(/\D/g, '').substring(0, 16);
        return clean.replace(/(.{4})/g, '$1 ').trim();
    };

    const formatExpiry = (v) => {
        const clean = v.replace(/\D/g, '').substring(0, 4);
        return clean.length > 2 ? clean.substring(0, 2) + '/' + clean.substring(2) : clean;
    };

    const getCardType = (num) => {
        const n = num.replace(/\s/g, '');
        if (n.startsWith('4')) return 'Visa';
        if (n.startsWith('5')) return 'Mastercard';
        if (n.startsWith('3')) return 'Amex';
        return 'Card';
    };

    const validate = () => {
        const e = {};
        if (selectedMethod === 'Credit Card') {
            const clean = cardNumber.replace(/\s/g, '');
            if (!clean || clean.length < 16) e.cardNumber = 'Valid 16-digit card number required';
            if (!cardName.trim()) e.cardName = 'Name on card is required';
            if (!expiryDate || expiryDate.length < 5) e.expiryDate = 'Use MM/YY format';
            if (!cvv || cvv.length < 3) e.cvv = 'Valid CVV required';
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setIsProcessing(true);
        await new Promise(r => setTimeout(r, 1200));

        const paymentData = {
            method: selectedMethod,
            ...(selectedMethod === 'Credit Card' && {
                cardLast4: cardNumber.replace(/\s/g, '').slice(-4),
                cardType: getCardType(cardNumber)
            })
        };
        savePaymentMethod(paymentData);

        navigate('/place-order', {
            state: {
                orderData: { subtotal, shippingCost, promoDiscount, finalTotal, shippingAddress, paymentMethod: paymentData, cartItems }
            }
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Progress */}
            <div className="flex justify-center items-center mb-10">
                <div className="flex items-center space-x-3 md:space-x-6">
                    {[{ n: 1, label: 'Cart', done: true }, { n: 2, label: 'Checkout', done: true }, { n: 3, label: 'Payment', active: true }, { n: 4, label: 'Place Order' }].map((step, idx) => (
                        <div key={step.n} className="flex items-center">
                            <div className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step.done || step.active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>{step.n}</div>
                                <span className={`text-xs mt-1 font-semibold ${step.active ? 'text-gray-900 border-b-2 border-gray-900 pb-0.5' : step.done ? 'text-blue-600' : 'text-gray-400'}`}>{step.label}</span>
                            </div>
                            {idx < 3 && <div className={`w-10 md:w-16 h-0.5 mx-1 ${step.done ? 'bg-blue-600' : 'bg-gray-200'}`} />}
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6">Payment Method</h1>
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Credit Card */}
                            <label className={`flex items-start p-5 border rounded-xl cursor-pointer transition ${selectedMethod === 'Credit Card' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                                <input type="radio" value="Credit Card" checked={selectedMethod === 'Credit Card'} onChange={(e) => setSelectedMethod(e.target.value)} className="w-5 h-5 mt-1 text-blue-600" />
                                <div className="ml-4 flex-1">
                                    <span className="font-bold text-gray-900 text-lg">Credit / Debit Card</span>
                                    <p className="text-sm text-gray-500">Pay securely with Visa, Mastercard, or Amex</p>
                                </div>
                            </label>

                            {selectedMethod === 'Credit Card' && (
                                <div className="ml-9 space-y-4">
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2 text-sm">Card Number *</label>
                                        <input type="text" value={cardNumber} onChange={(e) => setCardNumber(formatCardNumber(e.target.value))} maxLength="19" placeholder="1234 5678 9012 3456"
                                            className={`w-full p-3 border rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'}`} />
                                        {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2 text-sm">Name on Card *</label>
                                        <input type="text" value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="JOHN DOE"
                                            className={`w-full p-3 border rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none ${errors.cardName ? 'border-red-500' : 'border-gray-300'}`} />
                                        {errors.cardName && <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2 text-sm">Expiry *</label>
                                            <input type="text" value={expiryDate} onChange={(e) => setExpiryDate(formatExpiry(e.target.value))} maxLength="5" placeholder="MM/YY"
                                                className={`w-full p-3 border rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'}`} />
                                            {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2 text-sm">CVV *</label>
                                            <input type="password" value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))} maxLength="4" placeholder="123"
                                                className={`w-full p-3 border rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none ${errors.cvv ? 'border-red-500' : 'border-gray-300'}`} />
                                            {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                                        </div>
                                    </div>
                                    <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-700">
                                        <strong>Test card:</strong> 4242 4242 4242 4242 | Exp: 12/27 | CVV: 123
                                    </div>
                                </div>
                            )}

                            {/* PayPal */}
                            <label className={`flex items-center p-5 border rounded-xl cursor-pointer transition ${selectedMethod === 'PayPal' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                                <input type="radio" value="PayPal" checked={selectedMethod === 'PayPal'} onChange={(e) => setSelectedMethod(e.target.value)} className="w-5 h-5 text-blue-600" />
                                <div className="ml-4">
                                    <span className="font-bold text-gray-900 text-lg">PayPal</span>
                                    <p className="text-sm text-gray-500">Pay quickly with your PayPal account</p>
                                </div>
                            </label>

                            <Link to="/shipping" className="text-blue-600 hover:text-blue-700 text-sm font-semibold inline-block">← Back to shipping</Link>

                            <button type="submit" disabled={isProcessing}
                                className={`w-full py-4 rounded-xl font-extrabold text-lg transition shadow-md flex items-center justify-center gap-2 ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                                {isProcessing ? (
                                    <><span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span> Processing...</>
                                ) : 'Continue to Place Order →'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-50 rounded-xl border border-gray-200 sticky top-24 p-6">
                        <h2 className="text-xl font-extrabold text-gray-900 mb-4">Order Summary</h2>
                        <div className="space-y-3 mb-4 max-h-52 overflow-y-auto">
                            {cartItems?.map((item) => (
                                <div key={item.id} className="flex gap-3">
                                    <div className="relative flex-shrink-0">
                                        <img src={item.image_url} alt={item.name} className="w-14 h-14 object-cover rounded-lg border" />
                                        <span className="absolute -top-1.5 -right-1.5 bg-gray-700 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">{item.qty || 1}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-bold text-gray-800 truncate">{item.name}</h3>
                                        <p className="text-sm text-gray-500">€{Number(item.price).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="border-t pt-4 space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-semibold">€{subtotal.toFixed(2)}</span></div>
                            {promoDiscount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-€{promoDiscount.toFixed(2)}</span></div>}
                            <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span>{shippingCost === 0 ? 'FREE' : `€${shippingCost.toFixed(2)}`}</span></div>
                        </div>
                        <div className="border-t pt-4 mt-3 flex justify-between">
                            <span className="text-lg font-extrabold">Total</span>
                            <span className="text-2xl font-extrabold">€{finalTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;