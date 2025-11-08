import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHRbvGZOUwkAKFScGSK2aPwaTzMmK6lYk",
  authDomain: "lovestorybyanna-80609.firebaseapp.com",
  projectId: "lovestorybyanna-80609",
  storageBucket: "lovestorybyanna-80609.firebasestorage.app",
  messagingSenderId: "515650433201",
  appId: "1:515650433201:web:82b32f9022d6de695af290",
  measurementId: "G-7LCC5TP80G"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;