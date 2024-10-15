import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import products from '../data/products.json'; // Import your products data
import '../styles/ProductDetail.css'; // Import CSS for styling

const ProductDetail = () => {
  const { productId } = useParams(); // Get product ID from URL
  const product = products.find(p => p.id === parseInt(productId)); // Find the product by ID

  const [userRating, setUserRating] = useState(null); // State to hold user's rating
  const [reviewText, setReviewText] = useState(''); // State for review text
  const [reviews, setReviews] = useState([]); // State to hold reviews

  const handleRatingClick = (rating) => {
    setUserRating(rating); // Allow changing the rating
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (reviewText.trim() && userRating !== null) {
      setReviews([...reviews, { text: reviewText, rating: userRating }]);
      setReviewText(''); // Clear the text area after submitting
      setUserRating(null); // Reset user rating if needed
    }
  };

  if (!product) {
    return <p className="text-gray-500 text-center">Product not found</p>;
  }

  // Check if images and videos are defined; if not, default to empty arrays
  const images = product.images || [];
  const videos = product.videos || [];

  const overallRating =
    reviews.length > 0
      ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1)
      : 0;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 text-center">{product.name}</h1>
      <h2 className="text-2xl font-semibold mb-2 text-center">{product.category}</h2>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <div className="images-container mb-4">
          {/* Render images or videos only if available, otherwise show a placeholder box */}
          {images.length > 0 ? (
            <div>
              {images.length === 1 ? (
                <img src={images[0]} alt="" className="rounded-md mb-4" />
              ) : (
                images.map((image, index) => (
                  <img key={index} src={image} alt="" className="rounded-md mb-4" />
                ))
              )}
            </div>
          ) : videos.length > 0 ? (
            <div>
              {videos.map((video, index) => (
                <video key={index} controls className="rounded-md mb-4">
                  <source src={video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ))}
            </div>
          ) : (
            <div className="bg-gray-600 text-white p-4 rounded-md text-center">
              No media available for this product.
            </div>
          )}
        </div>
        <p className="text-gray-400 mb-4">{product.description}</p>
        <p className="text-xl font-bold mb-4">${product.price}</p>

        <div className="text-center mb-4">
          <strong>Overall Rating: </strong>{overallRating > 0 ? overallRating : 'No ratings yet'}
        </div>
      </div>

      <form onSubmit={handleReviewSubmit} className="review-section mb-4">
        <div className="mb-2">
          <span className="text-xl font-bold">Rate this product</span>
        </div>
        <div className="flex mb-2">
          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              className={`cube ${userRating !== null && userRating >= index + 1 ? 'glow' : 'bg-transparent border border-gray-600'} w-8 h-8 m-1 rounded-md cursor-pointer`}
              onClick={() => handleRatingClick(index + 1)}
            />
          ))}
        </div>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Write your review..."
          className="w-full p-2 border border-gray-400 rounded-md"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Submit Review</button>
      </form>

      <div className="reviews">
  <h3 className="text-xl font-semibold mb-2 text-center">User Reviews</h3>
  {reviews.map((review, index) => (
    <div key={index} className="review border-b border-gray-300 py-2">
      {/* Display rating using smaller cubes */}
      <div className="flex mb-1">
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className={`cube ${review.rating >= i + 1 ? 'glow' : 'bg-transparent border border-gray-600'} w-4 h-4 m-0.5 rounded-md`}
          />
        ))}
      </div>
      <p className="font-bold text-gray-800">{review.text}</p>
    </div>
  ))}
</div>

    </div>

    
  );
};

export default ProductDetail;
