"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { hasValidToken, clearAuthData, isTokenExpiringSoon, getToken } from '@/lib/utils/tokenStorage';
import { toast } from 'sonner';

/**
 * Hook to validate token and handle expiration
 * Automatically clears invalid tokens and redirects
 * Optionally warns when token is about to expire
 * 
 * @param {object} options - Configuration options
 * @param {boolean} options.autoRefresh - Warn when token is expiring soon (default: true)
 * @param {string} options.redirectTo - Where to redirect on invalid token (default: '/login')
 * @returns {object} Token validation state
 * 
 * @example
 * const { isValid, isExpiringSoon } = useTokenValidator();
 */
export function useTokenValidator({ autoRefresh = true, redirectTo = '/login' } = {}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      const token = getToken();

      // Check if token is valid
      if (!token || !hasValidToken()) {
        console.log('⚠️ Token validation failed - clearing auth data');
        toast.error('Your session has expired. Please sign in again.');
        clearAuthData();
        router.push(redirectTo);
        return;
      }

      // Check if token is expiring soon
      if (autoRefresh && isTokenExpiringSoon()) {
        console.log('⚠️ Token expiring soon');
        toast.warning('Your session is about to expire. Please refresh.');
        
        // Optionally refresh token here
        // You can implement token refresh logic if your backend supports it
      }
    }
  }, [user, loading, router, redirectTo, autoRefresh]);

  const token = getToken();
  
  return {
    isValid: !!token && hasValidToken(),
    isExpiringSoon: isTokenExpiringSoon(),
    token,
  };
}

/**
 * Hook to periodically check token validity
 * Useful for long-running dashboard sessions
 * 
 * @param {number} intervalMs - Check interval in milliseconds (default: 60000 = 1 minute)
 * @param {string} redirectTo - Where to redirect on invalid token
 * 
 * @example
 * useTokenValidationInterval(60000); // Check every minute
 */
export function useTokenValidationInterval(intervalMs = 60000, redirectTo = '/login') {
  const router = useRouter();
  let auth;
  
  try {
    auth = useAuth();
  } catch (error) {
    console.error('useTokenValidationInterval: Auth context not available', error);
    return;
  }

  useEffect(() => {
    // Guard against undefined auth context
    if (!auth || auth.loading) return;
    
    const { user } = auth;
    
    // Only run if user is authenticated
    if (!user) return;

    const checkToken = () => {
      try {
        const token = getToken();

        if (!token || !hasValidToken()) {
          console.log('⚠️ Periodic check: Invalid token detected');
          toast.error('Your session has expired. Please sign in again.');
          clearAuthData();
          router.push(redirectTo);
          return;
        }

        if (isTokenExpiringSoon()) {
          console.log('⚠️ Periodic check: Token expiring soon');
          toast.warning('Your session will expire soon. Please refresh or sign in again.');
        }
      } catch (error) {
        console.error('Error during token validation:', error);
      }
    };

    // Initial check after a small delay to ensure everything is loaded
    const initialTimeout = setTimeout(checkToken, 1000);

    // Set up interval
    const interval = setInterval(checkToken, intervalMs);

    // Cleanup
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [auth, intervalMs, router, redirectTo]);
}

