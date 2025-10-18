
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBD1ol04HIC6EwQq07gYfW0Bnye85BDU8Q",
  authDomain: "sim-traction.firebaseapp.com",
  projectId: "sim-traction",
  storageBucket: "sim-traction.appspot.com",
  messagingSenderId: "521992263521",
  appId: "1:521992263521:web:10236ffd528d1fe1695720",
  measurementId: "G-89V3W6KJ8B"
};

interface FirebaseServices {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

// Initialize Firebase
export function initializeFirebase(): FirebaseServices {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  return { app, auth, firestore };
}
