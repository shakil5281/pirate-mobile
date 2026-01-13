// Comprehensive PayPal JS SDK loader and payment handler

let paypalScriptPromise = null;

/**
 * Load PayPal SDK with all required components
 * @param {Object} options - Configuration options
 * @param {string} options.clientId - PayPal Client ID
 * @param {string} options.currency - Currency code (default: USD)
 * @param {string} options.intent - Payment intent (default: CAPTURE)
 * @param {Array} options.enableFunding - Additional funding sources to enable
 * @returns {Promise} - Promise that resolves when SDK is loaded
 */
export function loadPayPalSDK({ 
  clientId, 
  currency = 'USD', 
  intent = 'CAPTURE', 
  enableFunding = [] 
}) {
  if (typeof window === 'undefined') return Promise.resolve();

  if (window.paypal) return Promise.resolve(window.paypal);

  if (!clientId) {
    console.error('❌ PayPal Error: NEXT_PUBLIC_PAYPAL_CLIENT_ID is missing!');
    console.error('📝 Add this to your .env.local file:');
    console.error('   NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_client_id_here');
    console.error('🔗 Get credentials: https://developer.paypal.com/dashboard/');
    return Promise.reject(new Error('Missing NEXT_PUBLIC_PAYPAL_CLIENT_ID'));
  }

  // Validate client ID format
  if (clientId === 'your_paypal_client_id_here' || clientId === 'your_client_id_here') {
    console.error('❌ PayPal Error: Please replace the placeholder Client ID!');
    console.error('📝 Your .env.local has: NEXT_PUBLIC_PAYPAL_CLIENT_ID=' + clientId);
    console.error('🔗 Get real credentials: https://developer.paypal.com/dashboard/');
    return Promise.reject(new Error('Invalid NEXT_PUBLIC_PAYPAL_CLIENT_ID - still using placeholder'));
  }

  if (!paypalScriptPromise) {
    const params = new URLSearchParams({
      'client-id': clientId,
      currency,
      intent,
      // Include all required components for comprehensive payment support
      components: 'buttons,hosted-fields,funding-eligibility',
    });

    // Enable additional funding sources
    if (enableFunding && enableFunding.length > 0) {
      params.set('enable-funding', enableFunding.join(','));
    }

    const script = document.createElement('script');
    const scriptUrl = `https://www.paypal.com/sdk/js?${params.toString()}`;
    script.src = scriptUrl;
    script.async = true;
    script.defer = true;

    console.log('🔄 Loading PayPal SDK...');
    console.log('📋 Client ID:', clientId.substring(0, 10) + '...');
    console.log('💰 Currency:', currency);
    console.log('🔗 Script URL:', scriptUrl);

    paypalScriptPromise = new Promise((resolve, reject) => {
      script.onload = () => {
        console.log('✅ PayPal SDK loaded successfully!');
        resolve(window.paypal);
      };
      script.onerror = (e) => {
        // Reset so subsequent calls can retry
        paypalScriptPromise = null;
        
        console.error('❌ PayPal SDK failed to load!');
        console.error('🔗 Attempted URL:', scriptUrl);
        console.error('📋 Client ID used:', clientId.substring(0, 20) + '...');
        console.error('');
        console.error('🔍 Common Issues:');
        console.error('  1. Invalid Client ID - verify it\'s correct');
        console.error('  2. Network/firewall blocking PayPal');
        console.error('  3. AdBlocker blocking the script');
        console.error('  4. CORS/CSP policy issue');
        console.error('');
        console.error('✅ Solutions:');
        console.error('  1. Check your .env.local file has valid credentials');
        console.error('  2. Restart dev server after updating .env.local');
        console.error('  3. Disable AdBlockers/extensions');
        console.error('  4. Check browser console for CSP errors');
        console.error('  5. Verify credentials at: https://developer.paypal.com/dashboard/');
        
        const err = new Error('PayPal SDK script failed to load - see console for details');
        err.details = { url: scriptUrl, clientId: clientId.substring(0, 20) + '...' };
        reject(err);
      };
    });

    document.head.appendChild(script);
  }

  return paypalScriptPromise;
}

/**
 * Render PayPal payment buttons
 * @param {Object} options - Button configuration
 * @param {HTMLElement} options.container - Container element for the button
 * @param {number} options.amount - Payment amount
 * @param {string} options.currency - Currency code
 * @param {string} options.fundingSource - Funding source (paypal, paylater, googlepay, card)
 * @param {Function} options.onApprove - Success callback
 * @param {Function} options.onError - Error callback
 * @param {Function} options.onCancel - Cancel callback
 * @param {Function} options.createOrder - Custom order creation function
 * @returns {Object} - PayPal Buttons instance
 */
