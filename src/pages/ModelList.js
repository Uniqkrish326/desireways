import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import products from '../data/products.json'; // Import your products data

const ModelList = () => {
  const { category } = useParams(); // Get the category from URL
  const navigate = useNavigate();

  // Extract unique models for the selected category
  const models = [...new Set(products
    .filter(p => p.category.toLowerCase() === category.toLowerCase())
    .map(p => p.name))];

  const handleSelectModel = (model) => {
    navigate(`/products/${category}/${model}`); // Navigate to the model's product list
  };

  useEffect(() => {
    // Scroll to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10 px-4">
      {/* Back Link */}
      <button 
        onClick={() => navigate(-1)} 
        className="text-blue-500 mb-4 text-lg hover:underline"
      >
        Back
      </button>

      <h1 className="text-4xl font-bold mb-8 text-center">{category.charAt(0).toUpperCase() + category.slice(1)} Products</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {models.length === 0 ? (
          <p className="text-center text-lg">No models available for this category.</p>
        ) : (
          models.map((model, index) => {
            // Find the product with the current model name to display the first image
            const product = products.find(p => p.name === model);
            const imageUrl = product && product.images[0]; // Get the first image for the model

            return (
              <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-lg transition-transform duration-200 hover:scale-105 flex flex-col">
                <img 
                  src={imageUrl} 
                  alt={model} 
                  className="w-full h-32 object-cover rounded-md mb-2" // Adjusted height for images
                />
                <h3 className="text-lg font-semibold mb-2 truncate">{model}</h3>
                <button
                  onClick={() => handleSelectModel(model)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mt-auto transition duration-200 w-full"
                >
                  View {model} Products
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ModelList;
