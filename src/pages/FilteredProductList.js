import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import products from '../data/products.json'; // Import your products data

const FilteredProductList = () => {
  const { category, model } = useParams(); // Get category and model from URL
  const navigate = useNavigate();
  const [filter, setFilter] = useState(''); // Manage filter

  // Filter products based on selected category and model
  const filteredProducts = products.filter(product => 
    product.category.toLowerCase() === category.toLowerCase() && 
    product.name.toLowerCase().includes(model.toLowerCase()) && // Match model with part of the name
    (!filter || product.description.toLowerCase().includes(filter.toLowerCase()))
  );

  const handleViewProduct = (productId) => {
    navigate(`/products/${category}/${model}/${productId}`); // Navigate to product detail page
  };

  // Function to truncate description
  const truncateDescription = (description, maxLength = 100) => {
    return description.length > maxLength ? description.slice(0, maxLength) + '...' : description;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center py-10">
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
        className="mb-6 p-2 rounded-lg text-black" // Added text-black to make the input text black
      />

      {/* Product List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product.id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2 truncate">{product.title}</h3>
              <p className="text-gray-400 mb-4">{truncateDescription(product.description, 100)}</p> {/* Truncated description */}
              <button
                onClick={() => handleViewProduct(product.id)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mt-4"
              >
                View Product Details
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No products found for this model.</p>
        )}
      </div>
    </div>
  );
};

export default FilteredProductList;
