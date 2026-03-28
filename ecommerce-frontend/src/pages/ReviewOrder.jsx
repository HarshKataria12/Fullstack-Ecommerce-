// src/pages/ReviewOrder.jsx (simplified for testing)
import { useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const ReviewOrder = () => {
  const { shippingAddress, paymentMethod, cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🎉 REVIEW ORDER PAGE LOADED SUCCESSFULLY! 🎉');
    console.log('Shipping Address:', shippingAddress);
    console.log('Payment Method:', paymentMethod);
    console.log('Cart Items:', cartItems);
  }, [shippingAddress, paymentMethod, cartItems]);

  // Calculate totals
  const subtotal = cartItems?.reduce((total, item) => total + (Number(item.price) * (item.qty || 1)), 0) || 0;
  const shippingCost = shippingAddress?.shippingCost || 5.00;
  const promoDiscount = shippingAddress?.promoDiscount || 0;
  const finalTotal = subtotal + shippingCost - promoDiscount;

  const handleProceedToPlaceOrder = () => {
    navigate('/place-order', { 
      state: { 
        orderData: {
          subtotal,
          shippingCost,
          promoDiscount,
          finalTotal,
          shippingAddress,
          paymentMethod,
          cartItems
        }
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 mt-6">
      {/* PROGRESS INDICATOR */}
      <div className="flex justify-center items-center mb-10">
        <div className="flex items-center space-x-2 md:space-x-6">
          <div className="flex flex-col items-center cursor-pointer" onClick={() => navigate('/cart')}>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">1</div>
            <span className="text-xs mt-1 text-blue-600 font-semibold">Cart</span>
          </div>
          <div className="w-12 md:w-16 h-0.5 bg-blue-600"></div>
          <div className="flex flex-col items-center cursor-pointer" onClick={() => navigate('/shipping')}>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">2</div>
            <span className="text-xs mt-1 text-blue-600 font-semibold">Checkout</span>
          </div>
          <div className="w-12 md:w-16 h-0.5 bg-blue-600"></div>
          <div className="flex flex-col items-center cursor-pointer" onClick={() => navigate('/payment')}>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">3</div>
            <span className="text-xs mt-1 text-blue-600 font-semibold">Payment</span>
          </div>
          <div className="w-12 md:w-16 h-0.5 bg-blue-600"></div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">4</div>
            <span className="text-xs mt-1 text-gray-900 font-semibold border-b-2 border-gray-900 pb-1">Review</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">Review Your Order</h1>
          <p className="text-gray-600">Please verify your details before placing the order</p>
        </div>

        {/* Shipping Information */}
        <div className="border-t border-gray-200 pt-6 mb-6">
          <h2 className="text-lg font-extrabold text-gray-900 mb-4">Shipping Information</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p><strong>Name:</strong> {shippingAddress?.firstName} {shippingAddress?.lastName}</p>
            <p><strong>Email:</strong> {shippingAddress?.email}</p>
            <p><strong>Phone:</strong> {shippingAddress?.phone}</p>
            <p><strong>Address:</strong> {shippingAddress?.shippingAddressLine} {shippingAddress?.shippingApt && `, ${shippingAddress.shippingApt}`}</p>
            <p><strong>City:</strong> {shippingAddress?.shippingCity}, {shippingAddress?.shippingState} {shippingAddress?.shippingPostalCode}</p>
            <p><strong>Country:</strong> {shippingAddress?.shippingCountry}</p>
            <p><strong>Shipping Method:</strong> {shippingAddress?.shippingMethod || 'Standard'} ({shippingAddress?.shippingCost === 0 ? 'FREE' : `€${shippingAddress?.shippingCost}`})</p>
          </div>
        </div>

        {/* Payment Information */}
        <div className="border-t border-gray-200 pt-6 mb-6">
          <h2 className="text-lg font-extrabold text-gray-900 mb-4">Payment Information</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p><strong>Method:</strong> {paymentMethod?.method}</p>
            {paymentMethod?.cardLast4 && (
              <p><strong>Card:</strong> •••• {paymentMethod.cardLast4} ({paymentMethod.cardType})</p>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="border-t border-gray-200 pt-6 mb-6">
          <h2 className="text-lg font-extrabold text-gray-900 mb-4">Order Items</h2>
          <div className="space-y-3">
            {cartItems?.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <img src={item.image_url} alt={item.name} className="w-12 h-12 object-cover rounded" />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.qty || 1}</p>
                  </div>
                </div>
                <p className="font-bold">€{((item.qty || 1) * Number(item.price)).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="border-t border-gray-200 pt-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Promo Discount</span>
                  <span>-€{promoDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'FREE' : `€${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span className="text-blue-600">€{finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Link 
            to="/payment" 
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold text-center hover:bg-gray-300 transition"
          >
            Back to Payment
          </Link>
          <button 
            onClick={handleProceedToPlaceOrder}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewOrder;