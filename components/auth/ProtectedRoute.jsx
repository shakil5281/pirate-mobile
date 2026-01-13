"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { hasValidToken, clearAuthData, getToken } from '@/lib/utils/tokenStorage';
import { toast } from 'sonner';

/**
 * ProtectedRoute component
 * Redirects to login page if user is not authenticated
 * Validates token and clears invalid tokens
 * Shows loading state while checking authentication
 * 
 * @example
 * <ProtectedRoute>
 *   <DashboardContent />
 * </ProtectedRoute>
 */
export function ProtectedRoute({ children, redirectTo = '/login' }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      const token = getToken();
      
      // If no user, redirect to login
      if (!user) {
        console.log('❌ No user found, redirecting to login');
        router.push(redirectTo);
      }
      // If user exists but no valid token, clear auth and redirect
      else if (user && (!token || !hasValidToken())) {
        console.log('⚠️ Invalid or expired token, clearing auth data');
        toast.error('Session expired. Please sign in again.');
        clearAuthData();
        router.push(redirectTo);
      }
      // User and token are valid
      else if (user && token && hasValidToken()) {
        console.log('✅ Valid authentication, access granted');
      }
    }
  }, [user, loading, router, redirectTo]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated
  if (!user) {
    return null;
  }

  // Render children if authenticated
  return <>{children}</>;
}

/**
 * RequireAuth component
 * Similar to ProtectedRoute but shows a message instead of redirecting
 * Useful for conditional rendering within a page
 * 
 * @example
 * <RequireAuth fallback={<LoginPrompt />}>
 *   <UserProfile />
 * </RequireAuth>
 */
export function RequireAuth({ children, fallback = null }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
      </div>
    );
  }

  if (!user) {
    return fallback || (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Please sign in to view this content</p>
      </div>
    );
  }

  return <>{children}</>;
}

