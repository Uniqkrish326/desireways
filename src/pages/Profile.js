// src/pages/Profile.js
import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
    interests: '',
    points: 50,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (user) {
      try {
        const docRef = doc(db, 'users', user.uid);
        await setDoc(docRef, {
          profile: [userData],
          points: userData.points,
        });

        setMessage('Profile created! You’ve been awarded 50 points.');
        setIsSubmitted(true);
      } catch (error) {
        console.error('Error creating profile:', error);
        setMessage('Failed to create profile. Please try again.');
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-200 text-gray-900 rounded-lg shadow-md">
      <span onClick={() => navigate(-1)} className="text-blue-600 cursor-pointer mb-4 inline-block">Back</span>

      <h2 className="text-2xl font-bold mb-4">Create Profile</h2>
      {message && <p className="mb-4 text-green-600">{message}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={userData.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full p-2 mb-4 bg-white rounded"
          required
        />
        <input
          type="email"
          name="email"
          value={userData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 mb-4 bg-white rounded"
          required
          readOnly={isSubmitted}
        />
        <input
          type="date"
          name="dateOfBirth"
          value={userData.dateOfBirth}
          onChange={handleChange}
          className="w-full p-2 mb-4 bg-white rounded"
          required
        />
        <textarea
          name="interests"
          value={userData.interests}
          onChange={handleChange}
          placeholder="Interests"
          className="w-full p-2 mb-4 bg-white rounded"
          rows="3"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
          disabled={isSubmitted}
        >
          {isSubmitted ? 'Submitted' : 'Submit'}
        </button>
      </form>

      <div className="mt-6">
        <h3 className="text-lg font-semibold">Points</h3>
        <p className="text-4xl font-bold text-center mt-2">{userData.points}</p>
      </div>
    </div>
  );
};

export default Profile;
