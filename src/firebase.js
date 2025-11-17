// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAVQX5Q_3y_HhbhNAhTN1FfXX244W2yfWA",
  authDomain: "sallam-system.firebaseapp.com",
  projectId: "sallam-system",
  storageBucket: "sallam-system.firebasestorage.app",
  messagingSenderId: "369857463922",
  appId: "1:369857463922:web:9748a735c6c7b737d364eb",
  measurementId: "G-S1BZ4P83L4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
