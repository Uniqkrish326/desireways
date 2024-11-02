import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProductInfo = ({ product, overallRating, isWishlisted, handleWishlistToggle }) => {
  const [preview, setPreview] = useState(null);

  const images = product.images || [];
  const videos = product.videos || [];
  const colors = product.colors || [];
  const sizes = product.sizes || [];

  const handlePreview = (media) => {
    setPreview(media);
  };

  const handleClosePreview = () => {
    setPreview(null);
  };

  return (
    <div className="flex flex-col md:flex-row max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Media Section */}
      <div className="media-container w-full md:w-1/2 p-4 flex flex-col">
        <div className={`grid grid-cols-1 gap-4 ${images.length > 0 || videos.length > 0 ? 'mb-4' : ''}`}>
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Product Image ${index + 1}`}
              className="w-full object-cover rounded-md cursor-pointer h-60 md:h-72"
              onClick={() => handlePreview(image)}
            />
          ))}
          {videos.map((video, index) => (
            <video
              key={index}
              controls
              className="w-full object-cover rounded-md cursor-pointer h-60 md:h-72"
              onClick={() => handlePreview(video)}
            >
              <source src={video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ))}
        </div>
        {(images.length === 0 && videos.length === 0) && (
          <div className="bg-gray-600 text-white p-4 rounded-md text-center">
            No media available for this product.
          </div>
        )}
      </div>

      {/* Product Details Section */}
      <div className="flex-1 p-4 md:p-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">{product.title}</h2>
        <p className="text-base md:text-lg text-gray-600 mb-2 md:mb-4">{product.description}</p>
        <p className="text-xl md:text-2xl font-bold mb-1 md:mb-2 text-green-600">Price: ₹{product.price}</p>
        <p className="text-base md:text-lg font-medium text-gray-700 mb-1">In Stock: {product.stockCount || 'N/A'}</p>
        
        {/* Display Overall Rating */}
        <div className="mb-4">
          <span className="text-base md:text-lg font-semibold text-yellow-500">
            Overall Rating: {overallRating} / 5
          </span>
        </div>

        {/* Color Selection */}
        <div className="mb-4">
          <strong className="text-gray-700 text-lg">Select Color:</strong>
          <div className="flex space-x-2 mt-2">
            {colors.length > 0 ? (
              colors.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full border border-gray-400 ${color}`}
                  title={color}
                />
              ))
            ) : (
              <span className="text-gray-500">No colors available</span>
            )}
          </div>
        </div>

        {/* Size Selection */}
        <div className="mb-4">
          <strong className="text-gray-700 text-lg">Select Size:</strong>
          <div className="flex space-x-2 mt-2">
            {sizes.length > 0 ? (
              sizes.map((size) => (
                <button
                  key={size}
                  className="px-3 py-1 border border-gray-400 rounded hover:bg-gray-200 text-sm md:text-base"
                >
                  {size}
                </button>
              ))
            ) : (
              <span className="text-gray-500">No sizes available</span>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col items-center md:items-start">
          <Link
            to={product.link}
            className="bg-green-500 text-white px-6 py-3 rounded text-sm md:text-lg font-medium mb-2 w-full text-center md:w-auto"
          >
            Buy Now
          </Link>
          <button
            onClick={handleWishlistToggle}
            className={`py-2 px-4 rounded text-sm md:text-lg font-medium text-white w-full md:w-auto ${
              isWishlisted ? 'bg-red-500' : 'bg-blue-500'
            }`}
          >
            {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          </button>
        </div>
      </div>

      {/* Large Preview Modal */}
      {preview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative max-w-4xl w-full mx-4 p-4 flex justify-center items-center">
            <button
              onClick={handleClosePreview}
              className="absolute top-4 right-4 text-white text-2xl font-bold"
            >
              &times;
            </button>
            {preview.endsWith('.mp4') ? (
              <video controls className="w-full max-h-[80vh] object-contain">
                <source src={preview} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img src={preview} alt="Preview" className="w-full max-h-[80vh] object-contain" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
