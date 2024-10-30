// src/pages/Signup.js
import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendEmailVerification } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

    // Validate email to allow only Gmail accounts
    if (!validateEmail(email)) {
      setError('Only Gmail accounts are allowed.');
      setLoading(false);
      return;
    }

    try {
      // Check if user already exists
      const userRef = doc(db, 'users', email);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        alert('An account with this email already exists. Please log in.');
        navigate('/login'); // Redirect to login if user exists
        return;
      }

      // Create user account with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);

      // Create user document for the new user
      await setDoc(userRef, {
        email: user.email,
        points: 20, // Starting points for the new user
        referralsCount: 0,
        referralCode: generateReferralCode(user.uid),
        pointsLog: [
          {
            type: 'new_signup',
            points: 20,
            description: 'Starting points for new signup',
            timestamp: new Date().toISOString(),
          },
        ],
        isVerified: false, // Set this to false initially
      });
      logAction(`User ${user.uid} signed up and received 20 points.`);

      alert('Signup successful! Please verify your email to log in.');
      navigate('/login'); // Redirect to login after successful signup
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email) => {
    return email.endsWith('@gmail.com'); // Only allow Gmail accounts
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
      const userRef = doc(db, 'users', user.email); // Use email as the document ID
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        alert('You already have an account. Please log in.'); // Inform the user to log in
        navigate('/login'); // Redirect to the login page
        return;
      }

      // If the user doesn't exist, create a new user document
      await setDoc(userRef, {
        email: user.email,
        points: 20,
        referralsCount: 0,
        referralCode: generateReferralCode(user.uid),
        pointsLog: [
          {
            type: 'new_signup',
            points: 20,
            description: 'Starting points for new signup via Google',
            timestamp: new Date().toISOString(),
          },
        ],
        isVerified: false, // Set this to false initially
      });
      logAction(`Google signup: User ${user.uid} received 20 points.`);

      // Send email verification (optional based on your logic)
      await sendEmailVerification(user);

      alert('Signup successful! Please verify your email to log in.');
      navigate('/login'); // Redirect to home after successful signup
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-start justify-center min-h-screen bg-gray-100 pt-4">
      <form className="bg-white p-8 rounded-lg shadow-lg w-96" onSubmit={handleSignup}>
        <h2 className="mb-6 text-2xl font-bold text-center text-blue-600">Sign Up</h2>
        
        {error && <p className="text-red-500 mb-4">{error}</p>} {/* Display error messages in red */}
        
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
