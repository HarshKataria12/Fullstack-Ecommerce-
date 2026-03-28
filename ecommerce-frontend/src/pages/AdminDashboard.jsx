import { useState, useEffect } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Plus, Pencil, Trash2, X } from 'lucide-react';

const AdminDashboard = () => {
    const [tab, setTab] = useState('dashboard');
    const [stats, setStats] = useState(null);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showProductForm, setShowProductForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productForm, setProductForm] = useState({ name: '', description: '', price: '', stock_quantity: '', image_url: '', category_id: '' });

    useEffect(() => { fetchData(); }, [tab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (tab === 'dashboard') {
                const { data } = await api.get('/api/orders/stats/dashboard');
                setStats(data);
            } else if (tab === 'products') {
                const [prodRes, catRes] = await Promise.all([api.get('/api/products?limit=100'), api.get('/api/categories')]);
                setProducts(prodRes.data.products);
                setCategories(catRes.data);
            } else if (tab === 'orders') {
                const { data } = await api.get('/api/orders/all');
                setOrders(data.orders);
            } else if (tab === 'users') {
                const { data } = await api.get('/api/users');
                setUsers(data);
            }
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await api.put(`/api/products/${editingProduct.id}`, productForm);
            } else {
                await api.post('/api/products', productForm);
            }
            setShowProductForm(false);
            setEditingProduct(null);
            setProductForm({ name: '', description: '', price: '', stock_quantity: '', image_url: '', category_id: '' });
            fetchData();
        } catch (err) { console.error(err); }
    };

    const editProduct = (p) => {
        setEditingProduct(p);
        setProductForm({ name: p.name, description: p.description, price: p.price, stock_quantity: p.stock_quantity, image_url: p.image_url, category_id: p.category_id || '' });
        setShowProductForm(true);
    };

    const deleteProduct = async (id) => {
        if (!window.confirm('Delete this product?')) return;
        await api.delete(`/api/products/${id}`);
        fetchData();
    };

    const updateOrderStatus = async (id, status) => {
        await api.put(`/api/orders/${id}/status`, { status });
        fetchData();
    };

    const deleteUser = async (id) => {
        if (!window.confirm('Delete this user?')) return;
        await api.delete(`/api/users/${id}`);
        fetchData();
    };

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'products', label: 'Products', icon: Package },
        { id: 'orders', label: 'Orders', icon: ShoppingCart },
        { id: 'users', label: 'Users', icon: Users },
    ];

    const statusColors = {
        placed: 'bg-blue-100 text-blue-700', processing: 'bg-yellow-100 text-yellow-700',
        shipped: 'bg-purple-100 text-purple-700', delivered: 'bg-green-100 text-green-700',
        cancelled: 'bg-red-100 text-red-700'
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Admin Dashboard</h1>

            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                {tabs.map((t) => (
                    <button key={t.id} onClick={() => setTab(t.id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition whitespace-nowrap ${tab === t.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                        <t.icon className="w-4 h-4" /> {t.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>
            ) : (
                <>
                    {/* DASHBOARD TAB */}
                    {tab === 'dashboard' && stats && (
                        <div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                {[
                                    { label: 'Total Revenue', value: `€${Number(stats.revenue).toLocaleString('en', { minimumFractionDigits: 2 })}`, color: 'bg-green-50 text-green-700' },
                                    { label: 'Total Orders', value: stats.totalOrders, color: 'bg-blue-50 text-blue-700' },
                                    { label: 'Total Users', value: stats.totalUsers, color: 'bg-purple-50 text-purple-700' },
                                    { label: 'Total Products', value: stats.totalProducts, color: 'bg-orange-50 text-orange-700' },
                                ].map((s) => (
                                    <div key={s.label} className={`${s.color} rounded-xl p-6`}>
                                        <p className="text-sm font-semibold opacity-75">{s.label}</p>
                                        <p className="text-3xl font-extrabold mt-1">{s.value}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                <div className="bg-white rounded-xl border p-6">
                                    <h3 className="font-bold text-lg mb-4">Orders by Status</h3>
                                    <div className="space-y-3">
                                        {stats.ordersByStatus?.map((s) => (
                                            <div key={s.status} className="flex items-center justify-between">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[s.status] || 'bg-gray-100'}`}>{s.status}</span>
                                                <span className="font-bold">{s.count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl border p-6">
                                    <h3 className="font-bold text-lg mb-4">Top Selling Products</h3>
                                    <div className="space-y-3">
                                        {stats.topProducts?.map((p, i) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <span className="text-sm text-gray-700 truncate flex-1">{p.product_name}</span>
                                                <span className="text-sm font-bold text-gray-500 ml-2">{p.total_sold} sold</span>
                                                <span className="text-sm font-bold text-blue-600 ml-4">€{Number(p.total_revenue).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border p-6">
                                <h3 className="font-bold text-lg mb-4">Recent Orders</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead><tr className="text-left text-gray-500 border-b">
                                            <th className="pb-3 font-semibold">Order #</th><th className="pb-3 font-semibold">Customer</th>
                                            <th className="pb-3 font-semibold">Total</th><th className="pb-3 font-semibold">Status</th><th className="pb-3 font-semibold">Date</th>
                                        </tr></thead>
                                        <tbody>
                                            {stats.recentOrders?.map((o) => (
                                                <tr key={o.id} className="border-b last:border-0">
                                                    <td className="py-3 font-medium">{o.order_number}</td>
                                                    <td className="py-3 text-gray-600">{o.user_name || 'Guest'}</td>
                                                    <td className="py-3 font-bold">€{Number(o.total).toFixed(2)}</td>
                                                    <td className="py-3"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[o.status]}`}>{o.status}</span></td>
                                                    <td className="py-3 text-gray-500">{new Date(o.created_at).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PRODUCTS TAB */}
                    {tab === 'products' && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <p className="text-gray-600">{products.length} products</p>
                                <button onClick={() => { setShowProductForm(true); setEditingProduct(null); setProductForm({ name: '', description: '', price: '', stock_quantity: '', image_url: '', category_id: '' }); }}
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
                                    <Plus className="w-4 h-4" /> Add Product
                                </button>
                            </div>

                            {showProductForm && (
                                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-xl font-bold">{editingProduct ? 'Edit Product' : 'New Product'}</h3>
                                            <button onClick={() => setShowProductForm(false)}><X className="w-5 h-5" /></button>
                                        </div>
                                        <form onSubmit={handleProductSubmit} className="space-y-4">
                                            <input type="text" placeholder="Product Name" required value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                                className="w-full p-3 border rounded-xl text-sm" />
                                            <textarea placeholder="Description" rows={3} value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                                className="w-full p-3 border rounded-xl text-sm" />
                                            <div className="grid grid-cols-2 gap-4">
                                                <input type="number" step="0.01" placeholder="Price" required value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                                                    className="w-full p-3 border rounded-xl text-sm" />
                                                <input type="number" placeholder="Stock" required value={productForm.stock_quantity} onChange={(e) => setProductForm({ ...productForm, stock_quantity: e.target.value })}
                                                    className="w-full p-3 border rounded-xl text-sm" />
                                            </div>
                                            <input type="text" placeholder="Image URL" value={productForm.image_url} onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                                                className="w-full p-3 border rounded-xl text-sm" />
                                            <select value={productForm.category_id} onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                                                className="w-full p-3 border rounded-xl text-sm">
                                                <option value="">Select Category</option>
                                                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
                                                {editingProduct ? 'Update Product' : 'Create Product'}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            )}

                            <div className="bg-white rounded-xl border overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead><tr className="text-left text-gray-500 bg-gray-50 border-b">
                                            <th className="p-4 font-semibold">Product</th><th className="p-4 font-semibold">Category</th>
                                            <th className="p-4 font-semibold">Price</th><th className="p-4 font-semibold">Stock</th>
                                            <th className="p-4 font-semibold">Rating</th><th className="p-4 font-semibold">Actions</th>
                                        </tr></thead>
                                        <tbody>
                                            {products.map((p) => (
                                                <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <img src={p.image_url} alt="" className="w-10 h-10 object-cover rounded-lg border" />
                                                            <span className="font-medium truncate max-w-[200px]">{p.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-gray-600">{p.category_name || '—'}</td>
                                                    <td className="p-4 font-bold">€{Number(p.price).toFixed(2)}</td>
                                                    <td className="p-4"><span className={`font-semibold ${p.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>{p.stock_quantity}</span></td>
                                                    <td className="p-4 text-gray-600">{p.rating} ({p.num_reviews})</td>
                                                    <td className="p-4">
                                                        <div className="flex gap-2">
                                                            <button onClick={() => editProduct(p)} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg"><Pencil className="w-4 h-4" /></button>
                                                            <button onClick={() => deleteProduct(p.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ORDERS TAB */}
                    {tab === 'orders' && (
                        <div className="bg-white rounded-xl border overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead><tr className="text-left text-gray-500 bg-gray-50 border-b">
                                        <th className="p-4 font-semibold">Order #</th><th className="p-4 font-semibold">Customer</th>
                                        <th className="p-4 font-semibold">Items</th><th className="p-4 font-semibold">Total</th>
                                        <th className="p-4 font-semibold">Status</th><th className="p-4 font-semibold">Date</th>
                                        <th className="p-4 font-semibold">Action</th>
                                    </tr></thead>
                                    <tbody>
                                        {orders.map((o) => (
                                            <tr key={o.id} className="border-b last:border-0 hover:bg-gray-50">
                                                <td className="p-4 font-medium">{o.order_number}</td>
                                                <td className="p-4 text-gray-600">{o.user_name || o.shipping_email || 'Guest'}</td>
                                                <td className="p-4">{o.items?.length || 0}</td>
                                                <td className="p-4 font-bold">€{Number(o.total).toFixed(2)}</td>
                                                <td className="p-4"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[o.status]}`}>{o.status}</span></td>
                                                <td className="p-4 text-gray-500">{new Date(o.created_at).toLocaleDateString()}</td>
                                                <td className="p-4">
                                                    <select value={o.status} onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                                                        className="text-xs border rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                        {['placed', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                                                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* USERS TAB */}
                    {tab === 'users' && (
                        <div className="bg-white rounded-xl border overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead><tr className="text-left text-gray-500 bg-gray-50 border-b">
                                        <th className="p-4 font-semibold">Name</th><th className="p-4 font-semibold">Email</th>
                                        <th className="p-4 font-semibold">Role</th><th className="p-4 font-semibold">Joined</th>
                                        <th className="p-4 font-semibold">Actions</th>
                                    </tr></thead>
                                    <tbody>
                                        {users.map((u) => (
                                            <tr key={u.id} className="border-b last:border-0 hover:bg-gray-50">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">{u.name?.charAt(0).toUpperCase()}</div>
                                                        <span className="font-medium">{u.name}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-gray-600">{u.email}</td>
                                                <td className="p-4"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>{u.role}</span></td>
                                                <td className="p-4 text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td>
                                                <td className="p-4">
                                                    <button onClick={() => deleteUser(u.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg" title="Delete user">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminDashboard;