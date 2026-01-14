// Firebase configuration
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Avoid initializing Firebase at build time if required env vars are missing.
// This prevents build failures in CI/CD (e.g. Amplify) when secrets aren't available.
let app = null;
let auth = null;

try {
  const hasApiKey = !!firebaseConfig.apiKey;
  if (hasApiKey) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
  }
} catch (err) {
  // Don't throw during build — export nulls and allow runtime code to handle missing Firebase.
  // Log to console so Amplify logs show the issue for diagnosis.
  // eslint-disable-next-line no-console
  console.warn('Firebase initialization skipped or failed during build:', err?.message || err);
}

export { app, auth };

