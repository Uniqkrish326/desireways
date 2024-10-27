// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Set user state to the logged-in user or null
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  return (
    <Router basename={process.env.PUBLIC_URL}>
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
            element={
              <ProtectedRoute user={user}>
                <ModelList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/:category/:model"
            element={
              <ProtectedRoute user={user}>
                <FilteredProductList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/:category/:model/:productId"
            element={
              <ProtectedRoute user={user}>
                <ProductDetail />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
