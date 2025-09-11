const pool = require('./src/config/database');

async function checkPayments() {
    try {
        console.log('🔍 Checking latest payments...\n');

        // Get all payments ordered by most recent first
        const result = await pool.query(`
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
        onboarding_data,
        created_at
      FROM payments 
      ORDER BY created_at DESC
      LIMIT 5;
    `);

        console.log(`📊 Found ${result.rows.length} payment(s):\n`);

        result.rows.forEach((payment, index) => {
            console.log(`--- Payment ${index + 1} ---`);
            console.log(`ID: ${payment.id}`);
            console.log(`Order ID: ${payment.order_id}`);
            console.log(`Payment ID: ${payment.payment_id}`);
            console.log(`Amount: $${payment.amount} ${payment.currency}`);
            console.log(`Package: ${payment.package_name} (${payment.package_id})`);
            console.log(`Customer: ${payment.customer_name} (${payment.customer_email})`);
            console.log(`Status: ${payment.status}`);
            console.log(`Date: ${payment.created_at}`);

            if (payment.onboarding_data) {
                console.log('\n📝 Onboarding Data:');
                console.log(JSON.stringify(payment.onboarding_data, null, 2));
            }
            console.log('\n');
        });

    } catch (error) {
        console.error('❌ Error fetching payments:', error);
    } finally {
        await pool.end();
    }
}

checkPayments();
