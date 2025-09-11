const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log("✅ Database connection successful!");
    const result = await client.query("SELECT NOW()");
    console.log("✅ Query successful:", result.rows[0]);
    client.release();
    await pool.end();
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
  }
}

testConnection();
