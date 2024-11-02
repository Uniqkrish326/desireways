import React from 'react';
import { FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-12 w-full">
      <div className="flex flex-col items-center text-center px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Stay Connected</h2>
        <p className="text-base md:text-lg mb-4">Follow us on Instagram for the latest updates!</p>
        <a
          href="https://www.instagram.com/yourprofile"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-transform transform hover:scale-110"
        >
          <FaInstagram className="text-4xl md:text-6xl hover:text-blue-400 transition duration-300" />
        </a>
      </div>
      <div className="text-center mt-6 text-xs md:text-sm">
        <p>&copy; {new Date().getFullYear()} Desireways. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
