// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
        {/* Navigation Bar */}
        <nav className="bg-white shadow-sm p-4 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <Link to="/" className="text-2xl font-black tracking-tighter text-gray-900">
              FAST<span className="text-blue-600">CART</span>
            </Link>
            <div className="flex gap-6 text-gray-600 font-medium">
              <Link to="/" className="hover:text-blue-600 transition">Home</Link>
              <Link to="/login" className="hover:text-blue-600 transition">Login</Link>
              <Link to="/cart" className="hover:text-blue-600 transition flex items-center gap-1">
                Cart <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">0</span>
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;