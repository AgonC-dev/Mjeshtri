import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Connect to Emulators if running locally
if (import.meta.env.DEV || window.location.hostname === "localhost") {
  console.log("Connecting to Firebase Emulators...");
  
  // 1. Connect Functions (Port 5001)
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
  
  // 2. Connect Firestore (Port 8080 is default - double check your terminal)
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
  
  // 3. Connect Auth (Port 9099) - highly recommended to avoid mixing users
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
}