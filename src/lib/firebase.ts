// src/lib/firebase.ts
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

function initializeFirebase() {
  if (typeof window !== 'undefined') { // Ensure this runs only on the client
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      db = getFirestore(app);
      try {
        enableIndexedDbPersistence(db)
          .catch((err) => {
            if (err.code == 'failed-precondition') {
              console.warn(
                'Firestore persistence failed: Multiple tabs open, persistence can only be enabled in one tab at a time.'
              );
            } else if (err.code == 'unimplemented') {
              console.warn(
                'Firestore persistence failed: The current browser does not support all of the features required to enable persistence.'
              );
            }
          });
      } catch (error) {
        console.error("Error enabling Firestore persistence: ", error);
      }
    } else {
      app = getApp();
      auth = getAuth(app);
      db = getFirestore(app);
    }
  }
}

// This function should be called before using 'auth' or 'db'
initializeFirebase();

export { app, db, auth };
