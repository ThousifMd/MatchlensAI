const { Pool } = require("pg");
require("dotenv").config({ path: "../.env" });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function addNewOnboardingFields() {
    try {
        console.log("🔗 Connecting to DigitalOcean PostgreSQL...");

        const client = await pool.connect();
        console.log("✅ Connected to database successfully!");

        // Add new columns for the updated onboarding questionnaire
        console.log("📋 Adding new onboarding fields...");

        // Add vibe column
        await client.query(`
            ALTER TABLE onboarding_submissions 
            ADD COLUMN IF NOT EXISTS vibe VARCHAR(100);
        `);
        console.log("✅ vibe column added successfully!");

        // Add want_more column
        await client.query(`
            ALTER TABLE onboarding_submissions 
            ADD COLUMN IF NOT EXISTS want_more VARCHAR(100);
        `);
        console.log("✅ want_more column added successfully!");

        // Add one_liner column
        await client.query(`
            ALTER TABLE onboarding_submissions 
            ADD COLUMN IF NOT EXISTS one_liner TEXT;
        `);
        console.log("✅ one_liner column added successfully!");

        // Check if all columns exist
        const result = await client.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'onboarding_submissions' 
            AND column_name IN ('vibe', 'want_more', 'one_liner')
            ORDER BY column_name;
        `);

        console.log("\n📊 New columns status:");
        if (result.rows.length === 3) {
            result.rows.forEach(row => {
                console.log(`✅ ${row.column_name} (${row.data_type}, nullable: ${row.is_nullable})`);
            });
        } else {
            console.log("❌ Some columns may not have been added properly");
            console.log(`Expected 3 columns, found ${result.rows.length}`);
        }

        // Show current table structure
        console.log("\n📋 Current onboarding_submissions table structure:");
        const tableStructure = await client.query(`
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = 'onboarding_submissions' 
            ORDER BY ordinal_position;
        `);

        tableStructure.rows.forEach(row => {
            console.log(`- ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
        });

        client.release();
        await pool.end();

        console.log("\n🎉 Database migration complete!");
        console.log("🚀 The onboarding_submissions table now supports the new fields!");

    } catch (error) {
        console.error("❌ Database migration failed:", error.message);
        process.exit(1);
    }
}

addNewOnboardingFields();
