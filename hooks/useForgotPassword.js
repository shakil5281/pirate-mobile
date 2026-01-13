"use client";

import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

export function useForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  /**
   * Send password reset email
   * @param {string} email - User email
   * @returns {Promise<object>}
   */
  const sendResetEmail = async (email) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await sendPasswordResetEmail(auth, email, {
        // Optional: Customize email action handler URL
        // url: window.location.origin + '/login',
        handleCodeInApp: false,
      });

      setLoading(false);
      setSuccess(true);
      return { 
        success: true, 
        message: 'Password reset email sent! Please check your inbox.'
      };
    } catch (err) {
      setLoading(false);
      
      // Handle specific Firebase errors
      let errorMessage = 'An error occurred';
      
      switch (err.code) {
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many requests. Please try again later';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection';
          break;
        default:
          errorMessage = err.message || 'Failed to send reset email';
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Reset success state
   */
  const resetState = () => {
    setSuccess(false);
    setError(null);
  };

  return {
    sendResetEmail,
    resetState,
    loading,
    error,
    success,
  };
}

