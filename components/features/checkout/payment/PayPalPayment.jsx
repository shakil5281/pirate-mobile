"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import CardPayment from "./CardPayment";
import { Loader2 } from "lucide-react";
import GooglePay from "./GooglePay";
import ApplePay from "./ApplePay";

export default function PayPalPayment({ 
    bundleId, 
    bundleName,
    amount, 
    currency = "USD", 
    onSuccess,
    countryName,
    countryIso,
    dataAmount,
    duration,
    isUnlimited = false
}) {
    const [paid, setPaid] = useState(false);
    const [error, setError] = useState(null);
    const [isPaying, setIsPaying] = useState(false);
    const [showAuthRequired, setShowAuthRequired] = useState(false);
    const router = useRouter();

    const initialOptions = {
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
        currency,
        intent: "capture",
        "enable-funding": "card",
        components: "buttons,funding-eligibility,card-fields,applepay,googlepay",
    };

    const createPayPalOrder = async (_data, actions, method) => {
        setIsPaying(true);
        setError(null);
        let errorHandled = false;
        
        try {
            const response = await fetch("/api/paypal/create-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    amount: parseFloat(amount).toFixed(2),
                    currency: currency,
                    description: `eSIM Package: ${bundleName || 'eSIM Plan'}`,
                    bundleId: bundleId,
                }),
            });

            if (!response.ok) {
                errorHandled = true;
                
                // Extract error details from response
                let errorMessage = "Failed to create PayPal order";
                let errorDetails = null;
                
                try {
                    const errorData = await response.json();
                    errorDetails = errorData;
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch (parseError) {
                    // If response is not JSON, try to get text
                    try {
                        const textError = await response.text();
                        errorDetails = { raw: textError };
                    } catch (textError) {
                        console.error("Could not parse error response");
                    }
                }

                console.error("PayPal order creation failed:", {
                    status: response.status,
                    statusText: response.statusText,
                    error: errorDetails
                });

                if (response.status === 401) {
                    setShowAuthRequired(true);
                    setError("Please sign in to complete your payment");
                    setIsPaying(false);
                    return;
                }

                // Handle different error status codes
                if (response.status === 400) {
                    setError("Invalid payment details. Please check your information and try again.");
                } else if (response.status === 401 || response.status === 403) {
                    setError("Authentication required. Please sign in to complete your payment.");
                } else if (response.status === 502 || response.status === 503) {
                    setError("Payment service temporarily unavailable. Please try again in a moment.");
                } else if (response.status === 500) {
                    setError("Payment service error. Please try again or contact support.");
                } else {
                    setError("Unable to process payment. Please try again or use a different payment method.");
                }
                
                setIsPaying(false);
                toast.error("Payment initialization failed", { position: 'top-center' });
                
                // Return a rejected promise to properly handle error in PayPal SDK
                throw new Error(errorMessage);
            }

            const data = await response.json();
            const paypalOrderId = data?.orderID;

            if (!paypalOrderId) {
                errorHandled = true;
                console.error("Missing PayPal order ID in response:", data);
                setError("Payment initialization incomplete. Please try again.");
                setIsPaying(false);
                toast.error("Payment initialization failed", { position: 'top-center' });
                throw new Error("Missing PayPal order ID.");
            }

            // GTM event tracking
            if (typeof window !== 'undefined' && window.dataLayer) {
                window.dataLayer.push({
                    event: "begin_checkout",
                    ecommerce: {
                        currency: 'USD',
                        value: parseFloat(amount),
                        payment_type: method,
                        items: [
                            {
                                item_id: bundleId,
                                item_name: bundleName,
                                price: amount,
                                quantity: 1,
                                item_category: countryName,
                                item_variant: `${isUnlimited ? 'Unlimited' : `${dataAmount / 1000} GB`} For ${duration} Days`,
                            }
                        ]
                    },
                });
            }

            setIsPaying(false);
            return paypalOrderId;
        } catch (err) {
            setIsPaying(false);
            
            // Don't show error again if we've already handled it above
            if (err.message === "Authentication required") {
                return;
            }
            
            // Only set generic error if we haven't set a specific one above
            if (!errorHandled) {
                console.error("Failed to create PayPal order:", err);
                
                // Handle network errors separately
                if (err instanceof TypeError && err.message?.includes('fetch')) {
                    setError("Network error. Please check your connection and try again.");
                } else if (err.name === 'NetworkError' || err.message?.includes('network')) {
                    setError("Network error. Please check your connection and try again.");
                } else {
                    setError("Failed to create PayPal order. Please try again.");
                }
                
                toast.error("Payment initialization failed", { position: 'top-center' });
            }
            
            // Re-throw to properly handle in PayPal SDK
            throw err;
        }
    };

    const onPayPalApprove = async (data, paymentMethod) => {
        setIsPaying(true);
        const orderId = data?.orderID ? data?.orderID : data;

        try {
            const response = await fetch("/api/paypal/capture-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    orderID: orderId,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to capture payment");
            }

            const capture = await response.json();

            if (capture?.status === "COMPLETED") {
                // GTM event tracking
                if (typeof window !== 'undefined' && window.dataLayer) {
                    window.dataLayer.push({
                        event: "purchase",
                        ecommerce: {
                            transaction_id: capture?.paymentID,
                            value: parseFloat(amount),
                            currency: 'USD',
                            tax: 0.00,
                            shipping: 0.00,
                            payment_type: paymentMethod,
                            payment_status: capture?.status,
                            items: [
                                {
                                    item_id: bundleId,
                                    item_name: bundleName,
                                    price: amount,
                                    quantity: 1,
                                    item_category: countryName,
                                    item_variant: `${isUnlimited ? 'Unlimited' : `${dataAmount / 1000} GB`} For ${duration} Days`,
                                }
                            ]
                        }
                    });
                }

                setPaid(true);
                toast.success("Payment successful!", { position: 'top-center' });
                
                if (onSuccess) {
                    onSuccess(capture);
                } else {
                    router.push(`/checkout/success?orderID=${orderId}&bundleId=${bundleId}`);
                }
                
                return capture;
            } else {
                toast.error("Payment failed!", { position: 'top-center' });
            }
        } catch (err) {
            console.error("Capture error:", err);
            setError("Payment failed. Please try again.");
            toast.error("Payment failed. Please try again.");
        } finally {
            setIsPaying(false);
        }
    };

    return (
        <div className="relative w-full">
            {isPaying && <PaymentFullScreenLoader />}

            {showAuthRequired && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-center">
                    <p className="text-amber-800 text-sm">Please sign in to complete your payment</p>
                </div>
            )}

            <PayPalScriptProvider options={initialOptions}>
                <style dangerouslySetInnerHTML={{__html: `
                    .paypal-button-container iframe,
                    .paypal-button-container div[data-funding-source],
                    .paypal-button-container button {
                        border-radius: 0.5rem !important;
                        overflow: hidden !important;
                    }
                `}} />
                <div className="space-y-4">
                    {/* Payment Buttons Grid - Apple Pay and Google Pay */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Apple Pay */}
                        <div className="w-full">
                            <ApplePay
                                onClick={() => {
                                    // Apple Pay integration will be handled by PayPal SDK
                                    console.log("Apple Pay clicked");
                                }}
                            />
                        </div>

                        {/* Google Pay */}
                        <div className="w-full">
                            <GooglePay
                                onCardCreateOrder={(data, actions) => createPayPalOrder(data, actions, 'googlePay')}
                                onApproved={(data, actions) => onPayPalApprove(data, 'googlePay')}
                                totalAmount={amount}
                                currency={currency}
                            />
                        </div>
                    </div>

                    {/* Card Payment */}
                    <CardPayment
                        paypalCreateOrder={(data, actions) => createPayPalOrder(data, actions, 'card payment')}
                        onApprove={(data, actions) => onPayPalApprove(data, 'card payment')}
                        isPaying={isPaying}
                        setIsPaying={setIsPaying}
                    />
                </div>

                {error && <div className="mt-4 text-sm text-red-500 text-center">{error}</div>}
            </PayPalScriptProvider>
        </div>
    );
}

function PaymentFullScreenLoader() {
    return (
        <div className="fixed inset-0 z-9999 bg-black opacity-50 flex items-center justify-center">
            <div className="text-white text-lg flex flex-col items-center gap-4">
                <Loader2 className="animate-spin w-8 h-8 text-amber-500" />
                <span>Processing your payment...</span>
            </div>
        </div>
    );
}

