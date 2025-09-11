const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function addAnchorQuestionColumn() {
    try {
        console.log("🔗 Connecting to DigitalOcean PostgreSQL...");

        const client = await pool.connect();
        console.log("✅ Connected to database successfully!");

        // Add anchor_question column
        console.log("📋 Adding anchor_question column...");
        await client.query(`
      ALTER TABLE onboarding_submissions 
      ADD COLUMN IF NOT EXISTS anchor_question VARCHAR(100);
    `);
        console.log("✅ anchor_question column added successfully!");

        // Check if column exists
        const result = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'onboarding_submissions' 
      AND column_name = 'anchor_question';
    `);

        if (result.rows.length > 0) {
            console.log("✅ anchor_question column exists!");
        } else {
            console.log("❌ Column addition failed");
        }

        client.release();
        await pool.end();

        console.log("🎉 Database migration complete!");

    } catch (error) {
        console.error("❌ Database migration failed:", error.message);
        process.exit(1);
    }
}

addAnchorQuestionColumn();
