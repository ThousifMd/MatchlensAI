"use client";

import { useState, useEffect } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

// Custom styles for PayPal buttons
const paypalStyles = `
  .paypal-button-container {
    width: 100% !important;
    max-width: 600px !important;
    margin: 0 auto !important;
  }
  
  .paypal-button-container > div {
    width: 100% !important;
    border-radius: 12px !important;
    overflow: hidden !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  }
  
  .paypal-button-container button {
    border-radius: 12px !important;
    margin: 0 !important;
    height: 48px !important;
    font-weight: 600 !important;
    transition: all 0.2s ease !important;
  }
  
  .paypal-button-container button:hover {
    transform: translateY(-1px) !important;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2) !important;
  }
`;

interface SimplePayPalCheckoutProps {
    selectedPackage?: {
        id: string;
        name: string;
        price: number;
    };
    showNotification?: (type: 'success' | 'error' | 'info', message: string) => void;
    onPaymentSuccess?: () => void;
    onboardingFormData?: any;
}

export default function SimplePayPalCheckout({ selectedPackage, showNotification, onPaymentSuccess, onboardingFormData }: SimplePayPalCheckoutProps) {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({});

    // Debug: Check if PayPal client ID is available
    useEffect(() => {
        console.log('PayPal Client ID:', process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID);
        console.log('PayPal Client ID exists:', !!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID);
    }, []);
    const handleNotification = (type: 'success' | 'error' | 'info', message: string) => {
        if (showNotification) {
            showNotification(type, message);
        }
    };

    const storePaymentAndOnboarding = async (paymentDetails: any) => {
        try {
            // Hardcoded to $1.00 for testing
            const actualAmountPaid = "1.00";

            // Use passed form data or fallback to localStorage
            let formDataToUse = onboardingFormData;

            if (!formDataToUse) {
                const storedFormData = localStorage.getItem('onboardingFormData');
                if (storedFormData) {
                    formDataToUse = JSON.parse(storedFormData);
                }
            }

            // Retrieve photos from window object (stored separately to avoid localStorage quota issues)
            let originalPhotos: any[] = [];
            let screenshotPhotos: any[] = [];

            if (typeof window !== 'undefined') {
                const windowAny = window as any;
                originalPhotos = windowAny.onboardingPhotos || [];
                screenshotPhotos = windowAny.onboardingScreenshots || [];
            }

            console.log('📸 Retrieved photos:', {
                originalPhotos: originalPhotos.length,
                screenshotPhotos: screenshotPhotos.length
            });

            // Convert File objects to base64 for upload
            const convertFilesToBase64 = async (files: File[]): Promise<string[]> => {
                const base64Promises = files.map(file => {
                    return new Promise<string>((resolve) => {
                        const reader = new FileReader();
                        reader.onload = () => {
                            const result = reader.result as string;
                            // Remove data URL prefix to get just base64
                            const base64 = result.split(',')[1];
                            resolve(base64);
                        };
                        reader.readAsDataURL(file);
                    });
                });
                return Promise.all(base64Promises);
            };

            // Convert photos to base64
            const originalPhotosBase64 = await convertFilesToBase64(originalPhotos);
            const screenshotPhotosBase64 = await convertFilesToBase64(screenshotPhotos);

            // Add photos to form data
            formDataToUse = {
                ...formDataToUse,
                originalPhotos: originalPhotosBase64,
                screenshotPhotos: screenshotPhotosBase64
            };

            // STEP 1: Store payment data with complete form data
            const paymentData = {
                orderId: paymentDetails.id,
                paymentId: paymentDetails.id,
                amount: parseFloat(actualAmountPaid), // Use the actual amount paid
                currency: 'USD',
                packageId: selectedPackage?.id,
                packageName: selectedPackage?.name || 'Payment',
                customerEmail: formDataToUse?.email || '',
                customerName: formDataToUse?.name || '',
                status: 'completed',
                onboardingData: formDataToUse // Send the complete form data
            };

            console.log("Sending payment data to backend:", paymentData);
            console.log("🔍 Frontend is about to call /api/payments/store");

            const paymentResponse = await fetch('https://efficient-cooperation-production-a90a.up.railway.app/api/payments/store', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData)
            });

            console.log("📊 Payment response status:", paymentResponse.status);
            console.log("📊 Payment response ok:", paymentResponse.ok);

            if (!paymentResponse.ok) {
                const errorText = await paymentResponse.text();
                console.error("❌ Payment response error:", errorText);
                throw new Error(`Failed to store payment: ${paymentResponse.statusText} - ${errorText}`);
            }

            const paymentResult = await paymentResponse.json();
            console.log("✅ Payment stored successfully:", paymentResult);

            // Clear stored data after successful payment
            localStorage.removeItem('onboardingFormData');
            if (typeof window !== 'undefined') {
                delete (window as any).onboardingPhotos;
                delete (window as any).onboardingScreenshots;
            }

            handleNotification("success", "Payment successful! Your data has been saved to the database.");
        } catch (error) {
            console.error("Error storing payment:", error);
            handleNotification("error", "Payment successful but failed to save data. Please contact support.");
        }
    };



    const handleStartPayment = () => {
        setShowForm(true);
    };


    // Auto-start payment process to reduce friction
    useEffect(() => {
        if (!showForm) {
            handleStartPayment();
        }
    }, [showForm]);

    return (
        <div className="w-full max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-2 text-center text-white">Complete Your Order</h2>
            <p className="text-white/70 mb-6 text-center">
                {selectedPackage ? `${selectedPackage.name}: $1.00 (Testing)` : 'Payment: $1.00 (Testing)'}
            </p>

            {/* PayPal Integration */}
            <div className="mt-6 p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl">
                <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-white">Complete Payment</h3>
                </div>
                <p className="text-white/70 mb-6 text-center text-sm">Secure payment powered by PayPal</p>

                <div className="space-y-3">
                    <style dangerouslySetInnerHTML={{ __html: paypalStyles }} />
                    <div className="paypal-button-container">
                        {(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "Aa3Qhzd--_8MNtB9U8LctWUzDXw3eO7XPw2cyHUzwa9e_sYlD1pXnQK_K3iXNIXD2i64F8AUfPiWL-AT") ? (
                            <PayPalScriptProvider
                                options={{
                                    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "Aa3Qhzd--_8MNtB9U8LctWUzDXw3eO7XPw2cyHUzwa9e_sYlD1pXnQK_K3iXNIXD2i64F8AUfPiWL-AT",
                                    currency: "USD",
                                    intent: "capture"
                                }}
                            >
                                <PayPalButtons
                                    createOrder={async (data, actions) => {
                                        try {
                                            console.log('🔄 Creating PayPal order via server...');
                                            console.log('📦 Package data:', { selectedPackage, amount: "1.00" });

                                            const orderData = {
                                                amount: "1.00",
                                                description: selectedPackage?.name || "Test Payment",
                                                packageId: selectedPackage?.id,
                                                packageName: selectedPackage?.name
                                            };

                                            console.log('📡 Sending request to server:', orderData);

                                            const response = await fetch('/api/paypal/create-order', {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                },
                                                body: JSON.stringify(orderData)
                                            });

                                            console.log('📊 Response status:', response.status);
                                            console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));

                                            const responseText = await response.text();
                                            console.log('📄 Raw response body:', responseText);

                                            if (!response.ok) {
                                                throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`);
                                            }

                                            let result;
                                            try {
                                                result = JSON.parse(responseText);
                                            } catch (parseError) {
                                                console.error('❌ JSON parse error:', parseError);
                                                throw new Error(`Invalid JSON response: ${responseText}`);
                                            }

                                            console.log('📋 Parsed response:', result);

                                            if (!result.success) {
                                                throw new Error(result.message || 'Failed to create order');
                                            }

                                            if (!result.orderId) {
                                                console.error('❌ No orderId in response:', result);
                                                throw new Error('No order ID in response');
                                            }

                                            console.log('✅ Server-side order created:', result.orderId);
                                            return result.orderId;
                                        } catch (error) {
                                            console.error('❌ Error creating order:', error);
                                            throw error;
                                        }
                                    }}
                                    onApprove={async (data, actions) => {
                                        console.log("✅ Order approved:", data.orderID);
                                        console.log("🔄 Starting payment capture...");

                                        try {
                                            // Use PayPal's recommended approach
                                            if (actions.order) {
                                                const details = await actions.order.capture();
                                                console.log("✅ Payment captured successfully:", details);

                                                // Store payment details AND onboarding data in database
                                                await storePaymentAndOnboarding(details);

                                                handleNotification("success", "Payment successful! Order ID: " + details.id);

                                                // Call the payment success callback
                                                if (onPaymentSuccess) {
                                                    console.log('🚀 Calling onPaymentSuccess callback!');
                                                    onPaymentSuccess();
                                                } else {
                                                    console.log('❌ onPaymentSuccess callback not provided!');
                                                }
                                            } else {
                                                throw new Error("PayPal order actions not available");
                                            }
                                        } catch (error) {
                                            console.error("❌ Payment capture failed:", error);
                                            handleNotification("error", "Payment capture failed: " + (error instanceof Error ? error.message : "Unknown error"));
                                        }
                                    }}
                                    onError={(err) => {
                                        console.error("PayPal error:", err);
                                        handleNotification("error", "PayPal error: " + JSON.stringify(err));
                                    }}
                                    onCancel={(data) => {
                                        console.log("Payment cancelled:", data);
                                        handleNotification("info", "Payment was cancelled");
                                    }}
                                />
                            </PayPalScriptProvider>
                        ) : (
                            <div className="text-center p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                                <p className="text-red-400 text-sm">
                                    PayPal configuration error. Please check environment variables.
                                </p>
                                <p className="text-red-300 text-xs mt-1">
                                    Client ID: Missing - Using fallback
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
