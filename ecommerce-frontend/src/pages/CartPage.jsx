import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const CartPage = () => {
  const { cartItems, removeFromCart } = useContext(CartContext);

  // Calculate the total price of everything in the cart
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.qty, 0);

  return (
    <div className="max-w-6xl mx-auto p-8 mt-6">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
          <p className="text-xl text-gray-500 mb-4">Your cart is currently empty.</p>
          <Link to="/" className="text-blue-600 font-bold hover:underline">
            &larr; Start Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items List */}
          <div className="flex-grow space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border">
                <div className="flex items-center gap-4">
                  <img src={item.image_url} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                  <div>
                    <Link to={`/product/${item.id}`} className="font-bold text-lg hover:text-blue-600">
                      {item.name}
                    </Link>
                    <p className="text-gray-500">Qty: {item.qty}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <p className="font-bold text-lg">${(item.price * item.qty).toFixed(2)}</p>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 font-bold"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Checkout Box */}
          <div className="lg:w-1/3 bg-white p-6 rounded-xl shadow-sm border h-fit sticky top-24">
            <h2 className="text-xl font-bold mb-4 border-b pb-4">Order Summary</h2>
            <div className="flex justify-between mb-4 text-lg">
              <span className="text-gray-600">Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
              <span className="font-bold">${cartTotal.toFixed(2)}</span>
            </div>
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;