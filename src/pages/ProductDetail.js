import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import products from '../data/products.json'; // Import your products data
import '../styles/ProductDetail.css'; // Import CSS for styling

const ProductDetail = () => {
  const { productId } = useParams(); // Get product ID from URL
  const product = products.find(p => p.id === parseInt(productId)); // Find the product by ID
  const navigate = useNavigate(); // Hook to programmatically navigate

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
      <div className="flex items-center mb-4">
        <button onClick={() => navigate(-1)} className="text-blue-500 text-sm mr-4">Back</button>
        <h5 className="text-3xl md:text-4xl font-bold text-center flex-1">{product.title}</h5>
      </div>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <div className="media-container mb-4 grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Render images */}
          {images.length > 0 && images.map((image, index) => (
            <img key={index} src={image} alt="" className="rounded-md object-cover" />
          ))}

          {/* Render videos if available */}
          {videos.length > 0 && videos.map((video, index) => (
            <video key={index} controls className="rounded-md object-cover">
              <source src={video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ))}

          {/* Placeholder if no media available */}
          {images.length === 0 && videos.length === 0 && (
            <div className="bg-gray-600 text-white p-4 rounded-md text-center col-span-2">
              No media available for this product.
            </div>
          )}
        </div>
        <p className="text-gray-400 mb-4">{product.description}</p>
        <p className="text-xl font-bold mb-4">${product.price}</p>

        <div className="text-center mb-4">
          <strong>Overall Rating: </strong>{overallRating > 0 ? overallRating : 'No ratings yet'}
        </div>

        {/* Buy Now Link */}
        <div className="text-center mb-4">
          <Link to={product.link} className="bg-green-500 text-white px-4 py-2 rounded-md">Buy Now</Link>
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
