import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/'); // Redirect to home after successful signup
    } catch (error) {
      setError(error.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/'); // Redirect to home after successful signup
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
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
        />
        
        <div className="relative mb-4">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <span onClick={togglePasswordVisibility} className="absolute right-3 top-3 cursor-pointer">
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </span>
        </div>
        
        <button type="submit" className="w-full py-2 mt-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300">
          Sign Up
        </button>
        
        <button
          type="button"
          onClick={handleGoogleSignup}
          className="w-full py-2 mt-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
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
