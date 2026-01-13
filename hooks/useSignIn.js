"use client";

import { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  OAuthProvider,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

export function useSignIn() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Sign in with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {boolean} remember - Remember user (local vs session storage)
   * @returns {Promise<UserCredential>}
   */
  const signInWithEmail = async (email, password, remember = false) => {
    setLoading(true);
    setError(null);

    try {
      // Set persistence based on remember option
      const persistence = remember ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(auth, persistence);

      // Sign in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      return { success: true, user: userCredential.user };
    } catch (err) {
      setLoading(false);
      
      // Handle specific Firebase errors
      let errorMessage = 'An error occurred during sign in';
      
      switch (err.code) {
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection';
          break;
        default:
          errorMessage = err.message || 'Failed to sign in';
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Sign in with Google
   * @returns {Promise<UserCredential>}
   */
  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      const userCredential = await signInWithPopup(auth, provider);
      setLoading(false);
      return { success: true, user: userCredential.user };
    } catch (err) {
      setLoading(false);
      
      let errorMessage = 'Failed to sign in with Google';
      
      switch (err.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Sign in cancelled';
          break;
        case 'auth/popup-blocked':
          errorMessage = 'Popup blocked by browser. Please allow popups';
          break;
        case 'auth/cancelled-popup-request':
          errorMessage = 'Sign in cancelled';
          break;
        case 'auth/account-exists-with-different-credential':
          errorMessage = 'Account already exists with different credentials';
          break;
        default:
          errorMessage = err.message || 'Failed to sign in with Google';
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Sign in with Apple
   * @returns {Promise<UserCredential>}
   */
  const signInWithApple = async () => {
    setLoading(true);
    setError(null);

    try {
      const provider = new OAuthProvider('apple.com');
      provider.addScope('email');
      provider.addScope('name');

      const userCredential = await signInWithPopup(auth, provider);
      setLoading(false);
      return { success: true, user: userCredential.user };
    } catch (err) {
      setLoading(false);
      
      let errorMessage = 'Failed to sign in with Apple';
      
      switch (err.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Sign in cancelled';
          break;
        case 'auth/popup-blocked':
          errorMessage = 'Popup blocked by browser. Please allow popups';
          break;
        case 'auth/cancelled-popup-request':
          errorMessage = 'Sign in cancelled';
          break;
        case 'auth/account-exists-with-different-credential':
          errorMessage = 'Account already exists with different credentials';
          break;
        default:
          errorMessage = err.message || 'Failed to sign in with Apple';
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return {
    signInWithEmail,
    signInWithGoogle,
    signInWithApple,
    loading,
    error,
  };
}

