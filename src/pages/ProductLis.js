// src/components/ProductList.js
import React from 'react';
import { Link } from 'react-router-dom';
import products from '../data/products.json'; // Import your products data

const ProductList = ({ category }) => {
  const filteredProducts = products.filter(product => product.category.toLowerCase() === category.toLowerCase());

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center py-10">
      <h1 className="text-4xl font-bold mb-8">{category} Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <Link key={product.id} to={`/product/${product.id}`} className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2 truncate">{product.name}</h3>
              <p className="text-gray-400 mb-4">{product.description}</p>
              <img src={product.image} alt={product.name} className="mt-4 rounded-md max-h-40 w-full object-cover" />
            </Link>
          ))
        ) : (
          <p className="text-gray-500">No products found in this category.</p>
        )}
      </div>
    </div>
  );
};

export default ProductList;
