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

    // Function to handle email signup
    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Create user document
            const userRef = doc(db, 'users', user.uid);
            const newReferralCode = generateReferralCode(user.uid);

            // Add the new user with default points and referral code
            await setDoc(userRef, {
                email: user.email,
                points: 20, // New user starts with 20 points
                referralsCount: 0,
                referralCode: newReferralCode,
            });
            logAction(`User ${user.uid} signed up and received 20 points.`);

            // Handle referral code if provided
            if (referralCode) {
                await handleReferral(referralCode, user.uid);
            }

            navigate('/'); // Redirect to home after successful signup
        } catch (error) {
            setError(error.message); // Set error message if there's an issue
        } finally {
            setLoading(false);
        }
    };

    // Function to handle Google signup
    const handleGoogleSignup = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check if user already exists
            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);
            if (!userDoc.exists()) {
                const newReferralCode = generateReferralCode(user.uid);

                // Create user document
                await setDoc(userRef, {
                    email: user.email,
                    points: 20, // New user starts with 20 points
                    referralsCount: 0,
                    referralCode: newReferralCode,
                });
                logAction(`Google signup: User ${user.uid} received 20 points.`);

                // Handle referral code if provided
                if (referralCode) {
                    await handleReferral(referralCode, user.uid);
                }
            }

            navigate('/'); // Redirect to home after successful signup
        } catch (error) {
            setError(error.message); // Set error message if there's an issue
        }
    };

    // Function to handle the referral process
    const handleReferral = async (referralCode, newUserId) => {
        try {
            const referrerRef = doc(db, 'users', referralCode); // Lookup referrer by their user ID
            const referrerDoc = await getDoc(referrerRef);

            if (referrerDoc.exists()) {
                const referrerData = referrerDoc.data();

                // Update points and referral count for the referrer
                await updateDoc(referrerRef, {
                    points: (referrerData.points || 0) + 20, // Add 20 points to referrer
                    referralsCount: (referrerData.referralsCount || 0) + 1, // Increment referral count
                });
                logAction(`Referral by ${newUserId} added 20 points and updated referral count for referrer ${referrerData.referralCode}.`);

                // Show alert that both users got points
                alert(`Both you and ${referrerData.email} have received 20 points for the referral!`);
            } else {
                console.log('Referral code is invalid.'); // Inform the user if the referral code does not exist
                alert('Referral code is invalid.');
            }
        } catch (error) {
            console.error('Error updating referrer:', error);
            setError('Error processing referral.');
        }
    };

    // Function to generate a unique referral code
    const generateReferralCode = (userId) => {
        return `REF${userId.substring(0, 6)}`; // Generate a referral code based on user ID
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword); // Toggle password visibility
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
                        {showPassword ? '👁️' : '🙈'}
                    </span>
                </div>
                
                <input
                    type="text"
                    placeholder="Referral Code (if any)"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    className="w-full mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    aria-label="Referral Code"
                />
                
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition duration-300"
                >
                    Sign Up
                </button>
                
                <button
                    type="button"
                    onClick={handleGoogleSignup}
                    className="w-full bg-red-600 text-white p-3 rounded-md hover:bg-red-700 transition duration-300 mt-4"
                >
                    Continue with Google
                </button>
                
                <p className="mt-4 text-center">
                    Already have an account?{' '}
                    <a href="/login" className="text-blue-600 hover:underline">
                        Log In
                    </a>
                </p>
            </form>
        </div>
    );
}

export default Signup;
