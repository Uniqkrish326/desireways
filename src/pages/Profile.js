// src/pages/Profile.js
import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
    interests: '',
    points: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;

      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData({
              ...data.profile[0],
              email: user.email,
              points: data.points || 0,
            });
            setIsEditing(true);
          } else {
            // Initialize empty profile if not present in Firestore
            await updateDoc(docRef, { profile: [{}], points: 0 });
            setMessage('Welcome! Please complete your profile.');
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          setMessage('Failed to load user data, please try again later.');
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (user) {
      const docRef = doc(db, 'users', user.uid);

      try {
        const userDoc = await getDoc(docRef);
        if (userDoc.exists()) {
          const isFirstTime = userDoc.data().profile.length === 0;
          const newPoints = isFirstTime ? 50 : userData.points;
          await updateDoc(docRef, {
            profile: [userData],
            points: newPoints,
          });

          setUserData((prev) => ({ ...prev, points: newPoints }));
          setMessage(isFirstTime ? 'Profile created and 50 points awarded!' : 'Profile updated!');
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        setMessage('Failed to update profile. Please try again.');
      }
    }
    setIsEditing(true);
  };

  if (loading) return <p>Loading user data...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-200 text-gray-900 rounded-lg shadow-md">
      <span onClick={() => navigate(-1)} className="text-blue-600 cursor-pointer mb-4 inline-block">Back</span>
      
      <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Edit Profile' : 'Create Profile'}</h2>
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
          placeholder="Email"
          className="w-full p-2 mb-4 bg-gray-100 rounded"
          readOnly
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
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          {isEditing ? 'Update' : 'Submit'}
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
