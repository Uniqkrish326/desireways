// src/ProtectedRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from './firebase'; // Import your firebase config

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null); // State to store the current user
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false); // Set loading to false once we check the auth state
    });

    // Clean up the subscription
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p>Loading...</p>; // Show loading indicator while checking auth state
  }

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
