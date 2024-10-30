// Signup.js
import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { setDoc, doc, getDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // Create a new user with email and password
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Generate a referral code for the new user
      const generatedReferralCode = `REF${user.uid.substring(0, 6)}`;

      // Create user document in Firestore
      const userDoc = doc(db, 'users', user.uid);
      await setDoc(userDoc, {
        profileName: '',
        email,
        points: 0,
        referralCode: generatedReferralCode,
        referralsCount: 0,
        referralData: [],
      });

      // Check if a referral code was provided
      if (referralCode) {
        const referrerDoc = doc(db, 'users', referralCode);
        const referrerSnap = await getDoc(referrerDoc);
        if (referrerSnap.exists()) {
          // Update the referrer document with User B's UID
          await updateDoc(referrerDoc, {
            referralsCount: increment(1), // Increment the referral count
            referralData: arrayUnion(user.uid), // Add User B's UID to the referrer
          });

          // Alert User A that User B has registered
          alert('User B has successfully registered using your referral code!');
        } else {
          alert('Referral code is invalid. Please check and try again.');
        }
      } else {
        alert('User registered successfully without using a referral code!');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      alert(`Error signing up: ${error.message}`); // Alert with the error message
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <input
        type="text"
        value={referralCode}
        onChange={(e) => setReferralCode(e.target.value)}
        placeholder="Referral Code (optional)"
      />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default Signup;
