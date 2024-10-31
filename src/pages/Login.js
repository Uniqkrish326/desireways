import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';

const getUserDetails = async () => {
    try {
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
        console.error('Error fetching user details:', error);
        return null;
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

            await user.reload();
            if (!user.emailVerified) {
                setError('Your signup is incomplete. Please check your email for the verification link.');
                setLoading(false);
                return;
            }

            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (!userDoc.exists()) {
                setError('User record not found. Please sign up again.');
                setLoading(false);
                return;
            }

            const userDetails = await getUserDetails();
            const logsData = {
                lastLoginIP: userDetails?.ipAddress || "Unknown IP",
                lastLoginTimestamp: new Date().toISOString(),
                location: userDetails?.location || { city: "Unknown", region: "Unknown", country: "Unknown" },
                userAgent: userDetails?.userAgent || "Unknown User Agent",
            };

            await updateDoc(doc(db, 'users', user.uid), {
                logs: arrayUnion(logsData),
            });

            navigate('/');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (!userDoc.exists()) {
                setError('User record not found. Please sign up again.');
                return;
            }

            const userDetails = await getUserDetails();
            const logsData = {
                lastLoginIP: userDetails?.ipAddress || "Unknown IP",
                lastLoginTimestamp: new Date().toISOString(),
                location: userDetails?.location || { city: "Unknown", region: "Unknown", country: "Unknown" },
                userAgent: userDetails?.userAgent || "Unknown User Agent",
            };

            await updateDoc(doc(db, 'users', user.uid), {
                logs: arrayUnion(logsData),
            });

            navigate('/');
        } catch (error) {
            setError(error.message);
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
                
                <div className="relative mb-4">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
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
