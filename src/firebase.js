// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'; // Importing getAuth to use authentication
import { getFirestore } from 'firebase/firestore'; 
// Import Firestore if you need it
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBbpF_TVugG-kuEd9G2G_0EazF7djLKy7Q",
  authDomain: "desireways01.firebaseapp.com",
  projectId: "desireways01",
  storageBucket: "desireways01.appspot.com",
  messagingSenderId: "281071306382",
  appId: "1:281071306382:web:0d6b174075c7a93063ebdf",
  measurementId: "G-9Q6XVFGDF0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // Exporting auth
export const db = getFirestore(app); // Exporting Firestore


