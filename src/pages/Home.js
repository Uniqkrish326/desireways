// src/pages/Home.js
import React, { useState, useEffect, useCallback } from 'react';
import { fetchGoogleResults } from '../api/google';
import Categories from '../components/Categories'; // Make sure this is correctly implemented

const Home = () => {
  const [userPrompt, setUserPrompt] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Memoize the handleSearch function to avoid unnecessary re-renders
  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      const searchQuery = `${userPrompt} ${selectedCategory} site:amazon.in OR site:flipkart.com OR site:meesho.com`;
      const searchResults = await fetchGoogleResults(searchQuery);
      setResults(searchResults);
    } catch (error) {
      console.error('Failed to fetch results:', error);
    }
    setLoading(false);
  }, [userPrompt, selectedCategory]); // Include userPrompt and selectedCategory in dependencies

  useEffect(() => {
    if (selectedCategory) {
      handleSearch();
    }
  }, [selectedCategory, handleSearch]); // Include handleSearch in the dependency array

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center py-10">
      <h1 className="text-4xl font-bold mb-8">Find Products Based on Your Desire</h1>
      <div className="w-full max-w-2xl mb-6">
        <input
          type="text"
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          placeholder="Enter the product or your prompt..."
          className="w-full p-4 text-black rounded-lg shadow-lg"
        />
      </div>
      <button
        onClick={handleSearch}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 mt-6"
      >
        {loading ? 'Searching...' : 'Search'}
      </button>
      <div className="mt-10 w-full max-w-4xl">
        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((item, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-2 truncate">{item.title}</h3>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline mb-2 block truncate"
                >
                  {`Find here: ${item.link}`}
                </a>
                <p className="mt-2 text-gray-400">{item.snippet}</p>
                {item.pagemap && item.pagemap.cse_image && item.pagemap.cse_image[0] && (
                  <img
                    src={item.pagemap.cse_image[0].src}
                    alt={item.title}
                    className="mt-4 rounded-md max-h-40 w-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          !loading && <p className="text-gray-500">No results found</p>
        )}
      </div>
      <Categories onSelectCategory={setSelectedCategory} />
    </div>
  );
};

export default Home;
