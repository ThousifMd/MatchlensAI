const pool = require('./src/config/database');

async function checkSchema() {
    try {
        console.log('🔍 Checking database schema and tables...\n');

        // Check current database
        const dbResult = await pool.query('SELECT current_database() as db_name, current_schema() as schema_name;');
        console.log(`📊 Current Database: ${dbResult.rows[0].db_name}`);
        console.log(`📊 Current Schema: ${dbResult.rows[0].schema_name}\n`);

        // List all tables in public schema
        console.log('📋 ALL TABLES IN PUBLIC SCHEMA:');
        const tablesResult = await pool.query(`
      SELECT 
        table_name,
        table_type
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

        if (tablesResult.rows.length === 0) {
            console.log('❌ No tables found in public schema');
        } else {
            console.log(`Found ${tablesResult.rows.length} table(s):`);
            tablesResult.rows.forEach(row => {
                console.log(`- ${row.table_name} (${row.table_type})`);
            });
        }

        // Check if payments table exists
        console.log('\n💳 CHECKING PAYMENTS TABLE:');
        const paymentsCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'payments'
      ) as exists;
    `);

        if (paymentsCheck.rows[0].exists) {
            console.log('✅ payments table exists');

            // Get payments data
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

            console.log(`📊 Found ${paymentsResult.rows.length} payment(s):\n`);
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
        } else {
            console.log('❌ payments table does not exist');
        }

        // Check all schemas
        console.log('🔍 ALL SCHEMAS:');
        const schemasResult = await pool.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
      ORDER BY schema_name;
    `);

        console.log('Available schemas:');
        schemasResult.rows.forEach(row => {
            console.log(`- ${row.schema_name}`);
        });

    } catch (error) {
        console.error('❌ Error checking schema:', error);
    } finally {
        await pool.end();
    }
}

checkSchema();
