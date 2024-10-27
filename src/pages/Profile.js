// src/pages/Profile.js
import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { MdError } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';

const Profile = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
    interests: '',
    points: 0,
    logs: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userDataFromDB = docSnap.data();
          setUserData({
            ...userDataFromDB.profile[0],
            email: user.email,
            points: userDataFromDB.points || 0,
            logs: userDataFromDB.logs || [],
          });
          setIsEditing(true);
        } else {
          await updateDoc(docRef, { profile: [], points: 0, logs: [] });
        }
        setLoading(false);
      } else {
        setLoading(false); // Set loading to false even if no user is logged in
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const { name, dateOfBirth, interests } = userData;

    if (!name || !dateOfBirth || !interests) {
      setError('Please fill in all required fields.');
      return;
    }

    const user = auth.currentUser;

    if (user) {
      const docRef = doc(db, 'users', user.uid);
      setIsSubmitting(true);
      try {
        const userDoc = await getDoc(docRef);
        if (userDoc.exists()) {
          const currentProfile = userDoc.data().profile;

          if (currentProfile.length === 0) {
            const newPoints = (userDoc.data().points || 0) + 50;
            const newLogs = [
              { reason: 'Profile created', timestamp: new Date().toISOString() },
            ];

            await updateDoc(docRef, {
              profile: [userData],
              points: newPoints,
              logs: newLogs,
            });

            setUserData((prev) => ({ ...prev, points: newPoints, logs: newLogs }));
            setShowAlert(true);
            setAlertMessage('You have earned 50 points for creating your profile!');
          } else {
            await updateDoc(docRef, {
              profile: [userData],
              logs: [
                ...userDoc.data().logs,
                { reason: 'Profile updated', timestamp: new Date().toISOString() },
              ],
            });

            setShowAlert(true);
            setAlertMessage('Profile updated successfully!');
          }
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        setError('Failed to update profile. Please try again.');
      } finally {
        setIsSubmitting(false);
        setIsEditing(true);
      }
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <p className="text-center text-gray-600">Loading user data...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-md">
      {/* Back Text */}
      <span 
        onClick={handleBack} 
        className="mb-4 text-blue-400 cursor-pointer text-sm hover:underline" 
        style={{ padding: '10px' }}>
        Back
      </span>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Profile Edit Section */}
        <div className="col-span-1 bg-gray-900 p-4 rounded shadow-md">
          <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Edit Profile' : 'Create Profile'}</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full p-2 mb-4 bg-gray-700 text-white rounded focus:outline-none"
              required
            />
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-2 mb-4 bg-gray-700 text-white rounded focus:outline-none"
              readOnly
            />
            <input
              type="date"
              name="dateOfBirth"
              value={userData.dateOfBirth}
              onChange={handleChange}
              className="w-full p-2 mb-4 bg-gray-700 text-white rounded focus:outline-none"
              required
            />
            <textarea
              name="interests"
              value={userData.interests}
              onChange={handleChange}
              placeholder="Interests"
              className="w-full p-2 mb-4 bg-gray-700 text-white rounded focus:outline-none"
              rows="3"
              required
            />
            <button type="submit" className="w-full bg-blue-600 p-2 rounded hover:bg-blue-700">
              {isEditing ? 'Edit' : 'Submit'}
            </button>
            {error && (
              <div className="flex items-center text-red-500 mt-2">
                <MdError className="mr-2" />
                <p>{error}</p>
              </div>
            )}
          </form>
        </div>

        {/* Points Section */}
        <div className="col-span-1 flex flex-col items-center bg-gray-900 p-4 rounded shadow-md">
          <div className="relative bg-blue-600 rounded-full w-32 h-32 flex items-center justify-center">
            <span className="text-4xl font-bold">{userData.points}</span>
            <span className="absolute bottom-1 text-sm">Points</span>
          </div>
          <h3 className="text-lg font-semibold mt-4">Statistics</h3>
        </div>

        {/* Logs Section */}
        <div className="col-span-1 bg-gray-900 p-4 rounded shadow-md">
          <h3 className="text-lg font-bold mb-2">Logs</h3>
          <div className="bg-gray-800 rounded p-2 max-h-40 overflow-y-auto">
            <ul>
              {(userData.logs || []).map((log, index) => (
                <li key={index} className="mb-2">
                  {new Date(log.timestamp).toLocaleString()}: {log.reason}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Alert Popup */}
      {showAlert && (
        <div className="fixed top-0 left-0 right-0 flex items-center justify-center z-50">
          <div className="bg-green-600 text-white p-4 rounded shadow-md">
            <p>{alertMessage}</p>
            <button
              onClick={handleCloseAlert}
              className="mt-2 bg-red-500 text-white rounded px-2 py-1 hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
