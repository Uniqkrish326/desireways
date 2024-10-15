import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import products from '../data/products.json'; // Import your products data

const ModelList = () => {
  const { category } = useParams(); // Get the category from URL
  const navigate = useNavigate();

  // Extract unique models for the selected category (e.g., "Phones", "Laptops")
  const models = [...new Set(products.filter(p => p.category === category).map(p => p.name.split(' ')[0]))]; // Adjust the mapping logic here to fit the naming convention of your models

  const handleSelectModel = (model) => {
    navigate(`/products/${category}/${model}`); // Navigate to the model's product list
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center py-10">
      <h1 className="text-4xl font-bold mb-8">{category} Models</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model, index) => (
          <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2 truncate">{model}</h3>
            <button
              onClick={() => handleSelectModel(model)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mt-4"
            >
              View {model} Products
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelList;
