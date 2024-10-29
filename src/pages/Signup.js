import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const logAction = (message) => {
    console.log(`Log: ${message}`);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user document for the new user
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        email: user.email,
        points: 20, // Starting points for the new user
        referralsCount: 0,
        referralCode: generateReferralCode(user.uid),
        pointsLog: [], // Initialize points log
      });
      logAction(`User ${user.uid} signed up and received 20 points.`);

      // Handle referral code
      await handleReferral(user.uid); // Pass the new user's ID to handle referral

      navigate('/'); // Redirect to home after successful signup
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReferral = async (userId) => {
    if (referralCode) {
      try {
        // Check if referrer exists based on referralCode
        const referrerRef = doc(db, 'users', referralCode);
        const referrerDoc = await getDoc(referrerRef);

        if (referrerDoc.exists()) {
          const referrerData = referrerDoc.data();
          const referralUserRef = doc(db, 'users', userId);

          // Update referrer (user A) points and referral count
          const updatedReferrerPoints = (referrerData.points || 0) + 20; // Referrer gets 20 points
          const updatedReferralCount = (referrerData.referralsCount || 0) + 1; // Increase referral count by 1

          // Update the referrer document
          await updateDoc(referrerRef, {
            points: updatedReferrerPoints,
            referralsCount: updatedReferralCount,
            pointsLog: arrayUnion({
              type: 'referral',
              points: 20,
              description: `Referral bonus from user ${userId}`,
              timestamp: serverTimestamp(),
            }),
          });
          logAction(`Referrer ${referralCode} updated with points: ${updatedReferrerPoints}, referralsCount: ${updatedReferralCount}`);

          // The new user gets their starting points (20)
          await updateDoc(referralUserRef, {
            points: 20, // Only starting points for the new user
            pointsLog: arrayUnion({
              type: 'new_signup',
              points: 20,
              description: 'Starting points for new signup',
              timestamp: serverTimestamp(),
            }),
          });
          logAction(`Referral user ${userId} updated with 20 points and points log entry.`);

          alert('Referral successful! Both users have received points.');
        } else {
          setError('Referral code is invalid.');
          console.error("Invalid referral code.");
        }
      } catch (error) {
        console.error("Error updating referral:", error);
        setError(`Error: ${error.message}`);
      }
    }
  };

  const generateReferralCode = (userId) => {
    return `REF${userId.substring(0, 6)}`; // Generate a unique referral code
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user already exists
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        await setDoc(userRef, {
          email: user.email,
          points: 20,
          referralsCount: 0,
          referralCode: generateReferralCode(user.uid),
          pointsLog: [], // Initialize points log
        });
        logAction(`Google signup: User ${user.uid} received 20 points.`);
      }

      // Handle referral after Google signup
      await handleReferral(user.uid); // Pass the new user's ID to handle referral

      navigate('/'); // Redirect to home after successful signup
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-start justify-center min-h-screen bg-gray-100 pt-4">
      <form className="bg-white p-8 rounded-lg shadow-lg w-96" onSubmit={handleSignup}>
        <h2 className="mb-6 text-2xl font-bold text-center text-blue-600">Sign Up</h2>
        
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
          aria-label="Email"
        />
        
        <div className="relative mb-4">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            aria-label="Password"
          />
          <span onClick={togglePasswordVisibility} className="absolute right-3 top-3 cursor-pointer">
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </span>
        </div>

        <input
          type="text"
          placeholder="Referral Code (optional)"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
          className="w-full mb-4 p-3 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Referral Code"
        />
        
        <button 
          type="submit" 
          className={`w-full py-2 mt-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
        
        <button
          type="button"
          onClick={handleGoogleSignup}
          className={`w-full py-2 mt-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          Continue with Google
        </button>
        
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <a href="../desireways/login" className="text-blue-500 hover:text-blue-600 font-semibold">Log in</a>
        </p>
      </form>
    </div>
  );
}

export default Signup;