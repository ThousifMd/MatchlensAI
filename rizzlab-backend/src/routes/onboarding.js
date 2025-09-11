const express = require("express");
const router = express.Router();
const OnboardingSubmission = require("../models/OnboardingSubmission");
const { validateOnboardingSubmission } = require("../middleware/validation");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Get all submissions
router.get("/", async (req, res) => {
  try {
    const submissions = await OnboardingSubmission.findAll();

    res.json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch submissions"
    });
  }
});

// Submit new onboarding
router.post("/submit", async (req, res) => {
  try {
    console.log('=== SUBMISSION REQUEST RECEIVED ===');
    console.log('Request headers:', req.headers);
    console.log('Request body type:', typeof req.body);
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    // Handle FormData
    const formData = req.body;

    console.log('Parsed formData:', JSON.stringify(formData, null, 2));

    // Check if formData exists
    if (!formData) {
      console.log('ERROR: No formData received');
      return res.status(400).json({
        success: false,
        error: "No form data received"
      });
    }

    // Validate required fields
    const { name, gender, age, datingGoal, currentMatches, anchorQuestion, bodyType, stylePreference, email, interests } = formData;

    if (!name || !age || !datingGoal || !currentMatches || !bodyType || !stylePreference || !email) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
        required: ["name", "age", "datingGoal", "currentMatches", "bodyType", "stylePreference", "email"]
      });
    }

    // Handle photo uploads
    const photoUrls = [];
    const screenshotUrls = [];

    // Also handle base64 data if sent separately
    if (formData.originalPhotos) {
      try {
        const originalPhotos = JSON.parse(formData.originalPhotos);
        for (const base64Data of originalPhotos) {
          try {
            const result = await new Promise((resolve, reject) => {
              cloudinary.uploader.upload(
                base64Data,
                {
                  folder: 'rizzlab-onboarding',
                  resource_type: 'auto',
                  transformation: [
                    { width: 800, height: 800, crop: 'limit' },
                    { quality: 'auto:good' }
                  ]
                },
                (error, result) => {
                  if (error) reject(error);
                  else resolve(result);
                }
              );
            });

            photoUrls.push(result.secure_url);
          } catch (uploadError) {
            console.error('Error uploading base64 to Cloudinary:', uploadError);
          }
        }
      } catch (parseError) {
        console.error('Error parsing originalPhotos:', parseError);
      }
    }

    if (formData.screenshotPhotos) {
      try {
        const screenshotPhotos = JSON.parse(formData.screenshotPhotos);
        for (const base64Data of screenshotPhotos) {
          try {
            const result = await new Promise((resolve, reject) => {
              cloudinary.uploader.upload(
                base64Data,
                {
                  folder: 'rizzlab-onboarding-screenshots',
                  resource_type: 'auto',
                  transformation: [
                    { width: 800, height: 800, crop: 'limit' },
                    { quality: 'auto:good' }
                  ]
                },
                (error, result) => {
                  if (error) reject(error);
                  else resolve(result);
                }
              );
            });

            screenshotUrls.push(result.secure_url);
          } catch (uploadError) {
            console.error('Error uploading screenshot to Cloudinary:', uploadError);
          }
        }
      } catch (parseError) {
        console.error('Error parsing screenshotPhotos:', parseError);
      }
    }

    // Prepare submission data
    const submissionData = {
      name,
      gender: gender || 'not_specified',
      age,
      datingGoal,
      currentMatches,
      anchorQuestion: anchorQuestion || 'What makes you unique?',
      bodyType,
      stylePreference,
      email,
      confirmEmail: formData.confirmEmail || '',
      interests: JSON.parse(interests || '[]'),
      originalPhotos: photoUrls,
      screenshotPhotos: screenshotUrls,
      currentBio: formData.currentBio || '',
      phone: formData.phone || '',
      weeklyTips: formData.weeklyTips === 'true',
      vibe: formData.vibe || '',
      wantMore: formData.wantMore || '',
      oneLiner: formData.oneLiner || ''
    };

    const submission = await OnboardingSubmission.create(submissionData);

    res.status(201).json({
      success: true,
      submissionId: submission.id,
      message: "Onboarding submitted successfully",
      data: {
        id: submission.id,
        name: submission.name,
        email: submission.email,
        createdAt: submission.created_at
      }
    });
  } catch (error) {
    console.error("Error creating submission:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process submission",
      details: error.message
    });
  }
});



module.exports = router;
