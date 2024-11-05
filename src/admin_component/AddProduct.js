import React, { useState } from 'react';
import { db } from '../firebase'; // Ensure the path is correct for your project
import { addDoc, collection } from 'firebase/firestore';

const categories = [
  { id: 1, title: 'Electronics', imageUrl: 'https://img.freepik.com/premium-photo/bottle-white-ear-buds-container-with-white-item-it_1098818-10946.jpg?semt=ais_siglip' },
  { id: 2, title: 'Fashion', imageUrl: 'https://img.freepik.com/free-photo/seductive-girl-wearing-distressed-jeans-denim-jacket-looking-camera-while-sitting-chair-fitting-room-clothing-store_613910-20033.jpg?semt=ais_siglip' },
  { id: 3, title: 'Home & Kitchen', imageUrl: 'https://img.freepik.com/free-photo/empty-modern-room-with-furniture_23-2149178335.jpg?semt=ais_siglip' },
  { id: 4, title: 'Books', imageUrl: 'https://t3.ftcdn.net/jpg/02/84/68/70/240_F_284687065_WqALgJLQAhxLlsuqz8NjYjWrts2ONbXk.jpg' },
  { id: 5, title: 'Health & Personal Care', imageUrl: 'https://img.freepik.com/free-photo/flat-lay-medical-composition_23-2148124789.jpg?semt=ais_siglip' },
  { id: 6, title: 'Sports & Fitness', imageUrl: 'https://img.freepik.com/free-photo/sports-tools_53876-138077.jpg?semt=ais_siglip' },
  { id: 7, title: 'Toys & Games', imageUrl: 'https://img.freepik.com/premium-photo/stuffed-bear-with-colorful-outfit-sits-toy-car_960782-207920.jpg?semt=ais_siglip' },
  { id: 8, title: 'Beauty', imageUrl: 'https://img.freepik.com/free-photo/young-woman-wrapped-hair-towel-applying-tone-up-cream-sitting-table-with-makeup-tools-living-room_141793-121413.jpg?semt=ais_siglip' },
];

const AddProduct = () => {
  const [product, setProduct] = useState({
    category: '',
    name: '',
    title: '',
    description: '',
    price: '',
    actual_price: '',
    stockCount: '',
    imageUrls: '',
    videoUrls: '',
    gifUrls: '',
    colors: [],
    sizes: '', // Initialize sizes as an empty string
    additionalAttributes: {
      warranty: '',
      brand: '',
      url: '',
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'colors') {
      setProduct((prev) => ({
        ...prev,
        colors: [...prev.colors, value],
      }));
    } else if (name.startsWith('additionalAttributes.')) {
      const key = name.split('.')[1];
      setProduct((prev) => ({
        ...prev,
        additionalAttributes: {
          ...prev.additionalAttributes,
          [key]: value,
        },
      }));
    } else {
      setProduct((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      category: product.category,
      name: product.name,
      title: product.title,
      description: product.description,
      price: parseFloat(product.price),
      actual_price: parseFloat(product.actual_price),
      stockCount: parseInt(product.stockCount),
      imageUrls: product.imageUrls.split(','),
      videoUrls: product.videoUrls.split(','),
      gifUrls: product.gifUrls.split(','),
      colors: product.colors,
      sizes: product.sizes.split(','), // Split sizes string into an array
      additionalAttributes: product.additionalAttributes,
    };

    try {
      const docRef = await addDoc(collection(db, 'products'), productData);
      console.log("Document written with ID: ", docRef.id);
      // Clear form after submission or handle success
      setProduct({
        category: '',
        name: '',
        title: '',
        description: '',
        price: '',
        actual_price: '',
        stockCount: '',
        imageUrls: '',
        videoUrls: '',
        gifUrls: '',
        colors: [],
        sizes: '', // Reset sizes to an empty string
        additionalAttributes: {
          warranty: '',
          brand: '',
          url: '',
        },
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded text-black shadow-lg max-w-lg mx-auto overflow-hidden">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-black mb-1">Category</label>
          <select name="category" value={product.category} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded">
            <option value="" disabled>Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.title}>{cat.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">Product Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            placeholder="Enter product name"
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">Title <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="title"
            value={product.title}
            onChange={handleChange}
            placeholder="Enter product title"
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            placeholder="Enter product description"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">Price <span className="text-red-500">*</span></label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            placeholder="Enter price"
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">Actual Price</label>
          <input
            type="number"
            name="actual_price"
            value={product.actual_price}
            onChange={handleChange}
            placeholder="Enter actual price"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">Stock Count <span className="text-red-500">*</span></label>
          <input
            type="number"
            name="stockCount"
            value={product.stockCount}
            onChange={handleChange}
            placeholder="Enter stock count"
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">Image URLs (comma separated) <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="imageUrls"
            value={product.imageUrls}
            onChange={handleChange}
            placeholder="Enter image URLs"
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">Video URLs (comma separated)</label>
          <input
            type="text"
            name="videoUrls"
            value={product.videoUrls}
            onChange={handleChange}
            placeholder="Enter video URLs"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">GIF URLs (comma separated)</label>
          <input
            type="text"
            name="gifUrls"
            value={product.gifUrls}
            onChange={handleChange}
            placeholder="Enter GIF URLs"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">Colors</label>
          <input
            type="text"
            name="colors"
            onChange={handleChange}
            placeholder="Enter colors (comma separated)"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">Sizes <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="sizes"
            value={product.sizes}
            onChange={handleChange}
            placeholder="Enter sizes (comma separated)"
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">Warranty</label>
          <input
            type="text"
            name="additionalAttributes.warranty"
            value={product.additionalAttributes.warranty}
            onChange={handleChange}
            placeholder="Enter warranty information"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">Brand</label>
          <input
            type="text"
            name="additionalAttributes.brand"
            value={product.additionalAttributes.brand}
            onChange={handleChange}
            placeholder="Enter brand name"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">URL</label>
          <input
            type="url"
            name="additionalAttributes.url"
            value={product.additionalAttributes.url}
            onChange={handleChange}
            placeholder="Enter product URL"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <button type="submit" className="mt-4 w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Add Product
        </button>
      </div>
    </form>
  );
};

export default AddProduct;
