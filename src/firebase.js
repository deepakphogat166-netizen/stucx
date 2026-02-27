import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxXbJ5MJPoPzt_1bBuU1U4T2JJ3Gj_huA",
  authDomain: "stucx-app.firebaseapp.com",
  projectId: "stucx-app",
  storageBucket: "stucx-app.firebasestorage.app",
  messagingSenderId: "772490832481",
  appId: "1:772490832481:web:729f2d1f7d5793f9c49820"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

