import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db, auth } from '../firebase';
import products from '../data/products.json';
import '../styles/ProductDetail.css';

const ProductDetail = () => {
  const { productId } = useParams();
  const product = products.find((p) => p.id === parseInt(productId));
  const navigate = useNavigate();

  const [userRating, setUserRating] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('Anonymous');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const user = auth.currentUser;
      if (user) {
        setUserId(user.uid);

        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData.profileName || 'Anonymous');
          // Check if the product is already in the wishlist
          if (userData.wishlist && userData.wishlist.some(item => item.productId === productId)) {
            setIsWishlisted(true);
          }
        } else {
          await setDoc(userRef, { reviews: [], wishlist: [] });
        }
      } else {
        navigate('/login');
      }
    };
    fetchUserDetails();
  }, [navigate, productId]);

  // Moved fetchReviews definition inside the useEffect to avoid dependency warning
  const fetchReviews = async () => {
    if (!userId) return;
    setLoading(true);
    const reviewsRef = doc(db, 'users', userId);
    const userDoc = await getDoc(reviewsRef);
    const fetchedReviews = userDoc.exists() ? userDoc.data().reviews.filter(review => review.productId === productId) : [];
    setReviews(fetchedReviews);
    setLoading(false);
  };

  useEffect(() => {
    try {
      fetchReviews();
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }// eslint-disable-next-line 
  }, [userId, productId]); // still keeping userId and productId in dependency array

  const handleRatingClick = (rating) => setUserRating(rating);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (reviewText.trim() && userRating !== null) {
      const reviewData = {
        productId,
        text: reviewText,
        rating: userRating,
        userName,
        timestamp: new Date(),
      };

      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        reviews: arrayUnion(reviewData),
      });

      await fetchReviews();
      setReviewText('');
      setUserRating(null);
    }
  };

  const handleReviewEdit = (review) => {
    setEditingReviewId(review.timestamp); // Use timestamp for unique identification
    setReviewText(review.text);
    setUserRating(review.rating);
  };

  const handleReviewUpdate = async (e) => {
    e.preventDefault();
    if (reviewText.trim() && userRating !== null && editingReviewId) {
      const updatedReviewData = {
        productId,
        text: reviewText,
        rating: userRating,
        userName,
        timestamp: new Date(),
      };

      const userRef = doc(db, 'users', userId);
      // Remove the old review
      await updateDoc(userRef, {
        reviews: arrayRemove(reviews.find(r => r.timestamp === editingReviewId)), // Match by timestamp
      });

      // Add the updated review
      await updateDoc(userRef, {
        reviews: arrayUnion(updatedReviewData),
      });

      await fetchReviews();
      setReviewText('');
      setUserRating(null);
      setEditingReviewId(null);
    }
  };

  const handleReviewDelete = async (review) => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      reviews: arrayRemove(review),
    });

    await fetchReviews();
  };

  const handleWishlistToggle = async () => {
    const userRef = doc(db, 'users', userId);
    const wishlistItem = { productId, url: window.location.pathname };

    if (isWishlisted) {
      await updateDoc(userRef, {
        wishlist: arrayRemove(wishlistItem),
      });
      setIsWishlisted(false);
    } else {
      await updateDoc(userRef, {
        wishlist: arrayUnion(wishlistItem),
      });
      setIsWishlisted(true);
    }
  };

  // Check if product exists before rendering
  if (!product) return <p className="text-gray-500 text-center">Product not found</p>;

  const images = product.images || [];
  const videos = product.videos || [];
  const overallRating = reviews.length > 0
    ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-4">
        <button onClick={() => navigate(-1)} className="text-blue-500 text-sm mr-4">Back</button>
        <h5 className="text-3xl md:text-4xl font-bold text-center flex-1">{product.title}</h5>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <div className="media-container mb-4 grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <img key={index} src={image} alt="" className="rounded-md object-cover" loading="lazy" />
          ))}
          {videos.map((video, index) => (
            <video key={index} controls className="rounded-md object-cover" loading="lazy">
              <source src={video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ))}
          {images.length === 0 && videos.length === 0 && (
            <div className="bg-gray-600 text-white p-4 rounded-md text-center col-span-2">No media available for this product.</div>
          )}
        </div>

        <p className="text-gray-400 mb-4">{product.description}</p>
        <p className="text-xl font-bold mb-4">${product.price}</p>

        <div className="text-center mb-4">
          <strong>Overall Rating: </strong>{overallRating > 0 ? overallRating : 'No ratings yet'}
        </div>

        <div className="text-center mb-4">
          <Link to={product.link} className="bg-green-500 text-white px-4 py-2 rounded-md">Buy Now</Link>
        </div>
        <div className="text-center mb-4">
          <button onClick={handleWishlistToggle} className={`w-1/4 mx-auto py-2 rounded-md ${isWishlisted ? 'bg-red-500' : 'bg-blue-500'} text-white`}>
            {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          </button>
        </div>
      </div>

      <form onSubmit={editingReviewId ? handleReviewUpdate : handleReviewSubmit} className="review-section mb-4">
        <div className="mb-2">
          <span className="text-xl font-bold">Rate this product</span>
        </div>
        <div className="flex mb-2">
          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              className={`cube ${userRating !== null && userRating >= index + 1 ? 'glow' : 'bg-transparent border border-gray-600'} w-6 h-6 m-1`}
              onClick={() => handleRatingClick(index + 1)}
            />
          ))}
        </div>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Write your review here..."
          className="w-full p-2 mb-2 rounded-md bg-gray-700 text-white"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          {editingReviewId ? 'Update Review' : 'Submit Review'}
        </button>
      </form>

      <h2 className="text-3xl font-bold mb-6 text-center">User Reviews</h2>
{loading ? (
  <p className="text-center text-gray-500">Loading reviews...</p>
) : reviews.length > 0 ? (
  reviews.map((review) => (
    <div key={review.timestamp} className="review mb-6 p-6 bg-gray-800 rounded-lg shadow-md transition-transform transform hover:scale-105">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-lg">{review.userName}</h3>
        <div className="flex items-center">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className={`cube ${review.rating > index ? 'glow' : 'bg-transparent border border-gray-600'} w-5 h-5 m-1`} />
          ))}
        </div>
      </div>
      <p className="text-gray-300 mb-4">{review.text}</p>
      <div className="flex justify-end">
        <button
          onClick={() => handleReviewEdit(review)}
          className="text-yellow-500 hover:underline mr-4"
        >
          Edit
        </button>
        <button
          onClick={() => handleReviewDelete(review)}
          className="text-red-500 hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  ))
) : (
  <p className="text-center text-gray-500">No reviews yet. Be the first to leave one!</p>
)}

  
    </div>
  );
};

export default ProductDetail;
