// src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Hitting your Express + MySQL backend!
        const { data } = await axios.get('http://localhost:5001/api/products');
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="p-8 text-center text-xl mt-10">Loading your store...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Latest Products</h1>
      
      {products.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          <p className="text-xl">No products found in the database yet.</p>
          <p className="text-sm mt-2">Add some via Postman/Thunder Client!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border p-4 rounded-xl shadow-sm hover:shadow-lg transition duration-300 bg-white flex flex-col">
              <img 
                src={product.image_url || 'https://via.placeholder.com/300'} 
                alt={product.name} 
                className="w-full h-48 object-cover mb-4 rounded-lg" 
              />
              <h2 className="text-lg font-bold text-gray-800 truncate">{product.name}</h2>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">{product.description}</p>
              <div className="flex justify-between items-center mt-auto">
                <span className="text-xl font-extrabold text-blue-600">${product.price}</span>
                <button className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;