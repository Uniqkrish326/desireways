import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure you import your Firestore instance

const ModelList = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsData, setProductsData] = useState([]);

  const handleSelectModel = (model) => {
    navigate(`/products/${category}/${model}`);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, 'products');
        const productSnapshot = await getDocs(productsCollection);
        const data = productSnapshot.docs.map(doc => doc.data());
        setProductsData(data);

        const uniqueModels = [...new Set(data
          .filter(p => p.category.toLowerCase() === category.toLowerCase())
          .map(p => p.name))];

        setModels(uniqueModels);
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    window.scrollTo(0, 0);
  }, [category]);

  if (loading) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10 px-4">
      <button 
        onClick={() => navigate(-1)} 
        className="text-blue-500 mb-4 text-lg hover:underline"
      >
        Back
      </button>

      <h1 className="text-4xl font-bold mb-8 text-center">{category.charAt(0).toUpperCase() + category.slice(1)} Products</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {models.length === 0 ? (
          <p className="text-center text-lg">No models available for this category.</p>
        ) : (
          models.map((model, index) => {
            const product = productsData.find(p => p.name === model);
            const imageUrl = product && product.imageUrls && product.imageUrls[0];

            return (
              <div key={index} className="bg-gray-800 p-3 rounded-lg shadow-lg hover:scale-105 transition-transform duration-200 flex flex-col">
                {imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt={model} 
                    className="w-full h-32 object-cover rounded-md mb-2"
                  />
                ) : (
                  <div className="h-32 bg-gray-700 rounded-md mb-2 flex items-center justify-center">
                    <span>No Image Available</span>
                  </div>
                )}
                <h3 className="text-lg font-semibold mb-2 truncate">{model}</h3>
                <button
                  onClick={() => handleSelectModel(model)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mt-auto transition duration-200 w-full"
                >
                  View {model} Products
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ModelList;
