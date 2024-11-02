// src/components/Categories.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

// Sample category data
const categories = [
  { id: 1, title: 'Electronics', imageUrl: 'https://img.freepik.com/premium-photo/bottle-white-ear-buds-container-with-white-item-it_1098818-10946.jpg?semt=ais_siglip' },
  { id: 2, title: 'Fashion', imageUrl: 'https://img.freepik.com/free-photo/seductive-girl-wearing-distressed-jeans-denim-jacket-looking-camera-while-sitting-chair-fitting-room-clothing-store_613910-20033.jpg?semt=ais_siglip' },
  { id: 3, title: 'Home & Kitchen', imageUrl: 'https://img.freepik.com/free-photo/empty-modern-room-with-furniture_23-2149178335.jpg?semt=ais_siglip' },
  { id: 4, title: 'Books', imageUrl: 'https://t3.ftcdn.net/jpg/02/84/68/70/240_F_284687065_WqALgJLQAhxLlsuqz8NjYjWrts2ONbXk.jpg' },
  { id: 5, title: 'Health & Personal Care', imageUrl: 'https://img.freepik.com/free-photo/flat-lay-medical-composition_23-2148124789.jpg?semt=ais_siglip' },
  { id: 6, title: 'Sports & Fitness', imageUrl: 'https://img.freepik.com/free-photo/sports-tools_53876-138077.jpg?semt=ais_siglip' },
  { id: 7, title: 'Toys & Games', imageUrl: 'https://img.freepik.com/premium-photo/stuffed-bear-with-colorful-outfit-sits-toy-car_960782-207920.jpg?semt=ais_siglip' },
  { id: 8, title: 'Beauty', imageUrl: 'https://img.freepik.com/free-photo/young-woman-wrapped-hair-towel-applying-tone-up-cream-sitting-table-with-makeup-tools-living-room_141793-121413.jpg?semt=ais_siglip' },
];

// Array of different colors for the categories
const categoryColors = [
  'bg-blue-500',
  'bg-green-500',
  'bg-red-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-teal-500',
];

const Categories = () => {
  const navigate = useNavigate(); // Hook for navigation

  const handleCategoryClick = (category) => {
    navigate(`/products/${category}`); // Navigate to the category page
  };

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-7xl mx-auto lg:mx-0 lg:w-full mt-0" style={{
      marginBottom: window.innerWidth >= 1015 ? '60px' : '0px',
    }}>
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-white">Product Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {categories.map((category, index) => (
          <div
            key={category.id}
            className={`rounded-lg overflow-hidden cursor-pointer hover:bg-opacity-75 transition duration-200 ${categoryColors[index]}`}
            onClick={() => handleCategoryClick(category.title)} // Pass category title to navigate
          >
            <img
              src={category.imageUrl}
              alt={category.title}
              className="w-full h-20 sm:h-32 object-cover"
            />
            <h3 className="text-sm sm:text-xl font-semibold text-center text-white py-1 sm:py-2">
              {category.title}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
