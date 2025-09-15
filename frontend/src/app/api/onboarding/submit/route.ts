import { NextRequest, NextResponse } from 'next/server';

// Helper function to convert File to base64
async function fileToBase64(file: File): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    return buffer.toString('base64');
}

export async function POST(request: NextRequest) {
    try {
        console.log('🧪 ONBOARDING SUBMIT ROUTE CALLED - Using mock data for testing');

        // Use mock data instead of form data for testing
        const submissionData = {
            name: "Mike",
            age: "25",
            datingGoal: "casual",
            currentMatches: "0-2",
            bodyType: "average",
            stylePreference: "casual",
            ethnicity: "other",
            interests: ["movies", "music"],
            currentBio: "Mock bio for testing",
            email: "mock@test.com",
            phone: "1234567890",
            weeklyTips: true,
            originalPhotos: ["iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="],
            screenshotPhotos: ["iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="]
        };

        console.log('📊 Mock submission data:', submissionData);

        // Send to backend API using payments endpoint (since onboarding endpoint doesn't exist)
        const backendUrl = 'https://efficient-cooperation-production-a90a.up.railway.app';
        console.log('🔗 Sending mock data to backend:', backendUrl);

        // Create a mock payment request to test the backend
        const mockPaymentData = {
            orderId: "mock-onboarding-" + Date.now(),
            paymentId: "mock-onboarding-" + Date.now(),
            amount: 1.00,
            currency: "USD",
            packageId: "most-matches",
            packageName: "Most Attention",
            customerEmail: submissionData.email,
            customerName: submissionData.name,
            status: "completed",
            onboardingData: submissionData
        };

        console.log('📤 Sending mock payment data:', mockPaymentData);

        console.log('🚀 About to make fetch request to:', `${backendUrl}/api/payments/store`);

        const response = await fetch(`${backendUrl}/api/payments/store`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(mockPaymentData),
        }).catch(error => {
            console.error('❌ Fetch error details:', error);
            throw new Error(`Fetch failed: ${error.message}`);
        });

        console.log('📊 Backend response status:', response.status);
        console.log('📊 Backend response ok:', response.ok);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Backend API error:', response.status, errorText);
            throw new Error(`Backend API error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log('✅ Backend response success:', result);

        return NextResponse.json({
            success: true,
            message: 'Mock onboarding data sent to backend successfully',
            backendResponse: result,
            mockData: {
                originalPhotos: submissionData.originalPhotos.length,
                screenshots: submissionData.screenshotPhotos.length
            }
        });

    } catch (error) {
        console.error('Error processing onboarding submission:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to process submission',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
