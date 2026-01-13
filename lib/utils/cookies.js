/**
 * Cookie Management Utilities
 * Handles reading, writing, and deleting cookies
 */

/**
 * Set a cookie
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} days - Expiration in days
 * @param {object} options - Additional cookie options
 */
export function setCookie(name, value, days = 7, options = {}) {
  if (typeof window === 'undefined') return;

  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }

  const {
    path = '/',
    domain = '',
    secure = true,
    sameSite = 'Lax',
  } = options;

  const cookieString = [
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
    expires,
    `; path=${path}`,
    domain ? `; domain=${domain}` : '',
    secure ? '; secure' : '',
    `; SameSite=${sameSite}`,
  ].join('');

  document.cookie = cookieString;
}

/**
 * Get a cookie value
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null if not found
 */
export function getCookie(name) {
  if (typeof window === 'undefined') return null;

  const nameEQ = `${encodeURIComponent(name)}=`;
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
    }
  }

  return null;
}

/**
 * Delete a cookie
 * @param {string} name - Cookie name
 * @param {object} options - Cookie options (path, domain)
 */
export function deleteCookie(name, options = {}) {
  if (typeof window === 'undefined') return;

  const { path = '/', domain = '' } = options;

  document.cookie = [
    `${encodeURIComponent(name)}=`,
    '; expires=Thu, 01 Jan 1970 00:00:00 UTC',
    `; path=${path}`,
    domain ? `; domain=${domain}` : '',
  ].join('');
}

/**
 * Check if a cookie exists
 * @param {string} name - Cookie name
 * @returns {boolean}
 */
export function hasCookie(name) {
  return getCookie(name) !== null;
}

/**
 * Get all cookies as an object
 * @returns {object} Object with cookie names as keys
 */
export function getAllCookies() {
  if (typeof window === 'undefined') return {};

  const cookies = {};
  const cookieArray = document.cookie.split(';');

  cookieArray.forEach((cookie) => {
    const [name, value] = cookie.split('=').map((c) => c.trim());
    if (name && value) {
      cookies[decodeURIComponent(name)] = decodeURIComponent(value);
    }
  });

  return cookies;
}

/**
 * Clear all cookies
 */
export function clearAllCookies() {
  if (typeof window === 'undefined') return;

  const cookies = getAllCookies();
  Object.keys(cookies).forEach((name) => {
    deleteCookie(name);
  });
}

