import { useState, useEffect, useContext } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api';
import { CartContext } from '../context/CartContext';
import { ShoppingCart, Star, SlidersHorizontal, X } from 'lucide-react';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const { addToCart } = useContext(CartContext);
    const [searchParams, setSearchParams] = useSearchParams();

    const keyword = searchParams.get('keyword') || '';
    const category = searchParams.get('category') || '';
    const sort = searchParams.get('sort') || 'newest';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const params = { page, limit: 12 };
                if (keyword) params.keyword = keyword;
                if (category) params.category = category;
                if (sort) params.sort = sort;
                if (minPrice) params.minPrice = minPrice;
                if (maxPrice) params.maxPrice = maxPrice;

                const [productRes, categoryRes] = await Promise.all([
                    api.get('/api/products', { params }),
                    api.get('/api/categories')
                ]);

                setProducts(productRes.data.products);
                setTotalPages(productRes.data.pages);
                setTotal(productRes.data.total);
                setCategories(categoryRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            setLoading(false);
        };
        fetchData();
    }, [keyword, category, sort, minPrice, maxPrice, page]);

    const updateFilter = (key, value) => {
        const params = new URLSearchParams(searchParams);
        if (value) params.set(key, value);
        else params.delete(key);
        setSearchParams(params);
        setPage(1);
    };

    const clearFilters = () => {
        setSearchParams({});
        setPage(1);
    };

    const hasActiveFilters = keyword || category || minPrice || maxPrice || sort !== 'newest';

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Hero Banner */}
            {!keyword && !category && page === 1 && (
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 md:p-12 mb-10 text-white">
                    <h1 className="text-3xl md:text-4xl font-extrabold mb-3">Welcome to TechMarket</h1>
                    <p className="text-blue-100 text-lg mb-6 max-w-xl">Discover the latest in tech. From laptops to gaming gear — premium products at competitive prices.</p>
                    <Link to="/categories" className="inline-block bg-white text-blue-600 font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition">
                        Browse Categories
                    </Link>
                </div>
            )}

            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
                <button
                    onClick={() => updateFilter('category', '')}
                    className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition ${!category ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                    All Products
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => updateFilter('category', cat.id)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition ${String(category) === String(cat.id) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        {cat.name} ({cat.product_count})
                    </button>
                ))}
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <p className="text-gray-600 text-sm">
                        {keyword && <span>Results for "<strong>{keyword}</strong>" — </span>}
                        <strong>{total}</strong> product{total !== 1 ? 's' : ''}
                    </p>
                    {hasActiveFilters && (
                        <button onClick={clearFilters} className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1">
                            <X className="w-3 h-3" /> Clear Filters
                        </button>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={sort}
                        onChange={(e) => updateFilter('sort', e.target.value)}
                        className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="newest">Newest</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                        <option value="rating">Best Rating</option>
                        <option value="name">Name A-Z</option>
                    </select>
                    <button
                        onClick={() => setFiltersOpen(!filtersOpen)}
                        className="flex items-center gap-2 text-sm border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50"
                    >
                        <SlidersHorizontal className="w-4 h-4" /> Filters
                    </button>
                </div>
            </div>

            {/* Price Filters */}
            {filtersOpen && (
                <div className="bg-gray-50 rounded-xl p-4 mb-6 flex flex-wrap items-end gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Min Price (€)</label>
                        <input type="number" value={minPrice} onChange={(e) => updateFilter('minPrice', e.target.value)} className="w-28 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Max Price (€)</label>
                        <input type="number" value={maxPrice} onChange={(e) => updateFilter('maxPrice', e.target.value)} className="w-28 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="5000" />
                    </div>
                </div>
            )}

            {/* Loading */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-white border rounded-xl p-4 animate-pulse">
                            <div className="w-full h-48 bg-gray-200 rounded-lg mb-4" />
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                            <div className="h-3 bg-gray-200 rounded w-1/2" />
                        </div>
                    ))}
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border">
                    <p className="text-xl text-gray-500 mb-2">No products found.</p>
                    <p className="text-gray-400">Try adjusting your search or filters.</p>
                </div>
            ) : (
                <>
                    {/* Product Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div key={product.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition group flex flex-col">
                                <Link to={`/product/${product.id}`}>
                                    <div className="overflow-hidden">
                                        <img
                                            src={product.image_url || 'https://via.placeholder.com/300'}
                                            alt={product.name}
                                            className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                </Link>
                                <div className="p-4 flex flex-col flex-grow">
                                    {product.category_name && (
                                        <span className="text-xs text-blue-600 font-semibold mb-1">{product.category_name}</span>
                                    )}
                                    <Link to={`/product/${product.id}`}>
                                        <h3 className="font-bold text-gray-900 truncate hover:text-blue-600 transition">{product.name}</h3>
                                    </Link>
                                    <p className="text-gray-500 text-sm mt-1 line-clamp-2 flex-grow">{product.description}</p>
                                    <div className="flex items-center gap-1 mt-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                                        ))}
                                        <span className="text-xs text-gray-500 ml-1">({product.num_reviews})</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                                        <span className="text-lg font-extrabold text-blue-600">€{Number(product.price).toFixed(2)}</span>
                                        <button
                                            onClick={() => addToCart(product)}
                                            className="bg-gray-900 text-white p-2.5 rounded-lg hover:bg-gray-700 transition"
                                            title="Add to Cart"
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-10">
                            <button
                                onClick={() => setPage(Math.max(1, page - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 border rounded-lg text-sm font-medium disabled:opacity-40 hover:bg-gray-50"
                            >
                                Previous
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPage(i + 1)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium ${page === i + 1 ? 'bg-blue-600 text-white' : 'border hover:bg-gray-50'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setPage(Math.min(totalPages, page + 1))}
                                disabled={page === totalPages}
                                className="px-4 py-2 border rounded-lg text-sm font-medium disabled:opacity-40 hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default HomePage;