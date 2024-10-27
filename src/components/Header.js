import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi'; // Login icon
import { FaUserPlus, FaUser, FaHeart } from 'react-icons/fa'; // Signup, Profile, Wishlist icons
import { auth } from '../firebase'; // Adjust the import according to your file structure
import { signOut } from 'firebase/auth';

function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe(); // Clean up subscription on unmount
  }, []);

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      await signOut(auth);
    }
  };

  return (
    <header className="bg-blue-700 p-4 shadow-lg">
      <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto">
        {/* Left Side: Logo, Title, Slogan */}
        <div className="flex items-center mb-4 md:mb-0">
          <img
            src={`${process.env.PUBLIC_URL}/logo_nav.png`}
            alt="Desireways Logo"
            className="h-10 mr-3"
          />
          <div className="flex flex-col">
            <h1 className="text-3xl font-extrabold text-white">Desireways</h1>
            <p className="mt-1 text-sm text-white italic">Your desires, our products.</p>
          </div>
        </div>

        {/* Right Side: Conditional rendering for login/signup or profile/logout */}
        <nav className="flex items-center space-x-6 text-white text-sm">
          {user ? (
            <>
              {/* Wishlist link, visible only to logged-in users */}
              <Link
                to="/wishlist"
                className="flex items-center space-x-2 hover:text-blue-200 transition duration-200"
                aria-label="View your wishlist"
              >
                <FaHeart className="h-5 w-5" aria-hidden="true" />
                <span>Wishlist</span>
              </Link>

              <Link
                to="/profile"
                className="flex items-center space-x-2 hover:text-blue-200 transition duration-200"
                aria-label="View your profile"
              >
                <FaUser className="h-5 w-5" aria-hidden="true" />
                <span>Profile</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 hover:text-blue-200 transition duration-200"
                aria-label="Logout"
              >
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center space-x-2 hover:text-blue-200 transition duration-200"
                aria-label="Login to your account"
              >
                <FiLogIn className="h-5 w-5" aria-hidden="true" />
                <span>Login</span>
              </Link>

              <Link
                to="/signup"
                className="flex items-center space-x-2 hover:text-blue-200 transition duration-200"
                aria-label="Create a new account"
              >
                <FaUserPlus className="h-5 w-5" aria-hidden="true" />
                <span>Signup</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
