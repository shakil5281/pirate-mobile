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
 * Capture PayPal order
 */
async function captureOrder(orderID) {
  const accessToken = await generateAccessToken();

  const response = await fetch(
    `${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to capture order: ${JSON.stringify(error)}`);
  }

  const capture = await response.json();
  return capture;
}

/**
 * Get order details
 */
async function getOrderDetails(orderID) {
  const accessToken = await generateAccessToken();

  const response = await fetch(
    `${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to get order details: ${JSON.stringify(error)}`);
  }

  const order = await response.json();
  return order;
}

/**
 * POST /api/paypal/capture-order
 * Capture a PayPal order and update backend
 */
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.orderID) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Capture the order from PayPal
    const captureData = await captureOrder(body.orderID);

    console.log('PayPal order captured:', captureData.id);

    // Extract payment details
    const purchaseUnit = captureData.purchase_units?.[0];
    const payment = purchaseUnit?.payments?.captures?.[0];

    // Update backend with capture status (if backend integration is needed)
    // This can be uncommented when backend API is ready
    /*
    try {
      const backendApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.piratemobile.gg';
      const backendResponse = await fetch(`${backendApiUrl}/order/capture-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: body.orderID,
        }),
      });

      if (!backendResponse.ok) {
        console.error('Failed to update order status on backend API');
      }
    } catch (backendError) {
      console.error('Error updating backend order status:', backendError);
      // Don't fail if backend update fails
    }
    */

    return NextResponse.json({
      orderID: captureData.id,
      orderId: captureData.id,
      status: captureData.status,
      paymentID: payment?.id,
      amount: payment?.amount,
      payer: captureData.payer,
      create_time: captureData.create_time,
      update_time: captureData.update_time,
      transaction: {
        id: payment?.id,
        status: captureData.status,
      },
      captureData: captureData,
    });

  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    return NextResponse.json(
      { 
        error: 'Failed to capture order',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/paypal/capture-order?orderID=xxx
 * Get order details
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderID = searchParams.get('orderID');
    
    if (!orderID) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Get order details
    const orderDetails = await getOrderDetails(orderID);

    return NextResponse.json({
      orderID: orderDetails.id,
      status: orderDetails.status,
      amount: orderDetails.purchase_units?.[0]?.amount,
      payer: orderDetails.payer,
      orderDetails: orderDetails,
    });

  } catch (error) {
    console.error('Error getting PayPal order details:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get order details',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS /api/paypal/capture-order
 * Handle CORS preflight
 */
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

