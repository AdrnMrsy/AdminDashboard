// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "guidanceweb-43eec.firebaseapp.com",
  projectId: "guidanceweb-43eec",
  storageBucket: "guidanceweb-43eec.appspot.com",
  messagingSenderId: "68099093831",
  appId: "1:68099093831:web:d5852faec4d8603d02c862",
  measurementId: "G-X2PYPXCXN8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth();
const storage = getStorage(app);

export { app, db, auth ,storage};
