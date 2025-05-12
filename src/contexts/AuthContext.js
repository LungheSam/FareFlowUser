import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../services/firebase';
import {
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  doc,
  onSnapshot,
  updateDoc,
  increment,
  arrayUnion,
} from 'firebase/firestore';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Login function
  async function login(email, password, cardUID) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Store cardUID in localStorage
      localStorage.setItem('cardUID', cardUID);

      return userCredential;
    } catch (error) {
      throw error;
    }
  }

  // Logout function
  function logout() {
    localStorage.removeItem('cardUID');
    setUserData(null);
    return signOut(auth);
  }

  // Update balance function
  const updateBalance = async (amount) => {
    try {
      if (!userData?.cardUID) throw new Error('User data not loaded');

      const userRef = doc(db, 'users', userData.cardUID);

      // Optimistically update UI
      setUserData(prev => ({
        ...prev,
        balance: (parseFloat(prev.balance) || 0) + amount
      }));

      // Update Firestore
      await updateDoc(userRef, {
        balance: increment(amount),
        transactions: arrayUnion({
          amount,
          date: new Date().toISOString(),
          type: 'deposit'
        })
      });
    } catch (error) {
      // Revert on failure
      setUserData(prev => ({
        ...prev,
        balance: (prev.balance || 0) - amount
      }));
      throw error;
    }
  };

  // Auth + Firestore listener
  useEffect(() => {
    let unsubscribeUserDoc = null;

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);

      if (user) {
        const storedCardUID = localStorage.getItem('cardUID');
        if (storedCardUID) {
          const userDocRef = doc(db, 'users', storedCardUID);

          // Set up real-time listener
          unsubscribeUserDoc = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
              setUserData({
                ...docSnap.data(),
                cardUID: storedCardUID
              });
            } else {
              console.warn('User document not found');
              setUserData(null);
            }
          });
        }
      } else {
        setUserData(null);
        localStorage.removeItem('cardUID');
      }

      setLoading(false);
    });

    // Cleanup listeners
    return () => {
      if (unsubscribeUserDoc) unsubscribeUserDoc();
      unsubscribeAuth();
    };
  }, []);

  const value = {
    currentUser,
    userData,
    login,
    logout,
    updateBalance,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}












