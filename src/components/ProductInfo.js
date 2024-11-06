import React, { useState } from 'react';
// eslint-disable-next-line
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ProductInfo = ({ product, overallRating, isWishlisted, handleWishlistToggle }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const images = product.imageUrls || [];
  const videos = product.videos || [];
  const colors = product.colors || [];
  // eslint-disable-next-line
  const sizes = product.sizes || [];
  const maxDescriptionLength = 500;

  const totalMedia = [...images, ...videos];
  const truncatedDescription = product.description?.length > maxDescriptionLength
    ? product.description.substring(0, maxDescriptionLength) + '...'
    : product.description;

  // Carousel settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    arrows: true,
  };

  // Inline styles for modal description
  const modalStyle = {
    maxHeight: '70vh',
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    paddingRight: '15px',
  };

  // Function to render attributes conditionally
  const renderAttribute = (label, value) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return null;
    return (
      <div className="mt-4">
        <strong className="text-lg">{label}:</strong>
        {Array.isArray(value) ? (
          <div className="flex flex-wrap mt-2">
            {value.map((item, index) => (
              <span key={index} className="border border-gray-400 bg-transparent text-white py-1 px-2 rounded mr-2 mb-2">
                {item}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-white">{value}</span>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Media Section */}
        <div className="flex flex-col items-center">
          {totalMedia.length > 0 ? (
            <>
              <Slider {...settings} className="w-full rounded-lg overflow-hidden">
                {totalMedia.map((media, index) => (
                  <div key={index} className="flex justify-center items-center h-full">
                    {media.endsWith('.mp4') ? (
                      <video controls className="w-full h-full object-cover">
                        <source src={media} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img
                        src={media}
                        alt={`Media ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ))}
              </Slider>
              <p className="mt-2 text-gray-600">Swipe to view more images!</p>
            </>
          ) : (
            <div className="bg-gray-700 text-gray-300 p-4 rounded-md">
              No media available for this product.
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div className="p-6 bg-gradient-to-br from-blue-900 to-blue-600 text-white rounded-xl shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{product.title}</h2>

          {/* Price and Stock Info */}
          <div className="flex items-center justify-between">
            <span className="text-lg md:text-xl font-extrabold">₹{product.price}</span>
            {product.stockCount && (
              <span className="text-sm md:text-md">In Stock: {product.stockCount}</span>
            )}
          </div>

          {/* Overall Rating */}
          <div className="mt-3">
            <span className="text-yellow-400">Overall Rating: {overallRating} / 5</span>
          </div>

          {/* Color Selection */}
          {renderAttribute("Select Color", colors)}

          {/* Size Selection */}
          

          {/* Description */}
          <div className="mt-6">
            <p
              className="text-gray-300 cursor-pointer"
              onClick={() => setModalOpen(true)}
            >
              {showFullDescription ? product.description : truncatedDescription}
              {product.description && product.description.length > maxDescriptionLength && (
                <span className="text-cyan-500 cursor-pointer" onClick={() => setShowFullDescription(!showFullDescription)}>
                  {showFullDescription ? ' Read Less' : ' Read More'}
                </span>
              )}
            </p>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
          <a
          href={product.additionalAttributes.url} // Access the URL correctly from additionalAttributes
          target="_blank" // Opens the link in a new tab
          rel="noopener noreferrer" // Security best practice
          className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 px-4 rounded transition duration-300 hover:shadow-lg"
        >
          Buy Now
        </a>
            <button
              onClick={handleWishlistToggle}
              className={`py-2 px-4 rounded transition duration-300 ${isWishlisted ? 'bg-red-500' : 'bg-green-500'}`}
            >
              {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
          </div>
        </div>
      </div>

      {/* Modal for full description */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg mx-auto relative shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Full Description</h2>
            <div style={modalStyle}>
              <p className="text-gray-800">{product.description}</p>
            </div>
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
              aria-label="Close"
            >
              &times;
            </button>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-cyan-500 text-white rounded py-2 px-4 hover:bg-cyan-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
