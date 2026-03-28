import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';

const CartPage = () => {
    const { cartItems, removeFromCart, updateCartQty, cartTotal, cartCount } = useContext(CartContext);

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl shadow-sm border">
                    <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-xl text-gray-500 mb-2">Your cart is empty</p>
                    <p className="text-gray-400 mb-6">Start shopping to add items to your cart.</p>
                    <Link to="/" className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition">
                        Browse Products
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-grow space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border">
                                <img src={item.image_url} alt={item.name} className="w-20 h-20 object-cover rounded-lg border" />
                                <div className="flex-1 min-w-0">
                                    <Link to={`/product/${item.id}`} className="font-bold text-gray-900 hover:text-blue-600 transition truncate block">
                                        {item.name}
                                    </Link>
                                    <p className="text-blue-600 font-semibold mt-1">€{Number(item.price).toFixed(2)}</p>
                                </div>
                                <div className="flex items-center border border-gray-200 rounded-lg">
                                    <button onClick={() => updateCartQty(item.id, (item.qty || 1) - 1)} className="p-2 hover:bg-gray-50"><Minus className="w-3.5 h-3.5" /></button>
                                    <span className="px-3 font-bold text-sm">{item.qty || 1}</span>
                                    <button onClick={() => updateCartQty(item.id, (item.qty || 1) + 1)} className="p-2 hover:bg-gray-50"><Plus className="w-3.5 h-3.5" /></button>
                                </div>
                                <p className="font-bold text-lg w-24 text-right">€{(Number(item.price) * (item.qty || 1)).toFixed(2)}</p>
                                <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 p-2"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        ))}
                    </div>

                    <div className="lg:w-80 bg-white p-6 rounded-xl shadow-sm border h-fit sticky top-24">
                        <h2 className="text-xl font-bold mb-4 pb-4 border-b">Order Summary</h2>
                        <div className="space-y-3 mb-4">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal ({cartCount} items)</span>
                                <span className="font-semibold text-gray-900">€{cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span className="text-sm text-gray-400">Calculated at checkout</span>
                            </div>
                        </div>
                        <div className="flex justify-between text-xl font-extrabold pt-4 border-t">
                            <span>Total</span>
                            <span>€{cartTotal.toFixed(2)}</span>
                        </div>
                        <Link to="/shipping">
                            <button className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-blue-700 transition mt-6">
                                Proceed to Checkout
                            </button>
                        </Link>
                        <Link to="/" className="block text-center text-sm text-blue-600 font-semibold mt-4 hover:underline">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;