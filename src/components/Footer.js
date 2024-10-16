import React from 'react';
import { FaInstagram } from 'react-icons/fa'; // Import Instagram icon from react-icons

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-10 md:mt-20 w-full"> {/* Increased margin-top for larger screens */}
      <div className="flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-2">Stay Connected</h2>
        <p className="text-lg mb-4">Follow us on Instagram for the latest updates!</p>
        <a
          href="https://www.instagram.com/yourprofile" // Replace with your Instagram profile
          target="_blank"
          rel="noopener noreferrer"
          className="transition-transform transform hover:scale-110"
        >
          <FaInstagram className="text-6xl hover:text-blue-500 transition duration-300" />
        </a>
      </div>
      <div className="text-center mt-4 text-sm">
        <p>&copy; {new Date().getFullYear()} Desireways. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
