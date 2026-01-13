import { NextResponse } from 'next/server';

const PAYPAL_API_BASE = process.env.PAYPAL_ENVIRONMENT === 'production' 
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

/**
 * Generate PayPal OAuth access token
 */
async function generateAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials are missing');
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to generate access token: ${error}`);
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Create PayPal order
 */
async function createOrder(orderData) {
  const accessToken = await generateAccessToken();

  const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: orderData.currency || 'USD',
            value: orderData.amount,
          },
          description: orderData.description || 'eSIM Package Purchase',
          custom_id: orderData.bundleId || null,
        },
      ],
      application_context: {
        brand_name: 'Pirate Mobile',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW',
        return_url: orderData.returnUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
        cancel_url: orderData.cancelUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to create order: ${JSON.stringify(error)}`);
  }

  const order = await response.json();
  return order;
}

/**
 * POST /api/paypal/create-order
 * Create a PayPal order and register it with backend API
 */
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.amount || parseFloat(body.amount) <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Create the PayPal order first
    const order = await createOrder({
      amount: parseFloat(body.amount).toFixed(2),
      currency: body.currency || 'USD',
      description: body.description,
      bundleId: body.bundleId,
      returnUrl: body.returnUrl,
      cancelUrl: body.cancelUrl,
    });

    console.log('PayPal order created:', order.id);

    // Register order with backend API (if backend integration is needed)
    // This can be uncommented when backend API is ready
    /*
    try {
      const backendApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.piratemobile.gg';
      const backendResponse = await fetch(`${backendApiUrl}/order/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paypalOrderId: order.id,
          amount: body.amount,
          bundleName: body.bundleName,
          bundleId: body.bundleId,
          countryName: body.countryName,
          countryIso: body.countryIso,
          bundleAmount: body.bundleAmount,
          bundleDuration: body.bundleDuration,
          unlimited: body.unlimited,
          coupon: body.coupon,
          bundleGroupName: body.bundleGroupName,
          iccid: body.iccid,
        }),
      });

      if (!backendResponse.ok) {
        console.error('Failed to register order with backend API');
      }
    } catch (backendError) {
      console.error('Error registering order with backend:', backendError);
      // Don't fail the entire request if backend registration fails
    }
    */

    return NextResponse.json({
      orderID: order.id,
      id: order.id,
      status: order.status,
      links: order.links,
    });

  } catch (error) {
    console.error('Error creating PayPal order:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Provide more specific error information
    let statusCode = 500;
    let errorMessage = 'Failed to create order';
    
    if (error.message?.includes('credentials')) {
      statusCode = 500;
      errorMessage = 'Payment service configuration error';
    } else if (error.message?.includes('access token')) {
      statusCode = 503;
      errorMessage = 'Payment service temporarily unavailable';
    } else if (error.message?.includes('create order')) {
      statusCode = 502;
      errorMessage = 'Payment gateway error';
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: statusCode }
    );
  }
}

/**
 * OPTIONS /api/paypal/create-order
 * Handle CORS preflight
 */
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

