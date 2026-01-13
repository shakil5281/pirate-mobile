"use client";

import { useState } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  updateProfile,
  sendEmailVerification
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

export function useSignUp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Sign up with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} displayName - Optional display name
   * @param {boolean} sendVerification - Send email verification
   * @returns {Promise<UserCredential>}
   */
  const signUpWithEmail = async (email, password, displayName = null, sendVerification = true) => {
    setLoading(true);
    setError(null);

    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile if display name is provided
      if (displayName) {
        await updateProfile(userCredential.user, {
          displayName: displayName,
        });
      }

      // Send email verification
      if (sendVerification) {
        await sendEmailVerification(userCredential.user);
      }

      setLoading(false);
      return { 
        success: true, 
        user: userCredential.user,
        message: sendVerification ? 'Account created! Please check your email for verification.' : 'Account created successfully!'
      };
    } catch (err) {
      setLoading(false);
      
      // Handle specific Firebase errors
      let errorMessage = 'An error occurred during sign up';
      
      switch (err.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email already registered. Please sign in instead';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/password accounts are not enabled';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Please use a stronger password';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection';
          break;
        default:
          errorMessage = err.message || 'Failed to create account';
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Sign up with Google
   * @returns {Promise<UserCredential>}
   */
  const signUpWithGoogle = async () => {
    setLoading(true);
    setError(null);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      const userCredential = await signInWithPopup(auth, provider);
      setLoading(false);
      
      // Check if this is a new user
      const isNewUser = userCredential.user.metadata.creationTime === userCredential.user.metadata.lastSignInTime;
      
      return { 
        success: true, 
        user: userCredential.user,
        isNewUser,
        message: isNewUser ? 'Account created successfully!' : 'Signed in successfully!'
      };
    } catch (err) {
      setLoading(false);
      
      let errorMessage = 'Failed to sign up with Google';
      
      switch (err.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Sign up cancelled';
          break;
        case 'auth/popup-blocked':
          errorMessage = 'Popup blocked by browser. Please allow popups';
          break;
        case 'auth/cancelled-popup-request':
          errorMessage = 'Sign up cancelled';
          break;
        case 'auth/account-exists-with-different-credential':
          errorMessage = 'Account already exists with different credentials';
          break;
        default:
          errorMessage = err.message || 'Failed to sign up with Google';
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Sign up with Apple
   * @returns {Promise<UserCredential>}
   */
  const signUpWithApple = async () => {
    setLoading(true);
    setError(null);

    try {
      const provider = new OAuthProvider('apple.com');
      provider.addScope('email');
      provider.addScope('name');

      const userCredential = await signInWithPopup(auth, provider);
      setLoading(false);
      
      // Check if this is a new user
      const isNewUser = userCredential.user.metadata.creationTime === userCredential.user.metadata.lastSignInTime;
      
      return { 
        success: true, 
        user: userCredential.user,
        isNewUser,
        message: isNewUser ? 'Account created successfully!' : 'Signed in successfully!'
      };
    } catch (err) {
      setLoading(false);
      
      let errorMessage = 'Failed to sign up with Apple';
      
      switch (err.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Sign up cancelled';
          break;
        case 'auth/popup-blocked':
          errorMessage = 'Popup blocked by browser. Please allow popups';
          break;
        case 'auth/cancelled-popup-request':
          errorMessage = 'Sign up cancelled';
          break;
        case 'auth/account-exists-with-different-credential':
          errorMessage = 'Account already exists with different credentials';
          break;
        default:
          errorMessage = err.message || 'Failed to sign up with Apple';
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return {
    signUpWithEmail,
    signUpWithGoogle,
    signUpWithApple,
    loading,
    error,
  };
}

