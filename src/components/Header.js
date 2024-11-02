import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogIn, FiSearch, FiMenu } from 'react-icons/fi';
import { FaUserPlus, FaUser, FaHeart } from 'react-icons/fa';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

function Header() {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    if (showLogoutAlert) {
      await signOut(auth);
      setShowLogoutAlert(false);
    } else {
      setShowLogoutAlert(true);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header className="bg-blue-700 p-4 shadow-lg">
      <div className="flex flex-wrap items-center justify-between max-w-6xl mx-auto">
        {/* Left Side: Logo, Title */}
        <div className="flex items-center mb-4 md:mb-0 cursor-pointer" onClick={handleLogoClick}>
          <img
            src={`${process.env.PUBLIC_URL}/logo_nav.png`}
            alt="Desireways Logo"
            className="h-10 mr-3"
          />
          <div className="flex flex-col">
            <h1 className="text-3xl font-extrabold text-white">Desireways</h1>
            <p className="text-sm text-white italic">Your desires, our products.</p>
          </div>
        </div>

        {/* Hamburger Menu Icon for Mobile */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <FiMenu />
        </button>

        {/* Right Side: Search & Nav Links */}
        <div className={`w-full md:flex md:w-auto ${menuOpen ? 'block' : 'hidden'} md:block`}>
          <nav className="flex flex-col md:flex-row md:items-center md:space-x-6 text-white text-sm">
            {/* Search Input */}
            <div className="flex items-center space-x-2 bg-white text-black rounded-full px-3 py-1 mb-2 md:mb-0">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search..."
                className="bg-transparent focus:outline-none flex-grow"
              />
              <FiSearch
                onClick={handleSearch}
                className="h-5 w-5 text-gray-500 cursor-pointer"
                aria-label="Search"
              />
            </div>

            {user ? (
              <>
                <Link
                  to="/wishlist"
                  className="flex items-center space-x-2 hover:text-blue-200 transition duration-200 mb-2 md:mb-0"
                  aria-label="View your wishlist"
                >
                  <FaHeart className="h-5 w-5" aria-hidden="true" />
                  <span>Wishlist</span>
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center space-x-2 hover:text-blue-200 transition duration-200 mb-2 md:mb-0"
                  aria-label="View your profile"
                >
                  <FaUser className="h-5 w-5" aria-hidden="true" />
                  <span>Profile</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 hover:text-blue-200 transition duration-200 mb-2 md:mb-0"
                  aria-label="Logout"
                >
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center space-x-2 hover:text-blue-200 transition duration-200 mb-2 md:mb-0"
                  aria-label="Login to your account"
                >
                  <FiLogIn className="h-5 w-5" aria-hidden="true" />
                  <span>Login</span>
                </Link>

                <Link
                  to="/signup"
                  className="flex items-center space-x-2 hover:text-blue-200 transition duration-200 mb-2 md:mb-0"
                  aria-label="Create a new account"
                >
                  <FaUserPlus className="h-5 w-5" aria-hidden="true" />
                  <span>Signup</span>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Logout Confirmation Alert */}
      {showLogoutAlert && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-5 shadow-lg w-11/12 md:w-1/4">
            <h2 className="text-lg font-bold text-black">Confirm Logout</h2>
            <p className="text-black">Are you sure you want to log out?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
                Yes
              </button>
              <button onClick={() => setShowLogoutAlert(false)} className="bg-gray-300 text-black px-4 py-2 rounded">
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
