import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import products from '../data/products.json';
import { Link, useNavigate } from 'react-router-dom';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchWishlist = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setWishlistItems(userData.wishlist || []); // Fetch wishlist items
        }
      }
      setLoading(false);
    };

    fetchWishlist();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-6">Your Wishlist</h1>
      <button 
        onClick={() => navigate(-1)} // Go back to the previous page
        className="mb-6 text-white bg-blue-600 hover:bg-blue-700 py-2 px-6 rounded shadow-lg transition duration-300"
      >
        Back
      </button>
      {wishlistItems.length === 0 ? (
        <p className="text-gray-500 text-center text-xl">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {wishlistItems.map((item, index) => {
            const product = products.find((p) => p.id === parseInt(item.productId));
            return (
              product && (
                <div key={index} className="border rounded-lg overflow-hidden shadow-lg transition-transform duration-300 transform hover:scale-105">
                  <Link 
                    to={`/products/${product.category}/${product.name}/${product.id}`} // Correct URL format without subcategory
                    className="block h-full"
                  >
                    <img 
                      src={product.images[0]} // Access the first image in the images array
                      alt={product.title}
                      className="w-full h-48 object-cover" // Set height and maintain aspect ratio
                    />
                    <div className="p-4">
                      <h2 className="text-lg font-semibold">{product.title}</h2>
                      <p className="text-gray-500 text-md">${product.price}</p> {/* Assuming there's a price */}
                    </div>
                  </Link>
                </div>
              )
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
