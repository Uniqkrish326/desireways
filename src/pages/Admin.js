import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
      setFilteredUsers(usersList); // Initialize filteredUsers with all users
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const filterUsers = () => {
      const filtered = users.filter(user => {
        const profileNameMatch = (user.profileName || '').toLowerCase().includes(searchTerm.toLowerCase());
        const emailMatch = (user.email || '').toLowerCase().includes(searchTerm.toLowerCase());
        const phoneNumberMatch = (user.phoneNumber || '').toLowerCase().includes(searchTerm.toLowerCase());
        const dateOfBirthMatch = user.dateOfBirth
          ? new Date(user.dateOfBirth.seconds * 1000).toLocaleDateString().includes(searchTerm)
          : false;

        return profileNameMatch || emailMatch || phoneNumberMatch || dateOfBirthMatch;
      });

      setFilteredUsers(filtered);
    };

    filterUsers();
  }, [searchTerm, users]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl sm:text-4xl font-bold mb-6 text-blue-700 text-center">Admin Dashboard</h1>
      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by name, email, phone, or date of birth..."
          className="w-full p-3 border border-gray-300 rounded-lg text-black focus:border-blue-500 focus:outline-none"
        />
      </div>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2 text-black">#</th>
            <th className="border border-gray-300 p-2 text-black">Profile Name</th>
            <th className="border border-gray-300 p-2 text-black">Email</th>
            <th className="border border-gray-300 p-2 text-black">Phone Number</th>
            <th className="border border-gray-300 p-2 text-black">Date of Birth</th>
            <th className="border border-gray-300 p-2 text-black">Points</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <tr key={user.id}>
                <td className="border border-gray-300 p-2 text-black text-center">{index + 1}</td>
                <td className="border border-gray-300 p-2 text-black">{user.profileName || 'N/A'}</td>
                <td className="border border-gray-300 p-2 text-black">{user.email || 'N/A'}</td>
                <td className="border border-gray-300 p-2 text-black">{user.phoneNumber || 'N/A'}</td>
                <td className="border border-gray-300 p-2 text-black">
                  {user.dateOfBirth ? new Date(user.dateOfBirth.seconds * 1000).toLocaleDateString() : 'N/A'}
                </td>
                <td className="border border-gray-300 p-2 text-black">{user.points || 0}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="border border-gray-300 p-2 text-black text-center">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
