import React, { useState } from 'react';
import { auth } from '../firebase'; // Make sure to have Firestore initialized in this file
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Import Firestore functions
import { db } from '../firebase'; // Make sure to import your Firestore instance

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if user document exists
      const userDocRef = doc(db, 'users', user.uid); // Assume your collection is named 'users'
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // User document doesn't exist, create it with default values
        await setDoc(userDocRef, {
          email: user.email,
          // Add any other default fields you want here
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      navigate('/'); // Redirect to home after successful login
    } catch (error) {
      switch (error.code) {
        case 'auth/user-not-found':
          setError('No user found with this email.');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again.');
          break;
        default:
          setError('An error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Check if user document exists
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // User document doesn't exist, create it with default values
        await setDoc(userDocRef, {
          email: user.email,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      navigate('/');
    } catch (error) {
      setError('An error occurred while signing in with Google. Please try again.');
    }
  };

  return (
    <div className="flex items-start justify-center min-h-screen bg-gray-100 pt-4">
      <form className="bg-white p-8 rounded-lg shadow-lg w-96" onSubmit={handleLogin}>
        <h2 className="mb-6 text-2xl font-bold text-center text-blue-600">Login</h2>
        
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
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
          {loading ? 'Logging in...' : 'Log In'}
        </button>
        
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-2 mt-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
        >
          Continue with Google
        </button>
        
        <p className="mt-4 text-center text-gray-600">
          Don’t have an account?{' '}
          <a href="../desireways/signup" className="text-blue-500 hover:text-blue-600 font-semibold">Sign up</a>
        </p>
      </form>
    </div>
  );
}

export default Login;