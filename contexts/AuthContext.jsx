"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { storeToken, storeUserData, removeToken, removeUserData, getUserData } from '@/lib/utils/tokenStorage';

const AuthContext = createContext({
  user: null,
  loading: true,
  isAuthenticated: false,
  token: null,
  updateUserProfile: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Set default persistence to local storage
    setPersistence(auth, browserLocalPersistence).catch((error) => {
      console.error('Error setting persistence:', error);
    });

    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get ID token from Firebase
          const idToken = await firebaseUser.getIdToken();
          
          // Store token in localStorage and cookies
          storeToken(idToken);
          setToken(idToken);

          // Prepare user data for storage
          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            emailVerified: firebaseUser.emailVerified,
            phoneNumber: firebaseUser.phoneNumber,
            metadata: {
              creationTime: firebaseUser.metadata.creationTime,
              lastSignInTime: firebaseUser.metadata.lastSignInTime,
            },
            providerData: firebaseUser.providerData,
          };

          // Store user data
          storeUserData(userData);
          setUser(firebaseUser);
          
          console.log('✅ User authenticated and data stored');
        } catch (error) {
          console.error('❌ Error getting token:', error);
          setUser(firebaseUser);
        }
      } else {
        // User signed out - clear stored data
        removeToken();
        removeUserData();
        setUser(null);
        setToken(null);
        console.log('✅ User signed out and data cleared');
      }
      
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Function to update user profile in context
  const updateUserProfile = (updates) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      
      // Update stored user data
      const currentData = getUserData();
      if (currentData) {
        storeUserData({ ...currentData, ...updates });
      }
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    token,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

