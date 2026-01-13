"use client";

import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

export function useSignOut() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Sign out the current user
   * @returns {Promise<object>}
   */
  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      await signOut(auth);
      setLoading(false);
      return { success: true, message: 'Signed out successfully' };
    } catch (err) {
      setLoading(false);
      const errorMessage = err.message || 'Failed to sign out';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return {
    logout,
    loading,
    error,
  };
}

