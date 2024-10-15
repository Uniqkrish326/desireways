import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import ModelList from './pages/ModelList';
import FilteredProductList from './pages/FilteredProductList';
import ProductDetail from './pages/ProductDetail';

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/:category" element={<ModelList />} /> {/* Route for Model List */}
          <Route path="/products/:category/:model" element={<FilteredProductList />} /> {/* Route for filtered products */}
          <Route path="/products/:category/:model/:productId" element={<ProductDetail />} /> {/* Route for product details */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
