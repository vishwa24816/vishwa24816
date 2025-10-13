
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBLWFXeWudFVD75x7zbVVIUsBbLTCRRA34",
  authDomain: "sim-traction-database.firebaseapp.com",
  projectId: "sim-traction-database",
  storageBucket: "sim-traction-database.appspot.com",
  messagingSenderId: "935962567533",
  appId: "1:935962567533:web:0783472a1c50bf0e82f064"
};


interface FirebaseServices {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

export function initializeFirebase(): FirebaseServices {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  return { app, auth, firestore };
}
