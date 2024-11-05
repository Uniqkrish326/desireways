// src/admin_components/UserTable.js
import React from 'react';

const UserTable = ({ users, filter }) => {
  // Filter users based on the filter string
  const filteredUsers = users.filter(user => {
    const userValues = Object.values(user).join(' ').toLowerCase();
    return userValues.includes(filter.toLowerCase());
  });

  return (
    <div className="overflow-x-auto text-black">
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">#</th>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Phone Number</th>
            <th className="border border-gray-300 px-4 py-2">Points</th>
            <th className="border border-gray-300 px-4 py-2">Profile Filled</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <tr key={user.uid} className="hover:bg-gray-50 text-black">
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{user.profileName || 'Not set'}</td>
                <td className="border border-gray-300 px-4 py-2">{user.email || 'Not set'}</td>
                <td className="border border-gray-300 px-4 py-2">{user.phoneNumber || 'Not set'}</td>
                <td className="border border-gray-300 px-4 py-2">{user.points || 0}</td>
                <td className="border border-gray-300 px-4 py-2">{user.profileFilled ? 'Yes' : 'No'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center border border-gray-300 py-4">No users found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
