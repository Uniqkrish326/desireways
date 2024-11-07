import React from 'react';
import DOMPurify from 'dompurify';

const UserReviews = ({
  reviews,
  loading,
  userRating,
  setUserRating,
  reviewText,
  setReviewText,
  handleReviewSubmit,
  handleReviewDelete,
}) => {
  // Sanitize user-provided text to prevent XSS attacks
  const sanitizeText = (text) => DOMPurify.sanitize(text);

  // Handle cube click to set rating
  const handleCubeClick = (index) => {
    setUserRating(index + 1);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 text-gray-800">
      {/* Review Form */}
      <form
        onSubmit={handleReviewSubmit}
        className="bg-white p-6 rounded-lg shadow-md mb-6"
      >
        <div className="mb-4 text-center">
          <span className="text-xl font-semibold text-blue-700">Rate this product</span>
        </div>

        {/* Rating Cubes */}
        <div className="flex justify-center mb-4 space-x-2">
          {Array.from({ length: 5 }, (_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleCubeClick(index)}
              className={`w-8 h-8 md:w-10 md:h-10 transition-colors rounded-full ${userRating >= index + 1 ? 'bg-blue-600' : 'bg-gray-300'}`}
              title={`Rate ${index + 1}`}
            />
          ))}
        </div>

        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(DOMPurify.sanitize(e.target.value))}
          placeholder="Write your review here..."
          className="w-full p-2 mb-4 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
          required
        />
        <button
          type="submit"
          className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300"
        >
          Submit Review
        </button>
      </form>

      {/* User Reviews Section */}
      <h2 className="text-2xl font-semibold mb-4 text-center text-blue-700">User Reviews</h2>
      {loading ? (
        <p className="text-center text-gray-500">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-center text-gray-500">No reviews yet.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.timestamp} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-2">
                <strong className="text-lg font-medium text-gray-900">
                  {sanitizeText(review.userName)}
                </strong>
                <div className="flex space-x-1">
                  {Array.from({ length: 5 }, (_, index) => (
                    <span
                      key={index}
                      className={`w-4 h-4 rounded-full ${review.rating > index ? 'bg-blue-600' : 'bg-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-700">{sanitizeText(review.text)}</p>
              {review.userId === review.userId && (
                <button
                  onClick={() => handleReviewDelete(review.id)}
                  className="mt-2 text-red-500 hover:text-red-700 text-sm"
                >
                  Delete Review
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserReviews;
