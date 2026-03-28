import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Star, ShoppingCart, ArrowLeft, Minus, Plus } from 'lucide-react';

const ProductPage = () => {
    const { id } = useParams();
    const { addToCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [reviewError, setReviewError] = useState('');
    const [reviewSuccess, setReviewSuccess] = useState('');
    const [addedToCart, setAddedToCart] = useState(false);

    const fetchProduct = async () => {
        try {
            const { data } = await api.get(`/api/products/${id}`);
            setProduct(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching product:', error);
            setLoading(false);
        }
    };

    useEffect(() => { fetchProduct(); }, [id]);

    const handleAddToCart = () => {
        addToCart(product, qty);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setReviewError('');
        setReviewSuccess('');
        try {
            await api.post(`/api/products/${id}/reviews`, { rating: reviewRating, comment: reviewComment });
            setReviewSuccess('Review submitted successfully!');
            setReviewComment('');
            fetchProduct();
        } catch (error) {
            setReviewError(error.response?.data?.message || 'Failed to submit review');
        }
    };

    if (loading) return (
        <div className="max-w-6xl mx-auto p-8 mt-10">
            <div className="flex flex-col md:flex-row gap-10 animate-pulse">
                <div className="md:w-1/2 h-96 bg-gray-200 rounded-2xl" />
                <div className="md:w-1/2 space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-1/4" />
                    <div className="h-10 bg-gray-200 rounded w-3/4" />
                    <div className="h-8 bg-gray-200 rounded w-1/3" />
                    <div className="h-24 bg-gray-200 rounded" />
                </div>
            </div>
        </div>
    );

    if (!product) return (
        <div className="p-8 text-center mt-10">
            <p className="text-xl text-gray-500">Product not found.</p>
            <Link to="/" className="text-blue-600 font-semibold mt-4 inline-block">Back to Products</Link>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition font-medium text-sm mb-6">
                <ArrowLeft className="w-4 h-4" /> Back to Products
            </Link>

            <div className="flex flex-col md:flex-row gap-10">
                <div className="md:w-1/2">
                    <img src={product.image_url || 'https://via.placeholder.com/600'} alt={product.name}
                        className="w-full h-[450px] object-cover rounded-2xl shadow-sm border" />
                </div>

                <div className="md:w-1/2 space-y-5">
                    {product.category_name && (
                        <span className="text-sm text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full">{product.category_name}</span>
                    )}
                    <h1 className="text-3xl font-extrabold text-gray-900">{product.name}</h1>

                    <div className="flex items-center gap-2">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-5 h-5 ${i < Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                        ))}
                        <span className="text-sm text-gray-500">({product.num_reviews} reviews)</span>
                    </div>

                    <p className="text-3xl font-extrabold text-blue-600">€{Number(product.price).toFixed(2)}</p>
                    <p className="text-gray-600 leading-relaxed border-t border-b border-gray-100 py-5">{product.description}</p>

                    <p className="text-sm font-medium">
                        Status: {product.stock_quantity > 0
                            ? <span className="text-green-600">In Stock ({product.stock_quantity} available)</span>
                            : <span className="text-red-600">Out of Stock</span>}
                    </p>

                    {product.stock_quantity > 0 && (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center border border-gray-200 rounded-xl">
                                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 hover:bg-gray-50 rounded-l-xl"><Minus className="w-4 h-4" /></button>
                                <span className="px-5 font-bold">{qty}</span>
                                <button onClick={() => setQty(Math.min(product.stock_quantity, qty + 1))} className="p-3 hover:bg-gray-50 rounded-r-xl"><Plus className="w-4 h-4" /></button>
                            </div>
                            <button onClick={handleAddToCart}
                                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-lg transition shadow-md ${addedToCart ? 'bg-green-600 text-white' : 'bg-gray-900 text-white hover:bg-gray-800'}`}>
                                <ShoppingCart className="w-5 h-5" />
                                {addedToCart ? 'Added!' : 'Add to Cart'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-14">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Customer Reviews</h2>

                {user ? (
                    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
                        <h3 className="font-bold text-lg mb-4">Write a Review</h3>
                        {reviewError && <p className="text-red-600 text-sm mb-3 bg-red-50 p-3 rounded-lg">{reviewError}</p>}
                        {reviewSuccess && <p className="text-green-600 text-sm mb-3 bg-green-50 p-3 rounded-lg">{reviewSuccess}</p>}
                        <form onSubmit={handleSubmitReview} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button key={star} type="button" onClick={() => setReviewRating(star)}>
                                            <Star className={`w-7 h-7 cursor-pointer ${star <= reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Comment</label>
                                <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={4} placeholder="Share your experience with this product..." />
                            </div>
                            <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition">
                                Submit Review
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="bg-gray-50 border rounded-xl p-6 mb-8 text-center">
                        <p className="text-gray-600">Please <Link to="/login" className="text-blue-600 font-semibold hover:underline">sign in</Link> to write a review.</p>
                    </div>
                )}

                {product.reviews?.length > 0 ? (
                    <div className="space-y-4">
                        {product.reviews.map((review) => (
                            <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-5">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                                            {review.user_name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{review.user_name}</p>
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</span>
                                </div>
                                {review.comment && <p className="text-gray-600 text-sm mt-2">{review.comment}</p>}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
                )}
            </div>
        </div>
    );
};

export default ProductPage;