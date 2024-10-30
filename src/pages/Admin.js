// src/pages/Admin.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Import Firebase configurations
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const AdminDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [filter, setFilter] = useState('');
  const [expandedUser, setExpandedUser] = useState(null); // Track expanded user
  const ADMIN_PASSWORD = 'admin'; // Change this to your secure password

  // Fetch data from Firestore on mount
  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(items);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Authenticate admin
  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  // Update an existing user in Firestore
  const handleUpdateUser = async (id) => {
    const updatedData = prompt('Enter new data in JSON format (e.g., {"email": "newemail@example.com", "points": 100}):');
    if (updatedData) {
      try {
        const itemRef = doc(db, 'users', id);
        await updateDoc(itemRef, JSON.parse(updatedData));
        fetchData(); // Re-fetch data after updating
      } catch (error) {
        console.error("Error updating user:", error);
      }
    }
  };

  // Delete a user from Firestore
  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (confirmDelete) {
      try {
        const itemRef = doc(db, 'users', id);
        await deleteDoc(itemRef);
        fetchData(); // Re-fetch data after deleting
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  // Safely render any value, converting objects to strings where necessary
  const renderValue = (value) => {
    if (value === undefined || value === null) {
      return 'N/A'; // Default message if value is missing
    }
    if (typeof value === 'object') {
      return JSON.stringify(value); // Convert objects to JSON string for display
    }
    return value.toString(); // Convert to string if it's a number or other type
  };

  // Loading state
  if (loading) {
    return <p className="text-center text-gray-800">Loading...</p>;
  }

  if (!authenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 p-6">
        <h2 className="mb-4 text-2xl text-gray-800">Admin Login</h2>
        <input
          type="password"
          placeholder="Enter admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 rounded p-2 mb-4 w-full max-w-xs text-black" // Text color set to black
        />
        <button onClick={handleLogin} className="bg-blue-600 text-white p-2 rounded w-full max-w-xs">
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Admin Dashboard</h1>
      
      <section className="mb-8 p-4 bg-white rounded-lg shadow">
        <h2 className="text-2xl mb-4 text-gray-800">User List</h2>
        
        {/* Filter Section */}
        <div className="mb-4">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search by name or email"
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>
        
        {data.length > 0 ? (
          data.filter(user => 
            user.profileName.toLowerCase().includes(filter.toLowerCase()) || 
            user.email.toLowerCase().includes(filter.toLowerCase())
          ).map((item) => (
            <div key={item.id} className="mb-4 border border-gray-300 rounded p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-black">{item.profileName} ({item.email})</h3> {/* Text color set to black */}
                <button 
                  onClick={() => setExpandedUser(expandedUser === item.id ? null : item.id)} 
                  className="bg-gray-300 text-gray-800 p-1 rounded">
                  {expandedUser === item.id ? 'Hide Details' : 'Show Details'}
                </button>
              </div>
              {expandedUser === item.id && (
                <div className="mt-2">
                  <p className="text-black"><strong>Phone Number:</strong> {renderValue(item.phoneNumber)}</p>
                  <p className="text-black"><strong>Date of Birth:</strong> {renderValue(item.dateOfBirth?.toDate())}</p>
                  <p className="text-black"><strong>Referral Code:</strong> {renderValue(item.referralCode)}</p>
                  <p className="text-black"><strong>Referral Count:</strong> {renderValue(item.referralsCount)}</p>
                  <p className="text-black"><strong>Points:</strong> {renderValue(item.points)}</p>

                  {/* Last Login Details */}
                  <h4 className="mt-4 text-black"><strong>Last Login Details:</strong></h4>
                
                {/* Logs Section */}
<h4 className="mt-4 text-black font-bold">Logs:</h4>
<div className="bg-gray-200 p-4 rounded-lg shadow">
  {item.logs && item.logs.length > 0 ? (
    item.logs.map((log, index) => (
      <div key={index} className="mb-2 p-2 border-b border-gray-300 last:border-b-0">
        <p className="text-black">
          <strong>Log {index + 1}:</strong> {renderValue(log)}
        </p>
      </div>
    ))
  ) : (
    <p className="text-black">No logs available.</p>
  )}
</div>


                  <button onClick={() => handleUpdateUser(item.id)} className="bg-blue-600 text-white p-1 rounded mt-2 mr-2">
                    Update
                  </button>
                  <button onClick={() => handleDeleteUser(item.id)} className="bg-red-600 text-white p-1 rounded mt-2">
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
