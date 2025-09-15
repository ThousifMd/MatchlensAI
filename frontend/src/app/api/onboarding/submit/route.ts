import { NextRequest, NextResponse } from 'next/server';

// Helper function to convert File to base64
async function fileToBase64(file: File): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    return buffer.toString('base64');
}

export async function POST(request: NextRequest) {
    try {
        console.log('📝 ONBOARDING SUBMIT ROUTE CALLED - Processing real form data');

        const formData = await request.formData();

        // Extract text fields
        const name = formData.get('name') as string;
        const age = formData.get('age') as string;
        const datingGoal = formData.get('datingGoal') as string;
        const currentMatches = formData.get('currentMatches') as string;
        const bodyType = formData.get('bodyType') as string;
        const stylePreference = formData.get('stylePreference') as string;
        const ethnicity = formData.get('ethnicity') as string;
        const interests = JSON.parse(formData.get('interests') as string);
        const currentBio = formData.get('currentBio') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const weeklyTips = formData.get('weeklyTips') === 'true';

        // Handle original photos
        const originalPhotos = formData.getAll('originalPhotos') as File[];
        const originalPhotoUrls: string[] = [];

        // Handle screenshot photos
        const screenshotPhotos = formData.getAll('screenshotPhotos') as File[];
        const screenshotPhotoUrls: string[] = [];

        // Convert original photos to base64
        console.log(`Converting ${originalPhotos.length} original photos to base64...`);
        for (const photo of originalPhotos) {
            if (photo instanceof File) {
                try {
                    const base64Data = await fileToBase64(photo);
                    originalPhotoUrls.push(base64Data);
                    console.log(`Converted original photo: ${photo.name}`);
                } catch (error) {
                    console.error('Error converting original photo:', error);
                    throw new Error(`Failed to convert original photo: ${photo.name}`);
                }
            }
        }

        // Convert screenshot photos to base64
        console.log(`Converting ${screenshotPhotos.length} screenshot photos to base64...`);
        for (const screenshot of screenshotPhotos) {
            if (screenshot instanceof File) {
                try {
                    const base64Data = await fileToBase64(screenshot);
                    screenshotPhotoUrls.push(base64Data);
                    console.log(`Converted screenshot: ${screenshot.name}`);
                } catch (error) {
                    console.error('Error converting screenshot:', error);
                    throw new Error(`Failed to convert screenshot: ${screenshot.name}`);
                }
            }
        }

        // Prepare data for backend
        const submissionData = {
            name,
            age,
            datingGoal,
            currentMatches,
            bodyType,
            stylePreference,
            ethnicity,
            interests,
            currentBio,
            email,
            phone,
            weeklyTips,
            originalPhotos: originalPhotoUrls,
            screenshotPhotos: screenshotPhotoUrls
        };

        console.log('📊 Real submission data processed:', {
            name: submissionData.name,
            email: submissionData.email,
            originalPhotos: submissionData.originalPhotos.length,
            screenshots: submissionData.screenshotPhotos.length
        });

        // Send to backend API using payments endpoint (since onboarding endpoint doesn't exist)
        const backendUrl = 'https://efficient-cooperation-production-a90a.up.railway.app';
        console.log('🔗 Sending real data to backend:', backendUrl);

        // Create a payment request with real onboarding data
        const paymentData = {
            orderId: "onboarding-" + Date.now(),
            paymentId: "onboarding-" + Date.now(),
            amount: 1.00,
            currency: "USD",
            packageId: "most-matches",
            packageName: "Most Attention",
            customerEmail: submissionData.email,
            customerName: submissionData.name,
            status: "completed",
            onboardingData: submissionData
        };

        console.log('📤 Sending real payment data:', paymentData);

        console.log('🚀 About to make fetch request to:', `${backendUrl}/api/payments/store`);

        const response = await fetch(`${backendUrl}/api/payments/store`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentData),
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
            message: 'Onboarding data sent to backend successfully',
            backendResponse: result,
            data: {
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
