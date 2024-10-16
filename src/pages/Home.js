import React, { useState, useEffect, useCallback } from 'react';
import { fetchGoogleResults } from '../api/google';
import Categories from '../components/Categories';
import FAQ from '../components/FAQ';
import Newsletter from '../components/NewsletterSignup';
import Footer from '../components/Footer'; // Import Footer component

const Home = () => {
  const [userPrompt, setUserPrompt] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

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
  }, [userPrompt, selectedCategory]);

  useEffect(() => {
    if (selectedCategory) {
      handleSearch();
    }
  }, [selectedCategory, handleSearch]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center py-5"> {/* Reduced padding */}
      <h1 className="text-2xl md:text-4xl font-bold mb-4">Find Products Based on Your Desire</h1> {/* Reduced font size for mobile */}
      <div className="w-full max-w-xs md:max-w-2xl mb-4"> {/* Adjust max width for mobile */}
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
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition duration-300"
      >
        {loading ? 'Searching...' : 'Search'}
      </button>
      <div className="mt-8 w-full max-w-4xl"> {/* Reduced top margin for results section */}
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
      
      <div className="mt-8 w-full max-w-4xl"> {/* Reduced top margin for FAQ section */}
        <FAQ />
      </div>

      <div className="mt-8 w-full max-w-4xl"> {/* Reduced top margin for Newsletter section */}
        <Newsletter />
      </div>

      {/* Add Footer Component */}
      <Footer />
    </div>
  );
};

export default Home;
