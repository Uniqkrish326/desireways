import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await createUserDocument(user);
      await handleReferral(user.uid);

      alert('Signup successful! You and your referrer both received 20 points.');
      navigate('/');
    } catch (error) {
      console.error("Error during signup with email/password:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await createUserDocument(user);
      await handleReferral(user.uid);

      alert('Google signup successful! You and your referrer both received 20 points.');
      navigate('/');
    } catch (error) {
      console.error("Error during Google signup:", error.message);
      setError(error.message);
    }
  };

  const createUserDocument = async (user) => {
    const userRef = doc(db, 'users', user.uid);
    try {
      await setDoc(userRef, {
        email: user.email,
        points: 20,
        referralsCount: 0,
        referralCode: generateReferralCode(user.uid),
        pointsLog: [],
      });
      console.log("New user document created:", user.uid);

      // Add initial points log entry
      await updateDoc(userRef, {
        pointsLog: arrayUnion({
          type: 'signup',
          points: 20,
          description: 'Signup bonus',
          timestamp: serverTimestamp(),
        })
      });
    } catch (error) {
      console.error("Error creating user document:", error.message);
    }
  };

  const handleReferral = async (userId) => {
    if (referralCode) {
      try {
        const referrerRef = doc(db, 'users', referralCode);
        const referrerDoc = await getDoc(referrerRef);

        if (referrerDoc.exists()) {
          const referrerData = referrerDoc.data();
          const referralUserRef = doc(db, 'users', userId);

          // Update referrer points, count, and log
          await updateDoc(referrerRef, {
            points: (referrerData.points || 0) + 20,
            referralsCount: (referrerData.referralsCount || 0) + 1,
            pointsLog: arrayUnion({
              type: 'referral',
              points: 20,
              description: `Referral bonus from user ${userId}`,
              timestamp: serverTimestamp(),
            })
          });

          // Update referral (new user) points and log
          await updateDoc(referralUserRef, {
            points: 40, // Initial 20 points + 20 referral points
            pointsLog: arrayUnion({
              type: 'referred',
              points: 20,
              description: `Referral bonus for using referral code of user ${referralCode}`,
              timestamp: serverTimestamp(),
            })
          });

          console.log("Referral points and count updated successfully.");
          alert('Referral successful! Both users have received 20 points.');
        } else {
          console.error("Invalid referral code.");
          setError('Referral code is invalid.');
        }
      } catch (error) {
        console.error("Error handling referral:", error.message);
      }
    }
  };

  const generateReferralCode = (userId) => {
    return `REF${userId.substring(0, 6)}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form className="bg-white p-8 rounded-lg shadow-lg w-96" onSubmit={handleSignup}>
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Referral Code (optional)"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
          className="w-full p-3 mb-4 border rounded"
        />
        <button
          type="submit"
          className={`w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
        <button
          type="button"
          onClick={handleGoogleSignup}
          className="w-full py-2 mt-4 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Continue with Google
        </button>
      </form>
    </div>
  );
}

export default Signup;
