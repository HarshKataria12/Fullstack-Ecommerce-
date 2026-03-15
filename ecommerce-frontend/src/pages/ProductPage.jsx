//shows single item when a user clicks on it from the homepage.
// src/pages/ProductPage.jsx
import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';

const ProductPage = () => {
  const { id } = useParams(); // Grabs the ID from the URL
  const { addToCart } = useContext(CartContext); // Grabs the global add to cart function
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Fetch just this one specific product!
        const { data } = await axios.get(`http://localhost:5001/api/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-xl mt-10">Loading product details...</div>;
  if (!product) return <div className="p-8 text-center text-xl mt-10">Product not found.</div>;

  return (
    <div className="max-w-6xl mx-auto p-8 flex flex-col md:flex-row gap-10 mt-10">
      {/* Product Image */}
      <div className="md:w-1/2">
        <img 
          src={product.image_url || 'https://via.placeholder.com/600'} 
          alt={product.name} 
          className="w-full h-[400px] object-cover rounded-2xl shadow-lg"
        />
      </div>

      {/* Product Info */}
      <div className="md:w-1/2 flex flex-col justify-center space-y-6">
        <Link to="/" className="text-gray-500 hover:text-blue-600 transition font-medium">
          &larr; Back to Products
        </Link>
        <h1 className="text-4xl font-extrabold text-gray-900">{product.name}</h1>
        <p className="text-3xl font-bold text-blue-600">${product.price}</p>
        <p className="text-gray-600 text-lg leading-relaxed border-t border-b py-6">
          {product.description}
        </p>
        
        <p className="text-sm font-medium text-gray-500">
          Status: {product.stock_quantity > 0 ? <span className="text-green-600">In Stock ({product.stock_quantity})</span> : <span className="text-red-600">Out of Stock</span>}
        </p>

        <button 
          onClick={() => addToCart(product)}
          disabled={product.stock_quantity === 0}
          className={`py-4 rounded-xl text-lg font-bold transition w-full md:w-2/3 shadow-md ${
            product.stock_quantity === 0 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
        >
          {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductPage;