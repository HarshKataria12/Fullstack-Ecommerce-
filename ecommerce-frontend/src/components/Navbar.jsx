import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ShoppingCart, User, LogOut, Package, LayoutDashboard, Menu, X, Search } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cartCount } = useContext(CartContext);
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/?keyword=${keyword}`);
            setSearchOpen(false);
            setKeyword('');
        }
    };

    const handleLogout = () => {
        logout();
        setUserMenuOpen(false);
        navigate('/');
    };

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2 font-extrabold text-xl text-gray-900">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                <path d="M2 17l10 5 10-5" />
                                <path d="M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <span>Tech<span className="text-blue-600">Market</span></span>
                    </Link>

                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium text-sm">Products</Link>
                        <Link to="/categories" className="text-gray-600 hover:text-gray-900 font-medium text-sm">Categories</Link>
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100">
                            <Search className="w-5 h-5" />
                        </button>

                        <Link to="/cart" className="relative p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100">
                            <ShoppingCart className="w-5 h-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="relative">
                                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
                                    <div className="w-7 h-7 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="hidden md:inline text-sm font-medium">{user.name}</span>
                                </button>

                                {userMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                        <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                                            <User className="w-4 h-4" /> Profile
                                        </Link>
                                        <Link to="/my-orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                                            <Package className="w-4 h-4" /> My Orders
                                        </Link>
                                        {user.role === 'admin' && (
                                            <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50">
                                                <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                                            </Link>
                                        )}
                                        <div className="border-t border-gray-100 mt-1 pt-1">
                                            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full">
                                                <LogOut className="w-4 h-4" /> Sign Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                                Sign In
                            </Link>
                        )}

                        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-gray-500 hover:text-gray-900">
                            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {searchOpen && (
                    <div className="pb-4">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)}
                                placeholder="Search products..." autoFocus
                                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <button type="submit" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700">Search</button>
                        </form>
                    </div>
                )}

                {menuOpen && (
                    <div className="md:hidden pb-4 border-t border-gray-100 pt-3 space-y-2">
                        <Link to="/" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium">Products</Link>
                        <Link to="/categories" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium">Categories</Link>
                    </div>
                )}
            </div>

            {userMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />}
        </nav>
    );
};

export default Navbar;