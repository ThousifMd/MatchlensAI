const { Pool } = require("pg");
require("dotenv").config();

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function showLatestData() {
  try {
    console.log('🔍 Fetching latest onboarding submissions...\n');
    
    // Get the latest 5 submissions
    const result = await pool.query(`
      SELECT 
        id,
        name,
        gender,
        age,
        dating_goal,
        current_matches,
        body_type,
        style_preference,
        email,
        phone,
        ethnicity,
        interests,
        current_bio,
        weekly_tips,
        jsonb_array_length(original_photos) as photo_count,
        jsonb_array_length(screenshot_photos) as screenshot_count,
        created_at
      FROM onboarding_submissions 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    if (result.rows.length === 0) {
      console.log('❌ No submissions found in the database.');
      return;
    }

    console.log(`📊 Found ${result.rows.length} submission(s):\n`);

    result.rows.forEach((row, index) => {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`📝 SUBMISSION #${index + 1} (ID: ${row.id})`);
      console.log(`${'='.repeat(60)}`);
      
      console.log(`👤 Name: ${row.name}`);
      console.log(`🚻 Gender: ${row.gender || 'Not specified'}`);
      console.log(`📅 Age: ${row.age}`);
      console.log(`💕 Dating Goal: ${row.dating_goal}`);
      console.log(`📈 Current Matches: ${row.current_matches}`);
      console.log(`💪 Body Type: ${row.body_type}`);
      console.log(`🎨 Style Preference: ${row.style_preference}`);
      console.log(`📧 Email: ${row.email}`);
      console.log(`📱 Phone: ${row.phone || 'Not provided'}`);
      console.log(`🌍 Ethnicity: ${row.ethnicity || 'Not specified'}`);
      console.log(`📸 Photos: ${row.photo_count} original, ${row.screenshot_count} screenshots`);
      console.log(`📝 Bio: ${row.current_bio || 'Not provided'}`);
      console.log(`📬 Weekly Tips: ${row.weekly_tips ? 'Yes' : 'No'}`);
      console.log(`⏰ Submitted: ${new Date(row.created_at).toLocaleString()}`);
      
      if (row.interests && row.interests.length > 0) {
        console.log(`🎯 Interests: ${row.interests.join(', ')}`);
      }
    });

    // Get total count
    const countResult = await pool.query('SELECT COUNT(*) as total FROM onboarding_submissions');
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📈 TOTAL SUBMISSIONS IN DATABASE: ${countResult.rows[0].total}`);
    console.log(`${'='.repeat(60)}`);

  } catch (error) {
    console.error('❌ Error fetching data:', error.message);
  } finally {
    await pool.end();
  }
}

showLatestData();
