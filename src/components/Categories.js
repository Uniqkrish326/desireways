import React from 'react';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
  const categories = [
    'electronics',
    'fashion',
    'home & kitchen',
    'books',
    'health & personal care',
    'sports & fitness',
    'toys & games',
    'beauty',
  ];

  const navigate = useNavigate();

  const handleSelectCategory = (category) => {
    navigate(`/products/${category}`);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-10 w-full max-w-4xl">
      <h2 className="text-3xl font-bold mb-6 text-white">Product Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => handleSelectCategory(category)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition duration-300 w-full"
          >
            {category.charAt(0).toUpperCase() + category.slice(1)} {/* Capitalize first letter for display */}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Categories;
