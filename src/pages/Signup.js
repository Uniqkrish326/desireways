// Signup.js
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, updateDoc, getDocs, query, where, collection, arrayUnion, increment } from 'firebase/firestore';
import { auth, db } from '../firebase'; // Adjust the path as necessary

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');

  // Function to generate a referral code
  const generateReferralCode = (userId) => `REF${userId.substring(0, 6)}`;

  const handleSignup = async () => {
    try {
      // Step 1: Create the user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;
      alert(`User ${newUser.uid} signed up successfully.`); // Alert for successful signup

      // Step 2: Check if the referral code is provided
      if (referralCode) {
        // Step 3: Look up the user with this referral code
        const referrerQuery = await getDocs(query(collection(db, 'users'), where('referralCode', '==', referralCode)));
        if (!referrerQuery.empty) {
          const referrerDoc = referrerQuery.docs[0];
          const referrerId = referrerDoc.id; // Get User A's UID

          // Step 4: Update User A's document
          await updateDoc(doc(db, 'users', referrerId), {
            referralsCount: increment(1), // Increment the count
            referralData: arrayUnion(newUser.uid), // Add User B's UID to User A's referral list
          });
          alert(`User ${newUser.uid} referred successfully to User A (${referrerId}).`); // Alert for referral success
        } else {
          alert('Referral code not valid.'); // Alert if referral code is invalid
        }
      } else {
        alert('No referral code provided.'); // Alert if no referral code is entered
      }

      // Step 5: Create User B's document
      await setDoc(doc(db, 'users', newUser.uid), {
        profileName: email.split('@')[0], // or another method to set username
        dateOfBirth: null, // Initialize as null
        phoneNumber: '',
        points: 0,
        referralCode: generateReferralCode(newUser.uid), // Generate a new referral code for User B
        referralsCount: 0,
        referralData: [], // Initialize as empty
      });

      alert(`User profile for ${newUser.uid} created successfully.`); // Alert for profile creation
    } catch (error) {
      console.error("Error during signup:", error);
      alert(`An error occurred during signup: ${error.message}`); // Alert for errors
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
        required
      />
      <input
        type="text"
        placeholder="Referral Code (optional)"
        value={referralCode}
        onChange={(e) => setReferralCode(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <button
        onClick={handleSignup}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Sign Up
      </button>
    </div>
  );
};

export default Signup;
