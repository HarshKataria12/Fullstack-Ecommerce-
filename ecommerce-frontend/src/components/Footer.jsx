import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-400 mt-16">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">Tech<span className="text-blue-500">Market</span></h3>
                        <p className="text-sm leading-relaxed">Your one-stop destination for premium tech products at competitive prices.</p>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Shop</h4>
                        <div className="space-y-2 text-sm">
                            <Link to="/" className="block hover:text-white transition">All Products</Link>
                            <Link to="/categories" className="block hover:text-white transition">Categories</Link>
                            <Link to="/?sort=newest" className="block hover:text-white transition">New Arrivals</Link>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Account</h4>
                        <div className="space-y-2 text-sm">
                            <Link to="/login" className="block hover:text-white transition">Sign In</Link>
                            <Link to="/register" className="block hover:text-white transition">Create Account</Link>
                            <Link to="/my-orders" className="block hover:text-white transition">Order History</Link>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Support</h4>
                        <div className="space-y-2 text-sm">
                            <p>Email: support@techmarket.com</p>
                            <p>Phone: +49 123 456 789</p>
                            <p>Mon-Fri: 9:00 - 18:00 CET</p>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} TechMarket. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;