const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const OnboardingSubmission = require('../models/OnboardingSubmission');
const { v4: uuidv4 } = require('uuid');

// CORS test endpoint
router.get('/test-cors', (req, res) => {
  res.json({
    success: true,
    message: 'CORS is working!',
    timestamp: new Date().toISOString(),
    origin: req.headers.origin,
    method: req.method
  });
});

// Store payment and onboarding data
router.post('/store', async (req, res) => {
  try {
    console.log('Received payment data:', req.body);

    const {
      orderId,
      paymentId,
      amount,
      currency,
      packageId,
      packageName,
      customerEmail,
      customerName,
      status = "completed",
      onboardingData = {}
    } = req.body;

    // Validate required fields
    if (!orderId || !paymentId || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let onboardingSubmission = null;

    // If onboarding data is provided, create onboarding submission
    if (onboardingData && Object.keys(onboardingData).length > 0) {
      try {
        console.log('Creating onboarding submission with data:', onboardingData);

        // Calculate expected delivery based on package
        const getDeliveryHours = (packageId) => {
          switch (packageId) {
            case 'starter': return 24;
            case 'professional': return 12;
            case 'elite': return 6;
            case 'vip': return 2;
            default: return 24; // Default to 24 hours
          }
        };

        const deliveryHours = getDeliveryHours(packageId);
        const expectedDelivery = new Date();
        expectedDelivery.setHours(expectedDelivery.getHours() + deliveryHours);

        // Use the actual form data instead of hardcoded values
        onboardingSubmission = await OnboardingSubmission.create({
          name: onboardingData.name || customerName || 'Unknown',
          gender: onboardingData.gender || 'not_specified',
          age: onboardingData.age || '25',
          datingGoal: onboardingData.datingGoal || 'relationship',
          currentMatches: onboardingData.currentMatches || '0-2',
          anchorQuestion: onboardingData.anchorQuestion || 'What makes you unique?',
          bodyType: onboardingData.bodyType || 'average',
          stylePreference: onboardingData.stylePreference || 'casual',
          ethnicity: onboardingData.ethnicity || 'other',
          interests: onboardingData.interests || [],
          currentBio: onboardingData.currentBio || '',
          email: onboardingData.email || customerEmail || 'unknown@example.com',
          confirmEmail: onboardingData.confirmEmail || '',
          phone: onboardingData.phone || '',
          weeklyTips: onboardingData.weeklyTips === 'true' || false,
          vibe: onboardingData.vibe || '',
          wantMore: onboardingData.wantMore || '',
          oneLiner: onboardingData.oneLiner || '',
          originalPhotos: onboardingData.originalPhotos || [],
          screenshotPhotos: onboardingData.screenshotPhotos || [],
          expectedDelivery: expectedDelivery
        });

        console.log('Onboarding submission created:', onboardingSubmission.user_id);
      } catch (onboardingError) {
        console.error('Error creating onboarding submission:', onboardingError);
        // Continue with payment even if onboarding fails
      }
    }

    // Generate UUID for payment
    const paymentUuid = uuidv4();

    // Insert payment record into database
    const result = await pool.query(`
      INSERT INTO payments (
        payment_id,
        user_id,
        order_id,
        amount,
        currency,
        package_id,
        package_name,
        customer_email,
        customer_name,
        status,
        onboarding_data,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
      RETURNING payment_id, order_id, amount, created_at;
    `, [
      paymentUuid,
      onboardingSubmission ? onboardingSubmission.user_id : null,
      orderId,
      amount,
      currency || 'USD',
      packageId || null,
      packageName || null,
      customerEmail || null,
      customerName || null,
      status,
      JSON.stringify(onboardingData)
    ]);

    console.log("Payment and onboarding data stored successfully:", result.rows[0]);

    res.json({
      success: true,
      payment: result.rows[0],
      onboardingSubmission: onboardingSubmission ? {
        user_id: onboardingSubmission.user_id,
        name: onboardingSubmission.name,
        email: onboardingSubmission.email
      } : null
    });

  } catch (error) {
    console.error("Error storing payment:", error);
    res.status(500).json({ error: "Failed to store payment" });
  }
});

// Get all payments
router.get('/list', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        payment_id,
        user_id,
        order_id,
        amount,
        currency,
        package_id,
        package_name,
        customer_email,
        customer_name,
        status,
        onboarding_data,
        created_at
      FROM payments 
      ORDER BY created_at DESC
      LIMIT 100;
    `);

    console.log(`Found ${result.rows.length} payments`);

    res.json({
      success: true,
      payments: result.rows,
      count: result.rows.length
    });

  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
});

module.exports = router;
