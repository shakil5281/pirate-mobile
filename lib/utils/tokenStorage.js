/**
 * Token Storage Utilities
 * Manages auth tokens in localStorage and cookies
 */

import { setCookie, getCookie, deleteCookie } from './cookies';

// Storage keys
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';
const TOKEN_EXPIRY_KEY = 'token_expiry';

/**
 * Store auth token in localStorage and cookies
 * @param {string} token - Authentication token
 * @param {number} expiresIn - Token expiration time in seconds (default: 1 hour)
 */
export function storeToken(token, expiresIn = 3600) {
  if (!token || typeof window === 'undefined') return;

  try {
    // Store in localStorage
    localStorage.setItem(TOKEN_KEY, token);

    // Calculate expiry time
    const expiryTime = Date.now() + expiresIn * 1000;
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());

    // Store in cookies (convert seconds to days)
    const days = expiresIn / (24 * 60 * 60);
    setCookie(TOKEN_KEY, token, days, {
      secure: true,
      sameSite: 'Lax',
    });

    console.log('✅ Token stored successfully');
  } catch (error) {
    console.error('❌ Error storing token:', error);
  }
}

/**
 * Get auth token from localStorage or cookies
 * @returns {string|null} Authentication token
 */
export function getToken() {
  if (typeof window === 'undefined') return null;

  try {
    // Try localStorage first
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      // Check if token is expired
      const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);
      if (expiryTime && Date.now() < parseInt(expiryTime)) {
        return token;
      } else {
        // Token expired, clear it
        removeToken();
        return null;
      }
    }

    // Fallback to cookies
    return getCookie(TOKEN_KEY);
  } catch (error) {
    console.error('❌ Error getting token:', error);
    return null;
  }
}

/**
 * Remove auth token from localStorage and cookies
 */
export function removeToken() {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    deleteCookie(TOKEN_KEY);
    console.log('✅ Token removed successfully');
  } catch (error) {
    console.error('❌ Error removing token:', error);
  }
}

/**
 * Check if token exists and is valid
 * @returns {boolean}
 */
export function hasValidToken() {
  const token = getToken();
  return !!token;
}

/**
 * Store refresh token
 * @param {string} refreshToken - Refresh token
 */
export function storeRefreshToken(refreshToken) {
  if (!refreshToken || typeof window === 'undefined') return;

  try {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    // Refresh tokens typically have longer expiry (30 days)
    setCookie(REFRESH_TOKEN_KEY, refreshToken, 30, {
      secure: true,
      sameSite: 'Lax',
    });
    console.log('✅ Refresh token stored successfully');
  } catch (error) {
    console.error('❌ Error storing refresh token:', error);
  }
}

/**
 * Get refresh token
 * @returns {string|null}
 */
export function getRefreshToken() {
  if (typeof window === 'undefined') return null;

  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY) || getCookie(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('❌ Error getting refresh token:', error);
    return null;
  }
}

/**
 * Remove refresh token
 */
export function removeRefreshToken() {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    deleteCookie(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('❌ Error removing refresh token:', error);
  }
}

/**
 * Store user data in localStorage
 * @param {object} userData - User profile data
 */
export function storeUserData(userData) {
  if (!userData || typeof window === 'undefined') return;

  try {
    const userDataString = JSON.stringify(userData);
    localStorage.setItem(USER_KEY, userDataString);
    
    // Also store in cookie (limited size, so store only essential data)
    const essentialData = {
      uid: userData.uid,
      email: userData.email,
      displayName: userData.displayName,
    };
    setCookie(USER_KEY, JSON.stringify(essentialData), 7, {
      secure: true,
      sameSite: 'Lax',
    });
    
    console.log('✅ User data stored successfully');
  } catch (error) {
    console.error('❌ Error storing user data:', error);
  }
}

/**
 * Get user data from localStorage
 * @returns {object|null} User data
 */
export function getUserData() {
  if (typeof window === 'undefined') return null;

  try {
    const userDataString = localStorage.getItem(USER_KEY);
    if (userDataString) {
      return JSON.parse(userDataString);
    }

    // Fallback to cookie
    const cookieData = getCookie(USER_KEY);
    if (cookieData) {
      return JSON.parse(cookieData);
    }

    return null;
  } catch (error) {
    console.error('❌ Error getting user data:', error);
    return null;
  }
}

/**
 * Remove user data from localStorage
 */
export function removeUserData() {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(USER_KEY);
    deleteCookie(USER_KEY);
  } catch (error) {
    console.error('❌ Error removing user data:', error);
  }
}

/**
 * Clear all auth-related data
 */
export function clearAuthData() {
  removeToken();
  removeRefreshToken();
  removeUserData();
  console.log('✅ All auth data cleared');
}

/**
 * Get token expiry time
 * @returns {number|null} Timestamp when token expires
 */
export function getTokenExpiry() {
  if (typeof window === 'undefined') return null;

  try {
    const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);
    return expiryTime ? parseInt(expiryTime) : null;
  } catch (error) {
    console.error('❌ Error getting token expiry:', error);
    return null;
  }
}

/**
 * Check if token is about to expire (within 5 minutes)
 * @returns {boolean}
 */
export function isTokenExpiringSoon() {
  const expiryTime = getTokenExpiry();
  if (!expiryTime) return true;

  const fiveMinutes = 5 * 60 * 1000;
  return Date.now() >= expiryTime - fiveMinutes;
}

/**
 * Get time until token expires in seconds
 * @returns {number} Seconds until expiry (0 if expired)
 */
export function getTimeUntilExpiry() {
  const expiryTime = getTokenExpiry();
  if (!expiryTime) return 0;

  const timeRemaining = Math.max(0, expiryTime - Date.now());
  return Math.floor(timeRemaining / 1000);
}

