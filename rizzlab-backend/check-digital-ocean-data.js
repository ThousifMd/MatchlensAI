const { Pool } = require("pg");

// Digital Ocean database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function checkDigitalOceanData() {
    try {
        console.log('🔍 Checking Digital Ocean database data...\n');

        // Check onboarding_submissions table
        console.log('📋 ONBOARDING_SUBMISSIONS TABLE:');
        const onboardingResult = await pool.query(`
      SELECT 
        id,
        name,
        email,
        phone,
        dating_goal,
        style_preference,
        created_at
      FROM onboarding_submissions 
      ORDER BY created_at DESC
      LIMIT 5;
    `);

        console.log(`Found ${onboardingResult.rows.length} onboarding submission(s):\n`);
        onboardingResult.rows.forEach((row, index) => {
            console.log(`--- Onboarding ${index + 1} ---`);
            console.log(`ID: ${row.id}`);
            console.log(`Name: ${row.name}`);
            console.log(`Email: ${row.email}`);
            console.log(`Phone: ${row.phone}`);
            console.log(`Dating Goal: ${row.dating_goal}`);
            console.log(`Style Preference: ${row.style_preference}`);
            console.log(`Date: ${row.created_at}`);
            console.log('');
        });

        // Check payments table
        console.log('💳 PAYMENTS TABLE:');
        const paymentsResult = await pool.query(`
      SELECT 
        id,
        order_id,
        payment_id,
        amount,
        currency,
        package_id,
        package_name,
        customer_email,
        customer_name,
        status,
        created_at
      FROM payments 
      ORDER BY created_at DESC
      LIMIT 5;
    `);

        console.log(`Found ${paymentsResult.rows.length} payment(s):\n`);
        paymentsResult.rows.forEach((payment, index) => {
            console.log(`--- Payment ${index + 1} ---`);
            console.log(`ID: ${payment.id}`);
            console.log(`Order ID: ${payment.order_id}`);
            console.log(`Payment ID: ${payment.payment_id}`);
            console.log(`Amount: $${payment.amount} ${payment.currency}`);
            console.log(`Package: ${payment.package_name} (${payment.package_id})`);
            console.log(`Customer: ${payment.customer_name} (${payment.customer_email})`);
            console.log(`Status: ${payment.status}`);
            console.log(`Payment Date: ${payment.created_at}`);
            console.log('');
        });

        // Show table counts
        console.log('📊 TABLE COUNTS:');
        const onboardingCount = await pool.query('SELECT COUNT(*) FROM onboarding_submissions');
        const paymentsCount = await pool.query('SELECT COUNT(*) FROM payments');

        console.log(`📋 onboarding_submissions: ${onboardingCount.rows[0].count} records`);
        console.log(`💳 payments: ${paymentsCount.rows[0].count} records`);

    } catch (error) {
        console.error('❌ Error checking Digital Ocean data:', error);
    } finally {
        await pool.end();
    }
}

checkDigitalOceanData();
