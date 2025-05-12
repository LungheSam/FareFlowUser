// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// const firebaseConfig = {
//     apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//     authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//     databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
//     projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//     storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//     appId: process.env.REACT_APP_FIREBASE_APP_ID,
//     measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
//   };

const firebaseConfig = {
    apiKey: "AIzaSyCi4wYugLsCw3TMKy-fh2nGhEUMXuHNCjI",
    authDomain: "fareflow-a1f8c.firebaseapp.com",
    databaseURL: "https://fareflow-a1f8c-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "fareflow-a1f8c",
    storageBucket: "fareflow-a1f8c.firebasestorage.app",
    messagingSenderId: "746807428725",
    appId: "1:746807428725:web:d8877d98952849f3115a3c",
    measurementId: "G-FMHQL89TGV"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };