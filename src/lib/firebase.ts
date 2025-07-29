// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  projectId: "karnataka-news-pulse",
  appId: "1:943034602473:web:f66a706788966b5be87178",
  storageBucket: "karnataka-news-pulse.firebasestorage.app",
  apiKey: "AIzaSyC1j8TG72O6K-ibOEdruCeLYQ8CBgacfB0",
  authDomain: "karnataka-news-pulse.firebaseapp.com",
  messagingSenderId: "943034602473"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
