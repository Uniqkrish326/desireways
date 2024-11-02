import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import productData from '../data/products.json';

function SearchResults() {
  const [results, setResults] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search).get('q');
    if (query) {
      const filteredProducts = productData.filter((product) =>
        product.title && product.title.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filteredProducts);
    }
  }, [location.search]);

  const handleCancelSearch = () => {
    navigate('/'); // Adjust this to your desired path for returning
  };

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">Search Results</h2>
        <button onClick={handleCancelSearch} className="text-red-500 text-5xl">
          &times; {/* Increased size for the cancel button */}
        </button>
      </div>
      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {results.map((product) => (
            <div key={product.id} className="bg-gray-800 p-2 rounded-lg shadow-md transition transform hover:scale-105">
              <img 
                src={product.images[0]} 
                alt={product.title} 
                className="w-full h-20 object-cover rounded mb-2" // Reduced height for the image
              />
              <h3 className="text-lg font-semibold mb-1 truncate">{product.title}</h3>
              <p className="text-gray-400 mb-1">{product.description}</p>
              <p className="font-bold text-sm">Price: ₹{product.price}</p>
              <a 
                href={product.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-2 block bg-blue-600 hover:bg-blue-700 text-white text-center text-sm py-1 rounded"
              >
                View Product
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
}

export default SearchResults;
