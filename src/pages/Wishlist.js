import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { FaShareAlt } from 'react-icons/fa'; // Importing share icon

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setWishlistItems(userData.wishlist || []);
        }
      }
      setLoading(false);
    };
    fetchWishlist();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const productPromises = wishlistItems.map(async (item) => {
        const productRef = doc(db, 'products', item.productId);
        const productDoc = await getDoc(productRef);
        return productDoc.exists() ? { id: item.productId, ...productDoc.data() } : null;
      });
      const fetchedProducts = await Promise.all(productPromises);
      setProducts(fetchedProducts.filter(Boolean));
      setLoading(false); // Move loading state to here to ensure all products are fetched
    };
    if (wishlistItems.length > 0) {
      fetchProducts();
    } else {
      setLoading(false); // Set loading to false if no wishlist items
    }
  }, [wishlistItems]);

  const handleShareLink = (productLink) => {
    navigator.clipboard.writeText(productLink)
      .then(() => {
        setAlertMessage("Product link copied to clipboard!");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 2000); // Hide alert after 2 seconds
      })
      .catch(err => console.error("Error copying text: ", err));
  };

  return (
    <div className="p-4 max-w-6xl mx-auto bg-gray-900 min-h-screen">
      <button
        onClick={() => navigate(-1)} // Navigate back
        className="mb-4 text-white bg-blue-500 hover:bg-blue-600 text-lg sm:text-xl p-3 rounded-full transition"
      >
        Back
      </button>
      <h1 className="text-4xl font-bold text-center mb-4 text-white">Your Wishlist</h1>

      {/* Alert Notification */}
      {showAlert && (
        <div className="fixed top-5 right-5 bg-blue-500 text-white p-4 rounded-lg shadow-md transition-opacity duration-300 ease-in-out" style={{ zIndex: 1000 }}>
          {alertMessage}
        </div>
      )}

      {loading ? (
        <p className="text-gray-400 text-center text-xl">Loading...</p> // Show loading message
      ) : (
        products.length === 0 ? (
          <p className="text-gray-400 text-center text-xl">Your wishlist is empty.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-4">
            {products.map((product) => {
              const productLink = `/products/${product.category}/${product.name}/${product.id}`;
              return (
                <div key={product.id} className="rounded-lg overflow-hidden shadow-lg p-2 bg-gray-800 hover:shadow-xl transition-shadow duration-300">
                  <div className="relative">
                    <img 
                      src={product.imageUrls[0]} 
                      alt={product.title}
                      className="w-full h-56 object-cover rounded-t-lg cursor-pointer"
                      onClick={() => navigate(productLink)} // Navigate when image clicked
                    />
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); // Prevent navigation on share icon click
                        handleShareLink(productLink); 
                      }} 
                      className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
                      aria-label="Share Product"
                    >
                      <FaShareAlt className="text-blue-500" />
                    </button>
                  </div>
                  <div className="p-4 text-center">
                    <h2 className="text-lg font-semibold text-white">{product.title}</h2>
                    <p className="text-md text-gray-300">${product.price}</p>
                    <button 
                      onClick={() => navigate(productLink)} // Navigate to product page
                      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                    >
                      View Product
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
};

export default Wishlist;
