import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import ModelList from './pages/ModelList';
import FilteredProductList from './pages/FilteredProductList';
import ProductDetail from './pages/ProductDetail';
import Admin from './components/admin'; // Import your admin dashboard

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/components/admin" element={<Admin />} /> {/* Admin Dashboard Route */}
          <Route path="/products/:category" element={<ModelList />} />
          <Route path="/products/:category/:model" element={<FilteredProductList />} />
          <Route path="/products/:category/:model/:productId" element={<ProductDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
