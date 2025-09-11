const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkPhotos() {
  try {
    console.log("Connecting to database...");
    const client = await pool.connect();
    console.log("Connected successfully!");
    
    // Get detailed data including photos
    const result = await client.query("SELECT id, name, email, original_photos, screenshot_photos, created_at FROM onboarding_submissions ORDER BY created_at DESC");
    
    if (result.rows.length === 0) {
      console.log("No submissions found.");
    } else {
      console.log(`Found ${result.rows.length} submission(s):
`);
      
      result.rows.forEach((row, index) => {
        console.log(`Submission #${index + 1} (ID: ${row.id})`);
        console.log("=" .repeat(40));
        console.log(`Name: ${row.name}`);
        console.log(`Email: ${row.email}`);
        console.log(`Original Photos Type: ${typeof row.original_photos}`);
        console.log(`Original Photos: ${JSON.stringify(row.original_photos, null, 2)}`);
        console.log(`Screenshot Photos Type: ${typeof row.screenshot_photos}`);
        console.log(`Screenshot Photos: ${JSON.stringify(row.screenshot_photos, null, 2)}`);
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

checkPhotos();
