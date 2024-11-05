import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure this is the correct path to your Firebase configuration

const FilteredProductList = () => {
  const { category, model } = useParams(); // Get category and model from URL
  const navigate = useNavigate();
  const [filter, setFilter] = useState(''); // Manage filter
  const [products, setProducts] = useState([]); // State for products

  // Fetch products from Firestore when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, 'products'); // Reference to the products collection in Firestore
        const productSnapshot = await getDocs(productsCollection);
        const data = productSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })); // Extract product data
        
        console.log('Fetched products:', data); // Debug: Log all fetched products
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on selected category and model
  const filteredProducts = products.filter(product => 
    product.category.toLowerCase() === category.toLowerCase() && 
    product.name.toLowerCase().includes(model.toLowerCase()) && // Match model with part of the name
    (!filter || product.description.toLowerCase().includes(filter.toLowerCase()))
  );

  console.log('Filtered products:', filteredProducts); // Debug: Log filtered products

  const handleViewProduct = (productId) => {
    navigate(`/products/${category}/${model}/${productId}`); // Navigate to product detail page
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10">
      {/* Back Link */}
      <button 
        onClick={() => navigate(-1)} 
        className="text-blue-500 mb-4 text-lg hover:underline"
      >
        Back
      </button>

      <h1 className="text-4xl font-bold mb-8">{model} Models</h1>

      {/* Filter input */}
      <input
        type="text"
        placeholder="Filter by description..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-6 p-2 rounded-lg text-black"
      />

      {/* Product List */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-5xl mx-auto">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => {
            // Ensure prices are defined and parse them if necessary
            const price = product.price ? Number(product.price) : 0;
            const actualPrice = product.actualPrice ? Number(product.actualPrice) : 0;

            return (
              <div 
                key={product.id} 
                className="bg-gray-800 p-4 rounded-lg shadow-lg transition-transform duration-200 hover:scale-105 cursor-pointer"
                onClick={() => handleViewProduct(product.id)} // Make entire card clickable
              >
                <div className="h-40 overflow-hidden">
                  {product.imageUrls && Array.isArray(product.imageUrls) && product.imageUrls.length > 0 ? (
                    <img 
                      src={product.imageUrls[0]} 
                      alt={product.name} // Use `product.name` here
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-700 flex items-center justify-center rounded-md">
                      <span>No Image Available</span>
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-semibold mb-1 truncate">{product.title}</h3> {/* Use `product.name` */}
                <p className="text-xl font-bold mb-1">₹{price.toLocaleString()}</p>
                {actualPrice > 0 && (
                  <p className="text-sm line-through text-gray-400 mb-1">₹{actualPrice.toLocaleString()}</p>
                )}
                <p className="text-sm text-gray-300">Stock: {product.stockCount || 0} units</p>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500">No products found for this model.</p>
        )}
      </div>
    </div>
  );
};

export default FilteredProductList;
