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
  // eslint-disable-next-line 
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User is authenticated with UID:", user.uid);
        const docRef = doc(db, 'users', user.uid);

        try {
          const docSnap = await getDoc(docRef);
          console.log("Attempting to retrieve document:", docRef);

          if (docSnap.exists()) {
            const userDataFromDB = docSnap.data();
            console.log("User document retrieved:", userDataFromDB);

            setUserData({
              ...userDataFromDB.profile[0],
              email: user.email,
              points: userDataFromDB.points || 0,
              logs: userDataFromDB.logs || [],
            });
            setIsEditing(true);
          } else {
            console.log("User document does not exist, initializing document.");
            await updateDoc(docRef, { profile: [], points: 0, logs: [] });
          }
        } catch (err) {
          console.error("Error loading user data:", err);
          setError("Failed to load user data. Please try again later.");
        } finally {
          setLoading(false);
        }
      } else {
        console.log("User is not authenticated.");
        setError("User not authenticated. Please log in again.");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

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

  const handleCloseAlert = () => setShowAlert(false);
  const handleBack = () => navigate(-1);

  if (loading) {
    return <p className="text-center text-gray-600">Loading user data...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-md">
      <span 
        onClick={handleBack} 
        className="mb-4 text-blue-400 cursor-pointer text-sm hover:underline" 
        style={{ padding: '10px' }}>
        Back
      </span>

      <h2 className="text-3xl mb-6 font-bold">Profile</h2>

      {showAlert && (
        <div className="p-4 mb-6 bg-green-100 text-green-800 rounded">
          {alertMessage}
          <button onClick={handleCloseAlert} className="ml-4 text-sm text-blue-500 underline">Close</button>
        </div>
      )}

      {error && (
        <div className="p-4 mb-6 bg-red-100 text-red-800 rounded flex items-center">
          <MdError className="text-red-600 mr-2" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            value={userData.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={userData.email}
            readOnly
            className="w-full px-4 py-2 rounded bg-gray-700 text-gray-400 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block mb-1">Date of Birth</label>
          <input
            type="date"
            value={userData.dateOfBirth}
            onChange={(e) => setUserData({ ...userData, dateOfBirth: e.target.value })}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Interests</label>
          <textarea
            value={userData.interests}
            onChange={(e) => setUserData({ ...userData, interests: e.target.value })}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-2 rounded ${isSubmitting ? 'bg-gray-500' : 'bg-blue-500'} text-white font-semibold`}
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
