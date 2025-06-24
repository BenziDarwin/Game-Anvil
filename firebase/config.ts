// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA2Ww7bW_FiZgQ3gkHbe-yanTOsf2qZL44",
  authDomain: "game-anvil-79345.firebaseapp.com",
  projectId: "game-anvil-79345",
  storageBucket: "game-anvil-79345.firebasestorage.app",
  messagingSenderId: "450167805500",
  appId: "1:450167805500:web:2feb9b9b0b93f488b15539",
  measurementId: "G-KYEQ49322B",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

connectFirestoreEmulator(db, "localhost", 8888);
connectAuthEmulator(auth, "http://localhost:9099");
connectStorageEmulator(storage, "localhost", 9199);
export { db, auth, storage };

export default app;
