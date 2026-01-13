/**
 * Firebase Configuration Validator
 * 
 * This utility helps diagnose Firebase configuration issues.
 * Run this to check if your .env.local is properly configured.
 */

/**
 * Validate Firebase configuration
 * @returns {Object} Validation result with status and messages
 */
export function validateFirebaseConfig() {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

  const errors = [];
  const warnings = [];
  let isValid = true;

  // Check required fields
  const requiredFields = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
  ];

  requiredFields.forEach((field) => {
    if (!config[field]) {
      errors.push(`Missing required field: NEXT_PUBLIC_FIREBASE_${field.toUpperCase()}`);
      isValid = false;
    }
  });

  // Validate field formats
  if (config.apiKey && !config.apiKey.startsWith('AIza')) {
    warnings.push('API Key should start with "AIza"');
  }

  if (config.authDomain && !config.authDomain.includes('.firebaseapp.com')) {
    warnings.push('Auth Domain should end with ".firebaseapp.com"');
  }

  if (config.storageBucket && !config.storageBucket.includes('.appspot.com')) {
    warnings.push('Storage Bucket should end with ".appspot.com"');
  }

  if (config.messagingSenderId && !/^\d+$/.test(config.messagingSenderId)) {
    warnings.push('Messaging Sender ID should contain only numbers');
  }

  if (config.appId && !config.appId.match(/^\d+:\d+:web:[a-f0-9]+$/)) {
    warnings.push('App ID format looks incorrect (should be like "1:123:web:abc123")');
  }

  if (config.measurementId && !config.measurementId.startsWith('G-')) {
    warnings.push('Measurement ID should start with "G-"');
  }

  // Check for placeholder values
  const placeholderPatterns = [
    'your_api_key',
    'your_project',
    'your_sender',
    'your_app',
    'your_measurement',
  ];

  Object.entries(config).forEach(([key, value]) => {
    if (value && placeholderPatterns.some((pattern) => value.toLowerCase().includes(pattern))) {
      errors.push(`${key} contains placeholder value. Please replace with actual Firebase value.`);
      isValid = false;
    }
  });

  return {
    isValid,
    config,
    errors,
    warnings,
    message: isValid
      ? '✅ Firebase configuration is valid!'
      : '❌ Firebase configuration has errors. Please check your .env.local file.',
  };
}

/**
 * Print validation results to console
 */
export function printConfigValidation() {
  const result = validateFirebaseConfig();

  console.log('\n' + '='.repeat(60));
  console.log('🔥 Firebase Configuration Validation');
  console.log('='.repeat(60) + '\n');

  console.log(result.message + '\n');

  if (result.errors.length > 0) {
    console.log('❌ ERRORS:');
    result.errors.forEach((error) => console.log(`   - ${error}`));
    console.log('');
  }

  if (result.warnings.length > 0) {
    console.log('⚠️  WARNINGS:');
    result.warnings.forEach((warning) => console.log(`   - ${warning}`));
    console.log('');
  }

  if (result.isValid && result.warnings.length === 0) {
    console.log('✅ All checks passed!');
    console.log('');
    console.log('Configuration:');
    Object.entries(result.config).forEach(([key, value]) => {
      if (value) {
        // Mask sensitive values
        const masked = key === 'apiKey' 
          ? value.substring(0, 10) + '...' 
          : value;
        console.log(`   ${key}: ${masked}`);
      }
    });
  }

  if (!result.isValid) {
    console.log('\n📝 Next Steps:');
    console.log('   1. Check your .env.local file exists in project root');
    console.log('   2. Verify all Firebase credentials are correct');
    console.log('   3. Restart your development server');
    console.log('   4. See ENV_SETUP_INSTRUCTIONS.md for detailed guide');
  }

  console.log('\n' + '='.repeat(60) + '\n');

  return result;
}

/**
 * React component to display validation results
 */
export function FirebaseConfigStatus() {
  const result = validateFirebaseConfig();

  if (typeof window === 'undefined') {
    return null;
  }

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 max-w-md p-4 bg-white border rounded-lg shadow-lg z-50">
      <h3 className="font-bold mb-2">🔥 Firebase Config Status</h3>
      
      <div className={`text-sm mb-2 ${result.isValid ? 'text-green-600' : 'text-red-600'}`}>
        {result.message}
      </div>

      {result.errors.length > 0 && (
        <div className="mb-2">
          <p className="text-xs font-semibold text-red-600 mb-1">Errors:</p>
          <ul className="text-xs text-red-600 space-y-1">
            {result.errors.map((error, i) => (
              <li key={i}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {result.warnings.length > 0 && (
        <div className="mb-2">
          <p className="text-xs font-semibold text-yellow-600 mb-1">Warnings:</p>
          <ul className="text-xs text-yellow-600 space-y-1">
            {result.warnings.map((warning, i) => (
              <li key={i}>• {warning}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={() => printConfigValidation()}
        className="text-xs text-blue-600 hover:underline"
      >
        View in console →
      </button>
    </div>
  );
}

