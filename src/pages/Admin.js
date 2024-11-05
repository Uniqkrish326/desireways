// src/pages/Admin.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import UserTable from '../admin_component/User_Table';
import AddProduct from '../admin_component/AddProduct'; // Import the AddProduct component
import ProductView from '../admin_component/ProductView'; // Import the ProductView component

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');
  const [activeSection, setActiveSection] = useState('users'); // State to manage active section

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userCollection = collection(db, 'users');
        const userSnapshot = await getDocs(userCollection);
        const userList = userSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
        setUsers(userList);
      } catch (error) {
        console.error("Error fetching users: ", error); // Basic error handling
      }
    };

    fetchUsers();
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case 'users':
        return (
          <>
            <input
              type="text"
              placeholder="Search users..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-black focus:border-blue-500 focus:outline-none"
            />
            <UserTable users={users} filter={filter} />
          </>
        );
      case 'addProduct':
        return <AddProduct />; // Render AddProduct component
      case 'viewProducts':
        return <ProductView />; // Render ProductView component
      default:
        return null;
    }
  };

  return (
    <div className="flex">
      <div className="bg-gray-200 h-full p-4 w-1/4"> {/* Set width for sidebar */}
        <h2 className="text-lg font-bold text-black mb-4">Admin Menu</h2>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => setActiveSection('users')}
              className={`text-black hover:underline focus:outline-none ${activeSection === 'users' ? 'font-bold' : ''}`}
            >
              User Management
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('addProduct')}
              className={`text-black hover:underline focus:outline-none ${activeSection === 'addProduct' ? 'font-bold' : ''}`}
            >
              Add Product
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('viewProducts')}
              className={`text-black hover:underline focus:outline-none ${activeSection === 'viewProducts' ? 'font-bold' : ''}`}
            >
              View Products
            </button>
          </li>
          {/* Add more links as needed */}
        </ul>
      </div>
      <div className="p-8 max-w-3xl mx-auto bg-white shadow-lg rounded-lg w-3/4"> {/* Set width for main content */}
        <h1 className="text-4xl font-bold mb-6 text-black text-center">Admin Dashboard</h1>
        {renderContent()} {/* Conditional rendering based on active section */}
      </div>
    </div>
  );
};

export default Admin;
