import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendEmailVerification } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import Modal from 'react-modal'; // Import modal library

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

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!validateEmail(email)) {
            setError('Only Gmail accounts are allowed.');
            setLoading(false);
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (!user.emailVerified) {
                await sendEmailVerification(user);
                openModal();
            }

            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, {
                email: user.email,
                points: 20,
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
            });

            setLoading(false);
            navigate('/login');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        const provider = new GoogleAuthProvider();
        setLoading(true);
        setError('');
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);

            if (!userDoc.exists()) {
                await setDoc(userRef, {
                    email: user.email,
                    points: 20,
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
                });
            }

            const userDetails = await getUserDetails();
            const logsData = {
                lastLoginIP: userDetails?.ipAddress || "Unknown IP",
                lastLoginTimestamp: new Date().toISOString(),
                location: userDetails?.location || { city: "Unknown", region: "Unknown", country: "Unknown" },
                userAgent: userDetails?.userAgent || "Unknown User Agent",
            };

            await updateDoc(userRef, {
                logs: arrayUnion(logsData),
            });

            setLoading(false);
            navigate('/');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const validateEmail = (email) => email.endsWith('@gmail.com');
    const generateReferralCode = (userId) => `REF${userId.substring(0, 6)}`;

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
                    <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 cursor-pointer">
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
                    className="w-full py-2 mt-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
                    disabled={loading}
                >
                    Continue with Google
                </button>

                <Modal isOpen={modalOpen} onRequestClose={closeModal} className="modal" ariaHideApp={false}>
                    <h2>Email Verification</h2>
                    <p>A verification link has been sent to your email. Please verify to complete registration.</p>
                    <button onClick={closeModal}>OK</button>
                </Modal>
            </form>
        </div>
    );
}

export default Signup;
