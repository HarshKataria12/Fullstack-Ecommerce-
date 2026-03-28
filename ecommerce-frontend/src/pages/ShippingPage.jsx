import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const ShippingPage = () => {
    const { shippingAddress, saveShippingAddress, cartItems, cartTotal } = useContext(CartContext);
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState(shippingAddress.firstName || '');
    const [lastName, setLastName] = useState(shippingAddress.lastName || '');
    const [email, setEmail] = useState(shippingAddress.email || '');
    const [confirmEmail, setConfirmEmail] = useState(shippingAddress.confirmEmail || '');
    const [phone, setPhone] = useState(shippingAddress.phone || '');
    const [shippingAddressLine, setShippingAddressLine] = useState(shippingAddress.shippingAddressLine || '');
    const [shippingCity, setShippingCity] = useState(shippingAddress.shippingCity || '');
    const [shippingState, setShippingState] = useState(shippingAddress.shippingState || '');
    const [shippingPostalCode, setShippingPostalCode] = useState(shippingAddress.shippingPostalCode || '');
    const [shippingCountry, setShippingCountry] = useState(shippingAddress.shippingCountry || '');
    const [shippingCost, setShippingCost] = useState(shippingAddress.shippingCost || 5.00);
    const [shippingMethod, setShippingMethod] = useState(shippingAddress.shippingMethod || 'Standard');
    const [promoCode, setPromoCode] = useState('');
    const [promoDiscount, setPromoDiscount] = useState(0);
    const [promoMessage, setPromoMessage] = useState('');
    const [promoApplied, setPromoApplied] = useState(false);
    const [errors, setErrors] = useState({});

    const validPromoCodes = {
        'WELCOME10': { discount: 0.10, type: 'percentage', message: '10% discount applied!' },
        'SAVE20': { discount: 20, type: 'fixed', message: '€20 discount applied!' },
        'FREESHIP': { discount: 0, type: 'free_shipping', message: 'Free shipping applied!' }
    };

    let finalShippingCost = shippingCost;
    let discountAmount = 0;
    if (promoApplied && validPromoCodes[promoCode.toUpperCase()]) {
        const promo = validPromoCodes[promoCode.toUpperCase()];
        if (promo.type === 'percentage') discountAmount = cartTotal * promo.discount;
        else if (promo.type === 'fixed') discountAmount = promo.discount;
        else if (promo.type === 'free_shipping') finalShippingCost = 0;
    }
    const finalTotal = cartTotal - discountAmount + finalShippingCost;

    const applyPromoCode = () => {
        const upper = promoCode.toUpperCase();
        if (validPromoCodes[upper]) {
            setPromoApplied(true);
            setPromoMessage(validPromoCodes[upper].message);
            const promo = validPromoCodes[upper];
            if (promo.type === 'percentage') setPromoDiscount(cartTotal * promo.discount);
            else if (promo.type === 'fixed') setPromoDiscount(promo.discount);
            else setPromoDiscount(0);
        } else {
            setPromoApplied(false);
            setPromoMessage('Invalid promo code');
            setPromoDiscount(0);
        }
    };

    const getDeliveryEstimate = (method) => {
        const today = new Date();
        let min, max;
        if (method === 'Expedited') { min = 1; max = 2; }
        else if (method === 'Economy') { min = 5; max = 8; }
        else { min = 3; max = 5; }
        const start = new Date(today); start.setDate(today.getDate() + min);
        const end = new Date(today); end.setDate(today.getDate() + max);
        return `${start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`;
    };

    const validateForm = () => {
        const e = {};
        if (!firstName.trim()) e.firstName = 'Required';
        if (!lastName.trim()) e.lastName = 'Required';
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email = 'Valid email required';
        if (email !== confirmEmail) e.confirmEmail = 'Emails do not match';
        if (!phone.trim()) e.phone = 'Required';
        if (!shippingAddressLine.trim()) e.shippingAddressLine = 'Required';
        if (!shippingCity.trim()) e.shippingCity = 'Required';
        if (!shippingState.trim()) e.shippingState = 'Required';
        if (!shippingPostalCode.trim()) e.shippingPostalCode = 'Required';
        if (!shippingCountry.trim()) e.shippingCountry = 'Required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const submitHandler = (e) => {
        e.preventDefault();
        if (validateForm()) {
            saveShippingAddress({
                firstName, lastName, email, phone,
                shippingAddressLine, shippingCity, shippingState, shippingPostalCode, shippingCountry,
                shippingMethod, shippingCost: finalShippingCost,
                promoCode: promoApplied ? promoCode : null,
                promoDiscount: discountAmount, finalTotal
            });
            navigate('/payment');
        } else {
            window.scrollTo(0, 0);
        }
    };

    const europeanCountries = ['Germany', 'United Kingdom', 'France', 'Italy', 'Spain', 'Netherlands', 'Ireland', 'Sweden', 'Austria', 'Belgium'];

    const InputField = ({ label, value, onChange, error, type = 'text', ...rest }) => (
        <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm">{label} *</label>
            <input type={type} value={value} onChange={onChange}
                className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm transition ${error ? 'border-red-500 bg-red-50' : 'border-gray-300'}`} {...rest} />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Progress */}
            <div className="flex justify-center items-center mb-10">
                <div className="flex items-center space-x-3 md:space-x-6">
                    {[{ n: 1, label: 'Cart', done: true }, { n: 2, label: 'Checkout', active: true }, { n: 3, label: 'Payment' }, { n: 4, label: 'Place Order' }].map((step, idx) => (
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
                {/* Form */}
                <div className="lg:col-span-2">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6">Checkout</h1>
                    <form onSubmit={submitHandler} className="space-y-8">
                        {/* Contact */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                            <h2 className="text-lg font-extrabold text-gray-900 mb-4">Contact Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} error={errors.firstName} />
                                <InputField label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} error={errors.lastName} />
                                <InputField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
                                <InputField label="Confirm Email" type="email" value={confirmEmail} onChange={(e) => setConfirmEmail(e.target.value)} error={errors.confirmEmail} />
                                <div className="md:col-span-2">
                                    <InputField label="Phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} error={errors.phone} />
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                            <h2 className="text-lg font-extrabold text-gray-900 mb-4">Shipping Address</h2>
                            <div className="space-y-4">
                                <InputField label="Street Address" value={shippingAddressLine} onChange={(e) => setShippingAddressLine(e.target.value)} error={errors.shippingAddressLine} />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField label="City" value={shippingCity} onChange={(e) => setShippingCity(e.target.value)} error={errors.shippingCity} />
                                    <InputField label="State/Province" value={shippingState} onChange={(e) => setShippingState(e.target.value)} error={errors.shippingState} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField label="Postal Code" value={shippingPostalCode} onChange={(e) => setShippingPostalCode(e.target.value)} error={errors.shippingPostalCode} />
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2 text-sm">Country *</label>
                                        <select value={shippingCountry} onChange={(e) => setShippingCountry(e.target.value)}
                                            className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm ${errors.shippingCountry ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}>
                                            <option value="">Select Country</option>
                                            {europeanCountries.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                        {errors.shippingCountry && <p className="text-red-500 text-xs mt-1">{errors.shippingCountry}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Method */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                            <h2 className="text-lg font-extrabold text-gray-900 mb-4">Delivery Method</h2>
                            <div className="space-y-3">
                                {[
                                    { method: 'Standard', price: 5, label: 'Standard Shipping' },
                                    { method: 'Expedited', price: 15, label: 'Expedited Shipping' },
                                    { method: 'Economy', price: 0, label: 'Economy (Free)' }
                                ].map(({ method, price, label }) => (
                                    <label key={method} className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition ${shippingMethod === method ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                                        <div className="flex items-center gap-3">
                                            <input type="radio" checked={shippingMethod === method}
                                                onChange={() => { setShippingMethod(method); setShippingCost(price); }}
                                                className="w-4 h-4 text-blue-600" />
                                            <div>
                                                <span className="block font-bold text-gray-900 text-sm">{label}</span>
                                                <span className="block text-xs text-gray-500">Arrives {getDeliveryEstimate(method)}</span>
                                            </div>
                                        </div>
                                        <span className={`font-bold text-sm ${price === 0 ? 'text-green-600' : ''}`}>
                                            {price === 0 ? 'FREE' : `€${price.toFixed(2)}`}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Promo */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                            <h2 className="text-lg font-extrabold text-gray-900 mb-4">Promo Code</h2>
                            <div className="flex gap-3">
                                <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value)}
                                    className="flex-1 p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none" placeholder="WELCOME10, SAVE20, FREESHIP" />
                                <button type="button" onClick={applyPromoCode} className="px-6 py-3 bg-gray-800 text-white rounded-xl font-semibold text-sm hover:bg-gray-900 transition">Apply</button>
                            </div>
                            {promoMessage && <p className={`text-sm mt-2 ${promoApplied ? 'text-green-600' : 'text-red-500'}`}>{promoMessage}</p>}
                        </div>

                        <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-extrabold text-lg hover:bg-blue-700 transition shadow-md">
                            Continue to Payment →
                        </button>
                    </form>
                </div>

                {/* Order Summary Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-50 rounded-xl border border-gray-200 sticky top-24 p-6">
                        <h2 className="text-xl font-extrabold text-gray-900 mb-4">Order Summary</h2>
                        <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                            {cartItems.map((item) => (
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
                            <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-semibold">€{cartTotal.toFixed(2)}</span></div>
                            {discountAmount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-€{discountAmount.toFixed(2)}</span></div>}
                            <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span className={`font-semibold ${finalShippingCost === 0 ? 'text-green-600' : ''}`}>{finalShippingCost === 0 ? 'FREE' : `€${finalShippingCost.toFixed(2)}`}</span></div>
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

export default ShippingPage;