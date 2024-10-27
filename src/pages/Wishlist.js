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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-4">Your Wishlist</h1>
      <button 
        onClick={() => navigate(-1)} // Go back to the previous page
        className="mb-4 text-white bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded"
      >
        Back
      </button>
      {wishlistItems.length === 0 ? (
        <p className="text-gray-500 text-center">Your wishlist is empty.</p>
      ) : (
        <ul className="mt-4">
          {wishlistItems.map((item, index) => {
            const product = products.find((p) => p.id === parseInt(item.productId));
            return (
              product && (
                <li key={index} className="border-b border-gray-300 py-2">
                  <Link 
                    to={`/products/${product.category}/${product.name}/${product.id}`} // Correct URL format without subcategory
                    className="text-blue-600"
                  >
                    {product.title}
                  </Link>
                </li>
              )
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Wishlist;
