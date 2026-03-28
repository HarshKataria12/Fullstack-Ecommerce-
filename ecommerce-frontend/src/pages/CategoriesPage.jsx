import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await api.get('/api/categories');
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
            setLoading(false);
        };
        fetchCategories();
    }, []);

    if (loading) return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
                ))}
            </div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Shop by Category</h1>
            <p className="text-gray-500 mb-8">Browse our curated collection of tech products.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat) => (
                    <Link key={cat.id} to={`/?category=${cat.id}`}
                        className="group relative h-64 rounded-2xl overflow-hidden shadow-sm border border-gray-200">
                        <img src={cat.image_url || 'https://via.placeholder.com/400'} alt={cat.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                            <h3 className="text-white text-xl font-bold">{cat.name}</h3>
                            <p className="text-gray-300 text-sm mt-1">{cat.product_count} products</p>
                            {cat.description && <p className="text-gray-300 text-sm mt-1 line-clamp-2">{cat.description}</p>}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CategoriesPage;