import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const ProductView = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todaySales, setTodaySales] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({}); // Track selected products

  // Function to fetch products from Firestore
  const fetchProducts = async () => {
    try {
      const productsCollection = collection(db, 'products');
      const productsSnapshot = await getDocs(productsCollection);
      const productList = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProducts(productList);

      // Filter today's sales
      const today = new Date().toISOString().split('T')[0];
      const sales = productList.filter(product => 
        product.isOnSale && 
        product.saleStartDate <= today && 
        product.saleEndDate >= today
      );
      setTodaySales(sales);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(); // Call fetchProducts when component mounts
  }, []);

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prevState => ({
      ...prevState,
      [productId]: !prevState[productId], // Toggle selection
    }));
  };

  const addToTodaySales = async () => {
    const today = new Date().toISOString().split('T')[0];
    const updates = [];

    for (const productId in selectedProducts) {
      if (selectedProducts[productId]) { // If product is selected
        const productRef = doc(db, 'products', productId);
        updates.push(updateDoc(productRef, {
          isOnSale: true,
          saleStartDate: today, // Set today's date as the start date
          saleEndDate: today // Set today's date as the end date for a single day sale
        }));
      }
    }

    // Wait for all updates to finish
    await Promise.all(updates);
    fetchProducts(); // Refetch products to see changes
  };

  const removeFromTodaySales = async () => {
    const updates = [];

    for (const productId in selectedProducts) {
      if (selectedProducts[productId]) { // If product is selected
        const productRef = doc(db, 'products', productId);
        updates.push(updateDoc(productRef, {
          isOnSale: false, // Set isOnSale to false
          saleStartDate: null, // Optionally clear the sale dates
          saleEndDate: null
        }));
      }
    }

    // Wait for all updates to finish
    await Promise.all(updates);
    fetchProducts(); // Refetch products to see changes
  };

  if (loading) {
    return <p>Loading products...</p>;
  }

  return (
    <div className="p-4 text-black">
      <h2 className="text-2xl font-bold mb-4">Product View</h2>
      <h3 className="text-xl font-semibold mb-2">Today's Sales</h3>
      {todaySales.length === 0 ? (
        <p>No products on sale today.</p>
      ) : (
        <ul>
          {todaySales.map(product => (
            <li key={product.id} className="border border-gray-300 p-2 mb-2">
              <span>{product.name} - ${product.price}</span>
            </li>
          ))}
        </ul>
      )}

      <h3 className="text-xl font-semibold mb-2">Available Products</h3>
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Select</th>
              <th className="border border-gray-300 p-2">ID</th>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 p-2">
                  <input
                    type="checkbox"
                    checked={!!selectedProducts[product.id]}
                    onChange={() => handleSelectProduct(product.id)}
                  />
                </td>
                <td className="border border-gray-300 p-2">{product.id}</td>
                <td className="border border-gray-300 p-2">{product.name}</td>
                <td className="border border-gray-300 p-2">${product.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-4">
        <button onClick={addToTodaySales} className="mr-2 p-2 bg-blue-500 text-white rounded">
          Add Selected Products to Today's Sales
        </button>
        <button onClick={removeFromTodaySales} className="p-2 bg-red-500 text-white rounded">
          Remove Selected Products from Today's Sales
        </button>
      </div>
    </div>
  );
};

export default ProductView;
