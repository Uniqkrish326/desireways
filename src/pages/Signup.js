import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
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

      // Create user document
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        email: user.email,
        points: 20,
        referralsCount: 0,
        referralCode: generateReferralCode(user.uid),
      });
      logAction(`User ${user.uid} signed up and received 20 points.`);

      // Handle referral code
      if (referralCode) {
        const referrerRef = doc(db, 'users', referralCode);
        const referrerDoc = await getDoc(referrerRef);

        if (referrerDoc.exists()) {
          const referrerData = referrerDoc.data();
          const updatedPoints = (referrerData.points || 0) + 20;
          const updatedReferralsCount = (referrerData.referralsCount || 0) + 1;

          await updateDoc(referrerRef, {
            points: updatedPoints,
            referralsCount: updatedReferralsCount,
          });
          logAction(`Referral by ${user.uid} added 20 points and updated referral count for referrer ${referralCode}.`);
        } else {
          setError('Referral code is invalid.');
        }
      }

      navigate('/'); // Redirect to home after successful signup
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateReferralCode = (userId) => {
    return `REF${userId.substring(0, 6)}`;
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
        });
        logAction(`Google signup: User ${user.uid} received 20 points.`);
      }

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
          className="w-full mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
          aria-label="Email"
        />
        
        <div className="relative mb-4">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
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
          className="w-full mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
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
