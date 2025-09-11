const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function showLatestData() {
  try {
    console.log("Connecting to database...");
    const client = await pool.connect();
    console.log("Connected successfully!");
    
    const result = await client.query("SELECT * FROM onboarding_submissions ORDER BY created_at DESC");
    
    if (result.rows.length === 0) {
      console.log("No submissions found.");
    } else {
      console.log(`Found ${result.rows.length} submission(s):
`);
      
      result.rows.forEach((row, index) => {
        console.log(`Submission #${index + 1} (ID: ${row.id})`);
        console.log("=" .repeat(40));
        console.log(`Name: ${row.name}`);
        console.log(`Age: ${row.age}`);
        console.log(`Email: ${row.email}`);
        console.log(`Dating Goal: ${row.dating_goal}`);
        console.log(`Body Type: ${row.body_type}`);
        console.log(`Style: ${row.style_preference}`);
        console.log(`Interests: ${JSON.stringify(row.interests)}`);
        console.log(`Created: ${row.created_at}`);
        console.log("");
      });
    }
    
    client.release();
    await pool.end();
    
  } catch (error) {
    console.error("Error:", error.message);
  }
}

showLatestData();
