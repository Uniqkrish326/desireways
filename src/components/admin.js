import React, { useState } from 'react';

const Admin = () => {
  const [product, setProduct] = useState({
    id: '',
    category: '',
    name: '',
    title: '',
    link: '',
    description: '',
    price: '',
    images: '',
    videos: '',
  });

  const [customCategory, setCustomCategory] = useState('');

  const categories = [
    'electronics',
    'fashion',
    'home',
    'books',
    'toys',
    'sports',
    'beauty',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      if (value === 'other') {
        setCustomCategory('');
      }
    }
    setProduct({ ...product, [name]: value });
  };

  const handleCustomCategoryChange = (e) => {
    setCustomCategory(e.target.value);
    setProduct({ ...product, category: e.target.value });
  };

  const handleCopy = () => {
    const jsonOutput = JSON.stringify({
      id: product.id,
      category: product.category || customCategory,
      name: product.name,
      title: product.title,
      link: product.link,
      description: product.description,
      price: product.price,
      images: product.images.split(',').map(img => img.trim()),
      videos: product.videos.split(',').map(vid => vid.trim()),
    }, null, 2);

    navigator.clipboard.writeText(jsonOutput).then(() => {
      alert("JSON copied to clipboard!");
    }).catch((err) => {
      console.error("Failed to copy: ", err);
    });
  };

  return (
    <div className="flex justify-center">
      <div className="max-w-xl mx-auto p-4 bg-gray-800 shadow-md rounded-lg w-full">
        <h1 className="text-3xl font-bold mb-4 text-center text-white">Add New Product</h1>
        <form className="space-y-4">
          <input
            type="number"
            name="id"
            placeholder="Product ID"
            value={product.id}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" className="text-gray-400">Select Category</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat} className="bg-gray-600">{cat}</option>
            ))}
            <option value="other" className="bg-gray-600">Other (please specify)</option>
          </select>
          {product.category === 'other' && (
            <input
              type="text"
              name="customCategory"
              placeholder="Type your category"
              value={customCategory}
              onChange={handleCustomCategoryChange}
              required
              className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={product.name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="title"
            placeholder="Product Title"
            value={product.title}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="link"
            placeholder="Product Link"
            value={product.link}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={product.description}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={product.price}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="images"
            placeholder="Images (comma separated)"
            value={product.images}
            onChange={handleChange}
            className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="videos"
            placeholder="Videos (comma separated)"
            value={product.videos}
            onChange={handleChange}
            className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>
      </div>
      {/* Product Display Section */}
      <div className="max-w-xl mx-auto p-4 bg-gray-900 shadow-md rounded-lg w-full ml-4">
        <h2 className="text-2xl font-bold text-white mb-4">Product Details</h2>
        <div className="text-white mb-4">
          <pre>{JSON.stringify({
            id: product.id,
            category: product.category || customCategory,
            name: product.name,
            title: product.title,
            link: product.link,
            description: product.description,
            price: product.price,
            images: product.images.split(',').map(img => img.trim()),
            videos: product.videos.split(',').map(vid => vid.trim()),
          }, null, 2)}</pre>
        </div>
        <button 
          onClick={handleCopy}
          className="mt-4 w-full p-3 bg-blue-500 text-white rounded shadow hover:bg-blue-600 focus:outline-none"
        >
          Copy JSON
        </button>
      </div>
    </div>
  );
};

export default Admin;
