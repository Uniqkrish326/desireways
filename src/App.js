// src/App.js
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase'; // Ensure this imports your Firebase configuration
import Header from './components/Header';
import Home from './pages/Home';
import ModelList from './pages/ModelList';
import FilteredProductList from './pages/FilteredProductList';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile'; // Import the Profile component
import ProtectedRoute from './ProtectedRoute';
import NotFound from './pages/NotFound'; // Import your NotFound component

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Set user state to the logged-in user or null
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes */}
          <Route
            path="/add-product"
            element={
              <ProtectedRoute user={user}>
                <ModelList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute user={user}>
                <Wishlist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute user={user}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/:category"
            element={<ModelList />} // Allow direct access to ModelList
          />
          <Route
            path="/products/:category/:model"
            element={<FilteredProductList />} // Allow direct access to FilteredProductList
          />
          <Route
            path="/products/:category/:model/:productId"
            element={<ProductDetail />} // Allow direct access to ProductDetail
          />

          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
