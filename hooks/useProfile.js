"use client";

import { useState } from 'react';
import { 
  updateProfile, 
  updateEmail, 
  updatePassword, 
  deleteUser, 
  reauthenticateWithCredential, 
  reauthenticateWithPopup,
  EmailAuthProvider,
  GoogleAuthProvider,
  OAuthProvider
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook for managing user profile updates
 */
export function useProfile() {
  const { user, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Update user display name and photo URL
   * @param {string} displayName - New display name
   * @param {string} photoURL - New photo URL
   * @returns {Promise<object>}
   */
  const updateUserDisplayName = async (displayName, photoURL = null) => {
    if (!user) {
      return { success: false, error: 'No user logged in' };
    }

    setLoading(true);
    setError(null);

    try {
      const updates = { displayName };
      if (photoURL) {
        updates.photoURL = photoURL;
      }

      await updateProfile(user, updates);

      // Update context
      updateUserProfile(updates);

      setLoading(false);
      return {
        success: true,
        message: 'Profile updated successfully',
        data: updates,
      };
    } catch (err) {
      setLoading(false);

      let errorMessage = 'Failed to update profile';
      switch (err.code) {
        case 'auth/requires-recent-login':
          errorMessage = 'Please sign in again to update your profile';
          break;
        default:
          errorMessage = err.message || 'Failed to update profile';
      }

      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Update user email address
   * @param {string} newEmail - New email address
   * @returns {Promise<object>}
   */
  const updateUserEmail = async (newEmail) => {
    if (!user) {
      return { success: false, error: 'No user logged in' };
    }

    setLoading(true);
    setError(null);

    try {
      await updateEmail(user, newEmail);

      // Update context
      updateUserProfile({ email: newEmail });

      setLoading(false);
      return {
        success: true,
        message: 'Email updated successfully. Please verify your new email.',
      };
    } catch (err) {
      setLoading(false);

      let errorMessage = 'Failed to update email';
      switch (err.code) {
        case 'auth/requires-recent-login':
          errorMessage = 'Please sign in again to update your email';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already in use by another account';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        default:
          errorMessage = err.message || 'Failed to update email';
      }

      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Update user password
   * @param {string} newPassword - New password
   * @returns {Promise<object>}
   */
  const updateUserPassword = async (newPassword) => {
    if (!user) {
      return { success: false, error: 'No user logged in' };
    }

    setLoading(true);
    setError(null);

    try {
      await updatePassword(user, newPassword);

      setLoading(false);
      return {
        success: true,
        message: 'Password updated successfully',
      };
    } catch (err) {
      setLoading(false);

      let errorMessage = 'Failed to update password';
      switch (err.code) {
        case 'auth/requires-recent-login':
          errorMessage = 'Please sign in again to update your password';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Please use a stronger password';
          break;
        default:
          errorMessage = err.message || 'Failed to update password';
      }

      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Update complete profile (name, email, password)
   * @param {object} updates - Profile updates
   * @param {string} updates.displayName - New display name
   * @param {string} updates.email - New email
   * @param {string} updates.password - New password
   * @param {string} updates.photoURL - New photo URL
   * @returns {Promise<object>}
   */
  const updateCompleteProfile = async (updates) => {
    if (!user) {
      return { success: false, error: 'No user logged in' };
    }

    setLoading(true);
    setError(null);

    const results = {
      displayName: null,
      email: null,
      password: null,
    };

    try {
      // Update display name and photo if provided
      if (updates.displayName || updates.photoURL) {
        const result = await updateUserDisplayName(
          updates.displayName || user.displayName,
          updates.photoURL
        );
        results.displayName = result;
      }

      // Update email if provided and different
      if (updates.email && updates.email !== user.email) {
        const result = await updateUserEmail(updates.email);
        results.email = result;
      }

      // Update password if provided
      if (updates.password) {
        const result = await updateUserPassword(updates.password);
        results.password = result;
      }

      setLoading(false);

      // Check if any update failed
      const hasError =
        (results.displayName && !results.displayName.success) ||
        (results.email && !results.email.success) ||
        (results.password && !results.password.success);

      if (hasError) {
        const errorMessage = Object.values(results)
          .filter((r) => r && !r.success)
          .map((r) => r.error)
          .join('. ');

        return {
          success: false,
          error: errorMessage,
          results,
        };
      }

      return {
        success: true,
        message: 'Profile updated successfully',
        results,
      };
    } catch (err) {
      setLoading(false);
      const errorMessage = err.message || 'Failed to update profile';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Delete user account with proper cleanup
   * @returns {Promise<object>}
   */
  const deleteUserAccount = async () => {
    if (!user) {
      return { success: false, error: 'No user logged in' };
    }

    setLoading(true);
    setError(null);

    try {
      // Delete the user account
      await deleteUser(user);

      // Clear local storage and cookies
      if (typeof window !== 'undefined') {
        const { clearAuthData } = await import('@/lib/utils/tokenStorage');
        clearAuthData();
      }

      setLoading(false);
      return {
        success: true,
        message: 'Account deleted successfully',
      };
    } catch (err) {
      setLoading(false);

      let errorMessage = 'Failed to delete account';
      let requiresReauth = false;

      switch (err.code) {
        case 'auth/requires-recent-login':
          errorMessage = 'For security reasons, please sign in again to delete your account';
          requiresReauth = true;
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection and try again';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Please try again later';
          break;
        default:
          errorMessage = err.message || 'Failed to delete account';
      }

      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage,
        requiresReauth 
      };
    }
  };

  /**
   * Upload profile photo
   * This is a placeholder - implement with your storage solution
   * @param {File} file - Image file
   * @returns {Promise<object>}
   */
  const uploadProfilePhoto = async (file) => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Implement file upload to Firebase Storage or your backend
      // For now, return a placeholder
      
      // Example implementation would be:
      // 1. Upload file to Firebase Storage
      // 2. Get download URL
      // 3. Update user profile with photoURL

      setLoading(false);
      return {
        success: false,
        error: 'Photo upload not yet implemented. Add Firebase Storage or your backend integration.',
      };
    } catch (err) {
      setLoading(false);
      const errorMessage = err.message || 'Failed to upload photo';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Get the user's sign-in provider
   * @returns {string} - Provider ID (e.g., 'password', 'google.com', 'apple.com')
   */
  const getUserProvider = () => {
    if (!user || !user.providerData || user.providerData.length === 0) {
      return null;
    }
    // Get the first provider (most users will have only one)
    return user.providerData[0].providerId;
  };

  /**
   * Re-authenticate user with their password or OAuth provider
   * Required before sensitive operations like account deletion
   * @param {string} password - User's current password (only for email/password auth)
   * @returns {Promise<object>}
   */
  const reauthenticateUser = async (password = null) => {
    if (!user) {
      return { success: false, error: 'No user logged in' };
    }

    setLoading(true);
    setError(null);

    try {
      const providerId = getUserProvider();

      // Handle different authentication providers
      if (providerId === 'google.com') {
        // Google OAuth re-authentication
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({
          prompt: 'select_account'
        });
        await reauthenticateWithPopup(user, provider);
      } else if (providerId === 'apple.com') {
        // Apple OAuth re-authentication
        const provider = new OAuthProvider('apple.com');
        await reauthenticateWithPopup(user, provider);
      } else if (providerId === 'password') {
        // Email/Password re-authentication
        if (!password) {
          setLoading(false);
          return { success: false, error: 'Password is required' };
        }
        if (!user.email) {
          setLoading(false);
          return { success: false, error: 'User email not found' };
        }
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
      } else {
        setLoading(false);
        return { success: false, error: 'Unsupported authentication provider' };
      }

      setLoading(false);
      return {
        success: true,
        message: 'Re-authentication successful',
      };
    } catch (err) {
      setLoading(false);

      let errorMessage = 'Failed to verify identity';
      switch (err.code) {
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password. Please try again';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Invalid credentials. Please try again';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Please try again later';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection';
          break;
        case 'auth/popup-closed-by-user':
          errorMessage = 'Re-authentication cancelled';
          break;
        case 'auth/popup-blocked':
          errorMessage = 'Popup blocked by browser. Please allow popups';
          break;
        default:
          errorMessage = err.message || 'Failed to verify identity';
      }

      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Delete account with re-authentication
   * @param {string} password - User's password for verification
   * @returns {Promise<object>}
   */
  const deleteAccountWithPassword = async (password) => {
    // First, re-authenticate the user
    const reauthResult = await reauthenticateUser(password);
    
    if (!reauthResult.success) {
      return reauthResult;
    }

    // Then delete the account
    return await deleteUserAccount();
  };

  return {
    updateUserDisplayName,
    updateUserEmail,
    updateUserPassword,
    updateCompleteProfile,
    deleteUserAccount,
    deleteAccountWithPassword,
    reauthenticateUser,
    uploadProfilePhoto,
    getUserProvider,
    loading,
    error,
  };
}

