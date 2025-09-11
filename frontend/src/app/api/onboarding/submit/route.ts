import { NextRequest, NextResponse } from 'next/server';

// Helper function to convert File to base64
async function fileToBase64(file: File): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    return buffer.toString('base64');
}

export async function POST(request: NextRequest) {
    try {
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

        // Send to backend API
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:5001';
        console.log('Sending data to backend:', backendUrl);

        const response = await fetch(`${backendUrl}/api/onboarding/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(submissionData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Backend API error:', response.status, errorText);
            throw new Error(`Backend API error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log('Backend response:', result);

        return NextResponse.json({
            success: true,
            submissionId: result.submissionId,
            message: 'Onboarding submitted successfully',
            photoCount: {
                original: originalPhotoUrls.length,
                screenshots: screenshotPhotoUrls.length
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
