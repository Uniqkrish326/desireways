import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, Timestamp, arrayUnion } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
            dateOfBirth: data.dateOfBirth ? formatDate(data.dateOfBirth) : '',
            phoneNumber: data.phoneNumber || '',
            points: data.points || 0,
          });
          const generatedReferralCode = data.referralCode || generateReferralCode(user.uid);
          setReferralCode(generatedReferralCode);
          setReferralLink(`https://uniqkrish326.github.io/desireways/#/signup?ref=${generatedReferralCode}`);
        }
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleEditToggle = () => setEditing(!editing);

  const generateReferralCode = (userId) => `REF${userId.substring(0, 6)}`;

  const formatDate = (date) => {
    const dateObj = date instanceof Timestamp ? date.toDate() : new Date(date);
    return dateObj.toISOString().split('T')[0];
  };

  const handleSaveProfile = async () => {
    try {
      const user = auth.currentUser;
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      // Check if the profile is being filled for the first time
      const isProfileFilled = userDoc.exists() ? userDoc.data().profileFilled : false;

      // Prepare profileData object
      const profileData = {
        profileName: profileDetails.profileName,
        dateOfBirth: Timestamp.fromDate(new Date(profileDetails.dateOfBirth)),
        phoneNumber: profileDetails.phoneNumber,
        timestamp: new Date(),
        profileFilled: true,
      };

      // Update the user document
      await updateDoc(userRef, {
        ...profileDetails,
        dateOfBirth: Timestamp.fromDate(new Date(profileDetails.dateOfBirth)),
        profileFilled: true,
        points: isProfileFilled ? userDoc.data().points : userDoc.data().points + 50, // Award points for filling profile
        pointsLog: arrayUnion({
          description: isProfileFilled ? "Profile updated" : "Profile filled for the first time",
          points: isProfileFilled ? 0 : 50,
          timestamp: new Date(),
          type: isProfileFilled ? "profile_update" : "new_signup",
        }),
        profileData: arrayUnion(profileData),
        profileLogs: arrayUnion({
          action: isProfileFilled ? "Profile updated" : "Profile filled for the first time",
          pointsAwarded: isProfileFilled ? 0 : 50,
          previousData: {
            timestamp: new Date(),
          }
        }),
      });

      setEditing(false);
      setUserData((prev) => ({
        ...prev,
        ...profileDetails,
        dateOfBirth: Timestamp.fromDate(new Date(profileDetails.dateOfBirth)),
        points: isProfileFilled ? userDoc.data().points : userDoc.data().points + 50,
      }));
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("An error occurred while saving your profile. Please try again later.");
    }
  };

  if (loading) {
    return <p className="text-center text-gray-800">Loading...</p>;
  }

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white shadow-lg rounded-lg">
      <button
        onClick={() => navigate(-1)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600 transition-all"
      >
        Back
      </button>
      <h1 className="text-4xl font-bold mb-6 text-blue-700 text-center">Profile</h1>
      <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 shadow-md">
        {editing ? (
          <div>
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-1 text-blue-600">Profile Name</label>
              <input
                type="text"
                value={profileDetails.profileName}
                onChange={(e) => setProfileDetails({ ...profileDetails, profileName: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg text-black focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-1 text-blue-600">Date of Birth</label>
              <input
                type="date"
                value={profileDetails.dateOfBirth}
                onChange={(e) => setProfileDetails({ ...profileDetails, dateOfBirth: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg text-black focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-1 text-blue-600">Phone Number</label>
              <input required
                type="text"
                value={profileDetails.phoneNumber}
                onChange={(e) => setProfileDetails({ ...profileDetails, phoneNumber: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg text-black focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleSaveProfile}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-all"
              >
                Save
              </button>
              <button
                onClick={handleEditToggle}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-700 text-lg"><strong>Name:</strong> {userData?.profileName}</p>
            <p className="text-gray-700 text-lg"><strong>Date of Birth:</strong> {userData?.dateOfBirth ? formatDate(userData.dateOfBirth) : "Not set"}</p>
            <p className="text-gray-700 text-lg"><strong>Phone Number:</strong> {userData?.phoneNumber || "Not set"}</p>
            <p className="text-gray-700 text-lg"><strong>Points:</strong> {userData?.points || 0}</p>
            <p className="text-gray-700 text-lg"><strong>Referral Code:</strong> {referralCode}</p>
            <p className="text-gray-700 text-lg"><strong>Referral Link:</strong> <a href={referralLink} className="text-blue-500 underline hover:text-blue-700">{referralLink}</a></p>
            <button
              onClick={handleEditToggle}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg mt-4 hover:bg-blue-600 transition-all"
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
