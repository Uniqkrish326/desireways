import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, Timestamp, arrayUnion } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  // State variables
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [profileDetails, setProfileDetails] = useState({
    profileName: '',
    dateOfBirth: '',
    phoneNumber: '',
    points: 0,
  });
  const [referralCode, setReferralCode] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [referralsCount, setReferralsCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          setProfileDetails({
            profileName: data.profileName || '',
            dateOfBirth: data.dateOfBirth ? formatDate(data.dateOfBirth) : '', // Use formatDate function
            phoneNumber: data.phoneNumber || '',
            points: data.points || 0,
          });
          const generatedReferralCode = data.referralCode || generateReferralCode(user.uid);
          setReferralCode(generatedReferralCode);
          setReferralLink(`https://uniqkrish326.github.io/desireways/signup?ref=${generatedReferralCode}`);
          setReferralsCount(data.referralsCount || 0);
        }
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // Toggle edit mode
  const handleEditToggle = () => {
    setEditing(!editing);
  };

  // Generate a referral code
  const generateReferralCode = (userId) => `REF${userId.substring(0, 6)}`;

  // Format the date of birth
  const formatDate = (date) => {
    const dateObj = date instanceof Timestamp ? date.toDate() : new Date(date);
    return dateObj.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  // Log points for user actions
  const logPoints = async (userId, points, action) => {
    const userRef = doc(db, 'users', userId);
    const newLog = {
      timestamp: new Date().toISOString(),
      points,
      action,
    };

    // Update the user's document in Firestore
    await updateDoc(userRef, {
      pointsLog: arrayUnion(newLog), // Use arrayUnion to add to the array
    });
  };

  // Log profile updates
  const logProfileUpdate = async (userId, previousData, pointsAwarded = 0) => {
    const userRef = doc(db, 'users', userId);
    const newLog = {
      timestamp: new Date().toISOString(),
      action: pointsAwarded > 0 ? "Profile filled for the first time" : "Profile updated",
      pointsAwarded,
      previousData,
    };

    // Update the user's document in Firestore
    await updateDoc(userRef, {
      profileLogs: arrayUnion(newLog), // Use arrayUnion to add to the array
    });

    // Store current profile data
    const currentProfile = {
      profileName: profileDetails.profileName,
      dateOfBirth: Timestamp.fromDate(new Date(profileDetails.dateOfBirth)), // Firestore timestamp
      phoneNumber: profileDetails.phoneNumber,
      timestamp: new Date().toISOString(),
    };

    // Store the current profile data in Firestore
    await updateDoc(userRef, {
      profileData: arrayUnion(currentProfile), // Use arrayUnion to add to the array
    });
  };

  // Handle profile saving
  const handleSaveProfile = async () => {
    try {
      const now = Date.now();
      const user = auth.currentUser;

      // Rate limit for profile updates
      if (now - lastUpdated < 300000) {
        alert('You can only update your profile every 5 minutes.');
        return;
      }

      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      const currentPoints = userDoc.exists() && typeof userDoc.data().points === 'number' 
        ? userDoc.data().points 
        : 0;
      const isProfileFilled = userDoc.exists() ? userDoc.data().profileFilled : false;

      // Check if date of birth is required
      if (!profileDetails.dateOfBirth) {
        alert("Date of Birth is required."); // Instead of throwing an error, notify the user
        return;
      }

      if (!isProfileFilled) {
        // Log points and profile update for first-time profile fill
        await updateDoc(userRef, {
          ...profileDetails,
          dateOfBirth: Timestamp.fromDate(new Date(profileDetails.dateOfBirth)), // Firestore timestamp
          points: currentPoints + 50,
          profileFilled: true,
          referralCode: generateReferralCode(user.uid), // Generate and store referral code
          referralsCount: 0, // Initialize referrals count
        });
        await logPoints(user.uid, 50, 'Profile filled for the first time');
        await logProfileUpdate(user.uid, {}, 50);
        alert("50 points have been awarded for filling your profile!");
      } else {
        // Log previous data before updating
        const previousData = {
          profileName: userDoc.data().profileName,
          dateOfBirth: userDoc.data().dateOfBirth,
          phoneNumber: userDoc.data().phoneNumber,
        };
        await logProfileUpdate(user.uid, previousData);
        await updateDoc(userRef, {
          ...profileDetails,
          dateOfBirth: Timestamp.fromDate(new Date(profileDetails.dateOfBirth)), // Firestore timestamp
        });
      }

      setLastUpdated(now);
      setEditing(false);
      setUserData((prev) => ({
        ...prev,
        ...profileDetails,
        dateOfBirth: Timestamp.fromDate(new Date(profileDetails.dateOfBirth)), // Update local state
        points: isProfileFilled ? currentPoints : currentPoints + 50,
      }));
    } catch (error) {
      console.error("Error saving profile:", error); // Log error for debugging
      alert("An error occurred while saving your profile. Please try again later.");
    }
  };

  // Loading state
  if (loading) {
    return <p className="text-center text-gray-800">Loading...</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-100">
      <button
        onClick={() => navigate(-1)}
        className="bg-gray-300 text-black px-4 py-2 rounded mb-4 hover:bg-gray-400 transition"
      >
        Back
      </button>
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Profile</h1>
      <div className="border border-gray-300 rounded-lg p-6 bg-white shadow-md">
        {editing ? (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2 text-gray-700">Profile Name</label>
              <input
                type="text"
                value={profileDetails.profileName}
                onChange={(e) => setProfileDetails({ ...profileDetails, profileName: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded text-black"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2 text-gray-700">Date of Birth</label>
              <input
                type="date"
                value={profileDetails.dateOfBirth}
                onChange={(e) => setProfileDetails({ ...profileDetails, dateOfBirth: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded text-black"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2 text-gray-700">Phone Number</label>
              <input
                type="text"
                value={profileDetails.phoneNumber}
                onChange={(e) => setProfileDetails({ ...profileDetails, phoneNumber: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded text-black"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSaveProfile}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                Save
              </button>
              <button
                onClick={handleEditToggle}
                className="bg-red-500 text-white px-4 py-2 rounded ml-2 hover:bg-red-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-gray-800"><strong>Name:</strong> {userData?.profileName}</p>
            <p className="text-gray-800"><strong>Date of Birth:</strong> {userData?.dateOfBirth ? formatDate(userData.dateOfBirth) : "Not set"}</p>
            <p className="text-gray-800"><strong>Phone Number:</strong> {userData?.phoneNumber || "Not set"}</p>
            <p className="text-gray-800"><strong>Points:</strong> {userData?.points || 0}</p>
            <p className="text-gray-800"><strong>Referral Code:</strong> {referralCode}</p>
            <p className="text-gray-800"><strong>Referral Link:</strong> <a href={referralLink} className="text-blue-600 hover:underline">{referralLink}</a></p>
            <p className="text-gray-800"><strong>Total Referrals:</strong> {referralsCount}</p>
            <button
              onClick={handleEditToggle}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600 transition"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
