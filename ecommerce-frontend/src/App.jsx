import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from './context/CartContext';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import CartPage from './pages/CartPage.jsx';

function App() {
  const { cartItems } = useContext(CartContext);
  
  // Calculate total number of items in the cart
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
        <nav className="bg-white shadow-sm p-4 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <Link to="/" className="text-2xl font-black tracking-tighter text-gray-900">
              FAST<span className="text-blue-600">CART</span>
            </Link>
            <div className="flex gap-6 text-gray-600 font-medium items-center">
              <Link to="/" className="hover:text-blue-600 transition">Home</Link>
              <Link to="/login" className="hover:text-blue-600 transition">Login</Link>
              <Link to="/cart" className="hover:text-blue-600 transition flex items-center gap-1">
                Cart 
                {totalItems > 0 && (
                  <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </nav>

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;