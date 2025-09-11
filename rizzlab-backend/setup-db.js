const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const schemaSQL = `
-- Create onboarding_submissions table
CREATE TABLE IF NOT EXISTS onboarding_submissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  age VARCHAR(10) NOT NULL,
  dating_goal VARCHAR(50) NOT NULL,
  current_matches VARCHAR(20) NOT NULL,
  body_type VARCHAR(50) NOT NULL,
  style_preference VARCHAR(50) NOT NULL,
  ethnicity VARCHAR(100),
  interests JSONB NOT NULL,
  current_bio TEXT,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  weekly_tips BOOLEAN DEFAULT true,
  original_photos JSONB,
  screenshot_photos JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_onboarding_submissions_email ON onboarding_submissions(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_onboarding_submissions_created_at ON onboarding_submissions(created_at);
`;

async function setupDatabase() {
  try {
    console.log("🔗 Connecting to DigitalOcean PostgreSQL...");

    // Test connection
    const client = await pool.connect();
    console.log("✅ Connected to database successfully!");

    // Run schema
    console.log("📋 Setting up database schema...");
    await client.query(schemaSQL);
    console.log("✅ Database schema created successfully!");

    // Check if table exists
    const result = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'onboarding_submissions'
      );
    `);

    if (result.rows[0].exists) {
      console.log("✅ onboarding_submissions table exists!");
    } else {
      console.log("❌ Table creation failed");
    }

    client.release();
    await pool.end();

    console.log("🎉 Database setup complete!");
    console.log("🚀 You can now start the backend server with: npm run dev");

  } catch (error) {
    console.error("❌ Database setup failed:", error.message);
    process.exit(1);
  }
}

setupDatabase();
