"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { hasValidToken, clearAuthData, getToken } from '@/lib/utils/tokenStorage';

/**
 * RedirectIfAuthenticated component
 * Redirects authenticated users away from auth pages (login, signup, forgot-password)
 * Also validates token and clears invalid tokens
 * Use this on login, signup, and forgot-password pages
 * 
 * @example
 * <RedirectIfAuthenticated>
 *   <LoginForm />
 * </RedirectIfAuthenticated>
 */
export function RedirectIfAuthenticated({ children, redirectTo = '/dashboard' }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      const token = getToken();
      
      // If user exists and has valid token, redirect to dashboard
      if (user && token && hasValidToken()) {
        console.log('✅ Valid token found, redirecting to dashboard');
        router.push(redirectTo);
      } 
      // If user exists but token is invalid or missing, clear auth data
      else if (user && (!token || !hasValidToken())) {
        console.log('⚠️ Invalid or missing token, clearing auth data');
        clearAuthData();
        // Force reload to update auth state
        window.location.href = window.location.pathname;
      }
    }
  }, [user, loading, router, redirectTo]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, show nothing (will redirect)
  if (user) {
    return null;
  }

  // User is not authenticated, show the auth page
  return <>{children}</>;
}

