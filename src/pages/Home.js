// Home.js
import React, { useState } from 'react';
import Banner from '../components/Banner';
import Categories from '../components/Categories'; // Keep this component for categories
import FlashDeals from '../components/FlashDeals';
import FAQ from '../components/FAQ';
import Newsletter from '../components/NewsletterSignup';
import Footer from '../components/Footer';

const Home = () => {
  // eslint-disable-next-line
  const [selectedCategory, setSelectedCategory] = useState('');

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center">
      <Banner />
      
      {/* Removed the product finding section */}


      <div className="mt-8 w-full max-w-7xl">
      <FlashDeals />
      </div>
     
      <div className="mt-8 w-full max-w-7xl">
        <Categories onSelectCategory={setSelectedCategory} />
      </div>

      <div className="mt-8 w-full max-w-4xl">
        <FAQ />
      </div>

      <div className="mt-8 w-full max-w-4xl">
        <Newsletter />
      </div>

      <Footer />
    </div>
  );
};

export default Home;
