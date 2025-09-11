const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function checkLatestRecords() {
    try {
        console.log('🔍 Checking latest records from Digital Ocean database...\n');

        // Check payments table
        console.log('💳 Latest payments:');
        const paymentsResult = await pool.query(`
      SELECT * FROM payments 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

        if (paymentsResult.rows.length > 0) {
            paymentsResult.rows.forEach((payment, index) => {
                console.log(`\n${index + 1}. Payment ID: ${payment.id}`);
                console.log(`   Order ID: ${payment.order_id}`);
                console.log(`   Amount: $${payment.amount}`);
                console.log(`   Package: ${payment.package_name}`);
                console.log(`   Customer: ${payment.customer_name} (${payment.customer_email})`);
                console.log(`   Status: ${payment.status}`);
                console.log(`   Created: ${payment.created_at}`);
                if (payment.onboarding_data) {
                    console.log(`   Onboarding Data: ${JSON.stringify(payment.onboarding_data, null, 2)}`);
                }
            });
        } else {
            console.log('   No payments found');
        }

        console.log('\n' + '='.repeat(50) + '\n');

        // Check onboarding_submissions table
        console.log('📋 Latest onboarding submissions:');
        const onboardingResult = await pool.query(`
      SELECT * FROM onboarding_submissions 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

        if (onboardingResult.rows.length > 0) {
            onboardingResult.rows.forEach((submission, index) => {
                console.log(`\n${index + 1}. Submission ID: ${submission.id}`);
                console.log(`   Name: ${submission.name}`);
                console.log(`   Email: ${submission.email}`);
                console.log(`   Age: ${submission.age}`);
                console.log(`   Dating Goal: ${submission.dating_goal}`);
                console.log(`   Created: ${submission.created_at}`);
            });
        } else {
            console.log('   No onboarding submissions found');
        }

        // Get total counts
        console.log('\n' + '='.repeat(50) + '\n');
        console.log('📊 Database Summary:');

        const paymentsCount = await pool.query('SELECT COUNT(*) FROM payments');
        const onboardingCount = await pool.query('SELECT COUNT(*) FROM onboarding_submissions');

        console.log(`   Total payments: ${paymentsCount.rows[0].count}`);
        console.log(`   Total onboarding submissions: ${onboardingCount.rows[0].count}`);

    } catch (error) {
        console.error('❌ Error checking records:', error);
    } finally {
        await pool.end();
    }
}

checkLatestRecords();
