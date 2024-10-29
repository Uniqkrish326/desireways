// src/App.js
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Header from './components/Header';
import Home from './pages/Home';
import ModelList from './pages/ModelList';
import FilteredProductList from './pages/FilteredProductList';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import ProtectedRoute from './ProtectedRoute';
import NotFound from './pages/NotFound'; 

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
          <Route path="/signup" element={<SignupWithReferral />} />

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
          <Route path="/products/:category" element={<ModelList />} />
          <Route path="/products/:category/:model" element={<FilteredProductList />} />
          <Route path="/products/:category/:model/:productId" element={<ProductDetail />} />
          <Route path="*" element={<NotFound />} />{/* Catch-all for unknown routes */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

// Helper component to handle referral links on signup
function SignupWithReferral() {
  const location = useLocation();
  const [referralCode, setReferralCode] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get('ref');
    if (ref) {
      setReferralCode(ref);
      sessionStorage.setItem('referralCode', ref); // Store referral code in sessionStorage
    } else {
      // Retrieve from sessionStorage if URL doesn't have it
      const storedRef = sessionStorage.getItem('referralCode');
      setReferralCode(storedRef);
    }
  }, [location]);

  return <Signup referralCode={referralCode} />;
}
