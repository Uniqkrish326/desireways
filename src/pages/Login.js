// src/pages/Login.js
import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore'; // Import arrayUnion here
import { db } from '../firebase';

// Function to fetch user details based on IP
const getUserDetails = async () => {
    try {
        // This API should return the user's IP address details
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) throw new Error('Failed to fetch IP details');
        const data = await response.json();
        return {
            ipAddress: data.ip,
            location: {
                city: data.city || 'Unknown',
                region: data.region || 'Unknown',
                country: data.country_name || 'Unknown',
            },
            userAgent: navigator.userAgent || 'Unknown User Agent',
        };
    } catch (error) {
        // Handle error gracefully without showing it to the user
        console.error('Error fetching user details:', error);
        return null; // Return null to signify failure in fetching user details
    }
};

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Check if user's email is verified
            if (!user.emailVerified) {
                setError('Please verify your email before logging in.');
                await auth.signOut(); // Sign the user out if the email is not verified
                setLoading(false);
                return;
            }

            // Get user details (IP, location, and device info)
            const userDetails = await getUserDetails();

            // Prepare logs data
            const loginTimestamp = new Date().toISOString(); // Current timestamp
            const logsData = {
                lastLoginIP: userDetails?.ipAddress || "Unknown IP", // Fallback to a default value
                lastLoginTimestamp: loginTimestamp || "Unknown Timestamp", // Fallback to a default value
                location: userDetails?.location || { city: "Unknown", region: "Unknown", country: "Unknown" }, // Fallback
                userAgent: userDetails?.userAgent || "Unknown User Agent", // Fallback
            };

            // Update Firestore with login logs
            const userRef = doc(db, 'users', user.uid); // Ensure you have a collection named 'users'
            await updateDoc(userRef, {
                logs: arrayUnion(logsData), // Ensure `logs` is an array in Firestore
            });

            navigate('/'); // Redirect to home if verified
        } catch (error) {
            setError(error.message); // Handle error and display message
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check if user's email is verified
            if (!user.emailVerified) {
                setError('Please verify your email before logging in.');
                await auth.signOut(); // Sign the user out if the email is not verified
                return;
            }

            // Get user details (IP, location, and device info)
            const userDetails = await getUserDetails();

            // Prepare logs data
            const loginTimestamp = new Date().toISOString(); // Current timestamp
            const logsData = {
                lastLoginIP: userDetails?.ipAddress || "Unknown IP", // Fallback to a default value
                lastLoginTimestamp: loginTimestamp || "Unknown Timestamp", // Fallback to a default value
                location: userDetails?.location || { city: "Unknown", region: "Unknown", country: "Unknown" }, // Fallback
                userAgent: userDetails?.userAgent || "Unknown User Agent", // Fallback
            };

            // Update Firestore with login logs
            const userRef = doc(db, 'users', user.uid); // Ensure you have a collection named 'users'
            await updateDoc(userRef, {
                logs: arrayUnion(logsData), // Ensure `logs` is an array in Firestore
            });

            navigate('/'); // Redirect to home if verified
        } catch (error) {
            setError(error.message); // Handle error and display message
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex items-start justify-center min-h-screen bg-gray-100 pt-4">
            <form className="bg-white p-8 rounded-lg shadow-lg w-96" onSubmit={handleLogin}>
                <h2 className="mb-6 text-2xl font-bold text-center text-blue-600">Log In</h2>
                
                {error && <p className="text-red-500 mb-4">{error}</p>}
                
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-4 p-3 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                />
                
                <div className="relative mb-4"> {/* Wrapper for password input and toggle */}
                    <input
                        type={showPassword ? 'text' : 'password'} // Toggle between text and password
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                    <span onClick={togglePasswordVisibility} className="absolute right-3 top-3 cursor-pointer">
                        {showPassword ? '👁️' : '👁️‍🗨️'} {/* Eye icon to show/hide password */}
                    </span>
                </div>
                
                <button 
                    type="submit" 
                    className={`w-full py-2 mt-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading}
                >
                    {loading ? 'Logging In...' : 'Log In'}
                </button>
                
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className={`w-full py-2 mt-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading}
                >
                    Continue with Google
                </button>
                
                <p className="mt-4 text-center text-gray-600">
                    Don't have an account?{' '}
                    <a href="../desireways/signup" className="text-blue-500 hover:text-blue-600 font-semibold">Sign up</a>
                </p>
  
            </form>
        </div>
    );
}

export default Login;
