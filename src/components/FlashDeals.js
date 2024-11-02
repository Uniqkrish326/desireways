// src/components/FlashDeals.js
import React, { useEffect, useState } from 'react';
import FlashDealsData from '../data/FlashDeals.json'; // Adjust path as necessary

const FlashDeals = () => {
  const [deals, setDeals] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const itemsToShowDesktop = 3; // Number of items to show on desktop
  const itemsToShowMobile = 2; // Number of items to show on mobile

  useEffect(() => {
    setDeals(FlashDealsData); // Load flash deals data

    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTimeLeft = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  };

  const itemsToShow = window.innerWidth < 768 ? itemsToShowMobile : itemsToShowDesktop;
  const totalItems = Math.ceil(deals.length / itemsToShow);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalItems);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalItems) % totalItems);
  };

  const getVisibleDeals = () => {
    const start = currentIndex * itemsToShow;
    return deals.slice(start, start + itemsToShow);
  };

  return (
    <div className="relative p-4 sm:mb-0 mb-102 lg:mb-16">

      {/* Header with Timer */}
      <div className="flex justify-between items-center mb-4 bg-blue-800 p-4 text-white rounded-md">
        <h2 className="text-2xl font-semibold">Today's Flash Deals</h2>
        <span className={`p-2 bg-white text-black border border-gray-400 rounded-md ${timeLeft < 60 ? 'transform scale-110 glow' : ''}`}>
          Time Left: {formatTimeLeft(timeLeft)}
        </span>
      </div>

      {/* Carousel container */}
      <div className="flex justify-center items-center">
        {window.innerWidth < 768 ? (
          <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hidden gap-4 px-4">
            {deals.map((deal) => (
              <div key={deal.id} className="bg-gray-800 rounded-lg p-4 flex flex-col items-center w-3/4 sm:w-1/4 flex-shrink-0 mx-2 snap-start">
                <img
                  src={deal.images[0]}
                  alt={deal.title}
                  className="w-full h-24 sm:h-32 object-cover rounded-lg mb-2"
                />
                <h3 className="text-base sm:text-lg font-bold text-center">{deal.title}</h3>
                <p className="text-xs sm:text-sm text-center">{deal.description}</p>
                <p className="text-gray-600 text-sm">Price: ₹{deal.price}</p>
                <a
                  href={deal.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline text-sm"
                >
                  View Product
                </a>
              </div>
            ))}
          </div>
        ) : (
          <>
            <button onClick={handlePrev} className="bg-gray-700 text-white p-4 rounded-full text-2xl absolute left-0 z-10 mx-2" style={{ left: '-40px' }}>
              ◀️
            </button>

            <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hidden gap-0 mx-2"style={{ marginRight: '20px' }}>
              {getVisibleDeals().map((deal) => (
                <div key={deal.id} className="bg-gray-800 rounded-lg p-4 flex flex-col items-center w-1/3 flex-shrink-0 mx-2 snap-start"style={{ padding: '40px' }}>
                  <img
                    src={deal.images[0]}
                    alt={deal.title}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                  <h3 className="text-lg font-bold text-center">{deal.title}</h3>
                  <p className="text-sm text-center">{deal.description}</p>
                  <p className="text-gray-600">Price: ₹{deal.price}</p>
                  <a
                    href={deal.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    View Product
                  </a>
                </div>
              ))}
            </div>

            <button onClick={handleNext} className="bg-gray-700 text-white p-4 rounded-full text-2xl absolute right-0 z-10" style={{ right: '-20px' }}>
              ▶️
            </button>
          </>
        )}
      </div>

      <style jsx>{`
        .glow {
          text-shadow: 0 0 5px rgba(255, 0, 0, 0.6), 0 0 10px rgba(255, 0, 0, 0.6), 0 0 15px rgba(255, 0, 0, 0.6);
        }
        .snap-x {
          scroll-snap-type: x mandatory;
        }
        .snap-start {
          scroll-snap-align: start;
        }
        .scrollbar-hidden {
          scrollbar-width: none;
        }
        .scrollbar-hidden::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default FlashDeals;
