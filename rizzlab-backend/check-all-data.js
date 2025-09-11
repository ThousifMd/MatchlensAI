const pool = require('./src/config/database');

async function checkAllData() {
    try {
        console.log('🔍 Checking all data in both tables...\n');

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
      LIMIT 3;
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
      LIMIT 3;
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

        // Check if tables exist
        console.log('📊 TABLE STRUCTURE:');
        const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('onboarding_submissions', 'payments')
      ORDER BY table_name;
    `);

        console.log('Available tables:');
        tablesResult.rows.forEach(row => {
            console.log(`- ${row.table_name}`);
        });

    } catch (error) {
        console.error('❌ Error fetching data:', error);
    } finally {
        await pool.end();
    }
}

checkAllData();