export function renderPayPalButtons({
  container,
  amount,
  currency = 'USD',
  fundingSource,
  onApprove = () => {},
  onError = () => {},
  onCancel = () => {},
  createOrder = null,
  onInit = () => {},
}) {
  if (!window.paypal) throw new Error('PayPal SDK not loaded');

  // Check if funding source is eligible
  if (fundingSource && window.paypal.Buttons) {
    const isEligible = window.paypal.Buttons({ fundingSource }).isEligible();
    if (!isEligible) {
      console.warn(`Funding source ${fundingSource} is not eligible`);
    }
  }

  // Button style configuration based on funding source
  const getButtonStyle = (source) => {
    const baseStyle = {
      layout: 'vertical',
      shape: 'rect',
      label: 'pay',
      height: 48,
    };

    switch (source) {
      case 'googlepay':
        return { ...baseStyle, color: 'black' };
      case 'paylater':
        return { ...baseStyle, color: 'blue', label: 'paylater' };
      case 'card':
        return { ...baseStyle, color: 'silver' };
      default:
        return { ...baseStyle, color: 'gold' };
    }
  };

  const buttonConfig = {
    fundingSource,
    style: getButtonStyle(fundingSource),
    commit: true,
    
    // Initialize button
    onInit: (data, actions) => {
      if (onInit) onInit(data, actions);
    },

    // Validate before showing popup
    onClick: (data, actions) => {
      console.log(`${fundingSource || 'PayPal'} button clicked`);
      
      try {
        // Validate amount
        if (!amount || Number(amount) <= 0) {
          console.error('Invalid amount:', amount);
          return actions.reject();
        }
        
        // Additional validation can be added here
        return actions.resolve();
      } catch (e) {
        console.error('PayPal onClick error:', e);
        return actions.reject();
      }
    },

    // Create order
    createOrder: createOrder || ((data, actions) => {
      console.log('Creating PayPal order with amount:', amount, currency);
      
      return actions.order.create({
        purchase_units: [
          {
            amount: { 
              value: String(parseFloat(amount).toFixed(2)), 
              currency_code: currency 
            },
            description: 'eSIM Package Purchase',
          },
        ],
        application_context: { 
          shipping_preference: 'NO_SHIPPING',
          user_action: 'PAY_NOW',
          brand_name: 'Pirate Mobile',
        },
      });
    }),

    // Handle successful payment
    onApprove: async (data, actions) => {
      try {
        console.log('Payment approved, capturing order:', data.orderID);
        
        // Capture the order
        const details = await actions.order.capture();
        
        console.log('Payment captured successfully:', details);
        
        // Call success callback
        if (onApprove) {
          onApprove(details, data);
        }
        
        return details;
      } catch (error) {
        console.error('Error capturing payment:', error);
        if (onError) onError(error);
        throw error;
      }
    },

    // Handle payment cancellation
    onCancel: (data) => {
      console.warn('PayPal payment cancelled:', data);
      if (onCancel) onCancel(data);
    },

    // Handle errors
    onError: (err) => {
      console.error('PayPal error:', err);
      if (onError) onError(err);
    },
  };

  const Buttons = window.paypal.Buttons(buttonConfig);
  
  // Render the button
  Buttons.render(container)
    .then(() => {
      console.log(`${fundingSource || 'PayPal'} button rendered successfully`);
    })
    .catch((err) => {
      console.error(`Error rendering ${fundingSource || 'PayPal'} button:`, err);
    });

  return Buttons;
}

/**
 * Check if a funding source is eligible
 * @param {string} fundingSource - The funding source to check
 * @returns {boolean} - Whether the funding source is eligible
 */
export function isFundingEligible(fundingSource) {
  if (!window.paypal || !window.paypal.Buttons) return false;
  
  try {
    return window.paypal.Buttons({ fundingSource }).isEligible();
  } catch (error) {
    console.error('Error checking funding eligibility:', error);
    return false;
  }
}

/**
 * Create a PayPal order on the server
 * @param {Object} orderData - Order details
 * @returns {Promise} - Promise resolving to order ID
 */
export async function createPayPalOrder(orderData) {
  try {
    const response = await fetch('/api/paypal/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error('Failed to create PayPal order');
    }

    const data = await response.json();
    return data.orderID;
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    throw error;
  }
}

/**
 * Capture a PayPal order on the server
 * @param {string} orderID - The order ID to capture
 * @returns {Promise} - Promise resolving to capture details
 */
export async function capturePayPalOrder(orderID) {
  try {
    const response = await fetch('/api/paypal/capture-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderID }),
    });

    if (!response.ok) {
      throw new Error('Failed to capture PayPal order');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    throw error;
  }
}


